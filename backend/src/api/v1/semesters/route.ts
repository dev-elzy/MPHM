import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { semesters } from '@/db/schema/semesters';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateQueryParams, validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


const queryParamsSchema = z.object({
  academicYearId: z.string().min(1, 'ID tahun ajaran tidak valid').optional(),
});

const createSemesterSchema = z.object({
  academicYearId: z.string().min(1, 'ID tahun ajaran wajib diisi'),
  name: z.string().min(1, 'Nama semester wajib diisi'),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  status: z.enum(['Draft', 'Active', 'Completed']).optional().default('Draft'),
});

// GET /api/v1/semesters
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const valParams = validateQueryParams(request.url, queryParamsSchema);
    if (!valParams.success) {
      return valParams.errorResponse;
    }

    const { academicYearId } = valParams.data;
    const db = getDb();

    const conditions = [
      eq(academicYears.institutionId, session.institutionId),
      notDeleted(academicYears),
    ];

    if (academicYearId) {
      conditions.push(eq(semesters.academicYearId, academicYearId));
    }

    const items = await db
      .select({
        id: semesters.id,
        academicYearId: semesters.academicYearId,
        name: semesters.name,
        type: semesters.type,
        startDate: semesters.startDate,
        endDate: semesters.endDate,
        isActive: semesters.isActive,
        status: semesters.status,
        academicYearName: academicYears.name,
      })
      .from(semesters)
      .innerJoin(academicYears, eq(semesters.academicYearId, academicYears.id))
      .where(and(...conditions))
      .orderBy(semesters.name);

    return apiSuccess(items, 'Berhasil mengambil daftar semester');

  } catch (error) {
    console.error('GET semesters error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// POST /api/v1/semesters
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk membuat data semester', 403);
    }

    const valResult = await validateBody(request, createSemesterSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const data = valResult.data;
    const db = getDb();
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;

    // Verify academic year belongs to user's institution
    const ayResult = await db
      .select({ id: academicYears.id, name: academicYears.name, status: academicYears.status })
      .from(academicYears)
      .where(
        and(
          eq(academicYears.id, data.academicYearId),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(academicYears)
        )
      )
      .limit(1);

    const ay = ayResult[0];
    if (!ay) {
      return apiError('Tahun ajaran tidak ditemukan', 404);
    }

    if (ay.status?.toLowerCase() === 'archived') {
      return apiError('Tahun ajaran yang diarsipkan tidak dapat ditambah semester', 400);
    }

    const lowerName = data.name.toLowerCase();
    const type = lowerName.includes('genap') || lowerName.includes('ii') || lowerName.includes('2') ? 'genap' : 'ganjil';
    const id = crypto.randomUUID();
    const isActive = data.status === 'Active';

    await db.transaction(async (tx) => {
      if (isActive) {
        await tx
          .update(semesters)
          .set({
            isActive: false,
            updatedAt: new Date(),
            updatedBy: session.userId,
          })
          .where(eq(semesters.academicYearId, data.academicYearId));
      }

      await tx.insert(semesters).values({
        id,
        academicYearId: data.academicYearId,
        name: data.name,
        type,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive,
        status: data.status,
        createdAt: new Date(),
        createdBy: session.userId,
        updatedAt: new Date(),
        updatedBy: session.userId,
      });
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'semester',
        action: 'create',
        entityId: id,
        entityType: 'semester',
        newData: data,
        description: `Semester "${data.name}" ditambahkan pada Tahun Ajaran ${ay.name}`,
        institutionId: session.institutionId,
      });
    }

    const createdSemester = {
      id,
      academicYearId: data.academicYearId,
      name: data.name,
      type,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive,
      status: data.status,
      academicYearName: ay.name,
    };

    return apiSuccess(createdSemester, 'Semester berhasil ditambahkan', 201);
  } catch (error) {
    console.error('POST semester error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}


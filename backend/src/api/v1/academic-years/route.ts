import { z } from 'zod';
import { eq, sql, and, like } from 'drizzle-orm';
import { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { getDb } from '@/db/client';
import { academicYears } from '@/db/schema/academic-years';
import { semesters } from '@/db/schema/semesters';
import { getSession } from '@/lib/auth/session';
import { validateBody, validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { getPaginationParams, getPaginationMeta, getOrderByExpression } from '@/lib/api/pagination';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


// Validation Schemas
const createYearSchema = z.object({
  name: z.string().min(4, 'Nama tahun ajaran minimal 4 karakter (misal: 2026/2027)'),
  startDate: z.string().min(10, 'Format tanggal mulai salah'),
  endDate: z.string().min(10, 'Format tanggal selesai salah'),
  description: z.string().optional(),
});

const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
});

// GET /api/v1/academic-years
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // 1. Parse pagination and query parameters
    const valParams = validateQueryParams(request.url, queryParamsSchema);
    if (!valParams.success) {
      return valParams.errorResponse;
    }

    const { search, status } = valParams.data;
    const { page, limit, offset, sortBy, order } = getPaginationParams(request.url, 'name', 25);

    const db = getDb();

    // 2. Build where conditions
    const conditions = [
      eq(academicYears.institutionId, session.institutionId),
      notDeleted(academicYears),
    ];

    if (search) {
      conditions.push(like(academicYears.name, `%${search}%`));
    }
    if (status) {
      conditions.push(eq(academicYears.status, status));
    }

    const finalCondition = and(...conditions);

    // 3. Query total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(academicYears)
      .where(finalCondition);
    
    const totalItems = countResult[0]?.count || 0;

    // 4. Query items
    // Safely map sort field to table column
    let sortColumn: AnySQLiteColumn = academicYears.name as AnySQLiteColumn;
    if (sortBy === 'createdAt') sortColumn = academicYears.createdAt as AnySQLiteColumn;
    else if (sortBy === 'startDate') sortColumn = academicYears.startDate as AnySQLiteColumn;
    else if (sortBy === 'endDate') sortColumn = academicYears.endDate as AnySQLiteColumn;
    else if (sortBy === 'status') sortColumn = academicYears.status as AnySQLiteColumn;

    const items = await db
      .select()
      .from(academicYears)
      .where(finalCondition)
      .orderBy(getOrderByExpression(sortColumn, order))
      .limit(limit)
      .offset(offset);

    // Retrieve semesters for returned year IDs to satisfy nested data rendering
    let itemsWithSemesters: unknown[] = [];
    if (items.length > 0) {
      const { inArray } = await import('drizzle-orm');
      const yearIds = items.map(y => y.id);
      const allSemesters = await db
        .select()
        .from(semesters)
        .where(inArray(semesters.academicYearId, yearIds));

      itemsWithSemesters = items.map(year => ({
        ...year,
        semesters: allSemesters.filter(s => s.academicYearId === year.id),
      }));
    }

    return apiSuccess({
      items: itemsWithSemesters,
      meta: getPaginationMeta(totalItems, page, limit),
    }, 'Berhasil mengambil daftar tahun ajaran');

  } catch (error) {
    console.error('GET academic years error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// POST /api/v1/academic-years
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin, admin, and operator can create
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk membuat tahun ajaran', 403);
    }

    const valResult = await validateBody(request, createYearSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { name, startDate, endDate, description } = valResult.data;

    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Check duplicate name within the same institution
    const duplicate = await db
      .select()
      .from(academicYears)
      .where(
        and(
          eq(academicYears.institutionId, session.institutionId),
          eq(academicYears.name, name),
          notDeleted(academicYears)
        )
      )
      .limit(1);

    if (duplicate.length > 0) {
      return apiError(`Tahun ajaran dengan nama "${name}" sudah terdaftar`, 409);
    }

    const newYearId = crypto.randomUUID();

    // Execute in a transaction to automatically create semesters
    await db.transaction(async (tx) => {
      // 1. Insert Year
      await tx.insert(academicYears).values({
        id: newYearId,
        institutionId: session.institutionId,
        name,
        startDate,
        endDate,
        status: 'draft', // Standard initial state
        description,
        createdBy: session.userId,
        updatedBy: session.userId,
      });

      // 2. Auto-create Semester I and Semester II for this academic year
      // This enforces semester data availability automatically per blueprint spec
      await tx.insert(semesters).values([
        {
          id: crypto.randomUUID(),
          academicYearId: newYearId,
          name: 'Semester I (Ganjil)',
          type: 'ganjil',
          isActive: false,
          status: 'active',
          createdBy: session.userId,
          updatedBy: session.userId,
        },
        {
          id: crypto.randomUUID(),
          academicYearId: newYearId,
          name: 'Semester II (Genap)',
          type: 'genap',
          isActive: false,
          status: 'active',
          createdBy: session.userId,
          updatedBy: session.userId,
        },
      ]);
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'academic_year',
        action: 'create',
        entityId: newYearId,
        entityType: 'academic_year',
        newData: { name, startDate, endDate, description },
        description: `Tahun ajaran baru "${name}" berhasil dibuat beserta semester ganjil/genap`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ id: newYearId, name }, 'Tahun ajaran berhasil dibuat beserta semesternya', 210);

  } catch (error) {
    console.error('POST academic years error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

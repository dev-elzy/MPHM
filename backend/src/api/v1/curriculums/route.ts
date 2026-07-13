import { z } from 'zod';
import { eq, sql, and, like } from 'drizzle-orm';
import { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { getDb } from '@/db/client';
import { curriculums } from '@/db/schema/curriculums';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateBody, validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { getPaginationParams, getPaginationMeta, getOrderByExpression } from '@/lib/api/pagination';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


// Validation Schemas
const createCurriculumSchema = z.object({
  academicYearId: z.string().min(1, 'ID tahun ajaran wajib dipilih'),
  name: z.string().min(3, 'Nama kurikulum minimal 3 karakter (misal: Kurikulum Merdeka 2026)'),
  description: z.string().optional(),
});

const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
  search: z.string().optional(),
  academicYearId: z.string().optional(),
  status: z.string().optional(),
});

// GET /api/v1/curriculums
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

    const { search, academicYearId, status } = valParams.data;
    const { page, limit, offset, sortBy, order } = getPaginationParams(request.url, 'name', 25);

    const db = getDb();

    // 1. Build conditions
    const conditions = [
      eq(academicYears.institutionId, session.institutionId),
      notDeleted(curriculums),
    ];

    if (search) {
      conditions.push(like(curriculums.name, `%${search}%`));
    }
    if (status) {
      conditions.push(eq(curriculums.status, status));
    }
    if (academicYearId) {
      conditions.push(eq(curriculums.academicYearId, academicYearId));
    }

    const finalCondition = and(...conditions);

    // 2. Count Total
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(curriculums)
      .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
      .where(finalCondition);

    const totalItems = countResult[0]?.count || 0;

    // 3. Query items (joined with academicYear for names display)
    let sortColumn: AnySQLiteColumn = curriculums.name as AnySQLiteColumn;
    if (sortBy === 'createdAt') sortColumn = curriculums.createdAt as AnySQLiteColumn;

    const items = await db
      .select({
        id: curriculums.id,
        academicYearId: curriculums.academicYearId,
        name: curriculums.name,
        description: curriculums.description,
        status: curriculums.status,
        academicYearName: academicYears.name,
        createdAt: curriculums.createdAt,
        updatedAt: curriculums.updatedAt,
      })
      .from(curriculums)
      .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
      .where(finalCondition)
      .orderBy(getOrderByExpression(sortColumn, order))
      .limit(limit)
      .offset(offset);

    return apiSuccess({
      items,
      meta: getPaginationMeta(totalItems, page, limit),
    }, 'Berhasil mengambil daftar kurikulum');

  } catch (error) {
    console.error('GET curriculums error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// POST /api/v1/curriculums
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin, and operator can create
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk membuat kurikulum', 403);
    }

    const valResult = await validateBody(request, createCurriculumSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { academicYearId, name, description } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify parent academic year belongs to this institution
    const parentYear = await db
      .select()
      .from(academicYears)
      .where(
        and(
          eq(academicYears.id, academicYearId),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(academicYears)
        )
      )
      .limit(1);

    if (parentYear.length === 0) {
      return apiError('Tahun ajaran tidak valid atau tidak ditemukan', 404);
    }

    // Check duplicate name within the same academic year
    const duplicate = await db
      .select({ id: curriculums.id })
      .from(curriculums)
      .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
      .where(
        and(
          eq(academicYears.institutionId, session.institutionId),
          eq(curriculums.academicYearId, academicYearId),
          eq(curriculums.name, name),
          notDeleted(curriculums)
        )
      )
      .limit(1);

    if (duplicate.length > 0) {
      return apiError(`Kurikulum dengan nama "${name}" sudah terdaftar pada tahun ajaran ini`, 409);
    }

    const newId = crypto.randomUUID();
    await db.insert(curriculums).values({
      id: newId,
      academicYearId,
      name,
      description,
      status: 'active', // Default to active for ease of use
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'curriculum',
        action: 'create',
        entityId: newId,
        entityType: 'curriculum',
        newData: { name, academicYearId, description },
        description: `Kurikulum "${name}" berhasil dibuat`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ id: newId, name }, 'Kurikulum berhasil dibuat', 201);

  } catch (error) {
    console.error('POST curriculum error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

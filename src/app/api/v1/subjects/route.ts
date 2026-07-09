import { z } from 'zod';
import { eq, sql, and, like, or, SQL } from 'drizzle-orm';
import { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { getDb } from '@/db/client';
import { subjects } from '@/db/schema/curriculums';
import { getSession } from '@/lib/auth/session';
import { validateBody, validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { getPaginationParams, getPaginationMeta, getOrderByExpression } from '@/lib/api/pagination';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


// Validation Schemas
const createSubjectSchema = z.object({
  name: z.string().min(2, 'Nama mata pelajaran wajib diisi'),
  arabicName: z.string().optional(),
  code: z.string().min(2, 'Kode mata pelajaran wajib diisi'),
  description: z.string().optional(),
  category: z.string().min(2, 'Kategori mata pelajaran wajib diisi'), // e.g. "KMI", "Kepesantrenan", "Tahfidz"
});

const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
});

// GET /api/v1/subjects
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

    const { search, category, status } = valParams.data;
    const { page, limit, offset, sortBy, order } = getPaginationParams(request.url, 'name', 25);

    const db = getDb();

    // 1. Build conditions
    const conditions = [
      eq(subjects.institutionId, session.institutionId),
      notDeleted(subjects),
    ];

    if (search) {
      conditions.push(
        or(
          like(subjects.name, `%${search}%`) as unknown as SQL,
          like(subjects.code, `%${search}%`) as unknown as SQL,
          like(subjects.arabicName, `%${search}%`) as unknown as SQL
        ) as unknown as SQL
      );
    }
    if (status) {
      conditions.push(eq(subjects.status, status));
    }
    if (category) {
      conditions.push(eq(subjects.category, category));
    }

    const finalCondition = and(...conditions);

    // 2. Count Total
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .where(finalCondition);

    const totalItems = countResult[0]?.count || 0;

    // 3. Query items
    let sortColumn: AnySQLiteColumn = subjects.name as AnySQLiteColumn;
    if (sortBy === 'createdAt') sortColumn = subjects.createdAt as AnySQLiteColumn;
    else if (sortBy === 'code') sortColumn = subjects.code as AnySQLiteColumn;
    else if (sortBy === 'category') sortColumn = subjects.category as AnySQLiteColumn;

    const items = await db
      .select()
      .from(subjects)
      .where(finalCondition)
      .orderBy(getOrderByExpression(sortColumn, order))
      .limit(limit)
      .offset(offset);

    return apiSuccess({
      items,
      meta: getPaginationMeta(totalItems, page, limit),
    }, 'Berhasil mengambil daftar mata pelajaran');

  } catch (error) {
    console.error('GET subjects error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// POST /api/v1/subjects
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin, and operator can create subjects
    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk membuat mata pelajaran', 403);
    }

    const valResult = await validateBody(request, createSubjectSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { name, arabicName, code, description, category } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Check duplicate code or name within the same institution
    const duplicate = await db
      .select()
      .from(subjects)
      .where(
        and(
          eq(subjects.institutionId, session.institutionId),
          or(
            eq(subjects.code, code),
            eq(subjects.name, name)
          ),
          notDeleted(subjects)
        )
      )
      .limit(1);

    if (duplicate.length > 0) {
      const match = duplicate[0];
      const field = match.code === code ? 'Kode' : 'Nama';
      return apiError(`${field} mata pelajaran sudah digunakan oleh pelajaran "${match.name}"`, 409);
    }

    const newId = crypto.randomUUID();
    await db.insert(subjects).values({
      id: newId,
      institutionId: session.institutionId,
      name,
      arabicName,
      code,
      description,
      category,
      status: 'active',
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'subject',
        action: 'create',
        entityId: newId,
        entityType: 'subject',
        newData: { name, code, category },
        description: `Mata pelajaran "${name}" (${code}) berhasil dibuat`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ id: newId, name, code }, 'Mata pelajaran berhasil dibuat', 201);

  } catch (error) {
    console.error('POST subject error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

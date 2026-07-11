import { z } from 'zod';
import { eq, sql, and, like } from 'drizzle-orm';
import { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { getDb } from '@/db/client';
import { classes, classAssignments } from '@/db/schema/classes';
import { academicYears } from '@/db/schema/academic-years';
import { semesters } from '@/db/schema/semesters';
import { curriculums } from '@/db/schema/curriculums';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { validateBody, validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { getPaginationParams, getPaginationMeta, getOrderByExpression } from '@/lib/api/pagination';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


// Validation Schemas
const createClassSchema = z.object({
  academicYearId: z.string().min(1, 'Tahun ajaran wajib diisi'),
  semesterId: z.string().min(1).optional().nullable(),
  curriculumId: z.string().min(1).optional().nullable(),
  jenjang: z.string().min(1, 'Jenjang wajib diisi'), // e.g. "MTs", "MA"
  tingkat: z.string().min(1, 'Tingkat wajib diisi'), // e.g. "7", "8"
  bagian: z.string().min(1, 'Bagian kelas wajib diisi'), // e.g. "A", "B"
  waliKelasId: z.string().uuid('ID Wali Kelas tidak valid').optional().nullable(),
});

const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
  search: z.string().optional(),
  academicYearId: z.string().optional(),
  semesterId: z.string().optional(),
  curriculumId: z.string().optional(),
});

// GET /api/v1/classes
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

    const { search, academicYearId, semesterId, curriculumId } = valParams.data;
    const { page, limit, offset, sortBy, order } = getPaginationParams(request.url, 'name', 25);

    const db = getDb();

    // 1. Build conditions
    const conditions = [
      eq(academicYears.institutionId, session.institutionId),
      notDeleted(classes),
    ];

    if (search) {
      conditions.push(like(classes.name, `%${search}%`));
    }
    if (academicYearId) {
      conditions.push(eq(classes.academicYearId, academicYearId));
    }
    if (semesterId) {
      conditions.push(eq(classes.semesterId, semesterId));
    }
    if (curriculumId) {
      conditions.push(eq(classes.curriculumId, curriculumId));
    }

    // Role-based filtering for mustahiq/teachers (only assigned classes)
    const isTeacher = ['mustahiq', 'teacher', 'ustadz'].includes(session.role.toLowerCase());
    if (isTeacher) {
      // Find class IDs assigned to this teacher
      const assignedClassIdsSubquery = db
        .select({ classId: classAssignments.classId })
        .from(classAssignments)
        .where(
          and(
            eq(classAssignments.userId, session.userId),
            eq(classAssignments.status, 'active')
          )
        );
      
      const assignedResult = await assignedClassIdsSubquery;
      const assignedIds = assignedResult.map(r => r.classId);
      
      if (assignedIds.length > 0) {
        conditions.push(sql`${classes.id} IN (${sql.raw(assignedIds.map(id => `'${id}'`).join(','))})`);
      } else {
        // Teacher has no classes, force empty results
        conditions.push(eq(classes.id, 'none_assigned'));
      }
    }

    const finalCondition = and(...conditions);

    // 2. Count Total
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .innerJoin(academicYears, eq(classes.academicYearId, academicYears.id))
      .where(finalCondition);

    const totalItems = countResult[0]?.count || 0;

    // 3. Query items (joined with academicYear, semester, curriculum, and wali kelas user details)
    let sortColumn: AnySQLiteColumn = classes.name as AnySQLiteColumn;
    if (sortBy === 'createdAt') sortColumn = classes.createdAt as AnySQLiteColumn;

    const items = await db
      .select({
        id: classes.id,
        academicYearId: classes.academicYearId,
        semesterId: classes.semesterId,
        curriculumId: classes.curriculumId,
        jenjang: classes.jenjang,
        tingkat: classes.tingkat,
        bagian: classes.bagian,
        name: classes.name,
        status: classes.status,
        academicYearName: academicYears.name,
        semesterName: semesters.name,
        curriculumName: curriculums.name,
        // Wali kelas joins
        waliKelasId: users.id,
        waliKelasName: users.name,
      })
      .from(classes)
      .innerJoin(academicYears, eq(classes.academicYearId, academicYears.id))
      .leftJoin(semesters, eq(classes.semesterId, semesters.id))
      .leftJoin(curriculums, eq(classes.curriculumId, curriculums.id))
      .leftJoin(
        classAssignments,
        and(
          eq(classAssignments.classId, classes.id),
          eq(classAssignments.role, 'wali_kelas'),
          eq(classAssignments.status, 'active')
        )
      )
      .leftJoin(users, eq(classAssignments.userId, users.id))
      .where(finalCondition)
      .orderBy(getOrderByExpression(sortColumn, order))
      .limit(limit)
      .offset(offset);

    return apiSuccess({
      items,
      meta: getPaginationMeta(totalItems, page, limit),
    }, 'Berhasil mengambil daftar kelas rombel');

  } catch (error) {
    console.error('GET classes error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// POST /api/v1/classes
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin, operator
    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk membuat kelas', 403);
    }

    const valResult = await validateBody(request, createClassSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { academicYearId, semesterId, curriculumId, jenjang, tingkat, bagian, waliKelasId } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Auto-generate name
    const className = `${jenjang} ${tingkat}-${bagian}`;

    // Verify parent academic year exists in this institution
    const parentYear = (
      await db
        .select()
        .from(academicYears)
        .where(
          and(
            eq(academicYears.id, academicYearId),
            eq(academicYears.institutionId, session.institutionId),
            notDeleted(academicYears)
          )
        )
        .limit(1)
    )[0];

    if (!parentYear) {
      return apiError('Tahun ajaran tidak valid atau tidak ditemukan', 404);
    }

    // Check duplicate identity (CL-04: No duplicate class identity in same semester)
    const duplicate = await db
      .select()
      .from(classes)
      .where(
        and(
          eq(classes.academicYearId, academicYearId),
          semesterId ? eq(classes.semesterId, semesterId) : sql`${classes.semesterId} is null`,
          eq(classes.jenjang, jenjang),
          eq(classes.tingkat, tingkat),
          eq(classes.bagian, bagian),
          notDeleted(classes)
        )
      )
      .limit(1);

    if (duplicate.length > 0) {
      return apiError(`Kelas dengan identitas "${className}" sudah terdaftar pada semester ini`, 409);
    }

    // Verify Wali kelas constraints (CL-06: One Wali kelas per class per academic year)
    if (waliKelasId) {
      const alreadyAssigned = await db
        .select()
        .from(classAssignments)
        .where(
          and(
            eq(classAssignments.academicYearId, academicYearId),
            eq(classAssignments.userId, waliKelasId),
            eq(classAssignments.status, 'active')
          )
        )
        .limit(1);

      if (alreadyAssigned.length > 0) {
        return apiError('Ustadz/Ustadzah terpilih sudah ditugaskan sebagai Wali Kelas di rombel lain pada tahun ajaran ini', 400);
      }
    }

    const newId = crypto.randomUUID();

    // Insert inside a transaction to bundle class and assignment
    await db.transaction(async (tx) => {
      // 1. Create Class
      await tx.insert(classes).values({
        id: newId,
        academicYearId,
        semesterId: semesterId || null,
        curriculumId: curriculumId || null,
        jenjang,
        tingkat,
        bagian,
        name: className,
        status: 'active',
        createdBy: session.userId,
        updatedBy: session.userId,
      });

      // 2. Create Assignment if Wali kelas provided
      if (waliKelasId) {
        await tx.insert(classAssignments).values({
          id: crypto.randomUUID(),
          academicYearId,
          classId: newId,
          userId: waliKelasId,
          role: 'wali_kelas',
          status: 'active',
          createdBy: session.userId,
          updatedBy: session.userId,
        });
      }
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'class',
        action: 'create',
        entityId: newId,
        entityType: 'class',
        newData: { name: className, academicYearId, semesterId, curriculumId },
        description: `Kelas Rombel "${className}" berhasil dibuat`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ id: newId, name: className }, 'Kelas Rombel berhasil dibuat', 201);

  } catch (error) {
    console.error('POST class error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

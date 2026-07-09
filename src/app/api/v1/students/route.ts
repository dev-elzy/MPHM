import { z } from 'zod';
import { eq, sql, and, like, or, SQL } from 'drizzle-orm';
import { AnySQLiteColumn } from 'drizzle-orm/sqlite-core';
import { getDb } from '@/db/client';
import { students, classStudents } from '@/db/schema/students';
import { classes } from '@/db/schema/classes';
import { getSession } from '@/lib/auth/session';
import { validateBody, validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { getPaginationParams, getPaginationMeta, getOrderByExpression } from '@/lib/api/pagination';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


// Validation Schemas
const createStudentSchema = z.object({
  nis: z.string().optional().nullable(),
  nisn: z.string().optional().nullable(),
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  birthDate: z.string().optional().nullable(),
  birthPlace: z.string().optional().nullable(),
  gender: z.enum(['male', 'female']).default('female'),
  address: z.string().optional().nullable(),
  parentName: z.string().optional().nullable(),
  parentPhone: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  entryYear: z.string().optional().nullable(),
  entryJenjang: z.string().optional().nullable(),
  status: z.string().default('active'),
  notes: z.string().optional().nullable(),
  // Dynamic enrollment on creation
  classId: z.string().uuid().optional().nullable(),
  academicYearId: z.string().uuid().optional().nullable(),
  semesterId: z.string().uuid().optional().nullable(),
});

const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  classId: z.string().optional(),
  academicYearId: z.string().optional(),
  semesterId: z.string().optional(),
});

// GET /api/v1/students
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

    const { search, status, classId, academicYearId, semesterId } = valParams.data;
    const { page, limit, offset, sortBy, order } = getPaginationParams(request.url, 'name', 25);

    const db = getDb();

    // 1. Build conditions
    const conditions = [
      eq(students.institutionId, session.institutionId),
      notDeleted(students),
    ];

    if (search) {
      conditions.push(
        or(
          like(students.name, `%${search}%`),
          like(students.nis, `%${search}%`),
          like(students.nisn, `%${search}%`)
        ) as unknown as SQL
      );
    }
    if (status) {
      conditions.push(eq(students.status, status));
    }

    // Handle class enrollment filter
    const isEnrolledFilter = classId || (academicYearId && semesterId);

    const baseQuery = db
      .select({ count: sql<number>`count(distinct ${students.id})` })
      .from(students);

    if (isEnrolledFilter) {
      const joinConditions = [eq(classStudents.studentId, students.id)];
      if (academicYearId) joinConditions.push(eq(classStudents.academicYearId, academicYearId));
      if (semesterId) joinConditions.push(eq(classStudents.semesterId, semesterId));
      if (classId) joinConditions.push(eq(classStudents.classId, classId));

      baseQuery.innerJoin(classStudents, and(...joinConditions));
    }

    const countResult = await baseQuery.where(and(...conditions));
    const totalItems = countResult[0]?.count || 0;

    // 2. Query items
    let sortColumn: AnySQLiteColumn = students.name as AnySQLiteColumn;
    if (sortBy === 'createdAt') sortColumn = students.createdAt as AnySQLiteColumn;
    else if (sortBy === 'nis') sortColumn = students.nis as AnySQLiteColumn;

    const selectQuery = db
      .select({
        id: students.id,
        nis: students.nis,
        nisn: students.nisn,
        name: students.name,
        birthDate: students.birthDate,
        birthPlace: students.birthPlace,
        gender: students.gender,
        address: students.address,
        parentName: students.parentName,
        parentPhone: students.parentPhone,
        phone: students.phone,
        entryYear: students.entryYear,
        entryJenjang: students.entryJenjang,
        status: students.status,
        notes: students.notes,
        createdAt: students.createdAt,
        // Enrolled class details
        classId: classes.id,
        className: classes.name,
      })
      .from(students);

    // Apply class joins
    const joinConditions = [eq(classStudents.studentId, students.id)];
    if (academicYearId) joinConditions.push(eq(classStudents.academicYearId, academicYearId));
    if (semesterId) joinConditions.push(eq(classStudents.semesterId, semesterId));
    if (classId) joinConditions.push(eq(classStudents.classId, classId));

    if (isEnrolledFilter) {
      selectQuery
        .innerJoin(classStudents, and(...joinConditions))
        .leftJoin(classes, eq(classStudents.classId, classes.id));
    } else if (academicYearId && !semesterId) {
      // Join to class_students loosely to show current year class if it exists
      selectQuery
        .leftJoin(
          classStudents,
          and(
            eq(classStudents.studentId, students.id),
            eq(classStudents.academicYearId, academicYearId)
          )
        )
        .leftJoin(classes, eq(classStudents.classId, classes.id));
    } else {
      selectQuery
        .leftJoin(classStudents, eq(classStudents.studentId, students.id))
        .leftJoin(classes, eq(classStudents.classId, classes.id));
    }

    const items = await selectQuery
      .where(and(...conditions))
      .orderBy(getOrderByExpression(sortColumn, order))
      .limit(limit)
      .offset(offset);

    // If loose join causes duplicate rows (a student has multiple classes in different semesters),
    // let's deduplicate client side or keep distinct. The limit handles unique rows.
    return apiSuccess({
      items,
      meta: getPaginationMeta(totalItems, page, limit),
    }, 'Berhasil mengambil daftar siswi');

  } catch (error) {
    console.error('GET students error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// POST /api/v1/students
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin, operator
    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengedit data siswi', 403);
    }

    const valResult = await validateBody(request, createStudentSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { classId, academicYearId, semesterId, ...studentData } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Check duplicate NIS if provided
    if (studentData.nis) {
      const duplicate = await db
        .select()
        .from(students)
        .where(
          and(
            eq(students.nis, studentData.nis),
            eq(students.institutionId, session.institutionId),
            notDeleted(students)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return apiError(`Siswi dengan NIS ${studentData.nis} sudah terdaftar`, 409);
      }
    }

    const newStudentId = crypto.randomUUID();

    // Perform transaction to write student & class_student link
    await db.transaction(async (tx) => {
      // 1. Create Student
      await tx.insert(students).values({
        id: newStudentId,
        institutionId: session.institutionId,
        nis: studentData.nis || null,
        nisn: studentData.nisn || null,
        name: studentData.name,
        birthDate: studentData.birthDate || null,
        birthPlace: studentData.birthPlace || null,
        gender: studentData.gender,
        address: studentData.address || null,
        parentName: studentData.parentName || null,
        parentPhone: studentData.parentPhone || null,
        phone: studentData.phone || null,
        entryYear: studentData.entryYear || null,
        entryJenjang: studentData.entryJenjang || null,
        status: studentData.status,
        notes: studentData.notes || null,
        createdBy: session.userId,
        updatedBy: session.userId,
      });

      // 2. Link Class if provided
      if (classId && academicYearId && semesterId) {
        await tx.insert(classStudents).values({
          id: crypto.randomUUID(),
          academicYearId,
          semesterId,
          classId,
          studentId: newStudentId,
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
        module: 'student',
        action: 'create',
        entityId: newStudentId,
        entityType: 'student',
        newData: { name: studentData.name, nis: studentData.nis },
        description: `Siswi "${studentData.name}" berhasil didaftarkan`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ id: newStudentId }, 'Siswi berhasil didaftarkan', 201);

  } catch (error) {
    console.error('POST student error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

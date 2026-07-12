import { z } from 'zod';
import { eq, and, ne } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { students, classStudents } from '@/db/schema/students';
import { classes } from '@/db/schema/classes';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


const updateStudentSchema = z.object({
  nis: z.string().optional().nullable(),
  nisn: z.string().optional().nullable(),
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter').optional(),
  birthDate: z.string().optional().nullable(),
  birthPlace: z.string().optional().nullable(),
  gender: z.enum(['male', 'female']).optional(),
  address: z.string().optional().nullable(),
  parentName: z.string().optional().nullable(),
  parentPhone: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  entryYear: z.string().optional().nullable(),
  entryJenjang: z.string().optional().nullable(),
  status: z.string().optional(),
  notes: z.string().optional().nullable(),
  // Class adjustment parameters
  classId: z.string().uuid().optional().nullable(),
  academicYearId: z.string().uuid().optional().nullable(),
  semesterId: z.string().uuid().optional().nullable(),
});

// GET /api/v1/students/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const academicYearId = searchParams.get('academicYearId');
    const semesterId = searchParams.get('semesterId');

    const db = getDb();

    // Query base student
    const studentResult = await db
      .select()
      .from(students)
      .where(
        and(
          eq(students.id, id),
          eq(students.institutionId, session.institutionId),
          notDeleted(students)
        )
      )
      .limit(1);

    const student = studentResult[0];
    if (!student) {
      return apiError('Data siswi tidak ditemukan', 404);
    }

    // Join current class enrollment
    let currentClass = null;
    if (academicYearId && semesterId) {
      const classResult = await db
        .select({
          classId: classes.id,
          className: classes.name,
        })
        .from(classStudents)
        .innerJoin(classes, eq(classStudents.classId, classes.id))
        .where(
          and(
            eq(classStudents.studentId, id),
            eq(classStudents.academicYearId, academicYearId),
            eq(classStudents.semesterId, semesterId),
            eq(classStudents.status, 'active')
          )
        )
        .limit(1);

      if (classResult.length > 0) {
        currentClass = classResult[0];
      }
    }

    return apiSuccess(
      {
        ...student,
        classId: currentClass?.classId || null,
        className: currentClass?.className || null,
      },
      'Berhasil mengambil detail siswi'
    );

  } catch (error) {
    console.error('GET student detail error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// PATCH /api/v1/students/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    
    const valResult = await validateBody(request, updateStudentSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { classId, academicYearId, semesterId, ...studentData } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify student exists in this institution
    const currentResult = await db
      .select()
      .from(students)
      .where(
        and(
          eq(students.id, id),
          eq(students.institutionId, session.institutionId),
          notDeleted(students)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Data siswi tidak ditemukan', 404);
    }

    // Check duplicate NIS if changed
    if (studentData.nis && studentData.nis !== current.nis) {
      const duplicate = await db
        .select()
        .from(students)
        .where(
          and(
            eq(students.nis, studentData.nis),
            eq(students.institutionId, session.institutionId),
            ne(students.id, id),
            notDeleted(students)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return apiError(`Siswi dengan NIS ${studentData.nis} sudah terdaftar`, 409);
      }
    }

    // Perform updates in a transaction
    await db.transaction(async (tx) => {
      // 1. Update Student Table
      await tx
        .update(students)
        .set({
          ...studentData,
          updatedAt: new Date(),
          updatedBy: session.userId,
        })
        .where(eq(students.id, id));

      // 2. Adjust Enrollment
      if (classId !== undefined && academicYearId && semesterId) {
        // Query current link for this semester/year
        const currentLink = (
          await tx
            .select()
            .from(classStudents)
            .where(
              and(
                eq(classStudents.studentId, id),
                eq(classStudents.academicYearId, academicYearId),
                eq(classStudents.semesterId, semesterId)
              )
            )
            .limit(1)
        )[0];

        if (!classId) {
          // Deactivate or delete link if classId is empty
          if (currentLink) {
            await tx
              .delete(classStudents)
              .where(eq(classStudents.id, currentLink.id));
          }
        } else if (!currentLink) {
          // Insert new linkage
          await tx.insert(classStudents).values({
            id: crypto.randomUUID(),
            academicYearId,
            semesterId,
            classId,
            studentId: id,
            status: 'active',
            createdBy: session.userId,
            updatedBy: session.userId,
          });
        } else if (currentLink.classId !== classId) {
          // Transition student to different class
          await tx
            .update(classStudents)
            .set({
              classId,
              updatedAt: new Date(),
              updatedBy: session.userId,
            })
            .where(eq(classStudents.id, currentLink.id));
        }
      }
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'student',
        action: 'update',
        entityId: id,
        entityType: 'student',
        description: `Profil siswi "${current.name}" berhasil diperbarui`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Profil siswi berhasil diperbarui');

  } catch (error) {
    console.error('PATCH student error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// DELETE /api/v1/students/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin
    const ALLOWED_ROLES = ['super_admin', 'admin'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk menghapus data siswi', 403);
    }

    const { id } = await params;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify student exists in this institution
    const currentResult = await db
      .select({ id: students.id, name: students.name })
      .from(students)
      .where(
        and(
          eq(students.id, id),
          eq(students.institutionId, session.institutionId),
          notDeleted(students)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Data siswi tidak ditemukan', 404);
    }

    // Perform soft delete
    await db
      .update(students)
      .set({
        deletedAt: new Date(),
        deletedBy: session.userId,
      })
      .where(eq(students.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'student',
        action: 'delete',
        entityId: id,
        entityType: 'student',
        oldData: current,
        description: `Profil siswi "${current.name}" dipindahkan ke Recycle Bin (Soft Delete)`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Profil siswi berhasil dihapus');

  } catch (error) {
    console.error('DELETE student error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

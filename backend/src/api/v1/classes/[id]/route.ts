import { z } from 'zod';
import { eq, and, ne, sql } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { classes, classAssignments } from '@/db/schema/classes';
import { academicYears } from '@/db/schema/academic-years';
import { people, studentProfiles, classStudents } from '@/db/schema';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


const updateClassSchema = z.object({
  curriculumId: z.string().uuid('ID kurikulum tidak valid').optional().nullable(),
  jenjang: z.string().min(1, 'Jenjang wajib diisi').optional(),
  tingkat: z.string().min(1, 'Tingkat wajib diisi').optional(),
  bagian: z.string().min(1, 'Bagian kelas wajib diisi').optional(),
  status: z.enum(['active', 'inactive']).optional(),
  waliKelasId: z.string().uuid('ID Wali Kelas tidak valid').optional().nullable(),
});

// GET /api/v1/classes/[id]
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
    const db = getDb();

    // Query class joined with its current active wali kelas
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
        createdAt: classes.createdAt,
        updatedAt: classes.updatedAt,
        // Wali kelas detail
        waliKelasId: users.id,
        waliKelasName: users.name,
      })
      .from(classes)
      .innerJoin(academicYears, eq(classes.academicYearId, academicYears.id))
      .leftJoin(
        classAssignments,
        and(
          eq(classAssignments.classId, classes.id),
          eq(classAssignments.role, 'wali_kelas'),
          eq(classAssignments.status, 'active')
        )
      )
      .leftJoin(users, eq(classAssignments.userId, users.id))
      .where(
        and(
          eq(classes.id, id),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(classes)
        )
      )
      .limit(1);

    const data = items[0];
    if (!data) {
      return apiError('Kelas rombel tidak ditemukan', 404);
    }

    return apiSuccess(data, 'Berhasil mengambil detail kelas');

  } catch (error) {
    console.error('GET class detail error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// PATCH /api/v1/classes/[id]
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
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengubah data kelas', 403);
    }

    const { id } = await params;
    
    const valResult = await validateBody(request, updateClassSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { waliKelasId, ...updateData } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify class existence
    const currentResult = await db
      .select({
        id: classes.id,
        name: classes.name,
        academicYearId: classes.academicYearId,
        semesterId: classes.semesterId,
        jenjang: classes.jenjang,
        tingkat: classes.tingkat,
        bagian: classes.bagian,
      })
      .from(classes)
      .innerJoin(academicYears, eq(classes.academicYearId, academicYears.id))
      .where(
        and(
          eq(classes.id, id),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(classes)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Kelas rombel tidak ditemukan', 404);
    }

    // Resolve name
    const finalJenjang = updateData.jenjang || current.jenjang;
    const finalTingkat = updateData.tingkat || current.tingkat;
    const finalBagian = updateData.bagian || current.bagian;
    const className = `${finalJenjang} ${finalTingkat}-${finalBagian}`;

    // Verify uniqueness of identity if changed
    if (finalJenjang !== current.jenjang || finalTingkat !== current.tingkat || finalBagian !== current.bagian) {
      const duplicate = await db
        .select()
        .from(classes)
        .where(
          and(
            eq(classes.academicYearId, current.academicYearId),
            current.semesterId ? eq(classes.semesterId, current.semesterId) : sql`${classes.semesterId} is null`,
            eq(classes.jenjang, finalJenjang),
            eq(classes.tingkat, finalTingkat),
            eq(classes.bagian, finalBagian),
            ne(classes.id, id),
            notDeleted(classes)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return apiError(`Kelas dengan identitas "${className}" sudah terdaftar pada semester ini`, 409);
      }
    }

    // Verify Wali kelas rules if provided (CL-06)
    if (waliKelasId) {
      const alreadyAssigned = await db
        .select()
        .from(classAssignments)
        .where(
          and(
            eq(classAssignments.academicYearId, current.academicYearId),
            eq(classAssignments.userId, waliKelasId),
            eq(classAssignments.status, 'active'),
            ne(classAssignments.classId, id)
          )
        )
        .limit(1);

      if (alreadyAssigned.length > 0) {
        return apiError('Ustadz/Ustadzah terpilih sudah ditugaskan sebagai Wali Kelas di rombel lain pada tahun ajaran ini', 400);
      }
    }

    // Perform updates inside a transaction
    await db.transaction(async (tx) => {
      // 1. Update Class table
      await tx
        .update(classes)
        .set({
          ...updateData,
          name: className,
          updatedAt: new Date(),
          updatedBy: session.userId,
        })
        .where(eq(classes.id, id));

      // 2. Handle Wali kelas change
      if (waliKelasId !== undefined) {
        // Query active assignment
        const currentAssignment = (
          await tx
            .select()
            .from(classAssignments)
            .where(
              and(
                eq(classAssignments.classId, id),
                eq(classAssignments.role, 'wali_kelas'),
                eq(classAssignments.status, 'active')
              )
            )
            .limit(1)
        )[0];

        if (!waliKelasId) {
          // If setting to empty/null, deactivate current
          if (currentAssignment) {
            await tx
              .update(classAssignments)
              .set({
                status: 'inactive',
                endDate: new Date().toISOString().split('T')[0],
                updatedAt: new Date(),
                updatedBy: session.userId,
              })
              .where(eq(classAssignments.id, currentAssignment.id));
          }
        } else if (!currentAssignment || currentAssignment.userId !== waliKelasId) {
          // If changed or new assignment
          if (currentAssignment) {
            // Deactivate old assignment
            await tx
              .update(classAssignments)
              .set({
                status: 'inactive',
                endDate: new Date().toISOString().split('T')[0],
                updatedAt: new Date(),
                updatedBy: session.userId,
              })
              .where(eq(classAssignments.id, currentAssignment.id));
          }

          // Insert new assignment
          await tx.insert(classAssignments).values({
            id: crypto.randomUUID(),
            academicYearId: current.academicYearId,
            classId: id,
            userId: waliKelasId,
            role: 'wali_kelas',
            status: 'active',
            startDate: new Date().toISOString().split('T')[0],
            createdBy: session.userId,
            updatedBy: session.userId,
          });
        }
      }
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'class',
        action: 'update',
        entityId: id,
        entityType: 'class',
        description: `Kelas Rombel "${current.name}" diperbarui`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Kelas Rombel berhasil diperbarui');

  } catch (error) {
    console.error('PATCH class error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// DELETE /api/v1/classes/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin and admin can delete
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk menghapus kelas', 403);
    }

    const { id } = await params;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify class existence
    const currentResult = await db
      .select({
        id: classes.id,
        name: classes.name,
      })
      .from(classes)
      .innerJoin(academicYears, eq(classes.academicYearId, academicYears.id))
      .where(
        and(
          eq(classes.id, id),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(classes)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Kelas rombel tidak ditemukan', 404);
    }

    // Safety Constraint: Check if there are active students enrolled in this class
    const activeStudentsResult = await db
      .select()
      .from(classStudents)
      .where(eq(classStudents.classId, id))
      .limit(1);

    if (activeStudentsResult.length > 0) {
      return apiError(
        `Kelas "${current.name}" tidak dapat dihapus karena masih menampung siswi aktif. Silakan pindahkan siswi ke rombel lain terlebih dahulu.`,
        400
      );
    }

    // Perform soft delete
    await db
      .update(classes)
      .set({
        deletedAt: new Date(),
        deletedBy: session.userId,
      })
      .where(eq(classes.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'class',
        action: 'delete',
        entityId: id,
        entityType: 'class',
        oldData: current,
        description: `Kelas Rombel "${current.name}" dipindahkan ke Recycle Bin (Soft Delete)`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Kelas Rombel berhasil dipindahkan ke Recycle Bin');

  } catch (error) {
    console.error('DELETE class error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

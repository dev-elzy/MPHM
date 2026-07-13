import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { curriculums } from '@/db/schema/curriculums';
import { academicYears } from '@/db/schema/academic-years';
import { classes } from '@/db/schema/classes';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


const updateCurriculumSchema = z.object({
  name: z.string().min(3, 'Nama kurikulum minimal 3 karakter').optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// GET /api/v1/curriculums/[id]
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

    const items = await db
      .select({
        id: curriculums.id,
        academicYearId: curriculums.academicYearId,
        name: curriculums.name,
        description: curriculums.description,
        status: curriculums.status,
        createdAt: curriculums.createdAt,
        updatedAt: curriculums.updatedAt,
      })
      .from(curriculums)
      .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
      .where(
        and(
          eq(curriculums.id, id),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(curriculums)
        )
      )
      .limit(1);

    const curriculum = items[0];
    if (!curriculum) {
      return apiError('Kurikulum tidak ditemukan', 404);
    }

    return apiSuccess(curriculum, 'Berhasil mengambil detail kurikulum');

  } catch (error) {
    console.error('GET curriculum detail error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// PATCH /api/v1/curriculums/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin, and operator can edit
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengubah kurikulum', 403);
    }

    const { id } = await params;
    
    const valResult = await validateBody(request, updateCurriculumSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const updateData = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    const currentResult = await db
      .select({
        id: curriculums.id,
        name: curriculums.name,
        academicYearId: curriculums.academicYearId,
      })
      .from(curriculums)
      .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
      .where(
        and(
          eq(curriculums.id, id),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(curriculums)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Kurikulum tidak ditemukan', 404);
    }

    // Check duplicate name in same academic year
    if (updateData.name && updateData.name !== current.name) {
      const duplicate = await db
        .select({ id: curriculums.id })
        .from(curriculums)
        .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
        .where(
          and(
            eq(academicYears.institutionId, session.institutionId),
            eq(curriculums.academicYearId, current.academicYearId),
            eq(curriculums.name, updateData.name),
            notDeleted(curriculums)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return apiError(`Kurikulum dengan nama "${updateData.name}" sudah terdaftar pada tahun ajaran ini`, 409);
      }
    }

    await db
      .update(curriculums)
      .set({
        ...updateData,
        updatedAt: new Date(),
        updatedBy: session.userId,
      })
      .where(eq(curriculums.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'curriculum',
        action: 'update',
        entityId: id,
        entityType: 'curriculum',
        oldData: current,
        newData: updateData,
        description: `Kurikulum "${current.name}" diperbarui`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Kurikulum berhasil diperbarui');

  } catch (error) {
    console.error('PATCH curriculum error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// DELETE /api/v1/curriculums/[id]
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
      return apiError('Anda tidak memiliki izin untuk menghapus kurikulum', 403);
    }

    const { id } = await params;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    const currentResult = await db
      .select({
        id: curriculums.id,
        name: curriculums.name,
      })
      .from(curriculums)
      .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
      .where(
        and(
          eq(curriculums.id, id),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(curriculums)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Kurikulum tidak ditemukan', 404);
    }

    // Business Constraint: Check if this curriculum is currently bound to any active classes
    const activeClasses = await db
      .select()
      .from(classes)
      .where(
        and(
          eq(classes.curriculumId, id),
          notDeleted(classes)
        )
      )
      .limit(1);

    if (activeClasses.length > 0) {
      return apiError(
        `Kurikulum "${current.name}" tidak dapat dihapus karena sedang digunakan oleh kelas rombel. Silakan hapus atau pindahkan kelas terlebih dahulu.`,
        400
      );
    }

    // Soft delete
    await db
      .update(curriculums)
      .set({
        deletedAt: new Date(),
        deletedBy: session.userId,
      })
      .where(eq(curriculums.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'curriculum',
        action: 'delete',
        entityId: id,
        entityType: 'curriculum',
        oldData: current,
        description: `Kurikulum "${current.name}" dipindahkan ke Recycle Bin (Soft Delete)`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Kurikulum berhasil dipindahkan ke Recycle Bin');

  } catch (error) {
    console.error('DELETE curriculum error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

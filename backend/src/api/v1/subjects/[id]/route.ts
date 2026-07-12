import { z } from 'zod';
import { eq, and, or, ne } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { subjects, curriculumSubjects } from '@/db/schema/curriculums';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


const updateSubjectSchema = z.object({
  name: z.string().min(2, 'Nama mata pelajaran wajib diisi').optional(),
  arabicName: z.string().optional(),
  code: z.string().min(2, 'Kode mata pelajaran wajib diisi').optional(),
  description: z.string().optional(),
  category: z.string().min(2, 'Kategori mata pelajaran wajib diisi').optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// GET /api/v1/subjects/[id]
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
      .select()
      .from(subjects)
      .where(
        and(
          eq(subjects.id, id),
          eq(subjects.institutionId, session.institutionId),
          notDeleted(subjects)
        )
      )
      .limit(1);

    const subject = items[0];
    if (!subject) {
      return apiError('Mata pelajaran tidak ditemukan', 404);
    }

    return apiSuccess(subject, 'Berhasil mengambil detail mata pelajaran');

  } catch (error) {
    console.error('GET subject detail error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// PATCH /api/v1/subjects/[id]
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
    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengubah mata pelajaran', 403);
    }

    const { id } = await params;
    
    const valResult = await validateBody(request, updateSubjectSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const updateData = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    const currentResult = await db
      .select()
      .from(subjects)
      .where(
        and(
          eq(subjects.id, id),
          eq(subjects.institutionId, session.institutionId),
          notDeleted(subjects)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Mata pelajaran tidak ditemukan', 404);
    }

    // Check duplicate code/name if updated
    if ((updateData.code && updateData.code !== current.code) || (updateData.name && updateData.name !== current.name)) {
      const checkCode = updateData.code || current.code;
      const checkName = updateData.name || current.name;

      const duplicate = await db
        .select()
        .from(subjects)
        .where(
          and(
            eq(subjects.institutionId, session.institutionId),
            ne(subjects.id, id),
            or(
              eq(subjects.code, checkCode || ''),
              eq(subjects.name, checkName || '')
            ),
            notDeleted(subjects)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        const match = duplicate[0];
        const field = match.code === checkCode ? 'Kode' : 'Nama';
        return apiError(`${field} mata pelajaran sudah digunakan oleh pelajaran "${match.name}"`, 409);
      }
    }

    await db
      .update(subjects)
      .set({
        ...updateData,
        updatedAt: new Date(),
        updatedBy: session.userId,
      })
      .where(eq(subjects.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'subject',
        action: 'update',
        entityId: id,
        entityType: 'subject',
        oldData: current,
        newData: updateData,
        description: `Mata pelajaran "${current.name}" diperbarui`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Mata pelajaran berhasil diperbarui');

  } catch (error) {
    console.error('PATCH subject error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// DELETE /api/v1/subjects/[id]
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
    const ALLOWED_ROLES = ['super_admin', 'admin'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk menghapus mata pelajaran', 403);
    }

    const { id } = await params;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    const currentResult = await db
      .select()
      .from(subjects)
      .where(
        and(
          eq(subjects.id, id),
          eq(subjects.institutionId, session.institutionId),
          notDeleted(subjects)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Mata pelajaran tidak ditemukan', 404);
    }

    // Safety Constraint: Check if this subject is linked to any curriculum
    const linkedCurriculums = await db
      .select()
      .from(curriculumSubjects)
      .where(eq(curriculumSubjects.subjectId, id))
      .limit(1);

    if (linkedCurriculums.length > 0) {
      return apiError(
        `Mata pelajaran "${current.name}" tidak dapat dihapus karena telah terhubung ke satu atau lebih kurikulum aktif. Lepas pelajaran dari kurikulum terlebih dahulu.`,
        400
      );
    }

    // Soft delete
    await db
      .update(subjects)
      .set({
        deletedAt: new Date(),
        deletedBy: session.userId,
      })
      .where(eq(subjects.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'subject',
        action: 'delete',
        entityId: id,
        entityType: 'subject',
        oldData: current,
        description: `Mata pelajaran "${current.name}" dipindahkan ke Recycle Bin (Soft Delete)`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Mata pelajaran berhasil dipindahkan ke Recycle Bin');

  } catch (error) {
    console.error('DELETE subject error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

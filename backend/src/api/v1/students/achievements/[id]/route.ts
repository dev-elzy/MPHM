import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { studentAchievements } from '@/db/schema/achievements';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';

const updateAchievementSchema = z.object({
  title: z.string().min(1, 'Judul prestasi wajib diisi').optional(),
  level: z.enum(['Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internal']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').optional(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const userRole = (session.role || '').toLowerCase();
    const canWrite = ['mustahiq', 'teacher', 'ustadz', 'sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);
    if (!canWrite) {
      return apiError('Anda tidak memiliki izin untuk mengedit prestasi', 403);
    }

    const { id } = await params;
    const body = await validateBody(request, updateAchievementSchema);
    if (!body.success) return body.errorResponse;

    const db = getDb();

    const existing = await db
      .select({ id: studentAchievements.id })
      .from(studentAchievements)
      .where(eq(studentAchievements.id, id))
      .limit(1);

    if (existing.length === 0) {
      return apiError('Data prestasi tidak ditemukan', 404);
    }

    await db
      .update(studentAchievements)
      .set({
        ...body.data,
        updatedBy: session.userId,
        updatedAt: new Date(),
      })
      .where(eq(studentAchievements.id, id));

    return apiSuccess(null, 'Prestasi berhasil diperbarui');
  } catch (err) {
    console.error('[achievements PATCH]', err);
    return apiError('Gagal memperbarui prestasi', 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const userRole = (session.role || '').toLowerCase();
    const canWrite = ['mustahiq', 'teacher', 'ustadz', 'sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);
    if (!canWrite) {
      return apiError('Anda tidak memiliki izin untuk menghapus prestasi', 403);
    }

    const { id } = await params;
    const db = getDb();

    const existing = await db
      .select({ id: studentAchievements.id })
      .from(studentAchievements)
      .where(eq(studentAchievements.id, id))
      .limit(1);

    if (existing.length === 0) {
      return apiError('Data prestasi tidak ditemukan', 404);
    }

    await db.delete(studentAchievements).where(eq(studentAchievements.id, id));

    return apiSuccess(null, 'Prestasi berhasil dihapus');
  } catch (err) {
    console.error('[achievements DELETE]', err);
    return apiError('Gagal menghapus prestasi', 500);
  }
}

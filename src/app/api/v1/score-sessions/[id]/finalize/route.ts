import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { scoreSessions } from '@/db/schema/scores';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = await params;
    const db = getDb();

    // Check if the score session exists
    const currentResult = await db
      .select({ status: scoreSessions.status })
      .from(scoreSessions)
      .where(eq(scoreSessions.id, id))
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Sesi nilai tidak ditemukan', 404);
    }

    if (current.status === 'locked') {
      return apiError('Sesi nilai sudah dikunci', 400);
    }

    const userRole = (session.role || '').toLowerCase();
    const isMustahiq = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
    const isSekretariat = ['sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);

    let nextStatus = 'ready';
    if (isSekretariat) {
      nextStatus = 'final';
    } else if (isMustahiq) {
      nextStatus = 'ready';
    } else {
      return apiError('Hanya pengajar atau administrator yang dapat memproses nilai', 403);
    }

    // Finalize: update status based on role
    await db
      .update(scoreSessions)
      .set({
        status: nextStatus,
        finalizedAt: new Date(),
        finalizedBy: session.userId,
        updatedAt: new Date(),
        updatedBy: session.userId,
      })
      .where(eq(scoreSessions.id, id));

    return apiSuccess(null, 'Nilai berhasil difinalisasi');
  } catch (err) {
    console.error('[score-sessions/[id]/finalize POST]', err);
    return apiError('Gagal memfinalisasi nilai', 500);
  }
}

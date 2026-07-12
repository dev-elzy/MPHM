import { eq, desc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { notifications } from '@/db/schema/notifications';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { z } from 'zod';

const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User penerima wajib diisi'),
  title: z.string().min(1, 'Judul wajib diisi'),
  message: z.string().min(1, 'Isi pesan wajib diisi'),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
});

// GET /api/v1/notifications -> Fetch notifications for logged user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const db = getDb();
    const items = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, session.userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return apiSuccess(items, 'Berhasil mengambil daftar notifikasi');
  } catch (error) {
    console.error('GET notifications error:', error);
    return apiError('Internal Server Error', 500);
  }
}

// POST /api/v1/notifications -> Created by Admin to target user
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    // Only Admin can create custom notifications
    const ALLOWED_ROLES = ['super_admin', 'admin'];
    if (!ALLOWED_ROLES.includes(session.role.toLowerCase())) {
      return apiError('Forbidden', 403);
    }

    const valResult = await validateBody(request, createNotificationSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { userId, title, message, type } = valResult.data;
    const db = getDb();
    const id = crypto.randomUUID();

    await db.insert(notifications).values({
      id,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date(),
    });

    return apiSuccess({ id }, 'Notifikasi realtime berhasil dibuat', 201);
  } catch (error) {
    console.error('POST notifications error:', error);
    return apiError('Internal Server Error', 500);
  }
}

// DELETE /api/v1/notifications -> Delete notification
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';

    const db = getDb();

    // Verify ownership or check if admin
    const currentResult = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);

    const current = currentResult[0];
    if (!current) return apiError('Not found', 404);

    const isAdmin = ['super_admin', 'admin'].includes(session.role.toLowerCase());
    if (current.userId !== session.userId && !isAdmin) {
      return apiError('Forbidden', 403);
    }

    await db.delete(notifications).where(eq(notifications.id, id));
    return apiSuccess(null, 'Notifikasi berhasil dihapus');
  } catch (error) {
    console.error('DELETE notification error:', error);
    return apiError('Internal Server Error', 500);
  }
}

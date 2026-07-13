import { desc, eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { notifications } from '@/db/schema/notifications';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    // Only Admin can see sent notifications list
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role.toLowerCase())) {
      return apiError('Forbidden', 403);
    }

    const db = getDb();
    const items = await db
      .select({
        id: notifications.id,
        title: notifications.title,
        message: notifications.message,
        type: notifications.type,
        createdAt: notifications.createdAt,
        targetUserName: users.name,
      })
      .from(notifications)
      .leftJoin(users, eq(notifications.userId, users.id))
      .orderBy(desc(notifications.createdAt))
      .limit(100);

    return apiSuccess(items, 'Berhasil mengambil daftar riwayat notifikasi');
  } catch (error) {
    console.error('GET sent notifications error:', error);
    return apiError('Internal Server Error', 500);
  }
}

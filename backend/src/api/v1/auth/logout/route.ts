import { clearSessionCookie, getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';


export async function POST() {
  try {
    const session = await getSession();
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;

    // Log the audit activity before clearing session
    if (session && d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'auth',
        action: 'logout',
        description: `User ${session.email} logged out`,
        institutionId: session.institutionId,
      });
    }

    await clearSessionCookie();

    return apiSuccess(null, 'Logout berhasil');
  } catch (error) {
    console.error('Logout API error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

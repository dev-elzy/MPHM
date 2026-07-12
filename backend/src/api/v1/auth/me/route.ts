import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';


export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    return apiSuccess({
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      roleId: session.roleId,
      institutionId: session.institutionId,
    }, 'Sesi aktif ditemukan');
  } catch (error) {
    console.error('Auth check API error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

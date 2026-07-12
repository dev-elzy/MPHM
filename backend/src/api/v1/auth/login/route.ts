import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { users } from '@/db/schema/users';
import { roles } from '@/db/schema/roles';
import { verifyPassword } from '@/lib/auth/password';
import { setSessionCookie, UserSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';

// Validation Schema
const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});


export async function POST(request: Request) {
  try {
    // 1. Validate request body
    const valResult = await validateBody(request, loginSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }
    
    const { email, password } = valResult.data;

    // 2. Resolve database instance
    // Inside Cloudflare edge/worker, get D1 binding
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // 3. Find user and their role information
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
        roleId: users.roleId,
        institutionId: users.institutionId,
        status: users.status,
        roleName: roles.name,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.email, email))
      .limit(1);

    const user = userResult[0];

    // 4. Validate user existance and state
    if (!user) {
      return apiError('Email atau password salah', 401);
    }

    if (user.status !== 'active') {
      return apiError('Akun dinonaktifkan atau ditangguhkan', 403);
    }

    // 5. Verify credentials
    const isPasswordCorrect = await verifyPassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return apiError('Email atau password salah', 401);
    }

    // 6. Create stateless session
    const resolvedRole = user.roleName || user.role; // Fallback to raw role if role table isn't populated
    
    const sessionData: UserSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: resolvedRole,
      roleId: user.roleId,
      institutionId: user.institutionId,
      createdAt: Date.now(),
    };

    await setSessionCookie(sessionData);

    // 7. Update last login timestamp in database
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // 8. Log the audit activity
    if (d1) {
      await logActivity(d1, {
        userId: user.id,
        userName: user.name,
        userRole: resolvedRole,
        module: 'auth',
        action: 'login',
        description: `User ${user.email} logged in successfully`,
        institutionId: user.institutionId,
      });
    }

    // 9. Return success
    return apiSuccess({
      id: user.id,
      name: user.name,
      email: user.email,
      role: resolvedRole,
      institutionId: user.institutionId,
    }, 'Login berhasil');

  } catch (error) {
    console.error('Login API error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

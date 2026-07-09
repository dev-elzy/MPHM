'use server';

import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { users } from '@/db/schema/users';
import { roles } from '@/db/schema/roles';
import { verifyPassword } from '@/lib/auth/password';
import { setSessionCookie, UserSession } from '@/lib/auth/session';
import { logActivity } from '@/lib/audit';
import { LoginFormData } from '../schemas/login.schema';
import { LoginResponse } from '../types';

export async function loginAction(data: LoginFormData): Promise<LoginResponse> {
  try {
    const { email, password } = data;

    // Resolve database instance
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

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

    if (!user) {
      return { success: false, message: 'Email atau password salah' };
    }

    if (user.status !== 'active') {
      return { success: false, message: 'Akun dinonaktifkan atau ditangguhkan' };
    }

    const isPasswordCorrect = await verifyPassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return { success: false, message: 'Email atau password salah' };
    }

    const resolvedRole = user.roleName || user.role;
    
    const sessionData: UserSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: resolvedRole,
      roleId: user.roleId,
      institutionId: user.institutionId,
      createdAt: Date.now(),
    };

    // Set cookie directly
    await setSessionCookie(sessionData);

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    if (d1) {
      await logActivity(d1, {
        userId: user.id,
        userName: user.name,
        userRole: resolvedRole,
        module: 'auth',
        action: 'login',
        description: `User ${user.email} logged in successfully`,
        institutionId: user.institutionId,
      }).catch(console.error);
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: resolvedRole,
        institutionId: user.institutionId,
      },
    };
  } catch (error) {
    console.error('Server action login error:', error);
    return {
      success: false,
      message: 'Koneksi ke server gagal',
    };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('mphm_session');
  } catch (error) {
    console.error('Server action logout error:', error);
  }
}


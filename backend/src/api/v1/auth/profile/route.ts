import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { users } from '@/db/schema/users';
import { getSession, setSessionCookie, UserSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

const updateProfileSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  avatarUrl: z.string().optional().nullable(),
  oldPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Kata sandi baru minimal 6 karakter').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword || data.oldPassword) {
    return !!(data.newPassword && data.oldPassword && data.confirmPassword && data.newPassword === data.confirmPassword);
  }
  return true;
}, {
  message: 'Konfirmasi kata sandi baru tidak cocok atau kata sandi lama/baru kosong',
  path: ['confirmPassword'],
});

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const valResult = await validateBody(request, updateProfileSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { name, avatarUrl, oldPassword, newPassword } = valResult.data;
    const db = getDb();

    // Fetch full user record
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return apiError('Pengguna tidak ditemukan', 404);
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
      updatedBy: session.userId,
    };

    if (name) {
      updateData.name = name;
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    if (newPassword && oldPassword) {
      const isPasswordCorrect = await verifyPassword(oldPassword, user.passwordHash);
      if (!isPasswordCorrect) {
        return apiError('Kata sandi lama yang Anda masukkan salah', 400);
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    // Execute update
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, session.userId));

    // Update active cookie session if name changed
    if (name && name !== session.name) {
      const updatedSession: UserSession = {
        ...session,
        name: name,
      };
      await setSessionCookie(updatedSession);
    }

    return apiSuccess(null, 'Profil dan pengaturan akun berhasil diperbarui');
  } catch (error) {
    console.error('Update profile API error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

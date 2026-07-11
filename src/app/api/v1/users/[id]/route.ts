import { z } from 'zod';
import { eq, and, ne } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';
import { hashPassword } from '@/lib/auth/password';


const updateUserSchema = z.object({
  email: z.string().email('Format email tidak valid').optional(),
  name: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().nullable(),
  role: z.enum(['super_admin', 'admin', 'operator', 'mustahiq', 'mudir']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  phone: z.string().optional().nullable(),
});

// GET /api/v1/users/[id]
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

    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        status: users.status,
        phone: users.phone,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(
        and(
          eq(users.id, id),
          eq(users.institutionId, session.institutionId),
          notDeleted(users)
        )
      )
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return apiError('Pengguna tidak ditemukan', 404);
    }

    return apiSuccess(user, 'Berhasil mengambil detail pengguna');

  } catch (error) {
    console.error('GET user detail error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// PATCH /api/v1/users/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only admin and super_admin can modify other users
    const ALLOWED_ROLES = ['super_admin', 'admin'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengubah data pengguna', 403);
    }

    const { id } = await params;
    
    const valResult = await validateBody(request, updateUserSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { password, ...updateFields } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify user exists in this institution
    const currentResult = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.id, id),
          eq(users.institutionId, session.institutionId),
          notDeleted(users)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Pengguna tidak ditemukan', 404);
    }

    // Verify duplicate email if changed
    if (updateFields.email && updateFields.email !== current.email) {
      const duplicate = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.email, updateFields.email.toLowerCase().trim()),
            eq(users.institutionId, session.institutionId),
            ne(users.id, id),
            notDeleted(users)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return apiError(`Pengguna dengan email ${updateFields.email} sudah terdaftar`, 409);
      }
    }

    // Prepare update payload
    const updateData: Record<string, unknown> = {
      ...updateFields,
      updatedAt: new Date(),
      updatedBy: session.userId,
    };

    if (updateFields.email) {
      updateData.email = updateFields.email.toLowerCase().trim();
    }

    if (password) {
      updateData.passwordHash = await hashPassword(password);
    }

    // Execute update
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'user',
        action: 'update',
        entityId: id,
        entityType: 'user',
        description: `Profil pengguna "${current.name}" diperbarui`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Pengguna berhasil diperbarui');

  } catch (error) {
    console.error('PATCH user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// DELETE /api/v1/users/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin
    const ALLOWED_ROLES = ['super_admin', 'admin'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk menghapus pengguna', 403);
    }

    const { id } = await params;
    
    // Safety check: Prevent deleting self
    if (id === session.userId) {
      return apiError('Anda tidak dapat menghapus akun Anda sendiri', 400);
    }

    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify user exists in this institution
    const currentResult = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(
        and(
          eq(users.id, id),
          eq(users.institutionId, session.institutionId),
          notDeleted(users)
        )
      )
      .limit(1);

    const current = currentResult[0];
    if (!current) {
      return apiError('Pengguna tidak ditemukan', 404);
    }

    // Soft delete
    await db
      .update(users)
      .set({
        deletedAt: new Date(),
        deletedBy: session.userId,
      })
      .where(eq(users.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'user',
        action: 'delete',
        entityId: id,
        entityType: 'user',
        oldData: current,
        description: `Pengguna "${current.name}" dipindahkan ke Recycle Bin (Soft Delete)`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Pengguna berhasil dihapus');

  } catch (error) {
    console.error('DELETE user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

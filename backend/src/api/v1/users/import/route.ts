import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { notDeleted } from '@/lib/soft-delete';
import { hashPassword } from '@/lib/auth/password';
import { logActivity } from '@/lib/audit';
import { checkRole } from '@/lib/auth/rbac';

const importUserSchema = z.object({
  items: z.array(
    z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(['sekretariat', 'mustahiq', 'mudir']),
      phone: z.string().optional().nullable(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    // RBAC: Only super_admin and admin can import users
    const rbac = checkRole(session, ['sekretariat']);
    if (!rbac.authorized) return rbac.response!;

    const body = await validateBody(request, importUserSchema);
    if (!body.success) return body.errorResponse;

    const { items } = body.data;
    const db = getDb();
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;

    const createdIds: string[] = [];

    for (const item of items) {
      // Check duplicate email
      const duplicate = await db
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            eq(users.email, item.email.toLowerCase().trim()),
            eq(users.institutionId, session.institutionId),
            notDeleted(users)
          )
        )
        .limit(1);

      const hashedPassword = await hashPassword(item.password);

      if (duplicate.length > 0) {
        // Update user
        await db
          .update(users)
          .set({
            name: item.name,
            passwordHash: hashedPassword,
            role: item.role,
            phone: item.phone || null,
            updatedBy: session.userId,
            updatedAt: new Date(),
          })
          .where(eq(users.id, duplicate[0].id));
      } else {
        // Insert new user
        const id = crypto.randomUUID();
        await db.insert(users).values({
          id,
          institutionId: session.institutionId,
          email: item.email.toLowerCase().trim(),
          name: item.name,
          passwordHash: hashedPassword,
          role: item.role,
          status: 'active',
          phone: item.phone || null,
          createdBy: session.userId,
          updatedBy: session.userId,
        });
        createdIds.push(id);
      }
    }

    // Audit logging
    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'users',
        action: 'import',
        description: `Mengimpor ${items.length} pengguna baru`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ importedCount: items.length }, 'Pengguna berhasil diimpor');

  } catch (error) {
    console.error('[users-import POST]', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

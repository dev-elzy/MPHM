import { z } from 'zod';
import { eq, and, or, like, SQL } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { validateBody, validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { notDeleted } from '@/lib/soft-delete';
import { hashPassword } from '@/lib/auth/password';
import { logActivity } from '@/lib/audit';


// Validation schemas
const createUserSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['super_admin', 'admin', 'operator', 'mustahiq', 'mudir']),
  status: z.enum(['active', 'inactive']).default('active'),
  phone: z.string().optional().nullable(),
});

const queryParamsSchema = z.object({
  role: z.string().optional(),
  search: z.string().optional(),
});

// GET /api/v1/users
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin, mudir
    const ALLOWED_ROLES = ['super_admin', 'admin', 'mudir', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk melihat daftar pengguna', 403);
    }

    const valParams = validateQueryParams(request.url, queryParamsSchema);
    if (!valParams.success) {
      return valParams.errorResponse;
    }

    const { role, search } = valParams.data;
    const db = getDb();

    // Query users belonging to the same institution
    const conditions: SQL[] = [
      eq(users.institutionId, session.institutionId),
      notDeleted(users),
    ].filter(Boolean) as SQL[];

    if (role) {
      conditions.push(eq(users.role, role));
    }
    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        ) as SQL
      );
    }

    const items = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        phone: users.phone,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(...conditions))
      .orderBy(users.name);

    return apiSuccess(items, 'Berhasil mengambil daftar pengguna');

  } catch (error) {
    console.error('GET users error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// POST /api/v1/users
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin and admin can create users
    const ALLOWED_ROLES = ['super_admin', 'admin'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk membuat pengguna baru', 403);
    }

    const valResult = await validateBody(request, createUserSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { email, name, password, role, status, phone } = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Check duplicate email
    const duplicate = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email.toLowerCase().trim()),
          eq(users.institutionId, session.institutionId),
          notDeleted(users)
        )
      )
      .limit(1);

    if (duplicate.length > 0) {
      return apiError(`Pengguna dengan email ${email} sudah terdaftar`, 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const newUserId = crypto.randomUUID();

    // Insert User
    await db.insert(users).values({
      id: newUserId,
      institutionId: session.institutionId,
      email: email.toLowerCase().trim(),
      name,
      passwordHash,
      role,
      status,
      phone: phone || null,
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'user',
        action: 'create',
        entityId: newUserId,
        entityType: 'user',
        newData: { email, name, role },
        description: `Pengguna baru "${name}" (${role}) berhasil dibuat`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ id: newUserId }, 'Pengguna baru berhasil dibuat', 201);

  } catch (error) {
    console.error('POST user error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

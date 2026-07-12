import { eq, and, desc, count } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { auditLogs } from '@/db/schema/audit-logs';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/pagination';


export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const url = new URL(request.url);
    const moduleName = url.searchParams.get('module');
    const userId = url.searchParams.get('userId');
    const { limit, offset, page } = getPaginationParams(request.url);
    const db = getDb();

    const conditions = [
      eq(auditLogs.institutionId, session.institutionId),
    ];

    if (moduleName) conditions.push(eq(auditLogs.module, moduleName));
    if (userId) conditions.push(eq(auditLogs.userId, userId));

    const rows = await db
      .select({
        id: auditLogs.id,
        module: auditLogs.module,
        action: auditLogs.action,
        userId: auditLogs.userId,
        userName: users.name,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const totalRows = await db
      .select({ count: count() })
      .from(auditLogs)
      .where(and(...conditions));

    return apiSuccess({
      items: rows,
      meta: getPaginationMeta(totalRows[0]?.count ?? 0, page, limit),
    });
  } catch (err) {
    console.error('[audit-logs GET]', err);
    return apiError('Gagal mengambil audit log', 500);
  }
}

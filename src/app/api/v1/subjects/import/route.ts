import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { subjects } from '@/db/schema/curriculums';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { notDeleted } from '@/lib/soft-delete';
import { logActivity } from '@/lib/audit';
import { checkRole } from '@/lib/auth/rbac';

const importSubjectSchema = z.object({
  items: z.array(
    z.object({
      code: z.string().min(1, 'Kode pelajaran wajib diisi'),
      name: z.string().min(1, 'Nama pelajaran wajib diisi'),
      arabicName: z.string().optional().nullable(),
      category: z.enum(['KMI', 'Kepesantrenan', 'Tahfidz', 'Umum']),
      description: z.string().optional().nullable(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    // RBAC: super_admin, admin, and operator can import subjects
    const rbac = checkRole(session, ['super_admin', 'admin', 'operator']);
    if (!rbac.authorized) return rbac.response!;

    const body = await validateBody(request, importSubjectSchema);
    if (!body.success) return body.errorResponse;

    const { items } = body.data;
    const db = getDb();
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;

    const createdIds: string[] = [];

    for (const item of items) {
      // Check duplicate code
      const duplicate = await db
        .select({ id: subjects.id })
        .from(subjects)
        .where(
          and(
            eq(subjects.code, item.code),
            eq(subjects.institutionId, session.institutionId),
            notDeleted(subjects)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        // Update if duplicate code
        await db
          .update(subjects)
          .set({
            name: item.name,
            arabicName: item.arabicName || null,
            category: item.category,
            description: item.description || null,
            updatedBy: session.userId,
            updatedAt: new Date(),
          })
          .where(eq(subjects.id, duplicate[0].id));
      } else {
        // Insert new subject
        const id = crypto.randomUUID();
        await db.insert(subjects).values({
          id,
          institutionId: session.institutionId,
          code: item.code,
          name: item.name,
          arabicName: item.arabicName || null,
          category: item.category,
          description: item.description || null,
          status: 'active',
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
        module: 'subjects',
        action: 'import',
        description: `Mengimpor ${items.length} mata pelajaran`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ importedCount: items.length }, 'Mata pelajaran berhasil diimpor');

  } catch (error) {
    console.error('[subjects-import POST]', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { classes } from '@/db/schema/classes';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { notDeleted } from '@/lib/soft-delete';
import { logActivity } from '@/lib/audit';
import { checkRole } from '@/lib/auth/rbac';

const importClassSchema = z.object({
  academicYearId: z.string().uuid(),
  semesterId: z.string().uuid().optional().nullable(),
  curriculumId: z.string().uuid().optional().nullable(),
  items: z.array(
    z.object({
      name: z.string().min(1),
      jenjang: z.enum(['idadiyyah', 'ibtidaiyyah', 'tsanawiyyah', 'aliyyah']),
      tingkat: z.string().min(1),
      description: z.string().optional().nullable(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    // RBAC: super_admin, admin, and operator can import classes
    const rbac = checkRole(session, ['super_admin', 'admin', 'operator']);
    if (!rbac.authorized) return rbac.response!;

    const body = await validateBody(request, importClassSchema);
    if (!body.success) return body.errorResponse;

    const { academicYearId, semesterId, curriculumId, items } = body.data;
    const db = getDb();
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;

    // Verify academic year belongs to user's institution
    const yearCheck = await db
      .select({ id: academicYears.id })
      .from(academicYears)
      .where(and(eq(academicYears.id, academicYearId), eq(academicYears.institutionId, session.institutionId)))
      .limit(1);

    if (yearCheck.length === 0) {
      return apiError('Tahun ajaran tidak ditemukan atau bukan milik institusi Anda', 403);
    }

    const createdIds: string[] = [];

    for (const item of items) {
      // Robustly resolve "bagian" (e.g. A, B, C)
      let bagian = 'A';
      if (item.description && item.description.trim().length === 1) {
        bagian = item.description.trim().toUpperCase();
      } else {
        const parts = item.name.split('-');
        const lastPart = parts[parts.length - 1]?.trim();
        if (lastPart && lastPart.length === 1) {
          bagian = lastPart.toUpperCase();
        } else {
          // Fallback: take the last character of class name
          const lastChar = item.name.trim().slice(-1);
          if (/[A-Z]/i.test(lastChar)) {
            bagian = lastChar.toUpperCase();
          }
        }
      }

      // Check duplicate class identity
      const duplicate = await db
        .select({ id: classes.id })
        .from(classes)
        .where(
          and(
            eq(classes.academicYearId, academicYearId),
            eq(classes.jenjang, item.jenjang),
            eq(classes.tingkat, item.tingkat),
            eq(classes.bagian, bagian),
            notDeleted(classes)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        // Update existing class name & details
        await db
          .update(classes)
          .set({
            name: item.name,
            curriculumId: curriculumId || null,
            semesterId: semesterId || null,
            updatedBy: session.userId,
            updatedAt: new Date(),
          })
          .where(eq(classes.id, duplicate[0].id));
      } else {
        // Create new class
        const id = crypto.randomUUID();
        await db.insert(classes).values({
          id,
          academicYearId,
          semesterId: semesterId || null,
          curriculumId: curriculumId || null,
          jenjang: item.jenjang,
          tingkat: item.tingkat,
          bagian,
          name: item.name,
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
        module: 'classes',
        action: 'import',
        description: `Mengimpor ${items.length} kelas baru`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ importedCount: items.length }, 'Kelas berhasil diimpor');

  } catch (error) {
    console.error('[classes-import POST]', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

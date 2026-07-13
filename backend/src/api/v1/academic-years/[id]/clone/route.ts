import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { academicYears, academicSettings } from '@/db/schema/academic-years';
import { curriculums, curriculumSubjects } from '@/db/schema/curriculums';
import { classes } from '@/db/schema/classes';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


const cloneSchema = z.object({
  targetYearId: z.string().uuid('ID tahun ajaran tujuan harus berupa UUID'),
});

// POST /api/v1/academic-years/[id]/clone
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin and admin can clone setups
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengkloning data akademik', 403);
    }

    const { id: sourceYearId } = await params;
    
    const valResult = await validateBody(request, cloneSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { targetYearId } = valResult.data;

    if (sourceYearId === targetYearId) {
      return apiError('Tahun ajaran sumber dan tujuan tidak boleh sama', 400);
    }

    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify source and target year exist
    const sourceYear = (
      await db
        .select()
        .from(academicYears)
        .where(
          and(
            eq(academicYears.id, sourceYearId),
            eq(academicYears.institutionId, session.institutionId),
            notDeleted(academicYears)
          )
        )
        .limit(1)
    )[0];

    const targetYear = (
      await db
        .select()
        .from(academicYears)
        .where(
          and(
            eq(academicYears.id, targetYearId),
            eq(academicYears.institutionId, session.institutionId),
            notDeleted(academicYears)
          )
        )
        .limit(1)
    )[0];

    if (!sourceYear) return apiError('Tahun ajaran sumber tidak ditemukan', 404);
    if (!targetYear) return apiError('Tahun ajaran tujuan tidak ditemukan', 404);

    // Cloning logic inside a transaction
    await db.transaction(async (tx) => {
      // 1. Clone Academic Settings
      const sourceSettings = await tx
        .select()
        .from(academicSettings)
        .where(eq(academicSettings.academicYearId, sourceYearId));

      if (sourceSettings.length > 0) {
        const newSettings = sourceSettings.map((s) => ({
          id: crypto.randomUUID(),
          academicYearId: targetYearId,
          key: s.key,
          value: s.value,
          description: s.description,
        }));
        await tx.insert(academicSettings).values(newSettings);
      }

      // 2. Clone Curriculums & Subjects Link
      const sourceCurriculums = await tx
        .select()
        .from(curriculums)
        .where(and(eq(curriculums.academicYearId, sourceYearId), notDeleted(curriculums)));

      for (const curr of sourceCurriculums) {
        const newCurrid = crypto.randomUUID();

        // 2a. Insert cloned curriculum
        await tx.insert(curriculums).values({
          id: newCurrid,
          academicYearId: targetYearId,
          name: curr.name,
          description: curr.description,
          status: 'active',
          createdBy: session.userId,
          updatedBy: session.userId,
        });

        // 2b. Query subjects bound to this curriculum
        const boundSubjects = await tx
          .select()
          .from(curriculumSubjects)
          .where(eq(curriculumSubjects.curriculumId, curr.id));

        if (boundSubjects.length > 0) {
          const newBound = boundSubjects.map((bs) => ({
            id: crypto.randomUUID(),
            curriculumId: newCurrid,
            subjectId: bs.subjectId,
            sortOrder: bs.sortOrder,
            maxScore: bs.maxScore,
            minScore: bs.minScore,
            weight: bs.weight,
            status: bs.status,
            notes: bs.notes,
          }));
          await tx.insert(curriculumSubjects).values(newBound);
        }

        // 2c. Clone Classes that are bound to this curriculum
        const sourceClasses = await tx
          .select()
          .from(classes)
          .where(
            and(
              eq(classes.academicYearId, sourceYearId),
              eq(classes.curriculumId, curr.id),
              notDeleted(classes)
            )
          );

        if (sourceClasses.length > 0) {
          const newClasses = sourceClasses.map((c) => ({
            id: crypto.randomUUID(),
            academicYearId: targetYearId,
            curriculumId: newCurrid,
            jenjang: c.jenjang,
            tingkat: c.tingkat,
            bagian: c.bagian,
            name: c.name,
            status: 'active',
            createdBy: session.userId,
            updatedBy: session.userId,
          }));
          await tx.insert(classes).values(newClasses);
        }
      }
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'academic_year',
        action: 'clone',
        entityId: targetYearId,
        entityType: 'academic_year',
        description: `Struktur data akademik dari tahun ajaran "${sourceYear.name}" dikloning ke "${targetYear.name}"`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Struktur tahun ajaran berhasil dikloning');

  } catch (error) {
    console.error('Clone academic year error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

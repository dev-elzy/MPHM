import { getDb } from '@/db/client';
import { classEnrollments, academicClasses, studentProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

interface PromotionItem {
  enrollmentId: string;
  studentProfileId: string;
  decision: 'PROMOTED' | 'RETAINED' | 'BOYONG' | 'GRADUATED';
  targetClassId?: string; // required if PROMOTED or RETAINED
}

interface PromotionEngineRequest {
  fromAcademicYearId: string;
  toAcademicYearId: string;
  promotions: PromotionItem[];
}

/**
 * Promotion Engine API
 * Core Business Process: Evaluates and promotes/retains/graduates students cleanly
 * Preserves 100% of historical records.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);

    const body = (await request.json()) as PromotionEngineRequest;
    if (!body.fromAcademicYearId || !body.toAcademicYearId || !Array.isArray(body.promotions) || body.promotions.length === 0) {
      return apiError('Parameter promosi (Tahun Ajaran Asal, Tujuan, dan daftar santri) wajib diisi', 400);
    }

    const db = getDb();

    let promotedCount = 0;
    let retainedCount = 0;
    let graduatedCount = 0;
    let boyongCount = 0;

    for (const item of body.promotions) {
      // 1. Validate existing enrollment
      const currentRows = await db
        .select()
        .from(classEnrollments)
        .where(eq(classEnrollments.id, item.enrollmentId));
      if (currentRows.length === 0) continue;
      const currentEnroll = currentRows[0];

      // 2. Mark historical record with decision status
      await db
        .update(classEnrollments)
        .set({ status: item.decision })
        .where(eq(classEnrollments.id, item.enrollmentId));

      // 3. Create target enrollment if PROMOTED or RETAINED
      if ((item.decision === 'PROMOTED' || item.decision === 'RETAINED') && item.targetClassId) {
        // Check target class
        const targetClassRows = await db
          .select()
          .from(academicClasses)
          .where(eq(academicClasses.id, item.targetClassId));
        if (targetClassRows.length > 0) {
          const newEnrollId = `enroll-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
          await db.insert(classEnrollments).values({
            id: newEnrollId,
            academicYearId: body.toAcademicYearId,
            classId: item.targetClassId,
            studentProfileId: item.studentProfileId,
            status: 'ACTIVE',
            notes: `Promoted via Promotion Engine (${item.decision}) from ${currentEnroll.classId}`,
          });
        }
        if (item.decision === 'PROMOTED') promotedCount++;
        else retainedCount++;
      } else if (item.decision === 'GRADUATED') {
        // Update student profile status to Alumni without deleting people identity
        await db
          .update(studentProfiles)
          .set({ status: 'alumni' })
          .where(eq(studentProfiles.id, item.studentProfileId));
        graduatedCount++;
      } else if (item.decision === 'BOYONG') {
        await db
          .update(studentProfiles)
          .set({ status: 'boyong' })
          .where(eq(studentProfiles.id, item.studentProfileId));
        boyongCount++;
      }
    }

    return apiSuccess(
      { promotedCount, retainedCount, graduatedCount, boyongCount },
      `Proses kenaikan kelas selesai: ${promotedCount} Naik Kelas, ${retainedCount} Tinggal Kelas, ${graduatedCount} Lulus, ${boyongCount} Boyong.`,
      200
    );
  } catch (error: unknown) {
    console.error('POST /api/v1/academic/promote Error:', error);
    return apiError('Terjadi kesalahan internal saat memproses kenaikan kelas', 500);
  }
}

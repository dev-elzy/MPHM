import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { scoreSessions } from '@/db/schema/scores';
import { curriculumSubjects } from '@/db/schema/curriculums';
import { subjects } from '@/db/schema/curriculums';
import { classes } from '@/db/schema/classes';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = await params;
    const db = getDb();

    const rows = await db
      .select({
        id: scoreSessions.id,
        academicYearId: scoreSessions.academicYearId,
        semesterId: scoreSessions.semesterId,
        classId: scoreSessions.classId,
        curriculumSubjectId: scoreSessions.curriculumSubjectId,
        status: scoreSessions.status,
        finalizedAt: scoreSessions.finalizedAt,
        lockedAt: scoreSessions.lockedAt,
        createdAt: scoreSessions.createdAt,
        updatedAt: scoreSessions.updatedAt,
        subjectName: subjects.name,
        className: classes.name,
        maxScore: curriculumSubjects.maxScore,
        minScore: curriculumSubjects.minScore,
        weight: curriculumSubjects.weight,
      })
      .from(scoreSessions)
      .leftJoin(curriculumSubjects, eq(scoreSessions.curriculumSubjectId, curriculumSubjects.id))
      .leftJoin(subjects, eq(curriculumSubjects.subjectId, subjects.id))
      .leftJoin(classes, eq(scoreSessions.classId, classes.id))
      .where(eq(scoreSessions.id, id))
      .limit(1);

    const data = rows[0];
    if (!data) {
      return apiError('Sesi nilai tidak ditemukan', 404);
    }

    return apiSuccess(data);
  } catch (err) {
    console.error('[score-sessions/[id] GET]', err);
    return apiError('Gagal mengambil detail sesi nilai', 500);
  }
}

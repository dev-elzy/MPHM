import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { scores, scoreSessions, scoreResults } from '@/db/schema/scores';
import { classStudents } from '@/db/schema/students';
import { students } from '@/db/schema/students';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const { id: sessionId } = await params;
    const db = getDb();

    // 1. Fetch the classId and semesterId of this score session
    const sessionResult = await db
      .select({
        classId: scoreSessions.classId,
        semesterId: scoreSessions.semesterId,
      })
      .from(scoreSessions)
      .where(eq(scoreSessions.id, sessionId))
      .limit(1);

    if (sessionResult.length === 0) {
      return apiError('Sesi nilai tidak ditemukan', 404);
    }

    const { classId, semesterId } = sessionResult[0];

    // 2. Fetch all students enrolled in this class/semester
    const enrolledStudents = await db
      .select({
        studentId: students.id,
        studentName: students.name,
        studentNis: students.nis,
      })
      .from(classStudents)
      .leftJoin(students, eq(classStudents.studentId, students.id))
      .where(
        and(
          eq(classStudents.classId, classId),
          eq(classStudents.semesterId, semesterId)
        )
      );

    // 3. Fetch all scores for this session
    const sessionScores = await db
      .select()
      .from(scores)
      .where(eq(scores.scoreSessionId, sessionId));

    // 4. Fetch score results
    const results = await db
      .select()
      .from(scoreResults)
      .where(eq(scoreResults.scoreSessionId, sessionId));

    // 5. Merge into grid rows
    const rows = enrolledStudents.map((s) => {
      const tamrin = sessionScores.find(
        (sc) => sc.studentId === s.studentId && sc.scoreType === 'tamrin'
      );
      const ujian = sessionScores.find(
        (sc) => sc.studentId === s.studentId && sc.scoreType === 'ujian'
      );
      const result = results.find((r) => r.studentId === s.studentId);

      return {
        studentId: s.studentId,
        studentName: s.studentName,
        studentNis: s.studentNis,
        tamrinScore: tamrin?.score ?? null,
        ujianScore: ujian?.score ?? null,
        khosScore: result?.khosScore ?? null,
        amScore: result?.amScore ?? null,
        finalScore: result?.finalScore ?? null,
        predicate: result?.predicate ?? null,
        ranking: result?.ranking ?? null,
        passed: result?.passed ?? null,
      };
    });

    return apiSuccess(rows);
  } catch (err) {
    console.error('[score-sessions/[id]/entries GET]', err);
    return apiError('Gagal mengambil data nilai', 500);
  }
}

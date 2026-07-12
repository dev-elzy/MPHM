import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { scoreSessions, scores, scoreResults } from '@/db/schema/scores';
import { curriculumSubjects, subjects } from '@/db/schema/curriculums';
import { classStudents } from '@/db/schema/students';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = await params;
    const db = getDb();

    // Check if the score session exists and join curriculum/subject details
    const sessionDetails = await db
      .select({
        id: scoreSessions.id,
        status: scoreSessions.status,
        minScore: curriculumSubjects.minScore,
        category: subjects.category,
        classId: scoreSessions.classId,
        semesterId: scoreSessions.semesterId,
        academicYearId: scoreSessions.academicYearId,
      })
      .from(scoreSessions)
      .innerJoin(curriculumSubjects, eq(scoreSessions.curriculumSubjectId, curriculumSubjects.id))
      .innerJoin(subjects, eq(curriculumSubjects.subjectId, subjects.id))
      .where(eq(scoreSessions.id, id))
      .limit(1);

    const current = sessionDetails[0];
    if (!current) {
      return apiError('Sesi nilai tidak ditemukan', 404);
    }

    if (current.status === 'locked') {
      return apiError('Sesi nilai sudah dikunci', 400);
    }

    const userRole = (session.role || '').toLowerCase();
    const isMustahiq = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
    const isSekretariat = ['sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);

    let nextStatus = 'ready';
    if (isSekretariat) {
      nextStatus = 'final';
    } else if (isMustahiq) {
      nextStatus = 'ready';
    } else {
      return apiError('Hanya pengajar atau administrator yang dapat memproses nilai', 403);
    }

    // Get list of active students in class
    const enrolledStudents = await db
      .select({ studentId: classStudents.studentId })
      .from(classStudents)
      .where(
        and(
          eq(classStudents.academicYearId, current.academicYearId),
          eq(classStudents.semesterId, current.semesterId),
          eq(classStudents.classId, current.classId),
          eq(classStudents.status, 'active')
        )
      );

    // Get all scores for this session
    const sessionScores = await db
      .select()
      .from(scores)
      .where(eq(scores.scoreSessionId, id));

    const computedResults: {
      studentId: string;
      khosScore: number | null;
      amScore: number | null;
      finalScore: number;
      predicate: string;
      passed: boolean;
    }[] = [];

    const isKhos = current.category?.toLowerCase() === 'khos';
    const minScore = current.minScore ?? 60;

    for (const student of enrolledStudents) {
      const studentScores = sessionScores.filter((s) => s.studentId === student.studentId);
      const tamrin = studentScores.find((s) => s.scoreType === 'tamrin')?.score ?? 0;
      const uts = studentScores.find((s) => s.scoreType === 'uts')?.score ?? 0;
      const uas = studentScores.find((s) => s.scoreType === 'uas')?.score ?? 0;

      // Formula: 40% Tamrin, 30% UTS, 30% UAS
      const finalScore = Math.round((tamrin * 0.4) + (uts * 0.3) + (uas * 0.3));

      // Grade letters
      let predicate = 'D';
      if (finalScore >= 85) predicate = 'A';
      else if (finalScore >= 75) predicate = 'B';
      else if (finalScore >= 60) predicate = 'C';

      const passed = finalScore >= minScore;

      computedResults.push({
        studentId: student.studentId,
        khosScore: isKhos ? finalScore : null,
        amScore: !isKhos ? finalScore : null,
        finalScore,
        predicate,
        passed,
      });
    }

    // Determine rankings based on finalScore descending
    const sorted = [...computedResults].sort((a, b) => b.finalScore - a.finalScore);
    const rankings = new Map<string, number>();
    sorted.forEach((item, index) => {
      rankings.set(item.studentId, index + 1);
    });

    // Upsert computed results to score_results table
    for (const res of computedResults) {
      const rank = rankings.get(res.studentId) || 0;

      const existing = await db
        .select({ id: scoreResults.id })
        .from(scoreResults)
        .where(
          and(
            eq(scoreResults.scoreSessionId, id),
            eq(scoreResults.studentId, res.studentId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(scoreResults)
          .set({
            khosScore: res.khosScore,
            amScore: res.amScore,
            finalScore: res.finalScore,
            predicate: res.predicate,
            ranking: rank,
            passed: res.passed,
            updatedAt: new Date(),
          })
          .where(eq(scoreResults.id, existing[0].id));
      } else {
        await db.insert(scoreResults).values({
          id: crypto.randomUUID(),
          scoreSessionId: id,
          studentId: res.studentId,
          khosScore: res.khosScore,
          amScore: res.amScore,
          finalScore: res.finalScore,
          predicate: res.predicate,
          ranking: rank,
          passed: res.passed,
        });
      }
    }

    // Finalize: update status based on role
    await db
      .update(scoreSessions)
      .set({
        status: nextStatus,
        finalizedAt: new Date(),
        finalizedBy: session.userId,
        updatedAt: new Date(),
        updatedBy: session.userId,
      })
      .where(eq(scoreSessions.id, id));

    return apiSuccess(null, 'Nilai berhasil difinalisasi dan dikalkulasi');
  } catch (err) {
    console.error('[score-sessions/[id]/finalize POST]', err);
    return apiError('Gagal memfinalisasi nilai', 500);
  }
}

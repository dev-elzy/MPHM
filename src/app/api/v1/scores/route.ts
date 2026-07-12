import { z } from 'zod';
import { eq, and, SQL } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { scores, scoreSessions, scoreResults } from '@/db/schema/scores';
import { classStudents } from '@/db/schema/students';
import { students } from '@/db/schema/students';
import { classAssignments } from '@/db/schema/classes';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';


const saveScoreSchema = z.object({
  scoreSessionId: z.string().min(1),
  studentId: z.string().min(1),
  scoreType: z.enum(['tamrin', 'uts', 'uas']),
  score: z.number().min(0).max(100).nullable(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const url = new URL(request.url);
    const sessionId = url.searchParams.get('scoreSessionId');
    const classId = url.searchParams.get('classId');
    const semesterId = url.searchParams.get('semesterId');

    if (!sessionId) return apiError('scoreSessionId diperlukan', 400);

    const db = getDb();

    // Get all students enrolled in this class/semester
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
          ...[
            classId ? eq(classStudents.classId, classId) : undefined,
            semesterId ? eq(classStudents.semesterId, semesterId) : undefined,
          ].filter(Boolean) as SQL[]
        )
      );

    // Get all scores for this session
    const sessionScores = await db
      .select()
      .from(scores)
      .where(eq(scores.scoreSessionId, sessionId));

    // Get score results
    const results = await db
      .select()
      .from(scoreResults)
      .where(eq(scoreResults.scoreSessionId, sessionId));

    // Merge into grid rows
    const rows = enrolledStudents.map((s) => {
      const tamrin = sessionScores.find(
        (sc) => sc.studentId === s.studentId && sc.scoreType === 'tamrin'
      );
      const uts = sessionScores.find(
        (sc) => sc.studentId === s.studentId && sc.scoreType === 'uts'
      );
      const uas = sessionScores.find(
        (sc) => sc.studentId === s.studentId && sc.scoreType === 'uas'
      );
      const result = results.find((r) => r.studentId === s.studentId);

      return {
        studentId: s.studentId,
        studentName: s.studentName,
        studentNis: s.studentNis,
        tamrinScore: tamrin?.score ?? null,
        utsScore: uts?.score ?? null,
        uasScore: uas?.score ?? null,
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
    console.error('[scores GET]', err);
    return apiError('Gagal mengambil data nilai', 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const body = await validateBody(request, saveScoreSchema);
    if (!body.success) return body.errorResponse;

    const { scoreSessionId, studentId, scoreType, score, notes } = body.data;
    const db = getDb();

    // Check session exists and is not locked
    const scoreSession = await db
      .select({ status: scoreSessions.status, classId: scoreSessions.classId })
      .from(scoreSessions)
      .where(eq(scoreSessions.id, scoreSessionId))
      .limit(1);

    if (!scoreSession.length) return apiError('Sesi nilai tidak ditemukan', 404);
    if (scoreSession[0].status === 'locked') return apiError('Nilai sudah dikunci, tidak dapat diubah', 403);

    const userRole = (session.role || '').toLowerCase();
    const isMustahiq = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
    const isSekretariat = ['sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);

    if (!isMustahiq && !isSekretariat) {
      return apiError('Anda tidak memiliki izin untuk mengedit nilai', 403);
    }

    if (isMustahiq) {
      const assignment = await db
        .select({ classId: classAssignments.classId })
        .from(classAssignments)
        .where(
          and(
            eq(classAssignments.userId, session.userId),
            eq(classAssignments.classId, scoreSession[0].classId),
            eq(classAssignments.status, 'active')
          )
        )
        .limit(1);

      if (assignment.length === 0) {
        return apiError('Anda tidak memiliki akses ke kelas ini', 403);
      }
    }

    // Upsert score
    const existing = await db
      .select({ id: scores.id })
      .from(scores)
      .where(
        and(
          eq(scores.scoreSessionId, scoreSessionId),
          eq(scores.studentId, studentId),
          eq(scores.scoreType, scoreType)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(scores)
        .set({
          score,
          notes: notes || null,
          updatedAt: new Date(),
          updatedBy: session.userId,
        })
        .where(eq(scores.id, existing[0].id));

      return apiSuccess({ id: existing[0].id }, 'Nilai berhasil diperbarui');
    } else {
      const id = crypto.randomUUID();
      await db.insert(scores).values({
        id,
        scoreSessionId,
        studentId,
        scoreType,
        score,
        notes: notes || null,
        updatedBy: session.userId,
      });

      return apiSuccess({ id }, 'Nilai berhasil disimpan', 201);
    }
  } catch (err) {
    console.error('[scores PATCH]', err);
    return apiError('Gagal menyimpan nilai', 500);
  }
}

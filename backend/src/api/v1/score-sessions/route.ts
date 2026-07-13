import { z } from 'zod';
import { eq, and, SQL, count } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { scoreSessions } from '@/db/schema/scores';
import { curriculumSubjects } from '@/db/schema/curriculums';
import { subjects } from '@/db/schema/curriculums';
import { classes, classAssignments } from '@/db/schema/classes';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateBody, validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/pagination';


const createSessionSchema = z.object({
  academicYearId: z.string().min(1),
  semesterId: z.string().min(1),
  classId: z.string().min(1),
  curriculumSubjectId: z.string().min(1),
});

const querySchema = z.object({
  academicYearId: z.string().optional(),
  semesterId: z.string().optional(),
  classId: z.string().optional(),
  status: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const params = validateQueryParams(request.url, querySchema);
    if (!params.success) return params.errorResponse;

    const { academicYearId, semesterId, classId, status } = params.data;
    const { limit, offset, page } = getPaginationParams(request.url);
    const db = getDb();

    // Multi-tenant isolation: verify academicYear belongs to user's institution
    if (academicYearId) {
      const yearCheck = await db
        .select({ id: academicYears.id })
        .from(academicYears)
        .where(and(eq(academicYears.id, academicYearId), eq(academicYears.institutionId, session.institutionId)))
        .limit(1);
      if (yearCheck.length === 0) {
        return apiError('Tahun ajaran tidak ditemukan atau bukan milik institusi Anda', 403);
      }
    }

    const userRole = (session.role || '').toLowerCase();
    const isMustahiq = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
    let activeClassId = classId;

    if (isMustahiq) {
      const assignments = await db
        .select({ classId: classAssignments.classId })
        .from(classAssignments)
        .where(
          and(
            eq(classAssignments.userId, session.userId),
            eq(classAssignments.status, 'active')
          )
        );
      
      const mustahiqClassIds = assignments.map((a) => a.classId);
      if (mustahiqClassIds.length === 0) {
        return apiSuccess({ items: [], meta: getPaginationMeta(0, page, limit) }, 'Berhasil mengambil sesi nilai');
      }

      if (classId) {
        if (!mustahiqClassIds.includes(classId)) {
          return apiError('Anda tidak memiliki akses ke kelas ini', 403);
        }
      } else {
        activeClassId = mustahiqClassIds[0];
      }
    }
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
      .where(
        and(
          ...[
            academicYearId ? eq(scoreSessions.academicYearId, academicYearId) : undefined,
            semesterId ? eq(scoreSessions.semesterId, semesterId) : undefined,
            activeClassId ? eq(scoreSessions.classId, activeClassId) : undefined,
            status ? eq(scoreSessions.status, status) : undefined,
          ].filter(Boolean) as SQL[]
        )
      )
      .limit(limit)
      .offset(offset);

    const totalRow = await db
      .select({ count: count() })
      .from(scoreSessions)
      .where(
        and(
          ...[
            academicYearId ? eq(scoreSessions.academicYearId, academicYearId) : undefined,
            semesterId ? eq(scoreSessions.semesterId, semesterId) : undefined,
            activeClassId ? eq(scoreSessions.classId, activeClassId) : undefined,
            status ? eq(scoreSessions.status, status) : undefined,
          ].filter(Boolean) as SQL[]
        )
      );

    const total = totalRow[0]?.count ?? 0;

    return apiSuccess({
      items: rows,
      meta: getPaginationMeta(total, page, limit),
    });
  } catch (err) {
    console.error('[score-sessions GET]', err);
    return apiError('Gagal mengambil sesi nilai', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const body = await validateBody(request, createSessionSchema);
    if (!body.success) return body.errorResponse;

    const { academicYearId, semesterId, classId, curriculumSubjectId } = body.data;
    const db = getDb();

    // Multi-tenant isolation: verify academicYear belongs to user's institution
    const yearCheck = await db
      .select({ id: academicYears.id })
      .from(academicYears)
      .where(and(eq(academicYears.id, academicYearId), eq(academicYears.institutionId, session.institutionId)))
      .limit(1);
    if (yearCheck.length === 0) {
      return apiError('Tahun ajaran tidak ditemukan atau bukan milik institusi Anda', 403);
    }

    const userRole = (session.role || '').toLowerCase();
    const isMustahiq = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
    const isSekretariat = ['sekretariat'].includes(userRole);

    if (!isMustahiq && !isSekretariat) {
      return apiError('Anda tidak memiliki izin untuk membuat sesi nilai', 403);
    }

    if (isMustahiq) {
      const assignment = await db
        .select({ classId: classAssignments.classId })
        .from(classAssignments)
        .where(
          and(
            eq(classAssignments.userId, session.userId),
            eq(classAssignments.classId, classId),
            eq(classAssignments.status, 'active')
          )
        )
        .limit(1);

      if (assignment.length === 0) {
        return apiError('Anda tidak memiliki akses ke kelas ini', 403);
      }
    }

    // Check for existing session (unique constraint)
    const existing = await db
      .select({ id: scoreSessions.id })
      .from(scoreSessions)
      .where(
        and(
          eq(scoreSessions.academicYearId, academicYearId),
          eq(scoreSessions.semesterId, semesterId),
          eq(scoreSessions.classId, classId),
          eq(scoreSessions.curriculumSubjectId, curriculumSubjectId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return apiError('Sesi nilai untuk mapel ini sudah ada', 409);
    }

    const id = crypto.randomUUID();
    await db.insert(scoreSessions).values({
      id,
      academicYearId,
      semesterId,
      classId,
      curriculumSubjectId,
      status: 'draft',
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    return apiSuccess({ id }, 'Sesi nilai berhasil dibuat', 201);
  } catch (err) {
    console.error('[score-sessions POST]', err);
    return apiError('Gagal membuat sesi nilai', 500);
  }
}

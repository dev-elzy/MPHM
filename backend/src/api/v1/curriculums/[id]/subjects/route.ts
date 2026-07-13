import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { curriculums, curriculumSubjects, subjects } from '@/db/schema/curriculums';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { notDeleted } from '@/lib/soft-delete';


// Schema for linking subjects
const linkSubjectsSchema = z.object({
  subjects: z.array(
    z.object({
      subjectId: z.string().min(1, 'ID mata pelajaran tidak valid'),
      sortOrder: z.number().default(0),
      maxScore: z.number().default(100),
      minScore: z.number().default(60),
      weight: z.number().default(1),
      notes: z.string().optional(),
    })
  ),
});

// GET /api/v1/curriculums/[id]/subjects
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const { id: curriculumId } = await params;
    const db = getDb();

    // Verify curriculum exists in this institution
    const curriculum = (
      await db
        .select({ id: curriculums.id })
        .from(curriculums)
        .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
        .where(
          and(
            eq(curriculums.id, curriculumId),
            eq(academicYears.institutionId, session.institutionId),
            notDeleted(curriculums)
          )
        )
        .limit(1)
    )[0];

    if (!curriculum) {
      return apiError('Kurikulum tidak ditemukan', 404);
    }

    // Join curriculumSubjects with subjects
    const items = await db
      .select({
        id: curriculumSubjects.id,
        curriculumId: curriculumSubjects.curriculumId,
        subjectId: curriculumSubjects.subjectId,
        sortOrder: curriculumSubjects.sortOrder,
        maxScore: curriculumSubjects.maxScore,
        minScore: curriculumSubjects.minScore,
        weight: curriculumSubjects.weight,
        status: curriculumSubjects.status,
        notes: curriculumSubjects.notes,
        name: subjects.name,
        code: subjects.code,
        arabicName: subjects.arabicName,
        category: subjects.category,
      })
      .from(curriculumSubjects)
      .innerJoin(subjects, eq(curriculumSubjects.subjectId, subjects.id))
      .where(
        and(
          eq(curriculumSubjects.curriculumId, curriculumId),
          eq(subjects.institutionId, session.institutionId),
          notDeleted(subjects)
        )
      )
      .orderBy(curriculumSubjects.sortOrder);

    return apiSuccess(items, 'Berhasil mengambil mata pelajaran kurikulum');

  } catch (error) {
    console.error('GET curriculum subjects error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// POST /api/v1/curriculums/[id]/subjects
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: super_admin, admin, and operator
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengedit isi kurikulum', 403);
    }

    const { id: curriculumId } = await params;
    const valResult = await validateBody(request, linkSubjectsSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const { subjects: requestSubjects } = valResult.data;
    const db = getDb();

    // Verify curriculum exists in this institution
    const curriculum = (
      await db
        .select({ id: curriculums.id })
        .from(curriculums)
        .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
        .where(
          and(
            eq(curriculums.id, curriculumId),
            eq(academicYears.institutionId, session.institutionId),
            notDeleted(curriculums)
          )
        )
        .limit(1)
    )[0];

    if (!curriculum) {
      return apiError('Kurikulum tidak ditemukan', 404);
    }

    // Replace the curriculum links in a transaction
    await db.transaction(async (tx) => {
      // 1. Delete all old bindings for this curriculum
      await tx
        .delete(curriculumSubjects)
        .where(eq(curriculumSubjects.curriculumId, curriculumId));

      // 2. Insert new bindings
      if (requestSubjects.length > 0) {
        const insertValues = requestSubjects.map((s) => ({
          id: crypto.randomUUID(),
          curriculumId,
          subjectId: s.subjectId,
          sortOrder: s.sortOrder,
          maxScore: s.maxScore,
          minScore: s.minScore,
          weight: s.weight,
          status: 'active',
          notes: s.notes,
        }));

        await tx.insert(curriculumSubjects).values(insertValues);
      }
    });

    return apiSuccess(null, 'Mata pelajaran kurikulum berhasil diperbarui');

  } catch (error) {
    console.error('POST curriculum subjects error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

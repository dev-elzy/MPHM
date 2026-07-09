import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { semesters } from '@/db/schema/semesters';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { notDeleted } from '@/lib/soft-delete';


const queryParamsSchema = z.object({
  academicYearId: z.string().uuid('ID tahun ajaran tidak valid').optional(),
});

// GET /api/v1/semesters
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const valParams = validateQueryParams(request.url, queryParamsSchema);
    if (!valParams.success) {
      return valParams.errorResponse;
    }

    const { academicYearId } = valParams.data;
    const db = getDb();

    const conditions = [
      eq(academicYears.institutionId, session.institutionId),
      notDeleted(academicYears),
    ];

    if (academicYearId) {
      conditions.push(eq(semesters.academicYearId, academicYearId));
    }

    const items = await db
      .select({
        id: semesters.id,
        academicYearId: semesters.academicYearId,
        name: semesters.name,
        type: semesters.type,
        startDate: semesters.startDate,
        endDate: semesters.endDate,
        isActive: semesters.isActive,
        status: semesters.status,
        academicYearName: academicYears.name,
      })
      .from(semesters)
      .innerJoin(academicYears, eq(semesters.academicYearId, academicYears.id))
      .where(and(...conditions))
      .orderBy(semesters.name);

    return apiSuccess(items, 'Berhasil mengambil daftar semester');

  } catch (error) {
    console.error('GET semesters error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

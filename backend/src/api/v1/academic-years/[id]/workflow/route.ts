import { z } from 'zod';
import { eq, and, ne } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';
import { isValidTransition } from '@/lib/workflow';
import { ACADEMIC_YEAR_STATUS, AcademicYearStatus } from '@/lib/constants/academic';


const workflowSchema = z.object({
  status: z.enum([
    ACADEMIC_YEAR_STATUS.DRAFT,
    ACADEMIC_YEAR_STATUS.PUBLISHED,
    ACADEMIC_YEAR_STATUS.ACTIVE,
    ACADEMIC_YEAR_STATUS.ARCHIVED,
  ] as [string, ...string[]]),
});

// PATCH /api/v1/academic-years/[id]/workflow
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin and admin can change workflow status of academic years
    const ALLOWED_ROLES = ['sekretariat'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengubah status tahun ajaran', 403);
    }

    const { id } = await params;
    
    const valResult = await validateBody(request, workflowSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const targetStatus = valResult.data.status as AcademicYearStatus;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // 1. Get current year status
    const currentYearResult = await db
      .select()
      .from(academicYears)
      .where(
        and(
          eq(academicYears.id, id),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(academicYears)
        )
      )
      .limit(1);

    const currentYear = currentYearResult[0];
    if (!currentYear) {
      return apiError('Tahun ajaran tidak ditemukan', 404);
    }

    const currentStatus = currentYear.status as AcademicYearStatus;

    // 2. Validate transition against state machine rules
    const isValid = isValidTransition('academic_year', currentStatus, targetStatus);
    if (!isValid) {
      return apiError(
        `Transisi status tidak diizinkan: dari "${currentStatus}" ke "${targetStatus}"`,
        400
      );
    }

    // 3. Perform transition (in transaction if activating)
    await db.transaction(async (tx) => {
      if (targetStatus === ACADEMIC_YEAR_STATUS.ACTIVE) {
        // Enforce constraint: Only ONE year can be active at a time per institution.
        // Transition other active years to archived.
        await tx
          .update(academicYears)
          .set({
            status: ACADEMIC_YEAR_STATUS.ARCHIVED,
            updatedAt: new Date(),
            updatedBy: session.userId,
          })
          .where(
            and(
              eq(academicYears.institutionId, session.institutionId),
              eq(academicYears.status, ACADEMIC_YEAR_STATUS.ACTIVE),
              ne(academicYears.id, id),
              notDeleted(academicYears)
            )
          );
      }

      // Update targeted year status
      await tx
        .update(academicYears)
        .set({
          status: targetStatus,
          updatedAt: new Date(),
          updatedBy: session.userId,
        })
        .where(eq(academicYears.id, id));
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'academic_year',
        action: 'status_change',
        entityId: id,
        entityType: 'academic_year',
        oldData: { status: currentStatus },
        newData: { status: targetStatus },
        description: `Tahun ajaran "${currentYear.name}" diubah statusnya menjadi "${targetStatus}"`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, `Status tahun ajaran berhasil diubah menjadi "${targetStatus}"`);

  } catch (error) {
    console.error('PATCH academic year workflow error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

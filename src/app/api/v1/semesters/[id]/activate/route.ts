import { eq, and, ne } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { semesters } from '@/db/schema/semesters';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


// PATCH /api/v1/semesters/[id]/activate
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin, admin, and operator can activate semesters
    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengaktifkan semester', 403);
    }

    const { id } = await params;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify semester existence and institution partition
    const currentSemesterResult = await db
      .select({
        id: semesters.id,
        name: semesters.name,
        academicYearId: semesters.academicYearId,
        academicYearName: academicYears.name,
        institutionId: academicYears.institutionId,
        status: academicYears.status,
      })
      .from(semesters)
      .innerJoin(academicYears, eq(semesters.academicYearId, academicYears.id))
      .where(
        and(
          eq(semesters.id, id),
          eq(academicYears.institutionId, session.institutionId),
          notDeleted(academicYears)
        )
      )
      .limit(1);

    const currentSemester = currentSemesterResult[0];
    if (!currentSemester) {
      return apiError('Semester tidak ditemukan', 404);
    }

    // Prevent activating semesters of archived years
    if (currentSemester.status === 'archived') {
      return apiError('Tidak dapat mengaktifkan semester dari tahun ajaran yang diarsipkan', 400);
    }

    // Perform toggle inside transaction
    await db.transaction(async (tx) => {
      // 1. Deactivate other semesters in same academic year
      await tx
        .update(semesters)
        .set({
          isActive: false,
          updatedAt: new Date(),
          updatedBy: session.userId,
        })
        .where(
          and(
            eq(semesters.academicYearId, currentSemester.academicYearId),
            ne(semesters.id, id)
          )
        );

      // 2. Activate target semester
      await tx
        .update(semesters)
        .set({
          isActive: true,
          updatedAt: new Date(),
          updatedBy: session.userId,
        })
        .where(eq(semesters.id, id));
    });

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'semester',
        action: 'status_change',
        entityId: id,
        entityType: 'semester',
        description: `Semester "${currentSemester.name}" (${currentSemester.academicYearName}) diaktifkan`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, `Semester "${currentSemester.name}" berhasil diaktifkan`);

  } catch (error) {
    console.error('PATCH activate semester error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

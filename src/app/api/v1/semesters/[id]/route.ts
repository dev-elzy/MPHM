import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { semesters } from '@/db/schema/semesters';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


const updateSemesterSchema = z.object({
  name: z.string().min(2, 'Nama semester minimal 2 karakter').optional(),
  startDate: z.string().min(10, 'Format tanggal mulai salah').optional(),
  endDate: z.string().min(10, 'Format tanggal selesai salah').optional(),
});

// PATCH /api/v1/semesters/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin, admin, and operator can edit semesters
    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengubah data semester', 403);
    }

    const { id } = await params;
    
    const valResult = await validateBody(request, updateSemesterSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const updateData = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Verify semester existence and institution partition via academic year
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

    // Prevent modifying semesters of archived years
    if (currentSemester.status === 'archived') {
      return apiError('Semester dari tahun ajaran yang diarsipkan tidak dapat diubah', 400);
    }

    // Update details
    await db
      .update(semesters)
      .set({
        ...updateData,
        updatedAt: new Date(),
        updatedBy: session.userId,
      })
      .where(eq(semesters.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'semester',
        action: 'update',
        entityId: id,
        entityType: 'semester',
        oldData: currentSemester,
        newData: updateData,
        description: `Semester "${currentSemester.name}" (${currentSemester.academicYearName}) diperbarui`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Data semester berhasil diperbarui');

  } catch (error) {
    console.error('PATCH semester error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

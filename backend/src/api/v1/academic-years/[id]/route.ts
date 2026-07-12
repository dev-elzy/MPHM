import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { notDeleted } from '@/lib/soft-delete';


// Validation Schema for update
const updateYearSchema = z.object({
  name: z.string().min(4, 'Nama tahun ajaran minimal 4 karakter (misal: 2026/2027)').optional(),
  startDate: z.string().min(10, 'Format tanggal mulai salah').optional(),
  endDate: z.string().min(10, 'Format tanggal selesai salah').optional(),
  description: z.string().optional(),
});

// GET /api/v1/academic-years/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const { id } = await params;
    const db = getDb();

    const items = await db
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

    const year = items[0];
    if (!year) {
      return apiError('Tahun ajaran tidak ditemukan', 404);
    }

    return apiSuccess(year, 'Berhasil mengambil detail tahun ajaran');

  } catch (error) {
    console.error('GET academic year detail error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// PATCH /api/v1/academic-years/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin, admin, and operator can edit
    const ALLOWED_ROLES = ['super_admin', 'admin', 'operator'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk mengubah tahun ajaran', 403);
    }

    const { id } = await params;
    
    const valResult = await validateBody(request, updateYearSchema);
    if (!valResult.success) {
      return valResult.errorResponse;
    }

    const updateData = valResult.data;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Check year existence
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

    // Prevent modifying archived years
    if (currentYear.status === 'archived') {
      return apiError('Tahun ajaran yang telah diarsipkan tidak dapat diubah', 400);
    }

    // Check duplicate name if name is updated
    if (updateData.name && updateData.name !== currentYear.name) {
      const duplicate = await db
        .select()
        .from(academicYears)
        .where(
          and(
            eq(academicYears.institutionId, session.institutionId),
            eq(academicYears.name, updateData.name),
            notDeleted(academicYears)
          )
        )
        .limit(1);

      if (duplicate.length > 0) {
        return apiError(`Tahun ajaran dengan nama "${updateData.name}" sudah terdaftar`, 409);
      }
    }

    // Update record
    await db
      .update(academicYears)
      .set({
        ...updateData,
        updatedAt: new Date(),
        updatedBy: session.userId,
      })
      .where(eq(academicYears.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'academic_year',
        action: 'update',
        entityId: id,
        entityType: 'academic_year',
        oldData: currentYear,
        newData: updateData,
        description: `Tahun ajaran "${currentYear.name}" diperbarui`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Tahun ajaran berhasil diperbarui');

  } catch (error) {
    console.error('PATCH academic year error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

// DELETE /api/v1/academic-years/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    // Role Guard: Only super_admin and admin can delete
    const ALLOWED_ROLES = ['super_admin', 'admin'];
    if (!ALLOWED_ROLES.includes(session.role)) {
      return apiError('Anda tidak memiliki izin untuk menghapus tahun ajaran', 403);
    }

    const { id } = await params;
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    const db = getDb();

    // Check year existence
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

    // Prevent deleting active years
    if (currentYear.status === 'active') {
      return apiError('Tahun ajaran aktif tidak dapat dihapus. Silakan nonaktifkan terlebih dahulu', 400);
    }

    // Perform soft delete
    await db
      .update(academicYears)
      .set({
        deletedAt: new Date(),
        deletedBy: session.userId,
      })
      .where(eq(academicYears.id, id));

    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'academic_year',
        action: 'delete',
        entityId: id,
        entityType: 'academic_year',
        oldData: currentYear,
        description: `Tahun ajaran "${currentYear.name}" dipindahkan ke Recycle Bin (Soft Delete)`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Tahun ajaran berhasil dipindahkan ke Recycle Bin');

  } catch (error) {
    console.error('DELETE academic year error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

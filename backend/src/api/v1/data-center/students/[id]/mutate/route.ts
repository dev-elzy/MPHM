import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { studentProfiles, classStudents, classes } from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';

const mutateSchema = z.object({
  mutationType: z.enum(['cuti', 'boyong', 'dikeluarkan', 'khidmah', 'alumni']),
  note: z.string().optional(),
  // Fields for alumni
  khidmahLocation: z.string().optional(),
  university: z.string().optional(),
  profession: z.string().optional(),
});

export async function POST(request: Request, context: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);
    
    // Role Guard: Only sekretariat and up can mutate
    const allowedRoles = ['sekretariat', 'mudir'];
    if (!allowedRoles.includes(session.role.toLowerCase())) {
      return apiError('Forbidden', 403);
    }

    const valResult = await validateBody(request, mutateSchema);
    if (!valResult.success) return valResult.errorResponse;

    const { mutationType, note, khidmahLocation, university, profession } = valResult.data;
    const profileId = context.params.id; // Usually it's the personId, wait, what id did frontend send?
    
    const db = getDb();

    // Frontend `student.id` is the `personId` (because we query `id: people.id` in the GET).
    // Let's find the student profile from personId.
    const profileRows = await db.select().from(studentProfiles).where(eq(studentProfiles.personId, profileId)).limit(1);
    
    // Also try matching by profileId if it was sent
    let profile = profileRows[0];
    if (!profile) {
      const profileByIdRows = await db.select().from(studentProfiles).where(eq(studentProfiles.id, profileId)).limit(1);
      profile = profileByIdRows[0];
    }

    if (!profile) return apiError('Profil santri tidak ditemukan', 404);

    // Fetch active class if any
    let activeClass = null;
    if (profile.currentClassId) {
      const classRows = await db.select().from(classes).where(eq(classes.id, profile.currentClassId)).limit(1);
      activeClass = classRows[0];
    }

    // Business Logic / Validations
    if (mutationType === 'khidmah') {
      if (!activeClass || activeClass.jenjang !== 'aliyyah' || activeClass.tingkat !== 'III') {
        return apiError('Mutasi Khidmah hanya dapat dilakukan pada siswi akhir tingkat Aliyyah (Kelas III)', 400);
      }
    }

    if (mutationType === 'alumni') {
      if (profile.status !== 'khidmah') {
        return apiError('Mutasi Alumni hanya dapat dilakukan setelah siswi berstatus Khidmah', 400);
      }
    }

    // Execute mutation
    await db.transaction(async (tx) => {
      // 1. Update Profile Status
      await tx.update(studentProfiles)
        .set({
          status: mutationType,
          updatedBy: session.userId,
        })
        .where(eq(studentProfiles.id, profile.id));

      // 2. If it's a departure (cuti, boyong, dikeluarkan), we might want to update class_students
      if (['cuti', 'boyong', 'dikeluarkan', 'khidmah', 'alumni'].includes(mutationType)) {
        await tx.update(classStudents)
          .set({ 
            status: mutationType,
            updatedBy: session.userId 
          })
          .where(and(
            eq(classStudents.studentProfileId, profile.id),
            eq(classStudents.status, 'active')
          ));
        
        // Also remove them from current class pointer
        await tx.update(studentProfiles)
          .set({ currentClassId: null })
          .where(eq(studentProfiles.id, profile.id));
      }
    });

    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'data-center',
        action: 'mutate_student',
        entityId: profile.id,
        entityType: 'student',
        newData: { status: mutationType, note },
        description: `Mutasi Siswi diubah menjadi ${mutationType}`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Berhasil memutasi santriwati');
  } catch (error: any) {
    console.error('[student mutate POST]', error);
    return apiError('Terjadi kesalahan internal server', 500);
  }
}

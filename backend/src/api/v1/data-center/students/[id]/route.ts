import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { people, studentProfiles, classStudents } from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';

const updateStudentSchema = z.object({
  nis: z.string().optional().nullable(),
  nisn: z.string().optional().nullable(),
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter').optional(),
  birthDate: z.string().optional().nullable(),
  birthPlace: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  subDistrict: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  parentName: z.string().optional().nullable(),
  parentPhone: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  entryYear: z.string().optional().nullable(),
  entryJenjang: z.string().optional().nullable(),
  status: z.string().optional(),
  notes: z.string().optional().nullable(),
  classId: z.string().optional().nullable(),
  academicYearId: z.string().optional().nullable(),
  semesterId: z.string().optional().nullable(),
});

export async function PATCH(request: Request, context: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);
    if (session.role !== 'sekretariat') return apiError('Unauthorized', 403);

    const valResult = await validateBody(request, updateStudentSchema);
    if (!valResult.success) return valResult.errorResponse;

    const { classId, academicYearId, semesterId, ...data } = valResult.data;
    const personId = context.params.id; // personId
    const db = getDb();

    const existingPerson = await db.select().from(people).where(eq(people.id, personId)).limit(1);
    if (existingPerson.length === 0) return apiError('Data tidak ditemukan', 404);

    const existingProfile = await db.select().from(studentProfiles).where(eq(studentProfiles.personId, personId)).limit(1);
    if (existingProfile.length === 0) return apiError('Profil Siswi tidak ditemukan', 404);

    const profileId = existingProfile[0].id;

    await db.transaction(async (tx) => {
      // Update Person
      if (data.name || data.birthPlace || data.birthDate || data.phone || data.address || data.province !== undefined) {
        await tx.update(people).set({
          fullName: data.name ?? existingPerson[0].fullName,
          birthPlace: data.birthPlace !== undefined ? data.birthPlace : existingPerson[0].birthPlace,
          birthDate: data.birthDate !== undefined ? data.birthDate : existingPerson[0].birthDate,
          phone: data.phone !== undefined ? data.phone : existingPerson[0].phone,
          address: data.address !== undefined ? data.address : existingPerson[0].address,
          province: data.province !== undefined ? data.province : existingPerson[0].province,
          regency: data.city !== undefined ? data.city : existingPerson[0].regency,
          district: data.district !== undefined ? data.district : existingPerson[0].district,
          village: data.subDistrict !== undefined ? data.subDistrict : existingPerson[0].village,
          addressDetail: data.postalCode !== undefined ? `Kode Pos: ${data.postalCode}` : existingPerson[0].addressDetail,
          updatedBy: session.userId,
        }).where(eq(people.id, personId));
      }

      // Update Profile
      await tx.update(studentProfiles).set({
        nis: data.nis !== undefined ? data.nis : existingProfile[0].nis,
        nisn: data.nisn !== undefined ? data.nisn : existingProfile[0].nisn,
        entryYear: data.entryYear !== undefined ? data.entryYear : existingProfile[0].entryYear,
        status: data.status !== undefined ? data.status : existingProfile[0].status,
        currentClassId: classId !== undefined ? (classId === 'none' ? null : classId) : existingProfile[0].currentClassId,
        updatedBy: session.userId,
      }).where(eq(studentProfiles.id, profileId));

      // Handle class change (enrollment)
      if (classId !== undefined && academicYearId && semesterId) {
        // Find existing enrollment in the same semester/academicYear
        const existingEnrollment = await tx.select().from(classStudents)
          .where(and(
            eq(classStudents.studentProfileId, profileId),
            eq(classStudents.academicYearId, academicYearId),
            eq(classStudents.semesterId, semesterId)
          )).limit(1);

        if (classId === 'none' || classId === null) {
          // Remove or set inactive
          if (existingEnrollment.length > 0) {
            await tx.update(classStudents).set({ status: 'inactive', updatedBy: session.userId }).where(eq(classStudents.id, existingEnrollment[0].id));
          }
        } else {
          // Update or insert
          if (existingEnrollment.length > 0) {
            await tx.update(classStudents).set({ classId, status: 'active', updatedBy: session.userId }).where(eq(classStudents.id, existingEnrollment[0].id));
          } else {
            await tx.insert(classStudents).values({
              id: crypto.randomUUID(),
              studentProfileId: profileId,
              academicYearId,
              semesterId,
              classId,
              status: 'active',
              createdBy: session.userId,
              updatedBy: session.userId
            });
          }
        }
      }
    });

    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'data-center',
        action: 'update_student',
        entityId: personId,
        entityType: 'student',
        newData: data,
        description: `Profil Siswi diperbarui`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess(null, 'Profil berhasil diperbarui');
  } catch (error) {
    console.error('PATCH student error:', error);
    return apiError('Internal Server Error', 500);
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);
    if (session.role !== 'sekretariat') return apiError('Unauthorized', 403);

    const personId = context.params.id;
    const db = getDb();

    // Soft delete person and profile
    const now = new Date();
    await db.update(people).set({ 
      deletedAt: now, 
      deletedBy: session.userId,
    }).where(eq(people.id, personId));

    await db.update(studentProfiles).set({
      deletedAt: now,
      deletedBy: session.userId,
    }).where(eq(studentProfiles.personId, personId));

    return apiSuccess(null, 'Siswi berhasil dipindahkan ke Recycle Bin');
  } catch (error) {
    console.error('DELETE student error:', error);
    return apiError('Internal Server Error', 500);
  }
}

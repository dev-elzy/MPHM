import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { classes, classAssignments } from '@/db/schema/classes';
import { classStudents } from '@/db/schema/enrollments';
import { studentProfiles } from '@/db/schema/person-profiles';
import { people } from '@/db/schema/people';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { notDeleted } from '@/lib/soft-delete';

// GET /api/v1/classes/[id]/hierarchy
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

    // Verify class existence
    const classData = await db.query.classes.findFirst({
      where: and(eq(classes.id, id), notDeleted(classes))
    });

    if (!classData) {
      return apiError('Kelas rombel tidak ditemukan', 404);
    }

    // Get Wali Kelas (Mustahiq)
    const waliKelasAssignment = await db.query.classAssignments.findFirst({
      where: and(
        eq(classAssignments.classId, id),
        eq(classAssignments.role, 'wali_kelas'),
        eq(classAssignments.status, 'active')
      ),
      with: {
        user: true, // Assuming relation exists, else manual join
      }
    });

    let mustahiq = null;
    if (waliKelasAssignment) {
      const u = await db.query.users.findFirst({
        where: eq(users.id, waliKelasAssignment.userId)
      });
      if (u) {
        mustahiq = {
          id: u.id,
          name: u.name,
          role: u.role,
        };
      }
    }

    // Note: Mufatish is typically assigned per jenjang or similar. 
    // If not strictly defined in class_assignments, we can search users where role is 'mufatish' 
    // handling this jenjang. For now, we will return a placeholder or query users.
    const mufatishRecords = await db.query.users.findMany({
      where: eq(users.role, 'mufatish')
    });
    // Just taking the first one as placeholder, or if there's a specific logic for mufatish per jenjang, apply here.
    const mufatishUser = mufatishRecords[0];
    const mufatish = mufatishUser ? {
      id: mufatishUser.id,
      name: mufatishUser.name,
      role: mufatishUser.role
    } : null;

    // Get Enrolled Students (Santriwati)
    const enrolled = await db
      .select({
        profileId: studentProfiles.id,
        status: classStudents.status,
        enrollmentDate: classStudents.enrollmentDate,
        name: people.fullName,
        nis: studentProfiles.nis,
        nisn: studentProfiles.nisn,
        gender: people.gender,
      })
      .from(classStudents)
      .innerJoin(studentProfiles, eq(classStudents.studentProfileId, studentProfiles.id))
      .innerJoin(people, eq(studentProfiles.personId, people.id))
      .where(
        and(
          eq(classStudents.classId, id),
          eq(classStudents.status, 'active')
        )
      );

    return apiSuccess({
      classInfo: classData,
      mufatish,
      mustahiq,
      students: enrolled,
      totalStudents: enrolled.length,
    }, 'Berhasil mengambil hierarki kelas');

  } catch (error) {
    console.error('GET class hierarchy error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

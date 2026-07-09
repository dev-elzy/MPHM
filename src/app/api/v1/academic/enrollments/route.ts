import { getDb } from '@/db/client';
import { classEnrollments, academicClasses, studentProfiles, people } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

interface BatchEnrollmentBody {
  academicYearId: string;
  classId: string;
  studentProfileIds: string[];
  notes?: string;
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const studentProfileId = searchParams.get('studentProfileId');

    const db = getDb();
    const rows = await db
      .select({
        id: classEnrollments.id,
        academicYearId: classEnrollments.academicYearId,
        classId: classEnrollments.classId,
        className: academicClasses.className,
        studentProfileId: classEnrollments.studentProfileId,
        studentName: people.fullName,
        nisn: studentProfiles.nisn,
        status: classEnrollments.status,
        enrolledAt: classEnrollments.enrolledAt,
        notes: classEnrollments.notes,
      })
      .from(classEnrollments)
      .leftJoin(academicClasses, eq(classEnrollments.classId, academicClasses.id))
      .leftJoin(studentProfiles, eq(classEnrollments.studentProfileId, studentProfiles.id))
      .leftJoin(people, eq(studentProfiles.personId, people.id))
      .where(
        classId
          ? eq(classEnrollments.classId, classId)
          : studentProfileId
          ? eq(classEnrollments.studentProfileId, studentProfileId)
          : undefined
      );

    return apiSuccess(rows, 'Berhasil mengambil data penempatan kelas');
  } catch (error: unknown) {
    console.error('GET /api/v1/academic/enrollments Error:', error);
    return apiError('Gagal mengambil data penempatan kelas', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);

    const body = (await request.json()) as BatchEnrollmentBody;
    if (!body.academicYearId || !body.classId || !Array.isArray(body.studentProfileIds) || body.studentProfileIds.length === 0) {
      return apiError('Pilih kelas tujuan dan daftar santri (multi select) yang akan dimasukkan ke kelas', 400);
    }

    const db = getDb();

    // Check target class capacity & status
    const targetClassRows = await db
      .select()
      .from(academicClasses)
      .where(eq(academicClasses.id, body.classId));
    if (targetClassRows.length === 0) {
      return apiError('Kelas tujuan tidak ditemukan', 404);
    }
    const targetClass = targetClassRows[0];
    if (targetClass.status !== 'ACTIVE') {
      return apiError('Kelas tujuan sedang tidak aktif', 400);
    }

    // Check current occupancy
    const currentEnrolled = await db
      .select({ count: sql<number>`count(*)` })
      .from(classEnrollments)
      .where(eq(classEnrollments.classId, body.classId));
    const occupancy = Number(currentEnrolled[0]?.count || 0);

    if (occupancy + body.studentProfileIds.length > targetClass.capacity) {
      return apiError(
        `Kapasitas kelas tidak mencukupi. (Kapasitas: ${targetClass.capacity}, Terisi: ${occupancy}, Ditambahkan: ${body.studentProfileIds.length})`,
        409
      );
    }

    // Batch insert enrollments
    const insertedIds: string[] = [];
    for (const studentProfileId of body.studentProfileIds) {
      const enrollId = `enroll-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await db.insert(classEnrollments).values({
        id: enrollId,
        academicYearId: body.academicYearId,
        classId: body.classId,
        studentProfileId,
        status: 'ACTIVE',
        notes: body.notes || 'Batch assignment',
      });
      insertedIds.push(enrollId);
    }

    return apiSuccess(
      { enrolledCount: insertedIds.length, enrollmentIds: insertedIds },
      `Berhasil menempatkan ${insertedIds.length} santri ke kelas ${targetClass.className}`,
      201
    );
  } catch (error: unknown) {
    console.error('POST /api/v1/academic/enrollments Error:', error);
    return apiError('Gagal melakukan penempatan santri ke kelas', 500);
  }
}

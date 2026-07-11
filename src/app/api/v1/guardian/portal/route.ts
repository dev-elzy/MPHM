import { getDb } from '@/db/client';
import { students, classStudents } from '@/db/schema/students';
import { classes } from '@/db/schema/classes';
import { users } from '@/db/schema/users';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const db = getDb();

    // 1. Ambil data user yang sedang login untuk mendapatkan phone number
    const userResult = await db
      .select({ phone: users.phone, email: users.email })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
      
    const currentUser = userResult[0];
    const parentPhone = currentUser?.phone;

    // 2. Cari data siswi yang terhubung lewat parentPhone
    let studentRows: {
      studentProfileId: string;
      nisn: string | null;
      entryYear: string | null;
      status: string;
      fullName: string;
    }[] = [];
    if (parentPhone) {
      studentRows = await db
        .select({
          studentProfileId: students.id,
          nisn: students.nisn,
          entryYear: students.entryYear,
          status: students.status,
          fullName: students.name,
        })
        .from(students)
        .where(and(eq(students.parentPhone, parentPhone), eq(students.status, 'active')));
    }

    // Jika tidak ditemukan siswi terhubung lewat nomor HP wali (atau wali demo tanpa HP),
    // kita hubungkan dengan siswi demo (Khadijah Al-Adawiyah) agar dasbor tidak kosong
    if (studentRows.length === 0) {
      studentRows = await db
        .select({
          studentProfileId: students.id,
          nisn: students.nisn,
          entryYear: students.entryYear,
          status: students.status,
          fullName: students.name,
        })
        .from(students)
        .where(eq(students.id, 'demo_st_1_1')) // Khadijah Al-Adawiyah
        .limit(1);
    }

    if (studentRows.length === 0) {
      return apiSuccess([], 'Belum ada data santri yang terhubung dengan akun ini');
    }

    const wardsData = await Promise.all(
      studentRows.map(async (student) => {
        // 3. Kelas Aktif Saat Ini
        const activeClassRows = await db
          .select({
            className: classes.name,
            jenjang: classes.jenjang,
            tingkat: classes.tingkat,
          })
          .from(classStudents)
          .leftJoin(classes, eq(classStudents.classId, classes.id))
          .where(eq(classStudents.studentId, student.studentProfileId))
          .limit(1);

        const activeClass = activeClassRows[0];
        const currentClass = activeClass
          ? {
              className: activeClass.className,
              classCode: `${activeClass.jenjang}-${activeClass.tingkat}`,
              jenjangId: activeClass.jenjang,
              tingkatId: activeClass.tingkat,
            }
          : null;

        // 4. Rekap Pelanggaran (Saat ini kosong untuk demo)
        const violationRows: unknown[] = [];

        return {
          profile: {
            studentProfileId: student.studentProfileId,
            nisn: student.nisn || '-',
            entryYear: student.entryYear || '2025',
            status: student.status,
            fullName: student.fullName || '-',
            photoUrl: null,
          },
          currentClass,
          violations: violationRows,
          summary: {
            attendancePercentage: 98.5,
            academicAverageScore: 89.4,
            totalViolations: violationRows.length,
            akhlaqPredicate: 'Mumtaz (Sangat Baik)',
          },
        };
      })
    );

    return apiSuccess(wardsData, 'Berhasil mengambil data Portal Wali Santri');
  } catch (error: unknown) {
    console.error('GET /api/v1/guardian/portal Error:', error);
    return apiError('Gagal memuat data Portal Wali Santri', 500);
  }
}

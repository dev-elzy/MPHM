import { z } from 'zod';
import { eq, and, SQL } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { attendance } from '@/db/schema/attendance';
import { academicYears } from '@/db/schema/academic-years';
import { students, classStudents } from '@/db/schema/students';
import { classAssignments } from '@/db/schema/classes';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';
import { getCurrentHijriDate } from '@/lib/utils/hijri';

const bulkAttendanceSchema = z.object({
  academicYearId: z.string().min(1),
  semesterId: z.string().min(1),
  classId: z.string().min(1),
  hijriMonth: z.number().int().min(1).max(12),
  hijriYear: z.number().int().min(1000),
  records: z.array(z.object({
    studentId: z.string().min(1),
    sickCount: z.number().int().nonnegative(),
    permissionCount: z.number().int().nonnegative(),
    absentCount: z.number().int().nonnegative(),
    notes: z.string().optional().nullable(),
  })),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const url = new URL(request.url);
    const academicYearId = url.searchParams.get('academicYearId');
    const semesterId = url.searchParams.get('semesterId');
    const classId = url.searchParams.get('classId');
    const hijriMonth = url.searchParams.get('hijriMonth') ? parseInt(url.searchParams.get('hijriMonth')!, 10) : null;
    const hijriYear = url.searchParams.get('hijriYear') ? parseInt(url.searchParams.get('hijriYear')!, 10) : null;
    const summary = url.searchParams.get('summary') === 'true';

    if (!academicYearId || !semesterId || !classId) {
      return apiError('academicYearId, semesterId, classId diperlukan', 400);
    }

    const db = getDb();

    // Multi-tenant check
    const yearCheck = await db
      .select({ id: academicYears.id })
      .from(academicYears)
      .where(and(eq(academicYears.id, academicYearId), eq(academicYears.institutionId, session.institutionId)))
      .limit(1);
    if (yearCheck.length === 0) {
      return apiError('Tahun ajaran tidak ditemukan atau bukan milik institusi Anda', 403);
    }

    const userRole = (session.role || '').toLowerCase();
    const isMustahiq = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
    if (isMustahiq) {
      const assignment = await db
        .select({ classId: classAssignments.classId })
        .from(classAssignments)
        .where(
          and(
            eq(classAssignments.userId, session.userId),
            eq(classAssignments.classId, classId),
            eq(classAssignments.status, 'active')
          )
        )
        .limit(1);

      if (assignment.length === 0) {
        return apiError('Anda tidak memiliki akses ke kelas ini', 403);
      }
    }

    // Get list of enrolled students in the class
    const enrolled = await db
      .select({
        studentId: students.id,
        studentName: students.name,
        studentNis: students.nis,
      })
      .from(classStudents)
      .leftJoin(students, eq(classStudents.studentId, students.id))
      .where(
        and(
          eq(classStudents.academicYearId, academicYearId),
          eq(classStudents.semesterId, semesterId),
          eq(classStudents.classId, classId)
        )
      );

    if (summary) {
      // Return total sum of counts for the whole semester
      const allAttendance = await db
        .select()
        .from(attendance)
        .where(
          and(
            eq(attendance.academicYearId, academicYearId),
            eq(attendance.semesterId, semesterId),
            eq(attendance.classId, classId)
          )
        );

      const summaries = enrolled.map((s) => {
        const records = allAttendance.filter((a) => a.studentId === s.studentId);
        return {
          studentId: s.studentId,
          studentName: s.studentName,
          studentNis: s.studentNis,
          sick: records.reduce((sum, r) => sum + r.sickCount, 0),
          permission: records.reduce((sum, r) => sum + r.permissionCount, 0),
          absent: records.reduce((sum, r) => sum + r.absentCount, 0),
        };
      });

      return apiSuccess(summaries);
    }

    // Return recap for specific month
    if (!hijriMonth || !hijriYear) {
      return apiError('hijriMonth dan hijriYear diperlukan jika tidak meminta summary', 400);
    }

    const rows = await db
      .select({
        id: attendance.id,
        studentId: attendance.studentId,
        hijriMonth: attendance.hijriMonth,
        hijriYear: attendance.hijriYear,
        sickCount: attendance.sickCount,
        permissionCount: attendance.permissionCount,
        absentCount: attendance.absentCount,
        notes: attendance.notes,
        studentName: students.name,
        studentNis: students.nis,
      })
      .from(attendance)
      .leftJoin(students, eq(attendance.studentId, students.id))
      .where(
        and(
          eq(attendance.academicYearId, academicYearId),
          eq(attendance.semesterId, semesterId),
          eq(attendance.classId, classId),
          eq(attendance.hijriMonth, hijriMonth),
          eq(attendance.hijriYear, hijriYear)
        )
      );

    // Map rows to include all enrolled students (fill missing with zeros)
    const result = enrolled.map((s) => {
      const match = rows.find((r) => r.studentId === s.studentId);
      return {
        id: match?.id || null,
        studentId: s.studentId,
        studentName: s.studentName,
        studentNis: s.studentNis,
        hijriMonth,
        hijriYear,
        sickCount: match?.sickCount ?? 0,
        permissionCount: match?.permissionCount ?? 0,
        absentCount: match?.absentCount ?? 0,
        notes: match?.notes || '',
      };
    });

    return apiSuccess(result);
  } catch (err) {
    console.error('[attendance GET]', err);
    return apiError('Gagal mengambil data absensi', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const body = await validateBody(request, bulkAttendanceSchema);
    if (!body.success) return body.errorResponse;

    const { academicYearId, semesterId, classId, hijriMonth, hijriYear, records } = body.data;
    const db = getDb();
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;

    // Multi-tenant check
    const yearCheck = await db
      .select({ id: academicYears.id })
      .from(academicYears)
      .where(and(eq(academicYears.id, academicYearId), eq(academicYears.institutionId, session.institutionId)))
      .limit(1);
    if (yearCheck.length === 0) {
      return apiError('Tahun ajaran tidak ditemukan atau bukan milik institusi Anda', 403);
    }

    const userRole = (session.role || '').toLowerCase();
    const isMustahiq = ['mustahiq', 'teacher', 'ustadz'].includes(userRole);
    const isSekretariat = ['sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);

    if (!isMustahiq && !isSekretariat) {
      return apiError('Anda tidak memiliki izin untuk mengedit absensi', 403);
    }

    if (isMustahiq) {
      // Mustahiq class access verification
      const assignment = await db
        .select({ classId: classAssignments.classId })
        .from(classAssignments)
        .where(
          and(
            eq(classAssignments.userId, session.userId),
            eq(classAssignments.classId, classId),
            eq(classAssignments.status, 'active')
          )
        )
        .limit(1);

      if (assignment.length === 0) {
        return apiError('Anda tidak memiliki akses ke kelas ini', 403);
      }

      // Check current Hijri date and lock status
      const currentHijri = getCurrentHijriDate();
      if (hijriMonth !== currentHijri.month || hijriYear !== currentHijri.year) {
        return apiError('Anda hanya diperbolehkan menginput rekap absensi pada bulan Hijriyah aktif berjalan', 403);
      }
      if (currentHijri.day < 27) {
        return apiError(`Pengisian rekap absensi bulan ini belum dibuka. Form hanya terbuka otomatis pada 3 hari terakhir bulan Hijriyah (tanggal 27-30). Hari ini tanggal ${currentHijri.day} Hijriyah.`, 403);
      }
    }

    // Upsert each monthly recap record
    for (const record of records) {
      const existing = await db
        .select({ id: attendance.id })
        .from(attendance)
        .where(
          and(
            eq(attendance.academicYearId, academicYearId),
            eq(attendance.semesterId, semesterId),
            eq(attendance.classId, classId),
            eq(attendance.studentId, record.studentId),
            eq(attendance.hijriMonth, hijriMonth),
            eq(attendance.hijriYear, hijriYear)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(attendance)
          .set({
            sickCount: record.sickCount,
            permissionCount: record.permissionCount,
            absentCount: record.absentCount,
            notes: record.notes || null,
            updatedBy: session.userId,
            updatedAt: new Date(),
          })
          .where(eq(attendance.id, existing[0].id));
      } else {
        await db.insert(attendance).values({
          id: crypto.randomUUID(),
          academicYearId,
          semesterId,
          classId,
          studentId: record.studentId,
          hijriMonth,
          hijriYear,
          sickCount: record.sickCount,
          permissionCount: record.permissionCount,
          absentCount: record.absentCount,
          notes: record.notes || null,
          createdBy: session.userId,
          updatedBy: session.userId,
        });
      }
    }

    // Audit logging
    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'attendance',
        action: 'update',
        description: `Rekap absensi bulanan ${records.length} siswi untuk bulan Hijriyah ${hijriMonth}/${hijriYear} kelas ${classId}`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({}, 'Rekap absensi bulanan berhasil disimpan');
  } catch (err) {
    console.error('[attendance POST]', err);
    return apiError('Gagal menyimpan rekap absensi', 500);
  }
}

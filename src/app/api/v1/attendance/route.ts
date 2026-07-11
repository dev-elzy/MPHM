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


const bulkAttendanceSchema = z.object({
  academicYearId: z.string().min(1),
  semesterId: z.string().min(1),
  classId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(z.object({
    studentId: z.string().min(1),
    status: z.enum(['present', 'absent', 'sick', 'permission', 'late']),
    notes: z.string().optional(),
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
    const date = url.searchParams.get('date');
    const summary = url.searchParams.get('summary') === 'true';

    if (!academicYearId || !semesterId || !classId) {
      return apiError('academicYearId, semesterId, classId diperlukan', 400);
    }

    const db = getDb();

    // Multi-tenant isolation: verify academicYear belongs to user's institution
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

    if (summary) {
      // Return attendance summary per student for entire semester
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
          present: records.filter((r) => r.status === 'present').length,
          absent: records.filter((r) => r.status === 'absent').length,
          sick: records.filter((r) => r.status === 'sick').length,
          permission: records.filter((r) => r.status === 'permission').length,
          late: records.filter((r) => r.status === 'late').length,
          total: records.length,
        };
      });

      return apiSuccess(summaries);
    }

    // Return attendance for a specific date
    const conditions: SQL[] = [
      eq(attendance.academicYearId, academicYearId),
      eq(attendance.semesterId, semesterId),
      eq(attendance.classId, classId),
    ].filter(Boolean) as SQL[];

    if (date) conditions.push(eq(attendance.date, date));

    const rows = await db
      .select({
        id: attendance.id,
        studentId: attendance.studentId,
        date: attendance.date,
        status: attendance.status,
        notes: attendance.notes,
        studentName: students.name,
        studentNis: students.nis,
      })
      .from(attendance)
      .leftJoin(students, eq(attendance.studentId, students.id))
      .where(and(...conditions));

    return apiSuccess(rows);
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

    const { academicYearId, semesterId, classId, date, records } = body.data;
    const db = getDb();
    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;

    // Multi-tenant isolation: verify academicYear belongs to user's institution
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

    // Upsert each attendance record
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
            eq(attendance.date, date)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(attendance)
          .set({
            status: record.status,
            notes: record.notes || null,
            updatedBy: session.userId,
          })
          .where(eq(attendance.id, existing[0].id));
      } else {
        await db.insert(attendance).values({
          id: crypto.randomUUID(),
          academicYearId,
          semesterId,
          classId,
          studentId: record.studentId,
          date,
          status: record.status,
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
        description: `Absensi ${records.length} siswi pada ${date} untuk kelas ${classId}`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({}, 'Absensi berhasil disimpan');
  } catch (err) {
    console.error('[attendance POST]', err);
    return apiError('Gagal menyimpan absensi', 500);
  }
}

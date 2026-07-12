import { z } from 'zod';
import { eq, and, SQL, sql } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { akhlaq } from '@/db/schema/akhlaq';
import { academicYears } from '@/db/schema/academic-years';
import { students, classStudents } from '@/db/schema/students';
import { studentProfiles } from '@/db/schema/person-profiles';
import { studentViolations, violationTypes } from '@/db/schema/violations';
import { classAssignments } from '@/db/schema/classes';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { logActivity } from '@/lib/audit';

const bulkAkhlaqSchema = z.object({
  academicYearId: z.string().min(1),
  semesterId: z.string().min(1),
  classId: z.string().min(1),
  records: z.array(z.object({
    studentId: z.string().min(1),
    category: z.string().min(1),
    grade: z.enum(['A', 'B', 'C', 'D']),
    description: z.string().optional().nullable(),
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
    const studentId = url.searchParams.get('studentId');

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

    // Get list of active enrolled students in the class
    const enrolled = await db
      .select({
        id: students.id,
        name: students.name,
        nis: students.nis,
      })
      .from(classStudents)
      .innerJoin(students, eq(classStudents.studentId, students.id))
      .where(
        and(
          eq(classStudents.academicYearId, academicYearId),
          eq(classStudents.semesterId, semesterId),
          eq(classStudents.classId, classId),
          eq(classStudents.status, 'active')
        )
      );

    // Get all existing akhlaq records for this session
    const conditions: SQL[] = [
      eq(akhlaq.academicYearId, academicYearId),
      eq(akhlaq.semesterId, semesterId),
      eq(akhlaq.classId, classId),
    ];
    if (studentId) conditions.push(eq(akhlaq.studentId, studentId));

    const existingRows = await db
      .select({
        id: akhlaq.id,
        academicYearId: akhlaq.academicYearId,
        semesterId: akhlaq.semesterId,
        classId: akhlaq.classId,
        studentId: akhlaq.studentId,
        category: akhlaq.category,
        grade: akhlaq.grade,
        description: akhlaq.description,
        notes: akhlaq.notes,
        createdAt: akhlaq.createdAt,
        studentName: students.name,
        studentNis: students.nis,
      })
      .from(akhlaq)
      .leftJoin(students, eq(akhlaq.studentId, students.id))
      .where(and(...conditions));

    // Get student profiles to link NIS to violation data
    const profiles = await db
      .select({
        id: studentProfiles.id,
        nis: studentProfiles.nis,
      })
      .from(studentProfiles);

    // Get violations in the current academic year
    const allViolations = await db
      .select({
        studentProfileId: studentViolations.studentProfileId,
        points: violationTypes.defaultPoints,
      })
      .from(studentViolations)
      .innerJoin(violationTypes, eq(studentViolations.violationTypeId, violationTypes.id))
      .where(
        and(
          eq(studentViolations.academicYearId, academicYearId),
          sql`${studentViolations.status} != 'Dibatalkan'`
        )
      );

    // Compute violation points and recommended grades per student
    const studentInfoMap = new Map<string, { points: number; rec: string }>();
    for (const student of enrolled) {
      const studentProfile = profiles.find((p) => p.nis === student.nis);
      let points = 0;
      if (studentProfile) {
        points = allViolations
          .filter((v) => v.studentProfileId === studentProfile.id)
          .reduce((sum, v) => sum + (v.points ?? 0), 0);
      }

      // Rules:
      // - 0 points: A
      // - 1-20 points: B
      // - 21-50 points: C
      // - >50 points: D
      let rec = 'A';
      if (points > 50) rec = 'D';
      else if (points > 20) rec = 'C';
      else if (points > 0) rec = 'B';

      studentInfoMap.set(student.id!, { points, rec });
    }

    const result: any[] = [];
    for (const student of enrolled) {
      const info = studentInfoMap.get(student.id!) || { points: 0, rec: 'A' };
      const studentRecords = existingRows.filter((r) => r.studentId === student.id!);

      if (studentRecords.length > 0) {
        studentRecords.forEach((r) => {
          result.push({
            ...r,
            violationPoints: info.points,
            recommendedGrade: info.rec,
          });
        });
      } else {
        result.push({
          id: null,
          studentId: student.id,
          studentName: student.name,
          studentNis: student.nis,
          category: null,
          grade: null,
          violationPoints: info.points,
          recommendedGrade: info.rec,
        });
      }
    }

    return apiSuccess(result);
  } catch (err) {
    console.error('[akhlaq GET]', err);
    return apiError('Gagal mengambil data akhlaq', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const body = await validateBody(request, bulkAkhlaqSchema);
    if (!body.success) return body.errorResponse;

    const { academicYearId, semesterId, classId, records } = body.data;
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
      return apiError('Anda tidak memiliki izin untuk mengedit adab & akhlaq', 403);
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

    // Upsert each akhlaq record per student/category/semester
    for (const record of records) {
      const existing = await db
        .select({ id: akhlaq.id })
        .from(akhlaq)
        .where(
          and(
            eq(akhlaq.academicYearId, academicYearId),
            eq(akhlaq.semesterId, semesterId),
            eq(akhlaq.studentId, record.studentId),
            eq(akhlaq.category, record.category)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(akhlaq)
          .set({
            grade: record.grade,
            description: record.description || null,
            notes: record.notes || null,
            updatedBy: session.userId,
            updatedAt: new Date(),
          })
          .where(eq(akhlaq.id, existing[0].id));
      } else {
        await db.insert(akhlaq).values({
          id: crypto.randomUUID(),
          academicYearId,
          semesterId,
          classId,
          studentId: record.studentId,
          category: record.category,
          grade: record.grade,
          description: record.description || null,
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
        module: 'akhlaq',
        action: 'update',
        description: `Penilaian akhlaq ${records.length} entri berhasil disimpan`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({}, 'Nilai akhlaq berhasil disimpan');
  } catch (err) {
    console.error('[akhlaq POST]', err);
    return apiError('Gagal menyimpan nilai akhlaq', 500);
  }
}

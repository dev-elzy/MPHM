import { z } from 'zod';
import { eq, and, SQL } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { akhlaq } from '@/db/schema/akhlaq';
import { academicYears } from '@/db/schema/academic-years';
import { students } from '@/db/schema/students';
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
    description: z.string().optional(),
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
    const studentId = url.searchParams.get('studentId');

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

    const conditions: SQL[] = [
      eq(akhlaq.academicYearId, academicYearId),
      eq(akhlaq.semesterId, semesterId),
      eq(akhlaq.classId, classId),
    ];

    if (studentId) conditions.push(eq(akhlaq.studentId, studentId));

    const rows = await db
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

    return apiSuccess(rows);
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
            updatedBy: session.userId
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

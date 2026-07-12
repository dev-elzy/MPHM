import { z } from 'zod';
import { eq, and, SQL, desc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { studentAchievements } from '@/db/schema/achievements';
import { students } from '@/db/schema/students';
import { getSession } from '@/lib/auth/session';
import { validateBody } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';

const createAchievementSchema = z.object({
  studentId: z.string().uuid('studentId harus berupa UUID yang valid'),
  title: z.string().min(1, 'Judul prestasi wajib diisi'),
  level: z.enum(['Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internal']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  notes: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const url = new URL(request.url);
    const studentId = url.searchParams.get('studentId');

    const db = getDb();
    const conditions: SQL[] = [];

    if (studentId) {
      conditions.push(eq(studentAchievements.studentId, studentId));
    }

    const rows = await db
      .select({
        id: studentAchievements.id,
        studentId: studentAchievements.studentId,
        title: studentAchievements.title,
        level: studentAchievements.level,
        date: studentAchievements.date,
        notes: studentAchievements.notes,
        createdAt: studentAchievements.createdAt,
        studentName: students.name,
        studentNis: students.nis,
      })
      .from(studentAchievements)
      .innerJoin(students, eq(studentAchievements.studentId, students.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(studentAchievements.date));

    return apiSuccess(rows);
  } catch (err) {
    console.error('[achievements GET]', err);
    return apiError('Gagal mengambil data prestasi', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    // Only mustahiq, sekretariat, and other admin roles can create
    const userRole = (session.role || '').toLowerCase();
    const canWrite = ['mustahiq', 'teacher', 'ustadz', 'sekretariat', 'super_admin', 'admin', 'operator'].includes(userRole);
    if (!canWrite) {
      return apiError('Anda tidak memiliki izin untuk mencatat prestasi', 403);
    }

    const body = await validateBody(request, createAchievementSchema);
    if (!body.success) return body.errorResponse;

    const { studentId, title, level, date, notes } = body.data;
    const db = getDb();

    // Verify student exists
    const studentCheck = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (studentCheck.length === 0) {
      return apiError('Santri tidak ditemukan', 404);
    }

    const id = crypto.randomUUID();
    await db.insert(studentAchievements).values({
      id,
      studentId,
      title,
      level,
      date,
      notes: notes || null,
      createdBy: session.userId,
      updatedBy: session.userId,
    });

    return apiSuccess({ id }, 'Prestasi berhasil dicatat', 201);
  } catch (err) {
    console.error('[achievements POST]', err);
    return apiError('Gagal mencatat prestasi', 500);
  }
}

import { getDb } from '@/db/client';
import { academicClasses, people, classEnrollments } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';

interface CreateClassBody {
  academicYearId: string;
  jenjangId: string;
  tingkatId: string;
  className: string;
  classCode: string;
  mustahiqId?: string | null;
  capacity?: number;
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);

    const { searchParams } = new URL(request.url);
    const yearId = searchParams.get('academicYearId');

    const db = getDb();
    const rows = await db
      .select({
        id: academicClasses.id,
        academicYearId: academicClasses.academicYearId,
        jenjangId: academicClasses.jenjangId,
        tingkatId: academicClasses.tingkatId,
        className: academicClasses.className,
        classCode: academicClasses.classCode,
        mustahiqId: academicClasses.mustahiqId,
        mustahiqName: people.fullName,
        capacity: academicClasses.capacity,
        status: academicClasses.status,
        enrolledCount: sql<number>`(
          SELECT COUNT(*) FROM ${classEnrollments}
          WHERE ${classEnrollments.classId} = ${academicClasses.id}
          AND ${classEnrollments.status} = 'ACTIVE'
        )`,
      })
      .from(academicClasses)
      .leftJoin(people, eq(academicClasses.mustahiqId, people.id))
      .where(yearId ? eq(academicClasses.academicYearId, yearId) : undefined);

    return apiSuccess(rows, 'Berhasil mengambil daftar rombongan belajar / kelas');
  } catch (error: unknown) {
    console.error('GET /api/v1/academic/classes Error:', error);
    return apiError('Gagal mengambil daftar kelas', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);

    const body = (await request.json()) as CreateClassBody;
    if (!body.academicYearId || !body.jenjangId || !body.tingkatId || !body.className || !body.classCode) {
      return apiError('Data kelas (academicYearId, jenjangId, tingkatId, className, classCode) wajib diisi', 400);
    }

    const db = getDb();

    // Check Business Rule: One Mustahiq -> max 1 active class per academic year
    if (body.mustahiqId) {
      const existingMustahiqAssignment = await db
        .select()
        .from(academicClasses)
        .where(eq(academicClasses.mustahiqId, body.mustahiqId));
      const activeInYear = existingMustahiqAssignment.filter(
        (c) => c.academicYearId === body.academicYearId && c.status === 'ACTIVE'
      );
      if (activeInYear.length > 0) {
        return apiError(
          `Mustahiq terpilih sudah mengampu kelas ${activeInYear[0].className} pada tahun ajaran ${body.academicYearId}.`,
          409
        );
      }
    }

    const newId = `acad-class-${Date.now()}`;
    await db.insert(academicClasses).values({
      id: newId,
      academicYearId: body.academicYearId,
      jenjangId: body.jenjangId,
      tingkatId: body.tingkatId,
      className: body.className,
      classCode: body.classCode,
      mustahiqId: body.mustahiqId || null,
      capacity: body.capacity || 35,
      status: 'ACTIVE',
    });

    return apiSuccess({ id: newId }, 'Rombongan belajar baru berhasil dibuat', 201);
  } catch (error: unknown) {
    console.error('POST /api/v1/academic/classes Error:', error);
    return apiError('Gagal membuat rombongan belajar baru', 500);
  }
}

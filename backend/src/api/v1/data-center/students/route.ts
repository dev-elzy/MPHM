import { z } from 'zod';
import { eq, sql, and, like, or, SQL, desc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { people, studentProfiles, classStudents, classes } from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { validateBody, validateQueryParams } from '@/lib/api/validation';
import { apiSuccess, apiError } from '@/lib/api/response';
import { getPaginationParams, getPaginationMeta } from '@/lib/api/pagination';
import { logActivity } from '@/lib/audit';

// Validation Schemas
const createStudentSchema = z.object({
  nis: z.string().optional().nullable(),
  nisn: z.string().optional().nullable(),
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  birthDate: z.string().optional().nullable(),
  birthPlace: z.string().optional().nullable(),
  // Emsifa Address fields
  province: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  subDistrict: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(), // Will save to addressDetail or just ignore for now
  address: z.string().optional().nullable(),
  
  parentName: z.string().optional().nullable(),
  parentPhone: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  entryYear: z.string().optional().nullable(),
  entryJenjang: z.string().optional().nullable(),
  status: z.string().default('active'),
  notes: z.string().optional().nullable(),
  // Dynamic enrollment on creation
  classId: z.string().optional().nullable(),
  academicYearId: z.string().optional().nullable(),
  semesterId: z.string().optional().nullable(),
});

const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  classId: z.string().optional(),
  academicYearId: z.string().optional(),
  semesterId: z.string().optional(),
});

// GET /api/v1/data-center/students
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);

    const valParams = validateQueryParams(request.url, queryParamsSchema);
    if (!valParams.success) return valParams.errorResponse;

    const { search, status, classId, academicYearId, semesterId } = valParams.data;
    const { page, limit, offset } = getPaginationParams(request.url, 'name', 25);
    const db = getDb();

    // Base conditions for students (institutionId doesn't exist on people, so we skip it)
    const conditions = [
      eq(people.id, studentProfiles.personId)
    ];

    if (search) {
      conditions.push(
        or(
          like(people.fullName, `%${search}%`),
          like(studentProfiles.nis, `%${search}%`),
          like(studentProfiles.nisn, `%${search}%`)
        ) as unknown as SQL
      );
    }
    if (status) {
      conditions.push(eq(studentProfiles.status, status));
    }

    const baseQuery = db
      .select({ count: sql<number>`count(distinct ${people.id})` })
      .from(people)
      .innerJoin(studentProfiles, eq(people.id, studentProfiles.personId));

    if (classId || academicYearId || semesterId) {
      const joinConds = [
        eq(classStudents.studentProfileId, studentProfiles.id),
        eq(classStudents.status, 'active')
      ];
      if (classId) joinConds.push(eq(classStudents.classId, classId));
      if (academicYearId) joinConds.push(eq(classStudents.academicYearId, academicYearId));
      if (semesterId) joinConds.push(eq(classStudents.semesterId, semesterId));
      baseQuery.innerJoin(classStudents, and(...joinConds));
    }

    const countResult = await baseQuery.where(and(...conditions));
    const totalItems = countResult[0]?.count || 0;

    const selectQuery = db
      .select({
        id: people.id, // We use Person ID as the main ID for the frontend to mutate easily
        profileId: studentProfiles.id,
        nis: studentProfiles.nis,
        nisn: studentProfiles.nisn,
        name: people.fullName,
        birthDate: people.birthDate,
        birthPlace: people.birthPlace,
        gender: people.gender,
        province: people.province,
        city: people.regency, // Mapped to regency
        district: people.district,
        subDistrict: people.village, // Mapped to village
        address: people.address,
        phone: people.phone,
        entryYear: studentProfiles.entryYear,
        status: studentProfiles.status,
        createdAt: people.createdAt,
        classId: classes.id,
        className: classes.name,
      })
      .from(people)
      .innerJoin(studentProfiles, eq(people.id, studentProfiles.personId));

    if (classId || academicYearId || semesterId) {
      const joinConds = [
        eq(classStudents.studentProfileId, studentProfiles.id),
        eq(classStudents.status, 'active')
      ];
      if (classId) joinConds.push(eq(classStudents.classId, classId));
      if (academicYearId) joinConds.push(eq(classStudents.academicYearId, academicYearId));
      if (semesterId) joinConds.push(eq(classStudents.semesterId, semesterId));
      selectQuery.innerJoin(classStudents, and(...joinConds))
                 .leftJoin(classes, eq(classStudents.classId, classes.id));
    } else {
      selectQuery.leftJoin(classStudents, and(
        eq(classStudents.studentProfileId, studentProfiles.id),
        eq(classStudents.status, 'active')
      )).leftJoin(classes, eq(classStudents.classId, classes.id));
    }

    const items = await selectQuery
      .where(and(...conditions))
      .orderBy(desc(people.createdAt))
      .limit(limit)
      .offset(offset);

    // Filter duplicates if multiple enrollments exist (take first)
    const uniqueMap = new Map();
    items.forEach(item => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    return apiSuccess({
      items: Array.from(uniqueMap.values()),
      meta: getPaginationMeta(totalItems, page, limit),
    }, 'Berhasil mengambil daftar siswi');
  } catch (error) {
    console.error('GET students error:', error);
    return apiError('Internal Server Error', 500);
  }
}

// POST /api/v1/data-center/students
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Sesi tidak valid', 401);
    if (session.role !== 'sekretariat') return apiError('Unauthorized', 403);

    const valResult = await validateBody(request, createStudentSchema);
    if (!valResult.success) return valResult.errorResponse;

    const { classId, academicYearId, semesterId, ...data } = valResult.data;
    const db = getDb();

    if (data.nis) {
      const existing = await db.select().from(studentProfiles)
        .where(eq(studentProfiles.nis, data.nis))
        .limit(1);
      if (existing.length > 0) return apiError(`NIS ${data.nis} sudah terdaftar`, 409);
    }

    const personId = crypto.randomUUID();
    const profileId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      // Create Person
      await tx.insert(people).values({
        id: personId,
        nik: null,
        fullName: data.name,
        gender: 'female', // Force female for students
        birthPlace: data.birthPlace || null,
        birthDate: data.birthDate || null,
        phone: data.phone || null,
        address: data.address || null,
        province: data.province || null,
        regency: data.city || null,
        district: data.district || null,
        village: data.subDistrict || null,
        addressDetail: data.postalCode ? `Kode Pos: ${data.postalCode}` : null,
        createdBy: session.userId,
        updatedBy: session.userId,
      });

      // Create Student Profile
      await tx.insert(studentProfiles).values({
        id: profileId,
        personId: personId,
        nis: data.nis || null,
        nisn: data.nisn || null,
        entryYear: data.entryYear || null,
        currentClassId: classId && classId !== 'none' ? classId : null,
        status: data.status,
        createdBy: session.userId,
        updatedBy: session.userId,
      });

      // Create Enrollment if class is selected
      if (classId && classId !== 'none' && academicYearId && semesterId) {
        await tx.insert(classStudents).values({
          id: crypto.randomUUID(),
          studentProfileId: profileId,
          academicYearId,
          semesterId,
          classId,
          status: 'active',
          createdBy: session.userId,
          updatedBy: session.userId,
        });
      }
    });

    const d1 = (process.env.DB || (globalThis as Record<string, unknown>).DB) as D1Database;
    if (d1) {
      await logActivity(d1, {
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        module: 'data-center',
        action: 'create_student',
        entityId: personId,
        entityType: 'student',
        newData: { name: data.name },
        description: `Siswi ${data.name} berhasil didaftarkan`,
        institutionId: session.institutionId,
      });
    }

    return apiSuccess({ id: personId }, 'Siswi berhasil didaftarkan', 201);
  } catch (error) {
    console.error('POST student error:', error);
    return apiError('Internal Server Error', 500);
  }
}

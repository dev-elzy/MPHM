import { isNotNull, eq, and } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { people, studentProfiles } from '@/db/schema';
import { users } from '@/db/schema/users';
import { classes } from '@/db/schema/classes';
import { curriculums } from '@/db/schema/curriculums';
import { academicYears } from '@/db/schema/academic-years';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { checkRole } from '@/lib/auth/rbac';


export async function GET() {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    // RBAC: Only super_admin and admin can view Recycle Bin
    const rbac = checkRole(session, ['sekretariat']);
    if (!rbac.authorized) return rbac.response!;

    const db = getDb();

    // Fetch all soft-deleted records across modules
    const [deletedStudents, deletedUsers, deletedClasses, deletedCurriculums] = await Promise.all([
      db
        .select({ id: studentProfiles.id, name: people.fullName, deletedAt: studentProfiles.deletedAt })
        .from(studentProfiles).innerJoin(people, eq(people.id, studentProfiles.personId))
        .where(isNotNull(studentProfiles.deletedAt)),
      db
        .select({ id: users.id, name: users.name, deletedAt: users.deletedAt })
        .from(users)
        .where(and(eq(users.institutionId, session.institutionId), isNotNull(users.deletedAt))),
      db
        .select({ id: classes.id, name: classes.name, deletedAt: classes.deletedAt })
        .from(classes)
        .innerJoin(academicYears, eq(classes.academicYearId, academicYears.id))
        .where(and(eq(academicYears.institutionId, session.institutionId), isNotNull(classes.deletedAt))),
      db
        .select({ id: curriculums.id, name: curriculums.name, deletedAt: curriculums.deletedAt })
        .from(curriculums)
        .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
        .where(and(eq(academicYears.institutionId, session.institutionId), isNotNull(curriculums.deletedAt))),
    ]);

    const toEpoch = (d: Date | null | undefined): number | null =>
      d instanceof Date ? Math.floor(d.getTime() / 1000) : null;

    const results = [
      {
        module: 'students',
        items: deletedStudents
          .filter((r) => r.deletedAt !== null)
          .map((r) => ({ id: r.id, name: r.name, deletedAt: toEpoch(r.deletedAt)! })),
      },
      {
        module: 'users',
        items: deletedUsers
          .filter((r) => r.deletedAt !== null)
          .map((r) => ({ id: r.id, name: r.name, deletedAt: toEpoch(r.deletedAt)! })),
      },
      {
        module: 'classes',
        items: deletedClasses
          .filter((r) => r.deletedAt !== null)
          .map((r) => ({ id: r.id, name: r.name, deletedAt: toEpoch(r.deletedAt)! })),
      },
      {
        module: 'curriculums',
        items: deletedCurriculums
          .filter((r) => r.deletedAt !== null)
          .map((r) => ({ id: r.id, name: r.name, deletedAt: toEpoch(r.deletedAt)! })),
      },
    ];

    return apiSuccess(results);
  } catch (err) {
    console.error('[recycle-bin GET]', err);
    return apiError('Gagal mengambil data recycle bin', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    // RBAC: Only super_admin and admin can restore items
    const rbac = checkRole(session, ['sekretariat']);
    if (!rbac.authorized) return rbac.response!;

    const body = await request.json() as { module?: string; id?: string };
    const { module: mod, id } = body;
    if (!mod || !id) return apiError('module and id are required', 400);

    const db = getDb();
    const now = new Date();

    if (mod === 'students') {
      // Verify ownership
      const check = await db.select({ id: studentProfiles.id }).from(studentProfiles).innerJoin(people, eq(people.id, studentProfiles.personId))
        .where(eq(studentProfiles.id, id)).limit(1);
      if (check.length === 0) return apiError('Item tidak ditemukan', 404);
      await db.update(studentProfiles).set({ deletedAt: null, updatedAt: now }).where(eq(studentProfiles.id, id));
    } else if (mod === 'users') {
      const check = await db.select({ id: users.id }).from(users)
        .where(and(eq(users.id, id), eq(users.institutionId, session.institutionId))).limit(1);
      if (check.length === 0) return apiError('Item tidak ditemukan', 404);
      await db.update(users).set({ deletedAt: null, updatedAt: now }).where(eq(users.id, id));
    } else if (mod === 'classes') {
      // Classes don't have institutionId directly, verify via academicYear
      const check = await db.select({ id: classes.id }).from(classes)
        .innerJoin(academicYears, eq(classes.academicYearId, academicYears.id))
        .where(and(eq(classes.id, id), eq(academicYears.institutionId, session.institutionId))).limit(1);
      if (check.length === 0) return apiError('Item tidak ditemukan', 404);
      await db.update(classes).set({ deletedAt: null, updatedAt: now }).where(eq(classes.id, id));
    } else if (mod === 'curriculums') {
      const check = await db.select({ id: curriculums.id }).from(curriculums)
        .innerJoin(academicYears, eq(curriculums.academicYearId, academicYears.id))
        .where(and(eq(curriculums.id, id), eq(academicYears.institutionId, session.institutionId))).limit(1);
      if (check.length === 0) return apiError('Item tidak ditemukan', 404);
      await db.update(curriculums).set({ deletedAt: null, updatedAt: now }).where(eq(curriculums.id, id));
    } else {
      return apiError('Invalid module name', 400);
    }

    return apiSuccess({ success: true }, 'Item berhasil dipulihkan');
  } catch (err) {
    console.error('[recycle-bin POST]', err);
    return apiError('Gagal memulihkan data', 500);
  }
}

import { eq, and, count } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { people, studentProfiles } from '@/db/schema';
import { classes } from '@/db/schema/classes';
import { scoreSessions } from '@/db/schema/scores';
import { academicYears } from '@/db/schema/academic-years';
import { users } from '@/db/schema/users';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { notDeleted } from '@/lib/soft-delete';


export async function GET() {
  try {
    const session = await getSession();
    if (!session) return apiError('Unauthorized', 401);

    const db = getDb();

    // Fetch key stats in parallel using SQL COUNT() for performance
    const [
      studentCount,
      classCount,
      userCount,
      activeYears,
      recentSessions,
    ] = await Promise.all([
      db
        .select({ count: count() })
        .from(studentProfiles)
        .where(and(notDeleted(studentProfiles), eq(studentProfiles.status, 'active'))),
      db
        .select({ count: count() })
        .from(classes)
        .where(notDeleted(classes)),
      db
        .select({ count: count() })
        .from(users)
        .where(and(notDeleted(users), eq(users.status, 'active'))),
      db
        .select({
          id: academicYears.id,
          name: academicYears.name,
          status: academicYears.status,
        })
        .from(academicYears)
        .where(eq(academicYears.status, 'active'))
        .limit(1),
      db
        .select({
          id: scoreSessions.id,
          status: scoreSessions.status,
          classId: scoreSessions.classId,
          updatedAt: scoreSessions.updatedAt,
        })
        .from(scoreSessions)
        .limit(5),
    ]);

    return apiSuccess({
      stats: {
        totalStudents: studentCount[0]?.count ?? 0,
        totalClasses: classCount[0]?.count ?? 0,
        totalUsers: userCount[0]?.count ?? 0,
        activeYear: activeYears[0] || null,
      },
      recentActivity: recentSessions,
    });
  } catch (err) {
    console.error('[dashboard/admin GET]', err);
    return apiError('Gagal mengambil data dashboard', 500);
  }
}

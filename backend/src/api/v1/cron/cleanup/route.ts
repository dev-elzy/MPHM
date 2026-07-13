import { lt, and, isNotNull } from 'drizzle-orm';
import { getDb } from '@/db/client';
import { people, studentProfiles } from '@/db/schema';
import { users } from '@/db/schema/users';
import { classes } from '@/db/schema/classes';
import { curriculums } from '@/db/schema/curriculums';
import { apiSuccess, apiError } from '@/lib/api/response';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET || 'mphm-default-cron-secret-key-2026';

    if (secret !== expectedSecret) {
      return apiError('Unauthorized', 401);
    }

    const db = getDb();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Hard-delete items in Recycle Bin that are older than 30 days
    const deletedStudentsCount = await db
      .delete(studentProfiles)
      .where(and(isNotNull(studentProfiles.deletedAt), lt(studentProfiles.deletedAt, thirtyDaysAgo)));

    const deletedUsersCount = await db
      .delete(users)
      .where(and(isNotNull(users.deletedAt), lt(users.deletedAt, thirtyDaysAgo)));

    const deletedClassesCount = await db
      .delete(classes)
      .where(and(isNotNull(classes.deletedAt), lt(classes.deletedAt, thirtyDaysAgo)));

    const deletedCurriculumsCount = await db
      .delete(curriculums)
      .where(and(isNotNull(curriculums.deletedAt), lt(curriculums.deletedAt, thirtyDaysAgo)));

    return apiSuccess({
      cleaned: {
        students: deletedStudentsCount,
        users: deletedUsersCount,
        classes: deletedClassesCount,
        curriculums: deletedCurriculumsCount,
      }
    }, 'Recycle Bin cleanup completed successfully');

  } catch (error) {
    console.error('[cron-cleanup GET]', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return apiError(message, 500);
  }
}

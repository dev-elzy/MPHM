import { getDb } from '@/db/client';
import {
  studentViolations,
  violationTypes,
  violationCategories,
  violationSeverities,
} from '@/db/schema/violations';
import { studentProfiles, people } from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { eq, desc, isNull } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const db = getDb();
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. All Active Incidents
    const allIncidents = await db
      .select({
        id: studentViolations.id,
        incidentDate: studentViolations.incidentDate,
        incidentTime: studentViolations.incidentTime,
        status: studentViolations.status,
        violationTypeName: violationTypes.name,
        categoryName: violationCategories.name,
        categoryColor: violationCategories.color,
        severityName: violationSeverities.name,
        severityBadge: violationSeverities.badgeColor,
        studentName: people.fullName,
        studentNis: studentProfiles.nis,
        studentProfileId: studentProfiles.id,
      })
      .from(studentViolations)
      .leftJoin(studentProfiles, eq(studentViolations.studentProfileId, studentProfiles.id))
      .leftJoin(people, eq(studentProfiles.personId, people.id))
      .leftJoin(violationTypes, eq(studentViolations.violationTypeId, violationTypes.id))
      .leftJoin(violationCategories, eq(violationTypes.categoryId, violationCategories.id))
      .leftJoin(violationSeverities, eq(violationTypes.severityId, violationSeverities.id))
      .where(isNull(studentViolations.deletedAt))
      .orderBy(desc(studentViolations.incidentDate));

    // 2. Daily & Weekly Counts
    const todayCount = allIncidents.filter((inc) => inc.incidentDate === todayStr).length;
    // For weekly demo calculation, count recent incidents
    const weekCount = allIncidents.length;

    // 3. Status Breakdown
    const statusBreakdown = {
      Dilaporkan: allIncidents.filter((i) => i.status === 'Dilaporkan').length,
      Diproses: allIncidents.filter((i) => i.status === 'Diproses').length,
      Selesai: allIncidents.filter((i) => i.status === 'Selesai').length,
    };

    // 4. Top Violators Leaderboard
    const violatorMap = new Map<string, { studentName: string; studentNis: string; count: number }>();
    for (const inc of allIncidents) {
      if (!inc.studentName || !inc.studentProfileId) continue;
      const key = inc.studentProfileId;
      const existing = violatorMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        violatorMap.set(key, {
          studentName: inc.studentName,
          studentNis: inc.studentNis || '-',
          count: 1,
        });
      }
    }
    const topViolators = Array.from(violatorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. Top Violation Types
    const typeMap = new Map<string, { typeName: string; categoryName: string; count: number }>();
    for (const inc of allIncidents) {
      const key = inc.violationTypeName || 'Lainnya';
      const existing = typeMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        typeMap.set(key, {
          typeName: key,
          categoryName: inc.categoryName || '-',
          count: 1,
        });
      }
    }
    const topViolationTypes = Array.from(typeMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return apiSuccess({
      todayCount,
      weekCount,
      statusBreakdown,
      topViolators,
      topViolationTypes,
      recentIncidents: allIncidents.slice(0, 10),
    });
  } catch (error: unknown) {
    console.error('Fetch Security Dashboard Error:', error);
    return apiError('Gagal memuat data analitik Dashboard Keamanan', 500);
  }
}

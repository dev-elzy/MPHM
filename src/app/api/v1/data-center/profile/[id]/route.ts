import { getDb } from '@/db/client';
import {
  people,
  studentProfiles,
  teacherProfiles,
  guardianProfiles,
  organizationMemberships,
  alumniRecords,
} from '@/db/schema';
import {
  studentViolations,
  violationTypes,
  violationCategories,
  violationSeverities,
} from '@/db/schema/violations';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const { id } = await params;
    const db = getDb();

    // 1. Fetch Core Person
    const person = await db.query.people.findFirst({
      where: eq(people.id, id),
    });

    if (!person) {
      return apiError('Data individu tidak ditemukan di Pusat Data', 404);
    }

    // 2. Fetch Student Profiles & Alumni Records
    const studentsList = await db.query.studentProfiles.findMany({
      where: eq(studentProfiles.personId, id),
    });

    const studentsWithAlumni = await Promise.all(
      studentsList.map(async (sp) => {
        const alumni = await db.query.alumniRecords.findFirst({
          where: eq(alumniRecords.studentProfileId, sp.id),
        });
        return {
          ...sp,
          alumniRecord: alumni || null,
        };
      })
    );

    // 3. Fetch Teacher Profiles
    const teachersList = await db.query.teacherProfiles.findMany({
      where: eq(teacherProfiles.personId, id),
    });

    // 4. Fetch Organization Memberships
    const organizationsList = await db.query.organizationMemberships.findMany({
      where: eq(organizationMemberships.personId, id),
    });

    // 5. Fetch Guardian Profiles
    const guardiansList = await db.query.guardianProfiles.findMany({
      where: eq(guardianProfiles.personId, id),
    });

    // 6. Fetch Disciplinary Violations across all student profiles
    const violationsList: {
      id: string;
      academicYearId: string;
      incidentDate: string;
      incidentTime: string | null;
      location: string | null;
      description: string;
      status: string;
      violationType: string | null;
      defaultPoints: number | null;
      categoryName: string | null;
      categoryColor: string | null;
      severityName: string | null;
      severityBadge: string | null;
    }[] = [];
    for (const sp of studentsList) {
      const records = await db
        .select({
          id: studentViolations.id,
          academicYearId: studentViolations.academicYearId,
          incidentDate: studentViolations.incidentDate,
          incidentTime: studentViolations.incidentTime,
          location: studentViolations.location,
          description: studentViolations.description,
          status: studentViolations.status,
          violationType: violationTypes.name,
          defaultPoints: violationTypes.defaultPoints,
          categoryName: violationCategories.name,
          categoryColor: violationCategories.color,
          severityName: violationSeverities.name,
          severityBadge: violationSeverities.badgeColor,
        })
        .from(studentViolations)
        .leftJoin(violationTypes, eq(studentViolations.violationTypeId, violationTypes.id))
        .leftJoin(violationCategories, eq(violationTypes.categoryId, violationCategories.id))
        .leftJoin(violationSeverities, eq(violationTypes.severityId, violationSeverities.id))
        .where(eq(studentViolations.studentProfileId, sp.id))
        .orderBy(desc(studentViolations.incidentDate));

      violationsList.push(...records);
    }

    // 7. Construct Audit Timeline Journey
    const auditTimeline: { date: string; title: string; category: string; description: string }[] = [];

    // Add entry timestamp
    if (person.createdAt) {
      auditTimeline.push({
        date: new Date(person.createdAt).toISOString().split('T')[0],
        title: 'Registrasi Identitas Pusat Data',
        category: 'System',
        description: `Profil terdaftar dengan ID ${person.id}`,
      });
    }

    for (const sp of studentsList) {
      auditTimeline.push({
        date: sp.entryYear ? `${sp.entryYear}-07-15` : '2023-07-15',
        title: 'Masuk sebagai Santri MPHM',
        category: 'Student',
        description: `NIS: ${sp.nis || '-'} | NISN: ${sp.nisn || '-'}`,
      });
    }

    for (const org of organizationsList) {
      auditTimeline.push({
        date: `${org.periodStartYear}-01-01`,
        title: `Dilantik sebagai ${org.position} ${org.organization}`,
        category: 'Organization',
        description: `Masa Khidmah Organisasi ${org.periodStartYear} - ${org.periodEndYear}`,
      });
    }

    for (const viol of violationsList) {
      auditTimeline.push({
        date: viol.incidentDate,
        title: `Catatan Pelanggaran (${viol.severityName})`,
        category: 'Disciplinary',
        description: `${viol.violationType}: ${viol.description}`,
      });
    }

    // Sort timeline descending by date
    auditTimeline.sort((a, b) => b.date.localeCompare(a.date));

    return apiSuccess({
      person,
      studentProfiles: studentsWithAlumni,
      teacherProfiles: teachersList,
      organizationMemberships: organizationsList,
      guardianProfiles: guardiansList,
      violations: violationsList,
      auditTimeline,
    });
  } catch (error: unknown) {
    console.error('Person Profile 360 Error:', error);
    return apiError('Gagal mengambil Profil Terpadu 360°', 500);
  }
}

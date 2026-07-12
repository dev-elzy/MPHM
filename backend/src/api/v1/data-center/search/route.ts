import { getDb } from '@/db/client';
import {
  people,
  studentProfiles,
  teacherProfiles,
  guardianProfiles,
  organizationMemberships,
  alumniRecords,
} from '@/db/schema';
import { getSession } from '@/lib/auth/session';
import { apiSuccess, apiError } from '@/lib/api/response';
import { like, or, eq, isNull, inArray, ne, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError('Sesi tidak valid atau telah berakhir', 401);
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();
    const roleFilter = (searchParams.get('role') || '').trim();

    const db = getDb();

    // Query core people matching query & role filter
    const conditions = [isNull(people.deletedAt)];
    if (query) {
      conditions.push(
        or(
          like(people.fullName, `%${query}%`),
          like(people.nik, `%${query}%`),
          like(people.phone, `%${query}%`),
          like(people.address, `%${query}%`)
        )!
      );
    }

    // Apply backend role filtering using native IN subqueries
    if (roleFilter === 'student') {
      conditions.push(
        inArray(
          people.id,
          db.select({ personId: studentProfiles.personId })
            .from(studentProfiles)
            .where(and(isNull(studentProfiles.deletedAt), ne(studentProfiles.status, 'alumni')))
        )
      );
    } else if (roleFilter === 'alumni') {
      conditions.push(
        inArray(
          people.id,
          db.select({ personId: studentProfiles.personId })
            .from(studentProfiles)
            .where(and(isNull(studentProfiles.deletedAt), eq(studentProfiles.status, 'alumni')))
        )
      );
    } else if (roleFilter === 'teacher') {
      conditions.push(
        inArray(
          people.id,
          db.select({ personId: teacherProfiles.personId })
            .from(teacherProfiles)
        )
      );
    } else if (roleFilter === 'organization') {
      conditions.push(
        inArray(
          people.id,
          db.select({ personId: organizationMemberships.personId })
            .from(organizationMemberships)
        )
      );
    } else if (roleFilter === 'guardian') {
      conditions.push(
        inArray(
          people.id,
          db.select({ personId: guardianProfiles.personId })
            .from(guardianProfiles)
        )
      );
    }

    const matchedPeople = await db.query.people.findMany({
      where: (t, { and }) => and(...conditions),
      limit: 25,
    });

    // Enrich each person with multi-role pill badges
    const results = await Promise.all(
      matchedPeople.map(async (person) => {
        const roles: { type: string; label: string; badgeColor: string; detail?: string }[] = [];

        // Check Student Profiles & Alumni Records
        const studentsList = await db.query.studentProfiles.findMany({
          where: eq(studentProfiles.personId, person.id),
        });

        for (const sp of studentsList) {
          // Check if also has alumni record
          const alumni = await db.query.alumniRecords.findFirst({
            where: eq(alumniRecords.studentProfileId, sp.id),
          });
          if (alumni || sp.status === 'alumni') {
            roles.push({
              type: 'alumni',
              label: 'Alumni',
              badgeColor: 'purple',
              detail: `NIS: ${sp.nis || '-'} | Khidmah: ${alumni?.khidmahStatus || 'Selesai'}`,
            });
          } else {
            roles.push({
              type: 'student',
              label: 'Santri Aktif',
              badgeColor: 'emerald',
              detail: `NIS: ${sp.nis || '-'} | Angkatan: ${sp.entryYear || '-'}`,
            });
          }
        }

        // Check Teacher Profiles
        const teachersList = await db.query.teacherProfiles.findMany({
          where: eq(teacherProfiles.personId, person.id),
        });
        for (const tp of teachersList) {
          roles.push({
            type: 'teacher',
            label: tp.teacherType === 'munawib' ? 'Pengajar Munawib' : 'Mustahiq',
            badgeColor: 'blue',
            detail: `Kode: ${tp.code || '-'} | Status: ${tp.status}`,
          });
        }

        // Check Organization Memberships (Pengurus)
        const orgsList = await db.query.organizationMemberships.findMany({
          where: eq(organizationMemberships.personId, person.id),
        });
        for (const om of orgsList) {
          roles.push({
            type: 'organization',
            label: `Pengurus ${om.organization}`,
            badgeColor: 'amber',
            detail: `${om.position} (${om.periodStartYear}-${om.periodEndYear})`,
          });
        }

        // Check Guardian Profiles
        const guardiansList = await db.query.guardianProfiles.findMany({
          where: eq(guardianProfiles.personId, person.id),
        });
        if (guardiansList.length > 0) {
          roles.push({
            type: 'guardian',
            label: 'Wali Santri',
            badgeColor: 'indigo',
            detail: `Hubungan: ${guardiansList[0].relationship}`,
          });
        }

        return {
          id: person.id,
          nik: person.nik,
          fullName: person.fullName,
          gender: person.gender,
          phone: person.phone,
          address: person.address,
          roles,
        };
      })
    );

    return apiSuccess({
      query,
      count: results.length,
      results,
    });
  } catch (error: unknown) {
    console.error('Data Center Search Error:', error);
    return apiError('Gagal melakukan pencarian Pusat Data', 500);
  }
}

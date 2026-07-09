import { getDb } from '../client';
import {
  violationCategories,
  violationSeverities,
  violationTypes,
  studentViolations,
} from '../schema/violations';
import {
  people,
  studentProfiles,
  organizationMemberships,
  academicClasses,
  classEnrollments,
} from '../schema';
import { eq } from 'drizzle-orm';

export async function seedPersonCentricAndViolations() {
  console.log('Seeding Person-Centric Core & 3-Layer Dynamic Violations...');
  const db = getDb();

  // 1. Seed Categories
  const categoriesData = [
    { id: 'cat-kerapian', name: 'Kerapian & Pakaian', color: '#3B82F6', icon: 'Shirt' },
    { id: 'cat-kedisiplinan', name: 'Kedisiplinan & Waktu', color: '#EAB308', icon: 'Clock' },
    { id: 'cat-adab', name: 'Adab & Akhlak', color: '#EC4899', icon: 'HeartHandshake' },
    { id: 'cat-ibadah', name: 'Ibadah & Kegiatan Pondok', color: '#10B981', icon: 'BookOpen' },
    { id: 'cat-keamanan', name: 'Keamanan & Ketertiban', color: '#EF4444', icon: 'ShieldAlert' },
  ];

  for (const cat of categoriesData) {
    const existing = await db.query.violationCategories.findFirst({
      where: eq(violationCategories.id, cat.id),
    });
    if (!existing) {
      await db.insert(violationCategories).values({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        isActive: true,
      });
    }
  }

  // 2. Seed Severities
  const severitiesData = [
    { id: 'sev-ringan', name: 'Ringan', levelWeight: 1, badgeColor: 'blue' },
    { id: 'sev-sedang', name: 'Sedang', levelWeight: 2, badgeColor: 'yellow' },
    { id: 'sev-berat', name: 'Berat', levelWeight: 3, badgeColor: 'red' },
  ];

  for (const sev of severitiesData) {
    const existing = await db.query.violationSeverities.findFirst({
      where: eq(violationSeverities.id, sev.id),
    });
    if (!existing) {
      await db.insert(violationSeverities).values({
        id: sev.id,
        name: sev.name,
        levelWeight: sev.levelWeight,
        badgeColor: sev.badgeColor,
        isActive: true,
      });
    }
  }

  // 3. Seed Types
  const typesData = [
    {
      id: 'vtype-1',
      categoryId: 'cat-kedisiplinan',
      severityId: 'sev-ringan',
      name: 'Terlambat masuk kelas sekolah pagi',
      defaultPoints: 5,
      description: 'Terlambat hadir lebih dari 10 menit setelah bel berbunyi',
    },
    {
      id: 'vtype-2',
      categoryId: 'cat-kerapian',
      severityId: 'sev-ringan',
      name: 'Tidak memakai atribut seragam lengkap',
      defaultPoints: 5,
      description: 'Tidak memakai badge, kerudung tidak sesuai ketentuan',
    },
    {
      id: 'vtype-3',
      categoryId: 'cat-keamanan',
      severityId: 'sev-berat',
      name: 'Keluar kompleks madrasah/asrama tanpa izin',
      defaultPoints: 25,
      description: 'Keluar area pondok tanpa surat izin resmi dari keamanan',
    },
    {
      id: 'vtype-4',
      categoryId: 'cat-ibadah',
      severityId: 'sev-sedang',
      name: 'Tidak mengikuti kegiatan jamaah sholat wajib',
      defaultPoints: 15,
      description: 'Absen jamaah tanpa alasan syari yang sah',
    },
  ];

  for (const vt of typesData) {
    const existing = await db.query.violationTypes.findFirst({
      where: eq(violationTypes.id, vt.id),
    });
    if (!existing) {
      await db.insert(violationTypes).values({
        id: vt.id,
        categoryId: vt.categoryId,
        severityId: vt.severityId,
        name: vt.name,
        defaultPoints: vt.defaultPoints,
        description: vt.description,
        isActive: true,
      });
    }
  }

  // 4. Seed Demo Person (Fatimah Zahra) for Person 360 & Global Search Demo
  const demoPersonId = 'person-fatimah-demo';
  const existingPerson = await db.query.people.findFirst({
    where: eq(people.id, demoPersonId),
  });

  if (!existingPerson) {
    await db.insert(people).values({
      id: demoPersonId,
      nik: '3507012345678901',
      fullName: 'Fatimah Az-Zahra Al-Hidayah',
      gender: 'P',
      birthPlace: 'Malang',
      birthDate: '2006-08-14',
      phone: '081234567890',
      address: 'Jl. Pesantren Putri No. 99, Jawa Timur',
      email: 'fatimah.zahra@mphm.sch.id',
    });

    // Create Student Profile
    const studentProfileId = 'student-prof-fatimah';
    await db.insert(studentProfiles).values({
      id: studentProfileId,
      personId: demoPersonId,
      nis: '20230101',
      nisn: '0061234567',
      entryYear: '2023',
      status: 'active',
    });

    // Create Organization Membership
    await db.insert(organizationMemberships).values({
      id: 'org-mem-fatimah-1',
      personId: demoPersonId,
      organization: 'MPHM',
      position: 'Ketua Bagian Bahasa',
      periodStartYear: '2025',
      periodEndYear: '2026',
      status: 'active',
    });

    // Create Sample Student Violation
    await db.insert(studentViolations).values({
      id: 'viol-fatimah-1',
      academicYearId: '2026-2027',
      studentProfileId: studentProfileId,
      violationTypeId: 'vtype-1',
      incidentDate: new Date().toISOString().split('T')[0],
      incidentTime: '07:15',
      location: 'Gerbang Kelas Ula',
      description: 'Terlambat 15 menit karena tiket piket asrama belum selesai',
      status: 'Selesai',
    });

    // Create Sample Academic Class & Enrollment
    const sampleClassId = 'acad-class-ibt-2a';
    await db.insert(academicClasses).values({
      id: sampleClassId,
      academicYearId: '2026-2027',
      jenjangId: '2', // Ibtida'iyyah
      tingkatId: 'II',
      className: 'Ibtidaiyyah II-A',
      classCode: 'IBT-2A-2627',
      mustahiqId: demoPersonId, // Wali kelas
      capacity: 35,
      status: 'ACTIVE',
    });

    await db.insert(classEnrollments).values({
      id: 'enroll-fatimah-1',
      academicYearId: '2026-2027',
      classId: sampleClassId,
      studentProfileId: studentProfileId,
      status: 'ACTIVE',
      notes: 'Penempatan awal tahun ajaran',
    });
  }

  console.log('Person-Centric Core, Violations & Academic Classes Seeding Completed.');
}

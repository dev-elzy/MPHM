import { getDb } from '../client';
import { schedules } from '../schema/schedules';
import { academicYears } from '../schema/academic-years';
import { semesters } from '../schema/semesters';
import { eq } from 'drizzle-orm';
// import { promotionPeriods, promotionTransactions, academicHistory } from '../schema/promotions';

export async function seedAdvancedModules() {
  console.log('Seeding Advanced Modules (Schedules & Promotions)...');
  const db = getDb();

  // Get active year and semester
  const activeYear = await db.query.academicYears.findFirst({ where: eq(academicYears.status, 'active') });
  const activeSemester = await db.query.semesters.findFirst({ where: eq(semesters.status, 'active') });

  if (!activeYear || !activeSemester) {
    console.log('No active year or semester found. Skip seeding advanced modules.');
    return;
  }

  const existingClasses = await db.query.classes.findMany();

  if (existingClasses.length > 0) {
    console.log('Seeding schedules for class:', existingClasses[0].name);
    // Add schedule
    await db.insert(schedules).values({
      id: crypto.randomUUID(),
      academicYearId: activeYear.id,
      semesterId: activeSemester.id,
      targetType: 'class',
      jenjang: existingClasses[0].jenjang,
      tingkat: existingClasses[0].tingkat,
      classId: existingClasses[0].id,
      day: 'senin',
      startTime: '07:00',
      endTime: '09:00',
      activity: 'Sekolah Hissoh Ula',
      isOverride: true,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    console.log('No classes found to seed schedules for.');
  }

  console.log('Advanced Modules Seeding Completed.');
}

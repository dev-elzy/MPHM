import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { classes } from './classes';
import { studentProfiles } from './person-profiles';

// ============================================================
// Class Enrollments (class_students)
// Student enrollment in class per semester
// One student profile can only be in one class per academic year
// ============================================================

export const classStudents = sqliteTable('class_students', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  studentProfileId: text('student_profile_id').notNull().references(() => studentProfiles.id, { onDelete: 'restrict' }),
  enrollmentDate: text('enrollment_date'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  // One student per class per semester
  uniqueIndex('idx_cs_student_year_sem').on(table.studentProfileId, table.academicYearId, table.semesterId),
  index('idx_cs_class').on(table.classId),
  index('idx_cs_student').on(table.studentProfileId),
  index('idx_cs_year').on(table.academicYearId),
  index('idx_cs_year_class').on(table.academicYearId, table.classId),
]);

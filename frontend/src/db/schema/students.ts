import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { classes } from './classes';

// ============================================================
// Students — Master Siswi Data
// Global entity, enrolled in classes per academic year
// ============================================================

export const students = sqliteTable('students', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull().default('default'),
  nis: text('nis'), // Nomor Induk Siswi
  nisn: text('nisn'), // Nomor Induk Siswa Nasional
  name: text('name').notNull(),
  birthDate: text('birth_date'),
  birthPlace: text('birth_place'),
  gender: text('gender').notNull().default('female'),
  address: text('address'),
  parentName: text('parent_name'),
  parentPhone: text('parent_phone'),
  phone: text('phone'),
  photoUrl: text('photo_url'),
  entryYear: text('entry_year'),
  entryJenjang: text('entry_jenjang'),
  status: text('status').notNull().default('active'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_student_institution').on(table.institutionId),
  index('idx_student_nis').on(table.nis),
  index('idx_student_name').on(table.name),
  index('idx_student_status').on(table.status),
  index('idx_student_deleted').on(table.deletedAt),
]);

// ============================================================
// Class Students — Student enrollment in class per semester
// One student can only be in one class per academic year
// ============================================================

export const classStudents = sqliteTable('class_students', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'restrict' }),
  enrollmentDate: text('enrollment_date'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  // One student per class per semester
  uniqueIndex('idx_cs_student_year_sem').on(table.studentId, table.academicYearId, table.semesterId),
  index('idx_cs_class').on(table.classId),
  index('idx_cs_student').on(table.studentId),
  index('idx_cs_year').on(table.academicYearId),
  index('idx_cs_year_class').on(table.academicYearId, table.classId),
]);

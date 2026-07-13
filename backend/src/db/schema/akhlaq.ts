import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { classes } from './classes';
import { studentProfiles as students } from './person-profiles';

// ============================================================
// Akhlaq — Separate table, not mixed with academic scores
// Per blueprint: "Akhlaq memiliki tabel sendiri"
// ============================================================

export const akhlaq = sqliteTable('akhlaq', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'restrict' }),
  category: text('category').notNull(),
  grade: text('grade').notNull(),
  description: text('description'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_akh_year').on(table.academicYearId),
  index('idx_akh_semester').on(table.semesterId),
  index('idx_akh_class').on(table.classId),
  index('idx_akh_student').on(table.studentId),
  index('idx_akh_deleted').on(table.deletedAt),
]);

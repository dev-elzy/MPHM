import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { curriculums } from './curriculums';
import { users } from './users';

// ============================================================
// Classes — Kelas / Rombel
// Identity: Jenjang + Tingkat + Bagian (auto-generated name)
// Belongs to Academic Year, linked to Curriculum
// ============================================================

export const classes = sqliteTable('classes', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').references(() => semesters.id),
  curriculumId: text('curriculum_id').references(() => curriculums.id),
  jenjang: text('jenjang').notNull(),
  tingkat: text('tingkat').notNull(),
  bagian: text('bagian').notNull(),
  name: text('name').notNull(), // Auto-generated: "Jenjang Tingkat-Bagian"
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  // CL-04: No duplicate class identity in same semester
  uniqueIndex('idx_class_identity').on(
    table.academicYearId,
    table.semesterId,
    table.jenjang,
    table.tingkat,
    table.bagian,
  ),
  index('idx_class_year').on(table.academicYearId),
  index('idx_class_semester').on(table.semesterId),
  index('idx_class_jenjang').on(table.jenjang),
  index('idx_class_curriculum').on(table.curriculumId),
  index('idx_class_status').on(table.status),
  index('idx_class_deleted').on(table.deletedAt),
]);

// ============================================================
// Class Assignments — Wali Kelas / Mustahiq Assignment
// Stores history of teacher assignments to classes
// CL-05: One class → one active wali kelas
// CL-06: One Mustahiq → one class per academic year
// ============================================================

export const classAssignments = sqliteTable('class_assignments', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  role: text('role').notNull().default('wali_kelas'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  index('idx_ca_year').on(table.academicYearId),
  index('idx_ca_class').on(table.classId),
  index('idx_ca_user').on(table.userId),
  index('idx_ca_status').on(table.status),
  index('idx_ca_year_class').on(table.academicYearId, table.classId),
]);

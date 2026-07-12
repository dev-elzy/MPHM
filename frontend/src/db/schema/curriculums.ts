import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';

// ============================================================
// Subjects — Master Mata Pelajaran (Global)
// Not tied to a specific academic year
// ============================================================

export const subjects = sqliteTable('subjects', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull().default('default'),
  name: text('name').notNull(),
  arabicName: text('arabic_name'),
  code: text('code'),
  description: text('description'),
  category: text('category'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_subj_institution').on(table.institutionId),
  index('idx_subj_status').on(table.status),
  index('idx_subj_deleted').on(table.deletedAt),
]);

// ============================================================
// Curriculums — Per Academic Year
// Each Academic Year can have one or more curriculums
// ============================================================

export const curriculums = sqliteTable('curriculums', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_curr_year').on(table.academicYearId),
  index('idx_curr_status').on(table.status),
  index('idx_curr_deleted').on(table.deletedAt),
]);

// ============================================================
// Curriculum Subjects — Links Curriculum to Subject
// Stores per-curriculum rules: order, scoring range, weight
// ============================================================

export const curriculumSubjects = sqliteTable('curriculum_subjects', {
  id: text('id').primaryKey(),
  curriculumId: text('curriculum_id').notNull().references(() => curriculums.id, { onDelete: 'cascade' }),
  subjectId: text('subject_id').notNull().references(() => subjects.id, { onDelete: 'restrict' }),
  sortOrder: integer('sort_order').notNull().default(0),
  maxScore: integer('max_score').notNull().default(100),
  minScore: integer('min_score').notNull().default(0),
  weight: integer('weight').notNull().default(1),
  status: text('status').notNull().default('active'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  uniqueIndex('idx_cs_curr_subj').on(table.curriculumId, table.subjectId),
  index('idx_cs_curriculum').on(table.curriculumId),
]);

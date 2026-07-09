import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { classes } from './classes';
import { curriculumSubjects } from './curriculums';
import { students } from './students';

// ============================================================
// Score Sessions — Container for scores per subject per class
// Status: draft → ready → final → locked
// One session per: academic_year + semester + class + curriculum_subject
// ============================================================

export const scoreSessions = sqliteTable('score_sessions', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  curriculumSubjectId: text('curriculum_subject_id').notNull().references(() => curriculumSubjects.id, { onDelete: 'restrict' }),
  status: text('status').notNull().default('draft'),
  finalizedAt: integer('finalized_at', { mode: 'timestamp' }),
  finalizedBy: text('finalized_by'),
  lockedAt: integer('locked_at', { mode: 'timestamp' }),
  lockedBy: text('locked_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  uniqueIndex('idx_ss_unique').on(
    table.academicYearId,
    table.semesterId,
    table.classId,
    table.curriculumSubjectId,
  ),
  index('idx_ss_year').on(table.academicYearId),
  index('idx_ss_semester').on(table.semesterId),
  index('idx_ss_class').on(table.classId),
  index('idx_ss_status').on(table.status),
]);

// ============================================================
// Scores — Raw score data (not computed results)
// Auto-saved via PATCH endpoint
// Score types: tamrin, ujian
// ============================================================

export const scores = sqliteTable('scores', {
  id: text('id').primaryKey(),
  scoreSessionId: text('score_session_id').notNull().references(() => scoreSessions.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'restrict' }),
  scoreType: text('score_type').notNull(), // 'tamrin' | 'ujian'
  score: integer('score'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  uniqueIndex('idx_score_session_student_type').on(
    table.scoreSessionId,
    table.studentId,
    table.scoreType,
  ),
  index('idx_score_session').on(table.scoreSessionId),
  index('idx_score_student').on(table.studentId),
]);

// ============================================================
// Score Results — Computed results after finalization
// Calculated by backend, not frontend
// ============================================================

export const scoreResults = sqliteTable('score_results', {
  id: text('id').primaryKey(),
  scoreSessionId: text('score_session_id').notNull().references(() => scoreSessions.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'restrict' }),
  khosScore: integer('khos_score'),
  amScore: integer('am_score'),
  finalScore: integer('final_score'),
  predicate: text('predicate'),
  ranking: integer('ranking'),
  passed: integer('passed', { mode: 'boolean' }),
  notes: text('notes'),
  calculatedAt: integer('calculated_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  uniqueIndex('idx_sr_session_student').on(table.scoreSessionId, table.studentId),
  index('idx_sr_session').on(table.scoreSessionId),
  index('idx_sr_student').on(table.studentId),
]);

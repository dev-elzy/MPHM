import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { classes } from './classes';
import { subjects } from './curriculums';

// ============================================================
// Schedules — Academic Schedule per Jenjang/Tingkat/Class
// Target can be: jenjang, tingkat, or specific class
// When set at tingkat level, all classes in that tingkat inherit
// SCH-04: Class can override inherited schedule
// ============================================================

export const schedules = sqliteTable('schedules', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  targetType: text('target_type').notNull(), // 'jenjang' | 'tingkat' | 'class'
  jenjang: text('jenjang'),
  tingkat: text('tingkat'),
  classId: text('class_id').references(() => classes.id, { onDelete: 'cascade' }),
  day: text('day').notNull(), // sabtu | ahad | senin | selasa | rabu | kamis
  startTime: text('start_time').notNull(), // HH:MM
  endTime: text('end_time').notNull(), // HH:MM
  activity: text('activity').notNull(),
  subjectId: text('subject_id').references(() => subjects.id),
  teacherId: text('teacher_id'),
  room: text('room'),
  notes: text('notes'),
  isOverride: integer('is_override', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_sched_year').on(table.academicYearId),
  index('idx_sched_semester').on(table.semesterId),
  index('idx_sched_target').on(table.targetType),
  index('idx_sched_jenjang').on(table.jenjang),
  index('idx_sched_class').on(table.classId),
  index('idx_sched_day').on(table.day),
  index('idx_sched_deleted').on(table.deletedAt),
]);

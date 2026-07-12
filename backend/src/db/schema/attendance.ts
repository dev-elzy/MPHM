import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { classes } from './classes';
import { students } from './students';

// ============================================================
// Attendance — Hijri Monthly Attendance Recap
// Linked to: Academic Year → Semester → Class → Student → Month
// ============================================================

export const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'restrict' }),
  hijriMonth: integer('hijri_month').notNull(), // 1 s/d 12 (Muharram s/d Dzulhijjah)
  hijriYear: integer('hijri_year').notNull(),   // e.g., 1447
  sickCount: integer('sick_count').notNull().default(0),
  permissionCount: integer('permission_count').notNull().default(0),
  absentCount: integer('absent_count').notNull().default(0),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  uniqueIndex('idx_att_student_month').on(
    table.academicYearId,
    table.semesterId,
    table.classId,
    table.studentId,
    table.hijriMonth,
    table.hijriYear
  ),
  index('idx_att_year').on(table.academicYearId),
  index('idx_att_semester').on(table.semesterId),
  index('idx_att_class').on(table.classId),
  index('idx_att_student').on(table.studentId),
  index('idx_att_deleted').on(table.deletedAt),
]);

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { classes } from './classes';
import { students } from './students';

// ============================================================
// Attendance — Separate from scores per blueprint
// Linked to: Academic Year → Semester → Class → Student
// ============================================================

export const attendance = sqliteTable('attendance', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'restrict' }),
  date: text('date').notNull(),
  status: text('status').notNull(), // present | absent | sick | permission | late
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_att_year').on(table.academicYearId),
  index('idx_att_semester').on(table.semesterId),
  index('idx_att_class').on(table.classId),
  index('idx_att_student').on(table.studentId),
  index('idx_att_date').on(table.date),
  index('idx_att_class_date').on(table.classId, table.date),
  index('idx_att_deleted').on(table.deletedAt),
]);

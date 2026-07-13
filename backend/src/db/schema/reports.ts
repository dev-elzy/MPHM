import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { semesters } from './semesters';
import { classes } from './classes';
import { studentProfiles as students } from './person-profiles';

// ============================================================
// Reports — Generated during finalization
// Report data is stored (not recalculated on every view)
// Status: draft → verified → published
// ============================================================

export const reports = sqliteTable('reports', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  semesterId: text('semester_id').notNull().references(() => semesters.id, { onDelete: 'cascade' }),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'restrict' }),
  reportData: text('report_data'), // JSON snapshot of all scores, attendance, akhlaq
  fileUrl: text('file_url'), // R2 storage URL for generated PDF
  status: text('status').notNull().default('draft'),
  generatedAt: integer('generated_at', { mode: 'timestamp' }),
  generatedBy: text('generated_by'),
  verifiedAt: integer('verified_at', { mode: 'timestamp' }),
  verifiedBy: text('verified_by'),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  publishedBy: text('published_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  index('idx_rpt_year').on(table.academicYearId),
  index('idx_rpt_semester').on(table.semesterId),
  index('idx_rpt_class').on(table.classId),
  index('idx_rpt_student').on(table.studentId),
  index('idx_rpt_status').on(table.status),
  index('idx_rpt_year_sem_class').on(table.academicYearId, table.semesterId, table.classId),
]);

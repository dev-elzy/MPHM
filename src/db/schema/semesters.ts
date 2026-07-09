import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';

// ============================================================
// Semesters — Under Academic Year
// Each Academic Year has Semester I (Ganjil) and Semester II (Genap)
// ============================================================

export const semesters = sqliteTable('semesters', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'ganjil' | 'genap'
  startDate: text('start_date'),
  endDate: text('end_date'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull().default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  uniqueIndex('idx_sem_year_type').on(table.academicYearId, table.type),
  index('idx_sem_year').on(table.academicYearId),
  index('idx_sem_active').on(table.isActive),
]);

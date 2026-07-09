import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================================
// Academic Years — Root Entity of Academic Workspace
// Status: draft → published → active → archived
// Only ONE active at a time
// ============================================================

export const academicYears = sqliteTable('academic_years', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull().default('default'),
  name: text('name').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  status: text('status').notNull().default('draft'),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_ay_status').on(table.status),
  index('idx_ay_institution').on(table.institutionId),
  index('idx_ay_deleted').on(table.deletedAt),
]);

// ============================================================
// Academic Settings — Configuration per Academic Year
// Key-value store for flexible settings
// ============================================================

export const academicSettings = sqliteTable('academic_settings', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  value: text('value'),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  uniqueIndex('idx_as_year_key').on(table.academicYearId, table.key),
]);

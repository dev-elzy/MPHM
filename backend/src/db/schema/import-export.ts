import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================================
// Import Histories — Record of all data imports
// ============================================================

export const importHistories = sqliteTable('import_histories', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name'),
  module: text('module').notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url'),
  totalRows: integer('total_rows').notNull().default(0),
  successCount: integer('success_count').notNull().default(0),
  failedCount: integer('failed_count').notNull().default(0),
  errorDetail: text('error_detail'), // JSON array of errors
  status: text('status').notNull().default('completed'), // processing | completed | failed
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  index('idx_import_user').on(table.userId),
  index('idx_import_module').on(table.module),
  index('idx_import_created').on(table.createdAt),
]);

// ============================================================
// Export Histories — Record of all data exports
// ============================================================

export const exportHistories = sqliteTable('export_histories', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name'),
  module: text('module').notNull(),
  format: text('format').notNull(), // excel | csv | pdf
  filterJson: text('filter_json'), // JSON of active filters
  totalRows: integer('total_rows').notNull().default(0),
  fileUrl: text('file_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  index('idx_export_user').on(table.userId),
  index('idx_export_module').on(table.module),
  index('idx_export_created').on(table.createdAt),
]);

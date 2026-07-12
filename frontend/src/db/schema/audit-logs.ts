import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================================
// Audit Logs — Immutable, auto-generated
// Cannot be updated or deleted by users
// Records: user, module, action, old/new data, IP, user agent
// ============================================================

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull().default('default'),
  userId: text('user_id'),
  userName: text('user_name'),
  userRole: text('user_role'),
  module: text('module').notNull(),
  action: text('action').notNull(),
  entityId: text('entity_id'),
  entityType: text('entity_type'),
  oldData: text('old_data'), // JSON
  newData: text('new_data'), // JSON
  description: text('description'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  index('idx_audit_institution').on(table.institutionId),
  index('idx_audit_user').on(table.userId),
  index('idx_audit_module').on(table.module),
  index('idx_audit_action').on(table.action),
  index('idx_audit_entity').on(table.entityType, table.entityId),
  index('idx_audit_created').on(table.createdAt),
  index('idx_audit_module_action').on(table.module, table.action),
]);

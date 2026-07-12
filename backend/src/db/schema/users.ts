import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { roles } from './roles';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  institutionId: text('institution_id').notNull().default('default'),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('Mustahiq'), // Backwards compatibility for mock code
  roleId: text('role_id').references(() => roles.id),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  status: text('status').notNull().default('active'), // active | inactive | suspended
  lastLoginAt: integer('last_login_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // Soft delete support
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_user_institution').on(table.institutionId),
  index('idx_user_role_id').on(table.roleId),
  index('idx_user_status').on(table.status),
  index('idx_user_deleted').on(table.deletedAt),
]);


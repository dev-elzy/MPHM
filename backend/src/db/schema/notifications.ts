import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

// ============================================================
// Notifications — In-app notification system
// Used for: Dashboard, Toast, Reminder, Deadline, Announcement
// ============================================================

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'), // info | success | warning | error | reminder
  module: text('module'),
  referenceId: text('reference_id'), // Optional link to related entity
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  readAt: integer('read_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  index('idx_notif_user').on(table.userId),
  index('idx_notif_user_read').on(table.userId, table.isRead),
  index('idx_notif_created').on(table.createdAt),
]);

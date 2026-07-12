import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { students } from './students';

// ============================================================
// Student Achievements — Record of awards and achievements
// ============================================================

export const studentAchievements = sqliteTable('student_achievements', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),         // e.g., "Juara 1 Lomba MQK"
  level: text('level').notNull(),         // e.g., "Kecamatan" | "Kabupaten" | "Provinsi" | "Nasional" | "Internal"
  date: text('date').notNull(),           // format: YYYY-MM-DD
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  index('idx_ach_student').on(table.studentId),
]);

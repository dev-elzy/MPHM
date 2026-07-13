import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { studentProfiles as students } from './person-profiles';
import { classes } from './classes';

// ============================================================
// Promotion Periods
// Status: draft → processing → waiting_approval → approved → locked
// Controls the yearly progression process of students
// ============================================================

export const promotionPeriods = sqliteTable('promotion_periods', {
  id: text('id').primaryKey(),
  academicYearFromId: text('academic_year_from_id').notNull().references(() => academicYears.id, { onDelete: 'restrict' }),
  academicYearToId: text('academic_year_to_id').notNull().references(() => academicYears.id, { onDelete: 'restrict' }),
  status: text('status').notNull().default('draft'), // draft | processing | waiting_approval | approved | locked
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  approvedAt: integer('approved_at', { mode: 'timestamp' }),
  approvedBy: text('approved_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  index('idx_pp_year_from').on(table.academicYearFromId),
  index('idx_pp_year_to').on(table.academicYearToId),
  index('idx_pp_status').on(table.status),
]);

// ============================================================
// Promotion Transactions
// Individual student records for a specific promotion period
// Status: promoted | retained | graduated | transferred | dropped | khidmah
// ============================================================

export const promotionTransactions = sqliteTable('promotion_transactions', {
  id: text('id').primaryKey(),
  promotionPeriodId: text('promotion_period_id').notNull().references(() => promotionPeriods.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'restrict' }),
  currentClassId: text('current_class_id').notNull().references(() => classes.id, { onDelete: 'restrict' }),
  targetClassId: text('target_class_id').references(() => classes.id, { onDelete: 'restrict' }),
  currentLevel: text('current_level').notNull(),
  targetLevel: text('target_level'),
  promotionStatus: text('promotion_status').notNull(), // promoted | retained | graduated | transferred | dropped | khidmah
  reason: text('reason'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  approvedBy: text('approved_by'),
}, (table) => [
  index('idx_pt_period').on(table.promotionPeriodId),
  index('idx_pt_student').on(table.studentId),
  index('idx_pt_current_class').on(table.currentClassId),
  index('idx_pt_status').on(table.promotionStatus),
]);

// ============================================================
// Academic History
// Immutable permanent academic records for students
// ============================================================

export const academicHistory = sqliteTable('academic_history', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  academicYearId: text('academic_year_id').notNull().references(() => academicYears.id, { onDelete: 'restrict' }),
  institutionId: text('institution_id').notNull().default('default'),
  institutionLevel: text('institution_level').notNull(), // Jenjang (e.g. Tsanawiyyah, Ibtida'iyyah)
  tingkat: text('tingkat').notNull(),
  classId: text('class_id').notNull().references(() => classes.id, { onDelete: 'restrict' }),
  status: text('status').notNull(), // promoted | retained | graduated | etc.
  promotionTransactionId: text('promotion_transaction_id').references(() => promotionTransactions.id, { onDelete: 'set null' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
}, (table) => [
  index('idx_ah_student').on(table.studentId),
  index('idx_ah_year').on(table.academicYearId),
  index('idx_ah_institution').on(table.institutionId),
  index('idx_ah_class').on(table.classId),
]);

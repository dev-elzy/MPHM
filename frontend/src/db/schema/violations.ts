import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { studentProfiles } from './person-profiles';

// ============================================================
// 1. Master Kategori Pelanggaran (Dinamic Categories)
// ============================================================
// Contoh: Kerapian, Kedisiplinan, Adab, Ibadah, Administrasi,
// Perizinan, Kebersihan, Asrama, Keamanan, Lainnya.
export const violationCategories = sqliteTable('violation_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').notNull().default('#3B82F6'), // Hex color untuk pill badge
  icon: text('icon').default('AlertCircle'), // Nama icon Lucide
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  index('idx_violation_category_active').on(table.isActive),
]);

// ============================================================
// 2. Master Severity / Tingkat Pelanggaran (Dynamic Severities)
// ============================================================
// Contoh: Ringan, Sedang, Berat, Sangat Berat
export const violationSeverities = sqliteTable('violation_severities', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  levelWeight: integer('level_weight').notNull().default(1), // 1 = Ringan, 2 = Sedang, 3 = Berat
  badgeColor: text('badge_color').notNull().default('blue'), // 'green' | 'blue' | 'yellow' | 'orange' | 'red'
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

// ============================================================
// 3. Master Jenis Pelanggaran (Dynamic Violation Types)
// ============================================================
export const violationTypes = sqliteTable('violation_types', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => violationCategories.id, { onDelete: 'cascade' }),
  severityId: text('severity_id').notNull().references(() => violationSeverities.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  defaultPoints: integer('default_points').default(10),
  description: text('description'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  index('idx_violation_type_category').on(table.categoryId),
  index('idx_violation_type_severity').on(table.severityId),
  index('idx_violation_type_active').on(table.isActive),
]);

// ============================================================
// 4. Laporan Kejadian Pelanggaran (Student Violations / Incident Log)
// ============================================================
export const studentViolations = sqliteTable('student_violations', {
  id: text('id').primaryKey(),
  academicYearId: text('academic_year_id').notNull(),
  studentProfileId: text('student_profile_id').notNull().references(() => studentProfiles.id, { onDelete: 'cascade' }),
  violationTypeId: text('violation_type_id').notNull().references(() => violationTypes.id, { onDelete: 'cascade' }),
  incidentDate: text('incident_date').notNull(), // YYYY-MM-DD
  incidentTime: text('incident_time'), // HH:mm
  location: text('location'),
  description: text('description').notNull(),
  evidenceUrl: text('evidence_url'),
  reportedBy: text('reported_by'), // userId dari Petugas Keamanan / Admin pelapor
  status: text('status').notNull().default('Dilaporkan'), // 'Draft' | 'Dilaporkan' | 'Diproses' | 'Selesai' | 'Dibatalkan'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_student_violation_year_student').on(table.academicYearId, table.studentProfileId),
  index('idx_student_violation_type').on(table.violationTypeId),
  index('idx_student_violation_status').on(table.status),
  index('idx_student_violation_deleted').on(table.deletedAt),
]);

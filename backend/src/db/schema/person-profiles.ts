import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { people } from './people';

// ============================================================
// Student Profiles (Santri Aktif & Alumni)
// ============================================================
export const studentProfiles = sqliteTable('student_profiles', {
  id: text('id').primaryKey(),
  personId: text('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  nis: text('nis').unique(),
  nisn: text('nisn').unique(),
  entryYear: text('entry_year'), // Contoh: '2023'
  currentClassId: text('current_class_id'), // Kelas saat ini jika aktif
  status: text('status').notNull().default('active'), // 'active' | 'cuti' | 'boyong' | 'dikeluarkan' | 'khidmah' | 'alumni'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  deletedBy: text('deleted_by'),
}, (table) => [
  index('idx_student_profile_person').on(table.personId),
  index('idx_student_profile_nis').on(table.nis),
  index('idx_student_profile_status').on(table.status),
]);

// ============================================================
// Teacher Profiles (Mustahiq / Munawib)
// ============================================================
export const teacherProfiles = sqliteTable('teacher_profiles', {
  id: text('id').primaryKey(),
  personId: text('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  code: text('code').unique(), // Kode pengajar / NIP madrasah
  teacherType: text('teacher_type').notNull().default('mustahiq'), // 'mustahiq' | 'munawib' | 'umum'
  status: text('status').notNull().default('active'), // 'active' | 'inactive'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  index('idx_teacher_profile_person').on(table.personId),
  index('idx_teacher_profile_type').on(table.teacherType),
]);

// ============================================================
// Guardian Profiles (Wali Santri)
// ============================================================
export const guardianProfiles = sqliteTable('guardian_profiles', {
  id: text('id').primaryKey(),
  personId: text('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  relationship: text('relationship').notNull().default('Ayah'), // 'Ayah' | 'Ibu' | 'Wali'
  occupation: text('occupation'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  index('idx_guardian_profile_person').on(table.personId),
]);

// ============================================================
// Student - Guardian Relationship
// ============================================================
export const studentGuardians = sqliteTable('student_guardians', {
  id: text('id').primaryKey(),
  studentProfileId: text('student_profile_id').notNull().references(() => studentProfiles.id, { onDelete: 'cascade' }),
  guardianProfileId: text('guardian_profile_id').notNull().references(() => guardianProfiles.id, { onDelete: 'cascade' }),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(true),
}, (table) => [
  uniqueIndex('idx_student_guardian_unique').on(table.studentProfileId, table.guardianProfileId),
]);

// ============================================================
// Organization Memberships (Pengurus / Dewan Harian Organisasi)
// ============================================================
export const organizationMemberships = sqliteTable('organization_memberships', {
  id: text('id').primaryKey(),
  personId: text('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  organization: text('organization').notNull(), // 'P3HM' | 'MPHM' | 'M3PHM'
  position: text('position').notNull(), // Jabatan, misal: Ketua, Sekretaris, Bendahara
  periodStartYear: text('period_start_year').notNull(), // '2025'
  periodEndYear: text('period_end_year').notNull(), // '2026'
  status: text('status').notNull().default('active'), // 'active' | 'completed'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
}, (table) => [
  index('idx_org_membership_person').on(table.personId),
  index('idx_org_membership_org').on(table.organization),
]);

// ============================================================
// Alumni Records (Ekstensi Data Santri Lulus)
// ============================================================
export const alumniRecords = sqliteTable('alumni_records', {
  id: text('id').primaryKey(),
  studentProfileId: text('student_profile_id').notNull().unique().references(() => studentProfiles.id, { onDelete: 'cascade' }),
  personId: text('person_id').notNull().references(() => people.id, { onDelete: 'cascade' }),
  graduationYearId: text('graduation_year_id'), // Tahun Ajaran kelulusan
  khidmahStatus: text('khidmah_status').notNull().default('selesai_khidmah'), // 'selesai_khidmah' | 'tidak_khidmah' | 'qodho_khidmah'
  khidmahLocation: text('khidmah_location'), // Lokasi / penempatan khidmah
  khidmahNotes: text('khidmah_notes'), // Keterangan Qodho' atau alasan
  ijazahStatus: text('ijazah_status').notNull().default('belum_bisa_diambil'), // 'belum_bisa_diambil' | 'sudah_diambil'
  ijazahTakenAt: integer('ijazah_taken_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
}, (table) => [
  index('idx_alumni_student_profile').on(table.studentProfileId),
  index('idx_alumni_person').on(table.personId),
  index('idx_alumni_khidmah_status').on(table.khidmahStatus),
  index('idx_alumni_ijazah_status').on(table.ijazahStatus),
]);

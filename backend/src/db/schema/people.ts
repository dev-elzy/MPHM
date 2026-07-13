import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================================
// Core Person Table (Identitas Dasar Tunggal - Single Source of Truth)
// ============================================================
// Blueprint 10: Person-Centric Enterprise Data Architecture
// Seluruh warga MPHM (Santri, Alumni, Pengajar, Pengurus, Wali Santri)
// memiliki tepat SATU rekam identitas di sini.
// ============================================================

export const people = sqliteTable('people', {
  id: text('id').primaryKey(),
  nik: text('nik').unique(), // Nomor Induk Kependudukan (Opsional / Unique jika ada)
  fullName: text('full_name').notNull(),
  gender: text('gender').notNull().default('P'), // 'P' (Putri/Perempuan) | 'L' (Laki-laki untuk Pengurus/Wali)
  birthPlace: text('birth_place'),
  birthDate: text('birth_date'), // YYYY-MM-DD
  phone: text('phone'),
  address: text('address'), // Fallback / Full text
  province: text('province'),
  provinceId: text('province_id'),
  regency: text('regency'),
  regencyId: text('regency_id'),
  district: text('district'),
  districtId: text('district_id'),
  village: text('village'),
  villageId: text('village_id'),
  addressDetail: text('address_detail'), // RT/RW, Jalan
  email: text('email'),
  photoUrl: text('photo_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  createdBy: text('created_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedBy: text('updated_by'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // Soft delete abadi
  deletedBy: text('deleted_by'),

}, (table) => [
  index('idx_people_full_name').on(table.fullName),
  index('idx_people_nik').on(table.nik),
  index('idx_people_phone').on(table.phone),
  index('idx_people_deleted').on(table.deletedAt),
]);

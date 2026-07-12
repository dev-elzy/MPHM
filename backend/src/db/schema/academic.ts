import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { academicYears } from './academic-years';
import { people } from './people';
import { studentProfiles } from './person-profiles';

// ============================================================
// Master Rombongan Belajar (Kelas Akademik) - Person Centric
// Mengacu pada Jenjang (1..4), Tingkat (I..VI), dan Mustahiq (people.id)
// ============================================================

export const academicClasses = sqliteTable(
  'academic_classes',
  {
    id: text('id').primaryKey(),
    academicYearId: text('academic_year_id')
      .notNull()
      .references(() => academicYears.id, { onDelete: 'cascade' }),
    jenjangId: text('jenjang_id').notNull(), // '1': I'dadiyyah, '2': Ibtida'iyyah, '3': Tsanawiyyah, '4': Aliyyah
    tingkatId: text('tingkat_id').notNull(), // 'I', 'II', 'III', 'IV', 'V', 'VI'
    className: text('class_name').notNull(), // e.g. "Ibtidaiyyah II-A"
    classCode: text('class_code').notNull(), // e.g. "IBT-2A-2526"
    mustahiqId: text('mustahiq_id').references(() => people.id, { onDelete: 'set null' }), // Wali kelas / Mustahiq
    capacity: integer('capacity').notNull().default(35),
    status: text('status').notNull().default('ACTIVE'), // ACTIVE | INACTIVE
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
  },
  (table) => [
    uniqueIndex('idx_acad_class_code').on(table.classCode),
    index('idx_acad_class_year').on(table.academicYearId),
    index('idx_acad_class_jenjang_tingkat').on(table.jenjangId, table.tingkatId),
    index('idx_acad_class_mustahiq').on(table.mustahiqId),
  ]
);

// ============================================================
// Class Enrollments — Penempatan Santri di Kelas
// Historical Append-Only Record (Tidak Ada Penghapusan Data)
// Status: ACTIVE | PROMOTED | RETAINED | TRANSFERRED | BOYONG | GRADUATED
// ============================================================

export const classEnrollments = sqliteTable(
  'class_enrollments',
  {
    id: text('id').primaryKey(),
    academicYearId: text('academic_year_id')
      .notNull()
      .references(() => academicYears.id, { onDelete: 'cascade' }),
    classId: text('class_id')
      .notNull()
      .references(() => academicClasses.id, { onDelete: 'cascade' }),
    studentProfileId: text('student_profile_id')
      .notNull()
      .references(() => studentProfiles.id, { onDelete: 'cascade' }),
    status: text('status').notNull().default('ACTIVE'), // ACTIVE | PROMOTED | RETAINED | TRANSFERRED | BOYONG | GRADUATED
    enrolledAt: integer('enrolled_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(strftime('%s', 'now'))`),
    notes: text('notes'),
  },
  (table) => [
    index('idx_enroll_year_class').on(table.academicYearId, table.classId),
    index('idx_enroll_student').on(table.studentProfileId),
    index('idx_enroll_status').on(table.status),
  ]
);

// ============================================================

// Jenjang & Tingkat Constants
// Bukan tabel database, menggunakan Constant/Enum sesuai blueprint
// ============================================================

export const JENJANG = {
  IDADIYYAH: 'idadiyyah',
  IBTIDAIYYAH: 'ibtidaiyyah',
  TSANAWIYYAH: 'tsanawiyyah',
  ALIYYAH: 'aliyyah',
} as const;

export const JENJANG_LABELS: Record<string, string> = {
  [JENJANG.IDADIYYAH]: "I'dadiyyah",
  [JENJANG.IBTIDAIYYAH]: "Ibtida'iyyah",
  [JENJANG.TSANAWIYYAH]: 'Tsanawiyyah',
  [JENJANG.ALIYYAH]: 'Aliyyah',
};

export const TINGKAT_PER_JENJANG: Record<string, string[]> = {
  [JENJANG.IDADIYYAH]: ['I', 'II', 'III'],
  [JENJANG.IBTIDAIYYAH]: ['I', 'II', 'III', 'IV', 'V', 'VI'],
  [JENJANG.TSANAWIYYAH]: ['I', 'II', 'III'],
  [JENJANG.ALIYYAH]: ['I', 'II', 'III'],
};

export type Jenjang = (typeof JENJANG)[keyof typeof JENJANG];

// ============================================================
// Academic Year Status
// ============================================================

export const ACADEMIC_YEAR_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export type AcademicYearStatus =
  (typeof ACADEMIC_YEAR_STATUS)[keyof typeof ACADEMIC_YEAR_STATUS];

// ============================================================
// Semester Type
// ============================================================

export const SEMESTER_TYPE = {
  GANJIL: 'ganjil',
  GENAP: 'genap',
} as const;

export type SemesterType =
  (typeof SEMESTER_TYPE)[keyof typeof SEMESTER_TYPE];

// ============================================================
// Score Session Status
// ============================================================

export const SCORE_SESSION_STATUS = {
  DRAFT: 'draft',
  READY: 'ready',
  FINAL: 'final',
  LOCKED: 'locked',
} as const;

export type ScoreSessionStatus =
  (typeof SCORE_SESSION_STATUS)[keyof typeof SCORE_SESSION_STATUS];

// ============================================================
// Score Type
// ============================================================

export const SCORE_TYPE = {
  TAMRIN: 'tamrin',
  UJIAN: 'ujian',
} as const;

export type ScoreType = (typeof SCORE_TYPE)[keyof typeof SCORE_TYPE];

// ============================================================
// Report Status
// ============================================================

export const REPORT_STATUS = {
  DRAFT: 'draft',
  VERIFIED: 'verified',
  PUBLISHED: 'published',
} as const;

export type ReportStatus =
  (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];

// ============================================================
// Promotion Status
// ============================================================

export const PROMOTION_STATUS = {
  PROMOTED: 'promoted',
  RETAINED: 'retained',
  GRADUATED: 'graduated',
  TRANSFERRED: 'transferred',
  DROPPED: 'dropped',
  KHIDMAH: 'khidmah',
} as const;

export type PromotionStatus =
  (typeof PROMOTION_STATUS)[keyof typeof PROMOTION_STATUS];

// ============================================================
// Promotion Period Status
// ============================================================

export const PROMOTION_PERIOD_STATUS = {
  DRAFT: 'draft',
  PROCESSING: 'processing',
  WAITING_APPROVAL: 'waiting_approval',
  APPROVED: 'approved',
  LOCKED: 'locked',
} as const;

export type PromotionPeriodStatus =
  (typeof PROMOTION_PERIOD_STATUS)[keyof typeof PROMOTION_PERIOD_STATUS];

// ============================================================
// Generic Status
// ============================================================

export const ENTITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  TRASH: 'trash',
} as const;

export type EntityStatus =
  (typeof ENTITY_STATUS)[keyof typeof ENTITY_STATUS];

// ============================================================
// User Status
// ============================================================

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type UserStatus =
  (typeof USER_STATUS)[keyof typeof USER_STATUS];

// ============================================================
// Role Names (System Roles)
// ============================================================

export const SYSTEM_ROLES = {
  
  
  SEKRETARIAT: 'sekretariat',
  MUSTAHIQ: 'mustahiq',
  MUDIR: 'mudir',
} as const;

export type SystemRole =
  (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

// ============================================================
// Attendance Status
// ============================================================

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  SICK: 'sick',
  PERMISSION: 'permission',
  LATE: 'late',
} as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

// ============================================================
// Schedule Target Type
// ============================================================

export const SCHEDULE_TARGET_TYPE = {
  JENJANG: 'jenjang',
  TINGKAT: 'tingkat',
  CLASS: 'class',
} as const;

export type ScheduleTargetType =
  (typeof SCHEDULE_TARGET_TYPE)[keyof typeof SCHEDULE_TARGET_TYPE];

// ============================================================
// Notification Type
// ============================================================

export const NOTIFICATION_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  REMINDER: 'reminder',
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

// ============================================================
// Audit Action
// ============================================================

export const AUDIT_ACTION = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  RESTORE: 'restore',
  STATUS_CHANGE: 'status_change',
  LOGIN: 'login',
  LOGOUT: 'logout',
  IMPORT: 'import',
  EXPORT: 'export',
  FINALIZE: 'finalize',
  UNLOCK: 'unlock',
  CLONE: 'clone',
} as const;

export type AuditAction =
  (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

// ============================================================
// Export Format
// ============================================================

export const EXPORT_FORMAT = {
  EXCEL: 'excel',
  CSV: 'csv',
  PDF: 'pdf',
} as const;

export type ExportFormat =
  (typeof EXPORT_FORMAT)[keyof typeof EXPORT_FORMAT];

// ============================================================
// Day of Week (for Schedule)
// ============================================================

export const DAY_OF_WEEK = {
  SABTU: 'sabtu',
  AHAD: 'ahad',
  SENIN: 'senin',
  SELASA: 'selasa',
  RABU: 'rabu',
  KAMIS: 'kamis',
} as const;

export type DayOfWeek =
  (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];

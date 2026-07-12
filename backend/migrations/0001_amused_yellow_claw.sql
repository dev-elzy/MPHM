CREATE TABLE `people` (
	`id` text PRIMARY KEY NOT NULL,
	`nik` text,
	`full_name` text NOT NULL,
	`gender` text DEFAULT 'P' NOT NULL,
	`birth_place` text,
	`birth_date` text,
	`phone` text,
	`address` text,
	`email` text,
	`photo_url` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `people_nik_unique` ON `people` (`nik`);--> statement-breakpoint
CREATE INDEX `idx_people_full_name` ON `people` (`full_name`);--> statement-breakpoint
CREATE INDEX `idx_people_nik` ON `people` (`nik`);--> statement-breakpoint
CREATE INDEX `idx_people_phone` ON `people` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_people_deleted` ON `people` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `alumni_records` (
	`id` text PRIMARY KEY NOT NULL,
	`student_profile_id` text NOT NULL,
	`person_id` text NOT NULL,
	`graduation_year_id` text,
	`khidmah_status` text DEFAULT 'selesai_khidmah' NOT NULL,
	`khidmah_location` text,
	`khidmah_notes` text,
	`ijazah_status` text DEFAULT 'belum_bisa_diambil' NOT NULL,
	`ijazah_taken_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`student_profile_id`) REFERENCES `student_profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `alumni_records_student_profile_id_unique` ON `alumni_records` (`student_profile_id`);--> statement-breakpoint
CREATE INDEX `idx_alumni_student_profile` ON `alumni_records` (`student_profile_id`);--> statement-breakpoint
CREATE INDEX `idx_alumni_person` ON `alumni_records` (`person_id`);--> statement-breakpoint
CREATE INDEX `idx_alumni_khidmah_status` ON `alumni_records` (`khidmah_status`);--> statement-breakpoint
CREATE INDEX `idx_alumni_ijazah_status` ON `alumni_records` (`ijazah_status`);--> statement-breakpoint
CREATE TABLE `guardian_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text NOT NULL,
	`relationship` text DEFAULT 'Ayah' NOT NULL,
	`occupation` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_guardian_profile_person` ON `guardian_profiles` (`person_id`);--> statement-breakpoint
CREATE TABLE `organization_memberships` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text NOT NULL,
	`organization` text NOT NULL,
	`position` text NOT NULL,
	`period_start_year` text NOT NULL,
	`period_end_year` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_org_membership_person` ON `organization_memberships` (`person_id`);--> statement-breakpoint
CREATE INDEX `idx_org_membership_org` ON `organization_memberships` (`organization`);--> statement-breakpoint
CREATE TABLE `student_guardians` (
	`id` text PRIMARY KEY NOT NULL,
	`student_profile_id` text NOT NULL,
	`guardian_profile_id` text NOT NULL,
	`is_primary` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`student_profile_id`) REFERENCES `student_profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guardian_profile_id`) REFERENCES `guardian_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_student_guardian_unique` ON `student_guardians` (`student_profile_id`,`guardian_profile_id`);--> statement-breakpoint
CREATE TABLE `student_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text NOT NULL,
	`nis` text,
	`nisn` text,
	`entry_year` text,
	`current_class_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `student_profiles_nis_unique` ON `student_profiles` (`nis`);--> statement-breakpoint
CREATE UNIQUE INDEX `student_profiles_nisn_unique` ON `student_profiles` (`nisn`);--> statement-breakpoint
CREATE INDEX `idx_student_profile_person` ON `student_profiles` (`person_id`);--> statement-breakpoint
CREATE INDEX `idx_student_profile_nis` ON `student_profiles` (`nis`);--> statement-breakpoint
CREATE INDEX `idx_student_profile_status` ON `student_profiles` (`status`);--> statement-breakpoint
CREATE TABLE `teacher_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`person_id` text NOT NULL,
	`code` text,
	`teacher_type` text DEFAULT 'mustahiq' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`person_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teacher_profiles_code_unique` ON `teacher_profiles` (`code`);--> statement-breakpoint
CREATE INDEX `idx_teacher_profile_person` ON `teacher_profiles` (`person_id`);--> statement-breakpoint
CREATE INDEX `idx_teacher_profile_type` ON `teacher_profiles` (`teacher_type`);--> statement-breakpoint
CREATE TABLE `student_violations` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`student_profile_id` text NOT NULL,
	`violation_type_id` text NOT NULL,
	`incident_date` text NOT NULL,
	`incident_time` text,
	`location` text,
	`description` text NOT NULL,
	`evidence_url` text,
	`reported_by` text,
	`status` text DEFAULT 'Dilaporkan' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text,
	FOREIGN KEY (`student_profile_id`) REFERENCES `student_profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`violation_type_id`) REFERENCES `violation_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_student_violation_year_student` ON `student_violations` (`academic_year_id`,`student_profile_id`);--> statement-breakpoint
CREATE INDEX `idx_student_violation_type` ON `student_violations` (`violation_type_id`);--> statement-breakpoint
CREATE INDEX `idx_student_violation_status` ON `student_violations` (`status`);--> statement-breakpoint
CREATE INDEX `idx_student_violation_deleted` ON `student_violations` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `violation_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#3B82F6' NOT NULL,
	`icon` text DEFAULT 'AlertCircle',
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `violation_categories_name_unique` ON `violation_categories` (`name`);--> statement-breakpoint
CREATE INDEX `idx_violation_category_active` ON `violation_categories` (`is_active`);--> statement-breakpoint
CREATE TABLE `violation_severities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`level_weight` integer DEFAULT 1 NOT NULL,
	`badge_color` text DEFAULT 'blue' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `violation_severities_name_unique` ON `violation_severities` (`name`);--> statement-breakpoint
CREATE TABLE `violation_types` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`severity_id` text NOT NULL,
	`name` text NOT NULL,
	`default_points` integer DEFAULT 10,
	`description` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`category_id`) REFERENCES `violation_categories`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`severity_id`) REFERENCES `violation_severities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_violation_type_category` ON `violation_types` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_violation_type_severity` ON `violation_types` (`severity_id`);--> statement-breakpoint
CREATE INDEX `idx_violation_type_active` ON `violation_types` (`is_active`);--> statement-breakpoint
CREATE TABLE `academic_classes` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`jenjang_id` text NOT NULL,
	`tingkat_id` text NOT NULL,
	`class_name` text NOT NULL,
	`class_code` text NOT NULL,
	`mustahiq_id` text,
	`capacity` integer DEFAULT 35 NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`mustahiq_id`) REFERENCES `people`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_acad_class_code` ON `academic_classes` (`class_code`);--> statement-breakpoint
CREATE INDEX `idx_acad_class_year` ON `academic_classes` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_acad_class_jenjang_tingkat` ON `academic_classes` (`jenjang_id`,`tingkat_id`);--> statement-breakpoint
CREATE INDEX `idx_acad_class_mustahiq` ON `academic_classes` (`mustahiq_id`);--> statement-breakpoint
CREATE TABLE `class_enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`class_id` text NOT NULL,
	`student_profile_id` text NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`enrolled_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`notes` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `academic_classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_profile_id`) REFERENCES `student_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_enroll_year_class` ON `class_enrollments` (`academic_year_id`,`class_id`);--> statement-breakpoint
CREATE INDEX `idx_enroll_student` ON `class_enrollments` (`student_profile_id`);--> statement-breakpoint
CREATE INDEX `idx_enroll_status` ON `class_enrollments` (`status`);
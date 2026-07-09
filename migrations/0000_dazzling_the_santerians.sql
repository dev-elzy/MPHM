CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text DEFAULT 'default' NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'Mustahiq' NOT NULL,
	`role_id` text,
	`phone` text,
	`avatar_url` text,
	`status` text DEFAULT 'active' NOT NULL,
	`last_login_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_user_institution` ON `users` (`institution_id`);--> statement-breakpoint
CREATE INDEX `idx_user_role_id` ON `users` (`role_id`);--> statement-breakpoint
CREATE INDEX `idx_user_status` ON `users` (`status`);--> statement-breakpoint
CREATE INDEX `idx_user_deleted` ON `users` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`module` text NOT NULL,
	`action` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permissions_name_unique` ON `permissions` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_perm_module_action` ON `permissions` (`module`,`action`);--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_role_perm_unique` ON `role_permissions` (`role_id`,`permission_id`);--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`description` text,
	`is_system` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);--> statement-breakpoint
CREATE TABLE `academic_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`description` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_as_year_key` ON `academic_settings` (`academic_year_id`,`key`);--> statement-breakpoint
CREATE TABLE `academic_years` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text DEFAULT 'default' NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text
);
--> statement-breakpoint
CREATE INDEX `idx_ay_status` ON `academic_years` (`status`);--> statement-breakpoint
CREATE INDEX `idx_ay_institution` ON `academic_years` (`institution_id`);--> statement-breakpoint
CREATE INDEX `idx_ay_deleted` ON `academic_years` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `semesters` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`start_date` text,
	`end_date` text,
	`is_active` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sem_year_type` ON `semesters` (`academic_year_id`,`type`);--> statement-breakpoint
CREATE INDEX `idx_sem_year` ON `semesters` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_sem_active` ON `semesters` (`is_active`);--> statement-breakpoint
CREATE TABLE `curriculum_subjects` (
	`id` text PRIMARY KEY NOT NULL,
	`curriculum_id` text NOT NULL,
	`subject_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`max_score` integer DEFAULT 100 NOT NULL,
	`min_score` integer DEFAULT 0 NOT NULL,
	`weight` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_cs_curr_subj` ON `curriculum_subjects` (`curriculum_id`,`subject_id`);--> statement-breakpoint
CREATE INDEX `idx_cs_curriculum` ON `curriculum_subjects` (`curriculum_id`);--> statement-breakpoint
CREATE TABLE `curriculums` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_curr_year` ON `curriculums` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_curr_status` ON `curriculums` (`status`);--> statement-breakpoint
CREATE INDEX `idx_curr_deleted` ON `curriculums` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text DEFAULT 'default' NOT NULL,
	`name` text NOT NULL,
	`arabic_name` text,
	`code` text,
	`description` text,
	`category` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text
);
--> statement-breakpoint
CREATE INDEX `idx_subj_institution` ON `subjects` (`institution_id`);--> statement-breakpoint
CREATE INDEX `idx_subj_status` ON `subjects` (`status`);--> statement-breakpoint
CREATE INDEX `idx_subj_deleted` ON `subjects` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `class_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`class_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'wali_kelas' NOT NULL,
	`start_date` text,
	`end_date` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_ca_year` ON `class_assignments` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_ca_class` ON `class_assignments` (`class_id`);--> statement-breakpoint
CREATE INDEX `idx_ca_user` ON `class_assignments` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_ca_status` ON `class_assignments` (`status`);--> statement-breakpoint
CREATE INDEX `idx_ca_year_class` ON `class_assignments` (`academic_year_id`,`class_id`);--> statement-breakpoint
CREATE TABLE `classes` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text,
	`curriculum_id` text,
	`jenjang` text NOT NULL,
	`tingkat` text NOT NULL,
	`bagian` text NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_class_identity` ON `classes` (`academic_year_id`,`semester_id`,`jenjang`,`tingkat`,`bagian`);--> statement-breakpoint
CREATE INDEX `idx_class_year` ON `classes` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_class_semester` ON `classes` (`semester_id`);--> statement-breakpoint
CREATE INDEX `idx_class_jenjang` ON `classes` (`jenjang`);--> statement-breakpoint
CREATE INDEX `idx_class_curriculum` ON `classes` (`curriculum_id`);--> statement-breakpoint
CREATE INDEX `idx_class_status` ON `classes` (`status`);--> statement-breakpoint
CREATE INDEX `idx_class_deleted` ON `classes` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `class_students` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text NOT NULL,
	`class_id` text NOT NULL,
	`student_id` text NOT NULL,
	`enrollment_date` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_cs_student_year_sem` ON `class_students` (`student_id`,`academic_year_id`,`semester_id`);--> statement-breakpoint
CREATE INDEX `idx_cs_class` ON `class_students` (`class_id`);--> statement-breakpoint
CREATE INDEX `idx_cs_student` ON `class_students` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_cs_year` ON `class_students` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_cs_year_class` ON `class_students` (`academic_year_id`,`class_id`);--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text DEFAULT 'default' NOT NULL,
	`nis` text,
	`nisn` text,
	`name` text NOT NULL,
	`birth_date` text,
	`birth_place` text,
	`gender` text DEFAULT 'female' NOT NULL,
	`address` text,
	`parent_name` text,
	`parent_phone` text,
	`phone` text,
	`photo_url` text,
	`entry_year` text,
	`entry_jenjang` text,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text
);
--> statement-breakpoint
CREATE INDEX `idx_student_institution` ON `students` (`institution_id`);--> statement-breakpoint
CREATE INDEX `idx_student_nis` ON `students` (`nis`);--> statement-breakpoint
CREATE INDEX `idx_student_name` ON `students` (`name`);--> statement-breakpoint
CREATE INDEX `idx_student_status` ON `students` (`status`);--> statement-breakpoint
CREATE INDEX `idx_student_deleted` ON `students` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `score_results` (
	`id` text PRIMARY KEY NOT NULL,
	`score_session_id` text NOT NULL,
	`student_id` text NOT NULL,
	`khos_score` integer,
	`am_score` integer,
	`final_score` integer,
	`predicate` text,
	`ranking` integer,
	`passed` integer,
	`notes` text,
	`calculated_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`score_session_id`) REFERENCES `score_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sr_session_student` ON `score_results` (`score_session_id`,`student_id`);--> statement-breakpoint
CREATE INDEX `idx_sr_session` ON `score_results` (`score_session_id`);--> statement-breakpoint
CREATE INDEX `idx_sr_student` ON `score_results` (`student_id`);--> statement-breakpoint
CREATE TABLE `score_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text NOT NULL,
	`class_id` text NOT NULL,
	`curriculum_subject_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`finalized_at` integer,
	`finalized_by` text,
	`locked_at` integer,
	`locked_by` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`curriculum_subject_id`) REFERENCES `curriculum_subjects`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_ss_unique` ON `score_sessions` (`academic_year_id`,`semester_id`,`class_id`,`curriculum_subject_id`);--> statement-breakpoint
CREATE INDEX `idx_ss_year` ON `score_sessions` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_ss_semester` ON `score_sessions` (`semester_id`);--> statement-breakpoint
CREATE INDEX `idx_ss_class` ON `score_sessions` (`class_id`);--> statement-breakpoint
CREATE INDEX `idx_ss_status` ON `score_sessions` (`status`);--> statement-breakpoint
CREATE TABLE `scores` (
	`id` text PRIMARY KEY NOT NULL,
	`score_session_id` text NOT NULL,
	`student_id` text NOT NULL,
	`score_type` text NOT NULL,
	`score` integer,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`score_session_id`) REFERENCES `score_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_score_session_student_type` ON `scores` (`score_session_id`,`student_id`,`score_type`);--> statement-breakpoint
CREATE INDEX `idx_score_session` ON `scores` (`score_session_id`);--> statement-breakpoint
CREATE INDEX `idx_score_student` ON `scores` (`student_id`);--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text NOT NULL,
	`class_id` text NOT NULL,
	`student_id` text NOT NULL,
	`date` text NOT NULL,
	`status` text NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_att_year` ON `attendance` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_att_semester` ON `attendance` (`semester_id`);--> statement-breakpoint
CREATE INDEX `idx_att_class` ON `attendance` (`class_id`);--> statement-breakpoint
CREATE INDEX `idx_att_student` ON `attendance` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_att_date` ON `attendance` (`date`);--> statement-breakpoint
CREATE INDEX `idx_att_class_date` ON `attendance` (`class_id`,`date`);--> statement-breakpoint
CREATE INDEX `idx_att_deleted` ON `attendance` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `akhlaq` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text NOT NULL,
	`class_id` text NOT NULL,
	`student_id` text NOT NULL,
	`category` text NOT NULL,
	`grade` text NOT NULL,
	`description` text,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_akh_year` ON `akhlaq` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_akh_semester` ON `akhlaq` (`semester_id`);--> statement-breakpoint
CREATE INDEX `idx_akh_class` ON `akhlaq` (`class_id`);--> statement-breakpoint
CREATE INDEX `idx_akh_student` ON `akhlaq` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_akh_deleted` ON `akhlaq` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text NOT NULL,
	`class_id` text NOT NULL,
	`student_id` text NOT NULL,
	`report_data` text,
	`file_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`generated_at` integer,
	`generated_by` text,
	`verified_at` integer,
	`verified_by` text,
	`published_at` integer,
	`published_by` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_rpt_year` ON `reports` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_rpt_semester` ON `reports` (`semester_id`);--> statement-breakpoint
CREATE INDEX `idx_rpt_class` ON `reports` (`class_id`);--> statement-breakpoint
CREATE INDEX `idx_rpt_student` ON `reports` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_rpt_status` ON `reports` (`status`);--> statement-breakpoint
CREATE INDEX `idx_rpt_year_sem_class` ON `reports` (`academic_year_id`,`semester_id`,`class_id`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text DEFAULT 'info' NOT NULL,
	`module` text,
	`reference_id` text,
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_notif_user` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_notif_user_read` ON `notifications` (`user_id`,`is_read`);--> statement-breakpoint
CREATE INDEX `idx_notif_created` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`institution_id` text DEFAULT 'default' NOT NULL,
	`user_id` text,
	`user_name` text,
	`user_role` text,
	`module` text NOT NULL,
	`action` text NOT NULL,
	`entity_id` text,
	`entity_type` text,
	`old_data` text,
	`new_data` text,
	`description` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_audit_institution` ON `audit_logs` (`institution_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_user` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_module` ON `audit_logs` (`module`);--> statement-breakpoint
CREATE INDEX `idx_audit_action` ON `audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `idx_audit_entity` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_created` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_audit_module_action` ON `audit_logs` (`module`,`action`);--> statement-breakpoint
CREATE TABLE `export_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text,
	`module` text NOT NULL,
	`format` text NOT NULL,
	`filter_json` text,
	`total_rows` integer DEFAULT 0 NOT NULL,
	`file_url` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_export_user` ON `export_histories` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_export_module` ON `export_histories` (`module`);--> statement-breakpoint
CREATE INDEX `idx_export_created` ON `export_histories` (`created_at`);--> statement-breakpoint
CREATE TABLE `import_histories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text,
	`module` text NOT NULL,
	`file_name` text NOT NULL,
	`file_url` text,
	`total_rows` integer DEFAULT 0 NOT NULL,
	`success_count` integer DEFAULT 0 NOT NULL,
	`failed_count` integer DEFAULT 0 NOT NULL,
	`error_detail` text,
	`status` text DEFAULT 'completed' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_import_user` ON `import_histories` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_import_module` ON `import_histories` (`module`);--> statement-breakpoint
CREATE INDEX `idx_import_created` ON `import_histories` (`created_at`);--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text NOT NULL,
	`target_type` text NOT NULL,
	`jenjang` text,
	`tingkat` text,
	`class_id` text,
	`day` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`activity` text NOT NULL,
	`subject_id` text,
	`teacher_id` text,
	`room` text,
	`notes` text,
	`is_override` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	`deleted_at` integer,
	`deleted_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_sched_year` ON `schedules` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_sched_semester` ON `schedules` (`semester_id`);--> statement-breakpoint
CREATE INDEX `idx_sched_target` ON `schedules` (`target_type`);--> statement-breakpoint
CREATE INDEX `idx_sched_jenjang` ON `schedules` (`jenjang`);--> statement-breakpoint
CREATE INDEX `idx_sched_class` ON `schedules` (`class_id`);--> statement-breakpoint
CREATE INDEX `idx_sched_day` ON `schedules` (`day`);--> statement-breakpoint
CREATE INDEX `idx_sched_deleted` ON `schedules` (`deleted_at`);--> statement-breakpoint
CREATE TABLE `academic_history` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`academic_year_id` text NOT NULL,
	`institution_id` text DEFAULT 'default' NOT NULL,
	`institution_level` text NOT NULL,
	`tingkat` text NOT NULL,
	`class_id` text NOT NULL,
	`status` text NOT NULL,
	`promotion_transaction_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`promotion_transaction_id`) REFERENCES `promotion_transactions`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_ah_student` ON `academic_history` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_ah_year` ON `academic_history` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_ah_institution` ON `academic_history` (`institution_id`);--> statement-breakpoint
CREATE INDEX `idx_ah_class` ON `academic_history` (`class_id`);--> statement-breakpoint
CREATE TABLE `promotion_periods` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_from_id` text NOT NULL,
	`academic_year_to_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`approved_at` integer,
	`approved_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`academic_year_from_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`academic_year_to_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_pp_year_from` ON `promotion_periods` (`academic_year_from_id`);--> statement-breakpoint
CREATE INDEX `idx_pp_year_to` ON `promotion_periods` (`academic_year_to_id`);--> statement-breakpoint
CREATE INDEX `idx_pp_status` ON `promotion_periods` (`status`);--> statement-breakpoint
CREATE TABLE `promotion_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`promotion_period_id` text NOT NULL,
	`student_id` text NOT NULL,
	`current_class_id` text NOT NULL,
	`target_class_id` text,
	`current_level` text NOT NULL,
	`target_level` text,
	`promotion_status` text NOT NULL,
	`reason` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`approved_by` text,
	FOREIGN KEY (`promotion_period_id`) REFERENCES `promotion_periods`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`current_class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`target_class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `idx_pt_period` ON `promotion_transactions` (`promotion_period_id`);--> statement-breakpoint
CREATE INDEX `idx_pt_student` ON `promotion_transactions` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_pt_current_class` ON `promotion_transactions` (`current_class_id`);--> statement-breakpoint
CREATE INDEX `idx_pt_status` ON `promotion_transactions` (`promotion_status`);
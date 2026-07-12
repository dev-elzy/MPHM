CREATE TABLE `student_achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`title` text NOT NULL,
	`level` text NOT NULL,
	`date` text NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_ach_student` ON `student_achievements` (`student_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text NOT NULL,
	`class_id` text NOT NULL,
	`student_id` text NOT NULL,
	`hijri_month` integer NOT NULL,
	`hijri_year` integer NOT NULL,
	`sick_count` integer DEFAULT 0 NOT NULL,
	`permission_count` integer DEFAULT 0 NOT NULL,
	`absent_count` integer DEFAULT 0 NOT NULL,
	`date` text,
	`status` text,
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
INSERT INTO `__new_attendance`("id", "academic_year_id", "semester_id", "class_id", "student_id", "hijri_month", "hijri_year", "sick_count", "permission_count", "absent_count", "date", "status", "notes", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by") SELECT "id", "academic_year_id", "semester_id", "class_id", "student_id", "hijri_month", "hijri_year", "sick_count", "permission_count", "absent_count", "date", "status", "notes", "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by" FROM `attendance`;--> statement-breakpoint
DROP TABLE `attendance`;--> statement-breakpoint
ALTER TABLE `__new_attendance` RENAME TO `attendance`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_att_student_month` ON `attendance` (`academic_year_id`,`semester_id`,`class_id`,`student_id`,`hijri_month`,`hijri_year`);--> statement-breakpoint
CREATE INDEX `idx_att_year` ON `attendance` (`academic_year_id`);--> statement-breakpoint
CREATE INDEX `idx_att_semester` ON `attendance` (`semester_id`);--> statement-breakpoint
CREATE INDEX `idx_att_class` ON `attendance` (`class_id`);--> statement-breakpoint
CREATE INDEX `idx_att_student` ON `attendance` (`student_id`);--> statement-breakpoint
CREATE INDEX `idx_att_deleted` ON `attendance` (`deleted_at`);
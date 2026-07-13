-- Migration number: 0004 	 2026-07-12T23:43:49.545Z

-- 1. Add columns to people
ALTER TABLE people ADD COLUMN province TEXT;
ALTER TABLE people ADD COLUMN province_id TEXT;
ALTER TABLE people ADD COLUMN regency TEXT;
ALTER TABLE people ADD COLUMN regency_id TEXT;
ALTER TABLE people ADD COLUMN district TEXT;
ALTER TABLE people ADD COLUMN district_id TEXT;
ALTER TABLE people ADD COLUMN village TEXT;
ALTER TABLE people ADD COLUMN village_id TEXT;
ALTER TABLE people ADD COLUMN address_detail TEXT;

-- 2. Migrate students to people
INSERT INTO people (id, full_name, gender, birth_place, birth_date, phone, address, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by, photo_url)
SELECT 
  id, 
  name, 
  gender, 
  birth_place, 
  birth_date, 
  phone, 
  address, 
  created_at, 
  updated_at, 
  created_by, 
  updated_by, 
  deleted_at, 
  deleted_by, 
  photo_url 
FROM students
WHERE id NOT IN (SELECT id FROM people);

-- 3. Migrate students to student_profiles
INSERT INTO student_profiles (id, person_id, nis, nisn, entry_year, status, created_at, updated_at, created_by, updated_by, deleted_at, deleted_by)
SELECT 
  id || '-profile', 
  id, 
  nis, 
  nisn, 
  entry_year, 
  status, 
  created_at, 
  updated_at, 
  created_by, 
  updated_by, 
  deleted_at, 
  deleted_by 
FROM students
WHERE id NOT IN (SELECT person_id FROM student_profiles);

-- 4. Recreate class_students to point to student_profiles
CREATE TABLE `class_students_new` (
	`id` text PRIMARY KEY NOT NULL,
	`academic_year_id` text NOT NULL,
	`semester_id` text NOT NULL,
	`class_id` text NOT NULL,
	`student_profile_id` text NOT NULL,
	`enrollment_date` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`created_by` text,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_by` text,
	FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`student_profile_id`) REFERENCES `student_profiles`(`id`) ON UPDATE no action ON DELETE restrict
);

INSERT INTO class_students_new (id, academic_year_id, semester_id, class_id, student_profile_id, enrollment_date, status, created_at, created_by, updated_at, updated_by)
SELECT id, academic_year_id, semester_id, class_id, student_id || '-profile', enrollment_date, status, created_at, created_by, updated_at, updated_by FROM class_students;

DROP TABLE class_students;
ALTER TABLE class_students_new RENAME TO class_students;

CREATE UNIQUE INDEX `idx_cs_student_year_sem` ON `class_students` (`student_profile_id`,`academic_year_id`,`semester_id`);
CREATE INDEX `idx_cs_class` ON `class_students` (`class_id`);
CREATE INDEX `idx_cs_student` ON `class_students` (`student_profile_id`);
CREATE INDEX `idx_cs_year` ON `class_students` (`academic_year_id`);
CREATE INDEX `idx_cs_year_class` ON `class_students` (`academic_year_id`,`class_id`);

-- 5. Drop deprecated tables
DROP TABLE IF EXISTS student_achievements;
DROP TABLE IF EXISTS students;

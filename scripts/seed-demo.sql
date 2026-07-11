-- MPHM Mock Data Seed File
-- Saling terhubung untuk mensimulasikan visualisasi antar akun (Admin, Mustahiq, Mufatish, Mundzir, Dzuriyyah)
-- Maksimal 7 data per entitas utama.

-- Bersihkan data demo lama (Opsional tetapi aman)
DELETE FROM class_assignments WHERE id LIKE 'demo_%';
DELETE FROM score_sessions WHERE id LIKE 'demo_%';
DELETE FROM classes WHERE id LIKE 'demo_%';
DELETE FROM academic_years WHERE id LIKE 'demo_%';
DELETE FROM semesters WHERE id LIKE 'demo_%';
DELETE FROM users WHERE id LIKE 'demo_%';
DELETE FROM student_profiles WHERE id LIKE 'demo_%';
DELETE FROM students WHERE id LIKE 'demo_%';

-- 1. Tahun Ajaran & Semester
INSERT OR IGNORE INTO academic_years (id, institution_id, name, start_date, end_date, status) VALUES
('demo_ay_2025', 'default', 'Tahun Ajaran 2025/2026', 1735689600, 1767139200, 'active');

INSERT OR IGNORE INTO semesters (id, academic_year_id, name, type, status) VALUES
('demo_sem_1', 'demo_ay_2025', 'Semester Ganjil', 'ganjil', 'active'),
('demo_sem_2', 'demo_ay_2025', 'Semester Genap', 'genap', 'inactive');

-- 2. User & Akun dengan Password 'password123' (Hash PBKDF2 standard):
-- Hash generated: $pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef
-- Akun yang dibuat:
-- 1. admin@mphm.com (Admin)
-- 2. mustahiq1@mphm.com (Mustahiq - Ustadz Abdurrahman)
-- 3. mustahiq2@mphm.com (Mustahiq - Ustadz Zainal)
-- 4. mufatish@mphm.com (Mufatish / Pengawas)
-- 5. mudir@mphm.com (Mudir / Mundzir / Dzuriyyah)

INSERT OR IGNORE INTO users (id, institution_id, name, email, password_hash, role, role_id, status) VALUES
('demo_u_admin', 'default', 'Admin MPHM', 'admin@mphm.com', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'admin', 'admin', 'active'),
('demo_u_mustahiq1', 'default', 'Bpk. Abdurrahman', 'mustahiq1@mphm.com', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'mustahiq', 'mustahiq', 'active'),
('demo_u_mustahiq2', 'default', 'Bpk. Zainal Abidin', 'mustahiq2@mphm.com', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'mustahiq', 'mustahiq', 'active'),
('demo_u_mufatish', 'default', 'Bpk. Mufatish Pengawas', 'mufatish@mphm.com', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'mufatish', 'mufatish', 'active'),
('demo_u_mudir', 'default', 'KH. Mundzir Dzuriyyah', 'mudir@mphm.com', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'mudir', 'mudir', 'active');

-- 3. Kurikulum
INSERT OR IGNORE INTO curriculums (id, name, display_name, description, status) VALUES
('demo_cur_mp', 'Kurikulum MPHM', 'Kurikulum Salafiyah MPHM', 'Fokus kajian kitab kuning dan dirasahi diniyah', 'active');

-- 4. Kelas Rombel (7 Kelas Contoh)
INSERT OR IGNORE INTO classes (id, academic_year_id, semester_id, curriculum_id, jenjang, tingkat, bagian, name, status) VALUES
('demo_cls_1a', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Ula', '1', 'A', 'Ula 1-A', 'active'),
('demo_cls_1b', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Ula', '1', 'B', 'Ula 1-B', 'active'),
('demo_cls_2a', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Ula', '2', 'A', 'Ula 2-A', 'active'),
('demo_cls_w1', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Wustha', '1', 'A', 'Wustha 1-A', 'active'),
('demo_cls_w2', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Wustha', '2', 'A', 'Wustha 2-A', 'active'),
('demo_cls_u1', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Ulya', '1', 'A', 'Ulya 1-A', 'active'),
('demo_cls_u2', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Ulya', '2', 'A', 'Ulya 2-A', 'active');

-- 5. Penugasan Guru (Mustahiq / Wali Kelas)
-- Ustadz Abdurrahman (mustahiq1) mengampu Ula 1-A & Wustha 1-A
-- Ustadz Zainal (mustahiq2) mengampu Ula 1-B & Wustha 2-A
INSERT OR IGNORE INTO class_assignments (id, academic_year_id, class_id, user_id, role, status) VALUES
('demo_asg_1', 'demo_ay_2025', 'demo_cls_1a', 'demo_u_mustahiq1', 'wali_kelas', 'active'),
('demo_asg_2', 'demo_ay_2025', 'demo_cls_w1', 'demo_u_mustahiq1', 'wali_kelas', 'active'),
('demo_asg_3', 'demo_ay_2025', 'demo_cls_1b', 'demo_u_mustahiq2', 'wali_kelas', 'active'),
('demo_asg_4', 'demo_ay_2025', 'demo_cls_w2', 'demo_u_mustahiq2', 'wali_kelas', 'active');

-- 6. Daftar Siswi / Santri (7 Santri)
INSERT OR IGNORE INTO students (id, institution_id, name, nis, nisn, status, gender) VALUES
('demo_st_1', 'default', 'Aisyah Humaira', '2501001', '308901221', 'active', 'F'),
('demo_st_2', 'default', 'Fatima Azzahra', '2501002', '308901222', 'active', 'F'),
('demo_st_3', 'default', 'Khadijah Al-Kubra', '2501003', '308901223', 'active', 'F'),
('demo_st_4', 'default', 'Safiyyah Zhafira', '2501004', '308901224', 'active', 'F'),
('demo_st_5', 'default', 'Zainab Nabila', '2501005', '308901225', 'active', 'F'),
('demo_st_6', 'default', 'Nusaibah Khairunnisa', '2501006', '308901226', 'active', 'F'),
('demo_st_7', 'default', 'Ruqayyah Mumtazah', '2501007', '308901227', 'active', 'F');

-- Link Student to Class
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status, guardian_name) VALUES
('demo_prof_1', 'demo_st_1', 'demo_cls_1a', 'active', 'Ahmad Abdullah'),
('demo_prof_2', 'demo_st_2', 'demo_cls_1a', 'active', 'Muhammad Hasan'),
('demo_prof_3', 'demo_st_3', 'demo_cls_1b', 'active', 'Hasan Basri'),
('demo_prof_4', 'demo_st_4', 'demo_cls_w1', 'active', 'Ali Umar'),
('demo_prof_5', 'demo_st_5', 'demo_cls_w1', 'active', 'Usman Affan'),
('demo_prof_6', 'demo_st_6', 'demo_cls_w2', 'active', 'Abdurrahman Auf'),
('demo_prof_7', 'demo_st_7', 'demo_cls_u1', 'active', 'Saad Abi Waqqas');

-- 7. Sesi Penilaian (Score Sessions)
INSERT OR IGNORE INTO score_sessions (id, academic_year_id, semester_id, class_id, subject_id, status, created_by, updated_by) VALUES
('demo_scs_1', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_1a', 'Fathul Qorib', 'draft', 'demo_u_mustahiq1', 'demo_u_mustahiq1'),
('demo_scs_2', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_w1', 'Imrithi', 'ready', 'demo_u_mustahiq1', 'demo_u_mustahiq1'),
('demo_scs_3', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_1b', 'Tafsir Jalalain', 'final', 'demo_u_mustahiq2', 'demo_u_mustahiq2');

-- MPHM Mock Data Seed File (Clean, Fully Connected & Relational)
-- Menghubungkan seluruh modul pengujian: Tahun Ajaran, Semester, Kurikulum, Pelajaran, Kelas, Wali Kelas, Siswa, Sesi Nilai, dan Nilai.
-- Kredensial default: password123 (hash $pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef)

-- 1. Bersihkan data demo sebelumnya
DELETE FROM class_assignments WHERE id LIKE 'demo_%';
DELETE FROM scores WHERE id LIKE 'demo_%';
DELETE FROM score_sessions WHERE id LIKE 'demo_%';
DELETE FROM curriculum_subjects WHERE id LIKE 'demo_%';
DELETE FROM subjects WHERE id LIKE 'demo_%';
DELETE FROM classes WHERE id LIKE 'demo_%';
DELETE FROM curriculums WHERE id LIKE 'demo_%';
DELETE FROM semesters WHERE id LIKE 'demo_%';
DELETE FROM academic_years WHERE id LIKE 'demo_%';
DELETE FROM users WHERE id LIKE 'demo_%';
DELETE FROM class_students WHERE id LIKE 'demo_%';
DELETE FROM students WHERE id LIKE 'demo_%';

-- 2. Akun Tambahan (Mufatish, Mundzir, Dzuriyyah, Operator)
INSERT OR IGNORE INTO users (id, institution_id, name, email, password_hash, role, role_id, status) VALUES
('demo_user_mufatish', 'default', 'Ustadz Mufatish', 'mufatish@mphm.my.id', '$pbkdf2$SHA-256$100000$a843ea090982e6112b12e4d57827cb8f$a0a476a8c888524ad6b0252511d594f6d3e6b770bec1624cc466b60799e3c955', 'mufatish', 'mudir', 'active'),
('demo_user_mundzir', 'default', 'Kiai Mundzir', 'mundzir@mphm.my.id', '$pbkdf2$SHA-256$100000$a843ea090982e6112b12e4d57827cb8f$a0a476a8c888524ad6b0252511d594f6d3e6b770bec1624cc466b60799e3c955', 'mudir', 'mudir', 'active'),
('demo_user_dzuriyyah', 'default', 'Gus Dzuriyyah', 'dzuriyyah@mphm.my.id', '$pbkdf2$SHA-256$100000$a843ea090982e6112b12e4d57827cb8f$a0a476a8c888524ad6b0252511d594f6d3e6b770bec1624cc466b60799e3c955', 'mudir', 'mudir', 'active'),
('demo_user_operator', 'default', 'Operator MPHM', 'operator@mphm.my.id', '$pbkdf2$SHA-256$100000$a843ea090982e6112b12e4d57827cb8f$a0a476a8c888524ad6b0252511d594f6d3e6b770bec1624cc466b60799e3c955', 'operator', 'operator', 'active');

-- 3. Tahun Ajaran, Semester, dan Kurikulum
INSERT OR IGNORE INTO academic_years (id, institution_id, name, start_date, end_date, status) VALUES
('demo_ay_2025', 'default', 'Tahun Ajaran 2025/2026', 1735689600, 1767139200, 'active');

INSERT OR IGNORE INTO semesters (id, academic_year_id, name, type, status) VALUES
('demo_sem_1', 'demo_ay_2025', 'Semester Ganjil', 'ganjil', 'active');

INSERT OR IGNORE INTO curriculums (id, academic_year_id, name, description, status) VALUES
('demo_cur_mp', 'demo_ay_2025', 'Kurikulum MPHM', 'Kurikulum Salafiyah MPHM Terintegrasi', 'active');

-- 4. Pelajaran Master (Subjects) & Hubungan Kurikulum (Curriculum Subjects)
-- Ada 8 Pelajaran contoh yang saling berhubungan
INSERT OR IGNORE INTO subjects (id, institution_id, name, arabic_name, code, category, status) VALUES
('demo_sub_1', 'default', 'Fathul Qarib', 'فتح القريب', 'FQ01', 'Kitab Kuning', 'active'),
('demo_sub_2', 'default', 'Imrithi', 'العمريطي', 'IM02', 'Nahwu', 'active'),
('demo_sub_3', 'default', 'Tafsir Jalalain', 'تفسير الجلالين', 'TJ03', 'Tafsir', 'active'),
('demo_sub_4', 'default', 'Bulughul Maram', 'بلوغ المرام', 'BM04', 'Hadits', 'active'),
('demo_sub_5', 'default', 'Jurumiyyah', 'الآجرومية', 'JR05', 'Nahwu', 'active'),
('demo_sub_6', 'default', 'Aqidatul Awam', 'عقيدة العوام', 'AA06', 'Tauhid', 'active'),
('demo_sub_7', 'default', 'Ta''lim Muta''allim', 'تعليم المتعلم', 'TM07', 'Akhlaq', 'active'),
('demo_sub_8', 'default', 'Shorof', 'التصريف', 'SR08', 'Shorof', 'active');

INSERT OR IGNORE INTO curriculum_subjects (id, curriculum_id, subject_id, sort_order, max_score, min_score, weight, status) VALUES
('demo_cs_1', 'demo_cur_mp', 'demo_sub_1', 1, 100, 60, 1, 'active'),
('demo_cs_2', 'demo_cur_mp', 'demo_sub_2', 2, 100, 60, 1, 'active'),
('demo_cs_3', 'demo_cur_mp', 'demo_sub_3', 3, 100, 60, 1, 'active'),
('demo_cs_4', 'demo_cur_mp', 'demo_sub_4', 4, 100, 60, 1, 'active'),
('demo_cs_5', 'demo_cur_mp', 'demo_sub_5', 5, 100, 60, 1, 'active'),
('demo_cs_6', 'demo_cur_mp', 'demo_sub_6', 6, 100, 60, 1, 'active'),
('demo_cs_7', 'demo_cur_mp', 'demo_sub_7', 7, 100, 60, 1, 'active'),
('demo_cs_8', 'demo_cur_mp', 'demo_sub_8', 8, 100, 60, 1, 'active');

-- 5. Kelas Rombel (8 Kelas Terhubung)
INSERT OR IGNORE INTO classes (id, academic_year_id, semester_id, curriculum_id, jenjang, tingkat, bagian, name, status) VALUES
('demo_cls_1', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal A', 'Tsanawiyyah I Lokal A', 'active'),
('demo_cls_2', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal B', 'Tsanawiyyah I Lokal B', 'active'),
('demo_cls_3', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal C', 'Tsanawiyyah I Lokal C', 'active'),
('demo_cls_4', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal D', 'Tsanawiyyah I Lokal D', 'active'),
('demo_cls_5', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal E', 'Tsanawiyyah I Lokal E', 'active'),
('demo_cls_6', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal F', 'Tsanawiyyah I Lokal F', 'active'),
('demo_cls_7', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal G', 'Tsanawiyyah I Lokal G', 'active'),
('demo_cls_8', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal H', 'Tsanawiyyah I Lokal H', 'active');

-- 6. Penugasan Guru (Wali Kelas) menggunakan pengajar produksi (usr-wali-a sampai usr-wali-h)
INSERT OR IGNORE INTO class_assignments (id, academic_year_id, class_id, user_id, role, status) VALUES
('demo_asg_1', 'demo_ay_2025', 'demo_cls_1', 'usr-wali-a', 'wali_kelas', 'active'),
('demo_asg_2', 'demo_ay_2025', 'demo_cls_2', 'usr-wali-b', 'wali_kelas', 'active'),
('demo_asg_3', 'demo_ay_2025', 'demo_cls_3', 'usr-wali-c', 'wali_kelas', 'active'),
('demo_asg_4', 'demo_ay_2025', 'demo_cls_4', 'usr-wali-d', 'wali_kelas', 'active'),
('demo_asg_5', 'demo_ay_2025', 'demo_cls_5', 'usr-wali-e', 'wali_kelas', 'active'),
('demo_asg_6', 'demo_ay_2025', 'demo_cls_6', 'usr-wali-f', 'wali_kelas', 'active'),
('demo_asg_7', 'demo_ay_2025', 'demo_cls_7', 'usr-wali-g', 'wali_kelas', 'active'),
('demo_asg_8', 'demo_ay_2025', 'demo_cls_8', 'usr-wali-h', 'wali_kelas', 'active');

-- 7. Santri / Siswi (8 Santri per Kelas x 8 Kelas = 64 Santri)
-- Siswi Kelas 1
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_1_1', 'Khadijah Al-Adawiyah', '2501011', 'active'),
('demo_st_1_2', 'Rabiah Al-Bashriyah', '2501012', 'active'),
('demo_st_1_3', 'Sumayyah Binti Khayyat', '2501013', 'active'),
('demo_st_1_4', 'Rufaidah Al-Aslamiyah', '2501014', 'active'),
('demo_st_1_5', 'Fatima Fihriyah', '2501015', 'active'),
('demo_st_1_6', 'Lubna Al-Qurthubiyyah', '2501016', 'active'),
('demo_st_1_7', 'Nusaibah Binti Ka''ab', '2501017', 'active'),
('demo_st_1_8', 'Asma Binti Abu Bakar', '2501018', 'active');
INSERT OR IGNORE INTO class_students (id, academic_year_id, semester_id, student_id, class_id, status) VALUES 
('demo_pr_1_1', 'demo_ay_2025', 'demo_sem_1', 'demo_st_1_1', 'demo_cls_1', 'active'),
('demo_pr_1_2', 'demo_ay_2025', 'demo_sem_1', 'demo_st_1_2', 'demo_cls_1', 'active'),
('demo_pr_1_3', 'demo_ay_2025', 'demo_sem_1', 'demo_st_1_3', 'demo_cls_1', 'active'),
('demo_pr_1_4', 'demo_ay_2025', 'demo_sem_1', 'demo_st_1_4', 'demo_cls_1', 'active'),
('demo_pr_1_5', 'demo_ay_2025', 'demo_sem_1', 'demo_st_1_5', 'demo_cls_1', 'active'),
('demo_pr_1_6', 'demo_ay_2025', 'demo_sem_1', 'demo_st_1_6', 'demo_cls_1', 'active'),
('demo_pr_1_7', 'demo_ay_2025', 'demo_sem_1', 'demo_st_1_7', 'demo_cls_1', 'active'),
('demo_pr_1_8', 'demo_ay_2025', 'demo_sem_1', 'demo_st_1_8', 'demo_cls_1', 'active');

-- Siswi Kelas 2
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_2_1', 'Aisyah Az-Zahra', '2501021', 'active'),
('demo_st_2_2', 'Halimah As-Sa''diyyah', '2501022', 'active'),
('demo_st_2_3', 'Aminah Binti Wahab', '2501023', 'active'),
('demo_st_2_4', 'Shafiyyah Binti Huyay', '2501024', 'active'),
('demo_st_2_5', 'Zainab Binti Jahsy', '2501025', 'active'),
('demo_st_2_6', 'Ummu Salamah Hindun', '2501026', 'active'),
('demo_st_2_7', 'Juwayriyah Binti Harits', '2501027', 'active'),
('demo_st_2_8', 'Mariyah Al-Qibthiyyah', '2501028', 'active');
INSERT OR IGNORE INTO class_students (id, academic_year_id, semester_id, student_id, class_id, status) VALUES 
('demo_pr_2_1', 'demo_ay_2025', 'demo_sem_1', 'demo_st_2_1', 'demo_cls_2', 'active'),
('demo_pr_2_2', 'demo_ay_2025', 'demo_sem_1', 'demo_st_2_2', 'demo_cls_2', 'active'),
('demo_pr_2_3', 'demo_ay_2025', 'demo_sem_1', 'demo_st_2_3', 'demo_cls_2', 'active'),
('demo_pr_2_4', 'demo_ay_2025', 'demo_sem_1', 'demo_st_2_4', 'demo_cls_2', 'active'),
('demo_pr_2_5', 'demo_ay_2025', 'demo_sem_1', 'demo_st_2_5', 'demo_cls_2', 'active'),
('demo_pr_2_6', 'demo_ay_2025', 'demo_sem_1', 'demo_st_2_6', 'demo_cls_2', 'active'),
('demo_pr_2_7', 'demo_ay_2025', 'demo_sem_1', 'demo_st_2_7', 'demo_cls_2', 'active'),
('demo_pr_2_8', 'demo_ay_2025', 'demo_sem_1', 'demo_st_2_8', 'demo_cls_2', 'active');

-- Siswi Kelas 3
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_3_1', 'Ruqayyah Binti Muhammad', '2501031', 'active'),
('demo_st_3_2', 'Ummu Kultsum Binti Muhammad', '2501032', 'active'),
('demo_st_3_3', 'Fathimah Az-Zahra', '2501033', 'active'),
('demo_st_3_4', 'Zainab Binti Muhammad', '2501034', 'active'),
('demo_st_3_5', 'Ummu Aiman Barakah', '2501035', 'active'),
('demo_st_3_6', 'Fathimah Binti Asad', '2501036', 'active'),
('demo_st_3_7', 'Khaulah Binti Az-Azur', '2501037', 'active'),
('demo_st_3_8', 'Ummu Haram Binti Milhan', '2501038', 'active');
INSERT OR IGNORE INTO class_students (id, academic_year_id, semester_id, student_id, class_id, status) VALUES 
('demo_pr_3_1', 'demo_ay_2025', 'demo_sem_1', 'demo_st_3_1', 'demo_cls_3', 'active'),
('demo_pr_3_2', 'demo_ay_2025', 'demo_sem_1', 'demo_st_3_2', 'demo_cls_3', 'active'),
('demo_pr_3_3', 'demo_ay_2025', 'demo_sem_1', 'demo_st_3_3', 'demo_cls_3', 'active'),
('demo_pr_3_4', 'demo_ay_2025', 'demo_sem_1', 'demo_st_3_4', 'demo_cls_3', 'active'),
('demo_pr_3_5', 'demo_ay_2025', 'demo_sem_1', 'demo_st_3_5', 'demo_cls_3', 'active'),
('demo_pr_3_6', 'demo_ay_2025', 'demo_sem_1', 'demo_st_3_6', 'demo_cls_3', 'active'),
('demo_pr_3_7', 'demo_ay_2025', 'demo_sem_1', 'demo_st_3_7', 'demo_cls_3', 'active'),
('demo_pr_3_8', 'demo_ay_2025', 'demo_sem_1', 'demo_st_3_8', 'demo_cls_3', 'active');

-- Siswi Kelas 4
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_4_1', 'Hindun Binti Utbah', '2501041', 'active'),
('demo_st_4_2', 'Ramlah Binti Abu Sufyan', '2501042', 'active'),
('demo_st_4_3', 'Ummu Ma''bad At-Khuzaiyah', '2501043', 'active'),
('demo_st_4_4', 'Kabsyah Binti Rafi''', '2501044', 'active'),
('demo_st_4_5', 'Laila Binti Al-Minhal', '2501045', 'active'),
('demo_st_4_6', 'Asma Binti Yazid', '2501046', 'active'),
('demo_st_4_7', 'Safiyyah Binti Abdul Muthalib', '2501047', 'active'),
('demo_st_4_8', 'Atikah Binti Zaid', '2501048', 'active');
INSERT OR IGNORE INTO class_students (id, academic_year_id, semester_id, student_id, class_id, status) VALUES 
('demo_pr_4_1', 'demo_ay_2025', 'demo_sem_1', 'demo_st_4_1', 'demo_cls_4', 'active'),
('demo_pr_4_2', 'demo_ay_2025', 'demo_sem_1', 'demo_st_4_2', 'demo_cls_4', 'active'),
('demo_pr_4_3', 'demo_ay_2025', 'demo_sem_1', 'demo_st_4_3', 'demo_cls_4', 'active'),
('demo_pr_4_4', 'demo_ay_2025', 'demo_sem_1', 'demo_st_4_4', 'demo_cls_4', 'active'),
('demo_pr_4_5', 'demo_ay_2025', 'demo_sem_1', 'demo_st_4_5', 'demo_cls_4', 'active'),
('demo_pr_4_6', 'demo_ay_2025', 'demo_sem_1', 'demo_st_4_6', 'demo_cls_4', 'active'),
('demo_pr_4_7', 'demo_ay_2025', 'demo_sem_1', 'demo_st_4_7', 'demo_cls_4', 'active'),
('demo_pr_4_8', 'demo_ay_2025', 'demo_sem_1', 'demo_st_4_8', 'demo_cls_4', 'active');

-- Siswi Kelas 5
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_5_1', 'Shifa Binti Abdullah', '2501051', 'active'),
('demo_st_5_2', 'Naila Binti Al-Farafisah', '2501052', 'active'),
('demo_st_5_3', 'Rayhanah Binti Zaid', '2501053', 'active'),
('demo_st_5_4', 'Zainab Binti Khuzaimah', '2501054', 'active'),
('demo_st_5_5', 'Ummu Waraqah Binti Abdullah', '2501055', 'active'),
('demo_st_5_6', 'Atikah Binti Abu Sufyan', '2501056', 'active'),
('demo_st_5_7', 'Arwa Binti Kuraiz', '2501057', 'active'),
('demo_st_5_8', 'Khansa Binti Amru', '2501058', 'active');
INSERT OR IGNORE INTO class_students (id, academic_year_id, semester_id, student_id, class_id, status) VALUES 
('demo_pr_5_1', 'demo_ay_2025', 'demo_sem_1', 'demo_st_5_1', 'demo_cls_5', 'active'),
('demo_pr_5_2', 'demo_ay_2025', 'demo_sem_1', 'demo_st_5_2', 'demo_cls_5', 'active'),
('demo_pr_5_3', 'demo_ay_2025', 'demo_sem_1', 'demo_st_5_3', 'demo_cls_5', 'active'),
('demo_pr_5_4', 'demo_ay_2025', 'demo_sem_1', 'demo_st_5_4', 'demo_cls_5', 'active'),
('demo_pr_5_5', 'demo_ay_2025', 'demo_sem_1', 'demo_st_5_5', 'demo_cls_5', 'active'),
('demo_pr_5_6', 'demo_ay_2025', 'demo_sem_1', 'demo_st_5_6', 'demo_cls_5', 'active'),
('demo_pr_5_7', 'demo_ay_2025', 'demo_sem_1', 'demo_st_5_7', 'demo_cls_5', 'active'),
('demo_pr_5_8', 'demo_ay_2025', 'demo_sem_1', 'demo_st_5_8', 'demo_cls_5', 'active');

-- Siswi Kelas 6
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_6_1', 'Bararah Al-Habasyiyyah', '2501061', 'active'),
('demo_st_6_2', 'Fathimah Binti Khattab', '2501062', 'active'),
('demo_st_6_3', 'Ummu Syuraik Ghaziyyah', '2501063', 'active'),
('demo_st_6_4', 'Laila Al-Ghaffariyah', '2501064', 'active'),
('demo_st_6_5', 'Asma Binti Yazid An-Anshariyah', '2501065', 'active'),
('demo_st_6_6', 'Khaulah Binti Tsalabah', '2501066', 'active'),
('demo_st_6_7', 'Ummu Kulsum Binti Uqbah', '2501067', 'active'),
('demo_st_6_8', 'Sahlah Binti Suhail', '2501068', 'active');
INSERT OR IGNORE INTO class_students (id, academic_year_id, semester_id, student_id, class_id, status) VALUES 
('demo_pr_6_1', 'demo_ay_2025', 'demo_sem_1', 'demo_st_6_1', 'demo_cls_6', 'active'),
('demo_pr_6_2', 'demo_ay_2025', 'demo_sem_1', 'demo_st_6_2', 'demo_cls_6', 'active'),
('demo_pr_6_3', 'demo_ay_2025', 'demo_sem_1', 'demo_st_6_3', 'demo_cls_6', 'active'),
('demo_pr_6_4', 'demo_ay_2025', 'demo_sem_1', 'demo_st_6_4', 'demo_cls_6', 'active'),
('demo_pr_6_5', 'demo_ay_2025', 'demo_sem_1', 'demo_st_6_5', 'demo_cls_6', 'active'),
('demo_pr_6_6', 'demo_ay_2025', 'demo_sem_1', 'demo_st_6_6', 'demo_cls_6', 'active'),
('demo_pr_6_7', 'demo_ay_2025', 'demo_sem_1', 'demo_st_6_7', 'demo_cls_6', 'active'),
('demo_pr_6_8', 'demo_ay_2025', 'demo_sem_1', 'demo_st_6_8', 'demo_cls_6', 'active');

-- Siswi Kelas 7
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_7_1', 'Ummu Sulaim Binti Milhan', '2501071', 'active'),
('demo_st_7_2', 'Khaulah Binti Hakim', '2501072', 'active'),
('demo_st_7_3', 'Ummu Ayyub Al-Anshariyah', '2501073', 'active'),
('demo_st_7_4', 'Fathimah Binti Al-Khaththab', '2501074', 'active'),
('demo_st_7_5', 'Khaulah Binti Malik', '2501075', 'active'),
('demo_st_7_6', 'Atikah Binti Khalid', '2501076', 'active'),
('demo_st_7_7', 'Hamnah Binti Jahsy', '2501077', 'active'),
('demo_st_7_8', 'Shafiyyah Binti Abdul Mutalib', '2501078', 'active');
INSERT OR IGNORE INTO class_students (id, academic_year_id, semester_id, student_id, class_id, status) VALUES 
('demo_pr_7_1', 'demo_ay_2025', 'demo_sem_1', 'demo_st_7_1', 'demo_cls_7', 'active'),
('demo_pr_7_2', 'demo_ay_2025', 'demo_sem_1', 'demo_st_7_2', 'demo_cls_7', 'active'),
('demo_pr_7_3', 'demo_ay_2025', 'demo_sem_1', 'demo_st_7_3', 'demo_cls_7', 'active'),
('demo_pr_7_4', 'demo_ay_2025', 'demo_sem_1', 'demo_st_7_4', 'demo_cls_7', 'active'),
('demo_pr_7_5', 'demo_ay_2025', 'demo_sem_1', 'demo_st_7_5', 'demo_cls_7', 'active'),
('demo_pr_7_6', 'demo_ay_2025', 'demo_sem_1', 'demo_st_7_6', 'demo_cls_7', 'active'),
('demo_pr_7_7', 'demo_ay_2025', 'demo_sem_1', 'demo_st_7_7', 'demo_cls_7', 'active'),
('demo_pr_7_8', 'demo_ay_2025', 'demo_sem_1', 'demo_st_7_8', 'demo_cls_7', 'active');

-- Siswi Kelas 8
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_8_1', 'Khadijah Mumtaz', '2501081', 'active'),
('demo_st_8_2', 'Fathimah Al-Kamilah', '2501082', 'active'),
('demo_st_8_3', 'Aisyah Humairah', '2501083', 'active'),
('demo_st_8_4', 'Zainab Nabila', '2501084', 'active'),
('demo_st_8_5', 'Ruqayyah Mumtazah', '2501085', 'active'),
('demo_st_8_6', 'Ummu Kultsum Zakiyah', '2501086', 'active'),
('demo_st_8_7', 'Shafiyyah Zhafira', '2501087', 'active'),
('demo_st_8_8', 'Maria Qibthiyyah', '2501088', 'active');
INSERT OR IGNORE INTO class_students (id, academic_year_id, semester_id, student_id, class_id, status) VALUES 
('demo_pr_8_1', 'demo_ay_2025', 'demo_sem_1', 'demo_st_8_1', 'demo_cls_8', 'active'),
('demo_pr_8_2', 'demo_ay_2025', 'demo_sem_1', 'demo_st_8_2', 'demo_cls_8', 'active'),
('demo_pr_8_3', 'demo_ay_2025', 'demo_sem_1', 'demo_st_8_3', 'demo_cls_8', 'active'),
('demo_pr_8_4', 'demo_ay_2025', 'demo_sem_1', 'demo_st_8_4', 'demo_cls_8', 'active'),
('demo_pr_8_5', 'demo_ay_2025', 'demo_sem_1', 'demo_st_8_5', 'demo_cls_8', 'active'),
('demo_pr_8_6', 'demo_ay_2025', 'demo_sem_1', 'demo_st_8_6', 'demo_cls_8', 'active'),
('demo_pr_8_7', 'demo_ay_2025', 'demo_sem_1', 'demo_st_8_7', 'demo_cls_8', 'active'),
('demo_pr_8_8', 'demo_ay_2025', 'demo_sem_1', 'demo_st_8_8', 'demo_cls_8', 'active');

-- 8. Sesi Penilaian & Nilai Terhubung (Score Sessions & Scores)
-- Sesi Penilaian Ganjil untuk 8 Kelas dengan 8 Pelajaran Berbeda
INSERT OR IGNORE INTO score_sessions (id, academic_year_id, semester_id, class_id, curriculum_subject_id, status, created_by, updated_by) VALUES
('demo_ss_1', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_1', 'demo_cs_1', 'draft', 'usr-wali-a', 'usr-wali-a'),
('demo_ss_2', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_2', 'demo_cs_2', 'ready', 'usr-wali-b', 'usr-wali-b'),
('demo_ss_3', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_3', 'demo_cs_3', 'final', 'usr-wali-c', 'usr-wali-c'),
('demo_ss_4', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_4', 'demo_cs_4', 'locked', 'usr-wali-d', 'usr-wali-d'),
('demo_ss_5', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_5', 'demo_cs_5', 'draft', 'usr-wali-e', 'usr-wali-e'),
('demo_ss_6', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_6', 'demo_cs_6', 'ready', 'usr-wali-f', 'usr-wali-f'),
('demo_ss_7', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_7', 'demo_cs_7', 'final', 'usr-wali-g', 'usr-wali-g'),
('demo_ss_8', 'demo_ay_2025', 'demo_sem_1', 'demo_cls_8', 'demo_cs_8', 'locked', 'usr-wali-h', 'usr-wali-h');

-- Sampel Nilai Tamrin dan Ujian untuk Santri di Kelas 1 (Sesi demo_ss_1)
INSERT OR IGNORE INTO scores (id, score_session_id, student_id, score_type, score, notes) VALUES
('demo_sco_1_1t', 'demo_ss_1', 'demo_st_1_1', 'tamrin', 85, 'Bagus'),
('demo_sco_1_1u', 'demo_ss_1', 'demo_st_1_1', 'ujian', 80, 'Memuaskan'),
('demo_sco_1_2t', 'demo_ss_1', 'demo_st_1_2', 'tamrin', 75, 'Cukup'),
('demo_sco_1_2u', 'demo_ss_1', 'demo_st_1_2', 'ujian', 78, 'Perlu ditingkatkan'),
('demo_sco_1_3t', 'demo_ss_1', 'demo_st_1_3', 'tamrin', 90, 'Sangat Baik'),
('demo_sco_1_3u', 'demo_ss_1', 'demo_st_1_3', 'ujian', 88, 'Luar Biasa');

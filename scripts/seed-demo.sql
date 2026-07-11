-- MPHM Mock Data Seed File (Clean & Minimal)
-- Menggunakan kelas dan pengajar yang sudah ada di database produksi.
-- Serta membuat akun mufatish-mundzir-dzuriyyah dan 8 siswa per kelas untuk 8 kelas.
-- Kredensial default: password123 (hash $pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef)

-- 1. Bersihkan data demo sebelumnya
DELETE FROM class_assignments WHERE id LIKE 'demo_%';
DELETE FROM score_sessions WHERE id LIKE 'demo_%';
DELETE FROM users WHERE id LIKE 'demo_%';
DELETE FROM student_profiles WHERE id LIKE 'demo_%';
DELETE FROM students WHERE id LIKE 'demo_%';

-- 2. Buat Akun Mufatish, Mundzir, Dzuriyyah, dan Operator tambahan (kecuali Admin karena sudah ada admin_123 & super_admin_operator)
-- Akun:
-- - mufatish@mphm.my.id (Mufatish / Pengawas)
-- - mundzir@mphm.my.id (Mundzir / Pimpinan)
-- - dzuriyyah@mphm.my.id (Dzuriyyah / Dewan Pengawas Keluarga)
-- - operator@mphm.my.id (Operator Tambahan)

INSERT OR IGNORE INTO users (id, institution_id, name, email, password_hash, role, role_id, status) VALUES
('demo_user_mufatish', 'default', 'Ustadz Mufatish', 'mufatish@mphm.my.id', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'mufatish', 'mudir', 'active'),
('demo_user_mundzir', 'default', 'Kiai Mundzir', 'mundzir@mphm.my.id', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'mudir', 'mudir', 'active'),
('demo_user_dzuriyyah', 'default', 'Gus Dzuriyyah', 'dzuriyyah@mphm.my.id', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'mudir', 'mudir', 'active'),
('demo_user_operator', 'default', 'Operator MPHM', 'operator@mphm.my.id', '$pbkdf2$SHA-256$10000$87fd0f3d99e5251147a760b943261942$3b839ea0cc7b9f36f6d0fcd80bb14a72d3e421bfdfb6be63c2288cd72ad853ef', 'operator', 'operator', 'active');

-- 3. Hubungkan / Assign Pengajar yang sudah ada (usr-wali-a sampai usr-wali-h) ke 8 Kelas yang sudah ada
-- Kita asumsikan ID kelas target yang ada di produksi (jika D1 Anda memiliki data kelas silakan run, jika tidak kita daftarkan ID referensi)
-- Di bawah ini kita siapkan relasi 8 Kelas & 8 Pengampunya (wali kelas):
-- Pengampu: usr-wali-a, usr-wali-b, usr-wali-c, usr-wali-d, usr-wali-e, usr-wali-f, usr-wali-g, usr-wali-h.
-- Kelas yang diampu: kelas_ula_1a, kelas_ula_1b, dst. (jika belum ada, kita INSERT agar data tetap terhubung)

INSERT OR IGNORE INTO classes (id, academic_year_id, semester_id, curriculum_id, jenjang, tingkat, bagian, name, status) VALUES
('demo_cls_1', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal A', 'Tsanawiyyah I Lokal A', 'active'),
('demo_cls_2', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal B', 'Tsanawiyyah I Lokal B', 'active'),
('demo_cls_3', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal C', 'Tsanawiyyah I Lokal C', 'active'),
('demo_cls_4', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal D', 'Tsanawiyyah I Lokal D', 'active'),
('demo_cls_5', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal E', 'Tsanawiyyah I Lokal E', 'active'),
('demo_cls_6', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal F', 'Tsanawiyyah I Lokal F', 'active'),
('demo_cls_7', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal G', 'Tsanawiyyah I Lokal G', 'active'),
('demo_cls_8', 'demo_ay_2025', 'demo_sem_1', 'demo_cur_mp', 'Tsanawiyyah', 'I', 'Lokal H', 'Tsanawiyyah I Lokal H', 'active');

-- Penugasan Pengajar Produksi (usr-wali-a s.d. usr-wali-h) ke 8 Kelas di atas
INSERT OR IGNORE INTO class_assignments (id, academic_year_id, class_id, user_id, role, status) VALUES
('demo_asg_1', 'demo_ay_2025', 'demo_cls_1', 'usr-wali-a', 'wali_kelas', 'active'),
('demo_asg_2', 'demo_ay_2025', 'demo_cls_2', 'usr-wali-b', 'wali_kelas', 'active'),
('demo_asg_3', 'demo_ay_2025', 'demo_cls_3', 'usr-wali-c', 'wali_kelas', 'active'),
('demo_asg_4', 'demo_ay_2025', 'demo_cls_4', 'usr-wali-d', 'wali_kelas', 'active'),
('demo_asg_5', 'demo_ay_2025', 'demo_cls_5', 'usr-wali-e', 'wali_kelas', 'active'),
('demo_asg_6', 'demo_ay_2025', 'demo_cls_6', 'usr-wali-f', 'wali_kelas', 'active'),
('demo_asg_7', 'demo_ay_2025', 'demo_cls_7', 'usr-wali-g', 'wali_kelas', 'active'),
('demo_asg_8', 'demo_ay_2025', 'demo_cls_8', 'usr-wali-h', 'wali_kelas', 'active');

-- 4. Daftar Siswi Contoh (8 Siswi per Kelas x 8 Kelas = 64 Siswi)
-- Kelas 1
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_1_1', 'Santri 1 Kelas 1', '2501011', 'active'),
('demo_st_1_2', 'Santri 2 Kelas 1', '2501012', 'active'),
('demo_st_1_3', 'Santri 3 Kelas 1', '2501013', 'active'),
('demo_st_1_4', 'Santri 4 Kelas 1', '2501014', 'active'),
('demo_st_1_5', 'Santri 5 Kelas 1', '2501015', 'active'),
('demo_st_1_6', 'Santri 6 Kelas 1', '2501016', 'active'),
('demo_st_1_7', 'Santri 7 Kelas 1', '2501017', 'active'),
('demo_st_1_8', 'Santri 8 Kelas 1', '2501018', 'active');
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status) VALUES 
('demo_pr_1_1', 'demo_st_1_1', 'demo_cls_1', 'active'),
('demo_pr_1_2', 'demo_st_1_2', 'demo_cls_1', 'active'),
('demo_pr_1_3', 'demo_st_1_3', 'demo_cls_1', 'active'),
('demo_pr_1_4', 'demo_st_1_4', 'demo_cls_1', 'active'),
('demo_pr_1_5', 'demo_st_1_5', 'demo_cls_1', 'active'),
('demo_pr_1_6', 'demo_st_1_6', 'demo_cls_1', 'active'),
('demo_pr_1_7', 'demo_st_1_7', 'demo_cls_1', 'active'),
('demo_pr_1_8', 'demo_st_1_8', 'demo_cls_1', 'active');

-- Kelas 2
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_2_1', 'Santri 1 Kelas 2', '2501021', 'active'),
('demo_st_2_2', 'Santri 2 Kelas 2', '2501022', 'active'),
('demo_st_2_3', 'Santri 3 Kelas 2', '2501023', 'active'),
('demo_st_2_4', 'Santri 4 Kelas 2', '2501024', 'active'),
('demo_st_2_5', 'Santri 5 Kelas 2', '2501025', 'active'),
('demo_st_2_6', 'Santri 6 Kelas 2', '2501026', 'active'),
('demo_st_2_7', 'Santri 7 Kelas 2', '2501027', 'active'),
('demo_st_2_8', 'Santri 8 Kelas 2', '2501028', 'active');
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status) VALUES 
('demo_pr_2_1', 'demo_st_2_1', 'demo_cls_2', 'active'),
('demo_pr_2_2', 'demo_st_2_2', 'demo_cls_2', 'active'),
('demo_pr_2_3', 'demo_st_2_3', 'demo_cls_2', 'active'),
('demo_pr_2_4', 'demo_st_2_4', 'demo_cls_2', 'active'),
('demo_pr_2_5', 'demo_st_2_5', 'demo_cls_2', 'active'),
('demo_pr_2_6', 'demo_st_2_6', 'demo_cls_2', 'active'),
('demo_pr_2_7', 'demo_st_2_7', 'demo_cls_2', 'active'),
('demo_pr_2_8', 'demo_st_2_8', 'demo_cls_2', 'active');

-- Kelas 3
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_3_1', 'Santri 1 Kelas 3', '2501031', 'active'),
('demo_st_3_2', 'Santri 2 Kelas 3', '2501032', 'active'),
('demo_st_3_3', 'Santri 3 Kelas 3', '2501033', 'active'),
('demo_st_3_4', 'Santri 4 Kelas 3', '2501034', 'active'),
('demo_st_3_5', 'Santri 5 Kelas 3', '2501035', 'active'),
('demo_st_3_6', 'Santri 6 Kelas 3', '2501036', 'active'),
('demo_st_3_7', 'Santri 7 Kelas 3', '2501037', 'active'),
('demo_st_3_8', 'Santri 8 Kelas 3', '2501038', 'active');
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status) VALUES 
('demo_pr_3_1', 'demo_st_3_1', 'demo_cls_3', 'active'),
('demo_pr_3_2', 'demo_st_3_2', 'demo_cls_3', 'active'),
('demo_pr_3_3', 'demo_st_3_3', 'demo_cls_3', 'active'),
('demo_pr_3_4', 'demo_st_3_4', 'demo_cls_3', 'active'),
('demo_pr_3_5', 'demo_st_3_5', 'demo_cls_3', 'active'),
('demo_pr_3_6', 'demo_st_3_6', 'demo_cls_3', 'active'),
('demo_pr_3_7', 'demo_st_3_7', 'demo_cls_3', 'active'),
('demo_pr_3_8', 'demo_st_3_8', 'demo_cls_3', 'active');

-- Kelas 4
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_4_1', 'Santri 1 Kelas 4', '2501041', 'active'),
('demo_st_4_2', 'Santri 2 Kelas 4', '2501042', 'active'),
('demo_st_4_3', 'Santri 3 Kelas 4', '2501043', 'active'),
('demo_st_4_4', 'Santri 4 Kelas 4', '2501044', 'active'),
('demo_st_4_5', 'Santri 5 Kelas 4', '2501045', 'active'),
('demo_st_4_6', 'Santri 6 Kelas 4', '2501046', 'active'),
('demo_st_4_7', 'Santri 7 Kelas 4', '2501047', 'active'),
('demo_st_4_8', 'Santri 8 Kelas 4', '2501048', 'active');
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status) VALUES 
('demo_pr_4_1', 'demo_st_4_1', 'demo_cls_4', 'active'),
('demo_pr_4_2', 'demo_st_4_2', 'demo_cls_4', 'active'),
('demo_pr_4_3', 'demo_st_4_3', 'demo_cls_4', 'active'),
('demo_pr_4_4', 'demo_st_4_4', 'demo_cls_4', 'active'),
('demo_pr_4_5', 'demo_st_4_5', 'demo_cls_4', 'active'),
('demo_pr_4_6', 'demo_st_4_6', 'demo_cls_4', 'active'),
('demo_pr_4_7', 'demo_st_4_7', 'demo_cls_4', 'active'),
('demo_pr_4_8', 'demo_st_4_8', 'demo_cls_4', 'active');

-- Kelas 5
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_5_1', 'Santri 1 Kelas 5', '2501051', 'active'),
('demo_st_5_2', 'Santri 2 Kelas 5', '2501052', 'active'),
('demo_st_5_3', 'Santri 3 Kelas 5', '2501053', 'active'),
('demo_st_5_4', 'Santri 4 Kelas 5', '2501054', 'active'),
('demo_st_5_5', 'Santri 5 Kelas 5', '2501055', 'active'),
('demo_st_5_6', 'Santri 6 Kelas 5', '2501056', 'active'),
('demo_st_5_7', 'Santri 7 Kelas 5', '2501057', 'active'),
('demo_st_5_8', 'Santri 8 Kelas 5', '2501058', 'active');
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status) VALUES 
('demo_pr_5_1', 'demo_st_5_1', 'demo_cls_5', 'active'),
('demo_pr_5_2', 'demo_st_5_2', 'demo_cls_5', 'active'),
('demo_pr_5_3', 'demo_st_5_3', 'demo_cls_5', 'active'),
('demo_pr_5_4', 'demo_st_5_4', 'demo_cls_5', 'active'),
('demo_pr_5_5', 'demo_st_5_5', 'demo_cls_5', 'active'),
('demo_pr_5_6', 'demo_st_5_6', 'demo_cls_5', 'active'),
('demo_pr_5_7', 'demo_st_5_7', 'demo_cls_5', 'active'),
('demo_pr_5_8', 'demo_st_5_8', 'demo_cls_5', 'active');

-- Kelas 6
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_6_1', 'Santri 1 Kelas 6', '2501061', 'active'),
('demo_st_6_2', 'Santri 2 Kelas 6', '2501062', 'active'),
('demo_st_6_3', 'Santri 3 Kelas 6', '2501063', 'active'),
('demo_st_6_4', 'Santri 4 Kelas 6', '2501064', 'active'),
('demo_st_6_5', 'Santri 5 Kelas 6', '2501065', 'active'),
('demo_st_6_6', 'Santri 6 Kelas 6', '2501066', 'active'),
('demo_st_6_7', 'Santri 7 Kelas 6', '2501067', 'active'),
('demo_st_6_8', 'Santri 8 Kelas 6', '2501068', 'active');
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status) VALUES 
('demo_pr_6_1', 'demo_st_6_1', 'demo_cls_6', 'active'),
('demo_pr_6_2', 'demo_st_6_2', 'demo_cls_6', 'active'),
('demo_pr_6_3', 'demo_st_6_3', 'demo_cls_6', 'active'),
('demo_pr_6_4', 'demo_st_6_4', 'demo_cls_6', 'active'),
('demo_pr_6_5', 'demo_st_6_5', 'demo_cls_6', 'active'),
('demo_pr_6_6', 'demo_st_6_6', 'demo_cls_6', 'active'),
('demo_pr_6_7', 'demo_st_6_7', 'demo_cls_6', 'active'),
('demo_pr_6_8', 'demo_st_6_8', 'demo_cls_6', 'active');

-- Kelas 7
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_7_1', 'Santri 1 Kelas 7', '2501071', 'active'),
('demo_st_7_2', 'Santri 2 Kelas 7', '2501072', 'active'),
('demo_st_7_3', 'Santri 3 Kelas 7', '2501073', 'active'),
('demo_st_7_4', 'Santri 4 Kelas 7', '2501074', 'active'),
('demo_st_7_5', 'Santri 5 Kelas 7', '2501075', 'active'),
('demo_st_7_6', 'Santri 6 Kelas 7', '2501076', 'active'),
('demo_st_7_7', 'Santri 7 Kelas 7', '2501077', 'active'),
('demo_st_7_8', 'Santri 8 Kelas 7', '2501078', 'active');
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status) VALUES 
('demo_pr_7_1', 'demo_st_7_1', 'demo_cls_7', 'active'),
('demo_pr_7_2', 'demo_st_7_2', 'demo_cls_7', 'active'),
('demo_pr_7_3', 'demo_st_7_3', 'demo_cls_7', 'active'),
('demo_pr_7_4', 'demo_st_7_4', 'demo_cls_7', 'active'),
('demo_pr_7_5', 'demo_st_7_5', 'demo_cls_7', 'active'),
('demo_pr_7_6', 'demo_st_7_6', 'demo_cls_7', 'active'),
('demo_pr_7_7', 'demo_st_7_7', 'demo_cls_7', 'active'),
('demo_pr_7_8', 'demo_st_7_8', 'demo_cls_7', 'active');

-- Kelas 8
INSERT OR IGNORE INTO students (id, name, nis, status) VALUES 
('demo_st_8_1', 'Santri 1 Kelas 8', '2501081', 'active'),
('demo_st_8_2', 'Santri 2 Kelas 8', '2501082', 'active'),
('demo_st_8_3', 'Santri 3 Kelas 8', '2501083', 'active'),
('demo_st_8_4', 'Santri 4 Kelas 8', '2501084', 'active'),
('demo_st_8_5', 'Santri 5 Kelas 8', '2501085', 'active'),
('demo_st_8_6', 'Santri 6 Kelas 8', '2501086', 'active'),
('demo_st_8_7', 'Santri 7 Kelas 8', '2501087', 'active'),
('demo_st_8_8', 'Santri 8 Kelas 8', '2501088', 'active');
INSERT OR IGNORE INTO student_profiles (id, student_id, class_id, status) VALUES 
('demo_pr_8_1', 'demo_st_8_1', 'demo_cls_8', 'active'),
('demo_pr_8_2', 'demo_st_8_2', 'demo_cls_8', 'active'),
('demo_pr_8_3', 'demo_st_8_3', 'demo_cls_8', 'active'),
('demo_pr_8_4', 'demo_st_8_4', 'demo_cls_8', 'active'),
('demo_pr_8_5', 'demo_st_8_5', 'demo_cls_8', 'active'),
('demo_pr_8_6', 'demo_st_8_6', 'demo_cls_8', 'active'),
('demo_pr_8_7', 'demo_st_8_7', 'demo_cls_8', 'active'),
('demo_pr_8_8', 'demo_st_8_8', 'demo_cls_8', 'active');

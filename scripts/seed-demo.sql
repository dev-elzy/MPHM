-- MPHM Mock Data Seed File (Clean & Minimal)
-- Menggunakan kelas dan pengajar yang sudah ada di database produksi.
-- Tanpa menambahkan kelas Ula 1-A & Wustha 1-A, Ula 1-B & Wustha 2-A atau pengajar dummy baru.

-- 1. Bersihkan data demo kustom yang dibuat sebelumnya
DELETE FROM class_assignments WHERE id LIKE 'demo_%';
DELETE FROM score_sessions WHERE id LIKE 'demo_%';
DELETE FROM classes WHERE id LIKE 'demo_%';
DELETE FROM users WHERE id LIKE 'demo_%';
DELETE FROM student_profiles WHERE id LIKE 'demo_%';
DELETE FROM students WHERE id LIKE 'demo_%';

-- 2. Tautkan penugasan kelas yang sudah ada ke pengajar yang sudah ada (misal usr-wali-a, usr-wali-b, dst.)
-- Kita tidak menambahkan baris kelas baru, melainkan hanya menautkan relasi dan data pendukung.

-- Contoh: Menambahkan beberapa data santri baru ke kelas produksi yang sudah ada jika belum ada
-- Hubungkan data santri contoh ke ID Kelas produksi yang sudah ada di database Anda
-- (silakan sesuaikan atau jalankan D1 query ini untuk menghubungkan relasi antar data)

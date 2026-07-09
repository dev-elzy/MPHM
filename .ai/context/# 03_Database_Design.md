# 03_Database_Design.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : Database Design Specification (DDS)
>
> Version : 2.0
>
> Status : APPROVED

---

# 1. Tujuan

Dokumen ini mendefinisikan standar perancangan database yang menjadi fondasi seluruh sistem MPHM.

Seluruh struktur tabel, relasi, indeks, constraint, dan strategi penyimpanan data wajib mengikuti dokumen ini.

Database harus dirancang agar:

- Mudah dikembangkan.
- Mudah dipelihara.
- Aman.
- Konsisten.
- Mendukung perkembangan sistem selama bertahun-tahun.
- Tidak memerlukan perubahan struktur inti ketika fitur baru ditambahkan.

---

# 2. Technology

Database menggunakan:

- Cloudflare D1
- SQLite Engine
- Drizzle ORM
- Cloudflare Workers
- Cloudflare Cron Worker

---

# 3. Database Philosophy

Database MPHM dibangun menggunakan konsep **Academic Workspace**.

Artinya seluruh aktivitas akademik selalu berada di dalam satu Tahun Ajaran yang aktif.

```text
Academic Year
        │
        ▼
Academic Settings
        │
        ▼
Curriculum
        │
        ▼
Classes
        │
        ▼
Students
        │
        ▼
Academic Activities
```

Semua transaksi akademik selalu memiliki referensi terhadap Tahun Ajaran.

---

# 4. Database Principles

Seluruh desain database wajib mengikuti prinsip berikut.

- Third Normal Form (3NF)
- Type Safe
- Modular
- Scalable
- Reusable
- Audit Friendly
- Soft Delete
- Data Integrity
- High Performance

---

# 5. Naming Convention

## Table

Gunakan bentuk jamak.

Contoh:

```text
users
roles
students
subjects
curriculums
classes
scores
reports
```

---

## Primary Key

Seluruh tabel menggunakan.

```text
id
```

Tipe:

UUID

---

## Foreign Key

Format.

```text
academic_year_id

curriculum_id

class_id

student_id

subject_id

user_id

semester_id

role_id
```

---

## Timestamp

Minimal.

```text
created_at

updated_at
```

---

## Soft Delete

Minimal.

```text
deleted_at

deleted_by
```

---

# 6. Academic Workspace

Academic Year menjadi Root Entity.

```text
Academic Year

├── Academic Settings

├── Curriculum

├── Semesters

├── Classes

├── Students

├── Class Assignments

├── Score Sessions

├── Attendance

├── Akhlaq

├── Reports

└── Notifications
```

Semua data akademik berada di bawah Academic Year.

---

# 7. Master Data

Master Data bersifat global.

```text
roles

permissions

users

subjects

student_statuses

user_statuses

violation_types

settings
```

Master Data tidak menyimpan transaksi.

---

# 8. Academic Data

Academic Data bergantung pada Tahun Ajaran.

```text
academic_years

academic_settings

curriculums

curriculum_subjects

semesters

classes

students

class_assignments

score_sessions

scores

score_results

attendance

akhlaq

student_violations

reports
```

---

# 9. Academic Year

academic_years merupakan pusat seluruh Workspace Akademik.

Satu Tahun Ajaran memiliki.

- Semester
- Kurikulum
- Kelas
- Penugasan
- Siswi
- Nilai
- Raport

Status.

```text
Draft

↓

Published

↓

Active

↓

Archived
```

Hanya boleh terdapat satu Active.

---

# 10. Academic Settings

Gunakan tabel.

```text
academic_settings
```

Berfungsi sebagai pusat konfigurasi Tahun Ajaran.

Contoh data.

- Semester Aktif
- Deadline Input Nilai
- Deadline Finalisasi
- Auto Lock
- Auto Publish Raport
- Status Input
- Status Raport
- Dashboard Announcement

Seluruh Dashboard membaca konfigurasi dari tabel ini.

---

# 11. Curriculum

Setiap Tahun Ajaran memiliki satu atau lebih Kurikulum.

Contoh.

```text
2026/2027

↓

Kurikulum MPHM 2026
```

Clone Tahun Ajaran akan menyalin Kurikulum.

---

# 12. Subjects

subjects merupakan Master Mata Pelajaran.

Contoh.

- Nahwu
- Sharaf
- Fiqih
- Hadits
- Tafsir
- Mustholah

Tabel ini tidak menyimpan aturan penilaian.

---

# 13. Curriculum Subjects

Gunakan tabel.

```text
curriculum_subjects
```

Berfungsi menghubungkan.

```text
Curriculum

↓

Subject
```

Selain relasi.

Tabel ini menyimpan.

- Urutan Mata Pelajaran
- Nilai Maksimum
- Nilai Minimum
- Bobot
- Status
- Keterangan

Dengan demikian.

Setiap Kurikulum dapat memiliki aturan Mata Pelajaran yang berbeda.

---

# 14. Semester

Semester berada di bawah Academic Year.

Minimal.

- Semester I
- Semester II

Semester digunakan oleh seluruh transaksi akademik.

---

# 15. Classes

Setiap Kelas berada di bawah Academic Year.

Data.

- Nama
- Bagian
- Status

Kelas tidak menyimpan Mata Pelajaran secara langsung.

Kelas menggunakan Kurikulum.

---

# 16. Students

Setiap Siswi.

- berada pada satu Tahun Ajaran.
- berada pada satu Kelas.

Riwayat perpindahan kelas tidak mengubah data lama.

---

# 17. Class Assignments

Gunakan tabel.

```text
class_assignments
```

Berisi.

- Academic Year
- Class
- User
- Role
- Start Date
- End Date
- Status

Dengan demikian.

Riwayat penugasan Mustahiq tetap tersimpan.

---

# 18. Score Sessions

Input Nilai tidak langsung menuju tabel Scores.

Gunakan Session.

```text
Academic Year

↓

Semester

↓

Class

↓

Subject

↓

Score Session
```

Status.

```text
Draft

↓

Ready

↓

Final

↓

Locked
```

---

# 19. Scores

Scores hanya menyimpan data mentah.

Tidak menyimpan hasil perhitungan.

Kolom utama.

- Score Session
- Student
- Score Type
- Score
- Notes

Contoh Score Type.

- TAMRIN
- UJIAN

---

# 20. Score Results

Gunakan tabel terpisah.

```text
score_results
```

Berisi.

- Nilai Khos
- Nilai 'Am
- Predikat
- Ranking
- Kelulusan

Seluruh data dihitung Backend saat Finalisasi.

---

# 21. Attendance

Attendance dipisahkan dari Nilai.

Relasi.

```text
Academic Year

↓

Semester

↓

Class

↓

Student

↓

Attendance
```

---

# 22. Akhlaq

Akhlaq memiliki tabel sendiri.

Tidak digabung dengan Nilai Akademik.

---

# 23. Violation Types & Student Violations (Pelanggaran Santri)

Modul Pelanggaran Santri dipisahkan dari tabel Akhlaq dan Nilai Akademik.

Master jenis pelanggaran disimpan pada tabel:

```text
violation_types
```

Atribut utama:
- `id` (UUID, PK)
- `name` (TEXT)
- `category` (TEXT - Kerapian, Kedisiplinan, Adab, Ibadah, dll.)
- `severity_level` (TEXT - Ringan, Sedang, Berat)
- `points` (INTEGER, Opsional)
- `description` (TEXT)
- `is_active` (BOOLEAN, default true)

Pencatatan kejadian pelanggaran disimpan pada tabel:

```text
student_violations
```

Atribut utama:
- `id` (UUID, PK)
- `academic_year_id` (UUID, FK -> academic_years.id)
- `student_id` (UUID, FK -> students.id)
- `violation_type_id` (UUID, FK -> violation_types.id)
- `incident_date` (DATE)
- `incident_time` (TIME, Opsional)
- `location` (TEXT, Opsional)
- `description` (TEXT)
- `evidence_url` (TEXT, Opsional)
- `reported_by` (UUID, FK -> users.id)
- `status` (TEXT - Draft, Dilaporkan, Diproses, Selesai, Dibatalkan)

---

# 23. Reports

Raport dihasilkan ketika Finalisasi.

Raport disimpan.

Tidak dihitung ulang setiap kali dibuka.

---

# 24. Notifications

Gunakan tabel.

```text
notifications
```

Digunakan untuk.

- Dashboard
- Toast
- Reminder
- Deadline
- Announcement

---

# 25. Audit Logs

Seluruh aktivitas penting disimpan.

Minimal.

- User
- Modul
- Action
- Old Data
- New Data
- Timestamp
- IP Address
- User Agent

Audit Log bersifat immutable.

---

# 26. Import Histories

Seluruh Import dicatat.

Informasi.

- User
- Modul
- File
- Total Data
- Success
- Failed
- Error Detail

---

# 27. Export Histories

Seluruh Export dicatat.

Informasi.

- User
- Modul
- Format
- Filter
- Total Data
- Export Time

---

# 28. Recycle Bin

Recycle Bin tidak memiliki tabel sendiri.

Recycle Bin merupakan hasil query seluruh tabel yang memiliki.

```text
deleted_at IS NOT NULL
```

Retensi.

24 Jam.

Cloudflare Cron Worker menghapus data permanen.

---

# 29. Universal Columns

Seluruh tabel transaksi wajib memiliki.

```text
id

created_at

created_by

updated_at

updated_by

deleted_at

deleted_by
```

Dengan demikian seluruh histori dapat dilacak.

---

# 30. Indexing Strategy

Seluruh Foreign Key wajib memiliki Index.

Minimal.

```text
academic_year_id

semester_id

curriculum_id

class_id

student_id

subject_id

user_id

status

created_at

deleted_at
```

Gunakan Composite Index pada query yang sering digunakan.

Contoh.

```text
academic_year_id + semester_id

academic_year_id + class_id

class_id + student_id

score_session_id + student_id

curriculum_id + subject_id

academic_year_id + student_id (student_violations)

violation_type_id + status
```

---

# 31. Constraints

Gunakan.

- Primary Key
- Foreign Key
- Unique
- Check Constraint

Contoh.

Satu Tahun Ajaran hanya boleh memiliki satu Status Active.

Satu Mustahiq hanya boleh memiliki satu Assignment aktif pada satu Tahun Ajaran.

Satu Score Session hanya boleh Final satu kali.

---

# 32. Database Transactions

Operasi berikut WAJIB menggunakan Transaction.

- Import
- Bulk Update
- Bulk Delete
- Restore
- Clone Tahun Ajaran
- Generate Raport
- Finalisasi Nilai
- Unlock Finalisasi

---

# 33. Database Views

Gunakan View untuk Dashboard.

Contoh.

```text
vw_dashboard_admin

vw_dashboard_mustahiq

vw_progress_class

vw_progress_subject

vw_score_completion

vw_notification_summary
```

View hanya digunakan untuk Read Only.

---

# 34. Clone Academic Year

Clone Tahun Ajaran hanya menyalin struktur.

Yang disalin.

- Academic Settings
- Curriculum
- Curriculum Subjects
- Semester
- Classes
- Konfigurasi Dashboard

Yang tidak disalin.

- Students
- Scores
- Score Results
- Attendance
- Akhlaq
- Reports
- Audit Logs
- Notifications

---

# 35. Future Scalability

Database wajib mampu mendukung modul baru tanpa mengubah struktur inti.

Contoh.

- Hafalan
- Prestasi
- Pelanggaran
- Perizinan
- Keuangan
- Asrama
- Inventaris
- Surat Menyurat
- Kalender Akademik
- Pengumuman
- E-Learning

Seluruh modul baru wajib mengikuti struktur Academic Workspace.

---

# 36. Database Architecture Principles

MPHM menggunakan pendekatan **Academic Workspace Architecture**.

Seluruh transaksi akademik selalu berada di dalam Workspace Tahun Ajaran.

Seluruh perhitungan akademik dilakukan oleh Backend.

Database hanya menyimpan:

- Master Data
- Data Transaksi
- Data Finalisasi
- Audit
- Konfigurasi

Tidak diperbolehkan menyimpan data hasil perhitungan yang masih dapat dihitung ulang, kecuali data yang telah melalui proses Finalisasi.

Seluruh desain database harus mengutamakan:

- Scalability
- Maintainability
- Performance
- Data Integrity
- Security
- Long-Term Development
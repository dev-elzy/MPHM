# 11_ACADEMIC_ENTERPRISE_BLUEPRINT.md

> **Project:** MPHM (Madrasah Putri Hidayatul Mubtadi'at)  
> **Document:** Enterprise Academic, Rombel, Promotion Engine & Guardian Portal Blueprint  
> **Version:** 2.0 (APPROVED)  
> **Status:** OFFICIAL SINGLE SOURCE OF TRUTH  

---

## 1. Tujuan & Filosofi Arsitektur

Blueprint ini menjadi acuan teknis resmi implementasi **Modul Akademik, Rombongan Belajar (Rombel), Promotion Engine, dan Portal Wali Santri**.  
Seluruh struktur mengikuti prinsip **Person-Centric Enterprise Data Architecture**:
- Tidak ada duplikasi identitas fisik (`people`).
- Seluruh pergerakan santri antar kelas maupun perubahan status disimpan sebagai **riwayat historis abadi** (*append-only historical record*).
- Status penempatan kelas tidak pernah dihapus.

---

## 2. Prioritas Implementasi

### Phase 1 — Modul Akademik & Rombel
1. Master Tahun Ajaran (`academic_years`)
2. Master Semester, Jenjang, dan Tingkat (konstanta & master permanen)
3. Rombongan Belajar / Kelas (`academic_classes`)
4. Penugasan Wali Kelas / Mustahiq
5. Penempatan Santri & Batch Assignment (`class_enrollments`)
6. Promotion Engine (Mesin Kenaikan Kelas & Kelulusan)

### Phase 2 — Portal Wali Santri (Guardian Portal)
- Dibangun setelah fondasi akademik Phase 1 stabil.
- Akses bersifat **Read-Only** untuk memantau data anak asuh terdaftar.

---

## 3. Spesifikasi Skema Database Akademik

### 3.1 `academic_years`
Tabel master Tahun Ajaran:
- `id`: string (UUID / kode seperti `AY-2025-2026`)
- `name`: string (contoh: `2025/2026`)
- `status`: string (`ACTIVE` | `ARCHIVED` | `DRAFT`)
- `startDate`: string
- `endDate`: string

### 3.2 `academic_classes`
Tabel master Rombongan Belajar (Kelas):
- `id`: string (UUID)
- `academicYearId`: string (FK ke `academic_years.id`)
- `jenjangId`: string (`1`: I'dadiyyah, `2`: Ibtida'iyyah, `3`: Tsanawiyyah, `4`: Aliyyah)
- `tingkatId`: string (`I`, `II`, `III`, `IV`, `V`, `VI`)
- `className`: string (contoh: `Ibtidaiyyah II-A`)
- `classCode`: string (contoh: `IBT-2A-2526`)
- `mustahiqId`: string | null (FK ke `people.id`, Wali Kelas)
- `capacity`: number (default: 35)
- `status`: string (`ACTIVE` | `INACTIVE`)

### 3.3 `class_enrollments`
Tabel relasi penempatan santri dalam kelas (*Historical Record*):
- `id`: string (UUID)
- `academicYearId`: string (FK ke `academic_years.id`)
- `classId`: string (FK ke `academic_classes.id`)
- `studentProfileId`: string (FK ke `student_profiles.id`)
- `status`: string Enum permanen:
  - `ACTIVE`: Aktif di kelas ini
  - `PROMOTED`: Telah naik ke kelas berikutnya
  - `RETAINED`: Tinggal kelas
  - `TRANSFERRED`: Pindah kelas / mutasi internal
  - `BOYONG`: Keluar / boyong sebelum lulus
  - `GRADUATED`: Lulus dari tingkat akhir

---

## 4. Proses Bisnis Promotion Engine

Mesin Kenaikan Kelas dijalankan pada akhir Tahun Ajaran dengan alur kerja berikut:
1. **Pilih Sumber:** Tahun Ajaran Asal & Kelas Asal.
2. **Pilih Tujuan:** Tahun Ajaran Tujuan.
3. **Penentuan Keputusan per Santri:**
   - **Naik Kelas (`PROMOTED`)**: Pilih kelas tujuan di Tahun Ajaran baru.
   - **Tinggal Kelas (`RETAINED`)**: Pilih kelas di tingkat yang sama di Tahun Ajaran baru.
   - **Boyong (`BOYONG`)**: Tandai status akhir santri di kelas lama sebagai `BOYONG`.
   - **Lulus (`GRADUATED`)**: Tandai `GRADUATED` dan otomatis buatkan entri permanen pada `alumni_records`.
4. **Pembentukan Enrollment Baru:** Sistem membuat baris baru di `class_enrollments` untuk Tahun Ajaran tujuan dengan status awal `ACTIVE`.
5. **Arsip Historis:** Baris enrollment lama tetap tersimpan utuh dan tidak diubah/dihapus.

---

## 5. Spesifikasi Fitur Batch Assignment

Alur penempatan santri massal ke kelas baru:
- **Multi-Select Santri:** Memilih daftar santri yang belum memiliki kelas aktif pada Tahun Ajaran terpilih.
- **Pilih Kelas Tujuan:** Menampilkan kapasitas terisi vs batas kapasitas kelas (`capacity`).
- **Validasi Aturan:** Mencegah melebihi kapasitas dan mendeteksi duplikasi pendaftaran pada tahun ajaran yang sama.
- **Konfirmasi Modal:** Menampilkan ringkasan sebelum penyimpanan dilakukan.

---

## 6. Aturan Penugasan Mustahiq (Wali Kelas)

- Mustahiq dihubungkan langsung ke `people.id` (Person-Centric).
- **Aturan Tunggal:** Satu Mustahiq hanya boleh menjadi wali kelas pada **1 kelas aktif** dalam 1 Tahun Ajaran (kecuali terdapat pengecualian khusus oleh Administrator).

---

## 7. Portal Wali Santri (Guardian Portal - Read-Only 360°)

Akses eksklusif bagi orang tua / wali (`guardian_profiles` -> `student_profiles`):
- **Biodata & Kelas Saat Ini**
- **Grafik & Riwayat Nilai / Rapor**
- **Rekam Jejak Kehadiran (Absensi)**
- **Catatan Akhlaq & Kedisiplinan (Pelanggaran)**
- **Pengumuman Resmi Madrasah**
Seluruh tampilan bersifat *Read-Only* transparan.

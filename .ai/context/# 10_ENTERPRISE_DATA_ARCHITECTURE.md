# 10_ENTERPRISE_DATA_ARCHITECTURE.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : Enterprise Data Architecture (Person-Centric Core)
>
> Version : 1.0
>
> Status : APPROVED

---

# 1. Pendahuluan

Seiring berkembangnya MPHM dari sekadar Sistem Akademik menjadi **Enterprise Information System** dan **Pusat Data Abadi**, arsitektur database membutuhkan fondasi yang mampu menangani perjalanan hidup seseorang di lembaga selama puluhan tahun tanpa duplikasi data.

Dokumen ini mendefinisikan standar **Person-Centric Enterprise Data Architecture** sebagai acuan tunggal seluruh perancangan skema database dan layanan backend MPHM.

---

# 2. Arsitektur Inti: Person-Centric Core

Satu prinsip utama sistem MPHM:
> **Setiap individu hanya memiliki SATU IDENTITAS UTAMA (`people`), sedangkan perannya (`student`, `teacher`, `guardian`, `organization_member`, `alumni`) adalah PROFIL yang dapat bertambah seiring waktu.**

```text
                        people (Identitas Tunggal / Core Person)
                                          │
        ┌───────────────────┬─────────────┴──────┬────────────────────────┬───────────────────────┐
        ▼                   ▼                    ▼                        ▼                       ▼
 student_profiles    teacher_profiles     guardian_profiles    organization_memberships    alumni_records
 (Santri Aktif)      (Mustahiq/Munawib)   (Wali Santri)        (Pengurus Organisasi)       (Status Khidmah/Ijazah)
        │                   │                                             │                       │
        ▼                   ▼                                             ▼                       ▼
  Academic History     Teaching History                             Jabatan P3HM/MPHM        Qodho' & Ijazah
  Disciplinary Log     Schedule Assignment                          Periode Masa Khidmah
```

Contoh kasus riwayat hidup **Fatimah**:
1. Tahun 2020: Masuk sebagai **Santri** (`student_profiles` -> `people.id`).
2. Tahun 2026: Lulus dan menjadi **Alumni** (`alumni_records` -> `student_profiles.id`).
3. Tahun 2027: Mengabdi sebagai **Mustahiq / Wali Kelas** (`teacher_profiles` -> `people.id`).
4. Tahun 2028: Menjadi **Pengurus MPHM** (`organization_memberships` -> `people.id`).

Dalam seluruh fase di atas, identitas dasar Fatimah (Nama, Tempat/Tanggal Lahir, Alamat, Kontak) **hanya disimpan satu kali** pada tabel `people`.

---

# 3. Spesifikasi Skema Core (`people`)

Tabel `people` menjadi induk dari seluruh profil manusia di dalam sistem:

- `id` (UUID PK)
- `nik` (TEXT - Nomor Induk Kependudukan, Opsional/Unique)
- `fullName` (TEXT NOT NULL)
- `gender` (TEXT - `P` | `L`)
- `birthPlace` (TEXT)
- `birthDate` (TEXT - YYYY-MM-DD)
- `phone` (TEXT)
- `address` (TEXT)
- `email` (TEXT)
- `photoUrl` (TEXT)
- Universal Audit Columns (`createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `deletedAt`, `deletedBy`)

---

# 4. Profil & Peran (Profiles & Memberships)

## 4.1 Student Profiles (`student_profiles`)
Menghubungkan `people.id` dengan identitas kesantrian:
- `id` (UUID PK)
- `personId` (UUID FK -> `people.id`)
- `nis` (TEXT UNIQUE)
- `nisn` (TEXT UNIQUE)
- `entryYear` (TEXT)
- `status` (`active` | `cuti` | `boyong` | `alumni`)

## 4.2 Teacher Profiles (`teacher_profiles`)
Menyimpan peran pengajar tanpa membuat tabel identitas terpisah:
- `id` (UUID PK)
- `personId` (UUID FK -> `people.id`)
- `nip` / `kodePengajar` (TEXT UNIQUE)
- `teacherType` (`mustahiq` | `munawib` | `umum`)
- `status` (`active` | `inactive`)

## 4.3 Guardian Profiles (`guardian_profiles` & `student_guardians`)
Menyimpan peran wali santri:
- `id` (UUID PK)
- `personId` (UUID FK -> `people.id`)
- `relationship` (`Ayah` | `Ibu` | `Wali`)
- `occupation` (TEXT)

## 4.4 Organization Memberships (`organization_memberships`)
*Catatan: Sistem MPHM tidak menggunakan istilah "Staff", melainkan Pengurus / Dewan Harian / Organisasi.*
- `id` (UUID PK)
- `personId` (UUID FK -> `people.id`)
- `organization` (`P3HM` | `MPHM` | `M3PHM` atau organisasi resmi lainnya)
- `position` (TEXT - Jabatan, misal: Ketua, Sekretaris, Bendahara, Keamanan)
- `periodStartYear` (TEXT)
- `periodEndYear` (TEXT)
- `status` (`active` | `completed`)

## 4.5 Alumni Records (`alumni_records`)
Alumni bukan individu baru, melainkan ekstensi dari profil santri yang telah menyelesaikan pendidikan:
- `id` (UUID PK)
- `studentProfileId` (UUID FK -> `student_profiles.id`)
- `graduationYearId` (UUID FK -> `academic_years.id`)
- `khidmahStatus` (`selesai_khidmah` | `tidak_khidmah` | `qodho_khidmah`)
- `khidmahLocation` (TEXT - Tempat penempatan khidmah)
- `khidmahNotes` (TEXT - Keterangan Qodho' / Catatan pengabdian)
- `ijazahStatus` (`belum_bisa_diambil` | `sudah_diambil`)
- `ijazahTakenAt` (TIMESTAMP)

---

# 5. Arsitektur Dinamis Modul Pelanggaran Santri

Agar Master Pelanggaran fleksibel dan dapat diperluas tanpa migrasi skema database, perancangan menggunakan 3 lapis master:

```text
Master Kategori Pelanggaran (violation_categories)
        │
        ▼
Master Severity Pelanggaran (violation_severities)
        │
        ▼
Master Jenis Pelanggaran (violation_types)
        │
        ▼
Laporan Kejadian Pelanggaran (student_violations)
```

1. **`violation_categories`**: Master Kategori dinamis (Admin dapat menambah kategori seperti: *Kerapian*, *Kedisiplinan*, *Adab*, *Ibadah*, *Administrasi*, *Perizinan*, *Kebersihan*, *Asrama*, *Keamanan*). Atribut: `name`, `color`, `icon`, `isActive`.
2. **`violation_severities`**: Master Tingkat Keparahan dinamis (`name`: Ringan/Sedang/Berat/Sangat Berat, `levelWeight`, `badgeColor`, `isActive`).
3. **`violation_types`**: Master Jenis Pelanggaran (`categoryId`, `severityId`, `name`, `defaultPoints`, `description`, `isActive`).
4. **`student_violations`**: Catatan insiden pelanggaran santri (`academicYearId`, `studentId`, `violationTypeId`, `incidentDate`, `incidentTime`, `location`, `description`, `evidenceUrl`, `reportedBy`, `status`).

---

# 6. Global Search Command Palette (`CTRL + K`)

Seluruh entitas dalam arsitektur Person-Centric dapat dicari secara cepat dari manapun melalui **Command Palette (`CTRL + K`)**:
- Pencarian multi-kategori instan
- Menampilkan Badge status (`Santri`, `Alumni`, `Pengajar`, `Pengurus`, `Wali Santri`)
- Langsung membuka halaman **Profil Terpadu 360°**

---

# 7. Profil Terpadu 360° (`Person 360° Profile`)

Setiap `people.id` memiliki satu halaman profil komprehensif yang menampilkan seluruh tab riwayat:
1. **Identitas & Biodata Lengkap**
2. **Riwayat Akademik & Kelas**
3. **Riwayat Absensi**
4. **Riwayat Nilai**
5. **Riwayat Akhlaq**
6. **Riwayat Pelanggaran & Kedisiplinan**
7. **Status Khidmah Alumni**
8. **Status Pengambilan Ijazah**
9. **Riwayat Kepengurusan Organisasi (P3HM/MPHM/M3PHM)**
10. **Audit Timeline & Histori Sistem**

Arsitektur ini menjadikan MPHM sebagai pusat dokumentasi keumatan yang abadi, rapi, dan siap berkembang dalam skala enterprise.

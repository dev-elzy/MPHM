# Blueprint Modul Kelas, Jenjang, Tingkat & Bagian

## MPHM Academic Domain Specification

**Versi:** 1.0

**Status:** Final

**Berlaku Untuk:** Seluruh Modul Akademik

---

# 1. Tujuan

Dokumen ini mendefinisikan struktur akademik resmi Madrasah Putri Hidayatul Mubtadi'at (MPHM).

Blueprint ini menjadi acuan tunggal (Single Source of Truth) bagi seluruh modul akademik sehingga tidak terjadi inkonsistensi struktur data.

Seluruh modul berikut wajib mengikuti blueprint ini:

- Academic Workspace

- Kelas

- Siswi

- Kurikulum

- Mata Pelajaran

- Jadwal

- Absensi

- Penilaian

- Raport

- Pelanggaran Santri

- Alumni

---

# 2. Hierarki Akademik

Struktur akademik MPHM terdiri dari hierarki berikut.

```

Tahun Ajaran

    │

    ▼

Semester

    │

    ▼

Jenjang

    │

    ▼

Tingkat

    │

    ▼

Bagian / Kelas

    │

    ▼

Siswi

```

Seluruh data akademik berada di bawah Tahun Ajaran.

---

# 3. Jenjang (Master Data)

Jenjang merupakan data permanen.

Tidak memiliki proses CRUD.

Tidak dapat dihapus.

Tidak dapat ditambah melalui aplikasi.

Daftar Jenjang:

| ID | Jenjang |

|----|----------|

| 1 | I'dadiyyah |

| 2 | Ibtida'iyyah |

| 3 | Tsanawiyyah |

| 4 | Aliyyah |

Implementasi disarankan menggunakan:

- Constant

- Enum

- Configuration

bukan tabel database dinamis.

---

# 4. Tingkat (Master Data)

Setiap Jenjang memiliki Tingkat yang tetap.

## 4.1 I'dadiyyah

- I

- II

- III

---

## 4.2 Ibtida'iyyah

- I

- II

- III

- IV

- V

- VI

---

## 4.3 Tsanawiyyah

- I

- II

- III

---

## 4.4 Aliyyah

- I

- II

- III

Total Tingkat:

- I'dadiyyah : 3

- Ibtida'iyyah : 6

- Tsanawiyyah : 3

- Aliyyah : 3

---

# 5. Bagian (Kelas)

Bagian merupakan kelas nyata tempat siswi belajar.

Contoh:

I'dadiyyah I-A

I'dadiyyah I-B

I'dadiyyah II-A

Ibtida'iyyah IV-C

Aliyyah III-B

dst.

Bagian bersifat dinamis.

Administrator cukup mengetik nama bagian.

Contoh:

A

B

C

D

E

F

G

...

AA

AB

AC

dst.

Tidak ada batas jumlah bagian.

---

# 6. Identitas Kelas

Satu kelas dibentuk oleh kombinasi berikut:

- Tahun Ajaran

- Semester

- Jenjang

- Tingkat

- Bagian

Contoh:

2026/2027

Semester Ganjil

Ibtida'iyyah

III

B

menjadi

Ibtida'iyyah III-B

Tahun Ajaran 2026/2027

---

# 7. Relasi Domain

Setiap Kelas memiliki:

- satu Tahun Ajaran

- satu Semester aktif

- satu Jenjang

- satu Tingkat

- satu Bagian

- satu Kurikulum

- satu Wali Kelas aktif

- banyak Siswi

---

# 8. Relasi Wali Kelas

Wali kelas menggunakan Assignment.

Bukan atribut tetap pada tabel kelas.

```

Class

    │

    ▼

Class Assignment

    │

    ▼

Mustahiq

```

Keuntungan:

- histori pergantian wali kelas tersimpan

- tidak kehilangan data

- mendukung audit

---

# 9. Relasi Kurikulum

Satu kelas menggunakan satu kurikulum.

Kurikulum menentukan:

- Mata Pelajaran

- Beban Belajar

- Struktur Penilaian

Mata pelajaran tidak dihubungkan langsung ke kelas.

Hubungan:

```

Kurikulum

      │

      ▼

Daftar Mata Pelajaran

      │

      ▼

Kelas

```

---

# 10. Relasi Siswi

Satu Siswi hanya boleh berada pada satu kelas dalam satu Tahun Ajaran.

Ketika naik kelas:

Tidak mengubah data lama.

Sistem membuat relasi baru pada Tahun Ajaran berikutnya.

---

# 11. Business Rules

## CL-01

Kelas wajib memiliki Tahun Ajaran.

---

## CL-02

Kelas wajib memiliki Semester.

---

## CL-03

Kelas wajib memiliki Jenjang.

---

## CL-04

Kelas wajib memiliki Tingkat.

---

## CL-05

Kelas wajib memiliki Bagian.

---

## CL-06

Satu kelas hanya memiliki satu wali kelas aktif.

---

## CL-07

Satu Mustahiq tidak boleh menjadi wali kelas aktif pada lebih dari satu kelas dalam Tahun Ajaran yang sama.

---

## CL-08

Satu kelas hanya menggunakan satu kurikulum.

---

## CL-09

Penghapusan kelas menggunakan Soft Delete.

---

## CL-10

Clone Tahun Ajaran hanya menyalin:

- struktur kelas

- assignment wali kelas (opsional sesuai kebijakan)

Tidak menyalin:

- siswi

- absensi

- nilai

- jadwal

- raport

---

# 12. UI Requirement

Halaman Kelas minimal menampilkan:

- Nama Kelas

- Jenjang

- Tingkat

- Bagian

- Tahun Ajaran

- Semester

- Kurikulum

- Wali Kelas

- Jumlah Siswi

- Status

Menggunakan komponen:

- PageHeader

- DataTable

- StatusBadge

- EmptyState

- ConfirmDialog

- TableSkeleton

---

# 13. Backend Ready Architecture

UI

↓

React Hook Form

↓

Zod

↓

TanStack Query

↓

Mutation / Query Hooks

↓

Service Layer

↓

REST API / GraphQL

Mock Service hanya berada pada Service Layer.

UI tidak boleh mengakses data dummy secara langsung.

---

# 14. Future Modules

Blueprint ini menjadi dasar implementasi:

- Modul Siswi

- Modul Kurikulum

- Modul Mata Pelajaran

- Modul Jadwal

- Modul Absensi

- Modul Penilaian

- Modul Raport

- Modul Alumni

Seluruh modul wajib mengikuti struktur akademik yang didefinisikan pada dokumen ini.

---

# Status Dokumen

**Status:** Final

Dokumen ini menjadi referensi utama (Single Source of Truth) untuk seluruh pengembangan domain akademik MPHM.

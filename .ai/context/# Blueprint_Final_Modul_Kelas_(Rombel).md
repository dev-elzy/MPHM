modul Kelas (Rombel) merupakan pusat operasional akademik setelah Tahun Ajaran dan Semester aktif ditentukan.

Modul ini menjadi penghubung antara Tahun Ajaran, Semester, Santri, Mustahiq, Kurikulum, Jadwal, Absensi, dan Nilai.

1. Posisi Modul dalam Academic Workspace

Urutan hirarki akademik MPHM adalah:

Academic Year
│
├── Semester
│ │
│ └── Kelas (Rombel)
│ │
│ ├── Wali Kelas (Mustahiq)
│ ├── Santri
│ ├── Kurikulum
│ ├── Jadwal
│ ├── Absensi
│ └── Nilai

Artinya:

Tahun Ajaran menentukan periode akademik.
Semester menentukan periode operasional.
Kelas merupakan workspace utama seluruh aktivitas akademik. 2. Struktur Identitas Kelas

Identitas kelas tidak diketik bebas.

Identitas dibentuk otomatis dari tiga komponen.

A. Jenjang (Master Permanen)
I'dadiyyah
Ibtida'iyyah
Tsanawiyyah
Aliyyah

Master ini bersifat permanen.

Tidak dapat ditambah ataupun dihapus melalui UI.

B. Tingkat (Master Permanen)

Setiap jenjang memiliki tingkatan tetap.

I'dadiyyah
I
II
III
Ibtida'iyyah
I
II
III
IV
V
VI
Tsanawiyyah
I
II
III
Aliyyah
I
II
III

Dropdown Tingkat akan berubah otomatis mengikuti Jenjang yang dipilih.

C. Bagian

Bagian merupakan input dinamis.

Contoh:

A
B
C
D
E
F

Tidak dibatasi jumlahnya.

Administrator cukup mengetik:

A

atau

B

atau

Unggulan

atau

Tahfidz

Sistem hanya memastikan tidak ada duplikasi pada kombinasi yang sama.

3. Identitas Kelas

Nama kelas dihasilkan otomatis.

Formula:

Nama Kelas

=

Jenjang

- Tingkat
- Bagian

Contoh:

Ibtida'iyyah III-A

I'dadiyyah II-B

Aliyyah I-Tahfidz

Field ini read-only.

Administrator tidak mengubahnya secara manual.

4. Entity Relationship
   Academic Year
   │
   ├──────────────┐
   │ │
   ▼ ▼
   Semester Curriculum
   │
   ▼
   Class
   │
   ┌────┼──────────────┐
   │ │ │
   ▼ ▼ ▼
   Teacher Student Schedule
   │
   ▼
   Attendance
   │
   ▼
   Assessment
5. Struktur Entity Class
   Class

id

academicYearId

semesterId

curriculumId

jenjang

tingkat

bagian

name

status

createdAt

updatedAt

deletedAt 6. Business Rules
CL-01

Kelas wajib memiliki:

Tahun Ajaran
Semester

Tidak boleh berdiri sendiri.

CL-02

Data kelas selalu mengikuti Tahun Ajaran dan Semester yang sedang dipilih.

CL-03

Nama kelas dibentuk otomatis.

Administrator hanya memilih:

Jenjang
Tingkat

serta mengisi:

Bagian
CL-04

Tidak boleh terdapat dua kelas dengan identitas yang sama pada Semester yang sama.

Contoh:

Ibtida'iyyah III-A

Semester Ganjil

2026/2027

hanya boleh satu.

CL-05

Satu kelas hanya memiliki satu wali kelas aktif.

CL-06

Seorang Mustahiq hanya boleh menjadi wali kelas satu kelas pada Tahun Ajaran yang sama.

CL-07

Kurikulum ditentukan pada level kelas.

Mata pelajaran mengikuti kurikulum tersebut.

CL-08

Penghapusan menggunakan Soft Delete.

Data:

Nilai
Absensi
Jadwal

tetap aman.

CL-09

Saat Clone Tahun Ajaran:

yang ikut disalin:

struktur kelas
kurikulum
assignment wali kelas (opsional sesuai kebijakan)

yang tidak ikut disalin:

santri
absensi
nilai
jurnal
pelanggaran 7. UI/UX Flow
Toolbar
Page Header

↓

Year Selector

↓

Semester Selector

↓

Filter Jenjang

↓

Search

↓

Tambah Kelas
DataTable

Kolom:

Nama Kelas

Jenjang

Tingkat

Bagian

Wali Kelas

Kurikulum

Jumlah Santri

Status

Aksi
Form Tambah Kelas

Urutan input:

Jenjang

↓

Tingkat

↓

Bagian

↓

Preview Nama

↓

Kurikulum

↓

Mustahiq

↓

Simpan

Preview selalu berubah realtime.

Misal:

Nama Kelas

Ibtida'iyyah IV-B 8. Mock Service

Sementara backend belum tersedia.

Akan dibuat tiga service.

classes.service.ts

mustahiq.service.ts

curriculum.service.ts

Seluruh UI hanya berkomunikasi melalui Service Layer.

Ketika backend selesai, cukup mengganti implementasi service tanpa mengubah UI.

9. Struktur Feature
   src/features/classes/

components/
ClassTable.tsx
ClassFormDialog.tsx
ClassDetailDrawer.tsx
AssignMustahiqDialog.tsx

queries/
useClasses.ts
useMustahiqLookup.ts
useCurriculumLookup.ts

mutations/
useClassMutations.ts

services/
classes.service.ts
mustahiq.service.ts
curriculum.service.ts

schemas/
index.ts

types/
index.ts 10. Backend Readiness

Service dirancang sebagai Swap Point.

UI

↓

TanStack Query

↓

Mutation Hook

↓

Service Layer

↓

Mock

↓

Backend REST API

Saat backend tersedia:

Mock

↓

fetch()

↓

REST API

Tidak diperlukan perubahan pada UI maupun hooks.

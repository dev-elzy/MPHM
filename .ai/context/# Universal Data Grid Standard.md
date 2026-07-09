# Universal Data Grid Standard

> Version : 1.0
>
> Status : APPROVED

---

## Tujuan

Seluruh halaman yang memiliki data berbentuk tabel **WAJIB** menggunakan standar komponen Data Grid yang sama agar pengalaman pengguna konsisten di seluruh aplikasi.

Standar ini berlaku untuk seluruh modul tanpa pengecualian.

Contoh:

- Tahun Ajaran
- Semester
- Kelas
- Mata Pelajaran
- Siswi
- Users
- Roles
- Nilai
- Absensi
- Akhlaq
- Raport
- Audit Log
- Recycle Bin
- dan seluruh modul baru di masa mendatang.

---

# Standar Layout

Urutan komponen Data Grid wajib mengikuti susunan berikut.

```text
Page Header

↓

Toolbar

↓

Filter Panel

↓

Data Table

↓

Pagination
```

---

# Toolbar

Toolbar wajib berada di bagian atas tabel.

Komponen yang tersedia:

```text
🔍 Search

Filter

Columns

Import

Export

Refresh

+ Tambah Data
```

Urutan tombol tidak boleh diubah agar seluruh halaman memiliki pengalaman yang konsisten.

---

# Search

Search bersifat realtime.

Karakteristik:

- Tidak menggunakan tombol Search.
- Menggunakan debounce.
- Pencarian dilakukan secara langsung.
- Mendukung pencarian beberapa kolom sekaligus.

---

# Filter

Seluruh tabel wajib memiliki Filter.

Filter menyesuaikan modul.

Contoh:

Siswi

- Tahun Ajaran
- Semester
- Kelas
- Status

Mata Pelajaran

- Tahun Ajaran
- Semester
- Kelas
- Status

Users

- Role
- Status

Nilai

- Tahun Ajaran
- Semester
- Kelas
- Mata Pelajaran
- Status

---

# Column Manager

Setiap tabel wajib memiliki pengaturan kolom.

Fitur:

- Show Column
- Hide Column
- Resize Column
- Reorder Column
- Pin Left
- Pin Right

Preferensi pengguna disimpan agar tetap digunakan saat login berikutnya.

---

# Import

Seluruh modul yang menerima input data wajib memiliki tombol Import.

Menu Import terdiri dari:

```text
Import

▼

Download Template

Import Data

Import History
```

---

# Download Template

Template Import dibuat otomatis oleh sistem.

Format file:

- Microsoft Excel (.xlsx)

Template wajib memiliki dua Sheet.

```text
Petunjuk

Data
```

---

## Sheet Petunjuk

Berisi:

- Penjelasan fungsi setiap kolom.
- Aturan pengisian.
- Contoh data.
- Format tanggal.
- Nilai yang diperbolehkan.
- Kolom yang wajib diisi.
- Kolom yang bersifat opsional.

Sheet ini bersifat Read Only.

---

## Sheet Data

Berisi tabel yang akan diisi pengguna.

Header tabel wajib:

- Freeze Header
- Bold
- Background berbeda
- Tidak dapat diedit
- Tidak dapat dipindahkan

---

# Tooltip Header

Setiap Header Kolom wajib memiliki komentar (Comment/Note).

Saat pengguna mengarahkan mouse ke Header, akan muncul informasi mengenai kolom tersebut.

Contoh:

Nama Siswi

↓

"Masukkan nama lengkap sesuai data administrasi."

Tanggal Lahir

↓

"Format: DD-MM-YYYY"

Status

↓

"Pilihan: Aktif, Alumni, Keluar"

Seluruh komentar dibuat otomatis oleh sistem.

---

# Import Validation

Import tidak boleh langsung menyimpan data ke database.

Alur Import wajib sebagai berikut.

```text
Upload File

↓

Preview

↓

Validation

↓

Error Checking

↓

Confirmation

↓

Import Database
```

---

# Validation Result

Setelah proses validasi selesai, sistem menampilkan:

- Total Data
- Data Valid
- Data Error
- Data Duplikat
- Data Baru
- Data Akan Diupdate

Contoh:

```text
Total Data

250

──────────────

Valid

240

──────────────

Error

10
```

---

# Error Detail

Jika terdapat kesalahan.

Sistem harus menampilkan:

- Nomor Baris
- Nama Kolom
- Nilai
- Penyebab Kesalahan
- Solusi

Contoh:

```text
Baris 18

Kolom

Tanggal Lahir

Error

Format Salah

Harus

DD-MM-YYYY
```

---

# Import Confirmation

Data baru akan disimpan setelah pengguna menekan tombol:

```text
Import Data
```

Tidak ada proses import otomatis.

---

# Import History

Setiap proses Import wajib dicatat.

Informasi yang disimpan:

- Waktu Import
- User
- Modul
- Jumlah Data
- Berhasil
- Gagal
- Detail Error

Admin dapat melihat seluruh riwayat Import.

---

# Export

Seluruh tabel wajib memiliki tombol Export.

Menu:

```text
Export

▼

Excel

CSV

PDF
```

Data yang diekspor mengikuti Filter yang sedang aktif.

---

# Refresh

Refresh hanya memuat ulang data.

Tidak me-refresh seluruh halaman.

Menggunakan mekanisme invalidate cache.

---

# Sorting

Seluruh kolom mendukung Sorting.

Mode:

- Ascending
- Descending

---

# Pagination

Pilihan jumlah data.

- 10
- 25
- 50
- 100
- 250
- 500

---

# Bulk Selection

Setiap tabel wajib mendukung Multi Selection.

Ketika terdapat data yang dipilih.

Toolbar berubah menjadi Bulk Toolbar.

Contoh:

```text
12 Data Dipilih

Restore

Export

Pindahkan ke Trash

Ubah Status
```

---

# Bulk Action

Bulk Action mengikuti modul.

Contoh:

Siswi

- Ubah Status
- Pindahkan Kelas
- Export
- Trash

Users

- Ubah Role
- Reset Password
- Nonaktifkan
- Trash

---

# Recycle Bin

Seluruh modul wajib menggunakan Recycle Bin.

Data tidak langsung dihapus.

Alur:

```text
Active

↓

Trash

↓

24 Jam

↓

Permanent Delete
```

Selama berada di Trash.

Data dapat:

- Restore
- Delete Permanently

---

# Empty State

Apabila tabel tidak memiliki data.

Sistem wajib menampilkan Empty State yang informatif.

Tidak boleh hanya menampilkan tabel kosong.

---

# Loading State

Loading menggunakan Skeleton.

Tidak menggunakan Spinner penuh halaman.

---

# Error State

Apabila terjadi kesalahan.

Sistem menampilkan:

- Penyebab
- Solusi
- Tombol Refresh

---

# Responsive

Desktop

Menggunakan Data Grid penuh.

Tablet

Column Collapse.

Mobile

Card View.

Tidak menggunakan Horizontal Scroll sebagai solusi utama.

---

# Accessibility

Data Grid wajib mendukung:

- Keyboard Navigation
- Screen Reader
- Focus Indicator
- Shortcut Keyboard

---

# Performance

Seluruh Data Grid wajib menggunakan:

- Server Side Pagination
- Server Side Filtering
- Server Side Sorting
- Virtual Rendering (untuk data besar)
- Lazy Loading
- Cache

---

# Cell Formatting & Ultra-Modern Table Visual Standard (AdminHMD Model)

Seluruh tampilan tabel dan sel data **WAJIB** bernuansa modern, profesional, dan elegan (berkarakter Enterprise SaaS), tidak boleh kaku atau bergaya klasik tradisional.

1. **Identity Cell Pattern (Kolom Entitas Orang)**:
   Setiap data pengguna/santri/pengajar/staff wajib di-render dengan kombinasi:
   - **Avatar / Inisial Bundar** (`rounded-full`) dengan latar lembut (`bg-primary/10`)
   - **Nama Utama Tebal (`font-semibold text-sm`)**
   - **Sub-info / Email / NIP (`text-xs text-zinc-400`)** tepat di bawah nama

2. **Status & Role Pill Badges**:
   Seluruh status akun maupun role wajib menggunakan *pill badge (`rounded-full`)* berspasi rapi dengan warna semantik modern (Hijau `Active`, Kuning/Amber `Pending`, Abu-abu/Merah `Suspended`).

3. **Row Action Pill Button**:
   Tombol aksi per baris menggunakan desain *pill outline / light button (`rounded-full`)* seperti tombol `Lihat / Edit` agar tabel tampak bersih dan berkelas.

---

# Prinsip

Universal Data Grid merupakan standar antarmuka utama dalam sistem MPHM.

Seluruh modul wajib menggunakan komponen Data Grid yang sama agar pengalaman pengguna konsisten, pengembangan lebih cepat, dan proses pemeliharaan sistem menjadi lebih mudah.
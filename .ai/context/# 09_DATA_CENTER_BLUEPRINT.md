> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : Data Center Blueprint
>
> Version : 1.0
>
> Status : Draft

---

# 1. Pendahuluan

MPHM tidak hanya dibangun sebagai sistem akademik, tetapi juga sebagai **Pusat Data** yang menyimpan seluruh riwayat warga MPHM secara permanen.

Setiap orang yang pernah menjadi bagian dari MPHM tetap memiliki data di dalam sistem meskipun sudah tidak aktif.

Data tidak dihapus, melainkan berubah status dan disimpan sebagai arsip historis.

---

# 2. Tujuan

Pusat Data dibuat untuk:

- Menyimpan seluruh data secara permanen.
- Menghindari duplikasi data.
- Menyimpan seluruh perjalanan seseorang selama berada di MPHM.
- Memudahkan pencarian data.
- Menjadi sumber data utama (Single Source of Truth).
- Menjadi dasar seluruh modul akademik.

---

# 3. Konsep Pusat Data

Seluruh data utama berada pada satu kelompok menu bernama **Pusat Data**.

```text
Pusat Data
│
├── Santri
├── Pengajar
├── Pengurus
├── Wali Santri
└── Pencarian Database
```

Seluruh modul akademik mengambil data dari Pusat Data.

---

# 4. Prinsip Penyimpanan Data

MPHM menggunakan prinsip:

> Sekali data dibuat, data akan tetap tersimpan.

Data tidak dihapus karena:

- Lulus
- Boyong
- Cuti
- Selesai Mengajar
- Selesai Menjabat

Yang berubah hanyalah status dan riwayatnya.

---

# 5. Database Santri

Database Santri merupakan pusat seluruh data santri.

## Identitas

- NIS
- NISN
- Nama
- Tempat Lahir
- Tanggal Lahir
- Nama Wali
- Alamat
- Nomor HP
- Tahun Masuk
- Tahun Keluar
- Status

Status:

- Aktif
- Cuti
- Boyong
- Alumni

---

## Riwayat Santri

Setiap santri memiliki histori lengkap.

Meliputi:

- Riwayat Jenjang
- Riwayat Tingkat
- Riwayat Kelas
- Riwayat Nilai
- Riwayat Absensi
- Riwayat Akhlaq
- Riwayat Pelanggaran
- Riwayat Promosi
- Riwayat Kamar

Semua histori disimpan permanen.

---

# 6. Database Alumni

Alumni bukan data baru.

Alumni merupakan kelanjutan dari data santri.

Saat status berubah menjadi Alumni, seluruh data santri tetap dipertahankan.

Kemudian sistem menambahkan informasi alumni.

## Informasi Alumni

- Status Khidmah
- Penempatan Khidmah
- Alasan Tidak Khidmah
- Keterangan Qodho' Khidmah
- Status Pengambilan Ijazah
- Tanggal Pengambilan Ijazah
- Keterangan

---

## Status Khidmah

- Selesai Khidmah
- Tidak Khidmah
- Qodho' Khidmah

---

## Status Pengambilan Ijazah

- Belum Bisa Diambil
- Sudah Diambil

---

# 7. Database Pengajar

Database Pengajar menyimpan seluruh data pengajar yang pernah mengajar di MPHM.

Data tetap disimpan walaupun pengajar sudah tidak aktif.

## Identitas

- Nama
- Tempat Lahir
- Tanggal Lahir
- Nama Wali
- Alamat
- Nomor HP

---

## Riwayat Mengajar

- Tahun Mulai Mengajar
- Tahun Selesai Mengajar
- Mata Pelajaran
- Jenjang
- Tingkat
- Kelas

---

## Status Pengajar

- Mustahiq
- Munawib

Seluruh riwayat mengajar tetap tersimpan.

---

# 8. Database Pengurus

Database Pengurus menyimpan seluruh riwayat kepengurusan.

Organisasi meliputi:

- P3HM
- MPHM
- M3PHM

---

## Identitas

- Nama
- Tempat Lahir
- Tanggal Lahir
- Nama Wali
- Alamat
- Nomor HP

---

## Riwayat Kepengurusan

- Organisasi
- Jabatan
- Periode
- Tahun Mulai
- Tahun Selesai

Satu orang dapat memiliki lebih dari satu riwayat kepengurusan.

Contoh:

- Ketua MPHM
- Bendahara P3HM
- Sekretaris M3PHM

Semua riwayat tetap disimpan.

---

# 9. Database Wali Santri

Database Wali Santri menyimpan data seluruh wali santri.

Informasi meliputi:

- Nama
- Hubungan dengan Santri
- Alamat
- Nomor HP

Satu wali dapat terhubung dengan lebih dari satu santri.

---

# 10. Pencarian Database

Sistem menyediakan pencarian terpusat.

Menu:

```text
Pusat Data

└── Pencarian Database
```

Pencarian dapat menggunakan:

- Nama
- NIS
- NISN
- Nama Wali
- Nomor HP
- Alamat

---

## Hasil Pencarian

Hasil pencarian dapat berasal dari:

- Santri
- Alumni
- Pengajar
- Pengurus
- Wali Santri

Hak akses mengikuti Role pengguna.

---

# 11. Arsip Historis

Seluruh data yang sudah tidak aktif dipindahkan ke Arsip Historis.

Yang termasuk arsip:

- Alumni
- Santri Boyong
- Santri Cuti
- Pengajar Tidak Aktif
- Pengurus Selesai Menjabat

Data tetap dapat dicari.

Namun tidak muncul pada menu operasional harian.

---

# 12. Profil Terpadu

Setiap orang memiliki satu halaman profil.

Halaman tersebut berisi seluruh perjalanan orang tersebut selama berada di MPHM.

Contoh:

```text
Fatimah

Status :
Alumni

Riwayat

2020
Masuk MPHM

↓

Ibtidaiyyah

↓

Tsanawiyah

↓

Aliyah

↓

Khidmah

↓

Alumni

↓

Ijazah Diambil
```

Contoh lain:

```text
Aisyah

Santri

↓

Alumni

↓

Mustahiq

↓

Pengurus MPHM

↓

Pengurus P3HM
```

Seluruh riwayat ditampilkan dalam satu halaman.

---

# 13. Hubungan Dengan Modul Akademik

Pusat Data menjadi sumber data utama untuk seluruh modul.

```text
Pusat Data
        │
        ├── Akademik
        ├── Kelas
        ├── Nilai
        ├── Absensi
        ├── Akhlaq
        ├── Pelanggaran
        ├── Raport
        ├── Promosi
        └── Dashboard
```

Seluruh modul mengambil data dari Pusat Data.

---

# 14. Aturan Penyimpanan

1. Data tidak dihapus ketika seseorang sudah tidak aktif.
2. Seluruh perubahan status disimpan sebagai histori.
3. Seluruh perubahan penting dicatat pada Audit Log.
4. Seluruh data dapat ditelusuri kembali.
5. Riwayat tidak boleh dihapus.
6. Arsip tetap dapat dicari.
7. Hak akses mengikuti Role pengguna.

---

# 15. Visi Pusat Data

Pusat Data MPHM menjadi tempat penyimpanan seluruh perjalanan santri, pengajar, pengurus, dan wali santri dari tahun ke tahun.

Dengan konsep ini, MPHM tidak hanya menjadi aplikasi administrasi akademik, tetapi juga menjadi pusat dokumentasi digital yang menjaga seluruh riwayat lembaga secara utuh, rapi, dan berkelanjutan.

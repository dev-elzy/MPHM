# 01_Business_Requirements.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : Business Requirements Specification (BRS)
>
> Version : 2.0
>
> Status : APPROVED

---

# 1. Pendahuluan

## 1.1 Latar Belakang

MPHM (Madrasah Putri Hidayatul Mubtadi'at) merupakan sistem informasi akademik berbasis web yang dirancang untuk mengelola seluruh proses administrasi pendidikan secara terintegrasi, mulai dari penerimaan santri, pengelolaan kelas, penilaian, absensi, promosi kenaikan kelas, hingga pengarsipan data alumni.

Sistem dibangun sebagai **Enterprise Internal SaaS** dengan pendekatan **Cloud Native** menggunakan infrastruktur Cloudflare sehingga mudah dikembangkan, aman, memiliki performa tinggi, dan siap digunakan dalam jangka panjang.

Sistem tidak hanya berfungsi sebagai aplikasi administrasi akademik, tetapi juga sebagai **pusat data permanen** yang menyimpan seluruh riwayat santri, alumni, pengajar, dan pengurus dari tahun ke tahun.

---

# 2. Tujuan Sistem

Sistem dikembangkan untuk mencapai tujuan berikut:

- Mengintegrasikan seluruh administrasi akademik dalam satu platform.
- Menyediakan database santri yang tersimpan secara permanen.
- Mempermudah pengelolaan kelas dan proses belajar mengajar.
- Mempercepat proses input nilai dan absensi.
- Mengurangi kesalahan administrasi.
- Menyediakan monitoring akademik secara real-time.
- Mendukung proses promosi dan kenaikan kelas.
- Menyediakan riwayat akademik lengkap setiap santri.
- Menyediakan database alumni yang terdokumentasi dengan baik.
- Menjaga keamanan, integritas, dan histori seluruh perubahan data.

---

# 3. Ruang Lingkup Sistem

Sistem mencakup seluruh proses administrasi akademik MPHM yang terdiri dari:

- Manajemen Tahun Ajaran
- Manajemen Semester
- Manajemen Jenjang Pendidikan
- Manajemen Tingkat
- Manajemen Kelas
- Manajemen Mata Pelajaran
- Manajemen Santri
- Manajemen Alumni
- Manajemen Pengajar
- Manajemen Pengurus
- Manajemen Pengguna
- Role Based Access Control (RBAC)
- Penilaian
- Absensi
- Akhlaq
- Promosi / Kenaikan Kelas
- Raport
- Dashboard
- Global Database Search
- Audit Log
- Arsip Historis
- Dynamic Custom Fields
- Recycle Bin

---

# 4. Struktur Pendidikan MPHM

Struktur pendidikan mengikuti aturan resmi MPHM berdasarkan masa pendidikan.

| Jenjang              | Masa Pendidikan | Tingkat    |
| -------------------- | --------------: | ---------- |
| Sekolah I'dadiyyah   |         1 Tahun | I, II, III |
| Madrasah Ibtidaiyyah |         6 Tahun | I – VI     |
| Madrasah Tsanawiyah  |         3 Tahun | I – III    |
| Madrasah Aliyah      |         3 Tahun | I – III    |
| Al-Robithoh          |         1 Tahun | Khidmah    |

Ketentuan:

- Tingkat pada Sekolah I'dadiyyah merupakan pembagian kelas internal dalam satu tahun, bukan kenaikan tahunan.
- Al-Robithoh merupakan program khidmah setelah Aliyah III.
- Promosi kelas hanya berlaku pada jenjang yang memiliki kenaikan tahunan sesuai aturan akademik MPHM.

---

# 5. Tahun Ajaran

Tahun Ajaran merupakan pusat seluruh aktivitas akademik.

Dalam satu waktu hanya boleh terdapat satu Tahun Ajaran berstatus **Active**.

Seluruh modul akademik mengikuti Tahun Ajaran aktif, meliputi:

- Semester
- Kelas
- Penugasan Pengajar
- Penugasan Mustahiq
- Nilai
- Absensi
- Akhlaq
- Raport
- Promosi Kelas

Pengguna tidak memilih Tahun Ajaran secara manual. Sistem akan menggunakan Tahun Ajaran aktif secara otomatis.

---

# 6. Semester

Setiap Tahun Ajaran memiliki dua semester:

- Semester I
- Semester II

Seluruh aktivitas akademik dilakukan berdasarkan Semester yang sedang berjalan.

---

# 7. Jenjang, Tingkat, dan Kelas

Hierarki akademik pada sistem adalah sebagai berikut:

```text
Tahun Ajaran
      │
      ▼
Semester
      │
      ▼
Jenjang Pendidikan
      │
      ▼
Tingkat
      │
      ▼
Kelas
      │
      ▼
Santri
```

Setiap kelas memiliki:

- Jenjang
- Tingkat
- Nama Kelas
- Wali Kelas (Mustahiq)
- Daftar Santri
- Daftar Mata Pelajaran

---

# 8. Master Data Permanen

Sistem memiliki beberapa master data yang disimpan secara permanen dan tidak bergantung pada Tahun Ajaran.

Master data tersebut meliputi:

- Santri
- Alumni
- Pengajar
- Pengurus
- Wali Santri
- Mata Pelajaran
- Jenjang Pendidikan
- Tingkat Pendidikan

Seluruh perubahan terhadap master data harus tercatat pada Audit Log.

---

# 9. Database Santri

Data santri disimpan secara permanen dari tahun ke tahun.

Minimal informasi yang disimpan meliputi:

- NIS
- NISN
- Nama Lengkap
- Tempat Lahir
- Tanggal Lahir
- Nama Wali
- Alamat
- Nomor HP
- Tahun Masuk
- Tahun Keluar
- Status Santri

Status santri terdiri dari:

- Aktif
- Cuti
- Boyong
- Alumni

Selain data identitas, sistem juga menyimpan riwayat:

- Kelas
- Nilai
- Absensi
- Akhlaq
- Kamar
- Promosi
- Mutasi

Data santri tidak dihapus ketika sudah tidak aktif, melainkan diarsipkan sebagai data historis.

---

# 10. Database Alumni

Status Alumni merupakan kelanjutan dari data santri.

Selain data identitas, sistem menyimpan informasi tambahan:

- Status Khidmah
- Penempatan Khidmah
- Alasan Tidak Khidmah
- Keterangan Qodho' Khidmah
- Status Pengambilan Ijazah
- Tanggal Pengambilan Ijazah
- Keterangan Tambahan

Data alumni tetap dapat dicari melalui Global Database Search.

---

# 11. Database Pengajar

Data pengajar disimpan secara permanen.

Informasi yang disimpan meliputi:

- Nama
- Tempat Lahir
- Tanggal Lahir
- Nama Wali
- Alamat
- Nomor HP
- Tahun Mulai Mengajar
- Tahun Selesai Mengajar
- Status Pengajar

Status pengajar terdiri dari:

- Mustahiq
- Munawib

---

# 12. Database Pengurus

Data kepengurusan disimpan sebagai arsip historis.

Meliputi:

- Dewan Harian P3HM
- MPHM
- M3PHM

Informasi yang disimpan:

- Nama
- Tempat Lahir
- Tanggal Lahir
- Nama Wali
- Alamat
- Nomor HP
- Jabatan
- Periode Jabatan
- Tahun Mulai
- Tahun Selesai

Riwayat kepengurusan tidak boleh dihapus.

---

# 13. Role Based Access Control (RBAC)

Seluruh pengguna sistem diberikan hak akses berdasarkan Role Based Access Control (RBAC).

Setiap pengguna hanya dapat mengakses modul dan data sesuai dengan kewenangannya.

Hak akses tidak hanya ditentukan berdasarkan jenis role, tetapi juga berdasarkan ruang lingkup data (Data Scope) seperti kelas, jenjang, atau seluruh sistem.

---

## 13.1 Super Administrator

Super Administrator merupakan pengelola teknis aplikasi.

Memiliki hak akses penuh terhadap seluruh modul dan konfigurasi sistem.

Hak akses meliputi:

- Manajemen Pengguna
- Manajemen Role
- Manajemen Permission
- Konfigurasi Sistem
- Master Data
- Backup & Restore
- Audit Log
- Dynamic Custom Fields
- Seluruh Data Akademik

---

## 13.2 Administrator Akademik

Administrator Akademik bertanggung jawab terhadap seluruh administrasi akademik.

Hak akses meliputi:

- Tahun Ajaran
- Semester
- Jenjang
- Tingkat
- Kelas
- Mata Pelajaran
- Santri
- Alumni
- Pengajar
- Pengurus
- Penugasan Mustahiq
- Promosi Kelas
- Raport
- Monitoring Akademik

Administrator Akademik tidak dapat mengubah konfigurasi sistem.

---

## 13.3 Operator Akademik

Operator membantu proses administrasi akademik.

Hak akses dapat dibatasi sesuai kebutuhan.

Operator dapat diberikan akses terhadap:

- Input Data Santri
- Pembaruan Biodata
- Mutasi Santri
- Pengelolaan Kelas
- Absensi
- Penilaian
- Promosi
- Database Search

Permission diberikan secara fleksibel oleh Administrator.

---

## 13.4 Mustahiq (Wali Kelas)

Mustahiq merupakan wali kelas yang bertanggung jawab terhadap satu kelas.

Setiap Mustahiq hanya dapat memiliki satu kelas aktif dalam satu Tahun Ajaran.

Hak akses:

- Melihat Dashboard Kelas
- Melihat Biodata Santri dalam kelasnya
- Menginput Nilai
- Menginput Absensi
- Menginput Akhlaq
- Melihat Riwayat Akademik Santri Kelasnya
- Memberikan Rekomendasi Promosi

Mustahiq tidak dapat:

- Mengakses kelas lain
- Mengubah master data santri
- Menghapus data akademik
- Mengakses konfigurasi sistem

Sistem secara otomatis menentukan kelas berdasarkan akun yang digunakan.

---

## 13.5 Mufattisy (Pimpinan Tingkatan)

Mufattisy bertugas melakukan monitoring pada jenjang tertentu.

Contoh:

- I'dadiyyah
- Ibtidaiyyah
- Tsanawiyah
- Aliyah
- Al-Robithoh

Hak akses:

- Melihat seluruh kelas pada jenjang yang ditugaskan
- Monitoring Nilai
- Monitoring Absensi
- Monitoring Akhlaq
- Monitoring Promosi
- Melihat Statistik Jenjang
- Melihat Laporan Akademik

Tidak dapat:

- Mengubah master data
- Mengakses jenjang lain yang tidak ditugaskan

---

## 13.6 Pimpinan

Role ini digunakan oleh:

- Mundzir
- Dzurriyah
- Server

Hak akses:

- Monitoring seluruh jenjang
- Monitoring seluruh kelas
- Monitoring seluruh nilai
- Monitoring absensi
- Monitoring laporan akademik
- Monitoring statistik
- Monitoring riwayat akademik

Pimpinan memiliki akses baca terhadap seluruh data lintas jenjang.

---

## 13.7 Akun Pengecekan

Merupakan akun khusus untuk kebutuhan verifikasi data.

Hak akses:

- Global Database Search
- Melihat biodata dasar santri
- Melihat lokasi kamar
- Melihat status santri

Data yang dapat dilihat:

- Nama
- NIS
- NISN
- Alamat
- Kamar
- Tahun Masuk
- Tahun Keluar
- Status

Data berikut tidak dapat diakses:

- Nilai
- Absensi
- Akhlaq
- Raport
- Catatan Internal

Role ini bersifat Read Only.

---

## 13.8 Wali Santri

Wali Santri hanya dapat mengakses data anak yang terhubung dengan akunnya.

Hak akses:

- Profil Santri
- Nilai
- Absensi
- Akhlaq
- Riwayat Akademik
- Raport

Wali Santri tidak dapat melihat data santri lain.

---

# 14. Dashboard

Dashboard ditampilkan sesuai dengan role pengguna.

Dashboard hanya menampilkan informasi yang relevan terhadap hak akses pengguna.

Dashboard yang tersedia:

- Dashboard Super Administrator
- Dashboard Administrator Akademik
- Dashboard Operator
- Dashboard Mustahiq
- Dashboard Mufattisy
- Dashboard Pimpinan
- Dashboard Wali Santri

---

# 15. Penilaian

Penilaian dilakukan oleh Mustahiq sesuai kelas yang diampu.

Sistem mendukung:

- Input Nilai Harian
- Nilai Tengah Semester
- Nilai Akhir Semester
- Nilai Akhir Tahun
- Nilai Raport

Seluruh perubahan nilai disimpan secara otomatis (Auto Save).

Tidak terdapat tombol Save.

Perubahan nilai wajib tercatat pada Audit Log.

---

# 16. Absensi

Absensi dilakukan berdasarkan kelas.

Jenis absensi meliputi:

- Hadir
- Izin
- Sakit
- Alpha

Sistem menyimpan histori absensi setiap semester.

Data absensi digunakan sebagai salah satu pertimbangan proses promosi.

---

# 17. Akhlaq

Setiap santri memiliki penilaian Akhlaq.

Penilaian dilakukan oleh Mustahiq sesuai kelas yang diampu.

Riwayat penilaian Akhlaq disimpan pada setiap semester.

---

# 18. Promosi / Kenaikan Kelas

Promosi dilakukan pada akhir Tahun Ajaran.

Tahapan promosi meliputi:

1. Membuka Periode Promosi
2. Generate Kandidat Santri
3. Evaluasi Nilai
4. Evaluasi Kehadiran
5. Review Operator
6. Persetujuan
7. Finalisasi

Status promosi terdiri dari:

- PROMOTED
- RETAINED
- GRADUATED
- TRANSFERRED
- DROPPED
- KHIDMAH

Setelah promosi selesai, sistem akan:

- Membuat Riwayat Akademik
- Memindahkan Kelas
- Memperbarui Status
- Menyimpan Snapshot Data

Promosi hanya dapat dilakukan satu kali dalam setiap Tahun Ajaran.

---

# 19. Aturan Promosi Berdasarkan Jenjang

Madrasah Ibtidaiyyah mengikuti kenaikan kelas selama enam tahun.

Madrasah Tsanawiyah mengikuti kenaikan kelas selama tiga tahun.

Madrasah Aliyah mengikuti kenaikan kelas selama tiga tahun.

Sekolah I'dadiyyah merupakan program satu tahun sehingga tingkat I, II, dan III bukan merupakan kenaikan tahunan.

Al-Robithoh merupakan program khidmah selama satu tahun setelah Aliyah III.

Seluruh aturan promosi harus mengikuti struktur pendidikan resmi MPHM.

---

# 20. Raport

Raport dihasilkan setelah proses finalisasi semester selesai.

Raport hanya dapat dibuat apabila:

- Nilai lengkap
- Absensi lengkap
- Akhlaq lengkap
- Tidak terdapat data yang belum diverifikasi

Setelah raport diterbitkan, data semester akan berstatus Locked dan hanya dapat dibuka kembali oleh Administrator Akademik sesuai prosedur yang berlaku.

---

# 21. Global Database Search

Sistem menyediakan fitur pencarian terpusat (Global Database Search) untuk memudahkan pencarian seluruh data utama.

Menu Database terdiri dari:

- Database Santri
- Database Alumni
- Database Pengajar
- Database Pengurus

Pencarian dapat dilakukan menggunakan:

- Nama
- NIS
- NISN
- Nama Wali
- Nomor HP
- Alamat
- Tahun Masuk
- Tahun Keluar

Hasil pencarian dapat difilter berdasarkan:

- Santri Aktif
- Alumni
- Cuti
- Boyong
- Pengajar
- Pengurus
- Jenjang
- Tahun Ajaran

Hak akses hasil pencarian mengikuti Role Based Access Control (RBAC).

---

# 22. Arsip Historis

MPHM menerapkan konsep Historical Archive.

Data yang sudah tidak aktif tidak dihapus dari sistem.

Seluruh data berikut akan diarsipkan secara permanen:

- Santri
- Alumni
- Pengajar
- Pengurus
- Riwayat Kelas
- Riwayat Nilai
- Riwayat Absensi
- Riwayat Akhlaq
- Riwayat Promosi
- Riwayat Jabatan

Data arsip tidak muncul pada menu operasional harian, namun tetap tersedia melalui Global Database Search sesuai hak akses pengguna.

---

# 23. Dynamic Custom Fields

Administrator dapat menambahkan atribut data baru tanpa mengubah kode aplikasi maupun struktur database.

Custom Field dapat diterapkan pada:

- Santri
- Alumni
- Pengajar
- Pengurus
- Wali Santri
- Mata Pelajaran
- Kelas

Jenis data yang didukung:

- Text
- Text Area
- Number
- Decimal
- Date
- Time
- Date Time
- Email
- Phone
- URL
- Checkbox
- Radio Button
- Dropdown
- Multi Select
- File
- Image

Setiap Custom Field memiliki konfigurasi:

- Nama Field
- Label
- Modul
- Tipe Data
- Default Value
- Required
- Unique
- Read Only
- Visible Role
- Urutan Tampilan
- Status Aktif

Seluruh perubahan Custom Field dicatat pada Audit Log.

---

# 24. Monitoring Akademik

Administrator Akademik, Mufattisy, dan Pimpinan dapat melakukan monitoring akademik secara real-time sesuai ruang lingkup kewenangannya.

Monitoring meliputi:

- Progress Penilaian
- Progress Absensi
- Progress Akhlaq
- Progress Raport
- Progress Promosi
- Jumlah Santri Aktif
- Statistik Jenjang
- Statistik Kelas
- Statistik Kelulusan

Seluruh informasi diperbarui secara real-time berdasarkan data yang tersimpan.

---

# 25. Finalisasi Semester

Finalisasi Semester dilakukan setelah seluruh proses akademik selesai.

Tahapan finalisasi:

1. Pemeriksaan Kelengkapan
2. Verifikasi Data
3. Perhitungan Nilai
4. Validasi Data
5. Lock Semester
6. Generate Raport

Setelah finalisasi selesai:

- Data Semester menjadi Read Only.
- Perubahan hanya dapat dilakukan melalui proses Unlock oleh Administrator Akademik.
- Seluruh aktivitas Unlock wajib memiliki alasan dan tercatat pada Audit Log.

---

# 26. Lifecycle Data

Setiap data utama memiliki siklus hidup (Lifecycle) yang jelas.

## Tahun Ajaran

```text
Draft
   │
Published
   │
Active
   │
Archived
```

## Santri

```text
Aktif
   │
Cuti
   │
Boyong
   │
Alumni
```

## Nilai

```text
Draft
   │
Verified
   │
Final
   │
Locked
```

## Promosi

```text
Draft
   │
Processing
   │
Approved
   │
Locked
```

Setiap perubahan status harus tercatat pada Audit Log.

---

# 27. Recycle Bin

Seluruh penghapusan data menggunakan mekanisme Soft Delete.

Data yang dihapus tidak langsung dihapus permanen.

Data dipindahkan ke Recycle Bin.

Berlaku untuk:

- Santri
- Pengajar
- Pengurus
- Mata Pelajaran
- Kelas
- Penilaian
- Absensi
- Akhlaq
- User

Data disimpan selama masa retensi yang ditentukan oleh Administrator.

Selama periode retensi data dapat:

- Dipulihkan (Restore)
- Dihapus Permanen

Penghapusan permanen dilakukan secara otomatis menggunakan Cloudflare Cron Worker.

---

# 28. Audit Log

Seluruh aktivitas penting wajib dicatat.

Audit Log minimal menyimpan informasi:

- Pengguna
- Role
- Modul
- Aktivitas
- Data Sebelum
- Data Sesudah
- Waktu
- IP Address (Opsional)
- User Agent (Opsional)

Audit Log tidak dapat diubah oleh pengguna.

Audit Log hanya dapat diakses oleh pengguna yang memiliki hak akses.

---

# 29. Keamanan Data

Sistem menerapkan prinsip keamanan sebagai berikut:

- Authentication wajib pada seluruh pengguna.
- Authorization menggunakan Role Based Access Control (RBAC).
- Session menggunakan Secure HttpOnly Cookie.
- Middleware digunakan untuk Route Protection.
- Seluruh komunikasi menggunakan HTTPS.
- Password disimpan menggunakan hashing yang aman.
- Data sensitif hanya dapat diakses sesuai hak akses.
- Seluruh perubahan penting dicatat pada Audit Log.

---

# 30. Prinsip Bisnis

Sistem dikembangkan berdasarkan prinsip berikut:

- Database menjadi sumber kebenaran (Single Source of Truth).
- Seluruh proses bisnis dijalankan di Backend.
- Frontend hanya bertanggung jawab terhadap antarmuka pengguna.
- Seluruh perubahan data wajib tervalidasi.
- Seluruh perubahan penting wajib memiliki Audit Trail.
- Seluruh data penting menggunakan Soft Delete.
- Seluruh data historis disimpan secara permanen.
- Seluruh hak akses menggunakan RBAC.
- Seluruh modul harus saling terintegrasi.
- Seluruh pengembangan harus menjaga integritas data.

---

# 31. Visi Pengembangan

MPHM dikembangkan sebagai platform administrasi pendidikan modern yang dapat berkembang dalam jangka panjang.

Pengembangan sistem harus selalu mengutamakan:

- Scalability
- Maintainability
- Security
- Reliability
- Performance
- Availability
- Data Integrity
- Auditability
- User Experience

Setiap modul baru wajib mengikuti Business Requirements Specification ini agar seluruh proses bisnis tetap konsisten, terdokumentasi, dan mudah dikembangkan.

---

# 32. Roadmap Pengembangan Modul

Pengembangan sistem dilakukan secara bertahap dengan prioritas sebagai berikut:

## Phase 1 — Foundation

- Authentication
- Authorization (RBAC)
- Master Data
- Dashboard
- User Management
- Audit Log

## Phase 2 — Akademik

- Tahun Ajaran
- Semester
- Jenjang
- Tingkat
- Kelas
- Mata Pelajaran
- Santri
- Pengajar

## Phase 3 — Operasional

- Penilaian
- Absensi
- Akhlaq
- Raport
- Monitoring

## Phase 4 — Progression

- Promosi / Kenaikan Kelas
- Mutasi
- Alumni
- Al-Robithoh
- Riwayat Akademik

## Phase 5 — Enterprise

- Global Database Search
- Dynamic Custom Fields
- Arsip Historis
- Laporan
- Backup & Restore
- Integrasi Modul Lanjutan

---

# 33. Penutup

Dokumen Business Requirements Specification (BRS) ini menjadi acuan utama dalam perancangan database, API, antarmuka pengguna, hak akses, dan seluruh implementasi teknis MPHM.

Seluruh perubahan kebutuhan bisnis harus diperbarui pada dokumen ini sebelum dilakukan implementasi agar konsistensi antara kebutuhan bisnis dan implementasi teknis tetap terjaga.

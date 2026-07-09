# 01_Business_Requirements.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : Business Requirements Specification (BRS)
>
> Version : 1.0
>
> Status : APPROVED

---

# 1. Pendahuluan

## 1.1 Latar Belakang

Aplikasi MPHM merupakan sistem administrasi akademik berbasis web yang dirancang khusus untuk mendukung seluruh proses administrasi pembelajaran di Madrasah Putri Hidayatul Mubtadi'at.

Sistem ini dibangun sebagai **Enterprise Internal SaaS** dengan pendekatan **Cloud Native**, sehingga mudah dikembangkan, mudah dipelihara, aman, dan siap digunakan dalam jangka panjang.

Seluruh proses administrasi akademik dilakukan secara terintegrasi mulai dari pengelolaan Tahun Ajaran, Kelas, Mata Pelajaran, Siswi, Penilaian, Finalisasi hingga Pembuatan Raport.

---

# 2. Tujuan Sistem

Sistem dibangun untuk memenuhi tujuan berikut:

- Mempermudah administrasi akademik.
- Mempercepat proses input nilai.
- Mengurangi kesalahan administrasi.
- Menyediakan monitoring progres akademik secara real-time.
- Menjadi pusat data akademik yang terintegrasi.
- Mempermudah proses finalisasi dan pembuatan raport.
- Menjaga keamanan serta histori seluruh perubahan data.

---

# 3. Ruang Lingkup Sistem

Sistem mencakup seluruh proses administrasi akademik yang terdiri dari:

- Manajemen Tahun Ajaran
- Manajemen Semester
- Manajemen Kelas
- Manajemen Mata Pelajaran
- Manajemen Siswi
- Manajemen Pengguna
- Input Nilai
- Absensi
- Akhlaq
- Finalisasi
- Raport
- Audit Log
- Recycle Bin

---

# 4. Aktor Sistem

Sistem memiliki lima jenis pengguna.

## Super Admin

Bertanggung jawab terhadap seluruh konfigurasi sistem.

Hak akses:

- Mengelola seluruh data.
- Mengelola Admin.
- Mengelola konfigurasi global.
- Mengakses seluruh laporan.

---

## Admin

Bertanggung jawab terhadap administrasi akademik.

Hak akses:

- Mengelola Tahun Ajaran.
- Mengelola Semester.
- Mengelola Kelas.
- Mengelola Mata Pelajaran.
- Mengelola Siswi.
- Mengelola User.
- Monitoring seluruh progres.
- Verifikasi Finalisasi.
- Generate Raport.

---

## Operator

Membantu proses administrasi.

Hak akses diberikan sesuai kebutuhan oleh Admin.

---

## Mustahiq

Mustahiq merupakan penanggung jawab satu kelas.

Hak akses:

- Melihat Dashboard Kelas.
- Input Nilai.
- Input Absensi.
- Input Akhlaq.
- Mengajukan Finalisasi.

Mustahiq **tidak dapat memilih kelas**.

---

## Mudir

Hak akses bersifat monitoring.

Dapat melihat:

- Dashboard
- Statistik
- Progress Akademik
- Finalisasi
- Raport

Tanpa mengubah data akademik.

---

# 5. Struktur Organisasi Akademik

Struktur akademik pada sistem mengikuti hierarki berikut.

```text
Tahun Ajaran
        │
        ▼
Semester
        │
        ▼
Kelas
        │
        ▼
Mata Pelajaran
        │
        ▼
Siswi
        │
        ▼
Nilai
```

Seluruh data akademik berada di bawah Tahun Ajaran.

---

# 6. Tahun Ajaran

Tahun Ajaran merupakan pusat seluruh data akademik.

Seluruh data berikut bergantung pada Tahun Ajaran yang sedang aktif.

- Semester
- Kelas
- Mata Pelajaran
- Siswi
- Penugasan Mustahiq
- Nilai
- Absensi
- Akhlaq
- Raport

Dalam satu waktu hanya boleh terdapat **satu Tahun Ajaran berstatus Active**.

Seluruh pengguna otomatis bekerja pada Tahun Ajaran yang sedang aktif.

Pengguna tidak memilih Tahun Ajaran secara manual.

---

# 7. Semester

Setiap Tahun Ajaran memiliki:

- Semester I
- Semester II

Seluruh proses akademik dilakukan berdasarkan Semester yang dipilih.

---

# 8. Kelas

Setiap kelas berada di bawah satu Tahun Ajaran.

Setiap kelas memiliki:

- Nama Kelas
- Bagian
- Mustahiq
- Daftar Siswi
- Daftar Mata Pelajaran

---

# 9. Mustahiq

Aturan utama sistem.

- Satu Mustahiq hanya mengampu satu kelas.
- Satu kelas hanya memiliki satu Mustahiq aktif.
- Mustahiq tidak pernah memilih kelas saat login.
- Sistem otomatis menentukan kelas berdasarkan akun yang digunakan.

Semua proses akademik yang dilakukan Mustahiq selalu menggunakan kelas yang telah ditentukan oleh sistem.

---

# 10. Mata Pelajaran

Mata Pelajaran **bukan bersifat global**.

Setiap kelas memiliki daftar Mata Pelajaran masing-masing.

Dengan demikian:

Kelas A dapat memiliki Mata Pelajaran yang berbeda dengan Kelas B.

Perubahan Mata Pelajaran pada suatu kelas tidak mempengaruhi kelas lainnya.

---

# 11. Dashboard

Dashboard disesuaikan berdasarkan Role pengguna.

## Dashboard Admin

Berfungsi sebagai Operational Command Center.

Menampilkan:

- Total Kelas
- Total Siswi
- Progress Input Nilai
- Progress Finalisasi
- Progress Raport
- Statistik
- Aktivitas Terbaru
- Notifikasi
- Monitoring seluruh kelas

---

## Dashboard Mustahiq

Menampilkan:

- Informasi Kelas
- Semester Aktif
- Daftar Mata Pelajaran
- Progress Input Nilai
- Progress Finalisasi
- Absensi
- Akhlaq

---

## Dashboard Mudir

Menampilkan ringkasan akademik tanpa detail pengelolaan data.

---

# 12. Input Nilai

Input Nilai dilakukan oleh Mustahiq.

Alur:

```text
Login

↓

Dashboard

↓

Pilih Semester

↓

Daftar Mata Pelajaran

↓

Pilih Mata Pelajaran

↓

Input Nilai

↓

Auto Save

↓

Database
```

Tidak terdapat tombol Save.

Seluruh perubahan disimpan secara otomatis.

---

# 13. Finalisasi

Finalisasi dilakukan setelah seluruh data akademik lengkap.

Proses:

- Pemeriksaan kelengkapan.
- Verifikasi.
- Perhitungan otomatis.
- Lock Data.
- Generate Raport.

Setelah Finalisasi selesai maka data menjadi Read Only.

---

# 14. Monitoring

Admin dapat memonitor seluruh perkembangan akademik secara real-time.

Monitoring meliputi:

- Progress setiap kelas.
- Progress setiap Mata Pelajaran.
- Nilai yang belum lengkap.
- Kelas yang siap Finalisasi.
- Aktivitas pengguna.
- Statistik akademik.

---

# 15. Tahun Ajaran Baru

Admin dapat membuat Tahun Ajaran baru dengan dua cara.

## Manual

Membuat seluruh konfigurasi dari awal.

## Clone

Menyalin konfigurasi dari Tahun Ajaran sebelumnya.

Data yang ikut disalin:

- Semester
- Struktur Kelas
- Mata Pelajaran setiap Kelas
- Pengaturan

Data yang **tidak ikut disalin**:

- Siswi
- Nilai
- Absensi
- Akhlaq
- Raport
- Audit Log

---

# 16. Lifecycle Data

Seluruh data penting memiliki siklus hidup.

## Tahun Ajaran

```text
Draft

↓

Published

↓

Active

↓

Archived
```

---

## Mata Pelajaran

```text
Draft

↓

Active

↓

Trash

↓

Deleted
```

---

## Nilai

```text
Draft

↓

Final

↓

Locked
```

---

# 17. Recycle Bin

Seluruh data penting yang dihapus tidak langsung dihapus permanen.

Data dipindahkan terlebih dahulu ke Recycle Bin.

Berlaku untuk:

- Kelas
- Mata Pelajaran
- Siswi
- User
- Nilai
- Absensi
- Akhlaq

Data berada di Recycle Bin selama **24 jam**.

Selama periode tersebut Admin dapat:

- Restore
- Delete Permanently

Apabila tidak dilakukan tindakan, sistem akan menghapus data secara permanen secara otomatis menggunakan Cloudflare Cron Worker.

---

# 18. Audit Log

Seluruh aktivitas penting wajib dicatat.

Audit Log mencatat:

- Pengguna
- Role
- Aktivitas
- Data Sebelum
- Data Sesudah
- Waktu
- IP Address (Opsional)
- User Agent (Opsional)

Audit Log tidak dapat diubah oleh pengguna.

---

# 19. Soft Delete

Seluruh data penting menggunakan mekanisme Soft Delete.

Data tidak langsung dihapus dari database.

Data diberi status:

- deleted_at
- deleted_by

Penghapusan permanen hanya dilakukan oleh proses Recycle Bin setelah melewati masa retensi.

---

# 20. Prinsip Bisnis

Sistem dibangun berdasarkan prinsip berikut.

- Seluruh proses bisnis dijalankan di Backend.
- Frontend hanya bertanggung jawab terhadap antarmuka pengguna.
- Tidak ada proses perhitungan akademik di Frontend.
- Seluruh perubahan penting wajib tercatat pada Audit Log.
- Seluruh data penting memiliki mekanisme Recycle Bin.
- Seluruh proses akademik selalu mengikuti Tahun Ajaran yang sedang aktif.
- Seluruh struktur sistem harus modular dan mudah dikembangkan.
- Seluruh proses harus menjaga integritas data serta konsistensi informasi.

---

# 21. Visi Pengembangan

MPHM dibangun bukan sebagai aplikasi CRUD, melainkan sebagai platform administrasi akademik modern dengan konsep Enterprise Internal SaaS.

Seluruh pengembangan sistem harus selalu mengutamakan:

- Scalability
- Maintainability
- Security
- Performance
- Reliability
- User Experience
- Long-Term Development

Setiap modul baru yang ditambahkan di masa mendatang harus mengikuti prinsip-prinsip tersebut tanpa mengubah fondasi arsitektur sistem.
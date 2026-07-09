# 00_Project_Vision.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : Project Vision
>
> Version : 2.0
>
> Status : APPROVED

---

# 1. Project Overview

MPHM merupakan sistem informasi akademik berbasis web yang dirancang khusus untuk mendukung seluruh proses administrasi akademik Madrasah Putri Hidayatul Mubtadi'at.

Sistem ini dibangun sebagai **Progressive Web Application (PWA)** dengan pendekatan **Enterprise SaaS Architecture**, sehingga memiliki performa tinggi, mudah dikembangkan, aman, dan siap digunakan dalam jangka panjang.

MPHM bukan sekadar aplikasi input nilai, tetapi menjadi pusat pengelolaan seluruh aktivitas akademik yang berpusat pada Tahun Ajaran (Academic Workspace).

---

# 2. Vision

Membangun platform akademik modern yang:

- Profesional.
- Cepat.
- Aman.
- Responsif.
- Mudah digunakan.
- Mudah dikembangkan.
- Enterprise Grade.
- Cloud Native.
- AI Friendly.
- Long-Term Maintainable.

Seluruh pengembangan harus berorientasi pada kualitas arsitektur, bukan sekadar menghasilkan fitur.

---

# 3. Mission

MPHM dikembangkan untuk:

- Mempermudah proses administrasi akademik.
- Mempermudah proses input nilai.
- Mengurangi pekerjaan manual.
- Menghilangkan redundansi data.
- Menyediakan monitoring akademik secara realtime.
- Menjadi pusat informasi akademik.
- Menjamin konsistensi data.
- Menyediakan audit terhadap seluruh aktivitas penting.
- Mempermudah pengembangan fitur baru di masa depan.

---

# 4. Core Values

Seluruh pengembangan MPHM wajib menjunjung nilai berikut.

- Simplicity
- Consistency
- Performance
- Security
- Scalability
- Maintainability
- Reliability
- Accessibility
- Productivity
- Transparency

---

# 5. Target Users

Sistem memiliki beberapa jenis pengguna.

## Super Admin

Memiliki akses penuh terhadap seluruh sistem.

Bertanggung jawab atas:

- Konfigurasi sistem.
- Manajemen pengguna.
- Manajemen role.
- Manajemen permission.
- Maintenance.
- Audit.
- Recovery.

---

## Admin

Mengelola seluruh aktivitas akademik.

Meliputi:

- Tahun Ajaran
- Semester
- Kurikulum
- Mata Pelajaran
- Kelas
- Siswi
- Pengguna
- Monitoring
- Laporan
- Recycle Bin

Admin juga menjadi pengendali seluruh konfigurasi akademik.

---

## Mustahiq

Mustahiq hanya mengampu **satu kelas aktif** pada satu Tahun Ajaran.

Setelah login.

Mustahiq langsung diarahkan menuju Dashboard Kelas yang menjadi tanggung jawabnya.

Mustahiq tidak dapat melihat kelas lain.

Mustahiq hanya dapat:

- Melihat siswi pada kelasnya.
- Menginput nilai kelasnya.
- Mengubah nilai sebelum Finalisasi.
- Melihat progress input kelasnya.
- Mencetak laporan sesuai hak akses.

---

## Mudir

Memiliki akses monitoring.

Tidak melakukan input data.

Mudir dapat melihat:

- Statistik Akademik.
- Progress Input Nilai.
- Progress Finalisasi.
- Aktivitas Sistem.
- Dashboard Monitoring.

---

## Operator

Bertugas membantu operasional administrasi harian madrasah, pengelolaan data santri, dan kelas di bawah supervisi Admin.

---

## Mufattisy

Pimpinan tingkatan yang bertugas melakukan monitoring akademik pada jenjang/tingkatan yang ditugaskan.

---

## Petugas Keamanan

Bertugas melakukan verifikasi data santri (pencarian santri, kelas, dan kamar) serta mencatat laporan kejadian pelanggaran kedisiplinan santri. Role ini bersifat non-akademik dan tidak memiliki akses ke nilai/raport.

---

## Wali Santri

Memiliki akses read-only portal untuk memantau perkembangan akademik, kehadiran, akhlaq, dan riwayat kedisiplinan putri.

---

# 6. Scope

Versi pertama MPHM mencakup.

## Authentication

- Login
- Logout
- Session
- Role
- Permission

---

## Academic Workspace

- Tahun Ajaran
- Semester
- Kurikulum
- Mata Pelajaran
- Kelas

---

## Student Management

- Data Siswi
- Import
- Export
- Restore
- Soft Delete

---

## User Management

- Pengguna
- Role
- Permission
- Reset Password

---

## Score Management

- Input Nilai
- Finalisasi
- Monitoring
- Audit

---

## Disciplinary & Incident Management (Pelanggaran Santri)

- Master Jenis Pelanggaran (Dikelola Admin)
- Pencatatan Laporan Pelanggaran (Petugas Keamanan & Admin)
- Unggah Bukti Pelanggaran
- Riwayat Pelanggaran Santri
- Status Penanganan Pelanggaran

---

## Report

- Rekap Nilai
- Cetak Laporan

---

## Monitoring

Dashboard Admin dapat memonitor secara realtime.

- Progress Input Nilai.
- Progress Finalisasi.
- Progress per Kelas.
- Progress per Mustahiq.
- Aktivitas Sistem.

---

## Audit

Seluruh perubahan penting wajib tercatat.

---

## Recycle Bin

Seluruh data penting menggunakan Soft Delete.

Data tetap dapat dipulihkan selama masa retensi.

---

# 7. Academic Workspace Concept

Seluruh aktivitas akademik berada di dalam Workspace Tahun Ajaran.

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

Ketika Admin mengaktifkan Tahun Ajaran baru.

Seluruh sistem otomatis menggunakan konfigurasi Tahun Ajaran tersebut.

---

# 8. Academic Configuration

Seluruh konfigurasi akademik dikendalikan oleh Admin.

Meliputi.

- Tahun Ajaran Aktif.
- Semester Aktif.
- Kurikulum.
- Mata Pelajaran.
- Kelas.
- Deadline Input Nilai.
- Status Finalisasi.
- Pengumuman Dashboard.

Perubahan konfigurasi tidak boleh mengubah histori Tahun Ajaran sebelumnya.

---

# 9. Curriculum Flexibility

Setiap Tahun Ajaran dapat memiliki Kurikulum yang berbeda.

Setiap Kurikulum dapat memiliki Mata Pelajaran yang berbeda.

Setiap Kelas dapat menggunakan Kurikulum yang berbeda apabila diperlukan.

Perubahan Kurikulum hanya berlaku untuk Tahun Ajaran yang sedang aktif dan tidak memengaruhi data historis.

---

# 10. Workflow Philosophy

MPHM menggunakan **Workflow Engine**.

Setiap proses memiliki tahapan yang jelas.

Contoh.

```text
Draft

↓

Review

↓

Final

↓

Locked
```

Seluruh Workflow dikendalikan oleh Backend.

Frontend hanya menampilkan status.

---

# 11. Soft Delete Philosophy

Seluruh data penting tidak langsung dihapus.

Data dipindahkan ke Recycle Bin.

Selama masa retensi.

- Data masih dapat dipulihkan.
- Audit tetap tersedia.
- Relasi data tetap terjaga.

Setelah melewati masa retensi.

Cloudflare Cron Worker akan melakukan Permanent Delete secara otomatis.

---

# 12. Audit Philosophy

Seluruh aktivitas penting harus dapat ditelusuri.

Minimal mencatat.

- Pengguna.
- Modul.
- Aktivitas.
- Data Sebelum.
- Data Sesudah.
- Waktu.
- Alamat IP.
- User Agent.

Audit Log tidak dapat diubah maupun dihapus.

---

# 13. Realtime Philosophy

MPHM dirancang sebagai aplikasi yang selalu menampilkan data terbaru.

Seluruh perubahan penting diperbarui secara otomatis menggunakan mekanisme sinkronisasi data tanpa mengharuskan pengguna melakukan refresh halaman.

---

# 14. User Experience Philosophy

MPHM menggunakan pendekatan **Modern Enterprise SaaS**.

Karakteristik.

- Bersih.
- Modern.
- Ringan.
- Informatif.
- Cepat.
- Responsif.
- Konsisten.

Setiap halaman harus memberikan pengalaman yang sederhana namun profesional.

---

# 15. Technology Vision

Teknologi utama.

Frontend.

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- TanStack Query
- TanStack Table
- React Hook Form
- Zod

Backend.

- Cloudflare Workers
- OpenNext

Database.

- Cloudflare D1
- Drizzle ORM

Storage.

- Cloudflare R2

Deployment.

- Cloudflare

---

# 16. Architectural Vision

Seluruh sistem harus mengikuti prinsip.

- Enterprise Architecture.
- Feature-Based Architecture.
- Component-Driven Development.
- Clean Architecture.
- Workflow Driven.
- API First.
- Database First.
- Modular Design.

Setiap keputusan teknis harus mengutamakan konsistensi arsitektur.

---

# 17. Long-Term Roadmap

Arsitektur MPHM harus siap mendukung penambahan modul baru tanpa perubahan besar pada fondasi sistem.

Contoh.

- Absensi
- Hafalan
- Akhlak
- Pelanggaran
- Prestasi
- Perizinan
- Kalender Akademik
- Pengumuman
- Surat Menyurat
- Keuangan
- Asrama
- Inventaris
- E-Learning
- Multi Tenant

---

# 18. Success Criteria

MPHM dianggap berhasil apabila mampu.

- Mempermudah pekerjaan Admin.
- Mempermudah Mustahiq melakukan input nilai.
- Memberikan monitoring akademik secara realtime.
- Menjamin keamanan dan konsistensi data.
- Mengurangi kesalahan administrasi.
- Mempercepat proses akademik.
- Mudah dipelihara.
- Mudah dikembangkan.
- Siap digunakan selama bertahun-tahun.

---

# 19. Final Statement

MPHM bukan sekadar aplikasi administrasi madrasah.

MPHM adalah platform akademik modern yang dibangun dengan standar Enterprise SaaS, berorientasi pada kualitas arsitektur, pengalaman pengguna, keamanan data, serta keberlanjutan pengembangan jangka panjang.

Seluruh keputusan bisnis, desain, implementasi, dan pengembangan fitur wajib mengacu pada visi ini agar MPHM tetap konsisten, profesional, dan mampu berkembang mengikuti kebutuhan madrasah di masa mendatang.
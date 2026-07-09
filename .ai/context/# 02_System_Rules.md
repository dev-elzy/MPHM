# 02_System_Rules.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : System Rules Specification (SRS)
>
> Version : 1.0
>
> Status : APPROVED

---

# 1. Tujuan

Dokumen ini mendefinisikan seluruh aturan teknis sistem yang wajib diikuti selama proses pengembangan.

Seluruh implementasi Frontend, Backend, Database, API, dan UI harus mengikuti dokumen ini.

---

# 2. Arsitektur Sistem

Aplikasi menggunakan arsitektur berlapis (Layered Architecture).

```text
Client

↓

Presentation Layer

↓

Application Layer

↓

Business Layer

↓

Repository Layer

↓

Database
```

Business Logic hanya boleh berada pada Business Layer.

---

# 3. Frontend Rules

Frontend hanya bertanggung jawab terhadap:

- UI
- UX
- Validasi ringan
- Navigasi
- Cache
- Optimistic Update
- Loading State
- Error State

Frontend dilarang:

- Menghitung nilai akademik.
- Melakukan finalisasi.
- Mengubah aturan bisnis.
- Mengakses database secara langsung.

---

# 4. Backend Rules

Backend bertanggung jawab terhadap:

- Validasi Data
- Validasi Hak Akses
- Business Logic
- Perhitungan Akademik
- Finalisasi
- Audit Log
- Soft Delete
- Recycle Bin
- Integritas Database

---

# 5. Authentication

Menggunakan Session Authentication.

Karakteristik:

- HttpOnly Cookie
- Secure Cookie
- Session Rotation
- Middleware Protection

---

# 6. Authorization

Menggunakan Role Based Access Control (RBAC).

Role:

- Super Admin
- Admin
- Operator
- Mustahiq
- Mufattisy
- Pimpinan
- Petugas Keamanan
- Wali Santri

Seluruh endpoint wajib melakukan validasi Role.

---

# 7. Tahun Ajaran Aktif

Dalam satu waktu hanya boleh terdapat satu Tahun Ajaran aktif.

Seluruh query sistem otomatis menggunakan Tahun Ajaran aktif.

Pengguna tidak memilih Tahun Ajaran secara manual.

---

# 8. Mustahiq

Satu Mustahiq hanya memiliki satu kelas.

Setelah login.

Sistem otomatis menentukan:

- Tahun Ajaran
- Kelas
- Hak Akses

Mustahiq tidak pernah memilih kelas.

---

# 9. Auto Save

Seluruh Form Input menggunakan Auto Save.

Alur:

```text
Input

↓

Debounce

↓

Validation

↓

Save

↓

Toast

✓ Tersimpan
```

Tidak terdapat tombol Save pada Form Input Nilai.

---

# 10. Dashboard

Dashboard bersifat Role Based.

Setiap Role memiliki Dashboard yang berbeda.

Dashboard wajib menampilkan data secara realtime.

---

# 11. Monitoring

Admin dapat memonitor seluruh aktivitas akademik.

Meliputi:

- Progress Kelas
- Progress Mata Pelajaran
- Progress Finalisasi
- Aktivitas Pengguna
- Statistik
- Notifikasi

---

# 12. Data Lifecycle

Seluruh data memiliki Lifecycle.

Contoh:

```text
Draft

↓

Published

↓

Active

↓

Locked

↓

Archived

↓

Trash

↓

Deleted
```

Lifecycle menyesuaikan jenis data.

---

# 13. Recycle Bin

Seluruh data penting menggunakan Recycle Bin.

Retensi:

24 Jam

Cloudflare Cron Worker bertugas menghapus data yang telah melewati masa retensi.

---

# 14. Soft Delete

Data tidak dihapus secara permanen.

Minimal menggunakan:

- deleted_at
- deleted_by

---

# 15. Audit Log

Seluruh aktivitas penting wajib dicatat.

Audit Log tidak dapat diubah oleh pengguna.

---

# 16. Universal Data Grid

Seluruh halaman tabel wajib mengikuti dokumen:

**Universal Data Grid Standard**

Tidak diperbolehkan membuat implementasi Data Table yang berbeda antar modul.

---

# 17. Import & Export

Seluruh modul yang memiliki proses input data wajib menyediakan:

- Import
- Export
- Download Template
- Import History

Template wajib mengikuti standar yang telah ditentukan pada Universal Data Grid Standard.

---

# 18. Error Handling

Seluruh Error harus:

- Mudah dipahami.
- Informatif.
- Tidak menampilkan Error Internal.
- Menyediakan solusi atau tindakan berikutnya.

---

# 19. Performance

Standar minimum:

- Server Components
- Code Splitting
- Lazy Loading
- Streaming
- Optimistic Update
- Server Side Pagination
- Server Side Filtering
- Server Side Sorting
- Cache
- Edge Rendering

---

# 20. Security

Standar keamanan:

- CSRF Protection
- XSS Protection
- SQL Injection Protection
- Rate Limiting
- Secure Headers
- Input Validation
- Output Escaping

Seluruh validasi dilakukan di Backend.

---

# 21. Development Principles

Seluruh kode wajib memenuhi prinsip:

- SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Clean Architecture
- Feature-Based Architecture
- Type Safety
- Reusable Components
- Modular Design

---

# 22. Konsistensi Sistem

Seluruh fitur baru yang dikembangkan wajib:

- Mengikuti Business Requirements.
- Mengikuti System Rules.
- Menggunakan komponen yang sudah ada.
- Tidak membuat implementasi baru jika komponen reusable telah tersedia.

Konsistensi arsitektur lebih diutamakan daripada kecepatan implementasi.

---

# 23. Aturan Modul Pelanggaran Santri & Petugas Keamanan

1. **Master Jenis Pelanggaran**: Bersifat dinamis dan dikelola secara sentral oleh Administrator melalui Dashboard Admin.
2. **Incident-Based Recording**: Pelanggaran santri dicatat berdasarkan kejadian dan terpisah dari penilaian Akhlaq semesteran.
3. **Hak Akses Petugas Keamanan**:
   - Dapat melakukan pencarian biodata dasar santri, kelas, dan kamar untuk keperluan verifikasi identitas.
   - Dapat membuat laporan pelanggaran santri dan mengunggah bukti pelanggaran.
   - Dilarang mengakses, melihat, atau mengubah data akademik (Nilai, Absensi, Akhlaq, Raport).
4. **Immutability Log**: Setiap pencatatan pelanggaran tercatat secara permanen pada riwayat santri dan Audit Log sistem.


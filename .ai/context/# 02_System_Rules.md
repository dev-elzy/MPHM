BAGIAN 1: KEBUTUHAN PRIMER (Aturan Inti, Keamanan, & Tata Kelola Sistem)

## 1. Arsitektur, Otentikasi, & Otorisasi Sistem

- **Arsitektur Berlapis (Layered Architecture):**
  `Client` -> `Presentation Layer` -> `Application Layer` -> `Business Layer` -> `Repository Layer` -> `Database`.
- _Business Logic_ hanya boleh berada pada **Business Layer**.

- **Authentication:** Menggunakan _Session Authentication_ dengan karakteristik _HttpOnly Cookie_, _Secure Cookie_, _Session Rotation_, dan _Middleware Protection_.
- **Authorization:** Menggunakan _Role Based Access Control_ (RBAC) dan _Data Scope Authorization_. Seluruh endpoint wajib melakukan validasi Role. Daftar lengkap Role pada sistem hanya terdiri dari:

1. Sekretariat (Mencakup seluruh fungsi pengelolaan administratif sebelumnya)
2. Mustahiq (Wali Kelas)
3. Mufattisy (Pimpinan Tingkatan)
4. Pimpinan / Mundzir
5. Petugas Keamanan
6. Wali Santri

- **Aturan Visibilitas Data Secara Global:** Semua user **selain** Sekretariat dan Pimpinan/Mundzir **wajib hanya melihat data di setiap kinerjanya/lingkup kerjanya masing-masing**.
- **Pusat Data (Data Center):** Seluruh dashboard wajib mengambil data secara tersentralisasi (_Single Source of Truth_), bersifat _real-time_, serta responsif/optimal untuk PWA (_Desktop, Tablet, dan Mobile_).

## 2. Aturan Pembagian Tanggung Jawab (Frontend vs Backend)

- **Frontend Rules:** Hanya bertanggung jawab terhadap UI, UX, validasi ringan, navigasi, cache, _Optimistic Update_, _Loading State_, dan _Error State_. **Dilarang keras:** Menghitung nilai akademik, melakukan finalisasi, mengubah aturan bisnis, dan mengakses database secara langsung.
- **Backend Rules:** Bertanggung jawab terhadap validasi data, validasi hak akses, _Business Logic_, perhitungan akademik, finalisasi, _Audit Log_, _Soft Delete_, _Recycle Bin_, dan integritas database. Seluruh validasi wajib dilakukan di Backend.

## 3. Kebijakan Data, Log, Keamanan & Kinerja

- **Tahun Ajaran Aktif:** Dalam satu waktu hanya boleh terdapat satu Tahun Ajaran aktif. Seluruh query sistem otomatis menggunakan Tahun Ajaran aktif. Pengguna tidak memilih Tahun Ajaran secara manual.
- **Form Input (Auto Save):** Seluruh Form Input menggunakan mekanisme _Auto Save_ dengan alur: `Input` -> `Debounce` -> `Validation` -> `Save` -> `Toast` (✓ Tersimpan). Tidak terdapat tombol Save pada Form Input Nilai.
- **Data Lifecycle:** Seluruh data mengikuti alur siklus: `Draft` -> `Published` -> `Active` -> `Locked` -> `Archived` -> `Trash` -> `Deleted` (menyesuaikan jenis data).
- **Recycle Bin & Soft Delete:** Data tidak dihapus permanen. Penghapusan minimal mencatat `deleted_at` dan `deleted_by`. Data penting masuk ke _Recycle Bin_ dengan retensi **24 Jam** yang akan dihapus otomatis oleh _Cloudflare Cron Worker_.
- **Audit Log:** Seluruh aktivitas penting dan aktivitas dashboard wajib dicatat secara permanen, bersifat _immutable_ (tidak dapat diubah oleh pengguna).
- **Security Standard:** Wajib menerapkan _CSRF Protection_, _XSS Protection_, _SQL Injection Protection_, _Rate Limiting_, _Secure Headers_, _Input Validation_, dan _Output Escaping_.
- **Performance Minimum:** Wajib menggunakan _Server Components_, _Code Splitting_, _Lazy Loading_, _Streaming_, _Optimistic Update_, _Server Side Pagination_, _Server Side Filtering_, _Server Side Sorting_, _Cache_, dan _Edge Rendering_.

---

# BAGIAN 2: KEBUTUHAN SEKUNDER (Spesifikasi Peran, Menu, & Operasional)

## 1. Spesifikasi Detail Dashboard Berdasarkan Role

Setiap pengguna memiliki Dashboard yang berbeda sesuai tugas, tanggung jawab, dan hak aksesnya (_Role Based Dashboard_). Pengguna tidak dapat mengakses Dashboard milik role lain.

### A. Dashboard Sekretariat

- **Fungsi:** Dashboard utama untuk mengelola seluruh administrasi MPHM dengan akses penuh terhadap seluruh modul sesuai kewenangan (telah mencakup hak akses yang sebelumnya dipisah sebagai Admin/Operator).
- **Ringkasan Dashboard (Widget/Statistik):** Total Santri Aktif, Total Alumni, Total Pengajar, Total Pengurus, Tahun Ajaran Aktif, Semester Aktif, Jumlah Kelas, Jumlah Wali Santri, Statistik Kehadiran, Statistik Pelanggaran, Statistik Kelulusan.
- **Struktur Menu:**
- Dashboard
- Pusat Data (Santri, Alumni, Pengajar, Pengurus, Wali Santri, Pencarian Database)
- Akademik (Tahun Ajaran, Semester, Jenjang, Tingkat, Mata Pelajaran, Kelas, Penempatan Santri, Nilai, Absensi, Akhlaq, Pelanggaran, Rapor, Promosi)
- Pengguna (Role, Hak Akses, Akun)
- Master Data (Jenis Pelanggaran, Tingkat Pelanggaran, Dynamic Field)
- Laporan (Akademik, Kehadiran, Pelanggaran, Alumni)
- Pengaturan Sistem (Audit Log, Backup, Konfigurasi)

- **Quick Actions:** Tambah Santri, Tambah Pengajar, Tambah Pengurus, Tambah Tahun Ajaran, Buat Kelas, Jalankan Promosi, Cetak Rapor.

### B. Dashboard Mustahiq (Wali Kelas)

- **Fungsi:** Mengelola aktivitas akademik kelas yang diampunya. **Wajib hanya melihat data dari 1 kelas yang diampunya.** Sistem otomatis menentukan Tahun Ajaran, Kelas, dan Hak Akses setelah login, tanpa perlu memilih secara manual.
- **Ringkasan Dashboard (Widget/Statistik):** Jumlah Santri, Kehadiran Hari Ini, Nilai Belum Diisi, Akhlaq Belum Diisi, Pelanggaran Kelas, Pengumuman.
- **Struktur Menu:** Dashboard, Data Santri Kelas, Absensi, Nilai, Akhlaq, Pelanggaran, Rapor, Profil Santri.
- **Quick Actions:** Input Absensi, Input Nilai, Input Akhlaq, Lihat Profil Santri, Cetak Rekap Nilai.

### C. Dashboard Mufattisy (Pimpinan Tingkatan)

- **Fungsi:** Melakukan monitoring seluruh kelas pada tingkatan yang menjadi tanggung jawabnya. **Wajib hanya melihat data pada Tingkat yang dinaunginya.** Mufattisy **tidak menginput** nilai maupun absensi.
- **Ringkasan Dashboard (Widget/Statistik):** Jumlah Kelas, Jumlah Santri, Persentase Kehadiran, Persentase Pengisian Nilai, Persentase Pengisian Akhlaq, Statistik Pelanggaran, Grafik Perkembangan.
- **Struktur Menu:** Dashboard, Monitoring Kelas, Monitoring Nilai, Monitoring Absensi, Monitoring Akhlaq, Monitoring Pelanggaran, Laporan Tingkatan.
- **Quick Actions:** Lihat Profil Santri, Lihat Rekap Nilai, Lihat Rekap Absensi, Cetak Laporan.

### D. Dashboard Pimpinan / Mundzir

- **Fungsi:** Monitoring seluruh aktivitas MPHM secara menyeluruh tanpa batas visibilitas (seperti Sekretariat). Tidak digunakan untuk pekerjaan administrasi harian.
- **Ringkasan Dashboard (Widget/Statistik):** Total Santri, Total Alumni, Total Pengajar, Total Pengurus, Statistik Akademik, Statistik Kelulusan, Statistik Kehadiran, Statistik Pelanggaran, Grafik Perkembangan Tahunan.
- **Struktur Menu:** Dashboard, Monitoring Akademik, Monitoring Pusat Data, Monitoring Pelanggaran, Monitoring Alumni, Laporan, Statistik.
- **Quick Actions:** Lihat Statistik, Cetak Laporan, Lihat Profil Santri, Lihat Profil Pengajar.

### E. Dashboard Petugas Keamanan

- **Fungsi & Hak Akses khusus:** Melakukan pencatatan dan pemantauan pelanggaran santri berdasarkan kejadian (_Incident-Based Recording_) yang terpisah dari penilaian akhlaq semesteran.
- **Aturan Visibilitas & Alur Kerja:** Hanya bisa melihat data yang dicari saja (tidak menampilkan semua data secara bawaan). Jika data hasil pencarian tidak diklik, maka tidak akan menampilkan informasi detail/lengkapnya.
- **Alur Input Pelanggaran Wajib:** `Mencari Data` -> `Mengeklik Data Santri` -> `Input Pelanggaran` -> `Simpan`.
- **Dilarang keras:** Mengakses, melihat, atau mengubah data akademik (Nilai, Absensi, Akhlaq, Raport).

- **Ringkasan Dashboard (Widget/Statistik):** Pelanggaran Hari Ini, Pelanggaran Minggu Ini, Pelanggaran Bulan Ini, Santri Terbanyak Melanggar, Jenis Pelanggaran Terbanyak, Status Penanganan.
- **Struktur Menu:** Dashboard, Cari Santri, Laporan Pelanggaran, Riwayat Pelanggaran, Statistik Pelanggaran.
- **Quick Actions:** Cari Santri, Tambah Pelanggaran, Upload Bukti, Selesaikan Laporan.

### F. Dashboard Wali Santri

- **Fungsi:** Memantau perkembangan anak yang terhubung langsung dengan akun wali. **Wajib hanya dapat melihat data anaknya saja & hanya data monitoring terkait anaknya saja.** Tidak dapat melihat data santri lain.
- **Ringkasan Dashboard (Widget/Statistik):** Biodata Anak, Kelas Saat Ini, Persentase Kehadiran, Nilai Terbaru, Akhlaq, Pelanggaran, Pengumuman.
- **Struktur Menu:** Dashboard, Profil Anak, Nilai, Absensi, Akhlaq, Pelanggaran, Rapor, Kalender Akademik, Pengumuman.
- **Quick Actions:** Lihat Rapor, Lihat Absensi, Lihat Nilai, Lihat Pengumuman.

## 2. Aturan Pengelolaan Tabel & Data Massal

- **Universal Data Grid Standard:** Seluruh halaman tabel wajib mengikuti satu standar komponen dokumen _Universal Data Grid Standard_. Tidak diperbolehkan membuat implementasi Data Table yang berbeda antar modul.
- **Import & Export:** Seluruh modul yang memiliki proses input data wajib menyediakan fitur: _Import_, _Export_, _Download Template_, dan _Import History_. Format template wajib patuh pada _Universal Data Grid Standard_.
- **Master Jenis Pelanggaran:** Bersifat dinamis dan dikelola secara sentral oleh Administrator melalui Dashboard Sekretariat.

## 3. Prinsip Pengembangan Sistem (Development Principles)

- Setiap kode, modul, dan fitur baru wajib memenuhi prinsip: **SOLID**, **DRY** (_Don't Repeat Yourself_), **KISS** (_Keep It Simple_), _Clean Architecture_, _Feature-Based Architecture_, _Type Safety_, _Reusable Components_, dan _Modular Design_.
- Wajib mengutamakan konsistensi arsitektur dan pemanfaatan komponen _reusable_ yang sudah ada daripada kecepatan implementasi fitur baru.
- **Error Handling:** Seluruh pesan error wajib mudah dipahami, informatif, tidak menampilkan isi teknis internal sistem, serta menyediakan solusi/tindakan berikutnya bagi pengguna.
- **Filosofi Desain Utama:** _Role Based Dashboard_, _Data Scope Authorization_, _Person-Centric Architecture_, _Single Source of Truth_, _Enterprise Information System_, _Mobile First PWA_, _Real-Time Monitoring_, serta _Simple, Fast, dan Mudah Digunakan_.

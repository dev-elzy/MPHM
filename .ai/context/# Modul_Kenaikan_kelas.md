Modul Promosi / Kenaikan Kelas MPHM

1. Tujuan Modul
   Modul Promosi/Kenaikan Kelas digunakan untuk:
   • Melakukan proses akhir tahun ajaran.
   • Menentukan status kelulusan/kenaikan santri.
   • Memindahkan santri ke kelas berikutnya.
   • Membuat riwayat akademik santri.
   • Menangani aturan khusus setiap jenjang.
   • Menyediakan proses verifikasi sebelum data menjadi permanen.
   Modul ini tidak hanya memindahkan kelas, tetapi menjadi academic progression engine.

---

2.  Konsep Dasar
    Tahun Ajaran
    Promosi dilakukan berdasarkan:
    Tahun Ajaran Aktif
    |
    |
    Evaluasi Nilai + Kehadiran + Status Santri
    |
    |
    Keputusan Promosi
    |
    |
    Pembentukan Kelas Tahun Berikutnya
    Contoh:
    2025/2026
    Ibtidaiyyah II-A

            ↓

2026/2027
Ibtidaiyyah III-A

---

3. Status Promosi Santri
   Setiap santri memiliki hasil akhir:
   Status Keterangan
   PROMOTED Naik kelas
   RETAINED Tetap di kelas
   GRADUATED Tamat jenjang
   TRANSFERRED Pindah program
   DROPPED Tidak melanjutkan
   KHIDMAH Masuk Al-Robithoh

---

4. Aturan Promosi Berdasarkan Jenjang
   A. Madrasah Ibtidaiyyah
   Masa pendidikan:
   6 tahun
   Struktur:
   I
   ↓
   II
   ↓
   III
   ↓
   IV
   ↓
   V
   ↓
   VI
   Aturan:
   Kelas Saat Ini Hasil
   I II
   II III
   III IV
   IV V
   V VI
   VI Lulus Ibtidaiyyah

---

B. Madrasah Tsanawiyah
Masa pendidikan:
3 tahun
Struktur:
I
↓
II
↓
III
Aturan:
Kelas Saat Ini Hasil
I II
II III
III Lulus Tsanawiyah

---

C. Madrasah Aliyah
Masa pendidikan:
3 tahun
Struktur:
I
↓
II
↓
III
Aturan:
Kelas Saat Ini Hasil
I II
II III
III Al-Robithoh

---

D. I'dadiyyah
Masa pendidikan:
1 tahun
Struktur:
I'dadiyyah

Tingkat I
Tingkat II
Tingkat III
Catatan:
Tingkat bukan tahun akademik.
Contoh:
2025/2026

I'dadiyyah Tingkat I
|
|
Evaluasi internal
|
|
Tidak otomatis naik tahun
Pada akhir program:
Pilihan:
Lulus I'dadiyyah
|
|
Penempatan:

- Ibtidaiyyah
- Tsanawiyah
- Program lain

---

E. Al-Robithoh
Masa pendidikan:
1 tahun khidmah
Setelah:
Aliyah III
|
↓
Al-Robithoh
|
↓
Selesai Khidmah
Status akhir:
COMPLETED

---

5. Alur Proses Promosi
   Step 1 — Membuka Periode Promosi
   Admin membuat periode:
   Contoh:
   Promosi Tahun Ajaran 2025/2026

Status:
DRAFT
Data:
• Tahun ajaran asal
• Tahun ajaran tujuan
• Jenis promosi
• Operator

---

Step 2 — Generate Kandidat Santri
Sistem mengambil:
• Santri aktif
• Kelas aktif
• Jenjang
• Nilai
• Kehadiran
• Pelanggaran (opsional)
Contoh:
Kelas:
Ibtidaiyyah II-A

Jumlah:
35 santri

---

Step 3 — Evaluasi Otomatis
Sistem memberikan rekomendasi:
Contoh:
Ahmad

Nilai:
Lulus

Kehadiran:
95%

Rekomendasi:
PROMOTED

---

Step 4 — Review Operator
Operator dapat mengubah:
PROMOTED
|
|
RETAINED
dengan alasan.
Contoh:
Status:
Tidak Naik

Alasan:
Belum memenuhi kompetensi akademik

---

Step 5 — Finalisasi Promosi
Setelah disetujui:
Sistem membuat:

1. Riwayat akademik
2. Perubahan kelas
3. Perubahan status
4. Snapshot data

---

6. Database Design
   Table: promotion_periods
   promotion_periods

id
academic_year_from_id
academic_year_to_id

status

created_by
approved_by

created_at
approved_at
Status:
DRAFT
PROCESSING
WAITING_APPROVAL
APPROVED
LOCKED

---

Table: promotion_transactions
Menyimpan hasil setiap santri.
promotion_transactions

id

promotion_period_id

student_id

current_class_id
target_class_id

current_level
target_level

promotion_status

reason

approved_by

created_at

---

Table: academic_history
Riwayat permanen.
academic_history

id

student_id

academic_year_id

institution_level

class_id

status

promotion_transaction_id
Contoh:
Ahmad

2025/2026
Ibtidaiyyah II

2026/2027
Ibtidaiyyah III

---

7. Tampilan Modul
   Menu
   Akademik

└── Promosi / Kenaikan Kelas

      ├── Periode Promosi
      ├── Proses Promosi
      ├── Persetujuan
      ├── Riwayat Promosi
      └── Laporan

---

8. Halaman Periode Promosi
   Tabel:
   Tahun Asal Tahun Tujuan Status
   2025/2026 2026/2027 Draft
   Action:
   • Mulai Proses
   • Lihat Kandidat
   • Finalisasi

---

9. Halaman Kandidat Promosi
   Data Grid:
   Santri Jenjang Kelas Rekomendasi Status
   Ahmad Ibtidaiyyah II-A Naik PROMOTED
   Ali Tsanawiyah III Lulus GRADUATED
   Filter:
   • Jenjang
   • Kelas
   • Status
   • Hasil

---

10. Hak Akses
    Super Admin
    • Semua akses
    Kepala Madrasah
    • Review
    • Persetujuan
    Operator Akademik
    • Generate
    • Edit rekomendasi
    Wali Kelas
    • Melihat kelas sendiri
    • Memberikan rekomendasi

---

11. Integrasi Modul Lain
    Modul ini bergantung pada:
    Academic Year
    |
    |
    Class Management
    |
    |
    Student Management
    |
    |
    Assessment
    |
    |
    Promotion
    |
    |
    Enrollment

---

12. Business Rule Final
1. Promosi hanya dapat dilakukan sekali dalam satu tahun ajaran.
1. Setelah finalisasi, transaksi tidak dapat diedit tanpa proses pembukaan kembali.
1. Semua perubahan harus memiliki audit trail.
1. I'dadiyyah tidak mengikuti kenaikan kelas tahunan.
1. Al-Robithoh otomatis menjadi tujuan setelah Aliyah III apabila memenuhi syarat.
1. Santri yang tidak naik kelas tetap tercatat pada kelas lama di tahun berikutnya.
1. Riwayat akademik tidak boleh dihapus.

jadwal kegiatan, jangan dimasukkan sebagai jadwal harian umum saja, tetapi harus dikaitkan dengan Jenjang → Masa Pendidikan → Tingkat → Kelas karena MPHM memiliki struktur pendidikan yang berbeda.
Konsep yang disesuaikan:
• Ibtida'iyyah → masa 6 tahun (Tingkat I–VI)
• Tsanawiyyah → masa 3 tahun (Tingkat I–III)
• Aliyyah → masa 3 tahun (Tingkat I–III)
• I'dadiyyah → masa 1 tahun (Tingkat I–III hanya pembagian kelompok, bukan kenaikan)
• Al-Robithoh → masa 1 tahun khidmah setelah Aliyyah III
Jadwal dari gambar hanya diambil bagian jam sekolah/madrasah, bukan seluruh kegiatan pondok.
Jawaban untuk implementasi:

---

Silakan buatkan modul Academic Schedule / Jadwal Akademik dengan konsep berbasis Jenjang dan Tingkatan.
Aturan dasar:

1. Jadwal tidak berdiri sendiri, tetapi mengikuti:
   Jenjang
   ↓
   Tingkat
   ↓
   Kelas
   ↓
   Jadwal
2. Master Jenjang:
   I'dadiyyah
   Ibtida'iyyah
   Tsanawiyyah
   Aliyyah
   Al-Robithoh
3. Struktur masa pendidikan:
   I'dadiyyah

- Tingkat I
- Tingkat II
- Tingkat III
  (1 Tahun, tidak ada kenaikan)

Ibtida'iyyah

- Tingkat I
- Tingkat II
- Tingkat III
- Tingkat IV
- Tingkat V
- Tingkat VI
  (6 Tahun)

Tsanawiyyah

- Tingkat I
- Tingkat II
- Tingkat III
  (3 Tahun)

Aliyyah

- Tingkat I
- Tingkat II
- Tingkat III
  (3 Tahun)

Al-Robithoh

- Khidmah
  (1 Tahun)

---

Jadwal Sekolah MPHM
Yang dimasukkan hanya kegiatan sekolah:
Pagi
Waktu Kegiatan Target
07.00 - 09.00 Sekolah Hissoh Ula Ibtida'iyyah II sampai Ibtida’iyyah VI dan Tsanawiyyah I
09.30 - 10.30 Sekolah Hissoh Tsani Ibtida'iyyah II sampai Ibtida’iyyah VI dan Tsanawiyyah I

---

Malam
Waktu Kegiatan Target
19.00 - 21.00 Sekolah Hissoh Ula I’dadiyyah I-III, Tsanawiyyah II, Tsanawiyyah III, Aliyyah I-III
21.30 - 22.30 Sekolah Hissoh Tsani I’dadiyyah I-III, Tsanawiyyah II, Tsanawiyyah III, Aliyyah I-III

---

Business Rule Jadwal
SCH-01
Jadwal harus terikat dengan Tahun Ajaran aktif.
SCH-02
Jadwal dapat dibuat berdasarkan:
Jenjang

- Tingkat
- Kelas
  SCH-03
  Jika jadwal dibuat pada level Tingkat, seluruh kelas pada tingkat tersebut otomatis menggunakan jadwal yang sama.
  Contoh:
  Tsanawiyyah III

        ↓

Tsanawiyyah III-A
Tsanawiyyah III-B
Tsanawiyyah III-C
SCH-04
Jadwal kelas dapat dioverride jika ada kebutuhan khusus.
SCH-05
I'dadiyyah tidak menggunakan sistem kenaikan tingkat tahunan.
SCH-06
Al-Robithoh memiliki jadwal khusus khidmah dan tidak mengikuti jadwal sekolah reguler.

---

Struktur Modul
src/features/schedules/

├── components/
│
├── ScheduleTable.tsx
├── ScheduleFormDialog.tsx
├── ScheduleCalendar.tsx
├── ScheduleTargetSelector.tsx
│
├── queries/
│ └── useSchedules.ts
│
├── mutations/
│ └── useScheduleMutation.ts
│
├── services/
│ └── schedules.service.ts
│
├── schemas/
│ └── index.ts
│
└── types/
└── index.ts

---

Form Jadwal
Field:
Tahun Ajaran
Semester

Target Jadwal:
○ Jenjang
○ Tingkat
○ Kelas

Jenjang:
[Tsanawiyyah]

Tingkat:
[I]

Kelas:
[A]

Hari:
[Senin]

Jam Mulai:
07:00

Jam Selesai:
09:00

Kegiatan:
Sekolah Hissoh Ula

---

Dengan struktur ini, modul jadwal akan siap terintegrasi dengan:
Academic Year
|
Semester
|
Class (Rombel)
|
Student
|
Attendance
|
Schedule
dan tidak bertabrakan dengan aturan promosi/kenaikan kelas MPHM.

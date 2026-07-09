# 05_UI_UX_Guideline.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : UI / UX Guideline
>
> Version : 1.0
>
> Status : APPROVED

---

# 1. Tujuan

Dokumen ini menjadi standar utama dalam seluruh proses desain antarmuka (UI) dan pengalaman pengguna (UX) pada sistem MPHM.

Seluruh halaman wajib memiliki tampilan yang konsisten, modern, profesional, responsif, dan mudah digunakan oleh seluruh pengguna.

Standar ini berlaku untuk seluruh modul tanpa pengecualian.

---

# 2. Design Philosophy

MPHM menggunakan konsep:

> **Ultra-Modern Enterprise Professional SaaS Dashboard (AdminHMD Inspired)**

Karakteristik utama yang WAJIB dipenuhi:
- **Modern & Eksklusif** (Tidak boleh kaku, klasik, atau terlihat seperti sistem lama/tradisional)
- **Profesional & Premium** (Proporsi spasi yang lega, tipografi tajam, kontras visual yang elegan)
- **Bersih (Clean & Scannable)**
- **Informatif & Berorientasi Produktivitas**
- **Konsisten di seluruh modul**

Inspirasi desain berasal dari:
- **AdminHMD Professional Template** (Identity Cell, Pill Badges, Executive Topbar, User Profile Widget)
- Linear
- Vercel Dashboard
- Stripe Dashboard
- Supabase

MPHM **dilarang keras** menggunakan gaya desain kaku/klasik, AdminLTE lama, atau antarmuka yang kurang profesional.

---

# 3. Design Principles

Seluruh halaman wajib mengikuti prinsip berikut.

- Simplicity
- Consistency
- Accessibility
- Readability
- Predictability
- Minimal Click
- Fast Interaction
- Responsive
- Reusable Component
- Enterprise Ready

---

# 4. Design System

Design System menggunakan.

- shadcn/ui
- Tailwind CSS v4
- Design Token
- CSS Variables

Seluruh komponen berasal dari Design System.

Tidak diperbolehkan membuat style sendiri apabila komponen sudah tersedia.

---

# 5. Color System

Menggunakan Neutral Color.

Prioritas.

```text
Primary

Secondary

Success

Warning

Danger

Info

Muted
```

Warna tidak digunakan secara berlebihan.

Warna hanya digunakan sebagai penanda status dan aksi.

---

# 6. Typography

Gunakan satu jenis Font.

Prioritas.

```text
Geist

↓

Inter

↓

System Font
```

Hierarki.

```text
Display

Heading

Title

Body

Caption

Small Text
```

Gunakan ukuran yang konsisten.

---

# 7. Spacing System

Menggunakan skala 4px.

Contoh.

```text
4

8

12

16

20

24

32

40

48

64
```

Tidak menggunakan spacing acak.

---

# 8. Border Radius

Gunakan Radius yang konsisten.

```text
Small

Medium

Large
```

Tidak menggunakan sudut tajam.

---

# 9. Shadow System

Shadow merupakan bagian utama identitas visual MPHM.

Gunakan Shadow bertingkat.

```text
xs

sm

md

lg

xl
```

Shadow digunakan pada.

- Card
- Dialog
- Dropdown
- Popover
- Floating Panel

Tidak menggunakan shadow berlebihan.

---

# 10. Glass & Surface

Gunakan Surface modern.

- Rounded Corner
- Soft Shadow
- Soft Border
- Layered Surface

Efek Glassmorphism hanya digunakan secara terbatas.

---

# 11. Layout

Struktur utama.

```text
Header

↓

Sidebar

↓

Content

↓

Footer (Opsional)
```

Seluruh halaman mengikuti struktur yang sama.

---

# 12. Sidebar (Modern Enterprise AdminHMD Model)

Sidebar bersifat tetap (Fixed layout).

Menu menggunakan Icon + Label dengan kejelasan visual tinggi.

Mendukung:
- Collapse & Expand dengan animasi halus
- Active State bergaya pill / bar tegas
- Nested Menu terstruktur

Wajib memiliki komponen di bagian bawah (Sidebar Footer):
1. **User Profile Card**: Kartu profil rounded eksklusif berisi inisial Avatar, Nama Lengkap, dan Role/Workspace.
2. **System Health Indicator**: Indikator titik hijau aktif berdenyut (*pulsing green dot*) dengan label status sistem (`System running smoothly`).

---

# 13. Header / Executive Topbar

Header wajib bernuansa modern, profesional, dan tidak kaku.

Header minimal berisi:
- **Breadcrumb Navigasi**
- **Executive Search Bar**: Input pencarian berbentuk *pill (`rounded-full`)* dengan shortcut badge `Ctrl K`
- **Notification Bell**: Indikator notifikasi dengan alert badge berdenyut
- **User Profile Pill Menu**: Navigasi profil cepat
- **Theme Toggle**: Pengatur tema Light/Dark Mode

---

# 14. Dashboard

Dashboard menggunakan Widget.

Widget bersifat modular.

Contoh.

- Statistik
- Grafik
- Progress
- Timeline
- Quick Action
- Kalender
- Monitoring
- Aktivitas Terbaru
- Status Sistem

Widget dapat dipindahkan atau ditambah di masa mendatang tanpa mengubah struktur halaman.

---

# 15. Card

Seluruh informasi ditampilkan menggunakan Card.

Karakteristik.

- Rounded
- Shadow
- Padding konsisten
- Header
- Content
- Footer (Opsional)

---

# 16. Data Grid

Seluruh tabel mengikuti dokumen:

Universal Data Grid Standard.

Tidak diperbolehkan menggunakan desain tabel yang berbeda.

---

# 17. Form Design

Seluruh Form memiliki.

- Label
- Placeholder
- Description
- Validation
- Error Message
- Helper Text

Form tidak boleh membingungkan pengguna.

---

# 18. Input Experience

Input harus.

- Cepat
- Mudah
- Konsisten

Gunakan.

- Auto Focus
- Keyboard Friendly
- Auto Complete
- Auto Save (modul tertentu)

---

# 19. Button

Jenis Button.

- Primary
- Secondary
- Outline
- Ghost
- Link
- Destructive

Gunakan ukuran yang konsisten.

---

# 20. Icon

Menggunakan.

Lucide Icons.

Ikon digunakan untuk membantu pemahaman.

Tidak digunakan sebagai dekorasi.

---

# 21. Dialog

Gunakan Dialog untuk.

- Detail
- Import
- Export
- Konfirmasi
- Restore
- Delete

Dialog selalu memiliki.

- Title
- Description
- Primary Action
- Secondary Action

---

# 22. Drawer

Gunakan Drawer pada Mobile.

Dialog besar tidak digunakan pada layar kecil.

---

# 23. Notification

Gunakan Toast.

Jenis.

- Success
- Error
- Warning
- Information

Toast muncul di pojok layar dan menghilang otomatis.

---

# 24. Loading

Gunakan Skeleton.

Tidak menggunakan Spinner penuh halaman.

Loading harus menyerupai bentuk konten yang akan ditampilkan.

---

# 25. Empty State

Apabila data kosong.

Tampilkan.

- Ilustrasi
- Judul
- Penjelasan
- Tombol aksi

Contoh.

```text
Belum ada data siswi.

Tambahkan siswi pertama untuk memulai.
```

---

# 26. Error State

Apabila terjadi kesalahan.

Tampilkan.

- Icon
- Judul
- Penjelasan
- Tombol Refresh

Tidak menampilkan pesan teknis dari server.

---

# 27. Animation

Animation ringan.

Gunakan.

- Fade
- Scale
- Slide
- Hover
- Micro Interaction

Durasi maksimal.

250 ms.

Animation hanya untuk meningkatkan pengalaman pengguna.

---

# 28. Responsive Design

Desktop.

≥1280 px

Tablet.

768–1279 px

Mobile.

<768 px

Semua halaman wajib responsif.

---

# 29. Mobile Experience

Sidebar berubah menjadi Drawer.

Tabel berubah menjadi Card View.

Form tetap nyaman digunakan dengan satu tangan.

Target sentuh minimal 44 × 44 px.

---

# 30. Accessibility

Minimal memenuhi.

- Keyboard Navigation
- Screen Reader
- ARIA Label
- Focus Indicator
- Color Contrast
- Semantic HTML

---

# 31. Search Experience

Search selalu berada di posisi yang mudah dijangkau.

Search menggunakan debounce.

Hasil pencarian tampil secara realtime.

---

# 32. Filter Experience

Filter menggunakan Panel atau Popover.

Filter aktif ditampilkan sebagai Badge.

Pengguna dapat menghapus filter satu per satu atau sekaligus.

---

# 33. Feedback Experience

Setiap aksi pengguna harus memberikan umpan balik.

Contoh.

- Loading
- Success
- Failed
- Warning
- Progress

Pengguna tidak boleh menebak apakah proses sedang berjalan.

---

# 34. Dashboard Monitoring

Dashboard Admin wajib bersifat informatif.

Minimal menampilkan.

- Tahun Ajaran Aktif
- Semester Aktif
- Status Sistem
- Progress Input Nilai
- Progress Finalisasi
- Progress Per Kelas
- Progress Per Mustahiq
- Grafik Aktivitas
- Statistik Siswi
- Statistik Pengguna
- Aktivitas Terbaru
- Notifikasi
- Jadwal Akademik
- Quick Action

Dashboard menjadi pusat kontrol sistem.

---

# 35. Visual Hierarchy

Prioritaskan informasi berdasarkan kepentingannya.

Urutan.

1. Informasi utama
2. Statistik
3. Aksi
4. Detail
5. Metadata

Jangan menampilkan seluruh informasi dengan bobot visual yang sama.

---

# 36. Design Token

Seluruh komponen menggunakan Design Token.

Contoh.

- Color
- Radius
- Shadow
- Font
- Border
- Transition
- Spacing

Tidak menggunakan nilai hardcode.

---

# 37. Reusable Components

Seluruh halaman wajib menggunakan komponen yang sudah tersedia.

Komponen baru hanya dibuat apabila benar-benar belum tersedia.

Duplikasi komponen tidak diperbolehkan.

---

# 38. Performance UX

Antarmuka harus terasa cepat.

Gunakan.

- Optimistic Update
- Skeleton Loading
- Lazy Loading
- Background Refresh
- Prefetch
- Streaming

Pengguna tidak boleh menunggu proses yang sebenarnya dapat dilakukan di belakang layar.

---

# 39. Future Ready

Desain harus mudah dikembangkan untuk mendukung.

- Dark Mode
- Multi Language
- Theme Customization
- Multi Tenant
- Widget Customization
- User Personalization

Tanpa mengubah struktur dasar antarmuka.

---

# 40. UI/UX Principles

Seluruh antarmuka MPHM harus memberikan pengalaman layaknya aplikasi SaaS modern.

Prioritas utama adalah:

- Konsistensi
- Kecepatan
- Kemudahan penggunaan
- Informasi yang jelas
- Estetika modern
- Produktivitas pengguna
- Responsivitas tinggi
- Skalabilitas jangka panjang

Seluruh implementasi UI dan UX wajib mengacu pada dokumen ini agar setiap halaman memiliki identitas visual yang seragam, profesional, dan siap berkembang menjadi sistem enterprise.
# 08_AI_AGENT_RULES.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : AI Agent Rules
>
> Version : 1.0
>
> Status : APPROVED
>
> Target : Antigravity IDE AI

---

# 1. Purpose

Dokumen ini mendefinisikan aturan yang wajib dipatuhi oleh AI Agent selama proses pengembangan sistem MPHM.

AI bukan hanya menghasilkan kode yang berjalan, tetapi juga harus menjaga konsistensi arsitektur, kualitas kode, keamanan, performa, dan kemudahan pengembangan jangka panjang.

AI bertindak sebagai **Senior Software Engineer**, **Software Architect**, **UI Engineer**, **Backend Engineer**, **Database Engineer**, dan **Code Reviewer** secara bersamaan.

---

# 2. Priority Rules

Sebelum menghasilkan kode, AI wajib membaca seluruh dokumen berikut secara berurutan.

```text
00_Project_Vision.md

↓

01_Business_Requirements.md

↓

02_System_Rules.md

↓

Universal_Data_Grid_Standard.md

↓

03_Database_Design.md

↓

04_API_Specification.md

↓

05_UI_UX_Guideline.md

↓

06_Frontend_Architecture.md

↓

07_Development_Guidelines.md

↓

08_AI_AGENT_RULES.md
```

Apabila terjadi konflik.

AI wajib mengikuti dokumen dengan prioritas yang lebih tinggi.

---

# 3. General Rules

AI wajib:

- Menghasilkan kode Production Ready.
- Menghasilkan kode yang dapat langsung dijalankan.
- Menghasilkan kode yang konsisten.
- Menghasilkan kode yang mudah dipelihara.
- Menghasilkan kode yang scalable.
- Menghasilkan kode yang terdokumentasi dengan baik.

AI dilarang menghasilkan:

- Placeholder.
- Dummy Logic.
- TODO.
- Mock Function.
- Fake Data.
- Hardcode yang tidak diperlukan.

---

# 4. Architecture Rules

AI wajib mengikuti:

- Clean Architecture
- Feature Based Architecture
- Component Driven Development
- Modular Programming
- Layered Architecture

AI tidak boleh membuat struktur baru tanpa alasan yang jelas.

---

# 5. Technology Stack

AI wajib menggunakan.

Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- TanStack Query
- TanStack Table
- React Hook Form
- Zod

Backend

- Cloudflare Workers
- OpenNext
- Drizzle ORM

Database

- Cloudflare D1

Storage

- Cloudflare R2

Deployment

- Cloudflare

Tidak diperbolehkan mengganti stack tanpa instruksi.

---

# 6. Folder Rules

AI wajib mengikuti struktur folder yang telah ditentukan.

Tidak membuat folder baru apabila folder yang sesuai sudah tersedia.

Semua fitur wajib berada di dalam folder Feature masing-masing.

---

# 7. Reusable Rules

Sebelum membuat:

- Component
- Hook
- Service
- Utility
- Type
- Schema
- Dialog
- Form

AI wajib mencari apakah implementasi serupa sudah tersedia.

Jika tersedia.

Gunakan implementasi tersebut.

Tidak membuat duplikasi.

---

# 8. UI Rules

Seluruh UI wajib mengikuti.

05_UI_UX_Guideline.md

Karakteristik.

- Modern SaaS
- Enterprise
- Clean
- Responsive
- Professional

Tidak menggunakan template dashboard lama.

---

# 9. Data Grid Rules

Seluruh tabel wajib menggunakan.

Universal Data Grid Standard.

Tidak membuat tabel baru dengan implementasi berbeda.

---

# 10. API Rules

Seluruh komunikasi data menggunakan API.

Component tidak boleh melakukan fetch secara langsung.

Gunakan:

```text
Component

↓

Hook

↓

Service

↓

API

↓

Backend
```

---

# 11. Database Rules

AI wajib menggunakan.

- Drizzle ORM
- Foreign Key
- Index
- Transaction
- Soft Delete

Tidak membuat SQL mentah apabila Drizzle dapat digunakan.

---

# 12. Business Logic Rules

Business Logic hanya berada pada Backend.

Frontend hanya bertugas.

- Menampilkan data.
- Mengirim data.
- Menampilkan Status.
- Menampilkan Error.

---

# 13. Validation Rules

Frontend.

↓

Zod

↓

Backend Validation

Backend selalu menjadi sumber validasi utama.

---

# 14. Workflow Rules

Seluruh perubahan status mengikuti Workflow Engine.

AI tidak boleh melewati Workflow.

---

# 15. Security Rules

AI wajib menerapkan.

- Authentication
- Authorization
- Input Validation
- Output Escaping
- CSRF Protection
- XSS Protection
- SQL Injection Protection
- Rate Limiting

---

# 16. Performance Rules

Prioritas.

- Server Components
- Streaming
- Lazy Loading
- Dynamic Import
- Optimistic Update
- Background Refetch
- Cache
- Virtual Table

Tidak membuat proses yang menyebabkan render berlebihan.

---

# 17. Accessibility Rules

Seluruh UI wajib memiliki.

- Keyboard Navigation
- Focus Indicator
- ARIA Label
- Semantic HTML

---

# 18. Naming Rules

Gunakan.

Folder

```text
kebab-case
```

Component

```text
PascalCase
```

Function

```text
camelCase
```

Hook

```text
useSomething
```

Database

```text
snake_case
```

---

# 19. Import Rules

Seluruh Import mengikuti.

Universal Data Grid Standard.

Flow.

```text
Download Template

↓

Upload

↓

Preview

↓

Validation

↓

Import
```

---

# 20. Export Rules

Seluruh Export mengikuti.

Universal Data Grid Standard.

Format.

- Excel
- CSV
- PDF

---

# 21. Audit Rules

Seluruh perubahan data penting wajib menghasilkan Audit Log.

Audit dibuat otomatis.

AI tidak perlu membuat Audit Log secara manual pada setiap endpoint.

---

# 22. Soft Delete Rules

Seluruh Delete menggunakan.

Soft Delete.

Permanent Delete hanya dilakukan oleh Cloudflare Cron Worker.

---

# 23. Code Quality Rules

AI wajib menghasilkan kode.

- Clean
- Readable
- Typed
- Reusable
- Modular
- Maintainable

Tidak menghasilkan kode yang terlalu kompleks apabila solusi sederhana sudah cukup.

---

# 24. Error Handling Rules

Seluruh Error harus.

- Ditangani.
- Dicatat.
- Ditampilkan dengan baik.
- Tidak menyebabkan aplikasi berhenti.

---

# 25. State Management Rules

Prioritas.

```text
Server State

↓

TanStack Query

↓

React State

↓

Global Store
```

Global Store hanya digunakan apabila benar-benar diperlukan.

---

# 26. AI Decision Rules

Sebelum menghasilkan kode.

AI wajib mengevaluasi.

1.

Apakah solusi ini sesuai Business Requirements?

2.

Apakah sesuai System Rules?

3.

Apakah sesuai Database Design?

4.

Apakah sesuai API Specification?

5.

Apakah UI mengikuti UI Guideline?

6.

Apakah Frontend mengikuti Architecture?

7.

Apakah solusi dapat digunakan kembali?

Jika salah satu jawaban adalah "Tidak".

AI wajib memperbaiki solusi sebelum menghasilkan kode.

---

# 27. Forbidden Actions

AI dilarang.

- Mengubah struktur proyek tanpa instruksi.
- Mengganti teknologi utama.
- Menghapus fitur tanpa instruksi.
- Menghilangkan Audit Log.
- Menghilangkan Soft Delete.
- Mengabaikan Workflow.
- Membuat Business Logic di Frontend.
- Mengakses Database langsung dari UI.
- Menghasilkan kode yang tidak sesuai spesifikasi.

---

# 28. Response Rules

Saat menghasilkan implementasi.

AI wajib.

- Menjelaskan perubahan yang dilakukan.
- Menyebutkan file yang diubah.
- Menjelaskan alasan perubahan.
- Menjaga backward compatibility apabila memungkinkan.

---

# 29. Code Generation Strategy

Saat menerima permintaan implementasi.

AI wajib mengikuti urutan berikut.

```text
Analisis Requirement

↓

Membaca Dokumen

↓

Merancang Solusi

↓

Memastikan Konsistensi

↓

Implementasi

↓

Review Internal

↓

Optimasi

↓

Final Output
```

AI tidak boleh langsung menulis kode tanpa melakukan analisis.

---

# 30. Quality Checklist

Sebelum menyelesaikan implementasi.

AI wajib memastikan.

□ Tidak ada duplicate code.

□ Tidak ada hardcoded value yang tidak diperlukan.

□ Tidak ada TypeScript Error.

□ Tidak ada ESLint Error.

□ Tidak ada unused import.

□ Tidak ada unused variable.

□ Menggunakan reusable component.

□ Menggunakan reusable hook.

□ Menggunakan reusable service.

□ Mengikuti Feature Architecture.

□ Mengikuti Workflow Engine.

□ Mengikuti Universal Data Grid Standard.

□ Menggunakan Soft Delete.

□ Menghasilkan Audit Log.

□ Aman terhadap input pengguna.

□ Responsif.

□ Mudah dipelihara.

---

# 31. Long-Term Vision

Seluruh keputusan implementasi harus mempertimbangkan pengembangan sistem minimal selama lima hingga sepuluh tahun ke depan.

AI harus selalu memilih solusi yang:

- Lebih modular.
- Lebih mudah dikembangkan.
- Lebih mudah diuji.
- Lebih mudah dipelihara.
- Lebih konsisten.
- Lebih aman.
- Lebih efisien.

AI tidak boleh mengorbankan kualitas arsitektur demi solusi yang lebih cepat apabila solusi tersebut akan menyulitkan pengembangan di masa depan.

---

# 32. Final Principle

MPHM bukan sekadar aplikasi administrasi.

MPHM adalah platform akademik berbasis web modern yang dirancang dengan standar Enterprise SaaS.

Seluruh implementasi harus mengutamakan:

- Kualitas Arsitektur
- Konsistensi
- Keamanan
- Performa
- Pengalaman Pengguna
- Skalabilitas
- Maintainability
- Reusability
- Long-Term Sustainability

Apabila terdapat beberapa alternatif implementasi, AI wajib memilih solusi yang paling sesuai dengan seluruh dokumen spesifikasi proyek, bukan sekadar solusi yang paling cepat atau paling sederhana.
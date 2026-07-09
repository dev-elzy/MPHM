# 07_Development_Guidelines.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : Development Guidelines
>
> Version : 1.0
>
> Status : APPROVED

---

# 1. Tujuan

Dokumen ini menjadi standar pengembangan aplikasi MPHM.

Seluruh kode yang dibuat oleh Developer maupun AI wajib mengikuti aturan dalam dokumen ini.

Tujuan utama:

- Konsisten
- Mudah dipelihara
- Mudah dikembangkan
- Mudah dibaca
- Production Ready
- Enterprise Grade

---

# 2. General Principles

Seluruh pengembangan wajib mengikuti prinsip:

- SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- Clean Code
- Clean Architecture
- Separation of Concerns
- Feature-Based Architecture
- Reusable Components
- Type Safety

---

# 3. Source of Truth

Apabila terjadi konflik antar dokumen.

Prioritas mengikuti urutan berikut.

```text
00_Project_Vision

↓

01_Business_Requirements

↓

02_System_Rules

↓

Universal_Data_Grid_Standard

↓

03_Database_Design

↓

04_API_Specification

↓

05_UI_UX_Guideline

↓

06_Frontend_Architecture

↓

07_Development_Guidelines
```

Dokumen dengan prioritas lebih tinggi selalu menjadi acuan utama.

---

# 4. Coding Standards

Seluruh kode wajib:

- Mudah dibaca.
- Konsisten.
- Memiliki nama yang jelas.
- Tidak menggunakan singkatan yang membingungkan.
- Tidak mengandung kode yang tidak digunakan.

---

# 5. TypeScript Rules

Wajib menggunakan:

- Strict Mode
- Type Inference
- Interface atau Type yang jelas
- Zod Schema

Dilarang menggunakan:

```typescript
any
```

kecuali benar-benar tidak dapat dihindari.

---

# 6. Naming Convention

Gunakan penamaan yang konsisten.

Folder:

```text
kebab-case
```

Component:

```text
PascalCase
```

Hook:

```text
useSomething
```

Function:

```text
camelCase
```

Constant:

```text
UPPER_SNAKE_CASE
```

Database:

```text
snake_case
```

---

# 7. Component Rules

Component harus:

- Kecil.
- Reusable.
- Mudah diuji.
- Fokus pada satu tanggung jawab.

Component tidak boleh berisi Business Logic.

---

# 8. Business Logic

Business Logic hanya berada pada Backend.

Frontend hanya bertugas:

- Menampilkan data.
- Mengirim data.
- Menangani interaksi pengguna.

---

# 9. API Rules

Frontend tidak boleh memanggil endpoint secara langsung dari Component.

Seluruh komunikasi API melalui Service Layer.

---

# 10. Form Rules

Seluruh Form menggunakan:

- React Hook Form
- Zod

Tidak menggunakan useState sebagai pengelola utama Form.

---

# 11. Validation Rules

Validasi dilakukan pada:

Frontend

↓

Backend

Backend selalu menjadi validasi utama.

---

# 12. Error Handling

Seluruh Error harus:

- Ditangani.
- Dicatat.
- Tidak menyebabkan aplikasi berhenti.

Tidak diperbolehkan membiarkan Promise tanpa penanganan Error.

---

# 13. Logging

Gunakan Logging untuk:

- Error
- Warning
- Audit
- Background Job

Jangan melakukan logging data sensitif.

---

# 14. Security

Seluruh input dianggap tidak terpercaya.

Semua data wajib divalidasi.

Gunakan:

- CSRF Protection
- XSS Protection
- SQL Injection Protection
- Secure Cookie
- HttpOnly Cookie

---

# 15. Performance

Prioritaskan:

- Server Component
- Lazy Loading
- Dynamic Import
- Streaming
- Memoization bila diperlukan
- Server Pagination

---

# 16. Reusable Principle

Sebelum membuat:

- Component
- Hook
- Service
- Utility

Developer wajib memastikan bahwa implementasi serupa belum tersedia.

---

# 17. Database Rules

Gunakan:

- Drizzle ORM
- Transaction
- Foreign Key
- Index

Tidak diperbolehkan membuat SQL mentah tanpa alasan yang jelas.

---

# 18. Import & Export

Seluruh fitur Import dan Export mengikuti:

Universal Data Grid Standard.

Tidak membuat implementasi yang berbeda.

---

# 19. Audit Log

Seluruh perubahan data penting wajib menghasilkan Audit Log secara otomatis.

Audit Log tidak dibuat secara manual pada setiap halaman.

---

# 20. Soft Delete

Seluruh penghapusan data penting menggunakan:

Soft Delete.

Penghapusan permanen hanya dilakukan oleh Cloudflare Cron Worker setelah melewati masa retensi.

---

# 21. Workflow

Seluruh perubahan status wajib melalui Workflow Engine.

Tidak diperbolehkan mengubah status secara langsung tanpa validasi workflow.

---

# 22. Git Convention

Branch.

```text
main

develop

feature/*

fix/*

hotfix/*
```

Commit mengikuti Conventional Commits.

Contoh.

```text
feat:

fix:

refactor:

docs:

style:

test:

chore:
```

---

# 23. Environment Variables

Seluruh konfigurasi menggunakan Environment Variables.

Tidak menyimpan Secret di dalam source code.

---

# 24. Dependency Rules

Tidak menambahkan dependency baru apabila:

- Sudah ada solusi bawaan.
- Sudah tersedia pada stack proyek.

Setiap dependency baru harus memiliki alasan yang jelas.

---

# 25. Code Review Checklist

Sebelum Merge.

Pastikan:

- Tidak ada Error.
- Tidak ada Warning.
- Tidak ada Duplicate Code.
- TypeScript bersih.
- Build berhasil.
- UI responsif.
- Validasi berjalan.
- Audit Log berfungsi.

---

# 26. Deployment

Deployment menggunakan:

- OpenNext.js
- Cloudflare Workers
- Cloudflare D1
- Cloudflare R2

Deployment harus dilakukan melalui Pipeline yang konsisten.

---

# 27. Documentation

Seluruh fitur baru wajib memperbarui dokumentasi apabila memengaruhi:

- Business Rules
- API
- Database
- UI
- Workflow

---

# 28. Testing

Minimal dilakukan:

- Functional Testing
- Integration Testing
- User Acceptance Testing (UAT)

Fitur penting harus diuji sebelum dipublikasikan.

---

# 29. AI Development Rules

Seluruh AI yang digunakan dalam proyek wajib:

- Mengikuti seluruh dokumen spesifikasi.
- Tidak membuat asumsi di luar spesifikasi.
- Tidak mengubah struktur proyek tanpa instruksi.
- Mengutamakan reuse daripada membuat kode baru.
- Menghasilkan kode yang siap produksi.
- Menjaga konsistensi arsitektur proyek.

---

# 30. Development Principles

Setiap perubahan pada proyek harus memenuhi tiga pertanyaan berikut.

1. Apakah solusi ini konsisten dengan arsitektur proyek?
2. Apakah solusi ini dapat digunakan kembali?
3. Apakah solusi ini tetap mudah dipelihara lima tahun ke depan?

Jika salah satu jawaban adalah **tidak**, maka solusi tersebut harus ditinjau kembali sebelum diimplementasikan.

Dokumen ini merupakan pedoman utama bagi seluruh proses pengembangan MPHM agar aplikasi tetap konsisten, scalable, aman, dan mudah dikembangkan dalam jangka panjang.
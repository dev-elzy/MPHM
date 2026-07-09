# MPHM Full System Audit & Implementation Plan

> **Audit Date:** 2026-07-08
> **Scope:** 100% audit seluruh blueprint `.ai/context` vs implementasi aktual
> **Blueprint Documents:** 16 files | **Status:** COMPREHENSIVE AUDIT COMPLETED

---

## Executive Summary

Proyek MPHM berada pada **fase awal (~15% dari blueprint)**. Fondasi teknologi (Next.js 16, React 19, Tailwind v4, shadcn/ui, Drizzle ORM, Cloudflare) sudah terpasang dengan benar. Tiga modul frontend telah di-scaffold dengan mock service (Academic Years, Semesters, Classes). Namun **belum ada backend API, database schema lengkap, authentication, authorization, maupun modul bisnis inti**.

---

## Audit Scorecard

| Kategori                  | Blueprint                                                            | Implementasi                                   | Status          | Score |
| ------------------------- | -------------------------------------------------------------------- | ---------------------------------------------- | --------------- | ----- |
| **Tech Stack**            | Next.js 15+, React 19, Tailwind v4, shadcn/ui                        | Next.js 16, React 19, Tailwind v4, shadcn/ui   | ✅ Sesuai       | 95%   |
| **Folder Structure**      | Feature-Based Architecture                                           | `src/features/`, `src/components/`, `src/lib/` | ✅ Sesuai       | 85%   |
| **Database Schema**       | 20+ tabel (users, academic_years, semesters, classes, students, dll) | Hanya `users` (minimal)                        | ❌ Kritis       | 5%    |
| **Database Migrations**   | Harus tersedia                                                       | Folder kosong                                  | ❌ Belum ada    | 0%    |
| **API/Backend**           | RESTful `/api/v1/*`, Middleware, RBAC                                | Tidak ada API routes                           | ❌ Belum ada    | 0%    |
| **Authentication**        | Session Cookie, HttpOnly, Middleware                                 | Mock service saja                              | ❌ Belum ada    | 5%    |
| **Authorization (RBAC)**  | 5 Role, Permission system                                            | Belum ada                                      | ❌ Belum ada    | 0%    |
| **Academic Workspace**    | Tahun Ajaran → Semester → Kelas → Siswi → Nilai                      | Mock data, no real workspace                   | ⚠️ Skeleton     | 15%   |
| **Modul Tahun Ajaran**    | CRUD + Clone + Workflow                                              | UI table + form dialog (mock)                  | ⚠️ UI Only      | 25%   |
| **Modul Semester**        | CRUD + Status per Academic Year                                      | UI table + form dialog (mock)                  | ⚠️ UI Only      | 25%   |
| **Modul Kelas (Rombel)**  | CRUD + Jenjang/Tingkat/Bagian + Assignment                           | UI table + form dialog (mock)                  | ⚠️ UI Only      | 25%   |
| **Modul Kurikulum**       | CRUD + Curriculum Subjects                                           | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul Mata Pelajaran**  | Master + Curriculum binding                                          | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul Siswi**           | CRUD + Import/Export + Status                                        | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul User Management** | CRUD + Role + Reset Password                                         | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul Score**           | Input Nilai + Auto Save + Finalisasi                                 | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul Absensi**         | Attendance per semester/class                                        | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul Akhlaq**          | Penilaian Akhlaq terpisah                                            | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul Raport**          | Generate + PDF + Workflow                                            | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul Jadwal**          | Schedule per Jenjang/Tingkat/Kelas                                   | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Modul Kenaikan Kelas**  | Promotion Engine + History                                           | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Dashboard**             | Role-based widgets, realtime                                         | Placeholder saja                               | ⚠️ Placeholder  | 5%    |
| **Audit Log**             | Immutable, auto-generated                                            | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Recycle Bin**           | Soft Delete + Cron Worker                                            | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Monitoring**            | Realtime progress tracking                                           | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Import/Export**         | Universal standard                                                   | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Universal Data Grid**   | Standar tabel universal                                              | `DataTable` basic saja                         | ⚠️ Basic        | 15%   |
| **Workflow Engine**       | Status transitions + validation                                      | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Notification**          | In-app + Toast                                                       | Sonner toast saja                              | ⚠️ Partial      | 20%   |
| **Security**              | CSRF, XSS, Rate Limiting                                             | Tidak ada                                      | ❌ Belum ada    | 0%    |
| **Performance**           | SSR, Streaming, Lazy Loading                                         | Partial (Next.js default)                      | ⚠️ Partial      | 30%   |
| **Responsive/Mobile**     | Desktop/Tablet/Mobile + Card View                                    | Sidebar responsive, basic                      | ⚠️ Partial      | 30%   |
| **UI/UX Premium**         | Modern SaaS, Glassmorphism, Animations                               | Basic implementation                           | ⚠️ Needs Polish | 25%   |

---

## Detail Gap Analysis

### 1. Database Schema (KRITIS - 5%)

**Blueprint requirement:** 20+ tabel termasuk `academic_years`, `academic_settings`, `curriculums`, `curriculum_subjects`, `semesters`, `classes`, `students`, `class_assignments`, `score_sessions`, `scores`, `score_results`, `attendance`, `akhlaq`, `reports`, `notifications`, `audit_logs`, `import_histories`, `export_histories`, `roles`, `permissions`, `user_roles`.

**Actual:** Hanya 1 tabel `users` minimal — tanpa `deleted_by`, `created_by`, `updated_by`, `password_hash`, `status`.

> [!CAUTION]
> Database adalah fondasi seluruh sistem. Tanpa schema lengkap, seluruh fitur akan terus menggunakan mock data.

### 2. API Backend (KRITIS - 0%)

**Blueprint requirement:** RESTful API `/api/v1/*` dengan middleware authentication, authorization, validation, business service, repository layer.

**Actual:** Tidak ada satu pun API route di `src/app/api/`.

### 3. Authentication & Authorization (KRITIS - 0%)

**Blueprint requirement:** Session Cookie (HttpOnly, Secure, SameSite), RBAC (5 roles), middleware protection, session rotation.

**Actual:** Mock auth service saja. Login page ada tetapi non-fungsional.

### 4. Workflow Engine (KRITIS - 0%)

**Blueprint requirement:** Status transitions (Draft → Published → Active → Archived), validation per transition, audit per transition.

**Actual:** Tidak ada implementasi workflow.

### 5. Universal Data Grid (15%)

**Blueprint requirement:** Search (realtime debounce), Filter, Column Manager, Bulk Selection, Bulk Action, Import/Export, Sorting, Pagination (10-500), Responsive (card view mobile), Skeleton loading, Empty state, Error state.

**Actual:** Basic `DataTable` component — hanya render tabel biasa.

### 6. Shared Components Yang Hilang

| Required                        | Status                                 |
| ------------------------------- | -------------------------------------- |
| `<DataGrid />` universal        | ❌ Perlu dibangun ulang dari DataTable |
| `ImportDialog`                  | ❌ Belum ada                           |
| `ExportDialog`                  | ❌ Belum ada                           |
| `SearchBox` (realtime debounce) | ❌ Belum ada                           |
| `FilterPanel`                   | ❌ Belum ada                           |
| `BulkToolbar`                   | ❌ Belum ada                           |
| `Pagination` (server-side)      | ❌ Belum ada                           |
| `Breadcrumb`                    | ❌ Belum ada di Header                 |
| `Drawer` (mobile)               | ❌ Belum ada                           |
| `Tooltip`                       | ❌ Belum di-install                    |
| `Popover`                       | ❌ Belum di-install                    |
| `Tabs`                          | ❌ Belum di-install                    |
| `Calendar`                      | ❌ Belum ada                           |
| `Chart`                         | ❌ Belum ada                           |
| `ProgressBar`                   | ❌ Belum ada                           |

---

## User Review Required

> [!IMPORTANT]
> **Pendekatan Implementasi:** Karena gap sangat besar, saya merekomendasikan pendekatan **Phase-by-Phase** dari fondasi ke atas. Setiap phase menghasilkan deliverable yang dapat diuji.

> [!WARNING]
> **Mock vs Real Backend:** Saat ini seluruh UI menggunakan mock service. Pilihan:
>
> 1. **Bangun backend dulu** → lalu integrasikan UI
> 2. **Lanjutkan mock** → bangun semua UI dahulu, lalu backend
> 3. **Parallel** → Backend + UI bersamaan per modul
>
> Rekomendasi: **Opsi 1 — Backend first** karena blueprint menekankan "Database First, API First"

---

## Proposed Changes — Phased Implementation

---

### PHASE 1: Foundation Layer (Database + Auth + Core Infrastructure)

Fondasi yang harus ada sebelum modul apapun bisa berfungsi secara nyata.

---

#### 1.1 Database Schema Lengkap

##### [NEW] `src/db/schema/roles.ts`

- Tabel `roles` (id, name, description, is_system, timestamps)
- Tabel `permissions` (id, name, module, action, description)
- Tabel `role_permissions` (role_id, permission_id)

##### [NEW] `src/db/schema/academic-years.ts`

- Tabel `academic_years` (id, name, start_date, end_date, status, timestamps, soft_delete)
- Tabel `academic_settings` (id, academic_year_id, key, value, timestamps)

##### [NEW] `src/db/schema/semesters.ts`

- Tabel `semesters` (id, academic_year_id, name, type, start_date, end_date, is_active, timestamps)

##### [NEW] `src/db/schema/curriculums.ts`

- Tabel `curriculums` (id, academic_year_id, name, description, status, timestamps, soft_delete)
- Tabel `subjects` (id, name, arabic_name, description, status, timestamps)
- Tabel `curriculum_subjects` (id, curriculum_id, subject_id, order, max_score, min_score, weight, status, timestamps)

##### [NEW] `src/db/schema/classes.ts`

- Tabel `classes` (id, academic_year_id, semester_id, curriculum_id, jenjang, tingkat, bagian, name, status, timestamps, soft_delete)
- Tabel `class_assignments` (id, academic_year_id, class_id, user_id, role, start_date, end_date, status, timestamps)

##### [NEW] `src/db/schema/students.ts`

- Tabel `students` (id, nis, name, birth_date, birth_place, address, parent_name, phone, status, timestamps, soft_delete)
- Tabel `class_students` (id, academic_year_id, semester_id, class_id, student_id, status, timestamps)

##### [NEW] `src/db/schema/scores.ts`

- Tabel `score_sessions` (id, academic_year_id, semester_id, class_id, curriculum_subject_id, status, timestamps)
- Tabel `scores` (id, score_session_id, student_id, score_type, score, notes, timestamps)
- Tabel `score_results` (id, score_session_id, student_id, khos_score, am_score, predicate, ranking, timestamps)

##### [NEW] `src/db/schema/attendance.ts`

- Tabel `attendance` (id, academic_year_id, semester_id, class_id, student_id, date, status, notes, timestamps)

##### [NEW] `src/db/schema/akhlaq.ts`

- Tabel `akhlaq` (id, academic_year_id, semester_id, class_id, student_id, category, grade, notes, timestamps)

##### [NEW] `src/db/schema/reports.ts`

- Tabel `reports` (id, academic_year_id, semester_id, class_id, student_id, data_json, status, timestamps)

##### [NEW] `src/db/schema/notifications.ts`

- Tabel `notifications` (id, user_id, title, message, type, module, is_read, timestamps)

##### [NEW] `src/db/schema/audit-logs.ts`

- Tabel `audit_logs` (id, user_id, module, action, old_data, new_data, ip_address, user_agent, timestamps)

##### [NEW] `src/db/schema/import-export.ts`

- Tabel `import_histories` (id, user_id, module, file_name, total, success, failed, error_detail, timestamps)
- Tabel `export_histories` (id, user_id, module, format, filter, total, timestamps)

##### [MODIFY] [users.ts](file:///d:/DEVELZY/MPHM/src/db/schema/users.ts)

- Tambah: `password_hash`, `status`, `role_id`, `phone`, `avatar_url`, `last_login_at`, `created_by`, `updated_by`, `deleted_by`

##### [MODIFY] [index.ts](file:///d:/DEVELZY/MPHM/src/db/schema/index.ts)

- Export semua schema baru

---

#### 1.2 Authentication System

##### [NEW] `src/lib/auth/session.ts`

- Session management (create, validate, rotate, destroy)
- HttpOnly Secure Cookie handling

##### [NEW] `src/lib/auth/password.ts`

- Password hashing & verification

##### [NEW] `src/lib/auth/middleware.ts`

- Auth middleware untuk route protection
- Role-based access check

##### [NEW] `src/app/api/v1/auth/login/route.ts`

##### [NEW] `src/app/api/v1/auth/logout/route.ts`

##### [NEW] `src/app/api/v1/auth/me/route.ts`

##### [MODIFY] Login page — integrasi dengan real auth

---

#### 1.3 Core Infrastructure

##### [NEW] `src/lib/api/response.ts`

- Universal API response helper (`{success, message, data}` / `{success, message, errors}`)

##### [NEW] `src/lib/api/validation.ts`

- Zod validation middleware untuk API routes

##### [NEW] `src/lib/api/pagination.ts`

- Server-side pagination helper (page, limit, sort, order)

##### [NEW] `src/lib/audit/index.ts`

- Auto audit log generator

##### [NEW] `src/lib/workflow/index.ts`

- Workflow Engine (status transitions, validation, audit)

##### [NEW] `src/lib/soft-delete/index.ts`

- Soft delete utilities

---

### PHASE 2: Universal Components & UI System

Shared components yang dibutuhkan oleh semua modul.

---

##### [NEW] `src/components/ui-custom/DataGrid.tsx`

- Komponen tabel universal sesuai Universal Data Grid Standard
- Server-side pagination, filtering, sorting
- Bulk selection + Bulk toolbar
- Column manager (show/hide/reorder)
- Responsive (card view di mobile)

##### [NEW] `src/components/ui-custom/SearchBox.tsx`

- Realtime search dengan debounce

##### [NEW] `src/components/ui-custom/FilterPanel.tsx`

- Dynamic filter panel per modul

##### [NEW] `src/components/ui-custom/ImportDialog.tsx`

- Upload → Preview → Validation → Import flow

##### [NEW] `src/components/ui-custom/ExportDialog.tsx`

- Export Excel/CSV/PDF dengan filter aktif

##### [NEW] `src/components/ui-custom/BulkToolbar.tsx`

- Bulk action toolbar

##### [NEW] `src/components/ui-custom/Pagination.tsx`

- Server-side pagination (10/25/50/100/250/500)

##### [NEW] `src/components/ui-custom/Breadcrumb.tsx`

- Breadcrumb navigation

##### Install shadcn/ui tambahan:

- `tooltip`, `popover`, `tabs`, `progress`, `checkbox`, `switch`, `textarea`, `calendar`, `command`

##### [MODIFY] [Header.tsx](file:///d:/DEVELZY/MPHM/src/components/layout/Header.tsx)

- Tambah Breadcrumb, Notification bell, glass effect, scroll shadow

##### [MODIFY] [Sidebar.tsx](file:///d:/DEVELZY/MPHM/src/components/layout/Sidebar.tsx)

- Tambah semua menu modul, nested menu, mobile drawer

---

### PHASE 3: Academic Workspace (Core Modules)

Modul inti yang membentuk Academic Workspace.

---

#### 3.1 Modul Tahun Ajaran (Complete)

##### [NEW] `src/app/api/v1/academic-years/route.ts` — CRUD API

##### [NEW] `src/app/api/v1/academic-years/[id]/route.ts` — Detail/Update/Delete

##### [NEW] `src/app/api/v1/academic-years/[id]/clone/route.ts` — Clone

##### [NEW] `src/app/api/v1/academic-years/[id]/workflow/route.ts` — Status transitions

##### [MODIFY] Feature `academic-years` — Ganti mock service → real API

##### Workflow: Draft → Published → Active → Archived

#### 3.2 Modul Semester (Complete)

##### [NEW] `src/app/api/v1/semesters/route.ts`

##### [MODIFY] Feature `academic-years` semester components → real API

#### 3.3 Modul Kurikulum

##### [NEW] `src/features/curriculums/` — Full feature structure

##### [NEW] `src/app/api/v1/curriculums/route.ts`

##### [NEW] `src/app/dashboard/akademik/kurikulum/page.tsx`

#### 3.4 Modul Mata Pelajaran

##### [NEW] `src/features/subjects/` — Full feature structure

##### [NEW] `src/app/api/v1/subjects/route.ts`

##### [NEW] `src/app/dashboard/akademik/mata-pelajaran/page.tsx`

#### 3.5 Modul Kelas (Complete Rombel)

##### [NEW] `src/app/api/v1/classes/route.ts` — CRUD + Jenjang/Tingkat/Bagian

##### [NEW] `src/app/api/v1/classes/[id]/assign/route.ts` — Assign Mustahiq

##### [MODIFY] Feature `classes` — Ganti mock → real API

---

### PHASE 4: Student & User Management

---

#### 4.1 Modul Siswi

##### [NEW] `src/features/students/` — Full feature structure

##### [NEW] `src/app/api/v1/students/route.ts` — CRUD + Import/Export

##### [NEW] `src/app/dashboard/akademik/siswi/page.tsx`

##### Import/Export mengikuti Universal Data Grid Standard

#### 4.2 Modul User Management

##### [NEW] `src/features/users/` — Full feature structure

##### [NEW] `src/app/api/v1/users/route.ts`

##### [NEW] `src/app/dashboard/pengguna/page.tsx`

##### [NEW] `src/app/dashboard/pengguna/roles/page.tsx`

---

### PHASE 5: Score Management & Finalization

---

#### 5.1 Modul Input Nilai

##### [NEW] `src/features/scores/` — Full feature structure

##### [NEW] `src/app/api/v1/score-sessions/route.ts`

##### [NEW] `src/app/api/v1/scores/route.ts` — Auto Save (PATCH)

##### Auto Save: Typing → Debounce → Validation → PATCH → Toast

#### 5.2 Modul Absensi

##### [NEW] `src/features/attendance/` — Full feature structure

##### [NEW] `src/app/api/v1/attendance/route.ts`

#### 5.3 Modul Akhlaq

##### [NEW] `src/features/akhlaq/` — Full feature structure

##### [NEW] `src/app/api/v1/akhlaq/route.ts`

#### 5.4 Finalisasi & Raport

##### [NEW] `src/features/reports/` — Full feature structure

##### [NEW] `src/app/api/v1/finalize/route.ts`

##### [NEW] `src/app/api/v1/reports/route.ts`

##### Workflow: Draft → Verified → Published

---

### PHASE 6: Dashboard, Monitoring & Audit

---

#### 6.1 Dashboard Role-Based

##### [NEW] `src/features/dashboard/components/AdminDashboard.tsx`

- Statistic Cards, Progress, Charts, Activity Timeline, Quick Actions

##### [NEW] `src/features/dashboard/components/MustahiqDashboard.tsx`

##### [NEW] `src/features/dashboard/components/MudirDashboard.tsx`

##### [NEW] `src/app/api/v1/dashboard/admin/route.ts`

##### [NEW] `src/app/api/v1/dashboard/mustahiq/route.ts`

#### 6.2 Monitoring

##### [NEW] `src/features/monitoring/` — Progress per kelas, per mapel, per mustahiq

##### [NEW] `src/app/api/v1/monitoring/route.ts`

#### 6.3 Audit Log Viewer

##### [NEW] `src/features/audit/` — Read-only audit log viewer

##### [NEW] `src/app/dashboard/audit/page.tsx`

#### 6.4 Recycle Bin

##### [NEW] `src/features/recycle-bin/` — Cross-module recycle bin

##### [NEW] `src/app/dashboard/recycle-bin/page.tsx`

##### Cloudflare Cron Worker untuk permanent delete

#### 6.5 Notification System

##### [NEW] `src/features/notifications/` — In-app notifications

##### [NEW] `src/app/api/v1/notifications/route.ts`

---

### PHASE 7: Advanced Modules

---

#### 7.1 Modul Jadwal Akademik

##### [NEW] `src/features/schedules/` — Per Jenjang/Tingkat/Kelas

##### Business rules: SCH-01 sampai SCH-06

#### 7.2 Modul Kenaikan Kelas (Promosi)

##### [NEW] `src/features/promotions/` — Academic Progression Engine

##### Tables: `promotion_periods`, `promotion_transactions`, `academic_history`

---

### PHASE 8: Polish & Production

---

#### 8.1 Security Hardening

- CSRF Protection
- XSS Protection
- Rate Limiting
- Secure Headers
- Input sanitization

#### 8.2 Performance Optimization

- Server Components optimization
- Streaming + Suspense
- Image optimization
- Code splitting audit

#### 8.3 UI/UX Polish

- Micro-animations sesuai `ui_ux_directory.md`
- Glass effect Header
- Premium card design
- Dark mode refinement
- Mobile responsive audit

#### 8.4 Deployment

- OpenNext + Cloudflare Workers setup
- D1 database provisioning
- R2 storage setup
- Cron Workers (Recycle Bin cleanup)
- Environment variables

---

## Open Questions

> [!IMPORTANT]
>
> 1. **Database seeding:** Apakah perlu seed data awal (roles, permissions, admin user, jenjang/tingkat master data)?
> 2. **Prioritas fase:** Apakah urutan phase di atas sudah sesuai kebutuhan, atau ada modul yang harus didahulukan?
> 3. **Mock vs Real:** Apakah setuju dengan pendekatan "Backend First" — bangun database + API dulu sebelum membangun UI modul baru?
> 4. **Cloudflare D1:** Apakah D1 database sudah di-provision? Apakah credentials sudah tersedia di environment?
> 5. **Multi-tenant:** Blueprint menyebut Multi Tenant sebagai roadmap. Apakah schema perlu disiapkan untuk multi-tenant dari awal?

---

## Verification Plan

### Automated Tests

- `npm run build` — Memastikan build berhasil
- `npm run lint` — Memastikan tidak ada ESLint error
- TypeScript strict mode check

### Manual Verification

- Setiap fase diverifikasi fungsionalitasnya sebelum lanjut ke fase berikutnya
- Database migration dijalankan dan divalidasi
- API endpoints diuji dengan HTTP client
- UI responsive diuji di 3 viewport (Desktop/Tablet/Mobile)

---

## Summary

| Total Modules Blueprint | Implemented  | Gap                       |
| ----------------------- | ------------ | ------------------------- |
| 16+ modules             | 3 (skeleton) | **13+ modules belum ada** |
| 20+ DB tables           | 1 (minimal)  | **19+ tables missing**    |
| 40+ API endpoints       | 0            | **40+ endpoints missing** |
| 15+ shared components   | 6 (basic)    | **9+ components missing** |

**Estimated effort:** 8 phases, sequential execution recommended

Saya siap memulai dari **Phase 1** setelah mendapat persetujuan Anda.

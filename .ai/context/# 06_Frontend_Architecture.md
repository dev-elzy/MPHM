# 06_Frontend_Architecture.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : Frontend Architecture
>
> Version : 1.0
>
> Status : APPROVED

---

# 1. Tujuan

Dokumen ini mendefinisikan standar arsitektur Frontend yang wajib diikuti selama proses pengembangan.

Seluruh implementasi React, Next.js, UI Component, State Management, API Integration, Routing, Form, dan Data Fetching harus mengikuti dokumen ini.

Tujuan utama:

- Konsisten
- Mudah dipelihara
- Mudah dikembangkan
- Reusable
- Enterprise Grade
- AI Friendly

---

# 2. Technology Stack

Frontend wajib menggunakan teknologi berikut.

| Technology          | Version       |
| ------------------- | ------------- |
| Next.js             | 15+           |
| React               | 19            |
| TypeScript          | Latest Stable |
| Tailwind CSS        | v4            |
| shadcn/ui           | Latest        |
| TanStack Query      | Latest        |
| TanStack Table      | Latest        |
| React Hook Form     | Latest        |
| Zod                 | Latest        |
| Lucide Icons        | Latest        |
| OpenNext Cloudflare | Latest        |

Library lain hanya boleh ditambahkan apabila benar-benar diperlukan.

---

# 3. Architecture Principle

Frontend menggunakan prinsip:

- Feature Based Architecture
- Component Driven Development
- Server First
- Reusable Components
- Separation of Concerns
- Clean Architecture
- Type Safe

Business Logic tidak boleh berada di dalam React Component.

---

# 4. Folder Structure

```text
src/

├── app/
│
├── components/
│
├── features/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── providers/
│
├── stores/
│
├── types/
│
├── utils/
│
└── styles/
```

---

# 5. Feature Based Architecture

Seluruh fitur berada pada folder:

```text
features/
```

Contoh.

```text
features/

auth/

dashboard/

academic-years/

curriculums/

subjects/

classes/

students/

scores/

reports/

users/

roles/

settings/

notifications/

audit/

recycle-bin/
```

Setiap Feature berdiri sendiri.

---

# 6. Struktur Setiap Feature

```text
students/

components/

hooks/

schemas/

services/

queries/

mutations/

types/

utils/

constants/

pages/
```

Seluruh kebutuhan Feature berada pada folder Feature tersebut.

---

# 7. Shared Components

Komponen umum ditempatkan pada.

```text
components/
```

Contoh.

```text
Button

Input

Card

Dialog

Modal

Badge

Avatar

Skeleton

Table

Pagination

SearchBox

ImportDialog

ExportDialog

DataGrid
```

Tidak boleh terjadi duplikasi komponen.

---

# 8. Data Grid

Seluruh tabel menggunakan satu komponen.

```text
<DataGrid />
```

Mengikuti dokumen:

Universal Data Grid Standard.

Tidak diperbolehkan membuat tabel sendiri.

---

# 9. Routing

Menggunakan App Router.

```text
app/

(auth)

(dashboard)

(class)

(student)

(score)

(report)

(settings)
```

Route dikelompokkan menggunakan Route Group.

---

# 10. Server Component

Default.

Seluruh halaman menggunakan:

Server Component.

Gunakan Client Component hanya apabila membutuhkan:

- Event
- State
- Browser API
- Animation
- Form Interaction

Server Component selalu diprioritaskan.

---

# 11. Client Component

Gunakan hanya apabila benar-benar diperlukan.

Contoh.

- Modal
- Dialog
- Dropdown
- Form
- Chart
- Auto Save
- Drag & Drop

---

# 12. Data Fetching

Menggunakan.

Server Component

↓

Server Action

↓

TanStack Query

Pemilihan dilakukan berdasarkan kebutuhan.

---

# 13. TanStack Query

TanStack Query digunakan untuk:

- Cache
- Mutation
- Optimistic Update
- Revalidation
- Background Refetch

Seluruh Query memiliki Query Key yang konsisten.

Contoh.

```text
academic-years

students

scores

classes

dashboard
```

---

# 14. Mutation

Seluruh perubahan data menggunakan Mutation.

Contoh.

```text
Create

Update

Delete

Restore

Import

Export

Finalize
```

---

# 15. Optimistic Update

Seluruh perubahan ringan menggunakan Optimistic Update.

Contoh.

- Status
- Toggle
- Auto Save

---

# 16. React Hook Form

Seluruh Form menggunakan:

React Hook Form.

Tidak menggunakan useState untuk mengelola Form.

---

# 17. Validation

Menggunakan.

Zod

↓

React Hook Form

↓

Backend Validation

Frontend hanya untuk User Experience.

---

# 18. Form Standard

Semua Form memiliki.

- Validation
- Error Message
- Loading
- Disabled State
- Success Toast

---

# 19. Auto Save

Input Nilai menggunakan Auto Save.

Flow.

```text
Typing

↓

Debounce

↓

Validation

↓

Mutation

↓

Toast

↓

Saved
```

Tidak terdapat tombol Save.

---

# 20. Loading

Loading menggunakan.

Skeleton.

Tidak menggunakan Full Page Spinner.

---

# 21. Empty State

Seluruh halaman wajib memiliki Empty State.

Minimal.

- Icon
- Judul
- Deskripsi
- CTA Button

---

# 22. Error State

Seluruh halaman wajib memiliki.

- Error Illustration
- Error Message
- Refresh Button

---

# 23. Toast

Menggunakan Toast untuk.

- Success
- Error
- Warning
- Information

Toast tidak boleh menghalangi aktivitas pengguna.

---

# 24. Modal

Gunakan Modal untuk.

- Konfirmasi
- Import
- Export
- Detail
- Delete

Tidak menggunakan Browser Alert.

---

# 25. Dialog Confirmation

Seluruh proses penting wajib memiliki konfirmasi.

Contoh.

- Delete
- Restore
- Finalize
- Publish
- Clone
- Archive

---

# 26. Dashboard

Dashboard menggunakan Widget.

Contoh.

```text
Statistic Card

Progress Card

Chart

Activity Timeline

Notification

Quick Action
```

Semua Widget bersifat reusable.

---

# 27. State Management

Prioritas.

Server State

↓

TanStack Query

↓

React State

↓

Global Store

Gunakan Global Store hanya jika benar-benar diperlukan.

---

# 28. Icons

Seluruh Icon menggunakan.

Lucide Icons.

Tidak menggunakan campuran Icon Library.

---

# 29. Theme

Design System menggunakan.

shadcn/ui

↓

Tailwind CSS

↓

Design Token

Tidak menggunakan inline style.

---

# 30. Styling Rules

Gunakan.

- Tailwind Utility
- CSS Variables
- Design Token

Tidak menggunakan CSS manual kecuali benar-benar diperlukan.

---

# 31. Animation

Animation ringan.

Menggunakan.

- Transition
- Fade
- Scale
- Slide

Durasi maksimal.

250 ms.

Tidak menggunakan animasi berlebihan.

---

# 32. Responsive Rules

Desktop

≥1280px

Tablet

768px–1279px

Mobile

<768px

Semua halaman wajib responsif.

---

# 33. Accessibility

Seluruh komponen wajib mendukung.

- Keyboard Navigation
- Focus Ring
- Screen Reader
- ARIA Label

---

# 34. Security

Frontend tidak menyimpan.

- Password
- Session
- Token

Seluruh autentikasi menggunakan HttpOnly Cookie.

---

# 35. Performance

Seluruh halaman wajib menerapkan.

- Code Splitting
- Lazy Loading
- Dynamic Import
- Streaming
- Suspense
- Image Optimization
- Prefetch
- Memoization bila diperlukan

---

# 36. Error Boundary

Seluruh halaman utama wajib menggunakan.

Error Boundary.

Error tidak boleh menyebabkan seluruh aplikasi berhenti.

---

# 37. Reusable Principle

Apabila suatu komponen telah tersedia.

Developer wajib menggunakan komponen tersebut.

Tidak diperbolehkan membuat komponen baru dengan fungsi yang sama.

---

# 38. Component Priority

Urutan pencarian komponen.

```text
shadcn/ui

↓

Shared Components

↓

Feature Components

↓

New Component
```

---

# 39. API Layer

Frontend tidak memanggil fetch secara langsung dari Component.

Seluruh komunikasi API melalui.

```text
services/
```

Component hanya memanggil Hook.

---

# 40. Hooks

Gunakan Custom Hook.

Contoh.

```text
useStudents()

useClasses()

useScores()

useDashboard()

useNotifications()
```

Business Logic tidak berada di Component.

---

# 41. Realtime Architecture

Seluruh halaman yang membutuhkan data realtime menggunakan:

TanStack Query

↓

Background Refetch

↓

Cache Synchronization

↓

Optimistic Update

Frontend harus selalu menampilkan data terbaru tanpa perlu melakukan refresh halaman.

---

# 42. Dashboard Architecture

Dashboard Admin terdiri dari widget modular.

```text
Dashboard

├── Academic Status

├── Statistics

├── Input Progress

├── Class Progress

├── Finalization Progress

├── Notification Center

├── Activity Timeline

├── Calendar

├── Quick Action

└── System Status
```

Setiap widget merupakan komponen independen yang dapat digunakan kembali.

---

# 43. Development Principles

Frontend MPHM harus memenuhi prinsip berikut.

- Enterprise Grade
- Feature Based
- Component Driven
- Reusable
- Responsive
- Accessible
- High Performance
- Maintainable
- Scalable
- AI Friendly

Seluruh implementasi wajib mengutamakan konsistensi, keterbacaan kode, kemudahan pengembangan jangka panjang, serta mengikuti seluruh dokumen yang telah ditetapkan sebelumnya.

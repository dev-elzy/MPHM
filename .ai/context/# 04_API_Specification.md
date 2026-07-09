# 04_API_Specification.md

> Project : MPHM (Madrasah Putri Hidayatul Mubtadi'at)
>
> Document : API Specification
>
> Version : 1.0
>
> Status : APPROVED

---

# 1. Tujuan

Dokumen ini mendefinisikan standar API Backend yang digunakan oleh seluruh sistem MPHM.

Seluruh komunikasi antara Frontend dan Backend wajib melalui API.

Frontend **tidak diperbolehkan** mengakses Database secara langsung.

---

# 2. API Architecture

Menggunakan arsitektur:

```text
Client

↓

Middleware

↓

Authentication

↓

Authorization

↓

Validation

↓

Business Service

↓

Repository

↓

Database
```

Business Logic hanya boleh berada pada **Business Service**.

---

# 3. API Principles

Seluruh API wajib mengikuti prinsip berikut.

- Stateless
- Type Safe
- RESTful
- Secure
- Predictable
- Consistent Response
- Versioning Ready
- Audit Friendly

---

# 4. API Versioning

Seluruh endpoint menggunakan prefix.

```text
/api/v1
```

Contoh.

```text
/api/v1/auth/login

/api/v1/students

/api/v1/classes
```

---

# 5. Response Standard

Semua endpoint wajib menggunakan struktur response yang sama.

## Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

## Validation Error

```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": {}
}
```

---

## Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

# 6. Authentication

Authentication menggunakan:

- Session Cookie
- HttpOnly
- Secure
- SameSite
- Session Rotation

Endpoint.

```text
POST   /auth/login

POST   /auth/logout

GET    /auth/me

POST   /auth/refresh
```

---

# 7. Authorization

Menggunakan RBAC.

Role.

- Super Admin
- Admin
- Operator
- Mustahiq
- Mudir

Seluruh endpoint wajib melakukan validasi Role sebelum Business Logic dijalankan.

---

# 8. Academic Context

Setelah Login.

Backend otomatis mengetahui.

- Academic Year Active
- Semester Active
- User
- Role
- Assigned Class

Frontend tidak pernah mengirim informasi tersebut kecuali diperlukan oleh Admin.

---

# 9. Workflow Engine

Seluruh modul menggunakan Workflow Engine.

Workflow bukan sekadar Status.

Workflow mengatur.

- Tombol yang muncul
- Hak akses
- Validasi
- Audit Log
- Notifikasi
- Lock Data
- Automation

---

## Workflow Status

Contoh.

Academic Year

```text
Draft

↓

Published

↓

Active

↓

Archived
```

---

Nilai

```text
Draft

↓

Review

↓

Final

↓

Locked
```

---

Raport

```text
Draft

↓

Verified

↓

Published
```

---

Workflow disimpan pada Backend.

Frontend hanya menampilkan status.

---

# 10. Workflow Rules

Setiap perubahan Workflow wajib melalui API.

Contoh.

```text
Draft

↓

Review

↓

Final
```

Tidak diperbolehkan langsung.

```text
Draft

↓

Final
```

Kecuali oleh Super Admin.

---

# 11. Universal CRUD Standard

Seluruh Master Data memiliki endpoint yang sama.

```text
GET

POST

PUT

PATCH

DELETE

RESTORE

EXPORT

IMPORT
```

---

# 12. Universal Import API

Seluruh modul yang mendukung Import wajib memiliki endpoint.

```text
POST

/import/template

↓

Download Template
```

---

```text
POST

/import/preview
```

Validasi File.

---

```text
POST

/import/execute
```

Import Data.

---

```text
GET

/import/history
```

Riwayat Import.

---

# 13. Universal Export API

```text
GET

/export/excel

GET

/export/csv

GET

/export/pdf
```

Export mengikuti Filter aktif.

---

# 14. Universal Search

Search menggunakan Query Parameter.

Contoh.

```text
GET

/students

?q=fatimah
```

Realtime.

---

# 15. Universal Filter

Filter menggunakan Query Parameter.

Contoh.

```text
/students

?class=1

&status=active

&semester=1
```

Semua filter dilakukan di Backend.

---

# 16. Universal Pagination

Semua endpoint mendukung.

```text
page

limit

sort

order
```

Contoh.

```text
?page=1

&limit=25

&sort=name

&order=asc
```

---

# 17. Universal Bulk Action

Endpoint.

```text
POST

/bulk/update

POST

/bulk/delete

POST

/bulk/restore
```

Semua Bulk Action menggunakan Transaction.

---

# 18. Auto Save API

Input Nilai menggunakan Auto Save.

Alur.

```text
Typing

↓

Debounce

↓

PATCH

↓

Validation

↓

Save

↓

Response

↓

Toast
```

Tidak menggunakan tombol Save.

---

# 19. Academic APIs

## Academic Year

```text
GET

POST

PATCH

DELETE

CLONE

PUBLISH

ACTIVATE

ARCHIVE
```

---

## Curriculum

```text
GET

POST

PATCH

DELETE
```

---

## Curriculum Subject

```text
GET

POST

PATCH

DELETE

SORT
```

---

## Semester

```text
GET

POST

PATCH

DELETE
```

---

## Class

```text
GET

POST

PATCH

DELETE
```

---

## Student

```text
GET

POST

PATCH

DELETE

IMPORT

EXPORT

RESTORE
```

---

## User

```text
GET

POST

PATCH

DELETE

RESET PASSWORD

RESTORE
```

---

# 20. Score APIs

Score menggunakan Session.

Flow.

```text
Semester

↓

Subject

↓

Score Session

↓

Students

↓

Scores
```

Endpoint.

```text
GET

/score-session
```

---

```text
PATCH

/scores
```

Auto Save.

---

```text
POST

/finalize
```

Finalisasi.

---

```text
POST

/unlock
```

Unlock.

---

# 21. Dashboard APIs

Dashboard tidak mengambil seluruh data.

Gunakan endpoint khusus.

Admin.

```text
/dashboard/admin
```

Mustahiq.

```text
/dashboard/mustahiq
```

Mudir.

```text
/dashboard/mudir
```

Semua Dashboard menggunakan View atau Query teroptimasi.

---

# 22. Monitoring APIs

Admin dapat melihat.

- Progress Kelas
- Progress Mata Pelajaran
- Progress Input
- Progress Finalisasi
- Aktivitas
- Statistik

Endpoint.

```text
/monitoring
```

---

# 23. Notification APIs

```text
GET

/notifications

PATCH

/notifications/read

DELETE

/notifications
```

Realtime.

---

# 24. Audit APIs

Audit bersifat Read Only.

```text
GET

/audit-logs
```

Tidak memiliki.

POST

PUT

DELETE

---

# 25. Recycle Bin APIs

```text
GET

/recycle-bin
```

---

```text
POST

/restore
```

---

```text
DELETE

/permanent-delete
```

---

# 26. Clone Academic Year

Endpoint.

```text
POST

/academic-years/{id}/clone
```

Yang disalin.

- Academic Settings
- Curriculum
- Curriculum Subjects
- Semester
- Kelas

Tidak menyalin.

- Nilai
- Raport
- Audit
- Import History
- Export History

---

# 27. Validation

Seluruh endpoint menggunakan.

- Zod
- Server Validation

Frontend Validation hanya untuk User Experience.

---

# 28. Transaction

Endpoint berikut wajib menggunakan Database Transaction.

- Import
- Bulk Update
- Bulk Delete
- Restore
- Clone Academic Year
- Finalisasi
- Unlock
- Generate Raport

---

# 29. Security

Seluruh endpoint wajib.

- Authentication
- Authorization
- Input Validation
- Rate Limit
- CSRF Protection
- XSS Protection
- SQL Injection Protection

---

# 30. Audit Integration

Seluruh endpoint yang mengubah data wajib otomatis membuat Audit Log.

Minimal mencatat.

- User
- Role
- Module
- Action
- Before
- After
- Timestamp
- IP Address
- User Agent

Developer tidak perlu memanggil Audit Log secara manual.

Audit dibuat otomatis oleh Middleware.

---

# 31. Background Jobs

Proses berikut dijalankan sebagai Background Job menggunakan Cloudflare Workers.

- Generate Raport
- Clone Academic Year
- Export PDF
- Import Data
- Penghapusan Recycle Bin
- Pengiriman Notifikasi
- Perhitungan Statistik Dashboard

Frontend hanya menerima Status Job.

---

# 32. Real-Time Updates

Dashboard menggunakan mekanisme Realtime.

Perubahan berikut harus langsung diperbarui tanpa Refresh.

- Progress Input Nilai
- Progress Finalisasi
- Dashboard Statistik
- Notifikasi
- Monitoring Admin
- Status Workflow

TanStack Query bertanggung jawab melakukan Cache Synchronization.

---

# 33. API Design Principles

Seluruh API MPHM wajib memenuhi prinsip berikut.

- RESTful
- Predictable
- Stateless
- Type Safe
- Secure
- Reusable
- Versioning Ready
- Workflow Driven
- Audit Friendly
- Enterprise Grade

API bukan hanya media CRUD, tetapi merupakan implementasi dari seluruh Business Rules, Workflow Engine, dan Academic Workspace yang telah ditetapkan pada dokumen sebelumnya.
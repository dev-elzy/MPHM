# Blueprint Deployment Cloudflare

## Tujuan

Setiap proses deployment harus langsung menggunakan domain produksi **https://m.p3hm.my.id** sebagai domain utama aplikasi.

Tidak diperbolehkan menggunakan domain bawaan Cloudflare Pages (`*.pages.dev`) maupun subdomain sementara sebagai alamat utama aplikasi. Seluruh konfigurasi deployment harus menganggap `https://m.p3hm.my.id` sebagai Production URL.

---

# Aturan Wajib

## Domain Production

Production URL wajib:

```
https://m.p3hm.my.id
```

Preview URL boleh menggunakan domain bawaan Cloudflare.

Contoh:

```
https://xxxxxxxx.pages.dev
```

Tetapi URL tersebut hanya digunakan untuk Preview Deployment dan tidak boleh menjadi URL utama aplikasi.

---

## Domain Mapping

Deployment harus otomatis menghubungkan project ke:

```
m.p3hm.my.id
```

dan memastikan seluruh request production menggunakan domain tersebut.

---

## Redirect

Apabila masih tersedia URL:

```
*.pages.dev
```

maka URL tersebut hanya digunakan untuk preview.

Semua konfigurasi aplikasi harus menganggap:

```
https://m.p3hm.my.id
```

sebagai Origin, Base URL, dan Canonical URL.

---

# Environment

## Production

```
APP_ENV=production

APP_URL=https://m.p3hm.my.id

NEXT_PUBLIC_APP_URL=https://m.p3hm.my.id
```

---

## Preview

```
APP_ENV=preview
```

menggunakan URL bawaan Cloudflare Pages.

---

## Development

```
APP_ENV=development

APP_URL=http://localhost:3000
```

---

# Routing

Semua route berada di bawah domain utama.

Contoh:

```
https://m.p3hm.my.id/

https://m.p3hm.my.id/login

https://m.p3hm.my.id/dashboard

https://m.p3hm.my.id/dashboard/students

https://m.p3hm.my.id/dashboard/classes

https://m.p3hm.my.id/api/*
```

Tidak diperbolehkan membuat domain:

```
app.p3hm.my.id

portal.p3hm.my.id

dashboard.p3hm.my.id
```

kecuali terdapat kebutuhan arsitektur yang benar-benar mengharuskannya.

---

# Authentication

Semua callback authentication wajib menggunakan domain utama.

Contoh:

```
AUTH_URL=https://m.p3hm.my.id
```

atau

```
NEXTAUTH_URL=https://m.p3hm.my.id
```

Cookie harus menggunakan domain production.

---

# SEO

Canonical URL

```
https://m.p3hm.my.id
```

Sitemap

```
https://m.p3hm.my.id/sitemap.xml
```

Robots

```
https://m.p3hm.my.id/robots.txt
```

Open Graph URL

```
https://m.p3hm.my.id
```

---

# Cloudflare Configuration

Deployment harus mengonfigurasi:

- Cloudflare Pages atau Cloudflare Workers
- Custom Domain
- SSL Full (Strict)
- Always Use HTTPS
- Automatic HTTPS Rewrites
- HTTP/3
- Brotli Compression
- Early Hints
- Cache Rules sesuai kebutuhan aplikasi

Setelah deployment selesai, domain production harus langsung aktif pada:

```
https://m.p3hm.my.id
```

tanpa memerlukan konfigurasi manual tambahan.

---

# Build Target

Framework:

```
Next.js 15
```

Output:

```
Cloudflare
```

Runtime:

```
Edge Runtime
```

Package Manager:

```
pnpm
```

Node.js:

```
22 LTS
```

---

# Ketentuan Deployment

Setiap proses deploy harus memenuhi seluruh kondisi berikut:

- Build berhasil tanpa error.
- Domain production langsung mengarah ke `https://m.p3hm.my.id`.
- SSL aktif dan valid.
- Seluruh URL internal menggunakan domain production.
- Seluruh API menggunakan domain production.
- Preview deployment tetap tersedia melalui domain bawaan Cloudflare.
- Tidak ada referensi ke domain `*.pages.dev` pada konfigurasi production.

---

# Acceptance Criteria

Deployment dianggap berhasil apabila seluruh poin berikut terpenuhi:

- Aplikasi dapat diakses melalui `https://m.p3hm.my.id`.
- Seluruh halaman menggunakan HTTPS.
- Login dan autentikasi berjalan normal.
- API dapat diakses melalui `https://m.p3hm.my.id/api/*`.
- Canonical URL mengarah ke `https://m.p3hm.my.id`.
- Tidak ada redirect loop.
- Tidak terdapat mixed content.
- Semua aset (CSS, JavaScript, gambar, font) dimuat dari domain production.
- Deployment dapat diulang tanpa perlu konfigurasi ulang domain.

---

# Instruksi untuk AI Agent

Setiap kali melakukan deployment ke Cloudflare, AI Agent wajib:

1. Menganggap `https://m.p3hm.my.id` sebagai satu-satunya domain production.
2. Menghubungkan deployment ke Custom Domain `m.p3hm.my.id`.
3. Menggunakan domain tersebut sebagai Base URL aplikasi.
4. Mengonfigurasi environment production agar mengarah ke `https://m.p3hm.my.id`.
5. Memastikan seluruh route, API, autentikasi, metadata, dan SEO menggunakan domain production.
6. Tidak menggunakan domain bawaan Cloudflare Pages sebagai domain utama.
7. Melakukan verifikasi akhir bahwa aplikasi dapat diakses melalui `https://m.p3hm.my.id` dengan SSL aktif dan seluruh fungsi berjalan normal.

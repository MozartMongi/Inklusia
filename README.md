# Inklusia

Portal kerja ramah disabilitas. Frontend Next.js menghubungkan pencari kerja, perusahaan, dan admin melalui API Express + PostgreSQL.

Lowongan publik hanya tampil setelah kebutuhan (inquiry) perusahaan **disetujui admin**.

## Persiapan lokal

1. Salin `server/.env.example` menjadi `server/.env` dan `.env.example` menjadi `.env`.
2. Isi `DATABASE_URL` dan `JWT_SECRET` (minimal 32 karakter).
3. Jalankan migrasi, lalu buat akun root admin:

```bash
npm install
npm run db:migrate
npm run db:seed:root-admin
npm run db:seed:trainings
```

4. Jalankan API dan frontend:

```bash
npm run api:dev
npm run dev
```

Frontend: http://localhost:3000  
API: http://localhost:4000/health

Seed data contoh (`npm run db:seed`) **tidak boleh** dijalankan di production.

## Production

Setel environment berikut.

### Frontend (Next.js)

| Variabel | Keterangan |
| --- | --- |
| `API_BASE_URL` | URL publik API Express, tanpa garis miring di akhir |

### API (Express)

| Variabel | Keterangan |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | PostgreSQL |
| `JWT_SECRET` | Rahasia acak, minimal 32 karakter |
| `CORS_ALLOWED_ORIGINS` | Origin frontend, dipisah koma |
| `APP_BASE_URL` | URL frontend untuk tautan reset kata sandi |
| `TRUST_PROXY_HOPS` | `1` di belakang Railway/Vercel/Nginx |
| `SMTP_URL` / `MAIL_FROM` | Opsional, untuk email reset kata sandi |
| `PORT` | Default `4000` |

Setelah deploy API:

```bash
npm run build --prefix server
npm run migrate --prefix server
ROOT_ADMIN_EMAIL=... ROOT_ADMIN_PASSWORD=... npm run seed:root-admin --prefix server
npm run seed:trainings --prefix server
```

Jangan menjalankan seed data contoh di production.

## Keamanan yang sudah dipasang

- Sesi JWT di cookie httpOnly (bukan cookie peran yang bisa diubah klien)
- Ruang `/admin`, `/perusahaan`, dan `/profil` menolak peran yang tidak sesuai
- Lowongan publik hanya `status = disetujui` dan `is_active = true`
- Rate limit, Helmet, CORS allowlist, dan validasi input di API
- Header keamanan di frontend (`X-Frame-Options`, `nosniff`, `noindex` untuk ruang privat)

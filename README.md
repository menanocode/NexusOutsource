## NexusOutsource Monorepo

Platform **NexusOutsource** adalah sistem rekrutmen dan outsourcing terintegrasi
yang terdiri dari:

- **backend**: API server (Node.js 22 + Express) dengan Prisma & PostgreSQL (Supabase)
- **web**: dashboard rekruter/partner (React 19 + Vite + Tailwind CSS)
- **mobile**: aplikasi kandidat (Expo React Native + NativeWind)

### Struktur Proyek

- `backend` – REST API, skema Prisma, (calon) autentikasi & RBAC
- `web` – dashboard admin/partner (ATS, Kanban, manajemen kandidat & lowongan)
- `mobile` – aplikasi kandidat untuk melamar dan mengelola profil

### Teknologi & Dependencies Utama

- **Backend**
  - Runtime: Node.js 22+
  - Framework: Express, CORS
  - ORM: Prisma (`@prisma/client`, `prisma`)
  - Database: PostgreSQL (Supabase)
  - Utilitas: `dotenv`, `jsonwebtoken`, `bcrypt`/`bcryptjs`, `zod`, `nodemon`

- **Web Dashboard**
  - React 19 + Vite
  - Styling: Tailwind CSS
  - Routing: React Router
  - State/Server State: Zustand, TanStack Query
  - UI Tambahan: `@hello-pangea/dnd`, `react-pdf`, ikon, dsb.

- **Mobile App**
  - Expo SDK 54 (React Native 0.81, React 19)
  - Navigasi: `@react-navigation/*`
  - Styling: NativeWind (Tailwind untuk React Native)
  - Server state: TanStack Query
  - Lainnya: `react-native-document-picker`, `expo-status-bar`, dll.

---

### Persiapan Awal

1. **Clone & masuk ke folder monorepo**

```bash
cd path/ke/nexusoutsource
```

2. **Install semua dependency (root + workspace)**

```bash
npm install
```

3. **Konfigurasi environment backend**

- Copy file contoh:

```bash
cd backend
cp .env.example .env   # di PowerShell: Copy-Item .env.example .env
cd ..
```

- Edit `backend/.env` dan isi:
  - **DATABASE_URL**: connection string Supabase PostgreSQL
  - **JWT_SECRET**, **JWT_EXPIRES_IN**
  - **ENCRYPTION_KEY_HEX**, **ENCRYPTION_IV_HEX** (untuk enkripsi NIK)

4. **Inisialisasi Prisma (opsional tapi direkomendasikan sebelum akses DB)**

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

---

### Menjalankan Aplikasi

- **Backend API**

```bash
cd backend
npm run dev
```

Default: `http://localhost:4000` (cek `GET /health`).

- **Web Dashboard**

1. Buat file `web/.env` (jika belum ada) dan set alamat API:

```bash
VITE_API_URL=http://localhost:4000
```

2. Jalankan Vite:

```bash
cd web
npm run dev
```

Default: `http://localhost:5173`.

- **Mobile App (Expo)**

```bash
cd mobile
npm run dev          # buka kemudian pilih Android / iOS / Web
```

Gunakan aplikasi **Expo Go** di Android/iOS untuk scan QR code dan mencoba aplikasi kandidat.


# Portal Management System - Enterprise ESM Edition

Proyek ini telah ditransformasi menjadi platform **Enterprise Service Management (ESM)** yang terintegrasi, berfungsi sebagai pusat layanan tunggal untuk seluruh departemen perusahaan.

## Key Features

- **Enterprise UI/UX**:
  - Dark Teal horizontal navigation bar with module-specific icons.
  - White sub-header "Context Bar" with Site and Group filters.
  - Compact, information-dense Dashboard with status tabs and metric cards.
  - Split-view Request management with sidebar filters and a professional table grid.
- **Enterprise Service Management (ESM) Portal**:
  - Halaman Landing Utama (`/`) yang berfungsi sebagai direktori layanan global.
  - Sektor layanan mandiri untuk IT, HR, Facilities, dan Housekeeping.
  - Alur autentikasi modern: Portal bersifat publik, login diminta saat mengakses modul spesifik.
- **Super Admin Portal (`/super_admin`)**:
  - Pintu masuk administratif khusus dengan branding **Luxury Muted Gold**.
  - Dashboard Global yang merangkum data dari seluruh portal dalam satu layar.
- **Portal Assistant (AI Concierge)**:
  - Chatbot cerdas yang menyambut pengguna di halaman utama secara otomatis.
- **Multi-Portal Authentication**:
  - Halaman login dinamis yang menyesuaikan branding dengan departemen yang dituju.
  - **Daftar Kredensial Akses (Password: `password`)**:
    - IT Portal: `it_portal`
    - HR Portal: `hr_portal`
    - Facilities Portal: `fm_portal`
    - Housekeeping: `hp_portal`
    - Super Admin: `super_admin`
- **Multi-Instance Architecture**:
  - **IT Portal**: Manajemen Requests, Problems, dan Changes.
  - **HR Portal**: Manajemen Cases, Directory Karyawan, dan Onboarding.
  - **Facilities Portal**: Manajemen Work Orders, Infrastructure, dan Space.
  - **Housekeeping Portal**: Manajemen Service Tasks dan Jadwal Harian.
- **Adaptive & Collapsible Sidebar**:
  - Sidebar adaptif yang berubah menu berdasarkan departemen.
  - Fitur **Collapsible Groups** untuk Super Admin agar navigasi antar portal lebih ringkas.
- **REST API**:
  - Secure endpoints provided by the Laravel 11 backend.
  - Session management via Laravel Sanctum stateful cookies.
- **Modern Tech Stack**:
  - Frontend: Next.js 16.2 (App Router) + Turbopack.
  - Backend: Laravel 11 + PostgreSQL.
  - Vanilla CSS for pixel-perfect enterprise aesthetics.

## Database Management

To manage the database:
- **Docker**: The database runs in a PostgreSQL 15 container on port `5433`.
- **Laravel Migrations**: `php artisan migrate --seed` inside the `/backend` directory.

## UI Components & Structure

- **Header**: Main module navigation (Top-Nav) with Search, Settings, and Profile.
- **GlobalHeader**: Key actions including Dark/Light mode toggle.
- **SubHeader**: Action bar with breadcrumbs and pagination.
- **Module Sidebar**: Specialized side-filters and workflow steppers.

## Design Tokens (globals.css)

All colors are aligned with the Zoho/ManageEngine branding palette:
- Primary Blue: `#3b82f6` (HSL based)
- Nav Group Background: `var(--bg-main)`
- Glassmorphic accents: `var(--border-subtle)`
- Dark Mode support: Integrated as global CSS variables.

## Getting Started

1. Ensure **Docker Desktop** is running.
2. Backend Initialization:
   ```bash
   cd backend
   composer install
   php artisan migrate:fresh --seed
   php artisan serve
   ```
3. Frontend Initialization:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📜 Global Changelog (Detailed - ASC Order)

### [PHASE 1 - 5] Arsitektur & Migrasi Awal
- **Fase 1**: Setup infrastruktur Docker (PostgreSQL) dan konektivitas database.
- **Fase 2**: Finalisasi Backend Laravel 11, konfigurasi Sanctum, dan Master Seeding.
- **Fase 3**: Adaptasi Frontend Next.js untuk berkomunikasi dengan API Laravel.
- **Fase 4**: Pembersihan paket legacy (Prisma, legacy node_modules).
- **Fase 5**: Verifikasi alur login dan rendering data awal.

### [PHASE 6 - 8] Optimasi Workspace
- **Fase 6**: Pembersihan residu file dan optimasi folder `/frontend`.
- **Fase 7**: Restorasi file krusial (Knowledge Base v1 API) dan Metadata AI.
- **Fase 8**: Refinement workspace, penghapusan boilerplate kosong.

### [PHASE 9 - 11] Sinkronisasi Portal IT
- **Fase 9**: Sinkronisasi dokumentasi teknis.
- **Fase 10**: Polishing UI awal dan verifikasi modul IT.
- **Fase 11**: Sinkronisasi struktural penuh dengan App Router untuk Request, Problem, dan Change.

### [PHASE 12 - 13] Branding & Premium UI
- **Fase 12**: Implementasi sistem `AestheticModal` dan `ComingSoonModal`.
- **Fase 13**: Rebranding sistem menjadi **"Portal System IT Helpdesk"** dan perbaikan Global Header.

### [PHASE 14 - 15] Dashboard & Layout Refinement
- **Fase 14**: Implementasi Dashboard fungsional (Search, Profile, SLA Automation background).
- **Fase 15**: Pemindahan filter modul dari header ke side-panel modern.

### [PHASE 16 - 18] Standarisasi & Dokumentasi Akhir
- **Fase 16**: Perbaikan "4 Issues" badge (Fix z-index & TypeScript linting).
- **Fase 17**: Standarisasi UI Global:
  - Implementasi **Vertical Workflow Stepper** (Changes & Projects).
  - Rollout Sidebar Glassmorphism di seluruh modul IT.
- **Fase 18**: Rollout Dokumentasi Multi-Portal (Changelog per modul dalam urutan ASC).

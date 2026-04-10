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
- **REST API (v1)**:
  - Secure endpoints for RAG (Knowledge Base), LLM (Ticket Creation), and Python integration.
  - Header-based API Key authentication.
- **Modern Tech Stack**:
  - **Backend**: Laravel 11+ (PHP 8.3+) sebagai API central.
  - **Frontend**: Next.js 16.2 (App Router) dengan arsitektur decoupled.
  - **Database**: PostgreSQL 15 di dalam Docker.
  - **Auth**: Laravel Sanctum untuk manajemen sesi yang aman.
  - **Styling**: Vanilla CSS untuk estetika enterprise yang pixel-perfect.

## Database Management

Untuk mengelola database:
- **Artisan**: Gunakan perintah `php artisan migrate` atau `php artisan db:seed` di dalam folder `backend/`.
- **Docker**: Database PostgreSQL berjalan di kontainer Docker pada port `5433`.
- **Reference**: Skema asli Prisma tersedia di `docs/reference/schema.prisma` sebagai referensi teknis.

## UI Components & Structure

- **Header**: Main module navigation (Top-Nav).
- **SubHeader**: Action bar with Site/Group filter and pagination info.
- **Dashboard**: "My View" style analytics panel.
- **RequestList**: Split-layout view with status sidebar and ticketing grid.

## Design Tokens (globals.css)

All colors are aligned with the Zoho/ManageEngine branding palette:
- Primary Blue: `#0073e6`
- Navigation Teal: `#004144`
- Background Gray: `#f4f6f8`
- Danger Red: `#e74c3c`
- Warning Orange: `#f39c12`

## REST API & AI Integration

The system exposes a secure API for RAG, LLM, and external Python project integration.

### Authentication
Include the following header in your requests:
- `x-api-key`: Set this to the value of `INTERNAL_API_KEY` in your `.env`.

### Key Endpoints
- `GET /api/v1/kb`: Returns all Solution articles (Formatted for RAG).
- `GET /api/v1/tickets`: Returns all Requests, Problems, and Changes.
- `POST /api/v1/tickets`: Creates a new HelpDesk ticket.
- `GET /api/v1/inventory`: Returns Assets and Configuration Items.

### Python Integration
A reference Python client is provided at `scripts/service_desk_client.py`.

## Getting Started

1. Pastikan **Docker Desktop** sedang berjalan.
2. Setup Database & Backend:
   ```bash
   cd backend
   composer install
   php artisan migrate:fresh --seed
   php artisan serve
   ```
3. Setup Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

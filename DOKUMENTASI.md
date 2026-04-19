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
- **Hyper-Intelligence AI (Powered by Gemini)**:
  - **RAG Chatbot**: Portal Assistant yang dapat menjawab pertanyaan berdasarkan basis pengetahuan perusahaan.
  - **Auto-Fill with AI 🪄**: Prediksi otomatis kategori dan prioritas tiket menggunakan *natural language processing*.
  - **AI Inspector**: Analisis sentimen (mood pengguna) dan rekomendasi solusi teknis secara instan.
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
    
### [PHASE 19] Integrasi Hyper-Intelligence (Gemini AI)
- **Fase 19**: Implementasi kecerdasan buatan menyeluruh menggunakan **Google Gemini 3.1 & RAG Engine**:
  - **Virtual IT Assistant**: Chatbot responsif yang terintegrasi dengan Knowledge Base perusahaan.
  - **Smart Prediction**: Fitur Auto-Fill Kategori & Prioritas otomatis pada form tiket baru.
  - **AI Inspector**: Analisis sentimen real-time dan rekomendasi solusi otomatis pada halaman detail tiket.
  - **Infrastructure Fixes**: Pengaktifan bypass CSRF untuk API stateless dan optimalisasi timeout AI hingga 60 detik.

### [PHASE 20] Service Portal Repair (Stabilization)
- **Fase 20**: Perbaikan navigasi kritis dan restorasi halaman detail:
  - **Restorasi Link**: Perbaikan seluruh hyperlink navigasi (Request, Problem, Asset, Change, Solution) yang sebelumnya 404.
  - **Halaman Detail Dinamis**: Implementasi penuh halaman detail untuk seluruh modul IT dengan struktur routing `/it/[module]/[id]`.
  - **Backend Model Resolution**: Pengembangan logika resolusi model di `TicketController` untuk mendukung pencarian entitas ganda secara otomatis.
  - **Data Integrity**: Pembersihan dan re-seeding database untuk memastikan seluruh dashboard menampilkan data contoh yang valid.

### [PHASE 21] AI Efficiency & Productivity (Auto-Reply)
- **Fase 21**: Optimalisasi kecerdasan buatan dan fitur produktivitas teknisi:
  - **Fitur "Apply as Reply"**: Implementasi tombol injeksi balasan AI otomatis ke dalam kotak percakapan tiket.
  - **AI Result Caching**: Penambahan sistem *client-side caching* untuk menyimpan hasil analisa sentimen dan saran solusi guna menghemat kuota API Gemini.
  - **Graceful Error Handling**: Penanganan khusus untuk error **HTTP 429 (Rate Limit)** dengan tampilan "Limit Reached" yang informatif bagi pengguna.
  - **Technical Debt**: Standardisasi formatting tanggal di seluruh portal menggunakan komponen `FormattedDate` yang tangguh.

### [PHASE 22] Enterprise ESM Synchronization & Stability
- **Fase 22**: Finalisasi sinkronisasi data dan stabilitas portal non-IT:
  - **Portal HR, Facilities, & Housekeeping**: Perbaikan crash 500-level dan sinkronisasi database untuk memastikan seluruh modul portal departemen berfungsi penuh.
  - **Backend Auth Finalization**: Penyempurnaan alur autentikasi multi-portal agar transisi antar departemen berjalan mulus.
  - **UI Layout Consistency**: Implementasi standardisasi layout "Premium Enterprise 2-column" di seluruh portal ESM untuk memberikan pengalaman pengguna yang seragam dan premium.

### [PHASE 23] Advanced AI Repair & Automated Responses
- **Fase 23**: Peningkatan keandalan integrasi AI dan fitur respon otomatis:
  - **Gemini API Debugging**: Perbaikan komunikasi backend dengan Google Gemini dan optimasi parsing JSON untuk respon AI yang lebih akurat.
  - **Automated Ticket Response**: Implementasi kemampuan respon tiket otomatis yang memungkinkan teknisi memanfaatkan solusi buatan AI secara instan.
  - **Prompt Engineering Refinement**: Optimasi instruksi (prompt) ke model LLM untuk menghasilkan klasifikasi dan rekomendasi yang lebih relevan dengan konteks perusahaan.

### [PHASE 24] Autonomous AI Technician (Agentic Mode)
- **Fase 24**: Transformasi AI dari asisten pasif menjadi agen proaktif:
  - **Tool & Function Calling**: Implementasi `AiAgentService` yang memberdayakan Google Gemini untuk secara mandiri memanggil fungsi internal seperti `get_user_assets`, `search_knowledge_base`, dan `check_active_problems`.
  - **Diagnostik Transparan**: Penambahan fitur "Diagnostic Steps" di UI, menampilkan proses bernalar AI (misalnya "Menganalisis daftar aset...") dalam stream komentar tanpa mengganggu pengalaman pengguna.
  - **Efisiensi Loop**: Konfigurasi batasan iterasi logika agen (maksimal 3 *loops*) untuk mencegah *timeout* sekaligus mempertahankan kualitas respon analitis berbasis data *real-time*.

### [PHASE 25] Integration Sync & Interactive Navigation (Zoho-Style)
- **Fase 25**: Pengintegrasian fungsionalitas interaktif penuh pada seluruh navigasi portal:
  - **Full Folder Sync**: Implementasi logika pemfilteran *real-time* pada sidebar di modul Home, Reports, Problems, Solutions, dan Assets. Navigasi folder tidak lagi hanya visual, melainkan fungsional (dapat diklik untuk menyaring data).
  - **Zoho Enterprise Reports UI**: Perombakan total tampilan modul Reports agar identik dengan standar visual Zoho (sidebar ramping, ikon ekspansi ▼/▶, dan penataan daftar laporan yang profesional menggunakan ikon 🖋️).
  - **Module Data Reconciliation**: Penyempurnaan logika filter (*predicates*) untuk memastikan angka di sidebar (counts) sinkron 100% dengan baris data di tabel (misalnya pengelompokan IT Assets vs Non-IT).
  - **Stability & Bug Fixes**: Pembersihan error kritis seperti *ReferenceError* (loading state) dan *JSX Build Errors* untuk menjamin stabilitas portal sebelum rilis produksi.

### [PHASE 26] Dynamic Customization & Email Automation
- **Fase 26**: Peningkatan fleksibilitas input dan integrasi saluran email:
  - **Dynamic Subcategory Logic**: Implementasi filter dinamis pada form pembuatan tiket yang menyesuaikan daftar sub-kategori berdasarkan kategori induk yang dipilih (Application vs Infrastructure).
  - **Email-to-Ticket Automation**: Pengembangan endpoint `/api/inbound-email` yang mampu mengubah payload webhook email menjadi tiket ServiceDesk secara otomatis dengan mapping properti enterprise (Site, Group, Technician).
  - **Auto-User Provisioning (Email)**: Sistem secara otomatis membuat akun user baru jika pengirim email belum terdaftar dalam database.
  - **SLA Calculation (Inbound)**: Penentuan otomatis tanggal *Response DueBy* (+1 hari) dan *DueBy Date* (+7 hari) untuk setiap tiket yang masuk via jalur email.

### [PHASE 27] 3-Tier Categorization & Resolution Workflow
- **Fase 27**: Implementasi sistem kategorisasi 3-level dan alur resolusi tiket yang lebih presisi:
  - **3-Tier Hierarchy (Category > Subcategory > Item)**: Ekspansi sistem kategorisasi mencakup level "Item" yang sangat granular untuk kategori Application dan Infrastructure.
  - **Resolution-Phase Categorization**: Memisahkan pemilihan "Item" dari form awal ke fase **Ticket Resolution** untuk akurasi data remediasi.
  - **Interactive Resolution Tab**: Penambahan tab "Resolution" pada halaman detail tiket untuk proses pemilihan Item dan penutupan tiket.
  - **UI Consistency (Edit Properties)**: Pembaruan field "Subcategory" dan "Item" pada panel *Properties* menjadi dropdown dinamis, memastikan teknisi memilih data yang valid saat mengedit tiket lama.
  - **Request Table Sync**: Penambahan kolom "Item" pada tabel utama daftar tiket (`RequestClientView`) agar hasil kategorisasi 3-level dapat langsung dipantau secara visual.
  - **Database Migration/Sync**: Sinkronisasi data pada tiket-tiket yang sudah ada (existing) agar sesuai dengan skema sub-kategori baru untuk tujuan pengujian.

---
**Status Terakhir**: Seluruh fitur utama ESM, integrasi AI, dan alur resolusi 3-tier telah stabil (Phase 27). Sistem kini mendukung pelacakan masalah hingga level Item yang sangat spesifik melalui dropdown terintegrasi di seluruh portal.

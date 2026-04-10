## 🏗 Architecture & Flow

The system uses a **Bilateral Decoupled Architecture**:
1. **Frontend (Next.js)**: Performs Server-Side Rendering (SSR) and communicates with the backend via a secure internal API bridge.
2. **Backend (Laravel)**: Acts as the stateless source of truth for data and AI logic.
3. **Session**: Handled via Laravel Sanctum stateful cookies.

## 🚀 Getting Started

### 1. Prerequisites
- Docker & Docker Desktop
- PHP 8.3+ & Composer
- Node.js 18+ & npm

### 2. Services Initialization (Docker)
In the project root, start the PostgreSQL instance:
```bash
docker-compose up -d
```

### 3. Backend Setup
```bash
cd backend
composer install
cp .env.example .env # Ensure DB_PORT=5433
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Credentials (Demo Data)
| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@servicedesk.com` | `password` |
| **Technician** | `tech@servicedesk.com` | `password` |

## 📂 Documentation Stack
- **[DOKUMENTASI.md](file:///Users/farhandwiharyanto/Zoho Manage ServiceDesk/DOKUMENTASI.md)**: Main project documentation (Indonesian).
- **[TECHNICAL_GUIDE.md](file:///Users/farhandwiharyanto/Zoho Manage ServiceDesk/TECHNICAL_GUIDE.md)**: Detailed migration and API guide.
- **[docs/reference/](file:///Users/farhandwiharyanto/Zoho Manage ServiceDesk/docs/reference/)**: Technical reference files (e.g., legacy Prisma schema).

## 📖 Key Modules
- **Service Request**: Multi-portal support (IT, HR, Facilities).
- **Asset Management (CMDB)**: Track assets and CI relationships.
- **AI ChatBot**: RAG-powered concierge for knowledge base lookup.

## 📂 Project Structure
- `/frontend`: Next.js application.
- `/backend`: Laravel application.
- `/docs`: Detailed technical and design documentation.

---
*Created with 💙 for Enterprise Service Excellence.*

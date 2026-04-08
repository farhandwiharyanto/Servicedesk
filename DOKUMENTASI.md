# Zoho Manage ServiceDesk Plus Clone - High Fidelity

This project has been transformed into a professional, high-fidelity clone of **ManageEngine ServiceDesk Plus (Enterprise Edition)**.

## Key Features

- **Enterprise UI/UX**:
  - Dark Teal horizontal navigation bar with module-specific icons.
  - White sub-header "Context Bar" with Site and Group filters.
  - Compact, information-dense Dashboard with status tabs and metric cards.
  - Split-view Request management with sidebar filters and a professional table grid.
- **Full ITIL Module Activation**:
  - Live data integration for **Requests, Problems, Changes, Assets, Solutions**.
  - Expanded ITIL processes: **Projects, Releases, Maintenance, Purchase, Contracts**.
  - CMDB (Configuration Management Database) with CI tracking.
- **REST API (v1)**:
  - Secure endpoints for RAG (Knowledge Base), LLM (Ticket Creation), and Python integration.
  - Header-based API Key authentication.
- **Modern Tech Stack**:
  - Next.js 16.2 (App Router) + Turbopack.
  - Prisma ORM with PostgreSQL.
  - Vanilla CSS for pixel-perfect enterprise aesthetics.

## Database Management

To manage the database:
- **Prisma Studio**: `npx prisma studio` (runs on port 5555).
- **Docker**: The database runs in a PostgreSQL 15 container on port `5433`.

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

1. Ensure **Docker Desktop** is running.
2. Initialize database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

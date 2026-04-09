# Portal Management System - Enterprise ESM Clone

This project is a high-fidelity Enterprise Service Management (ESM) platform. It provides a unified, branded service portal for IT, HR, Facilities, and Housekeeping departments, featuring an intelligent AI assistant and a global Super Admin view.

## 🔑 Access Credentials
**Password for all accounts:** `password`
- **IT Portal**: `it_portal`
- **HR Portal**: `hr_portal`
- **Facilities Portal**: `fm_portal`
- **Housekeeping**: `hp_portal`
- **Super Admin**: `super_admin` (Available at `/super_admin`)

## 🚀 Key Modules
- **Portal Assistant**: An automated AI concierge that welcomes users and guides them to the right department.
- **Universal Sidebar**: Master-view for Super Admins with collapsible groups to manage all enterprise departments from one place.

## 🛠️ Architecture
- **Unified Portal**: A high-fidelity, minimalist landing page (`/`) serving as the global service directory.
- **Instance Isolation**: Department-specific workflows and navigation (Instance-Aware Sidebar).
- **Modern Stack**: Next.js 16.2 (App Router), Prisma, PostgreSQL, and Vanilla CSS.

- **Database**: PostgreSQL with Prisma ORM
- **Runtime**: Turbopack for lightning-fast dev cycles

## 📖 Documentation
Detailed documentation on setup, modules, and API integration can be found in **[DOKUMENTASI.md](file:///Users/farhandwiharyanto/Zoho%20Manage%20ServiceDesk/DOKUMENTASI.md)**.

## 🏁 Quick Start
1. Ensure Docker is running.
2. Initialize and sync data:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
4. Access at [http://localhost:3000](http://localhost:3000)

## 🤖 AI & Python Integration
To integrate with your RAG or LLM project, use the provided client:
```python
# scripts/service_desk_client.py
client = ServiceDeskClient(API_BASE_URL, API_KEY)
kb_data = client.get_kb_articles() # Perfect for RAG
```

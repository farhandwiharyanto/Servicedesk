# Zoho Manage ServiceDesk Plus - Enterprise Edition

A high-fidelity implementation of Zoho Manage ServiceDesk Plus, featuring a full ITIL module set, REST API for AI integration, and a professional enterprise UI.

## 🚀 Key Modules Activated
- ✅ **Inventory / AMDB**: Full tracking of IT and Non-IT assets.
- ✅ **Problem Management**: Lifecycle management for IT problems and root cause analysis.
- ✅ **Change Management**: Standardized workflows for submission, planning, and implementation.
- ✅ **ITIL Suite**: Projects, Releases, Purchase, and Contracts.
- ✅ **REST API (v1)**: Built-in endpoints for RAG/LLM/Python integration.

## 🛠 Tech Stack
- **Framework**: Next.js 16.2 (App Router)
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

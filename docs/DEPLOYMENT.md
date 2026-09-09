# SANKET × CivicLens — Deployment & Environment Guide

## 1. Production Deployment Architecture
- **Backend Service**: Containerized FastAPI deployed via Uvicorn/Gunicorn behind NGINX reverse proxy.
- **Database**: PostgreSQL 16 with PostGIS 3.4 and pgvector extensions.
- **Frontend Applications**: Static PWA artifacts hosted on edge CDN or reverse-proxied NGINX with Service Worker cache headers.
- **Evidence Storage**: AWS S3 / MinIO / Local persistent file mount with content-addressable storage.

---

## 2. Environment Variables (.env)
Refer to `.env.example` for all configurable variables:
- `DATABASE_URL`: `postgresql+asyncpg://user:pass@localhost:5432/civiclens` (defaults to embedded SQLite spatial for local dev)
- `JWT_SECRET`: High-entropy key for token signing
- `DATA_GOV_IN_API_KEY`: Official API key for India OGD portal
- `UPLOAD_DIR`: Path to secure persistent upload directory
- `DEMO_MODE`: `false` (Production mode with ZERO mock data)

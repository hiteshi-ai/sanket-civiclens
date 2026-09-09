# SANKET × CivicLens — System Architecture

## 1. System Vision & Architecture
SANKET × CivicLens is an enterprise civic infrastructure intelligence and municipal operations platform for the entire jurisdiction of Chandigarh, India.

- **SANKET**: The underlying intelligence layer providing computer vision, spatiotemporal incident fusion, deterministic scoring (confidence, risk, priority aging, civic memory), and grounded RAG civic evidence.
- **CivicLens**: The operational applications suite:
  - **Citizen PWA**: Offline-first reporting, camera capture, AI assistance with citizen override, and idempotent synchronization.
  - **Field Officer PWA**: Task assignment, GIS navigation, before/after evidence capture, and computed Smart Closure Matching.
  - **Municipal Command Center**: City-wide Chandigarh GIS map, priority queue, real analytics, audit trail, and Data Source Registry.

---

## 2. Technology Stack
- **Backend**: Python 3.14, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2.
- **Data & Spatial**: PostgreSQL + PostGIS (with automatic SQLite spatial/haversine fallback for zero-dependency execution).
- **Intelligence**: Scikit-learn, NumPy, Pillow, TF-IDF / Cosine Vector Space, SANKET scoring engine.
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS / Lucide icons, Service Worker, IndexedDB (`idb`), Leaflet GIS mapping.
- **Architecture**: Monorepo with strict separation of concerns across `/backend`, `/apps`, `/shared`, `/data`, and `/docs`.

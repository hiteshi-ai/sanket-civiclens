# SANKET × CivicLens — Build Status & Architecture Log

## Project Identification
- **Project**: SANKET × CivicLens
- **Tagline**: "Every report is a signal. Together, they reveal the real problem."
- **Positioning**: "SANKET is the intelligence layer, CivicLens is the platform citizens and cities use."
- **Jurisdiction**: Chandigarh, India (Entire Union Territory: Sectors 1–63, Industrial Area, Manimajra, etc.)
- **Data Integrity Standard**: ZERO FAKE DATA. Deterministic versioned scoring. Honest empty states. Full provenance.

---

## Phase Status Summary

| Phase | Description | Status | Verification State |
|---|---|---|---|
| **Phase 1** | Repo Structure, Database Models, Spatial Engine, Auth, Base API, Docs | IN_PROGRESS | FastAPI startup, schema bootstrap, health, auth routes, and empty analytics verified |
| **Phase 2** | Citizen PWA (Offline-First, IndexedDB, Camera, GPS, Idempotency) | PENDING | Scheduled |
| **Phase 3** | SANKET AI Computer Vision & Feature Classifier | PENDING | Scheduled |
| **Phase 4** | SANKET Intelligence Engines (Fusion, CC-v1.0, RISK-v1.0, PRIORITY-v1.0, Memory) | PENDING | Scheduled |
| **Phase 5** | Municipal Command Center (Chandigarh GIS Map, Priority Queue, Analytics) | PENDING | Scheduled |
| **Phase 6** | Field Officer PWA (Assigned Incidents, Before/After, Smart Closure Match) | PENDING | Scheduled |
| **Phase 7** | Official Government Data Adapters & Data Source Registry | PENDING | Scheduled |
| **Phase 8** | RAG Civic Evidence Assistant ("Ask CivicLens" with Grounded Citations) | PENDING | Scheduled |
| **Phase 9** | Automated Testing Suite, Offline Verification, Anti-Fabrication Tests | PENDING | Scheduled |
| **Phase 10**| Deployment Setup, Documentation, End-to-End Acceptance Verification | PENDING | Scheduled |

---

## Detailed Component Tracker

### 1. Core & Backend
- [ ] Directory layout created (documented monorepo directories are not present in this checkout)
- [ ] Database models & schema with spatial capability (PostGIS / SQLite spatial fallback)
- [ ] RBAC Authentication (CITIZEN, FIELD_WORKER, MUNICIPAL_OFFICER, ADMIN)
- [ ] Base FastAPI application & routers
- [ ] Immutable Audit Logging

### 2. SANKET Intelligence Engine
- [ ] Computer Vision service (`AIService`, `LocalVisionProvider`, deterministic classification)
- [ ] Spatiotemporal Incident Fusion (`MATCH_CONFIRMED`, `LIKELY_MATCH`, `POSSIBLE_MATCH`, `NO_MATCH`)
- [ ] Civic Confidence Engine (`CC-v1.0`, explainable evidence breakdown)
- [ ] Civic Risk Scoring (`RISK-v1.0`, reproducible mathematical function)
- [ ] Priority Aging & Fairness (`PRIORITY-v1.0`, waiting time factor)
- [ ] Civic Memory Engine (`RECURRENCE-v1.0`, real historical recurrence only)
- [ ] Smart Closure Match (`CLOSURE-v1.0`, spatial + cosine image feature comparison)

### 3. Applications
- [ ] Citizen PWA: Offline-first IndexedDB, Service Worker, GPS capture, report submission
- [ ] Field Officer PWA: Assigned list, GPS navigation, before/after capture, smart closure
- [ ] Municipal Command Center: Real KPI stats, Chandigarh-wide GIS map, Priority queue, Analytics

### 4. Data Provenance & Official Adapters
- [ ] `docs/DATA_SOURCE_REGISTRY.md`
- [ ] Adapters: DataGov, SmartCities, PunjabOGD, LGD, ChandigarhMunicipal
- [ ] Provenance badge system & lineage metadata

### 5. RAG Civic Evidence Assistant
- [ ] Official document ingestion & vector index
- [ ] Cosine similarity retrieval
- [ ] Grounded generation with source citations & zero-hallucination guardrail

### 6. Anti-Fabrication & Testing
- [ ] Zero incidents test: verify 0 stats and empty state
- [ ] Single report test: verify no false corroboration
- [ ] Idempotent sync test: verify no duplicate records
- [ ] RAG unanswerable test: verify honest refusal
- [ ] Offline sync browser verification

## Runtime Audit — 2026-09-09

### What works
- FastAPI imports and starts through `backend.app.main:app`.
- The local schema bootstraps with SQLAlchemy against the configured database.
- `/health` returns a healthy service response.
- The OpenAPI document exposes the implemented `/api/v1` routers.
- Empty analytics returns zero counts and does not fabricate incidents or scores.

### What was fixed
- Repaired invalid Python syntax in `backend/app/core/config.py`.
- Restored the missing FastAPI entrypoint at `backend/app/main.py`.
- Added the PostgreSQL driver and missing backend runtime dependencies to `backend/requirements.txt`.
- Added the Replit workflow for port 5000.

### Current gaps
- The imported checkout contains no `apps/`, `shared/`, `data/`, or `tests/` directories and no frontend package manifest.
- `pytest` currently reports that no tests are collected.
- Citizen, field, and municipal portal UI flows therefore remain unavailable in this checkout.

### Commands verified
- `python -m compileall -q backend`
- FastAPI `TestClient` startup and `/health`
- FastAPI `TestClient` `/api/v1/analytics/overview`
- `curl http://127.0.0.1:5000/health`
- `curl http://127.0.0.1:5000/api/v1/analytics/overview`
- `python -m pytest -q` (no tests collected)

---
*Last updated: Phase 1 initialized.*

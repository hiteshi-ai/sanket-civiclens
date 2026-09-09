# SANKET × CivicLens

> **"Every report is a signal. Together, they reveal the real problem."**  
> *SANKET is the intelligence layer, CivicLens is the platform citizens and cities use.*

An AI-powered civic infrastructure intelligence and prevention platform engineered for the entire jurisdiction of **Chandigarh, India**.

---

## Non-Negotiable Core Principle: Absolute Data Integrity
- **Zero Synthetic Data**: No `Math.random()`, no fake incident generators, no synthetic metrics, no hardcoded dashboard counts.
- **Honest Empty States**: Displays `"Data unavailable"`, `"Historical data unavailable"`, or `"Official API unavailable"` when records are absent.
- **First-Class Provenance**: Every record is traceable to its source (`GOVERNMENT`, `MUNICIPAL`, `CITIZEN`, `FIELD_TEAM`, `AI_DERIVED`, `SYSTEM_DERIVED`).
- **Deterministic Versioned Scoring**: All confidence (`CC-v1.0`), risk (`RISK-v1.0`), priority (`PRIORITY-v1.0`), civic memory recurrence (`RECURRENCE-v1.0`), and smart closure match (`CLOSURE-v1.0`) scores are strictly explainable and reproducible.

---

## System Architecture

The monorepo contains:
- **`backend/`**: FastAPI service, SQLAlchemy models, SANKET intelligence engines, RAG civic evidence assistant, official government data adapters.
- **`apps/`**:
  - `citizen-pwa`: Mobile-first PWA with offline IndexedDB queue, camera capture, AI assistance with citizen override, and idempotent synchronization.
  - `field-pwa`: Mobile-first field officer PWA with assigned task list, navigation, and Smart Closure Match.
  - `municipal-dashboard`: Desktop-first command center with Chandigarh-wide GIS map, real metric cards, priority queue, and RAG assistant.
- **`shared/`**: Shared TypeScript contracts, categories, and formula constants.
- **`docs/`**: Comprehensive specifications for architecture, scoring formulas, data provenance, and testing.

---

## Quickstart Guide

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m app.main
```
The FastAPI documentation and interactive OpenAPI explorer will be live at `http://localhost:8000/docs`.

### 2. Frontend Applications Setup
```bash
npm install
npm run dev
```
The CivicLens portals will be accessible at `http://localhost:5173`.

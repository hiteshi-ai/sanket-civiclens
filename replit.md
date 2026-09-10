# SANKET × CivicLens on Replit

## Current runnable surface

This checkout contains the FastAPI backend plus one small React/Vite MVP frontend. The separate documented frontend applications (`apps/`), shared contracts, data directory, and test suite are not present; the MVP intentionally provides only the Citizen Report and Municipal Dashboard views.

## Run

The Replit workflow starts the backend on port 5000:

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 5000
```

Useful endpoints:

- `/health` — service health check
- `/docs` — interactive FastAPI documentation
- `/api/v1/analytics/overview` — live, database-backed metrics

The backend uses the configured `DATABASE_URL`. When no database service is configured, use the documented SQLite fallback:

```bash
DATABASE_URL=sqlite:///./sanket_civiclens.db uvicorn backend.app.main:app --host 0.0.0.0 --port 5000
```

The MVP frontend runs separately on port 5173 and proxies `/api` requests to the backend:

```bash
npm install
npm run dev -- --port 5173
```

The two frontend views are:

- Citizen Report — photo, GPS, category, description, and real report submission
- Municipal Dashboard — live analytics, incident queue, API-backed map, and score details

## Data integrity

The application starts with an empty database and returns zero counts or honest unavailable states. Do not add synthetic incidents, dashboard counts, scores, or government records.

## Verification status

The backend startup, database schema bootstrap, health endpoint, OpenAPI route registration, and empty analytics response have been verified. The frontend build, both MVP views, frontend-to-backend API proxy, and empty dashboard state have also been verified. No automated tests are currently present; `python -m pytest -q` reports that no tests are collected.
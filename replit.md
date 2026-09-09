# SANKET × CivicLens on Replit

## Current runnable surface

This checkout currently contains the FastAPI backend and project documentation. The documented frontend applications (`apps/`), shared contracts, data directory, and test suite are not present in the imported repository.

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

## Data integrity

The application starts with an empty database and returns zero counts or honest unavailable states. Do not add synthetic incidents, dashboard counts, scores, or government records.

## Verification status

The backend startup, database schema bootstrap, health endpoint, OpenAPI route registration, and empty analytics response have been verified. No automated tests are currently present; `python -m pytest -q` reports that no tests are collected.
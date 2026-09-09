# SANKET × CivicLens — REST API Reference (`/api/v1`)

All endpoints are prefixed with `/api/v1` and return standard JSON responses with Pydantic validation.

## Endpoints

### 1. Authentication (`/auth`)
- `POST /api/v1/auth/login`: Authenticate citizen, field worker, or municipal officer; returns JWT token.
- `GET /api/v1/auth/me`: Fetch current authenticated profile and assigned role.

### 2. Synchronization & Reports (`/sync`, `/reports`)
- `POST /api/v1/sync/reports`: Idempotent batch/single report sync. Accepts client `idempotency_key`, photo payload/metadata, GPS coordinates, category, and description.
- `GET /api/v1/reports`: List user's reports or query by sector/status.
- `GET /api/v1/reports/{report_id}`: Retrieve detailed report with full provenance and AI prediction metadata.

### 3. Incidents & SANKET Intelligence (`/incidents`)
- `GET /api/v1/incidents`: Query Chandigarh incidents with filters: `sector`, `category`, `status`, `min_risk`, `min_confidence`.
- `GET /api/v1/incidents/{incident_id}`: Fetch incident details, including fused reports, civic memory, and score lineage.
- `GET /api/v1/incidents/{incident_id}/why-score`: Returns auditable calculation breakdown and formula version for confidence and risk.

### 4. Field Assignments & Smart Closure (`/assignments`, `/closures`)
- `GET /api/v1/assignments`: List assigned incidents for authenticated field worker.
- `POST /api/v1/assignments/{incident_id}/assign`: Municipal officer assigns incident to field team.
- `POST /api/v1/closures/match`: Submit after-repair photo and field GPS; calculates Smart Closure Match (`CLOSURE-v1.0`).
- `POST /api/v1/closures/verify`: Human confirmation and closure of incident.

### 5. Municipal GIS & Analytics (`/map`, `/analytics`)
- `GET /api/v1/map/incidents`: Geospatial incident markers for whole Chandigarh jurisdiction with severity/category attributes.
- `GET /api/v1/analytics/overview`: Real computed metrics: total incidents, open, average confidence, resolution times. Zero values returned when no data exists (zero fabrication).

### 6. Data Sources & Provenance (`/data-sources`)
- `GET /api/v1/data-sources`: Catalog of all official sources with status (`LIVE API`, `HISTORICAL DATASET`, `API UNAVAILABLE`).
- `POST /api/v1/data-sources/{source_id}/sync`: Trigger official adapter refresh.

### 7. RAG Civic Evidence Assistant (`/rag`)
- `POST /api/v1/rag/query`: Submit citizen or municipal inquiry; returns grounded answer with direct source citations or honest evidence unavailability notice.

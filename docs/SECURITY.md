# SANKET × CivicLens — Security & Privacy Architecture

## 1. Role-Based Access Control (RBAC)
Role permissions are enforced strictly server-side in FastAPI dependencies:
- `CITIZEN`: Can submit reports, view own reports, access generalized nearby public civic map, query Civic Evidence Assistant.
- `FIELD_WORKER`: Can view assigned tasks, submit on-site inspection photos, execute Smart Closure matching.
- `MUNICIPAL_OFFICER`: Full access to Chandigarh incident queue, assignment dispatch, human closure approvals, priority overrides, and audit logs.
- `ADMIN`: Full administrative control, data adapter management, and system configuration.

---

## 2. Location Privacy & Citizen Protection
- Public civic maps generalize incident coordinates within a 25-meter fuzzy radius for citizen-facing views to protect citizen residential privacy.
- Raw meter-level GPS is accessible only by authenticated Municipal Officers and assigned Field Personnel.
- Citizen PII (phone, email) is encrypted and excluded from public map endpoints.

---

## 3. Storage & Upload Hardening
- MIME validation on image uploads (JPEG, PNG, WebP only).
- Max file size enforcement (10MB).
- SHA-256 content hashing to prevent duplicate file storage and ensure image integrity during Smart Closure comparison.
- Strict SQL injection protection via SQLAlchemy parametrized queries.

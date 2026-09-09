# SANKET × CivicLens — Data Integrity Specification

## 1. The Principle of Absolute Data Accuracy
In civic infrastructure intelligence, fabricated data is dangerous. Presenting simulated potholes, artificial citizen counts, or synthetic risk percentages distorts municipal decision-making and destroys public trust.

**SANKET × CivicLens enforces a strict Zero-Fabrication Architecture.**

---

## 2. Forbidden Practices in Production Code
The following are strictly banned across all layers of the platform:
- `Math.random()`, `random.random()`, or stochastic generators for production scores, coordinates, counts, or dates.
- Faker/mock libraries in production bundles or backend runtime paths.
- Synthetic collections (`fakeIncidents`, `mockIncidents`, `sampleReports`, `demoStats`).
- Hardcoded dashboard statistics (e.g. static "1,248 incidents", "92% resolved", "84/100 risk").
- Hallucinated RAG responses that state unverified facts without source citations.

---

## 3. Honest Empty States
Whenever data is absent, the system provides an honest, clear empty state:

| Condition | Required System Output | Rationale |
|---|---|---|
| Fresh database, zero reports | Metric: `0`<br/>State: `"No verified incidents yet."` | Prevents illusion of pre-existing activity |
| Unsurveyed sector / location | `"Historical data unavailable"` | Prevents false sense of security or danger |
| One isolated citizen report | Corroboration: `"Independent corroboration unavailable"`<br/>Count: `1 report` | Honest representation of single observation |
| Exposure dataset absent | Exposure: `"Data unavailable"` | Avoids inventing traffic/population counts |
| Recurrence analysis inconclusive | `"Insufficient historical evidence to establish recurrence"` | Requires minimum temporal and spatial threshold |
| External government API missing key/down | Status: `"Official API unavailable"` / `"Historical dataset"` | Distinguishes static snapshots from live streams |
| Closure photo missing/unmatched | Closure Score: `"Calculated: Insufficient evidence"`<br/>Status: `"REVIEW_REQUIRED"` | Prevents automated false resolutions |

---

## 4. Architectural Safeguards
1. **Database Constraints**: Every derived score (`confidence_score`, `risk_score`, `priority_score`, `closure_match_score`) requires an accompanying `score_calculation` record with full mathematical inputs and formula version.
2. **Audit Logging**: All database state changes record immutable audit events with actor, timestamp, and payload.
3. **CI/CD Automated Anti-Fabrication Test**: Test suites run against a clean database verifying that all dashboard cards return exact zeroes or `"Data unavailable"`, and that scoring functions strictly throw validation errors if fed synthetic dummy arguments.

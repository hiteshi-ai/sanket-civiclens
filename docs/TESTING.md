# SANKET × CivicLens — Testing Strategy & Verification Plan

## 1. Multi-Layer Testing Strategy
The test suite validates both standard software functionality and strict civic data integrity constraints:

### A. Anti-Fabrication & Empty-State Tests
1. **Zero Incidents Invariance**: Asserts dashboard returns count = 0, no fabricated charts, and honest empty states.
2. **Single Report Corroboration**: Asserts `Civic Confidence` for 1 report shows 0 corroboration score without false claims.
3. **Missing Exposure Invariance**: Asserts missing traffic data outputs `"Exposure data unavailable"`.
4. **Offline Sync Idempotency**: Submits identical report UUID 5 times; asserts single database row.
5. **RAG Grounding**: Verifies unanswerable query refuses to hallucinate and states insufficient evidence.

### B. Unit & Algorithmic Tests
- `tests/test_scoring.py`: Mathematical verification of `CC-v1.0`, `RISK-v1.0`, `PRIORITY-v1.0`, `CLOSURE-v1.0`.
- `tests/test_fusion.py`: Spatiotemporal proximity clustering (Haversine distance and time window bounds).
- `tests/test_closure.py`: Feature distance and location tolerance calculation.
- `tests/test_rag.py`: Cosine similarity and citation retrieval.

### C. End-to-End Operational Lifecycle
- Citizen submit (online & offline) $\to$ Incident Fusion $\to$ Municipal queue triage $\to$ Field assignment $\to$ Smart Closure matching $\to$ Human verification closed.

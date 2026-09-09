# SANKET × CivicLens — Data Provenance System

## 1. Distinction: Provenance vs Confidence
- **DATA PROVENANCE** answers: *"Where did this information come from and how was it transformed?"*
- **CIVIC CONFIDENCE** answers: *"How certain are we that this incident interpretation is accurate based on physical and corroborative evidence?"*

SANKET treats Data Provenance as a first-class citizen across both database architecture and user interfaces.

---

## 2. Lineage Metadata Model
Every external record, citizen report, municipal dataset entry, and derived intelligence record stores the following lineage attributes:

```sql
source_type           VARCHAR(32)   -- GOVERNMENT, MUNICIPAL, CITIZEN, FIELD_TEAM, AI_DERIVED, SYSTEM_DERIVED
source_name           VARCHAR(255)  -- e.g., "MCC Urban Asset Register"
source_authority      VARCHAR(255)  -- e.g., "Municipal Corporation Chandigarh"
source_url            VARCHAR(512)  -- Official verification URL
dataset_name          VARCHAR(255)  -- Official dataset identifier
source_date           TIMESTAMP     -- Date asserted by the source
reference_year        VARCHAR(16)   -- Reference period (e.g. "2024-2026")
retrieved_at          TIMESTAMP     -- Exact timestamp fetched/ingested
verification_status   VARCHAR(32)   -- VERIFIED, UNVERIFIED, EXPIRED
original_record_id    VARCHAR(128)  -- ID in the originating external dataset
transformation_method VARCHAR(128)  -- e.g., "DIRECT_INGESTION", "HAVERSINE_SPATIAL_JOIN", "VGG_FEATURE_EXTRACT"
```

---

## 3. Provenance UI Badge System
The client applications render distinct badges with high contrast for unambiguous visual hierarchy:

| Badge | Class / Color | Meaning |
|---|---|---|
| `OFFICIAL GOVERNMENT` | Emerald Green | Direct official dataset from India OGD, MoHUA, or Chandigarh UT |
| `MUNICIPAL` | Deep Blue | Published by Municipal Corporation Chandigarh (MCC) |
| `CITIZEN REPORT` | Cyan / Sky Blue | Submitted by an authenticated citizen through CivicLens PWA |
| `FIELD VERIFIED` | Amber / Gold | Inspected and signed by an on-site municipal field officer |
| `AI DERIVED` | Purple / Violet | Detected by computer vision or NLP; strictly flagged as a suggestion |
| `SYSTEM DERIVED` | Slate / Indigo | Computed by SANKET deterministic scoring engines |

---

## 4. Incident Lineage Example
When viewing an incident in the Municipal Command Center or Citizen Report Details:

```
[MUNICIPAL DASHBOARD — INCIDENT #INC-2026-CHD-0042]
------------------------------------------------------------------
Category: POTHOLE_ROAD_DAMAGE (AI Suggestion, Confirmed by Citizen)
Location: Lat 30.7398, Lon 76.7827 (Sector 17, Chandigarh)
Location Source: Device GPS (Accuracy: ±4.2m)
Report Origin: Citizen Report (ID: REP-8f92a1c0)
Submitted At: 2026-09-09T08:14:22Z
Corroboration: 2 independent citizen reports (Fused under FUS-v1.0)
Civic Memory: 1 prior historical repair on record (MCC Asset Log 2025)
Field Verification: Assigned to Sector 17 Division (Pending Inspection)
------------------------------------------------------------------
Provenance Audit:
- Initial Photo: Citizen REP-8f92a1c0 (Retrieved: 2026-09-09 08:14:22Z)
- AI Classification: SANKET-Vision-v1.0 (Inference: 2026-09-09 08:14:24Z)
- Spatial Boundary: Chandigarh LGD Ward 12 (Source: SRC-GOV-LGD-CHD)
```

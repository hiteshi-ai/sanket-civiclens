# SANKET — Scoring Methodology & Formula Specifications

All scores in SANKET are deterministic, versioned, and auditable. Under no circumstances does an LLM or a random number generator calculate scores.

---

## 1. Civic Confidence (`CC-v1.0`)

### Purpose
Quantifies certainty that a reported issue exists as described, without fabricating corroboration.

### Mathematical Formulation
$$CC = \min\left(100, \text{round}\left(S_{\text{base}} + S_{\text{reports}} + S_{\text{geo}} + S_{\text{temporal}} + S_{\text{category}} + S_{\text{field}}\right)\right)$$

Where:
- $S_{\text{base}} = 25$ (Valid report with photo and device GPS/manual coordinates)
- $S_{\text{reports}} = \min(35, (N - 1) \times 15)$ where $N$ is count of distinct citizen reports fused.
  - If $N = 1 \implies S_{\text{reports}} = 0$ (corroboration unavailable).
- $S_{\text{geo}} = \begin{cases} 
  15 & \text{if } \Delta d_{\text{max}} \le 15\text{m} \\ 
  10 & \text{if } 15\text{m} < \Delta d_{\text{max}} \le 30\text{m} \\ 
  0 & \text{if } N = 1 \text{ or } \Delta d > 30\text{m} 
  \end{cases}$
- $S_{\text{temporal}} = \begin{cases} 
  10 & \text{if reports within 24h of each other} \\ 
  5 & \text{if reports within 72h} \\ 
  0 & \text{if } N = 1 
  \end{cases}$
- $S_{\text{category}} = 5$ if citizen-confirmed category matches SANKET AI detection.
- $S_{\text{field}} = 20$ if inspected and corroborated by an authorized field worker.

### Explainable Output
```json
{
  "confidence_score": 50,
  "formula_version": "CC-v1.0",
  "evidence_breakdown": {
    "base_evidence": 25,
    "independent_reports_count": 1,
    "corroboration_score": 0,
    "geographic_agreement": "Single report (corroboration unavailable)",
    "temporal_clustering": "Single report",
    "category_agreement": 5,
    "field_verification": "Pending"
  },
  "label": "Explainable decision-support indicator"
}
```

---

## 2. Civic Risk Score (`RISK-v1.0`)

### Purpose
Evaluates potential public hazard, infrastructure deterioration, and disruption impact.

### Mathematical Formulation
$$\text{Risk} = \min\left(100, \text{round}\left(w_s \cdot \text{Severity} + w_c \cdot \left(\frac{CC}{100} \times 10\right) + w_m \cdot \text{Recurrence} + w_e \cdot \text{Exposure}\right)\right)$$

Weights:
- $w_s = 4.0$ (Severity scale 1 to 10 based on issue category and physical extent)
- $w_c = 2.5$ (Civic Confidence factor 0 to 10)
- $w_m = 2.0$ (Civic Memory Recurrence factor 0 to 10)
- $w_e = 1.5$ (Exposure factor: traffic volume / footfall / sensitive zone, 0 to 10)

### Missing Exposure Rule
If official traffic or pedestrian exposure data does not exist for the coordinate, $w_e$ is NOT fabricated. Instead:
- $\text{Exposure} = \text{"Data unavailable"}$
- Weight is re-allocated proportionally across Severity, Confidence, and Recurrence.

---

## 3. Priority Aging & Fairness (`PRIORITY-v1.0`)

### Purpose
Prevents starvation of older, moderate-severity issues by newly arrived high-severity reports.

### Mathematical Formulation
$$\text{Priority} = \text{Risk} \times \left(1 + \min(2.5, 0.08 \times \text{waiting\_days})\right) + \text{Impact}$$

Where:
- $\text{waiting\_days} = \frac{T_{\text{current}} - T_{\text{first\_reported}}}{86400}$ (calculated strictly from server timestamps; never synthetic).
- $\text{Impact} \in [0, 20]$ (based on arterial road vs residential alley classification).
- $0.08 \times \text{waiting\_days}$ ensures an issue open for 14 days gains an effective multiplier of $1 + 1.12 = 2.12\times$.

---

## 4. Civic Memory & Recurrence (`RECURRENCE-v1.0`)

### Purpose
Detects structural infrastructure defects and repeat failures at the same geographic coordinate.

### Rules
1. Searches historical verified incidents within a radius $R \le 50\text{m}$.
2. Compares categories (e.g. `POTHOLE_ROAD_DAMAGE` or `DRAINAGE_WATERLOGGING`).
3. If $N_{\text{hist}} = 0 \implies$ `"Historical data unavailable"`.
4. If $N_{\text{hist}} = 1$ and elapsed time $< 14\text{ days} \implies$ `"Insufficient historical evidence to establish recurrence (possible active continuation)"`.
5. If $N_{\text{hist}} \ge 2$ with distinct temporal repair intervals $\implies$ `"Recurring pattern detected"` with linked historical incident IDs.

---

## 5. Smart Closure Match (`CLOSURE-v1.0`)

### Purpose
Validates that an on-site field officer's repair photo and location truly correspond to the assigned civic incident before closing it.

### Mathematical Formulation
$$\text{ClosureMatch} = 0.40 \cdot S_{\text{geo}} + 0.45 \cdot S_{\text{image}} + 0.15 \cdot S_{\text{category}}$$

Where:
- $S_{\text{geo}} = \max\left(0, 1.0 - \frac{\text{distance\_meters}}{50.0}\right) \times 100$
  - Must be within $50\text{m}$ of original report coordinate.
- $S_{\text{image}} = \text{CosineSimilarity}(\vec{f}_{\text{before}}, \vec{f}_{\text{after}}) \times 100$
  - Extracted color/edge histogram and structural feature vectors.
- $S_{\text{category}} = 100$ if categories match, else $0$.

### Decision Thresholds
- $\ge 75\% \implies \text{LIKELY\_MATCH}$
- $50\% - 74\% \implies \text{REVIEW\_REQUIRED}$
- $< 50\% \implies \text{MISMATCH\_SUSPECTED}$

Human confirmation by a municipal officer is mandatory prior to final closure.

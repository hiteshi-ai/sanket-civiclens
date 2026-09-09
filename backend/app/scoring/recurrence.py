import datetime
from typing import Dict, Any, List

FORMULA_VERSION = "RECURRENCE-v1.0"

def evaluate_civic_memory_recurrence(
    historical_incidents: List[Dict[str, Any]],
    current_category: str
) -> Dict[str, Any]:
    """
    Deterministic Civic Memory Recurrence Engine (RECURRENCE-v1.0).
    Evaluates real historical records within geographic radius.
    Never claims recurrence without legitimate temporal separation and evidence.
    """
    if not historical_incidents:
        return {
            "status": "Historical data unavailable",
            "recurrence_factor": 0.0,
            "formula_version": FORMULA_VERSION,
            "supporting_record_ids": [],
            "evidence_breakdown": {
                "historical_count": 0,
                "detail": "No prior municipal or citizen records found for this location"
            }
        }

    # Filter matching or related category records
    category_matches = [
        inc for inc in historical_incidents
        if inc.get("category") == current_category
    ]

    if len(category_matches) < 2:
        return {
            "status": "Insufficient historical evidence to establish recurrence",
            "recurrence_factor": 1.0 if category_matches else 0.0,
            "formula_version": FORMULA_VERSION,
            "supporting_record_ids": [inc.get("id") for inc in category_matches if inc.get("id")],
            "evidence_breakdown": {
                "historical_count": len(category_matches),
                "detail": "Only 1 historical record exists; insufficient temporal separation to confirm systemic recurrence"
            }
        }

    # Check temporal separation: are there incidents separated by at least 14 days?
    dates = []
    for inc in category_matches:
        dt = inc.get("created_at") or inc.get("first_reported_at")
        if isinstance(dt, str):
            try:
                dt = datetime.datetime.fromisoformat(dt.replace("Z", "+00:00"))
            except Exception:
                dt = None
        if dt:
            dates.append((dt, inc.get("id")))

    dates.sort(key=lambda x: x[0])
    
    # Check max time span between oldest and newest
    separated = False
    if len(dates) >= 2:
        time_span_days = (dates[-1][0] - dates[0][0]).total_seconds() / 86400.0
        if time_span_days >= 14.0:
            separated = True

    if separated:
        # Calculate recurrence factor based on verified repeat incidents
        rec_factor = min(10.0, 3.0 + (len(category_matches) * 1.5))
        return {
            "status": "Recurring pattern detected",
            "recurrence_factor": round(rec_factor, 1),
            "formula_version": FORMULA_VERSION,
            "supporting_record_ids": [d[1] for d in dates if d[1]],
            "evidence_breakdown": {
                "historical_count": len(category_matches),
                "time_span_days": round(time_span_days, 1),
                "detail": f"Recurring failure pattern: {len(category_matches)} repeat incidents over {time_span_days:.0f} days"
            }
        }
    else:
        return {
            "status": "Insufficient historical evidence to establish recurrence",
            "recurrence_factor": 1.5,
            "formula_version": FORMULA_VERSION,
            "supporting_record_ids": [d[1] for d in dates if d[1]],
            "evidence_breakdown": {
                "historical_count": len(category_matches),
                "detail": "Incidents clustered within 14 days; likely related to single ongoing failure event"
            }
        }

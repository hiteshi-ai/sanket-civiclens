import datetime
from typing import Dict, Any, Optional

FORMULA_VERSION = "PRIORITY-v1.0"

def calculate_priority_aging(
    risk_score: float,
    first_reported_at: datetime.datetime,
    current_time: Optional[datetime.datetime] = None,
    impact_factor: float = 5.0
) -> Dict[str, Any]:
    """
    Deterministic Priority Aging & Fairness scoring (PRIORITY-v1.0).
    Waiting time calculated strictly from actual timestamps.
    Prevents newer high-severity issues from permanently starving older issues.
    """
    if current_time is None:
        current_time = datetime.datetime.utcnow()

    # Calculate actual elapsed days
    elapsed_seconds = max(0.0, (current_time - first_reported_at).total_seconds())
    waiting_days = elapsed_seconds / 86400.0

    # Aging multiplier: 8% per day waiting, capped at 2.5x
    aging_factor = min(2.5, 0.08 * waiting_days)
    multiplier = 1.0 + aging_factor
    
    clamped_impact = max(0.0, min(20.0, float(impact_factor)))
    priority = (risk_score * multiplier) + clamped_impact

    return {
        "score": round(priority, 1),
        "waiting_days": round(waiting_days, 2),
        "formula_version": FORMULA_VERSION,
        "evidence_breakdown": {
            "base_risk": risk_score,
            "waiting_days": round(waiting_days, 2),
            "aging_multiplier": round(multiplier, 3),
            "impact_factor": clamped_impact,
            "formula": "Priority = Risk * (1 + min(2.5, 0.08 * waiting_days)) + Impact"
        },
        "label": "Fairness priority ranking"
    }

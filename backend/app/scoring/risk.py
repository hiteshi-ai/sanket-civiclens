from typing import Dict, Any, Optional

FORMULA_VERSION = "RISK-v1.0"

def calculate_civic_risk(
    severity: float,
    confidence_score: float,
    recurrence_factor: float = 0.0,
    exposure_factor: Optional[float] = None
) -> Dict[str, Any]:
    """
    Deterministic Civic Risk Score (RISK-v1.0).
    Reproducible evidence-based function. Never invents exposure data.
    """
    # Severity is on scale 1-10
    clamped_severity = max(1.0, min(10.0, float(severity)))
    # Confidence factor on scale 0-10
    clamped_confidence = max(0.0, min(10.0, float(confidence_score) / 10.0))
    # Recurrence factor on scale 0-10
    clamped_recurrence = max(0.0, min(10.0, float(recurrence_factor)))
    
    if exposure_factor is not None:
        clamped_exposure = max(0.0, min(10.0, float(exposure_factor)))
        exposure_display = f"Exposure verified: {clamped_exposure:.1f}/10"
        
        ws = 4.0
        wc = 2.5
        wm = 2.0
        we = 1.5
        raw_score = (ws * clamped_severity) + (wc * clamped_confidence) + (wm * clamped_recurrence) + (we * clamped_exposure)
    else:
        # Exposure data is absent in official records
        exposure_display = "Exposure data unavailable"
        # Reallocate weights proportionally (total 10.0)
        base_sum = 4.0 + 2.5 + 2.0  # 8.5
        ws = 4.0 * (10.0 / base_sum)
        wc = 2.5 * (10.0 / base_sum)
        wm = 2.0 * (10.0 / base_sum)
        we = 0.0
        raw_score = (ws * clamped_severity) + (wc * clamped_confidence) + (wm * clamped_recurrence)

    final_score = min(100.0, max(0.0, round(raw_score, 1)))

    return {
        "score": final_score,
        "formula_version": FORMULA_VERSION,
        "evidence_breakdown": {
            "severity_input": clamped_severity,
            "severity_weight": round(ws, 3),
            "confidence_factor": clamped_confidence,
            "confidence_weight": round(wc, 3),
            "recurrence_factor": clamped_recurrence,
            "recurrence_weight": round(wm, 3),
            "exposure_status": exposure_display,
            "exposure_weight": round(we, 3)
        },
        "label": "Explainable decision-support indicator"
    }

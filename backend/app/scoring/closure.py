from typing import Dict, Any, Optional
from backend.app.models.enums import ClosureMatchStatus

FORMULA_VERSION = "CLOSURE-v1.0"

def calculate_smart_closure_match(
    distance_meters: float,
    image_similarity: Optional[float] = None,
    category_match: bool = True
) -> Dict[str, Any]:
    """
    Deterministic Smart Closure Match (CLOSURE-v1.0).
    Calculates spatial proximity, structural image similarity, and category agreement.
    Never fabricates a match score or auto-closes without human verification.
    """
    # Proximity score (100% at 0m, 0% at 50m+)
    s_geo = max(0.0, 1.0 - (float(distance_meters) / 50.0)) * 100.0
    s_cat = 100.0 if category_match else 0.0

    if image_similarity is not None:
        clamped_sim = max(0.0, min(1.0, float(image_similarity)))
        s_img = clamped_sim * 100.0
        
        # 40% Geo, 45% Image, 15% Category
        raw_score = (0.40 * s_geo) + (0.45 * s_img) + (0.15 * s_cat)
        image_evidence = f"Feature similarity: {clamped_sim:.2f}"
    else:
        # Image similarity unavailable (e.g. nocturnal or obstructed shot)
        raw_score = (0.70 * s_geo) + (0.30 * s_cat)
        image_evidence = "Image similarity calculation unavailable"
        clamped_sim = None

    final_score = round(raw_score, 1)

    if final_score >= 75.0 and distance_meters <= 35.0:
        match_status = ClosureMatchStatus.LIKELY_MATCH
        summary = f"High confidence closure match ({final_score}%). On-site distance: {distance_meters:.1f}m."
    elif final_score >= 50.0:
        match_status = ClosureMatchStatus.REVIEW_REQUIRED
        summary = f"Moderate closure match ({final_score}%). On-site distance: {distance_meters:.1f}m. Review recommended."
    else:
        match_status = ClosureMatchStatus.MISMATCH_SUSPECTED
        summary = f"Low closure match ({final_score}%). Field officer location exceeds expected bounds ({distance_meters:.1f}m)."

    return {
        "closure_match_score": final_score,
        "match_status": match_status,
        "distance_meters": round(distance_meters, 1),
        "image_similarity": clamped_sim,
        "algorithm_version": FORMULA_VERSION,
        "requires_human_confirmation": True,
        "evidence_summary": summary
    }

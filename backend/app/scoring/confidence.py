from typing import Dict, Any, Optional

FORMULA_VERSION = "CC-v1.0"

def calculate_civic_confidence(
    reports_count: int,
    max_distance_meters: Optional[float] = None,
    time_difference_hours: Optional[float] = None,
    category_match: bool = True,
    field_verified: bool = False
) -> Dict[str, Any]:
    """
    Deterministic Civic Confidence scoring (CC-v1.0).
    Never fabricates corroboration. If reports_count == 1, corroboration score is strictly 0.
    """
    base_evidence = 25.0
    
    # Corroboration by independent reports
    if reports_count <= 1:
        reports_score = 0.0
        geo_score = 0.0
        geo_evidence = "Single report (corroboration unavailable)"
        temp_score = 0.0
        temp_evidence = "Single report"
    else:
        # Multi-report corroboration
        reports_score = min(35.0, (reports_count - 1) * 15.0)
        
        # Geographic agreement
        if max_distance_meters is not None:
            if max_distance_meters <= 15.0:
                geo_score = 15.0
                geo_evidence = f"Strong agreement (within {max_distance_meters:.1f}m)"
            elif max_distance_meters <= 30.0:
                geo_score = 10.0
                geo_evidence = f"Moderate agreement ({max_distance_meters:.1f}m)"
            else:
                geo_score = 0.0
                geo_evidence = f"Weak agreement ({max_distance_meters:.1f}m)"
        else:
            geo_score = 0.0
            geo_evidence = "Distance data unavailable"
            
        # Temporal clustering
        if time_difference_hours is not None:
            if time_difference_hours <= 24.0:
                temp_score = 10.0
                temp_evidence = f"Strong temporal cluster ({time_difference_hours:.1f}h)"
            elif time_difference_hours <= 72.0:
                temp_score = 5.0
                temp_evidence = f"Moderate temporal cluster ({time_difference_hours:.1f}h)"
            else:
                temp_score = 0.0
                temp_evidence = f"Extended time gap ({time_difference_hours:.1f}h)"
        else:
            temp_score = 0.0
            temp_evidence = "Time difference unavailable"

    # Category agreement (AI suggestion matches Citizen confirmation)
    cat_score = 5.0 if category_match else 0.0
    cat_evidence = "AI prediction aligns with user confirmation" if category_match else "User amended AI prediction"
    
    # Field verification
    field_score = 20.0 if field_verified else 0.0
    field_evidence = "Corroborated by on-site field officer" if field_verified else "Field verification pending"
    
    raw_total = base_evidence + reports_score + geo_score + temp_score + cat_score + field_score
    confidence = min(100.0, max(0.0, round(raw_total, 1)))
    
    return {
        "score": confidence,
        "formula_version": FORMULA_VERSION,
        "evidence_breakdown": {
            "base_evidence": base_evidence,
            "reports_count": reports_count,
            "corroboration_score": reports_score,
            "geographic_agreement": geo_evidence,
            "geographic_score": geo_score,
            "temporal_clustering": temp_evidence,
            "temporal_score": temp_score,
            "category_agreement": cat_evidence,
            "category_score": cat_score,
            "field_verification": field_evidence,
            "field_score": field_score
        },
        "label": "Explainable decision-support indicator"
    }

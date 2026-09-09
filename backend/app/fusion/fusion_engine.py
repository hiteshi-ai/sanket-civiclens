import datetime
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from backend.app.core.database import haversine_distance_meters
from backend.app.models.entities import Incident, Report, IncidentReport, IncidentMatch, ScoreCalculation
from backend.app.models.enums import IncidentStatus, FusionDecision, CivicCategory
from backend.app.scoring.confidence import calculate_civic_confidence
from backend.app.scoring.risk import calculate_civic_risk
from backend.app.scoring.priority import calculate_priority_aging
from backend.app.scoring.recurrence import evaluate_civic_memory_recurrence
from backend.app.core.config import settings

ALGORITHM_VERSION = "FUS-v1.0"

def compute_text_similarity(text1: Optional[str], text2: Optional[str]) -> float:
    if not text1 or not text2:
        return 0.0
    # Jaccard word-set similarity
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    if not words1 or not words2:
        return 0.0
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return float(len(intersection)) / float(len(union))

def evaluate_report_against_incident(
    report: Report,
    incident: Incident,
    image_sim: Optional[float] = None
) -> Tuple[float, FusionDecision, Dict[str, Any]]:
    """
    Evaluates spatiotemporal and semantic similarity between incoming report and an existing incident.
    """
    dist_m = haversine_distance_meters(report.latitude, report.longitude, incident.latitude, incident.longitude)
    if dist_m is None:
        dist_m = 99999.0
        
    time_diff_hours = abs((report.client_timestamp - incident.first_reported_at).total_seconds()) / 3600.0
    cat_match = (report.category == incident.category)
    text_sim = compute_text_similarity(report.description, incident.category.value)

    # Calculate spatial score (1.0 at 0m, 0.0 at 35m+)
    spatial_score = max(0.0, 1.0 - (dist_m / settings.FUSION_DISTANCE_THRESHOLD_METERS))
    
    # Calculate temporal score (1.0 at 0h, 0.0 at 72h+)
    temporal_score = max(0.0, 1.0 - (time_diff_hours / settings.FUSION_TIME_WINDOW_HOURS))
    
    # Category score
    category_score = 1.0 if cat_match else 0.0

    # Composite match score: 45% spatial, 25% category, 15% temporal, 15% image/text
    img_component = image_sim if image_sim is not None else text_sim
    composite = (0.45 * spatial_score) + (0.25 * category_score) + (0.15 * temporal_score) + (0.15 * img_component)
    overall_match_score = round(composite * 100.0, 1)

    # Determine decision thresholds
    if cat_match and dist_m <= 15.0 and time_diff_hours <= 48.0:
        decision = FusionDecision.MATCH_CONFIRMED
    elif cat_match and dist_m <= 35.0 and time_diff_hours <= 72.0:
        decision = FusionDecision.LIKELY_MATCH
    elif dist_m <= 50.0 and (cat_match or overall_match_score >= 50.0):
        decision = FusionDecision.REVIEW_REQUIRED
    elif dist_m <= 75.0:
        decision = FusionDecision.POSSIBLE_MATCH
    else:
        decision = FusionDecision.NO_MATCH

    metrics = {
        "distance_meters": round(dist_m, 1),
        "time_difference_hours": round(time_diff_hours, 1),
        "category_match": cat_match,
        "image_similarity": image_sim,
        "semantic_similarity": round(text_sim, 2),
        "overall_match_score": overall_match_score
    }
    return overall_match_score, decision, metrics

def process_incident_fusion(db: Session, report: Report, image_sim: Optional[float] = None) -> Incident:
    """
    Evaluates open incidents across Chandigarh for spatiotemporal fusion.
    If match is confirmed or likely, fuses report into existing incident and recalculates confidence.
    Otherwise, creates a new independent incident.
    """
    active_statuses = [IncidentStatus.OPEN, IncidentStatus.IN_TRIAGE, IncidentStatus.ASSIGNED, IncidentStatus.IN_PROGRESS]
    candidate_incidents = db.query(Incident).filter(Incident.status.in_(active_statuses)).all()

    best_incident = None
    best_score = 0.0
    best_decision = FusionDecision.NO_MATCH
    best_metrics = None

    for candidate in candidate_incidents:
        score, decision, metrics = evaluate_report_against_incident(report, candidate, image_sim)
        
        # Log match audit record
        match_audit = IncidentMatch(
            incident_id=candidate.id,
            candidate_report_id=report.id,
            distance_meters=metrics["distance_meters"],
            time_difference_hours=metrics["time_difference_hours"],
            category_match=metrics["category_match"],
            image_similarity=metrics["image_similarity"],
            overall_match_score=score,
            algorithm_version=ALGORITHM_VERSION,
            decision=decision
        )
        db.add(match_audit)

        if decision in (FusionDecision.MATCH_CONFIRMED, FusionDecision.LIKELY_MATCH) and score > best_score:
            best_score = score
            best_incident = candidate
            best_decision = decision
            best_metrics = metrics

    if best_incident is not None:
        # Fuse with existing incident
        inc_report = IncidentReport(
            incident_id=best_incident.id,
            report_id=report.id,
            is_primary=False
        )
        db.add(inc_report)
        
        # Update incident timestamps
        best_incident.last_reported_at = report.client_timestamp
        
        # Count total fused reports
        fused_count = db.query(IncidentReport).filter(IncidentReport.incident_id == best_incident.id).count() + 1
        
        # Recalculate deterministic Civic Confidence (CC-v1.0)
        conf_calc = calculate_civic_confidence(
            reports_count=fused_count,
            max_distance_meters=best_metrics["distance_meters"] if best_metrics else 0.0,
            time_difference_hours=best_metrics["time_difference_hours"] if best_metrics else 0.0,
            category_match=True,
            field_verified=False
        )
        best_incident.confidence_score = conf_calc["score"]
        
        # Recalculate deterministic Civic Risk (RISK-v1.0)
        risk_calc = calculate_civic_risk(
            severity=best_incident.severity,
            confidence_score=best_incident.confidence_score,
            recurrence_factor=0.0,
            exposure_factor=None
        )
        best_incident.risk_score = risk_calc["score"]

        # Recalculate Priority Aging (PRIORITY-v1.0)
        prio_calc = calculate_priority_aging(
            risk_score=best_incident.risk_score,
            first_reported_at=best_incident.first_reported_at
        )
        best_incident.priority_score = prio_calc["score"]
        best_incident.waiting_days = prio_calc["waiting_days"]

        # Save score calculation audit
        calc_record = ScoreCalculation(
            incident_id=best_incident.id,
            score_type="CIVIC_CONFIDENCE",
            formula_version="CC-v1.0",
            score_value=best_incident.confidence_score,
            input_record_ids=[report.id],
            evidence_breakdown=conf_calc["evidence_breakdown"]
        )
        db.add(calc_record)
        db.commit()
        db.refresh(best_incident)
        return best_incident

    else:
        # Create new master incident
        # Count existing incidents to generate sequential number
        total_incidents = db.query(Incident).count()
        inc_num = f"INC-CHD-2026-{total_incidents + 1:04d}"

        # Default severity based on category
        severity_map = {
            CivicCategory.POTHOLE_ROAD_DAMAGE: 7.0,
            CivicCategory.DRAINAGE_WATERLOGGING: 8.0,
            CivicCategory.GARBAGE_OVERFLOW: 5.0,
            CivicCategory.BROKEN_STREETLIGHT: 4.0,
            CivicCategory.OTHER: 4.0
        }
        severity = severity_map.get(report.category, 5.0)

        # Confidence for single initial report
        conf_calc = calculate_civic_confidence(
            reports_count=1,
            max_distance_meters=None,
            time_difference_hours=None,
            category_match=True,
            field_verified=False
        )
        
        # Risk for single initial report
        risk_calc = calculate_civic_risk(
            severity=severity,
            confidence_score=conf_calc["score"],
            recurrence_factor=0.0,
            exposure_factor=None
        )

        prio_calc = calculate_priority_aging(
            risk_score=risk_calc["score"],
            first_reported_at=report.client_timestamp
        )

        new_incident = Incident(
            incident_number=inc_num,
            category=report.category,
            latitude=report.latitude,
            longitude=report.longitude,
            sector_name=report.sector_name,
            severity=severity,
            confidence_score=conf_calc["score"],
            risk_score=risk_calc["score"],
            priority_score=prio_calc["score"],
            status=IncidentStatus.OPEN,
            waiting_days=prio_calc["waiting_days"],
            recurrence_status="Historical data unavailable",
            primary_photo_url=report.photo_url,
            first_reported_at=report.client_timestamp,
            last_reported_at=report.client_timestamp
        )
        db.add(new_incident)
        db.flush()

        inc_report = IncidentReport(
            incident_id=new_incident.id,
            report_id=report.id,
            is_primary=True
        )
        db.add(inc_report)

        # Audit score calculation
        calc_record = ScoreCalculation(
            incident_id=new_incident.id,
            score_type="CIVIC_CONFIDENCE",
            formula_version="CC-v1.0",
            score_value=conf_calc["score"],
            input_record_ids=[report.id],
            evidence_breakdown=conf_calc["evidence_breakdown"]
        )
        db.add(calc_record)
        db.commit()
        db.refresh(new_incident)
        return new_incident

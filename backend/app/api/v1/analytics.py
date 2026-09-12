from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any
from backend.app.core.database import get_db
from backend.app.models.entities import Incident, Report, ClosureSubmission
from backend.app.models.enums import IncidentStatus, CivicCategory
from backend.app.core.security import require_roles
from backend.app.models.enums import UserRole

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_roles([UserRole.COMMAND_ADMIN.value])),
) -> Dict[str, Any]:
    """
    Returns computed municipal analytics from actual database records.
    Never fabricates metrics. If there are 0 records, returns 0 and honest unavailable indicators.
    """
    total_incidents = db.query(Incident).count()
    total_reports = db.query(Report).count()
    open_incidents = db.query(Incident).filter(Incident.status == IncidentStatus.OPEN).count()
    in_progress = db.query(Incident).filter(Incident.status.in_([IncidentStatus.ASSIGNED, IncidentStatus.IN_PROGRESS])).count()
    pending_verification = db.query(Incident).filter(Incident.status == IncidentStatus.PENDING_VERIFICATION).count()
    closed_incidents = db.query(Incident).filter(Incident.status == IncidentStatus.VERIFIED_CLOSED).count()
    high_risk_count = db.query(Incident).filter(Incident.risk_score >= 70.0).count()

    # Category distribution
    cat_counts = {}
    for cat in CivicCategory:
        cnt = db.query(Incident).filter(Incident.category == cat).count()
        cat_counts[cat.value] = cnt

    # Average Civic Confidence (real data only)
    avg_conf = db.query(func.avg(Incident.confidence_score)).scalar()
    avg_conf_display = round(float(avg_conf), 1) if avg_conf is not None else None

    # Average Resolution Time (for VERIFIED_CLOSED incidents)
    closed_subs = db.query(ClosureSubmission).filter(ClosureSubmission.human_decision == "APPROVED").all()
    avg_resolution_hours = None
    if closed_subs:
        durations = []
        for s in closed_subs:
            inc = db.query(Incident).filter(Incident.id == s.incident_id).first()
            if inc and s.human_verified_at:
                hrs = (s.human_verified_at - inc.first_reported_at).total_seconds() / 3600.0
                if hrs >= 0:
                    durations.append(hrs)
        if durations:
            avg_resolution_hours = round(sum(durations) / len(durations), 1)

    return {
        "total_incidents": total_incidents,
        "total_reports": total_reports,
        "open_incidents": open_incidents,
        "in_progress_incidents": in_progress,
        "pending_verification": pending_verification,
        "verified_closed_incidents": closed_incidents,
        "high_risk_incidents": high_risk_count,
        "average_civic_confidence": avg_conf_display,
        "average_resolution_hours": avg_resolution_hours,
        "resolution_time_status": f"{avg_resolution_hours} hours" if avg_resolution_hours is not None else "Waiting time cannot be calculated",
        "category_distribution": cat_counts
    }

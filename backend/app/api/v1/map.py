from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from backend.app.core.database import get_db
from backend.app.models.entities import Incident, Sector, IncidentReport
from backend.app.models.enums import CivicCategory, IncidentStatus
from backend.app.core.security import require_auth

router = APIRouter(prefix="/map", tags=["GIS Map"])

@router.get("/incidents")
def get_map_incidents(
    sector: Optional[str] = Query(None),
    category: Optional[CivicCategory] = Query(None),
    status: Optional[IncidentStatus] = Query(None),
    min_risk: Optional[float] = Query(None),
    min_confidence: Optional[float] = Query(None),
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_auth),
) -> List[Dict[str, Any]]:
    """
    Returns verified spatial incidents for Chandigarh GIS map.
    Never fabricates markers. If database is empty or no match, returns empty list.
    """
    q = db.query(Incident)
    if sector:
        q = q.filter(Incident.sector_name == sector)
    if category:
        q = q.filter(Incident.category == category)
    if status:
        q = q.filter(Incident.status == status)
    if min_risk is not None:
        q = q.filter(Incident.risk_score >= min_risk)
    if min_confidence is not None:
        q = q.filter(Incident.confidence_score >= min_confidence)

    incidents = q.all()
    results = []
    for inc in incidents:
        fused_count = db.query(IncidentReport).filter(IncidentReport.incident_id == inc.id).count()
        results.append({
            "id": inc.id,
            "incident_number": inc.incident_number,
            "category": inc.category.value,
            "latitude": inc.latitude,
            "longitude": inc.longitude,
            "sector_name": inc.sector_name,
            "severity": inc.severity,
            "risk_score": inc.risk_score,
            "confidence_score": inc.confidence_score,
            "priority_score": inc.priority_score,
            "status": inc.status.value,
            "waiting_days": inc.waiting_days,
            "primary_photo_url": inc.primary_photo_url,
            "reports_count": fused_count if fused_count > 0 else 1,
            "recurrence_status": inc.recurrence_status
        })
    return results

@router.get("/sectors")
def get_chandigarh_sectors(db: Session = Depends(get_db), _current_user: dict = Depends(require_auth)) -> List[Dict[str, Any]]:
    """
    Returns official Chandigarh administrative sectors with boundary centers.
    """
    sectors = db.query(Sector).order_by(Sector.sector_name).all()
    return [
        {
            "id": s.id,
            "name": s.sector_name,
            "code": s.sector_code,
            "ward_number": s.ward_number,
            "center_lat": s.center_lat,
            "center_lon": s.center_lon
        } for s in sectors
    ]

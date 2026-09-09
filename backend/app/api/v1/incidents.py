import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.core.security import require_roles, require_auth, get_current_user_payload
from backend.app.models.entities import Incident, IncidentReport, Report, ScoreCalculation, FieldAssignment, AuditLog, RecurrenceEvent
from backend.app.models.enums import IncidentStatus, CivicCategory, UserRole
from backend.app.schemas.incident import IncidentResponse, IncidentDetailResponse, IncidentAssignRequest
from backend.app.schemas.scoring import ScoreExplanationResponse

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentResponse])
def list_incidents(
    sector: Optional[str] = Query(None),
    category: Optional[CivicCategory] = Query(None),
    status: Optional[IncidentStatus] = Query(None),
    min_risk: Optional[float] = Query(None),
    min_confidence: Optional[float] = Query(None),
    limit: int = Query(100, le=200),
    db: Session = Depends(get_db)
):
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

    incidents = q.order_by(Incident.priority_score.desc()).limit(limit).all()
    results = []
    for inc in incidents:
        count = db.query(IncidentReport).filter(IncidentReport.incident_id == inc.id).count()
        r = IncidentResponse.from_orm(inc)
        r.reports_count = count if count > 0 else 1
        results.append(r)
    return results

@router.get("/{incident_id}", response_model=IncidentDetailResponse)
def get_incident_detail(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    # Get fused reports
    fused_links = db.query(IncidentReport).filter(IncidentReport.incident_id == incident.id).all()
    fused_report_ids = [l.report_id for l in fused_links]
    reports = db.query(Report).filter(Report.id.in_(fused_report_ids)).all()
    
    # Get latest score calculation
    latest_score = db.query(ScoreCalculation).filter(
        ScoreCalculation.incident_id == incident.id
    ).order_by(ScoreCalculation.calculated_at.desc()).first()

    # Get recurrence evidence
    rec_event = db.query(RecurrenceEvent).filter(RecurrenceEvent.incident_id == incident.id).first()

    resp = IncidentDetailResponse.from_orm(incident)
    resp.reports_count = len(reports) if reports else 1
    resp.fused_reports = [
        {
            "report_id": r.id,
            "category": r.category.value,
            "client_timestamp": r.client_timestamp.isoformat(),
            "photo_url": r.photo_url,
            "location_source": r.location_source,
            "accuracy_meters": r.accuracy_meters
        } for r in reports
    ]
    if latest_score:
        resp.latest_score_calculation = {
            "formula_version": latest_score.formula_version,
            "score_value": latest_score.score_value,
            "evidence_breakdown": latest_score.evidence_breakdown,
            "calculated_at": latest_score.calculated_at.isoformat()
        }
    if rec_event:
        resp.recurrence_evidence = {
            "historical_records_count": rec_event.historical_records_count,
            "pattern_description": rec_event.pattern_description,
            "detected_at": rec_event.detected_at.isoformat()
        }
    return resp

@router.get("/{incident_id}/why-score", response_model=ScoreExplanationResponse)
def get_why_score(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    calc = db.query(ScoreCalculation).filter(
        ScoreCalculation.incident_id == incident_id,
        ScoreCalculation.score_type == "CIVIC_CONFIDENCE"
    ).order_by(ScoreCalculation.calculated_at.desc()).first()

    if not calc:
        return ScoreExplanationResponse(
            incident_id=incident.id,
            score_type="CIVIC_CONFIDENCE",
            formula_version="CC-v1.0",
            score_value=incident.confidence_score,
            calculated_at=incident.created_at,
            evidence_breakdown={"status": "Calculated on initial submission"},
            input_record_ids=[incident.id]
        )

    return ScoreExplanationResponse(
        incident_id=incident.id,
        score_type=calc.score_type,
        formula_version=calc.formula_version,
        score_value=calc.score_value,
        calculated_at=calc.calculated_at,
        evidence_breakdown=calc.evidence_breakdown,
        input_record_ids=calc.input_record_ids or [incident.id]
    )

@router.post("/{incident_id}/assign")
def assign_incident(
    incident_id: str,
    req: IncidentAssignRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles([UserRole.MUNICIPAL_OFFICER.value, UserRole.ADMIN.value]))
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident.status = IncidentStatus.ASSIGNED
    incident.assigned_user_id = req.assigned_to_user_id

    assignment = FieldAssignment(
        incident_id=incident.id,
        assigned_to_user_id=req.assigned_to_user_id,
        assigned_by_user_id=current_user["sub"],
        status="ASSIGNED",
        notes=req.notes
    )
    db.add(assignment)

    audit = AuditLog(
        actor_id=current_user["sub"],
        actor_role=current_user.get("role"),
        action="INCIDENT_ASSIGNED",
        entity="Incident",
        entity_id=incident.id,
        old_value={"status": incident.status.value},
        new_value={"status": IncidentStatus.ASSIGNED.value, "assigned_to": req.assigned_to_user_id},
        reason=req.notes or "Assigned to field worker for on-site resolution"
    )
    db.add(audit)

    db.commit()
    return {"message": "Incident assigned successfully", "status": incident.status.value}

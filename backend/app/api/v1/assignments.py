from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.core.database import get_db
from backend.app.core.security import require_auth, require_roles
from backend.app.models.entities import Incident, FieldAssignment, User
from backend.app.models.enums import UserRole, IncidentStatus

router = APIRouter(prefix="/assignments", tags=["Assignments"])

@router.get("/my")
def get_my_assignments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles([UserRole.FIELD_WORKER.value, UserRole.MUNICIPAL_OFFICER.value, UserRole.ADMIN.value]))
):
    """
    Returns active assigned incidents for the authenticated field officer.
    """
    assignments = db.query(FieldAssignment).filter(
        FieldAssignment.assigned_to_user_id == current_user["sub"],
        FieldAssignment.status == "ASSIGNED"
    ).all()
    
    results = []
    for a in assignments:
        inc = db.query(Incident).filter(Incident.id == a.incident_id).first()
        if inc:
            results.append({
                "assignment_id": a.id,
                "incident_id": inc.id,
                "incident_number": inc.incident_number,
                "category": inc.category.value,
                "latitude": inc.latitude,
                "longitude": inc.longitude,
                "sector_name": inc.sector_name,
                "severity": inc.severity,
                "risk_score": inc.risk_score,
                "priority_score": inc.priority_score,
                "status": inc.status.value,
                "primary_photo_url": inc.primary_photo_url,
                "assigned_at": a.assigned_at.isoformat(),
                "notes": a.notes
            })
    return results

@router.get("")
def list_all_assignments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles([UserRole.MUNICIPAL_OFFICER.value, UserRole.ADMIN.value]))
):
    assignments = db.query(FieldAssignment).order_by(FieldAssignment.assigned_at.desc()).all()
    results = []
    for a in assignments:
        inc = db.query(Incident).filter(Incident.id == a.incident_id).first()
        worker = db.query(User).filter(User.id == a.assigned_to_user_id).first()
        results.append({
            "assignment_id": a.id,
            "incident_id": a.incident_id,
            "incident_number": inc.incident_number if inc else "Unknown",
            "field_worker_name": worker.full_name if worker else "Unassigned",
            "status": a.status,
            "assigned_at": a.assigned_at.isoformat(),
            "notes": a.notes
        })
    return results

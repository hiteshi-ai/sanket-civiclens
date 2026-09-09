import datetime
from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from backend.app.models.enums import CivicCategory, IncidentStatus

class IncidentResponse(BaseModel):
    id: str
    incident_number: str
    category: CivicCategory
    latitude: float
    longitude: float
    sector_name: Optional[str]
    severity: float
    confidence_score: float
    risk_score: float
    priority_score: float
    status: IncidentStatus
    waiting_days: float
    recurrence_status: str
    primary_photo_url: Optional[str]
    assigned_user_id: Optional[str]
    reports_count: int = 1
    first_reported_at: datetime.datetime
    last_reported_at: datetime.datetime
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class IncidentDetailResponse(IncidentResponse):
    fused_reports: List[Dict[str, Any]] = []
    latest_score_calculation: Optional[Dict[str, Any]] = None
    recurrence_evidence: Optional[Dict[str, Any]] = None
    closure_submission: Optional[Dict[str, Any]] = None

class IncidentAssignRequest(BaseModel):
    assigned_to_user_id: str
    notes: Optional[str] = None

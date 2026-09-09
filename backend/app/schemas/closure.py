import datetime
from pydantic import BaseModel
from typing import Optional
from backend.app.models.enums import ClosureMatchStatus

class ClosureMatchRequest(BaseModel):
    incident_id: str
    field_latitude: float
    field_longitude: float
    after_photo_url: Optional[str] = None
    after_photo_base64: Optional[str] = None
    notes: Optional[str] = None

class ClosureMatchResult(BaseModel):
    incident_id: str
    distance_meters: float
    image_similarity: Optional[float]
    closure_match_score: float
    match_status: ClosureMatchStatus
    algorithm_version: str = "CLOSURE-v1.0"
    can_auto_verify: bool = False
    requires_human_confirmation: bool = True
    evidence_summary: str

class ClosureVerifyRequest(BaseModel):
    closure_submission_id: str
    decision: str = "APPROVED"  # APPROVED, REJECTED, RE_INSPECT
    notes: Optional[str] = None

class ClosureSubmissionResponse(BaseModel):
    id: str
    incident_id: str
    field_worker_id: str
    before_photo_url: str
    after_photo_url: str
    field_latitude: float
    field_longitude: float
    distance_meters: float
    image_similarity: Optional[float]
    closure_match_score: float
    match_status: ClosureMatchStatus
    algorithm_version: str
    submitted_at: datetime.datetime
    human_verified_by: Optional[str]
    human_decision: Optional[str]
    human_verified_at: Optional[datetime.datetime]

    class Config:
        from_attributes = True

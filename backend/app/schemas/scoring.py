import datetime
from pydantic import BaseModel
from typing import Dict, Any, List

class ScoreExplanationResponse(BaseModel):
    incident_id: str
    score_type: str
    formula_version: str
    score_value: float
    calculated_at: datetime.datetime
    evidence_breakdown: Dict[str, Any]
    input_record_ids: List[str]
    label: str = "Explainable decision-support indicator"

import datetime
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from backend.app.models.enums import CivicCategory, ReportSyncStatus, SourceType

class ReportCreate(BaseModel):
    idempotency_key: str = Field(..., description="Client-generated UUIDv4 idempotency key")
    category: CivicCategory
    user_confirmed_category: Optional[CivicCategory] = None
    description: Optional[str] = None
    photo_url: Optional[str] = None
    photo_base64: Optional[str] = None
    latitude: float
    longitude: float
    accuracy_meters: Optional[float] = None
    location_source: str = "GPS"  # "GPS" or "MANUAL_SELECTION"
    sector_name: Optional[str] = None
    client_timestamp: datetime.datetime

    @field_validator("client_timestamp")
    @classmethod
    def normalize_client_timestamp(cls, value: datetime.datetime) -> datetime.datetime:
        """Store client timestamps as UTC-naive values for SQLite/Postgres parity."""
        if value.tzinfo is not None and value.utcoffset() is not None:
            return value.astimezone(datetime.timezone.utc).replace(tzinfo=None)
        return value

class ReportSyncBatchRequest(BaseModel):
    reports: List[ReportCreate]

class AIPredictionResponse(BaseModel):
    model_name: str
    model_version: str
    predicted_category: CivicCategory
    confidence: Optional[float] = None
    provider: str
    inference_duration_ms: Optional[int] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ReportResponse(BaseModel):
    id: str
    idempotency_key: str
    category: CivicCategory
    user_confirmed_category: Optional[CivicCategory]
    description: Optional[str]
    photo_url: str
    latitude: float
    longitude: float
    accuracy_meters: Optional[float]
    location_source: str
    sector_name: Optional[str]
    sync_status: ReportSyncStatus
    client_timestamp: datetime.datetime
    server_received_at: datetime.datetime

    class Config:
        from_attributes = True

class ReportDetailResponse(ReportResponse):
    ai_prediction: Optional[AIPredictionResponse] = None
    associated_incident_id: Optional[str] = None
    source_type: SourceType = SourceType.CITIZEN

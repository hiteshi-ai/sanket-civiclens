import datetime
from pydantic import BaseModel
from typing import Optional
from backend.app.models.enums import SourceType

class DataSourceResponse(BaseModel):
    source_id: str
    source_name: str
    authority: str
    official_url: str
    dataset_url: Optional[str]
    api_url: Optional[str]
    source_type: SourceType
    jurisdiction: str
    geographic_granularity: str
    reference_period: str
    last_updated: str
    access_method: str
    update_frequency: str
    license: str
    verification_status: str
    last_verified_at: datetime.datetime
    verification_notes: Optional[str]

    class Config:
        from_attributes = True

class DataProvenanceResponse(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    source_type: SourceType
    source_name: str
    source_authority: str
    source_url: Optional[str]
    dataset_name: Optional[str]
    reference_year: Optional[str]
    retrieved_at: datetime.datetime
    verification_status: str
    transformation_method: str

    class Config:
        from_attributes = True

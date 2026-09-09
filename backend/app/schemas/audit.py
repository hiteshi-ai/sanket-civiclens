import datetime
from pydantic import BaseModel
from typing import Optional, Any

class AuditLogResponse(BaseModel):
    id: str
    actor_id: Optional[str]
    actor_role: Optional[str]
    action: str
    entity: str
    entity_id: str
    old_value: Optional[Any]
    new_value: Optional[Any]
    reason: Optional[str]
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

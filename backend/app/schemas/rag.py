import datetime
from pydantic import BaseModel
from typing import List, Optional

class RAGQueryRequest(BaseModel):
    query: str
    sector_filter: Optional[str] = None
    category_filter: Optional[str] = None

class RAGCitation(BaseModel):
    document_title: str
    authority: str
    official_url: str
    reference_period: str
    similarity_score: float

class RAGQueryResponse(BaseModel):
    query: str
    answer: str
    has_sufficient_evidence: bool
    citations: List[RAGCitation]
    timestamp: datetime.datetime

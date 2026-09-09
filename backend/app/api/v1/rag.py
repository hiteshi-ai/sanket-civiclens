from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user_payload
from backend.app.schemas.rag import RAGQueryRequest, RAGQueryResponse
from backend.app.rag.rag_service import rag_service

router = APIRouter(prefix="/rag", tags=["RAG Civic Evidence Assistant"])

@router.post("/query", response_model=RAGQueryResponse)
def query_civic_evidence(
    req: RAGQueryRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_payload)
):
    """
    Asks the Civic Evidence Assistant ("Ask CivicLens").
    Retrieves grounded evidence from verified municipal documents.
    Refuses to hallucinate if evidence is absent or insufficient.
    """
    user_id = current_user["sub"] if current_user else None
    return rag_service.query(db, req.query, user_id=user_id)

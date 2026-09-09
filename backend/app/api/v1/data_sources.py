from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.core.database import get_db
from backend.app.models.entities import DataSource, DataProvenance
from backend.app.schemas.data_source import DataSourceResponse, DataProvenanceResponse
from backend.app.data_sources.adapters import ADAPTERS

router = APIRouter(prefix="/data-sources", tags=["Data Sources & Provenance"])

@router.get("", response_model=List[DataSourceResponse])
def list_data_sources(db: Session = Depends(get_db)):
    """
    Returns official data sources catalog with live availability and provenance.
    """
    sources = db.query(DataSource).all()
    return sources

@router.get("/health")
def get_data_sources_health():
    """
    Queries live official adapters to report accurate connectivity status.
    Never fabricates live status when API credentials are absent.
    """
    statuses = []
    for sid, adapter in ADAPTERS.items():
        statuses.append(adapter.check_health())
    return statuses

@router.get("/provenance/{entity_type}/{entity_id}", response_model=List[DataProvenanceResponse])
def get_entity_provenance(entity_type: str, entity_id: str, db: Session = Depends(get_db)):
    """
    Retrieves full audit lineage for a report, incident, score, or document.
    Answers: 'Where did this information come from?'
    """
    provenance_records = db.query(DataProvenance).filter(
        DataProvenance.entity_type == entity_type,
        DataProvenance.entity_id == entity_id
    ).all()
    return provenance_records

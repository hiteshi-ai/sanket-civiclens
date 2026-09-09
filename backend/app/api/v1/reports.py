from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user_payload
from backend.app.models.entities import Report, AIPrediction, IncidentReport
from backend.app.schemas.report import ReportResponse, ReportDetailResponse, AIPredictionResponse

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[ReportResponse])
def list_reports(
    sector: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    my_reports_only: bool = Query(False),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_payload)
):
    q = db.query(Report)
    if my_reports_only and current_user:
        q = q.filter(Report.user_id == current_user["sub"])
    if sector:
        q = q.filter(Report.sector_name == sector)
    if category:
        q = q.filter(Report.category == category)
    
    return q.order_by(Report.client_timestamp.desc()).limit(limit).all()

@router.get("/{report_id}", response_model=ReportDetailResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    ai_pred = db.query(AIPrediction).filter(AIPrediction.report_id == report_id).first()
    assoc = db.query(IncidentReport).filter(IncidentReport.report_id == report_id).first()
    
    resp = ReportDetailResponse.from_orm(report)
    if ai_pred:
        resp.ai_prediction = AIPredictionResponse.from_orm(ai_pred)
    if assoc:
        resp.associated_incident_id = assoc.incident_id
    return resp

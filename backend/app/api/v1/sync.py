from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user_payload
from backend.app.schemas.report import ReportCreate, ReportSyncBatchRequest
from backend.app.sync.sync_manager import process_single_report_sync

router = APIRouter(prefix="/sync", tags=["Offline Sync"])

@router.post("/reports")
def sync_reports(
    batch: ReportSyncBatchRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_payload)
):
    """
    Idempotent batch synchronization endpoint.
    Accepts reports captured while offline.
    Never duplicates reports or incidents upon retried transmissions.
    """
    user_id = current_user["sub"] if current_user else None
    results = []

    for report_item in batch.reports:
        try:
            res = process_single_report_sync(db, report_item, user_id)
            results.append(res)
        except Exception as e:
            results.append({
                "status": "ERROR",
                "idempotency_key": report_item.idempotency_key,
                "error": str(e)
            })

    return {"synced_count": len([r for r in results if r.get("status") in ("CREATED", "ALREADY_SYNCED")]), "results": results}

@router.post("/report")
def sync_single_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_payload)
):
    user_id = current_user["sub"] if current_user else None
    return process_single_report_sync(db, report, user_id)

import os
import base64
import uuid
import hashlib
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.entities import Report, AIPrediction, AuditLog, DataProvenance, IncidentReport
from backend.app.models.enums import ReportSyncStatus, SourceType
from backend.app.schemas.report import ReportCreate
from backend.app.ai.vision import ai_service
from backend.app.ai.image_features import extract_image_features, compute_cosine_similarity
from backend.app.fusion.fusion_engine import process_incident_fusion
from backend.app.core.config import settings

def ensure_upload_dir():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

def process_single_report_sync(db: Session, report_data: ReportCreate, user_id: str = None) -> Dict[str, Any]:
    """
    Idempotent report synchronization processor.
    If the idempotency_key was already processed, returns existing record immediately.
    """
    ensure_upload_dir()

    # 1. Idempotency check
    existing_report = db.query(Report).filter(Report.idempotency_key == report_data.idempotency_key).first()
    if existing_report:
        # Find associated incident
        inc_assoc = db.query(IncidentReport).filter(IncidentReport.report_id == existing_report.id).first()
        incident_id = inc_assoc.incident_id if inc_assoc else None
        return {
            "status": "ALREADY_SYNCED",
            "report_id": existing_report.id,
            "idempotency_key": existing_report.idempotency_key,
            "incident_id": incident_id,
            "sync_status": ReportSyncStatus.SYNCED
        }

    # 2. Process image bytes
    photo_url = report_data.photo_url or ""
    image_bytes = b""
    if report_data.photo_base64:
        try:
            # Strip data URL prefix if present
            b64_data = report_data.photo_base64
            if "," in b64_data:
                b64_data = b64_data.split(",")[1]
            image_bytes = base64.b64decode(b64_data)
            
            # Compute photo hash
            photo_hash = hashlib.sha256(image_bytes).hexdigest()
            filename = f"{photo_hash[:16]}_{uuid.uuid4().hex[:8]}.jpg"
            filepath = os.path.join(settings.UPLOAD_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(image_bytes)
            photo_url = f"/uploads/{filename}"
        except Exception:
            photo_hash = hashlib.sha256(b"empty").hexdigest()
            photo_url = "/static/placeholder_evidence.jpg"
    else:
        photo_hash = hashlib.sha256(photo_url.encode('utf-8')).hexdigest()

    # 3. Create Report entity
    new_report = Report(
        idempotency_key=report_data.idempotency_key,
        user_id=user_id,
        category=report_data.category,
        user_confirmed_category=report_data.user_confirmed_category or report_data.category,
        description=report_data.description,
        photo_url=photo_url,
        photo_hash=photo_hash,
        latitude=report_data.latitude,
        longitude=report_data.longitude,
        accuracy_meters=report_data.accuracy_meters,
        location_source=report_data.location_source,
        sector_name=report_data.sector_name,
        sync_status=ReportSyncStatus.SYNCED,
        client_timestamp=report_data.client_timestamp
    )
    db.add(new_report)
    db.flush()

    # 4. SANKET Computer Vision Inference
    vision_pred = None
    if image_bytes:
        vision_pred = ai_service.analyze_image(image_bytes)
        ai_record = AIPrediction(
            report_id=new_report.id,
            model_name=vision_pred["model_name"],
            model_version=vision_pred["model_version"],
            predicted_category=vision_pred["prediction"],
            confidence=vision_pred["confidence"],
            provider=vision_pred["provider"],
            inference_duration_ms=vision_pred.get("inference_duration_ms"),
            input_hash=vision_pred["input_hash"]
        )
        db.add(ai_record)

    # 5. Record Data Provenance
    prov = DataProvenance(
        entity_type="Report",
        entity_id=new_report.id,
        source_type=SourceType.CITIZEN,
        source_name="CivicLens Citizen Client",
        source_authority="Citizen of Chandigarh",
        source_url=None,
        dataset_name="CivicLens Reporting Stream",
        source_date=report_data.client_timestamp,
        reference_year="2026",
        verification_status="VERIFIED",
        original_record_id=report_data.idempotency_key,
        transformation_method="IDEMPOTENT_SYNC_INGESTION"
    )
    db.add(prov)

    # 6. Audit log
    audit = AuditLog(
        actor_id=user_id,
        actor_role="CITIZEN",
        action="REPORT_SYNCHRONIZED",
        entity="Report",
        entity_id=new_report.id,
        old_value=None,
        new_value={"idempotency_key": new_report.idempotency_key, "category": new_report.category.value},
        reason="Client report synced from offline/online queue"
    )
    db.add(audit)

    # 7. SANKET Incident Fusion
    incident = process_incident_fusion(db, new_report)

    db.commit()
    db.refresh(new_report)

    return {
        "status": "CREATED",
        "report_id": new_report.id,
        "idempotency_key": new_report.idempotency_key,
        "incident_id": incident.id,
        "incident_number": incident.incident_number,
        "sync_status": ReportSyncStatus.SYNCED
    }

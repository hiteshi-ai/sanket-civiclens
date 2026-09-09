import os
import base64
import uuid
import hashlib
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db, haversine_distance_meters
from backend.app.core.security import require_roles, require_auth
from backend.app.models.entities import Incident, ClosureSubmission, AuditLog
from backend.app.models.enums import IncidentStatus, UserRole, ClosureMatchStatus
from backend.app.schemas.closure import ClosureMatchRequest, ClosureMatchResult, ClosureVerifyRequest, ClosureSubmissionResponse
from backend.app.scoring.closure import calculate_smart_closure_match
from backend.app.ai.image_features import extract_image_features, compute_cosine_similarity
from backend.app.core.config import settings

router = APIRouter(prefix="/closures", tags=["Closures & Verification"])

@router.post("/match", response_model=ClosureMatchResult)
def submit_smart_closure_match(
    req: ClosureMatchRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles([UserRole.FIELD_WORKER.value, UserRole.MUNICIPAL_OFFICER.value, UserRole.ADMIN.value]))
):
    incident = db.query(Incident).filter(Incident.id == req.incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    # 1. Compute on-site geographic distance
    dist_m = haversine_distance_meters(
        req.field_latitude, req.field_longitude,
        incident.latitude, incident.longitude
    )
    if dist_m is None:
        dist_m = 999.0

    # 2. Process after-repair photo
    after_url = req.after_photo_url or ""
    after_bytes = None
    if req.after_photo_base64:
        try:
            b64_data = req.after_photo_base64
            if "," in b64_data:
                b64_data = b64_data.split(",")[1]
            after_bytes = base64.b64decode(b64_data)
            fn = f"closure_{uuid.uuid4().hex[:12]}.jpg"
            fp = os.path.join(settings.UPLOAD_DIR, fn)
            with open(fp, "wb") as f:
                f.write(after_bytes)
            after_url = f"/uploads/{fn}"
        except Exception:
            after_url = "/static/placeholder_closure.jpg"

    # 3. Calculate feature similarity between before and after photos if available
    img_sim = None
    if after_bytes and incident.primary_photo_url:
        try:
            # Try loading before photo from upload directory
            before_path = os.path.join(settings.UPLOAD_DIR, os.path.basename(incident.primary_photo_url))
            if os.path.exists(before_path):
                with open(before_path, "rb") as bf:
                    before_bytes = bf.read()
                vec1 = extract_image_features(before_bytes)
                vec2 = extract_image_features(after_bytes)
                img_sim = compute_cosine_similarity(vec1, vec2)
        except Exception:
            img_sim = None

    # 4. Calculate deterministic Smart Closure Match (CLOSURE-v1.0)
    match_result = calculate_smart_closure_match(
        distance_meters=dist_m,
        image_similarity=img_sim,
        category_match=True
    )

    # 5. Create closure submission record
    submission = ClosureSubmission(
        incident_id=incident.id,
        field_worker_id=current_user["sub"],
        before_photo_url=incident.primary_photo_url or "",
        after_photo_url=after_url,
        field_latitude=req.field_latitude,
        field_longitude=req.field_longitude,
        distance_meters=match_result["distance_meters"],
        image_similarity=match_result["image_similarity"],
        closure_match_score=match_result["closure_match_score"],
        match_status=match_result["match_status"],
        algorithm_version=match_result["algorithm_version"],
        notes=req.notes
    )
    db.add(submission)

    # Update incident status to PENDING_VERIFICATION
    incident.status = IncidentStatus.PENDING_VERIFICATION
    
    audit = AuditLog(
        actor_id=current_user["sub"],
        actor_role=current_user.get("role"),
        action="CLOSURE_EVALUATION_SUBMITTED",
        entity="ClosureSubmission",
        entity_id=submission.id,
        new_value={
            "score": match_result["closure_match_score"],
            "distance_m": match_result["distance_meters"],
            "status": match_result["match_status"].value
        },
        reason="Field worker submitted after-repair evidence for Smart Closure Match"
    )
    db.add(audit)
    db.commit()

    return ClosureMatchResult(
        incident_id=incident.id,
        distance_meters=match_result["distance_meters"],
        image_similarity=match_result["image_similarity"],
        closure_match_score=match_result["closure_match_score"],
        match_status=match_result["match_status"],
        algorithm_version=match_result["algorithm_version"],
        can_auto_verify=False,
        requires_human_confirmation=True,
        evidence_summary=match_result["evidence_summary"]
    )

@router.post("/verify")
def verify_and_close(
    req: ClosureVerifyRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles([UserRole.MUNICIPAL_OFFICER.value, UserRole.ADMIN.value]))
):
    submission = db.query(ClosureSubmission).filter(ClosureSubmission.id == req.closure_submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Closure submission not found")

    incident = db.query(Incident).filter(Incident.id == submission.incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Associated incident not found")

    if req.decision == "APPROVED":
        incident.status = IncidentStatus.VERIFIED_CLOSED
        submission.human_decision = "APPROVED"
        submission.human_verified_by = current_user["sub"]
        submission.human_verified_at = db.query(Incident).session.bind.engine.dialect.name
        import datetime
        submission.human_verified_at = datetime.datetime.utcnow()

        audit = AuditLog(
            actor_id=current_user["sub"],
            actor_role=current_user.get("role"),
            action="INCIDENT_VERIFIED_CLOSED",
            entity="Incident",
            entity_id=incident.id,
            old_value={"status": IncidentStatus.PENDING_VERIFICATION.value},
            new_value={"status": IncidentStatus.VERIFIED_CLOSED.value},
            reason=req.notes or "Human municipal officer approved Smart Closure Match"
        )
        db.add(audit)
        db.commit()
        return {"status": "SUCCESS", "message": f"Incident {incident.incident_number} successfully verified and closed."}
    else:
        incident.status = IncidentStatus.IN_PROGRESS
        submission.human_decision = req.decision
        submission.notes = (submission.notes or "") + f" | Rejected by Officer: {req.notes or ''}"
        db.commit()
        return {"status": "RE_INSPECTION_REQUIRED", "message": "Closure rejected; returned to field officer for re-inspection."}

import datetime
import uuid
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum, JSON
)
from sqlalchemy.orm import relationship
from backend.app.core.database import Base
from backend.app.models.enums import (
    UserRole, CivicCategory, SourceType, ReportSyncStatus,
    IncidentStatus, FusionDecision, ClosureMatchStatus
)

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(32), nullable=True)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.CITIZEN)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reports = relationship("Report", back_populates="user")
    assignments = relationship("FieldAssignment", foreign_keys="FieldAssignment.assigned_to_user_id", back_populates="assigned_to")

class Jurisdiction(Base):
    __tablename__ = "jurisdictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    code = Column(String(32), unique=True, nullable=False)
    state_ut = Column(String(128), nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sectors = relationship("Sector", back_populates="jurisdiction")

class Sector(Base):
    __tablename__ = "sectors"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    jurisdiction_id = Column(String(36), ForeignKey("jurisdictions.id"), nullable=False)
    sector_name = Column(String(128), index=True, nullable=False)
    sector_code = Column(String(32), unique=True, nullable=False)
    ward_number = Column(Integer, nullable=True)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    boundary_geojson = Column(JSON, nullable=True)

    jurisdiction = relationship("Jurisdiction", back_populates="sectors")

class DataSource(Base):
    __tablename__ = "data_sources"

    source_id = Column(String(64), primary_key=True)
    source_name = Column(String(255), nullable=False)
    authority = Column(String(255), nullable=False)
    official_url = Column(String(512), nullable=False)
    dataset_url = Column(String(512), nullable=True)
    api_url = Column(String(512), nullable=True)
    source_type = Column(SQLEnum(SourceType), nullable=False)
    jurisdiction = Column(String(128), nullable=False)
    geographic_granularity = Column(String(128), nullable=False)
    reference_period = Column(String(64), nullable=False)
    last_updated = Column(String(64), nullable=False)
    access_method = Column(String(64), nullable=False)
    update_frequency = Column(String(64), nullable=False)
    license = Column(String(128), nullable=False)
    verification_status = Column(String(32), nullable=False)
    last_verified_at = Column(DateTime, default=datetime.datetime.utcnow)
    verification_notes = Column(Text, nullable=True)

class DataProvenance(Base):
    __tablename__ = "data_provenance"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    entity_type = Column(String(64), nullable=False, index=True) # Report, Incident, Score, Document
    entity_id = Column(String(64), nullable=False, index=True)
    source_type = Column(SQLEnum(SourceType), nullable=False)
    source_name = Column(String(255), nullable=False)
    source_authority = Column(String(255), nullable=False)
    source_url = Column(String(512), nullable=True)
    dataset_name = Column(String(255), nullable=True)
    source_date = Column(DateTime, nullable=True)
    reference_year = Column(String(32), nullable=True)
    retrieved_at = Column(DateTime, default=datetime.datetime.utcnow)
    verification_status = Column(String(32), default="VERIFIED")
    original_record_id = Column(String(128), nullable=True)
    transformation_method = Column(String(128), nullable=False)

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    idempotency_key = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    category = Column(SQLEnum(CivicCategory), nullable=False)
    user_confirmed_category = Column(SQLEnum(CivicCategory), nullable=True)
    description = Column(Text, nullable=True)
    photo_url = Column(String(512), nullable=False)
    photo_hash = Column(String(64), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    accuracy_meters = Column(Float, nullable=True)
    location_source = Column(String(32), default="GPS") # GPS, MANUAL_SELECTION
    sector_name = Column(String(128), nullable=True)
    sync_status = Column(SQLEnum(ReportSyncStatus), default=ReportSyncStatus.SYNCED)
    client_timestamp = Column(DateTime, nullable=False)
    server_received_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reports")
    ai_predictions = relationship("AIPrediction", back_populates="report")
    incident_associations = relationship("IncidentReport", back_populates="report")

class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    report_id = Column(String(36), ForeignKey("reports.id"), nullable=False)
    model_name = Column(String(64), nullable=False)
    model_version = Column(String(32), nullable=False)
    predicted_category = Column(SQLEnum(CivicCategory), nullable=False)
    confidence = Column(Float, nullable=True) # None indicates "Confidence unavailable"
    provider = Column(String(64), nullable=False)
    inference_duration_ms = Column(Integer, nullable=True)
    input_hash = Column(String(64), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    report = relationship("Report", back_populates="ai_predictions")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_number = Column(String(32), unique=True, index=True, nullable=False) # e.g. INC-CHD-2026-0001
    category = Column(SQLEnum(CivicCategory), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    sector_name = Column(String(128), index=True, nullable=True)
    
    # Deterministic Versioned Scores
    severity = Column(Float, default=5.0) # Scale 1 to 10
    confidence_score = Column(Float, default=25.0) # CC-v1.0 (0-100)
    risk_score = Column(Float, default=30.0) # RISK-v1.0 (0-100)
    priority_score = Column(Float, default=30.0) # PRIORITY-v1.0
    
    status = Column(SQLEnum(IncidentStatus), default=IncidentStatus.OPEN, index=True)
    waiting_days = Column(Float, default=0.0)
    recurrence_status = Column(String(64), default="Historical data unavailable")
    
    primary_photo_url = Column(String(512), nullable=True)
    assigned_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    first_reported_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_reported_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    reports = relationship("IncidentReport", back_populates="incident")
    matches = relationship("IncidentMatch", back_populates="incident")
    score_calculations = relationship("ScoreCalculation", back_populates="incident")
    assignments = relationship("FieldAssignment", back_populates="incident")
    closures = relationship("ClosureSubmission", back_populates="incident")

class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    report_id = Column(String(36), ForeignKey("reports.id"), nullable=False)
    is_primary = Column(Boolean, default=False)
    fused_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="reports")
    report = relationship("Report", back_populates="incident_associations")

class IncidentMatch(Base):
    __tablename__ = "incident_matches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    candidate_report_id = Column(String(36), ForeignKey("reports.id"), nullable=False)
    distance_meters = Column(Float, nullable=False)
    time_difference_hours = Column(Float, nullable=False)
    category_match = Column(Boolean, nullable=False)
    image_similarity = Column(Float, nullable=True)
    overall_match_score = Column(Float, nullable=False)
    algorithm_version = Column(String(32), default="FUS-v1.0")
    decision = Column(SQLEnum(FusionDecision), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="matches")

class ScoreCalculation(Base):
    __tablename__ = "score_calculations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    score_type = Column(String(32), nullable=False) # CIVIC_CONFIDENCE, CIVIC_RISK, PRIORITY_AGING, RECURRENCE, CLOSURE
    formula_version = Column(String(32), nullable=False)
    score_value = Column(Float, nullable=False)
    input_record_ids = Column(JSON, nullable=False)
    evidence_breakdown = Column(JSON, nullable=False)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="score_calculations")

class RecurrenceEvent(Base):
    __tablename__ = "recurrence_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    sector_name = Column(String(128), nullable=False)
    category = Column(SQLEnum(CivicCategory), nullable=False)
    historical_records_count = Column(Integer, default=0)
    supporting_record_ids = Column(JSON, default=list)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
    pattern_description = Column(Text, nullable=False)

class FieldAssignment(Base):
    __tablename__ = "field_assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    assigned_to_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    assigned_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    status = Column(String(32), default="ASSIGNED") # ASSIGNED, ACKNOWLEDGED, COMPLETED, CANCELLED
    notes = Column(Text, nullable=True)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="assignments")
    assigned_to = relationship("User", foreign_keys=[assigned_to_user_id], back_populates="assignments")

class ClosureSubmission(Base):
    __tablename__ = "closure_submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    field_worker_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    before_photo_url = Column(String(512), nullable=False)
    after_photo_url = Column(String(512), nullable=False)
    field_latitude = Column(Float, nullable=False)
    field_longitude = Column(Float, nullable=False)
    distance_meters = Column(Float, nullable=False)
    image_similarity = Column(Float, nullable=True)
    closure_match_score = Column(Float, nullable=False)
    match_status = Column(SQLEnum(ClosureMatchStatus), nullable=False)
    algorithm_version = Column(String(32), default="CLOSURE-v1.0")
    notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Human in the loop confirmation
    human_verified_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    human_decision = Column(String(32), nullable=True) # APPROVED, REJECTED, RE_INSPECT
    human_verified_at = Column(DateTime, nullable=True)

    incident = relationship("Incident", back_populates="closures")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_id = Column(String(36), nullable=True)
    actor_role = Column(String(32), nullable=True)
    action = Column(String(64), nullable=False, index=True)
    entity = Column(String(64), nullable=False, index=True)
    entity_id = Column(String(64), nullable=False, index=True)
    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    reason = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)

class RAGDocument(Base):
    __tablename__ = "rag_documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    source_id = Column(String(64), ForeignKey("data_sources.source_id"), nullable=False)
    title = Column(String(255), nullable=False)
    authority = Column(String(255), nullable=False)
    official_url = Column(String(512), nullable=False)
    jurisdiction = Column(String(128), nullable=False)
    reference_period = Column(String(64), nullable=False)
    document_date = Column(DateTime, nullable=False)
    content_hash = Column(String(64), nullable=False)
    indexed_at = Column(DateTime, default=datetime.datetime.utcnow)
    verification_status = Column(String(32), default="VERIFIED")

    chunks = relationship("RAGChunk", back_populates="document")

class RAGChunk(Base):
    __tablename__ = "rag_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("rag_documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    embedding_vector = Column(JSON, nullable=True)
    metadata_json = Column(JSON, nullable=True)

    document = relationship("RAGDocument", back_populates="chunks")

class RAGQueryLog(Base):
    __tablename__ = "rag_query_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    query_text = Column(Text, nullable=False)
    retrieved_chunk_ids = Column(JSON, default=list)
    generated_answer = Column(Text, nullable=False)
    has_sufficient_evidence = Column(Boolean, nullable=False)
    citations = Column(JSON, default=list)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

"""
Database seed script for Chandigarh CivicLens.
Populates official sectors, demo accounts, baseline verified incidents,
and initial score evidence breakdowns if the database is empty.
"""
import datetime
import uuid
from sqlalchemy.orm import Session
from backend.app.core.security import hash_password
from backend.app.models.entities import (
    Jurisdiction,
    Sector,
    User,
    Incident,
    Report,
    IncidentReport,
    FieldAssignment,
    ScoreCalculation,
)
from backend.app.models.enums import UserRole, CivicCategory, IncidentStatus, ReportSyncStatus, SourceType

CHANDIGARH_SECTORS = [
    ("Sector 1", 30.7600, 76.8020, 1),
    ("Sector 2", 30.7550, 76.8080, 1),
    ("Sector 3", 30.7580, 76.7920, 1),
    ("Sector 4", 30.7520, 76.7980, 1),
    ("Sector 5", 30.7560, 76.7850, 2),
    ("Sector 6", 30.7500, 76.7910, 2),
    ("Sector 7", 30.7420, 76.8050, 3),
    ("Sector 8", 30.7445, 76.8012, 3),
    ("Sector 9", 30.7460, 76.7900, 3),
    ("Sector 10", 30.7480, 76.7800, 4),
    ("Sector 11", 30.7500, 76.7700, 4),
    ("Sector 12", 30.7650, 76.7720, 5),
    ("Sector 14", 30.7600, 76.7650, 5),
    ("Sector 15", 30.7520, 76.7600, 5),
    ("Sector 16", 30.7440, 76.7730, 6),
    ("Sector 17", 30.7398, 76.7827, 6),
    ("Sector 18", 30.7360, 76.7930, 7),
    ("Sector 19", 30.7310, 76.8020, 7),
    ("Sector 20", 30.7240, 76.7980, 8),
    ("Sector 21", 30.7280, 76.7860, 8),
    ("Sector 22", 30.7323, 76.7724, 9),
    ("Sector 23", 30.7370, 76.7610, 9),
    ("Sector 24", 30.7420, 76.7510, 10),
    ("Sector 25", 30.7500, 76.7450, 10),
    ("Sector 26", 30.7280, 76.8150, 11),
    ("Sector 27", 30.7210, 76.8100, 11),
    ("Sector 28", 30.7160, 76.8050, 12),
    ("Sector 29", 30.7090, 76.8000, 12),
    ("Sector 30", 30.7140, 76.7900, 13),
    ("Sector 31", 30.7020, 76.7920, 13),
    ("Sector 32", 30.7080, 76.7800, 14),
    ("Sector 33", 30.7140, 76.7720, 14),
    ("Sector 34", 30.7200, 76.7650, 15),
    ("Sector 35", 30.7231, 76.7645, 15),
    ("Sector 36", 30.7280, 76.7530, 16),
    ("Sector 37", 30.7340, 76.7440, 16),
    ("Sector 38", 30.7400, 76.7350, 17),
    ("Sector 39", 30.7320, 76.7300, 17),
    ("Sector 40", 30.7250, 76.7360, 18),
    ("Sector 41", 30.7190, 76.7420, 18),
    ("Sector 42", 30.7130, 76.7480, 19),
    ("Sector 43", 30.7180, 76.7510, 19),
    ("Sector 44", 30.7100, 76.7590, 20),
    ("Sector 45", 30.7040, 76.7660, 20),
    ("Sector 46", 30.6980, 76.7740, 21),
    ("Sector 47", 30.6920, 76.7810, 21),
    ("Sector 48", 30.6860, 76.7750, 22),
    ("Sector 49", 30.6800, 76.7680, 22),
    ("Sector 50", 30.6750, 76.7620, 23),
    ("Sector 51", 30.6820, 76.7550, 23),
    ("Sector 52", 30.6900, 76.7480, 24),
    ("Sector 53", 30.6980, 76.7410, 24),
    ("Sector 54", 30.7050, 76.7340, 25),
    ("Sector 55", 30.7120, 76.7270, 25),
    ("Sector 56", 30.7200, 76.7200, 26),
    ("Industrial Area Phase I", 30.7050, 76.8120, 27),
    ("Industrial Area Phase II", 30.6950, 76.8050, 28),
    ("Manimajra", 30.7250, 76.8450, 29),
]


def seed_database_if_empty(db: Session):
    """Initializes standard baseline data if the database is unpopulated."""
    from backend.app.core.database import Base, engine
    Base.metadata.create_all(bind=engine)

    # 1. Jurisdiction
    jurisdiction = db.query(Jurisdiction).filter(Jurisdiction.code == "CHD").first()
    if not jurisdiction:
        jurisdiction = Jurisdiction(
            id=str(uuid.uuid4()),
            name="Chandigarh, India",
            code="CHD",
            state_ut="Chandigarh",
            center_lat=30.7333,
            center_lon=76.7794,
        )
        db.add(jurisdiction)
        db.flush()

    # 2. Sectors
    if db.query(Sector).count() == 0:
        for name, lat, lon, ward in CHANDIGARH_SECTORS:
            code = "SEC-" + name.replace(" ", "-").upper()
            sec = Sector(
                id=str(uuid.uuid4()),
                jurisdiction_id=jurisdiction.id,
                sector_name=name,
                sector_code=code,
                ward_number=ward,
                center_lat=lat,
                center_lon=lon,
            )
            db.add(sec)
        db.flush()

    # 3. Users / Demo Accounts
    if db.query(User).count() == 0:
        default_pw_hash = hash_password("change-me")
        citizen_user = User(
            id=str(uuid.uuid4()),
            email="citizen_demo@civiclens.in",
            hashed_password=default_pw_hash,
            full_name="Simran Kaur",
            phone="+91 98765 43210",
            role=UserRole.CITIZEN,
        )
        field_user = User(
            id=str(uuid.uuid4()),
            email="field_demo@civiclens.in",
            hashed_password=default_pw_hash,
            full_name="Officer Vikramaditya Sen",
            phone="+91 98123 45678",
            role=UserRole.FIELD_WORKER,
        )
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin_demo@civiclens.in",
            hashed_password=default_pw_hash,
            full_name="Chief Commissioner Rajesh Sharma",
            phone="+91 98456 78901",
            role=UserRole.MUNICIPAL_OFFICER,
        )
        db.add_all([citizen_user, field_user, admin_user])
        db.flush()
    else:
        citizen_user = db.query(User).filter(User.role == UserRole.CITIZEN).first()
        field_user = db.query(User).filter(User.role == UserRole.FIELD_WORKER).first()
        admin_user = db.query(User).filter(User.role == UserRole.MUNICIPAL_OFFICER).first()

    # 4. Verified Initial Baseline Incidents
    if db.query(Incident).count() == 0:
        now = datetime.datetime.utcnow()
        incidents_data = [
            {
                "num": "INC-CHD-2026-0001",
                "cat": CivicCategory.POTHOLE_ROAD_DAMAGE,
                "sector": "Sector 17",
                "lat": 30.7398,
                "lon": 76.7827,
                "desc": "Deep trench and asphalt pothole cluster near Central Plaza pedestrian crossing.",
                "severity": 8.5,
                "conf": 94.0,
                "risk": 88.0,
                "prio": 89.0,
                "status": IncidentStatus.OPEN,
                "wait": 3.2,
                "assigned_to": None,
                "reports": 4,
            },
            {
                "num": "INC-CHD-2026-0002",
                "cat": CivicCategory.DRAINAGE_WATERLOGGING,
                "sector": "Sector 22",
                "lat": 30.7323,
                "lon": 76.7724,
                "desc": "Monsoon storm drain silt choking causing 20cm road waterlogging near Market V4.",
                "severity": 7.2,
                "conf": 88.0,
                "risk": 76.0,
                "prio": 79.0,
                "status": IncidentStatus.IN_PROGRESS,
                "wait": 2.1,
                "assigned_to": field_user.id if field_user else None,
                "reports": 3,
            },
            {
                "num": "INC-CHD-2026-0003",
                "cat": CivicCategory.BROKEN_STREETLIGHT,
                "sector": "Sector 35",
                "lat": 30.7231,
                "lon": 76.7645,
                "desc": "Damaged lamp pole & underground short-circuit on main market pedestrian avenue.",
                "severity": 6.0,
                "conf": 82.0,
                "risk": 64.0,
                "prio": 65.0,
                "status": IncidentStatus.ASSIGNED,
                "wait": 1.5,
                "assigned_to": field_user.id if field_user else None,
                "reports": 2,
            },
            {
                "num": "INC-CHD-2026-0004",
                "cat": CivicCategory.GARBAGE_OVERFLOW,
                "sector": "Sector 43",
                "lat": 30.7180,
                "lon": 76.7510,
                "desc": "Secondary collection site overflowing onto road near ISBT terminal entrance.",
                "severity": 7.8,
                "conf": 91.0,
                "risk": 78.0,
                "prio": 82.0,
                "status": IncidentStatus.OPEN,
                "wait": 1.8,
                "assigned_to": None,
                "reports": 5,
            },
            {
                "num": "INC-CHD-2026-0005",
                "cat": CivicCategory.POTHOLE_ROAD_DAMAGE,
                "sector": "Sector 8",
                "lat": 30.7445,
                "lon": 76.8012,
                "desc": "Asphalt depression and edge erosion along Madhya Marg service corridor.",
                "severity": 6.8,
                "conf": 85.0,
                "risk": 70.0,
                "prio": 72.0,
                "status": IncidentStatus.PENDING_VERIFICATION,
                "wait": 4.0,
                "assigned_to": field_user.id if field_user else None,
                "reports": 2,
            },
        ]

        for item in incidents_data:
            inc_id = str(uuid.uuid4())
            inc = Incident(
                id=inc_id,
                incident_number=item["num"],
                category=item["cat"],
                latitude=item["lat"],
                longitude=item["lon"],
                sector_name=item["sector"],
                severity=item["severity"],
                confidence_score=item["conf"],
                risk_score=item["risk"],
                priority_score=item["prio"],
                status=item["status"],
                waiting_days=item["wait"],
                recurrence_status="Verified recurring site (2 previous seasons)",
                primary_photo_url=None,
                assigned_user_id=item["assigned_to"],
                first_reported_at=now - datetime.timedelta(days=item["wait"]),
                last_reported_at=now - datetime.timedelta(hours=2),
                created_at=now - datetime.timedelta(days=item["wait"]),
            )
            db.add(inc)
            db.flush()

            # Create primary report
            rep_id = str(uuid.uuid4())
            rep = Report(
                id=rep_id,
                idempotency_key=f"seed-{item['num']}",
                user_id=citizen_user.id if citizen_user else None,
                category=item["cat"],
                user_confirmed_category=item["cat"],
                latitude=item["lat"],
                longitude=item["lon"],
                sector_name=item["sector"],
                accuracy_meters=4.2,
                location_source="GPS",
                photo_url="/uploads/baseline_evidence.jpg",
                photo_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                description=item["desc"],
                sync_status=ReportSyncStatus.SYNCED,
                client_timestamp=now - datetime.timedelta(days=item["wait"]),
                server_received_at=now - datetime.timedelta(days=item["wait"]),
            )
            db.add(rep)
            db.flush()

            # Link incident and report
            link = IncidentReport(
                id=str(uuid.uuid4()),
                incident_id=inc_id,
                report_id=rep_id,
                is_primary=True,
                fused_at=now - datetime.timedelta(days=item["wait"]),
            )
            db.add(link)

            # Score explanation
            calc = ScoreCalculation(
                id=str(uuid.uuid4()),
                incident_id=inc_id,
                score_type="CIVIC_CONFIDENCE",
                formula_version="CC-v1.0",
                score_value=item["conf"],
                input_record_ids=[rep_id],
                evidence_breakdown={
                    "report_count": item["reports"],
                    "independent_witnesses": max(1, item["reports"] - 1),
                    "spatial_consistency": "GPS clustered within 15 meters",
                    "temporal_consistency": "Reports lodged within active 72h window",
                    "field_verification_status": "Evidence verified by Municipal GIS",
                    "model_confidence": f"{int(item['conf'])}%",
                },
                calculated_at=now,
            )
            db.add(calc)

            # If assigned, create FieldAssignment
            if item["assigned_to"]:
                assignment = FieldAssignment(
                    id=str(uuid.uuid4()),
                    incident_id=inc_id,
                    assigned_to_user_id=item["assigned_to"],
                    assigned_by_user_id=admin_user.id if admin_user else None,
                    status="ASSIGNED" if item["status"] == IncidentStatus.ASSIGNED else "IN_PROGRESS",
                    notes=f"Dispatched for immediate repair: {item['desc']}",
                    assigned_at=now - datetime.timedelta(hours=6),
                )
                db.add(assignment)

    db.commit()

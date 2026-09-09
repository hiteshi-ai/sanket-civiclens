import os
from pydantic import BaseModel
from typing import Optional

class Settings(BaseModel):
    PROJECT_NAME: str = "SANKET × CivicLens"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Jurisdiction
    DEFAULT_JURISDICTION: str = "Chandigarh, India"
    DEFAULT_STATE_UT: str = "Chandigarh"
    CHANDIGARH_CENTER_LAT: float = 30.7333
    CHANDIGARH_CENTER_LON: float = 76.7794
    
    # Environment & Integrity Mode
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "false").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sanket_civiclens.db")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "sanket-civiclens-chandigarh-secure-secret-key-2026-v1")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # File Storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(os.getcwd(), "uploads"))
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    
    # Official Government Portals
    DATA_GOV_IN_API_KEY: Optional[str] = os.getenv("DATA_GOV_IN_API_KEY", None)
    SMART_CITIES_API_KEY: Optional[str] = os.getenv("SMART_CITIES_API_KEY", None)
    
    # AI Thresholds
    AI_VISION_CONFIDENCE_THRESHOLD: float = 0.60
    FUSION_DISTANCE_THRESHOLD_METERS: float = 35.0
    FUSION_TIME_WINDOW_HOURS: float = 72.0
    RECURRENCE_DISTANCE_THRESHOLD_METERS: float = 50.0

settings = Settings()

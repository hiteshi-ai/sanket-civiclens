from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.models import entities  # noqa: F401 - registers SQLAlchemy models
from backend.app.api.v1 import (
    analytics,
    assignments,
    auth,
    closures,
    data_sources,
    incidents,
    map as map_api,
    rag,
    reports,
    sync,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create the local schema for a zero-setup development database."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Civic infrastructure intelligence for Chandigarh, India.",
    lifespan=lifespan,
)

api_prefix = settings.API_V1_STR
for router_module in (
    analytics,
    assignments,
    auth,
    closures,
    data_sources,
    incidents,
    map_api,
    rag,
    reports,
    sync,
):
    app.include_router(router_module.router, prefix=api_prefix)


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}
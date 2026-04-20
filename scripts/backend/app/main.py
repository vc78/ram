from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .settings import settings
from .db import Base, engine, get_db
from .routers import careers, contractors, dashboard, letters, auth, analytics, admin
try:
    from .routers import projects
except Exception:
    projects = None

from datetime import datetime, timezone
from sqlalchemy import text

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIIDSTARC Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}

app.include_router(careers.router, prefix="/api/v1")
app.include_router(contractors.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(letters.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
if projects is not None:
    app.include_router(projects.router, prefix="/api/v1")

@app.get("/")
def root_info():
    return {"service": "SIIDSTARC Backend", "version": "0.1.0"}


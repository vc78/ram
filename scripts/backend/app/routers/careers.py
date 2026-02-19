from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/careers", tags=["careers"])

@router.get("/jobs", response_model=List[schemas.JobOut])
def list_jobs(db: Session = Depends(get_db)):
    return db.query(models.Job).order_by(models.Job.created_at.desc()).all()

@router.post("/jobs", response_model=schemas.JobOut)
def create_job(payload: schemas.JobCreate, db: Session = Depends(get_db)):
    job = models.Job(**payload.dict())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("/jobs/{job_id}", response_model=schemas.JobOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/jobs/{job_id}/applications", response_model=List[schemas.ApplicationOut])
def list_applications(job_id: int, db: Session = Depends(get_db)):
    return db.query(models.Application).filter(models.Application.job_id == job_id).order_by(models.Application.created_at.desc()).all()

@router.post("/applications", response_model=schemas.ApplicationOut)
def apply(payload: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    job = db.query(models.Job).get(payload.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    app = models.Application(**payload.dict())
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.post("/applications/{application_id}/approve", response_model=schemas.ApplicationOut)
def approve_application(application_id: int, db: Session = Depends(get_db)):
    app = db.query(models.Application).get(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = models.ApplicationStatus.approved
    db.commit()
    db.refresh(app)
    return app

@router.post("/applications/{application_id}/reject", response_model=schemas.ApplicationOut)
def reject_application(application_id: int, db: Session = Depends(get_db)):
    app = db.query(models.Application).get(application_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = models.ApplicationStatus.rejected
    db.commit()
    db.refresh(app)
    return app

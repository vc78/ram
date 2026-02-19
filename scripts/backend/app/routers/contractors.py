from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/contractors", tags=["contractors"])

@router.get("", response_model=List[schemas.ContractorOut])
def list_contractors(db: Session = Depends(get_db)):
    """List all contractors"""
    return db.query(models.Contractor).all()

@router.get("/{contractor_id}", response_model=schemas.ContractorOut)
def get_contractor(contractor_id: int, db: Session = Depends(get_db)):
    """Get contractor details"""
    contractor = db.query(models.Contractor).get(contractor_id)
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    return contractor

@router.post("", response_model=schemas.ContractorOut)
def create_contractor(payload: schemas.ContractorCreate, db: Session = Depends(get_db)):
    """Create new contractor"""
    contractor = models.Contractor(**payload.dict())
    db.add(contractor)
    db.commit()
    db.refresh(contractor)
    return contractor

@router.get("/{contractor_id}/reviews", response_model=List[schemas.ContractorReviewOut])
def list_reviews(contractor_id: int, db: Session = Depends(get_db)):
    """List all reviews for a contractor"""
    return db.query(models.ContractorReview).filter(models.ContractorReview.contractor_id == contractor_id).order_by(models.ContractorReview.created_at.desc()).all()

@router.post("/reviews", response_model=schemas.ContractorReviewOut)
def write_review(payload: schemas.ContractorReviewCreate, db: Session = Depends(get_db)):
    """Write a review for a contractor"""
    contractor = db.query(models.Contractor).get(payload.contractor_id)
    if not contractor:
        raise HTTPException(status_code=404, detail="Contractor not found")
    review = models.ContractorReview(**payload.dict())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

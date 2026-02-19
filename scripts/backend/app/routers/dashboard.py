from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/tasks", response_model=List[schemas.TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).order_by(models.Task.created_at.desc()).all()

@router.post("/tasks", response_model=schemas.TaskOut)
def create_task(payload: schemas.TaskCreate, db: Session = Depends(get_db)):
    t = models.Task(**payload.dict())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

@router.get("/members", response_model=List[schemas.MemberOut])
def list_members(db: Session = Depends(get_db)):
    return db.query(models.Member).order_by(models.Member.created_at.desc()).all()

@router.post("/members", response_model=schemas.MemberOut)
def add_member(payload: schemas.MemberCreate, db: Session = Depends(get_db)):
    m = models.Member(**payload.dict())
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

@router.get("/messages", response_model=List[schemas.MessageOut])
def list_messages(db: Session = Depends(get_db)):
    return db.query(models.Message).order_by(models.Message.created_at.desc()).all()

@router.post("/messages", response_model=schemas.MessageOut)
def send_message(payload: schemas.MessageCreate, db: Session = Depends(get_db)):
    msg = models.Message(**payload.dict())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from datetime import timedelta
from ..db import get_db
from .. import models, schemas
from ..utils.security import get_password_hash, verify_password, create_access_token, get_current_user
from ..login_tracker import login_tracker

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=schemas.UserOut)
def signup(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        # Idempotent signup: if user already exists, return the existing user (helpful for tests and retries)
        return existing

    user = models.User(
        name=payload.name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        role=payload.role or "user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login(payload: schemas.UserLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        # Log failed login attempt
        ip_address = request.client.host if request.client else "unknown"
        login_tracker.log_failed_login(
            email=payload.email,
            ip_address=ip_address,
            reason="Invalid email or password"
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Log successful login
    ip_address = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    login_tracker.log_login(
        user_id=user.id,
        username=user.name,
        email=user.email,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    token = create_access_token({"sub": str(user.id)})
    
    # Ensure missing fields don't cause a crash
    user_out = schemas.UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status or "active",
        settings_data=user.settings_data,
        created_at=user.created_at
    )
    
    return {"access_token": token, "token_type": "bearer", "user": user_out}

@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/settings", response_model=schemas.UserOut)
def update_settings(payload: schemas.UserSettingsUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if payload.name:
        current_user.name = payload.name
    if payload.settings_data:
        current_user.settings_data = payload.settings_data
    
    db.commit()
    db.refresh(current_user)
    return current_user

"""
Seed script aligned with current models and idempotent.
"""

from sqlalchemy.orm import Session
from app.db import SessionLocal, engine
from app.models import (
    Base, User, Project, Task, Contractor, ContractorReview, Job, Application, Member, Message,
)
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_password_hash(password):
    # Truncate to 72 bytes for bcrypt
    password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)


def upsert_user(db: Session, email: str, name: str, password: str, role: str = "user"):
    user = db.query(User).filter(User.email == email).one_or_none()
    if user:
        return user
    user = User(email=email, name=name, password_hash=get_password_hash(password), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def upsert_job(db: Session, title: str, **kwargs):
    job = db.query(Job).filter(Job.title == title).one_or_none()
    if job:
        return job
    job = Job(title=title, **kwargs)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def upsert_contractor(db: Session, name: str, **kwargs):
    c = db.query(Contractor).filter(Contractor.name == name).one_or_none()
    if c:
        return c
    c = Contractor(name=name, **kwargs)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


def seed_database():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("🌱 Seeding database with minimal sample data (idempotent)...")

        admin = upsert_user(db, email="admin@example.com", name="Admin", password="admin123", role="admin")
        user = upsert_user(db, email="user@example.com", name="Demo User", password="password", role="user")

        job1 = upsert_job(db, title="Senior Architect", department="Architecture", location="Remote", description="Lead projects and mentor team")
        job2 = upsert_job(db, title="Project Manager", department="Management", location="Remote", description="Manage project lifecycle")

        # Applications (idempotent by unique email+job)
        app_exists = db.query(Application).filter(Application.job_id == job1.id, Application.email == "applicant@example.com").one_or_none()
        if not app_exists:
            application = Application(job_id=job1.id, name="Applicant One", email="applicant@example.com", phone=None)
            db.add(application)
            db.commit()

        # Contractors
        upsert_contractor(db, name="BuildPro", specialty="Construction")
        upsert_contractor(db, name="DesignCo", specialty="Interior Design")

        # Basic project and task
        project = db.query(Project).filter(Project.name == "Demo Project").one_or_none()
        if not project:
            project = Project(user_id=user.id, name="Demo Project", description="Demo project created by seed")
            db.add(project)
            db.commit()
            db.refresh(project)

        task_exists = db.query(Task).filter(Task.project_id == project.id, Task.title == "Initial Planning").one_or_none()
        if not task_exists:
            task = Task(project_id=project.id, title="Initial Planning", description="Setup initial project plan", status="todo")
            db.add(task)
            db.commit()

        # Simple member and message
        member = db.query(Member).filter(Member.email == "member@example.com").one_or_none()
        if not member:
            member = Member(name="Team Member", role="engineer", email="member@example.com")
            db.add(member)
            db.commit()

        msg = db.query(Message).filter(Message.to_user == "admin@example.com").one_or_none()
        if not msg:
            m = Message(to_user="admin@example.com", content="Welcome to the demo!")
            db.add(m)
            db.commit()

        print("✅ Seed complete (idempotent). Test account: user@example.com / password")

    except Exception as e:
        print(f"❌ Failed to seed database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

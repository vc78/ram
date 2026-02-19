from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class JobCreate(BaseModel):
    title: str
    department: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    currency: str = "INR"
    description: Optional[str] = None

class JobOut(JobCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ApplicationStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class ApplicationCreate(BaseModel):
    job_id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    resume_url: Optional[str] = None
    cover_letter: Optional[str] = None

class ApplicationOut(ApplicationCreate):
    id: int
    status: ApplicationStatus
    created_at: datetime
    class Config:
        from_attributes = True

class ContractorReviewCreate(BaseModel):
    contractor_id: int
    author_name: str
    rating: int
    content: str

class ContractorReviewOut(ContractorReviewCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    project_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    status: str = "todo"
    assignee_name: Optional[str] = None
    due_date: Optional[str] = None

class TaskOut(TaskCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class MemberCreate(BaseModel):
    name: str
    role: Optional[str] = None
    email: Optional[EmailStr] = None

class MemberOut(MemberCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    to_user: str
    content: str

class MessageOut(MessageCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ContractorCreate(BaseModel):
    name: str
    specialty: Optional[str] = None
    avatar_url: Optional[str] = None

class ContractorOut(ContractorCreate):
    id: int
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "planning"
    budget: Optional[float] = None
    deadline: Optional[str] = None

class ProjectOut(ProjectCreate):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    class Config:
        from_attributes = True

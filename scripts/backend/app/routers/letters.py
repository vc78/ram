from fastapi import APIRouter
from datetime import datetime, timezone
import random

router = APIRouter(prefix="/letters", tags=["letters"])

TEMPLATE = """Government of Example State
Approval Letter No: {ref}
Date: {date}

Subject: Approval for Employment Application

Dear {name},

We are pleased to inform you that your application (Application ID: {application_id}) has been APPROVED.
This letter serves as an official confirmation for demonstration purposes.

Sincerely,
Department of Approvals
"""

@router.get("/approval")
def generate_approval_letter(name: str, application_id: int):
    ref = f"APP-{random.randint(100000,999999)}"
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return {
        "reference": ref,
        "date": date,
        "content": TEMPLATE.format(ref=ref, date=date, name=name, application_id=application_id)
    }

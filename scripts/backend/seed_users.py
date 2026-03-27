import sys
import os
# Add the current directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db import SessionLocal, engine
from app import models
from app.utils.security import get_password_hash

def seed_users():
    db = SessionLocal()
    try:
        # Define default users
        default_users = [
            {"name": "Super Admin", "email": "admin@siid.com", "password": "admin", "role": "admin"},
            {"name": "Arjun Chowdary", "email": "user@siid.com", "password": "user", "role": "user"},
            {"name": "Build Master", "email": "contractor@siid.com", "password": "contractor", "role": "contractor"},
        ]

        for user_data in default_users:
            # Check if user already exists
            existing = db.query(models.User).filter(models.User.email == user_data["email"]).first()
            if not existing:
                print(f"Creating user: {user_data['email']}")
                new_user = models.User(
                    name=user_data["name"],
                    email=user_data["email"],
                    password_hash=get_password_hash(user_data["password"]),
                    role=user_data["role"]
                )
                db.add(new_user)
            else:
                print(f"User already exists: {user_data['email']}")
        
        db.commit()
        print("Successfully seeded users to database!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()

import sys
import os
# Add the current directory to sys.path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db import SessionLocal
from app import models

def check_users():
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        print("\n=== DATABASE USERS ===")
        print(f"Total Users Found: {len(users)}\n")
        
        # Table Header
        print(f"{'ID':<5} | {'NAME':<20} | {'EMAIL':<30} | {'ROLE':<10} | {'STATUS':<10}")
        print("-" * 88)
        
        for user in users:
            print(f"{user.id:<5} | {user.name:<20} | {user.email:<30} | {user.role:<10} | {user.status:<10}")
        
        print("\n" + "=" * 22 + "\n")
        
    except Exception as e:
        print(f"Error reading database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()

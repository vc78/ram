"""
Analytics Router - Login analytics and tracking endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from .. import models
from ..utils.security import get_current_user
from ..login_tracker import login_tracker
import sqlite3

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/login-stats")
def get_login_statistics(current_user: models.User = Depends(get_current_user)):
    """Get login statistics (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    conn = sqlite3.connect('test.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        # Total logins
        cursor.execute("SELECT COUNT(*) as total FROM login_logs")
        total_logins = cursor.fetchone()['total']
        
        # Active sessions
        cursor.execute("SELECT COUNT(*) as active FROM login_logs WHERE status = 'active'")
        active_sessions = cursor.fetchone()['active']
        
        # Failed attempts
        cursor.execute("SELECT COUNT(*) as failed FROM failed_login_attempts")
        failed_attempts = cursor.fetchone()['failed']
        
        # User statistics
        cursor.execute("""
            SELECT user_id, username, email, COUNT(*) as login_count, MAX(login_time) as last_login
            FROM login_logs
            GROUP BY user_id
            ORDER BY login_count DESC
        """)
        user_stats = [dict(row) for row in cursor.fetchall()]
        
        # Failed attempt details
        cursor.execute("""
            SELECT email, COUNT(*) as attempt_count, reason
            FROM failed_login_attempts
            GROUP BY email, reason
            ORDER BY attempt_count DESC
        """)
        failed_stats = [dict(row) for row in cursor.fetchall()]
        
        return {
            "total_logins": total_logins,
            "active_sessions": active_sessions,
            "failed_attempts": failed_attempts,
            "success_rate": round((total_logins / (total_logins + failed_attempts) * 100) if (total_logins + failed_attempts) > 0 else 0, 2),
            "user_statistics": user_stats,
            "failed_login_statistics": failed_stats
        }
    finally:
        conn.close()

@router.get("/active-sessions")
def get_active_sessions(current_user: models.User = Depends(get_current_user)):
    """Get all active login sessions (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    sessions = login_tracker.get_active_sessions()
    return {"active_sessions": sessions, "count": len(sessions)}

@router.get("/user-login-history/{user_id}")
def get_user_login_history(user_id: int, current_user: models.User = Depends(get_current_user)):
    """Get login history for a specific user"""
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    history = login_tracker.get_user_login_history(user_id)
    return {"login_history": history, "count": len(history)}

@router.get("/login-timeline")
def get_login_timeline(current_user: models.User = Depends(get_current_user)):
    """Get login timeline by date (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    conn = sqlite3.connect('test.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            SELECT DATE(login_time) as date, COUNT(*) as count
            FROM login_logs
            GROUP BY DATE(login_time)
            ORDER BY date DESC
        """)
        timeline = [dict(row) for row in cursor.fetchall()]
        return {"timeline": timeline}
    finally:
        conn.close()

@router.get("/security-report")
def get_security_report(current_user: models.User = Depends(get_current_user)):
    """Get security report with failed attempts (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    conn = sqlite3.connect('test.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        # Failed attempts
        cursor.execute("""
            SELECT * FROM failed_login_attempts
            ORDER BY attempt_time DESC
            LIMIT 50
        """)
        failed_attempts = [dict(row) for row in cursor.fetchall()]
        
        # IPs with most failed attempts
        cursor.execute("""
            SELECT ip_address, COUNT(*) as attempt_count
            FROM failed_login_attempts
            GROUP BY ip_address
            ORDER BY attempt_count DESC
        """)
        suspicious_ips = [dict(row) for row in cursor.fetchall()]
        
        return {
            "failed_attempts": failed_attempts,
            "suspicious_ips": suspicious_ips,
            "total_failed": len(failed_attempts)
        }
    finally:
        conn.close()

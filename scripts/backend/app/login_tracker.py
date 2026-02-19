"""
Login Tracking Module - Automatically tracks all login/logout events
"""
import sqlite3
from datetime import datetime
from typing import Optional

class LoginTracker:
    def __init__(self, db_path: str = 'test.db'):
        self.db_path = db_path
        self._init_tables()
    
    def _init_tables(self):
        """Initialize login tracking tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS login_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                username TEXT,
                email TEXT,
                login_time TIMESTAMP,
                logout_time TIMESTAMP,
                ip_address TEXT,
                user_agent TEXT,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)
            
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS failed_login_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT,
                attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT,
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """)
            
            conn.commit()
        finally:
            conn.close()
    
    def log_login(self, user_id: int, username: str, email: str, 
                  ip_address: str, user_agent: str) -> int:
        """Log a successful login"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
            INSERT INTO login_logs (user_id, username, email, login_time, ip_address, user_agent, status)
            VALUES (?, ?, ?, ?, ?, ?, 'active')
            """, (user_id, username, email, datetime.now().isoformat(), ip_address, user_agent))
            
            conn.commit()
            login_id = cursor.lastrowid
            return login_id
        finally:
            conn.close()
    
    def log_logout(self, login_id: int) -> bool:
        """Log a logout"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
            UPDATE login_logs 
            SET logout_time = ?, status = 'logout'
            WHERE id = ?
            """, (datetime.now().isoformat(), login_id))
            
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()
    
    def log_failed_login(self, email: str, ip_address: str, reason: str) -> int:
        """Log a failed login attempt"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
            INSERT INTO failed_login_attempts (email, attempt_time, ip_address, reason)
            VALUES (?, ?, ?, ?)
            """, (email, datetime.now().isoformat(), ip_address, reason))
            
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()
    
    def get_active_sessions(self):
        """Get all active sessions"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
            SELECT * FROM login_logs WHERE status = 'active' ORDER BY login_time DESC
            """)
            return [dict(row) for row in cursor.fetchall()]
        finally:
            conn.close()
    
    def get_user_login_history(self, user_id: int):
        """Get login history for a specific user"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
            SELECT * FROM login_logs WHERE user_id = ? ORDER BY login_time DESC
            """, (user_id,))
            return [dict(row) for row in cursor.fetchall()]
        finally:
            conn.close()

# Global tracker instance
login_tracker = LoginTracker()

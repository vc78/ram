import sqlite3
from datetime import datetime
import json

# Create login tracking table
conn = sqlite3.connect('test.db')
cursor = conn.cursor()

print("=" * 60)
print("SETTING UP LOGIN TRACKING SYSTEM")
print("=" * 60)

try:
    # Create login_logs table
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
    conn.commit()
    print("✓ Created login_logs table")

    # Create failed_login_logs table for security tracking
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
    print("✓ Created failed_login_attempts table")

    # Insert sample login data
    sample_logins = [
        (1, 'Admin', 'admin@example.com', '2026-01-25 08:30:00', '2026-01-25 17:30:00', '192.168.1.100', 'Mozilla/5.0', 'logout'),
        (2, 'Demo User', 'user@example.com', '2026-01-25 09:15:00', '2026-01-25 14:45:00', '192.168.1.101', 'Mozilla/5.0', 'logout'),
        (1, 'Admin', 'admin@example.com', '2026-01-26 08:00:00', None, '192.168.1.100', 'Mozilla/5.0', 'active'),
        (3, 'VENKAT CHOWDARY', 'venkatchowdary78@gmail.com', '2026-01-26 10:30:00', '2026-01-26 15:20:00', '192.168.1.102', 'Mozilla/5.0', 'logout'),
        (4, 'Sarah Johnson', 'sarah.johnson@example.com', '2026-02-01 09:00:00', '2026-02-01 18:00:00', '192.168.1.103', 'Chrome/91.0', 'logout'),
        (5, 'Michael Chen', 'michael.chen@example.com', '2026-02-02 08:45:00', '2026-02-02 17:15:00', '192.168.1.104', 'Safari/537.36', 'logout'),
        (2, 'Demo User', 'user@example.com', '2026-02-03 07:30:00', None, '192.168.1.105', 'Mozilla/5.0', 'active'),
    ]

    cursor.executemany("""
    INSERT INTO login_logs (user_id, username, email, login_time, logout_time, ip_address, user_agent, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, sample_logins)
    conn.commit()
    print(f"✓ Inserted {len(sample_logins)} sample login records")

    # Insert sample failed login attempts
    failed_attempts = [
        ('admin@example.com', '2026-01-25 08:25:00', '192.168.1.200', 'Invalid password'),
        ('user@example.com', '2026-01-25 09:10:00', '192.168.1.201', 'Invalid password'),
        ('invalid@example.com', '2026-02-02 12:00:00', '192.168.1.206', 'User not found'),
    ]

    cursor.executemany("""
    INSERT INTO failed_login_attempts (email, attempt_time, ip_address, reason)
    VALUES (?, ?, ?, ?)
    """, failed_attempts)
    conn.commit()
    print(f"✓ Inserted {len(failed_attempts)} failed login attempts")

except Exception as e:
    print(f"✗ Error: {e}")
    conn.rollback()

conn.close()

print("\n" + "=" * 60)
print("✓ LOGIN TRACKING SYSTEM SETUP COMPLETE")
print("=" * 60)

import sqlite3
from datetime import datetime
import csv

conn = sqlite3.connect('test.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("=" * 80)
print("USER LOGIN TRACKING REPORT")
print("=" * 80)

# 1. All Login Activity
print("\n1. ALL LOGIN ACTIVITY")
print("-" * 80)
cursor.execute("""
    SELECT id, user_id, username, email, login_time, logout_time, status, ip_address
    FROM login_logs
    ORDER BY login_time DESC
""")
logins = cursor.fetchall()

for login in logins:
    duration = "Still Active" if login['logout_time'] is None else "Logged Out"
    print(f"ID: {login['id']:2d} | User: {login['username']:20s} | "
          f"Login: {login['login_time']:20s} | {duration:15s} | IP: {login['ip_address']}")

# 2. User Login Statistics
print("\n\n2. USER LOGIN STATISTICS")
print("-" * 80)
cursor.execute("""
    SELECT 
        user_id,
        username,
        email,
        COUNT(*) as total_logins,
        MAX(login_time) as last_login,
        MIN(login_time) as first_login
    FROM login_logs
    GROUP BY user_id
    ORDER BY total_logins DESC
""")
stats = cursor.fetchall()

print(f"{'User ID':<8} {'Username':<20} {'Email':<30} {'Logins':<8} {'Last Login':<20}")
print("-" * 80)
for stat in stats:
    print(f"{stat['user_id']:<8} {stat['username']:<20} {stat['email']:<30} "
          f"{stat['total_logins']:<8} {stat['last_login']:<20}")

# 3. Currently Active Sessions
print("\n\n3. ACTIVE SESSIONS (Currently Logged In)")
print("-" * 80)
cursor.execute("""
    SELECT user_id, username, email, login_time, ip_address
    FROM login_logs
    WHERE status = 'active'
    ORDER BY login_time DESC
""")
active = cursor.fetchall()

if active:
    for session in active:
        login_dt = datetime.fromisoformat(session['login_time'])
        now = datetime.now()
        duration = now - login_dt
        hours = duration.seconds // 3600
        minutes = (duration.seconds % 3600) // 60
        print(f"✓ {session['username']:<20} | {session['email']:<30} | "
              f"Logged in: {hours}h {minutes}m | IP: {session['ip_address']}")
else:
    print("No active sessions")

# 4. Failed Login Attempts
print("\n\n4. FAILED LOGIN ATTEMPTS (Security)")
print("-" * 80)
cursor.execute("""
    SELECT email, attempt_time, reason, ip_address
    FROM failed_login_attempts
    ORDER BY attempt_time DESC
""")
failed = cursor.fetchall()

if failed:
    for attempt in failed:
        print(f"✗ {attempt['email']:<30} | {attempt['attempt_time']:<20} | "
              f"Reason: {attempt['reason']:<20} | IP: {attempt['ip_address']}")
else:
    print("No failed login attempts")

# 5. Login Timeline
print("\n\n5. LOGIN TIMELINE (By Date)")
print("-" * 80)
cursor.execute("""
    SELECT 
        DATE(login_time) as date,
        COUNT(*) as logins
    FROM login_logs
    GROUP BY DATE(login_time)
    ORDER BY date DESC
""")
timeline = cursor.fetchall()

for entry in timeline:
    print(f"{entry['date']} : {entry['logins']} login(s)")

# 6. Export Login Data to CSV
print("\n\n6. EXPORTING LOGIN DATA")
print("-" * 80)

# Export login logs
cursor.execute("SELECT * FROM login_logs ORDER BY login_time DESC")
logs = cursor.fetchall()
keys = [description[0] for description in cursor.description]

with open('login_logs_export.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=keys)
    writer.writeheader()
    writer.writerows([dict(row) for row in logs])
print("✓ Exported: login_logs_export.csv")

# Export failed attempts
cursor.execute("SELECT * FROM failed_login_attempts ORDER BY attempt_time DESC")
failed_logs = cursor.fetchall()
keys = [description[0] for description in cursor.description]

with open('failed_login_attempts_export.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=keys)
    writer.writeheader()
    writer.writerows([dict(row) for row in failed_logs])
print("✓ Exported: failed_login_attempts_export.csv")

# 7. Summary Statistics
print("\n\n7. SUMMARY STATISTICS")
print("-" * 80)
cursor.execute("SELECT COUNT(*) as total FROM login_logs")
total_logins = cursor.fetchone()['total']

cursor.execute("SELECT COUNT(DISTINCT user_id) as unique_users FROM login_logs")
unique_users = cursor.fetchone()['unique_users']

cursor.execute("SELECT COUNT(*) as failed FROM failed_login_attempts")
failed_attempts = cursor.fetchone()['failed']

cursor.execute("SELECT COUNT(*) as active FROM login_logs WHERE status = 'active'")
active_count = cursor.fetchone()['active']

print(f"Total Login Sessions: {total_logins}")
print(f"Unique Users Logged In: {unique_users}")
print(f"Failed Login Attempts: {failed_attempts}")
print(f"Currently Active Sessions: {active_count}")
print(f"Success Rate: {(total_logins / (total_logins + failed_attempts) * 100):.1f}%")

conn.close()

print("\n" + "=" * 80)
print("✓ LOGIN TRACKING REPORT COMPLETE")
print("=" * 80)

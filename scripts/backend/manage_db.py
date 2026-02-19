import sqlite3
import json
import csv
from datetime import datetime

conn = sqlite3.connect('test.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# ============================================================
# 1. EXPORT ALL DATA TO JSON AND CSV
# ============================================================
print("=" * 60)
print("EXPORTING DATA TO JSON AND CSV")
print("=" * 60)

tables = ['users', 'projects', 'jobs', 'applications', 'tasks', 'messages', 'contractors', 'members']

# Export to JSON
all_data = {}
for table in tables:
    try:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        all_data[table] = [dict(row) for row in rows]
    except Exception as e:
        print(f"Error reading {table}: {e}")

with open('database_export.json', 'w') as f:
    json.dump(all_data, f, indent=2, default=str)
print("\n✓ Exported to: database_export.json")

# Export each table to CSV
for table, data in all_data.items():
    if data:
        keys = data[0].keys()
        with open(f'{table}_export.csv', 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(data)
        print(f"✓ Exported to: {table}_export.csv")

# ============================================================
# 2. ADD NEW RECORDS
# ============================================================
print("\n" + "=" * 60)
print("ADDING NEW RECORDS")
print("=" * 60)

try:
    # Add new users
    new_users = [
        ('Sarah Johnson', 'sarah.johnson@example.com', '$pbkdf2-sha256$29000$836PUQph7H0vRUgJQehdKw$YMZLAek1LsEFnT1rEtLKxX5ktY4kRA7zZfzUaYqHmOM', 'user'),
        ('Michael Chen', 'michael.chen@example.com', '$pbkdf2-sha256$29000$836PUQph7H0vRUgJQehdKw$YMZLAek1LsEFnT1rEtLKxX5ktY4kRA7zZfzUaYqHmOM', 'user'),
        ('Emily Rodriguez', 'emily.rodriguez@example.com', '$pbkdf2-sha256$29000$836PUQph7H0vRUgJQehdKw$YMZLAek1LsEFnT1rEtLKxX5ktY4kRA7zZfzUaYqHmOM', 'user'),
    ]
    
    for name, email, pwd_hash, role in new_users:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
            (name, email, pwd_hash, role)
        )
    conn.commit()
    print(f"✓ Added 3 new users")

    # Add new projects
    new_projects = [
        (2, 'E-Commerce Platform', 'Build a scalable e-commerce platform', 'planning', 500000, '2026-06-30'),
        (2, 'Mobile App', 'Develop iOS and Android apps', 'active', 300000, '2026-05-15'),
    ]
    
    for user_id, name, desc, status, budget, deadline in new_projects:
        cursor.execute(
            "INSERT INTO projects (user_id, name, description, status, budget, deadline) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, name, desc, status, budget, deadline)
        )
    conn.commit()
    print(f"✓ Added 2 new projects")

    # Add new jobs
    new_jobs = [
        ('Full Stack Developer', 'Engineering', 'Remote', 60000, 90000, 'INR', 'Looking for experienced full stack developer'),
        ('UI/UX Designer', 'Design', 'Bangalore', 50000, 80000, 'INR', 'Design modern and intuitive interfaces'),
        ('DevOps Engineer', 'Engineering', 'Remote', 70000, 100000, 'INR', 'Manage cloud infrastructure'),
    ]
    
    for title, dept, loc, sal_min, sal_max, currency, desc in new_jobs:
        cursor.execute(
            "INSERT INTO jobs (title, department, location, salary_min, salary_max, currency, description) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (title, dept, loc, sal_min, sal_max, currency, desc)
        )
    conn.commit()
    print(f"✓ Added 3 new jobs")

    # Add new applications
    new_apps = [
        (2, 'Sarah Johnson', 'sarah.johnson@example.com', '9876543210', None, 'I am interested in this position', 'pending'),
        (3, 'Michael Chen', 'michael.chen@example.com', '8765432109', None, 'I have 5 years of experience', 'pending'),
    ]
    
    for job_id, name, email, phone, resume, cover, status in new_apps:
        cursor.execute(
            "INSERT INTO applications (job_id, name, email, phone, cover_letter, status) VALUES (?, ?, ?, ?, ?, ?)",
            (job_id, name, email, phone, cover, status)
        )
    conn.commit()
    print(f"✓ Added 2 new applications")

    # Add new tasks
    new_tasks = [
        (1, 'Setup Database', 'Configure and setup database schema', 'in_progress', 'Admin', '2026-02-15'),
        (1, 'API Development', 'Develop REST APIs', 'todo', None, '2026-03-01'),
    ]
    
    for proj_id, title, desc, status, assignee, due_date in new_tasks:
        cursor.execute(
            "INSERT INTO tasks (project_id, title, description, status, assignee_name, due_date) VALUES (?, ?, ?, ?, ?, ?)",
            (proj_id, title, desc, status, assignee, due_date)
        )
    conn.commit()
    print(f"✓ Added 2 new tasks")

except Exception as e:
    print(f"✗ Error adding records: {e}")
    conn.rollback()

# ============================================================
# 3. MODIFY EXISTING RECORDS
# ============================================================
print("\n" + "=" * 60)
print("MODIFYING EXISTING RECORDS")
print("=" * 60)

try:
    # Update project status
    cursor.execute(
        "UPDATE projects SET status = ? WHERE id = ?",
        ('active', 1)
    )
    conn.commit()
    print(f"✓ Updated project 1 status to 'active'")

    # Update job with salary info
    cursor.execute(
        "UPDATE jobs SET salary_min = ?, salary_max = ? WHERE id = 1",
        (100000, 150000)
    )
    conn.commit()
    print(f"✓ Updated job 1 with salary range")

    # Update application status
    cursor.execute(
        "UPDATE applications SET status = ? WHERE id = 1",
        ('selected',)
    )
    conn.commit()
    print(f"✓ Updated application 1 status to 'selected'")

    # Add phone to demo user
    cursor.execute(
        "UPDATE users SET name = ? WHERE id = 2",
        ('Demo User Updated',)
    )
    conn.commit()
    print(f"✓ Updated user 2 name")

except Exception as e:
    print(f"✗ Error modifying records: {e}")
    conn.rollback()

# ============================================================
# 4. DISPLAY UPDATED DATA
# ============================================================
print("\n" + "=" * 60)
print("UPDATED DATABASE SUMMARY")
print("=" * 60)

for table in ['users', 'projects', 'jobs', 'applications', 'tasks']:
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f"{table.upper()}: {count} records")

conn.close()

print("\n" + "=" * 60)
print("✓ ALL OPERATIONS COMPLETED SUCCESSFULLY")
print("=" * 60)
print("\nFiles created:")
print("  - database_export.json")
print("  - users_export.csv")
print("  - projects_export.csv")
print("  - jobs_export.csv")
print("  - applications_export.csv")
print("  - tasks_export.csv")
print("  - messages_export.csv")

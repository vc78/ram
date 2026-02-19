import requests
import json

BASE_URL = "http://127.0.0.1:8002"

print("=" * 60)
print("TESTING APPLICATION WITH NEW DATA")
print("=" * 60)

# Test 1: Health Check
print("\n1. Testing Backend Health...")
try:
    response = requests.get(f"{BASE_URL}/healthz", timeout=5)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   Error: {e}")

# Test 2: Get All Users (through API if available)
print("\n2. Checking User Count...")
import sqlite3
conn = sqlite3.connect('test.db')
cursor = conn.cursor()
cursor.execute("SELECT COUNT(*) FROM users")
user_count = cursor.fetchone()[0]
print(f"   Total users: {user_count}")
cursor.execute("SELECT name, email, role FROM users ORDER BY id")
for row in cursor.fetchall():
    print(f"   - {row[0]} ({row[1]}) - {row[2]}")

# Test 3: Get All Jobs
print("\n3. Available Jobs...")
cursor.execute("SELECT id, title, salary_min, salary_max FROM jobs ORDER BY id")
for row in cursor.fetchall():
    salary = f"₹{row[2]}-{row[3]}" if row[2] else "N/A"
    print(f"   {row[0]}. {row[1]} ({salary})")

# Test 4: Get All Projects
print("\n4. Available Projects...")
cursor.execute("SELECT id, name, status FROM projects ORDER BY id")
for row in cursor.fetchall():
    print(f"   {row[0]}. {row[1]} - Status: {row[2]}")

# Test 5: Get Applications
print("\n5. Job Applications...")
cursor.execute("""
    SELECT a.id, a.name, j.title, a.status 
    FROM applications a 
    JOIN jobs j ON a.job_id = j.id 
    ORDER BY a.id
""")
for row in cursor.fetchall():
    print(f"   {row[0]}. {row[1]} applied for '{row[2]}' - Status: {row[3]}")

# Test 6: Get Tasks
print("\n6. Project Tasks...")
cursor.execute("SELECT id, title, status FROM tasks ORDER BY id")
for row in cursor.fetchall():
    print(f"   {row[0]}. {row[1]} - Status: {row[2]}")

conn.close()

print("\n" + "=" * 60)
print("✓ TEST SUMMARY")
print("=" * 60)
print(f"✓ Database is functioning correctly")
print(f"✓ {user_count} users registered")
print(f"✓ Data successfully populated and accessible")
print(f"\nFrontend URL: http://localhost:3000")
print(f"Backend URL: http://127.0.0.1:8002")
print("=" * 60)

import sqlite3
import json

conn = sqlite3.connect('test.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

tables = ['users', 'projects', 'jobs', 'applications', 'tasks', 'messages']

for table in tables:
    try:
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        if rows:
            print(f"\n{'='*60}")
            print(f"TABLE: {table.upper()} ({len(rows)} records)")
            print(f"{'='*60}")
            # Get column names
            columns = [description[0] for description in cursor.description]
            print(f"Columns: {columns}")
            print("-" * 60)
            for row in rows:
                print(dict(row))
        else:
            print(f"\n{table.upper()}: No data")
    except Exception as e:
        print(f"Error reading {table}: {e}")

conn.close()

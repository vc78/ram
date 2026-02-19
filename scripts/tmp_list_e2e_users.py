import sqlite3
print('RUNNING tmp_list_e2e_users')
p='scripts/backend/test.db'
conn=sqlite3.connect(p)
cur=conn.cursor()
cur.execute("SELECT id, name, email, created_at FROM users WHERE email LIKE 'e2e-ui-%' ORDER BY created_at DESC LIMIT 10")
rows=cur.fetchall()
if not rows:
    print('NO_MATCH')
else:
    for r in rows:
        print(r)
conn.close()

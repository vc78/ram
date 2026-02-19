from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

r = client.post('/api/v1/auth/signup', json={'name':'Test User','email':'testuser@example.com','password':'Password123'})
print('status', r.status_code)
try:
    print('json', r.json())
except Exception:
    print('text', r.text)

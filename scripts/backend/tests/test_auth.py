import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_signup_and_login_flow():
    # Signup
    r = client.post("/api/v1/auth/signup", json={"name": "Test User", "email": "testuser@example.com", "password": "Password123"})
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == "testuser@example.com"

    # Login
    r2 = client.post("/api/v1/auth/login", json={"email": "testuser@example.com", "password": "Password123"})
    assert r2.status_code == 200
    body = r2.json()
    assert "access_token" in body
    token = body["access_token"]

    # Access protected endpoint
    r3 = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r3.status_code == 200
    me = r3.json()
    assert me["email"] == "testuser@example.com"

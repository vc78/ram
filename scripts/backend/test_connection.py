import os
import pytest
from sqlalchemy import text
from app.db import engine

# Skip module if MYSQL_URL not set (helps local dev without DB)
if not os.environ.get("MYSQL_URL"):
    pytest.skip("MYSQL_URL not set; skipping DB connection tests", allow_module_level=True)


def test_db_connection():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))

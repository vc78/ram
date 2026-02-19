import os
import subprocess
import sys
import pytest

from app.db import engine
from app.models import Base
from sqlalchemy import text


@pytest.mark.skipif(not os.environ.get("MYSQL_URL"), reason="MYSQL_URL not set; skipping DB integration tests")
def test_migrate_and_seed_runs(tmp_path):
    # Run migrate.py (should not raise)
    subprocess.check_call([sys.executable, "migrate.py"])

    # After migrations fallback or table creation, check at least one table exists
    with engine.connect() as conn:
        res = conn.execute(text("SHOW TABLES;"))
        tables = [r[0] for r in res.fetchall()]
        assert len(tables) > 0

    # Run seed twice to ensure idempotency (no errors)
    subprocess.check_call([sys.executable, "seed_sample_data.py"])
    subprocess.check_call([sys.executable, "seed_sample_data.py"])

    # Basic check: user table should have our seeded user
    with engine.connect() as conn:
        res = conn.execute(text("SELECT COUNT(*) FROM users WHERE email='user@example.com'"))
        count = res.fetchone()[0]
        assert count >= 1

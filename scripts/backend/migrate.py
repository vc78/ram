"""Migration helper: try running Alembic upgrade head; if Alembic isn't installed or fails, fall back to SQLAlchemy create_all."""
import sys
import traceback

try:
    from alembic import command
    from alembic.config import Config
    ALEMBIC_AVAILABLE = True
except Exception:
    ALEMBIC_AVAILABLE = False

from app.db import engine, Base
from pathlib import Path

ALEMBIC_INI = Path(__file__).parent / "alembic.ini"


def run_alembic_upgrade():
    config = Config(str(ALEMBIC_INI))
    command.upgrade(config, "head")


def create_all_tables():
    print("Fallback: creating all tables via SQLAlchemy Base.metadata.create_all()")
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    print("==> Running migrations")
    try:
        if ALEMBIC_AVAILABLE:
            print("Using Alembic to apply migrations...")
            run_alembic_upgrade()
            print("Alembic migrations applied")
        else:
            print("Alembic not available; falling back to create_all")
            create_all_tables()
            print("Tables created (fallback)")
    except Exception as e:
        print("Migration failed:", e)
        traceback.print_exc()
        print("Attempting fallback create_all()")
        create_all_tables()
        sys.exit(0)

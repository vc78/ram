from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .settings import settings

if settings.MYSQL_URL.startswith("sqlite"):
    # For SQLite (in-memory) use minimal connect_args and no pooling params
    engine = create_engine(settings.MYSQL_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(
        settings.MYSQL_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        pool_size=5,
        max_overflow=10,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # default to small on-disk sqlite for local test discovery if MYSQL_URL is not provided
    MYSQL_URL: str = "sqlite+pysqlite:///./test.db"
    JWT_SECRET: str = "test-jwt-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3003", "https://*.vercel.app"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

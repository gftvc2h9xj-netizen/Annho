from pydantic_settings import BaseSettings
from typing import List
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(default="postgresql://dorm_user:dorm_password@db:5432/dorm_health")
    REDIS_URL: str = Field(default="redis://redis:6379")
    SECRET_KEY: str = Field(default="your-secret-key-change-in-production")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7)
    DEBUG: bool = Field(default=True)
    ENVIRONMENT: str = Field(default="development")
    LOG_LEVEL: str = Field(default="INFO")
    API_VERSION: str = Field(default="v1")
    API_TITLE: str = Field(default="AI Dorm Health System API")
    API_DESCRIPTION: str = Field(default="Smart dormitory health management platform with AI analysis")
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:3000", "http://localhost:80"])
    CORS_CREDENTIALS: bool = Field(default=True)
    MODEL_PATH: str = Field(default="./models/")
    USE_GPU: bool = Field(default=False)
    MODEL_CONFIDENCE_THRESHOLD: float = Field(default=0.7)
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

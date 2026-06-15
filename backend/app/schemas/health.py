from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class HealthMetricCreate(BaseModel):
    steps: Optional[int] = Field(None, ge=0)
    heart_rate: Optional[float] = Field(None, ge=30, le=200)
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    body_temperature: Optional[float] = Field(None, ge=35, le=42)
    blood_pressure_systolic: Optional[int] = Field(None, ge=60, le=200)
    blood_pressure_diastolic: Optional[int] = Field(None, ge=40, le=130)
    blood_oxygen: Optional[float] = Field(None, ge=50, le=100)
    calories: Optional[float] = Field(None, ge=0)
    weight: Optional[float] = Field(None, ge=20, le=300)

class HealthMetricResponse(HealthMetricCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

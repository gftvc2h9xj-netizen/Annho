from datetime import datetime
from typing import Optional

class HealthMetric:
    id: Optional[int] = None
    user_id: int
    steps: Optional[int] = None
    heart_rate: Optional[float] = None
    sleep_hours: Optional[float] = None
    body_temperature: Optional[float] = None
    blood_pressure_systolic: Optional[int] = None
    blood_pressure_diastolic: Optional[int] = None
    blood_oxygen: Optional[float] = None
    calories: Optional[float] = None
    weight: Optional[float] = None
    source: Optional[str] = None
    created_at: Optional[datetime] = None

class HealthAnalysis:
    id: Optional[int] = None
    user_id: int
    analysis_type: str
    health_score: Optional[float] = None
    risk_level: Optional[str] = None
    summary: Optional[str] = None
    detailed_report: Optional[str] = None
    model_version: Optional[str] = None
    confidence_score: Optional[float] = None
    created_at: Optional[datetime] = None

class Recommendation:
    id: Optional[int] = None
    user_id: int
    category: str
    priority: str = "normal"
    title: str
    description: str
    action_items: Optional[str] = None
    is_acknowledged: bool = False
    is_completed: bool = False
    created_at: Optional[datetime] = None

class Alert:
    id: Optional[int] = None
    user_id: int
    alert_type: str
    severity: str
    message: str
    details: Optional[str] = None
    is_acknowledged: bool = False
    is_resolved: bool = False
    created_at: Optional[datetime] = None

from datetime import datetime
from typing import Optional

class User:
    id: Optional[int] = None
    username: str
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

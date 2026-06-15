from fastapi import APIRouter, status
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    return {"message": "注册成功", "user": {"id": 1, "username": request.username, "email": request.email}}

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(request: LoginRequest):
    return {"access_token": "token_example", "token_type": "bearer"}

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    return {"message": "登出成功"}

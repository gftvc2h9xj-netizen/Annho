from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 应用启动中...")
    yield
    logger.info("🛑 应用关闭中...")

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["根"])
async def root():
    return {
        "message": "欢迎使用AI宿舍健康管理系统",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
    }

@app.get("/health", tags=["健康检查"], status_code=status.HTTP_200_OK)
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
    }

# API 文档

## 基础信息

- **基础URL**: `http://localhost:8000/api/v1`
- **认证**: JWT Bearer Token
- **数据格式**: JSON

## 认证端点

### 用户注册

```http
POST /auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "full_name": "张三"
}
```

### 用户登录

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 健康数据端点

### 上传健康指标

```http
POST /health/metrics
Authorization: Bearer <token>
Content-Type: application/json

{
  "steps": 8000,
  "heart_rate": 72.5,
  "sleep_hours": 7.5,
  "body_temperature": 36.5,
  "blood_pressure_systolic": 120,
  "blood_pressure_diastolic": 80
}
```

### 获取健康数据

```http
GET /health/metrics?date=2024-01-15&limit=10
Authorization: Bearer <token>
```

### 获取AI分析

```http
GET /health/analysis?type=daily
Authorization: Bearer <token>
```

### 获取健康建议

```http
GET /health/recommendations
Authorization: Bearer <token>
```

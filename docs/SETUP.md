# 项目设置指南

## 快速开始

### 使用 Docker Compose (推荐)

```bash
git clone https://github.com/gftvc2h9xj-netizen/Annho.git
cd Annho

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 访问应用

- 前端: http://localhost:3000
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 本地开发

### 后端设置

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 前端设置

```bash
cd frontend
npm install
npm start
```

## 环境配置

复制 `backend/.env.example` 为 `.env`:

```bash
cp backend/.env.example backend/.env
```

## 常见问题

### 端口被占用
修改 docker-compose.yml 中的端口映射。

### 数据库连接失败
检查 PostgreSQL 容器是否运行。

# AI宿舍健康管理系统

🏥 一个基于AI的智能宿舍健康管理平台，提供实时健康监测、数据分析和个性化健康建议。

## 🌟 核心功能

- **📊 实时健康监测**：步数、心率、睡眠、体温、血压等数据采集
- **🤖 AI智能分析**：基于机器学习模型的健康趋势分析
- **💡 个性化建议**：根据用户数据生成定制化健康建议
- **👥 多人宿舍管理**：支持同一宿舍多个用户的数据管理
- **🔔 健康预警**：异常数据自动告警提醒
- **📈 可视化仪表板**：直观展示健康数据和趋势
- **🏆 健康挑戰**：鼓励用户参与健康竞赛
- **🔐 隐私保护**：端到端加密和数据安全

## 🚀 快速开始

### 使用Docker Compose（推荐）

```bash
# 克隆项目
git clone https://github.com/gftvc2h9xj-netizen/Annho.git
cd Annho

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 访问应用

- **前端**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs
- **数据库**: postgresql://dorm_user:dorm_password@localhost:5432/dorm_health

## 🏗️ 项目架构

```
Annho/
├── backend/              # FastAPI后端
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── api/
│   │   ├── services/
│   └── utils/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/             # React前端
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── database/             # 数据库初始化
├── docker-compose.yml    # Docker编排
└── docs/                 # 文档
```

## 🛠️ 技术栈

- **后端**: FastAPI + SQLAlchemy + PostgreSQL
- **前端**: React + TailwindCSS
- **缓存**: Redis
- **容器**: Docker & Docker Compose
- **AI/ML**: scikit-learn, NumPy, Pandas

## 📡 API端点

### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/logout` - 用户登出

### 健康数据
- `POST /api/v1/health/metrics` - 上传健康数���
- `GET /api/v1/health/metrics` - 获取健康数据
- `GET /api/v1/health/analysis` - AI健康分析
- `GET /api/v1/health/recommendations` - 健康建议

## 📚 文档

- [API文档](docs/API.md)
- [设置指南](docs/SETUP.md)

## 🔧 本地开发

### 后端开发

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 前端开发

```bash
cd frontend
npm install
npm start
```

## 🧪 测试

```bash
# 后端测试
cd backend && pytest

# 前端测试
cd frontend && npm test
```

## 📝 环境配置

复制 `backend/.env.example` 为 `.env` 并修改配置：

```bash
cp backend/.env.example backend/.env
```

## 🚦 停止服务

```bash
# 停止所有容器
docker-compose stop

# 删除所有容器
docker-compose down

# 删除容器和数据卷
docker-compose down -v
```

## 🐛 常见问题

### 端口被占用
修改 `docker-compose.yml` 中的端口映射。

### 数据库连接失败
检查 PostgreSQL 容器是否运行：
```bash
docker-compose logs db
```

### 前端无法连接后端
检查 `REACT_APP_API_URL` 环境变量。

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交Issue和Pull Request！

## 📧 联系方式

- 📧 Email: support@dorm-health.com
- 🐛 Issues: [GitHub Issues](https://github.com/gftvc2h9xj-netizen/Annho/issues)

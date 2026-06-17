# AI 宿舍健康管理系统（简要说明）

本仓库包含一个最小可运行的 AI 宿舍健康管理系统示例：
- 前端（React，界面中文）：登录/注册、仪表盘、健康数据、AI 问答页面
- 后端（Node.js + Express）：用户认证（注册/登录）、健康数据 CRUD、AI 代理（支持 Hugging Face / OpenAI）
- 数据库（PostgreSQL）：users、metrics、ai_sessions、ai_messages 等表，用于保存用户与会话历史
- Docker Compose：db / backend / frontend 一键启动示例

本 README 侧重说明如何通过环境变量开关控制速率限制、内容过滤与会话历史，并给出验证方法。

---

## 快速启动（使用 Docker Compose）
1. 在仓库根目录：
   docker-compose up -d --build
2. 等待服务启动：
   - 前端： http://localhost:3000
   - 后端 API： http://localhost:4000 (根路径 /api)

默认环境变量在 `backend/.env.example` 中给出，请根据需要在部署环境或 docker-compose 中覆盖。

---

## 关键环境变量（与开关）
- DATABASE_URL：Postgres 连接（示例：postgres://postgres:password@db:5432/ai_dorm）
- JWT_SECRET：用于签发 JWT 的密钥（请使用随机强密钥）
- HF_API_KEY：可选，Hugging Face token（用于调用 HF 模型）
- HF_MODEL：可选，HF 模型名（默认 `facebook/blenderbot-400M-distill`）
- OPENAI_API_KEY：可选，若使用 OpenAI
- PORT：后端端口（默认 4000）

Feature flags（设为 `false` 可禁用相应功能）：
- ENABLE_RATE_LIMITER=false        # 关闭速率限制
- ENABLE_CONTENT_FILTER=false      # 关闭简单内容过滤
- ENABLE_SESSION_HISTORY=false     # 关闭会话历史与消息持久化（转为一次性问答）

说明：默认这些功能为启用状态。要在容器中生效请在 docker-compose 或容器环境中设置对应变量并重启后端。

---

## 在 docker-compose 中设置示例（把三项禁用）
在 `docker-compose.yml` 的 `backend` 服务下，添加或修改 environment：

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/ai_dorm
      JWT_SECRET: your_jwt_secret
      HF_API_KEY: ""
      HF_MODEL: facebook/blenderbot-400M-distill
      PORT: 4000
      ENABLE_RATE_LIMITER: "false"
      ENABLE_CONTENT_FILTER: "false"
      ENABLE_SESSION_HISTORY: "false"

然后重建并启动：
  docker-compose up -d --build backend

---

## 本地开发 (.env) 示例
在 `backend/` 下复制示例：
  cp backend/.env.example backend/.env

编辑 backend/.env，添加或修改：
  ENABLE_RATE_LIMITER=false
  ENABLE_CONTENT_FILTER=false
  ENABLE_SESSION_HISTORY=false

重启后端进程使配置生效。

---

## 验证方法（快速）
1. 注册并登录（前端页面或使用 curl）：
   curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"username":"test","password":"123456"}'
   curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"username":"test","password":"123456"}'
   保存返回的 token（示例：access_token）。

2. 测试一次性 AI 问答：
   curl -X POST http://localhost:4000/api/ai/chat -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"question":"请给出睡眠改善建议"}'
   - 当 `ENABLE_SESSION_HISTORY=false` 时，后端会进行一次性调用并不会保存会话或消息。

3. 测试禁用速率限制：
   - 在启用速率限制时，快速多次调用 `/api/ai/chat` 将在超出配额后收到 429 响应。
   - 若设置 `ENABLE_RATE_LIMITER=false`，快速连续调用不再返回 429（请注意不要滥用外部 AI 接口）。

4. 测试禁用内容过滤：
   - 默认启用时，若请求文本匹配黑名单正则（如包含“毒品、自杀、炸弹”等），将返回 400 并提示拦截。
   - 若设置 `ENABLE_CONTENT_FILTER=false`，相同请求将不再被中间件拦截。

5. 会话管理 API：
   - 若 `ENABLE_SESSION_HISTORY=true`，可以创建会话并查看历史：
     POST /api/ai/sessions
     GET /api/ai/sessions
     GET /api/ai/sessions/:id/messages
   - 若禁用，会返回 400 提示“会话历史功能已被禁用”。

---

## 迁移/表结构（若手动执行 SQL）
在使用 Postgres 时，请确保运行以下 SQL（仓库提供在 backend/migrations/*.sql）：
- backend/migrations/001_create_tables.sql
- backend/migrations/002_create_ai_tables.sql
- backend/migrations/003_add_session_summary.sql

示例（本机 psql）：
  psql -h localhost -U postgres -d ai_dorm -f backend/migrations/001_create_tables.sql
  psql -h localhost -U postgres -d ai_dorm -f backend/migrations/002_create_ai_tables.sql
  psql -h localhost -U postgres -d ai_dorm -f backend/migrations/003_add_session_summary.sql

---

## 安全与注意事项
- 切勿将 HF_API_KEY / OPENAI_API_KEY / JWT_SECRET 等敏感信息提交到公开仓库。请使用环境变量或 CI/CD secrets 管理。
- 内容过滤目前为简单黑名单实现，容易漏判或误判，若对安全要求高请接入专业内容审核服务。
- 速率限制目前为内存实现（默认），在多实例部署需改用 Redis 等集中式方案。
- AI 模型调用可能产生费用或配额使用，请妥善管理并考虑缓存与限流策略。

---

## 帮助
如需我将 `docker-compose.yml` 默认改为禁用这些功能，或把 README 加上更多部署细节与 CI/CD 示例，请回复我（我可以直接提交改动）。


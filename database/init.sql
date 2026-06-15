-- 创建数据库用户
CREATE USER dorm_user WITH PASSWORD 'dorm_password';

-- 创建数据库
CREATE DATABASE dorm_health OWNER dorm_user;

-- 连接到新数据库
\c dorm_health;

-- 授予权限
ALTER ROLE dorm_user SET client_encoding TO 'utf8';
ALTER ROLE dorm_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE dorm_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE dorm_health TO dorm_user;

CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO dorm_user;

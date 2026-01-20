-- Spec: /docs/specs/login-backend.md
-- 描述: 为 users 表添加 name（昵称）和 avatar（头像）字段
-- 执行时机: 在已有数据库中添加新字段时执行
-- 注意: 此脚本用于现有数据库的字段添加，仅执行一次

-- 添加 name 字段（用户昵称/显示名称）
ALTER TABLE users
ADD COLUMN IF NOT EXISTS name VARCHAR(100);

-- 添加 avatar 字段（用户头像 URL）
ALTER TABLE users
ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);

-- 添加字段注释（PostgreSQL 支持）
COMMENT ON COLUMN users.name IS '用户昵称/显示名称';
COMMENT ON COLUMN users.avatar IS '用户头像 URL（指向头像图片的完整链接）';

-- Spec: /docs/specs/login-backend.md
-- 开启 UUID 支持（PostgreSQL 13+ 通常已内置，但显式开启更稳妥）
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. 用户表 (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,       -- 手机号（实名基础）
    password_hash TEXT,                      -- 加密存储的密码（首次验证码登录可为空）
    role SMALLINT DEFAULT 1,                 -- 0: 管理员(admin), 1: 普通用户(user)
    status SMALLINT DEFAULT 1,               -- 0: 封禁(banned), 1: 正常(normal)
    last_login_ip VARCHAR(45),               -- 记录最后登录IP（备案审计需要）
    last_login_time TIMESTAMP WITH TIME ZONE,
    created_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role_status ON users(role, status);

-- 2. AI 邮件生成审计表 (audit_logs) - 算法备案的核心
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,                   -- 逻辑外键
    user_phone VARCHAR(20),                  -- 冗余手机号，方便管理后台检索
    user_ip VARCHAR(45) NOT NULL,            -- 产生行为时的用户IP（合规必填）
    
    scene VARCHAR(50),                       -- 场景
    tone VARCHAR(50),                        -- 语气
    input_prompt TEXT NOT NULL,              -- 用户原始输入
    output_content TEXT NOT NULL,            -- AI 生成文本
    
    model_name VARCHAR(50),                  -- 底层模型名称（如 DeepSeek-V3）
    audit_token TEXT,                        -- 零宽水印/溯源标识
    
    status SMALLINT DEFAULT 1,               -- 1: 通过(pass), 2: 违规拦截(block)
    is_sensitive BOOLEAN DEFAULT FALSE,      -- 是否命中外部审核 API 的敏感词
    external_audit_id VARCHAR(100),          -- 记录阿里云审核请求的 RequestID（方便排查）
    
    created_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_status_time ON audit_logs(status, created_time);

-- 3. 投诉反馈与举报表 (feedbacks)
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    log_id UUID,                             -- 关联的生成记录ID
    
    type VARCHAR(30) NOT NULL,               -- 'COMPLAINT', 'REPORT', 'SUGGESTION'
    content TEXT NOT NULL,                   -- 反馈内容
    
    status SMALLINT DEFAULT 0,               -- 0: 待处理, 1: 已处理
    admin_note TEXT,                         -- 管理员备注
    processed_time TIMESTAMP WITH TIME ZONE,
    created_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_feedbacks_status ON feedbacks(status);

-- 4. 管理操作日志表 (admin_operation_logs) - 内部管理审计
CREATE TABLE admin_operation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,                  -- 管理员用户ID
    action_type VARCHAR(50) NOT NULL,        -- 操作类型：'BAN_USER', 'UNBAN_USER' 等
    user_id UUID,                            -- 被操作的用户ID
    audit_id UUID,                           -- 审计日志表对应ID
    detail TEXT,                             -- 理由或详情
    ip VARCHAR(45),                          -- 管理员操作IP
    created_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 1. 用户表 (users) 注释
-- =============================================
COMMENT ON TABLE users IS '用户基本信息表';
COMMENT ON COLUMN users.id IS '用户唯一标识 UUID';
COMMENT ON COLUMN users.phone IS '用户实名认证手机号';
COMMENT ON COLUMN users.password_hash IS '加密存储的密码哈希值';
COMMENT ON COLUMN users.role IS '用户角色：0-管理员(Admin), 1-普通用户(User)';
COMMENT ON COLUMN users.status IS '账户状态：0-封禁(Banned), 1-正常(Normal)';
COMMENT ON COLUMN users.last_login_ip IS '最后登录时的 IP 地址（合规审计需要）';
COMMENT ON COLUMN users.last_login_time IS '最后登录的精确时间';
COMMENT ON COLUMN users.created_time IS '账户注册时间';
COMMENT ON COLUMN users.updated_time IS '账户信息最后更新时间';

-- =============================================
-- 2. 审计日志表 (audit_logs) 注释
-- =============================================
COMMENT ON TABLE audit_logs IS 'AI 邮件生成审计存证表';
COMMENT ON COLUMN audit_logs.id IS '日志唯一标识 UUID';
COMMENT ON COLUMN audit_logs.user_id IS '操作用户 ID';
COMMENT ON COLUMN audit_logs.user_phone IS '操作用户手机号（冗余记录方便快速审计）';
COMMENT ON COLUMN audit_logs.user_ip IS '生成内容时的用户客户端 IP（网信办合规死要求）';
COMMENT ON COLUMN audit_logs.scene IS '邮件撰写场景（如：商务、请假、求职）';
COMMENT ON COLUMN audit_logs.tone IS '邮件撰写语气（如：正式、委婉、亲切）';
COMMENT ON COLUMN audit_logs.input_prompt IS '用户输入的原始撰写需求/指令';
COMMENT ON COLUMN audit_logs.output_content IS 'AI 生成的最终文本内容';
COMMENT ON COLUMN audit_logs.model_name IS '底层调用的大模型名称及版本（如：DeepSeek-V3）';
COMMENT ON COLUMN audit_logs.audit_token IS '安全溯源标识（用于识别 AI 生成内容的零宽水印 ID）';
COMMENT ON COLUMN audit_logs.status IS '审核状态：1-通过(Pass), 2-违规拦截(Block)';
COMMENT ON COLUMN audit_logs.is_sensitive IS '是否命中了外部安全接口（如阿里云）的敏感词检测';
COMMENT ON COLUMN audit_logs.external_audit_id IS '外部审核接口（阿里云/腾讯云）的请求流水号 RequestID';
COMMENT ON COLUMN audit_logs.created_time IS '内容生成及记录存证时间';

-- =============================================
-- 3. 投诉反馈表 (feedbacks) 注释
-- =============================================
COMMENT ON TABLE feedbacks IS '用户投诉、举报与建议反馈表';
COMMENT ON COLUMN feedbacks.id IS '反馈唯一标识 UUID';
COMMENT ON COLUMN feedbacks.user_id IS '反馈提交者 ID';
COMMENT ON COLUMN feedbacks.log_id IS '关联的生成记录 ID（针对特定生成的举报）';
COMMENT ON COLUMN feedbacks.type IS '反馈类别：COMPLAINT-质量投诉, REPORT-违规举报, SUGGESTION-建议';
COMMENT ON COLUMN feedbacks.content IS '反馈的具体文本内容';
COMMENT ON COLUMN feedbacks.status IS '处理状态：0-待处理(Pending), 1-已处理(Done)';
COMMENT ON COLUMN feedbacks.admin_note IS '管理员处理意见及备注';
COMMENT ON COLUMN feedbacks.processed_time IS '反馈处理完成的时间';
COMMENT ON COLUMN feedbacks.created_time IS '用户提交反馈的时间';

-- =============================================
-- 4. 管理操作日志表 (admin_operation_logs) 注释
-- =============================================
COMMENT ON TABLE admin_operation_logs IS '管理员后台操作审计日志';
COMMENT ON COLUMN admin_operation_logs.id IS '操作日志唯一标识 UUID';
COMMENT ON COLUMN admin_operation_logs.admin_id IS '执行操作的管理员 ID';
COMMENT ON COLUMN admin_operation_logs.action_type IS '操作类型（如：BAN_USER, UNBAN_USER, PROCESS_FEEDBACK）';
COMMENT ON COLUMN admin_operation_logs.user_id IS '被操作的用户 ID';
COMMENT ON COLUMN admin_operation_logs.audit_id IS '审计日志表对应 ID';
COMMENT ON COLUMN admin_operation_logs.detail IS '操作的具体原因或详细描述';
COMMENT ON COLUMN admin_operation_logs.ip IS '管理员执行操作时的 IP 地址';
COMMENT ON COLUMN admin_operation_logs.created_time IS '管理行为发生的精确时间';

-- 5. 邮件生成历史记录表 (mail_histories)
CREATE TABLE mail_histories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,                   -- 关联用户
    audit_log_id UUID,                       -- 关联审计日志（合规溯源）
    
    -- 表单输入内容
    scene VARCHAR(50),                       -- 场景
    tone VARCHAR(50),                        -- 语气
    recipient_name VARCHAR(100),             -- 收件人姓名
    recipient_role VARCHAR(200),             -- 收件人身份/职位
    sender_name VARCHAR(100),                -- 发件人姓名
    core_points TEXT,                        -- 核心要点
    
    -- AI 生成结果
    mail_content TEXT NOT NULL,              -- 生成的邮件正文内容
    
    -- 业务状态
    is_favorite BOOLEAN DEFAULT FALSE,       -- 是否收藏
    is_deleted BOOLEAN DEFAULT FALSE,        -- 是否删除（软删除，方便用户删除后后台仍可留存审计）
    
    -- 时间戳
    created_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 为常用查询维度创建索引
CREATE INDEX idx_mail_histories_user_id ON mail_histories(user_id);
CREATE INDEX idx_mail_histories_favorite ON mail_histories(user_id) WHERE is_favorite = TRUE;
CREATE INDEX idx_mail_histories_created_time ON mail_histories(created_time);

-- =============================================
-- 5. 邮件生成历史表 (mail_histories) 注释
-- =============================================
COMMENT ON TABLE mail_histories IS '用户邮件生成历史及收藏记录表';
COMMENT ON COLUMN mail_histories.id IS '历史记录唯一标识 UUID';
COMMENT ON COLUMN mail_histories.user_id IS '所属用户 ID';
COMMENT ON COLUMN mail_histories.audit_log_id IS '关联的审计日志 ID（用于技术合规与原始输入追溯）';
COMMENT ON COLUMN mail_histories.scene IS '邮件撰写场景';
COMMENT ON COLUMN mail_histories.tone IS '邮件撰写语气';
COMMENT ON COLUMN mail_histories.recipient_name IS '收件人姓名';
COMMENT ON COLUMN mail_histories.recipient_role IS '收件人身份/职位（如：采购总监、技术合作伙伴）';
COMMENT ON COLUMN mail_histories.sender_name IS '发件人姓名';
COMMENT ON COLUMN mail_histories.core_points IS '用户输入的邮件核心内容要点';
COMMENT ON COLUMN mail_histories.mail_content IS 'AI 生成的最终邮件正文内容';
COMMENT ON COLUMN mail_histories.is_favorite IS '用户是否收藏该邮件：TRUE-已收藏, FALSE-未收藏';
COMMENT ON COLUMN mail_histories.is_deleted IS '软删除标记：TRUE-用户侧已删除, FALSE-正常显示';
COMMENT ON COLUMN mail_histories.created_time IS '生成时间';
COMMENT ON COLUMN mail_histories.updated_time IS '最后修改时间（如修改收藏状态时更新）';
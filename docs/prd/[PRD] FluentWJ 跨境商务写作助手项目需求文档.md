[PRD] FluentWJ 跨境商务写作助手项目需求文档
文档版本：v2.1 (Build 20260122)
产品状态：MVP Development → Advanced Development → Production Ready
项目负责人：[Your Name]
核心目标：合规性准入（算法备案） + 跨境 B 端外包展示 + C 端付费闭环 + 企业级管理后台

---

## 📋 版本更新日志

| 版本 | 日期 | 主要变更 |
|------|------|---------|
| v2.1 | 2026-01-22 | 根据最新代码实现更新：技术栈版本升级、用户个性化字段、AI生成API完成、多语言支持 |
| v2.0 | 2026-01-19 | 重大更新：根据实际代码实现重构PRD，新增历史记录、落地页、Dashboard等功能 |
| v1.1 | 2025-01-07 | 初版发布，定义核心功能和数据库Schema |

---

## 1. 项目综述 (Executive Summary)

### 1.1 产品定义
FluentWJ 是一款针对跨境电商及外贸行业设计的智能商务写作工具。产品基于国内已备案大模型（DeepSeek-V3），提供结构化撰写、智能回复及多语言润色功能，并内置符合中国监管要求的"内容安全与溯源审计系统"。

**核心特性**：
- 🎯 **结构化AI写作**：基于场景、语气、收件人信息的智能邮件生成
- 📚 **历史记录管理**：支持搜索、收藏、删除、详情查看
- 🔍 **审计与合规**：全链路内容审计、敏感词检测、溯源水印
- 👥 **企业级后台**：Dashboard统计、用户管理、审计日志、反馈管理

### 1.2 商业价值
- **合规资产**：通过网信办"深度合成服务算法备案"，获得 AI 业务合规身份
- **技术溢价**：展示企业在 AI 垂直场景的应用能力，辅助承接南沙及大湾区企业软件外包业务
- **生产力工具**：解决外贸人员在多语言环境下的表达痛点，提升回复时效
- **品牌展示**：企业落地页展示产品核心能力和价值主张

---

## 2. 角色与权限 (Roles & Permissions)

| 角色 | SQL映射 (role) | 定义 | 核心权限 |
|------|----------------|------|---------|
| 访客 | - | 未注册/未登录用户 | 浏览首页、查看产品介绍、访问登录页面 |
| 注册用户 | 1 | 已完成手机号验证的用户 | AI撰写、历史记录、收藏管理、投诉举报 |
| 管理员 | 0 | 公司内部管理人员 | 访问 `/admin` 后台、查看审计日志、用户管理、反馈处理 |

---

## 3. 功能需求 (Functional Requirements)

### 3.1 账号体系 (Identity & Access Management)

#### [REQ-01] 手机号实名登录
- 集成国内主流 SMS 接口（华为云）
- **双模式登录**：
  - 验证码登录：输入手机号 → 发送验证码（60s冷却）→ 验证登录
  - 密码登录：输入手机号 + 密码 → 验证登录
- **首次登录流程**：验证码登录后，如果用户未设置密码，强制引导设置密码
- **密码管理**：
  - 设置密码（首次登录）
  - 修改密码（已登录用户）
  - 重置密码（忘记密码，通过验证码）
- 合规性：后端必须持久化手机号与 UID 的关联关系，作为实名审计基础
- 认证方案：自定义 JWT Token（非 NextAuth.js）

#### [REQ-02] 用户状态管理
- 系统需支持 NORMAL（正常）和 BANNED（封禁）状态
- 封禁用户调用 API 时返回 403 错误
- 管理员可在后台一键更改用户状态

---

### 3.2 企业落地页 (Landing Page) ⭐ 新增

#### [REQ-03] 落地页展示
- **顶部导航栏**：
  - Logo展示（mail图标 + FluentWJ）
  - 产品导航（产品特性、行业解决方案、价格方案）
  - 登录按钮 → 跳转到 `/login`

- **首屏Hero区域**：
  - 左侧：标签、主标题、副标题、CTA按钮组
  - 右侧：产品演示Mockup（可替换为真实截图）
  - CTA操作："开始使用"（跳转登录）、"预约演示"（待开发）

- **核心能力展示区域**：
  - 结构化写作：专为复杂商务文档设计的模版与 AI 引导提示
  - 语境化回复：基于完整邮件往来记录生成智能响应
  - 审计与合规：内置安全防护机制，确保符合企业治理标准

- **CTA区域**：强化用户转化行动
  - "立即开始" → 跳转登录
  - "联系销售" → 待开发

- **页脚**：
  - Logo、合规信息（ICP备案、AI算法备案、隐私政策）
  - 版权声明

---

### 3.3 AI 写作核心逻辑 (AI Composition Engine)

#### [REQ-04] 结构化撰写 (Structured Input)
- **表单输入**：
  - 业务场景（Dropdown）：商务邮件、工作汇报、项目提案、正式公告
  - 语气选择（Button组）：正式、友好、紧急、幽默
  - 语言选择（Dropdown）：简体中文、英语、繁体中文、日语、韩语
  - 收件人姓名（Input）：必填，最多100字符
  - 收件人身份（Input）：职位或背景（如：销售总监、技术合作伙伴），必填，最多200字符
  - 发件人姓名（Input）：可选，最多50字符
  - 核心要点（Textarea）：用户想表达的核心内容，多个要点分行输入，最多2000字符
- **禁止对话框**：前端不提供自由对话（Chat）接口，规避舆论属性风险
- **生成结果展示**：
  - 工具栏：复制、点踩、点赞、重新生成
  - 内容展示区：富文本展示（Prose样式）
  - AI免责声明

#### [REQ-05] 历史记录管理 ⭐ 新增
- **历史记录列表**：
  - 分页展示（默认每页20条）
  - 显示标题、预览内容、收藏状态、创建时间
  - 支持快捷筛选（全部、今日、本周、本月）
  - 支持时间范围筛选
  - 支持收藏筛选
  - 支持关键词搜索（在场景、收件人、核心要点、邮件内容中搜索）

- **历史记录详情**：
  - 显示完整的表单输入内容
  - 显示AI生成的邮件内容
  - 支持收藏/取消收藏
  - 支持删除记录（软删除）

- **收藏管理**：
  - 支持切换收藏状态
  - 可筛选仅显示收藏的记录

- **删除管理**：
  - 软删除（标记is_deleted=true）
  - 保留原始数据以备审计

---

### 3.4 内容安全防火墙 (Security & Moderation) - P0 优先级

#### [REQ-06] 穿透式审计记录
- 每次生成行为必须向 `audit_logs` 写入：
  - user_ip（客户端真实IP）
  - user_phone（冗余记录）
  - input_prompt（用户原始输入）
  - output_content（AI生成结果）
  - model_name（底层模型名称）

#### [REQ-07] 内容风险标记
- 敏感词命中：若触发外部审核（华为云/阿里云），需在 `is_sensitive` 标记为 TRUE
- 保存外部请求 ID `external_audit_id` 以便溯源
- 状态字段 `status`：
  - 0: 审核拦截（后台手动标记违规）
  - 1: 通过（审核通过）
  - 2: 系统拦截（AI自动拦截）

#### [REQ-08] 溯源水印 (Traceability)
- 生成结果需包含：
  - 显式声明："由 GlobalMail AI 算法辅助生成"
  - 隐式溯源：使用 `audit_token` 字段生成的零宽字符隐式嵌入文本

---

### 3.5 管理后台需求 (Admin Dashboard)

#### [REQ-09] 仪表盘 (Dashboard) ⭐ 新增
- **统计卡片**：
  - 总用户量（对比上月同期增长率）
  - 今日新增用户（对比昨日）
  - 今日生成量（对比昨日）
  - 今日拦截数（对比昨日）及拦截率

- **用户增长趋势图**：
  - 30天用户注册趋势数据
  - 折线图展示

- **最新注册用户列表**：
  - 显示最新注册的10个用户
  - 包含手机号、状态、注册时间、最后登录时间

#### [REQ-10] 审计日志模块 (Compliance Audit)
- **全链路存证列表**：
  - 字段要求：时间戳、用户 UID（手机号）、访问 IP、输入原文、AI 输出文本、安全审核状态
  - 搜索功能：支持按手机号精确查询、IP精确查询、模型名称模糊查询
  - 筛选功能：按审核状态（全部/通过/违规拦截）、时间范围（最近24小时/7天/30天/自定义）
  - 存留期：系统需确保数据物理存留期 ≥ 180 天

- **详情查看**：
  - 点击日志行，右侧滑出详情面板
  - 显示用户原始输入、AI生成结果
  - 显示安全元数据：客户端归属地、敏感词命中、内容合规分、审核接口ID
  - 操作按钮：「标记违规」、「标记通过」

- **数据导出**：
  - 支持导出当前筛选/搜索结果
  - CSV格式（UTF-8 BOM编码，支持中文）
  - 限制最大导出数量（10,000条）
  - 导出时记录操作日志

- **审计日志操作**：
  - 「标记违规」：将日志状态更新为违规（status=0），设置is_sensitive=true，记录操作日志
  - 「标记通过」：将日志状态更新为通过（status=1），设置is_sensitive=false，记录操作日志

#### [REQ-11] 用户管理模块
- **用户列表**：
  - 分页展示（默认每页20条）
  - 显示用户ID、手机号、角色、状态、注册时间、最后登录时间、最后登录IP
  - 搜索功能：支持按手机号模糊查询、用户ID精确查询
  - 筛选功能：按角色（全部/管理员/普通用户）、状态（全部/正常/已封禁）

- **用户操作**：
  - 创建用户：管理员可手动创建新用户（手机号 + 角色）
  - 更新状态：启用/禁用用户（封禁/解封）
  - 数据导出：CSV格式导出用户数据

- **统计信息**：
  - 总用户数
  - 正常用户数
  - 已封禁用户数
  - 管理员数
  - 今日新增用户数

#### [REQ-12] 投诉反馈管理
- **反馈列表**：
  - 分页展示（默认每页20条）
  - 显示反馈ID、用户信息（手机号脱敏）、反馈类型、内容、状态、处理时间
  - 搜索功能：支持按用户手机号、反馈内容搜索
  - 筛选功能：按反馈类型（投诉/举报/建议）、处理状态（待处理/已处理）、时间范围

- **反馈详情**：
  - 显示完整的反馈内容
  - 显示用户信息（手机号脱敏）
  - 显示处理状态、管理员备注、处理时间

- **反馈处理**：
  - 管理员可处理反馈并添加备注
  - 处理后更新状态为"已处理"
  - 记录操作日志

- **数据导出**：
  - CSV格式导出反馈数据

- **待处理反馈数量**：
  - 用于侧边栏徽章显示

#### [REQ-13] 操作日志审计 (Admin Operation Audit)
- **操作留痕**：
  - 管理员执行"封禁用户"、"创建用户"、"处理反馈"、"标记违规"等操作时
  - 系统必须自动记录至 `admin_operation_logs`
  - 包含：action_type（操作类型）、target_id（操作对象ID）、detail（操作详情）、ip（操作IP）、admin_id（管理员ID）

- **操作日志列表**：
  - 分页展示（默认每页20条）
  - 显示操作时间、管理员账号、操作类型、目标ID、详细描述、IP地址
  - 搜索功能：支持按管理员账号搜索
  - 筛选功能：按操作类型、时间范围

- **数据导出**：
  - CSV格式导出操作日志

---

## 4. 数据架构与技术选型 (Technical Specification)

### 4.1 技术栈 (Tech Stack)
- **Framework**: Next.js 16.1.1 (App Router)
- **Frontend**: React 19.2.3, TypeScript 5
- **ORM**: Prisma 7.2.0
- **Database**: PostgreSQL (Docker-based)
- **Cache**: Redis (ioredis 5.9.1)
- **Auth**: 自定义 JWT (jose 6.1.3)，非 NextAuth.js
- **Styling**: Tailwind CSS 4 + Shadcn/UI风格组件库
- **Icons**: Material Symbols Outlined
- **Fonts**: Inter, Noto Sans SC, IBM Plex Sans, Geist
- **Infrastructure**: 华为云 Flexus X 实例 (Ubuntu 24.04)

### 4.2 数据库 Schema 概览 (Entity Relationship)

#### 4.2.1 users 表（用户基本信息）
```prisma
model users {
  id              String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  phone           String    @unique @db.VarChar(20)
  name            String?   @db.VarChar(100)    // 用户昵称/显示名称（可选）
  avatar          String?   @db.VarChar(500)    // 用户头像URL（可选）
  password_hash   String?   // 可选，首次验证码登录时可为空，后续强制设置密码
  role            Int?      @default(1) @db.SmallInt    // 0:Admin, 1:User
  status          Int?      @default(1) @db.SmallInt    // 0:Banned, 1:Normal
  last_login_ip   String?   @db.VarChar(45)
  last_login_time DateTime? @db.Timestamptz(6)
  created_time    DateTime? @default(now()) @db.Timestamptz(6)
  updated_time    DateTime? @default(now()) @db.Timestamptz(6)

  @@index([phone], map: "idx_users_phone")
  @@index([role, status], map: "idx_users_role_status")
}
```

**字段说明**：
- `name`: 用户昵称/显示名称（可选，用于个性化展示）
- `avatar`: 用户头像URL（可选，用于个性化展示）
- `password_hash`: 加密存储的密码（首次验证码登录可为空）
- `role`: 用户角色（0=管理员, 1=普通用户）
- `status`: 账户状态（0=封禁, 1=正常）

#### 4.2.2 audit_logs 表（AI 邮件生成审计存证）
```prisma
model audit_logs {
  id                String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id           String    @db.Uuid
  user_phone        String?   @db.VarChar(20)    // 冗余手机号，方便管理后台检索
  user_ip           String    @db.VarChar(45)    // 产生行为时的用户IP（合规必填）

  scene             String?   @db.VarChar(50)    // 场景
  tone              String?   @db.VarChar(50)    // 语气
  input_prompt      String                      // 用户原始输入
  output_content    String                      // AI 生成文本

  model_name        String?   @db.VarChar(50)    // 底层模型名称（如 DeepSeek-V3）
  audit_token       String?                      // 零宽水印/溯源标识

  status            Int?      @default(1) @db.SmallInt  // 0:违规拦截, 1:通过, 2:系统拦截
  is_sensitive      Boolean?  @default(false)
  external_audit_id String?   @db.VarChar(100)   // 外部审核接口的 RequestID

  created_time      DateTime? @default(now()) @db.Timestamptz(6)

  @@index([status, created_time], map: "idx_audit_logs_status_time")
  @@index([user_id], map: "idx_audit_logs_user_id")
}
```

**字段说明**：
- `status`: 审核状态（0=审核拦截/手动标记违规, 1=通过, 2=系统拦截）
- `is_sensitive`: 是否命中外部审核 API 的敏感词

#### 4.2.3 feedbacks 表（投诉反馈与举报）
```prisma
model feedbacks {
  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id        String    @db.Uuid
  log_id         String?   @db.Uuid             // 关联的生成记录ID

  type           String    @db.VarChar(30)     // 'COMPLAINT', 'REPORT', 'SUGGESTION'
  content        String                        // 反馈内容

  status         Int?      @default(0) @db.SmallInt    // 0:待处理, 1:已处理
  admin_note     String?
  processed_time DateTime? @db.Timestamptz(6)
  created_time   DateTime? @default(now()) @db.Timestamptz(6)

  @@index([status], map: "idx_feedbacks_status")
}
```

**字段说明**：
- `type`: 反馈类型（COMPLAINT=投诉, REPORT=举报, SUGGESTION=建议）
- `status`: 处理状态（0=待处理, 1=已处理）

#### 4.2.4 admin_operation_logs 表（管理员操作审计）
```prisma
model admin_operation_logs {
  id           String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  admin_id     String    @db.Uuid
  action_type  String    @db.VarChar(50)     // 'BAN_USER', 'UNBAN_USER', 'PROCESS_FEEDBACK', etc.
  user_id      String?   @db.Uuid            // 操作目标用户ID（可选）
  audit_id     String?   @db.Uuid            // 操作目标审计日志ID（可选）
  detail       String?
  ip           String?   @db.VarChar(45)
  created_time DateTime? @default(now()) @db.Timestamptz(6)
}
```

**字段说明**：
- `action_type`: 操作类型（BAN_USER=封禁用户, UNBAN_USER=解封用户, PROCESS_FEEDBACK=处理反馈, etc.）
- `user_id`: 操作目标用户ID（当操作对象是用户时记录）
- `audit_id`: 操作目标审计日志ID（当操作对象是审计日志时记录）

#### 4.2.5 mail_histories 表（邮件生成历史记录）⭐ 新增
```prisma
model mail_histories {
  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id        String    @db.Uuid
  audit_log_id   String?   @db.Uuid             // 关联审计日志（合规溯源）

  // 表单输入内容
  scene          String?   @db.VarChar(50)     // 场景
  tone           String?   @db.VarChar(50)     // 语气
  recipient_name String?   @db.VarChar(100)    // 收件人姓名
  recipient_role String?   @db.VarChar(200)    // 收件人身份/职位
  sender_name    String?   @db.VarChar(100)    // 发件人姓名（可选）
  core_points    String?                       // 核心要点

  // AI 生成结果
  mail_content   String                        // 生成的邮件正文内容

  // 业务状态
  is_favorite    Boolean?  @default(false)    // 是否收藏
  is_deleted     Boolean?  @default(false)    // 是否删除（软删除）

  // 时间戳
  created_time   DateTime? @default(now()) @db.Timestamptz(6)
  updated_time   DateTime? @default(now()) @db.Timestamptz(6)

  @@index([created_time], map: "idx_mail_histories_created_time")
  @@index([user_id], map: "idx_mail_histories_user_id")
}
```

**字段说明**：
- `recipient_role`: 收件人身份/职位（如：销售总监、技术合作伙伴等）
- `sender_name`: 发件人姓名（可选字段）
- `is_favorite`: 用户是否收藏该邮件
- `is_deleted`: 软删除标记（用户侧已删除，后台仍可留存审计）

#### 4.2.6 环境变量配置说明 ⭐ 新增

系统运行依赖以下环境变量配置（需在 `.env` 文件中设置）：

```bash
# ========== 数据库配置 ==========
DATABASE_URL="postgresql://user:password@host:5432/fluentwj"

# ========== Redis配置 ==========
REDIS_URL="redis://host:6379"

# ========== DeepSeek AI 配置 ==========
DEEPSEEK_API_KEY="sk-xxx"                    # DeepSeek API密钥
DEEPSEEK_API_URL="https://api.deepseek.com/v1" # API地址
DEEPSEEK_MODEL="deepseek-chat"               # 模型名称
DEEPSEEK_TEMPERATURE="0.7"                   # 生成温度（0-1）
DEEPSEEK_MAX_TOKENS="2000"                   # 最大生成token数
DEEPSEEK_TIMEOUT="45000"                     # 请求超时时间（毫秒）

# ========== 阿里云内容审核配置 ==========
ALIYUN_ACCESS_KEY_ID="LTAI5xxx"             # 阿里云AccessKey ID
ALIYUN_ACCESS_KEY_SECRET="xxx"               # 阿里云AccessKey Secret
ALIYUN_MODERATION_ENDPOINT="https://green-cip.cn-shanghai.aliyuncs.com" # 内容审核端点
ALIYUN_MODERATION_TIMEOUT="10000"            # 审核超时时间（毫秒）

# ========== 华为云短信服务配置 ==========
SMS_ACCESS_KEY="xxx"                         # 华为云AccessKey
SMS_SECRET_KEY="xxx"                         # 华为云SecretKey
SMS_TEMPLATE_ID="xxx"                        # 短信模板ID
SMS_SIGN_NAME="FluentWJ"                     # 短信签名
SMS_ENDPOINT="https://smsapi.cn-north-4.myhuaweicloud.com" # 短信端点

# ========== JWT配置 ==========
JWT_SECRET="your-super-secret-jwt-key"       # JWT签名密钥（生产环境必须更换）
JWT_EXPIRES_IN="7d"                          # Token有效期

# ========== Next.js配置 ==========
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # 应用地址
NODE_ENV="development"                       # 运行环境（development/production）
```

**配置说明**：
- DeepSeek API：用于AI内容生成
- 阿里云内容审核：用于输入输出内容的安全审核
- 华为云短信：用于发送验证码
- Redis：用于存储验证码（5分钟过期）
- JWT：用于用户会话管理

---

## 5. 非功能性需求 (Non-functional Requirements)

### 5.1 合规性要求 (Regulatory Compliance)
1. **算法备案**：系统功能设计必须完全对应《互联网信息服务深度合成管理规定》
2. **数据本地化**：所有用户信息、生成日志必须存储在华为云广州机房，禁止跨境传输
3. **日志完整性**：修改数据库记录的操作需被严格限制，确保审计证据链闭环
4. **审计存留期**：审计日志物理存留期 ≥ 180 天

### 5.2 性能与稳定性
- **并发处理**：首屏渲染（LCP）时间 < 1.5s
- **生成时效**：DeepSeek API 采用流式（SSE）传输，用户端首字出现时间 < 2s
- **数据库优化**：
  - 使用复合索引优化查询性能
  - 分页查询避免全表扫描
  - 导出功能限制最大数据量（10,000条）

### 5.3 安全要求
- **认证授权**：
  - 所有API必须验证JWT Token有效性
  - 管理后台API必须验证管理员权限（role = 0）
  - 用户只能访问自己的历史记录
- **数据脱敏**：
  - 管理后台展示用户手机号需脱敏（中间4位星号）
  - 管理员账号完整显示（不脱敏）
- **操作审计**：
  - 所有管理员操作必须记录到 `admin_operation_logs` 表
  - 导出操作必须记录详细信息

---

## 6. API 接口总览 (API Endpoints)

### 6.1 认证模块 (`/api/auth`)

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/api/auth/send-code` | 发送短信验证码 | 无 |
| POST | `/api/auth/login` | 登录（验证码/密码） | 无 |
| POST | `/api/auth/set-password` | 设置密码（首次登录） | 已登录 |
| POST | `/api/auth/update-password` | 修改密码 | 已登录 |
| POST | `/api/auth/reset-password` | 重置密码（忘记密码） | 无 |
| GET | `/api/auth/me` | 获取当前用户信息 | 已登录 |
| POST | `/api/auth/logout` | 登出 | 已登录 |

### 6.2 AI 生成模块 (`/api/generate`) ⭐ 新增

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| POST | `/api/generate` | AI 邮件生成接口 | 已登录 |

**请求参数**：
```json
{
  "scenario": "email",           // 业务场景: email/report/proposal/notice
  "tone": "formal",              // 语气: formal/friendly/urgent/humorous
  "language": "zh-CN",           // 语言: zh-CN/en-US/zh-TW/ja-JP/ko-KR
  "recipientName": "张三",       // 收件人姓名 (必填, 1-100字符)
  "recipientRole": "销售总监",   // 收件人身份 (必填, 1-200字符)
  "senderName": "李四",          // 发件人姓名 (可选, 最多50字符)
  "keyPoints": "核心要点内容"    // 核心要点 (必填, 1-2000字符)
}
```

**响应格式**：
```json
{
  "success": true,
  "data": {
    "content": "AI生成的邮件内容",
    "auditLogId": "uuid"         // 审计日志ID，用于溯源
  }
}
```

**错误码**：
- `AUTH_EXPIRED`: 登录已过期
- `ACCOUNT_BANNED`: 账户已被封禁
- `VALIDATION_ERROR`: 参数校验失败
- `MODERATION_FAILED`: 内容审核失败
- `AI_GENERATION_FAILED`: AI生成失败

### 6.3 历史记录模块 (`/api/history`)

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/history` | 获取历史记录列表 | 已登录 |
| GET | `/api/history/:id` | 获取历史记录详情 | 已登录 |
| POST | `/api/history/search` | 搜索历史记录 | 已登录 |
| PUT | `/api/history/:id/favorite` | 切换收藏状态 | 已登录 |
| DELETE | `/api/history/:id` | 删除历史记录 | 已登录 |

### 6.4 管理后台 - 用户管理 (`/api/admin/users`)

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/admin/users` | 获取用户列表 | 管理员 |
| POST | `/api/admin/users` | 创建新用户 | 管理员 |
| PUT | `/api/admin/users/:id/status` | 更新用户状态 | 管理员 |
| GET | `/api/admin/users/export` | 导出用户数据 | 管理员 |

### 6.5 管理后台 - 审计日志 (`/api/admin/audit-logs`)

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/admin/audit-logs` | 获取审计日志列表 | 管理员 |
| GET | `/api/admin/audit-logs/:id` | 获取审计日志详情 | 管理员 |
| GET | `/api/admin/audit-logs/export` | 导出审计日志 | 管理员 |
| POST | `/api/admin/audit-logs/:id/mark-violation` | 标记违规 | 管理员 |
| POST | `/api/admin/audit-logs/:id/mark-passed` | 标记通过 | 管理员 |

### 6.6 管理后台 - 反馈管理 (`/api/admin/feedbacks`)

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/admin/feedbacks` | 获取反馈列表 | 管理员 |
| GET | `/api/admin/feedbacks/:id` | 获取反馈详情 | 管理员 |
| POST | `/api/admin/feedbacks/:id/process` | 处理反馈 | 管理员 |
| GET | `/api/admin/feedbacks/export` | 导出反馈数据 | 管理员 |

### 6.7 管理后台 - 操作日志 (`/api/admin/operation-logs`)

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/admin/operation-logs` | 获取操作日志列表 | 管理员 |
| GET | `/api/admin/operation-logs/export` | 导出操作日志 | 管理员 |

### 6.8 管理后台 - Dashboard (`/api/admin/dashboard`)

| 方法 | 路径 | 描述 | 权限 |
|------|------|------|------|
| GET | `/api/admin/dashboard` | 获取Dashboard统计数据 | 管理员 |

---

## 7. 前端页面总览 (Frontend Pages)

### 7.1 公共页面

| 路径 | 页面 | 状态 | 说明 |
|------|------|------|------|
| `/` | 落地页 | ✅ 已实现 | 企业落地页，展示产品核心能力 |
| `/login` | 登录页 | ✅ 已实现 | 验证码/密码双模式登录 |
| `/forgot-password` | 忘记密码 | ✅ 已实现 | 通过验证码重置密码 |
| `/set-password` | 设置密码 | ✅ 已实现 | 首次登录后强制设置密码 |

### 7.2 Dashboard 页面

| 路径 | 页面 | 状态 | 说明 |
|------|------|------|------|
| `/dashboard` | 撰写页 | ✅ 已实现 | AI 撰写表单 + 结果展示 |
| `/dashboard/history` | 历史记录页 | ✅ 已实现 | 历史记录列表 + 详情 + 搜索 + 筛选 + 收藏 + 删除 |

### 7.3 管理后台页面

| 路径 | 页面 | 状态 | 说明 |
|------|------|------|------|
| `/admin` | Dashboard | ✅ 已实现 | 统计卡片 + 用户增长趋势 + 最新用户 |
| `/admin/login` | 管理员登录 | ✅ 已实现 | 密码登录（验证码模式待开发） |
| `/admin/users` | 用户管理 | ✅ 已实现 | 用户列表 + 搜索 + 筛选 + 创建 + 状态更新 + 导出 |
| `/admin/audit` | 审计日志 | ✅ 已实现 | 审计日志列表 + 详情 + 搜索 + 筛选 + 导出 + 标记违规/通过 |
| `/admin/feedback` | 反馈管理 | ✅ 已实现 | 反馈列表 + 详情 + 处理 + 导出 |
| `/admin/operation-logs` | 操作日志 | ✅ 已实现 | 操作日志列表 + 搜索 + 筛选 + 导出 |

---

## 8. 实施路线图 (Roadmap & Milestones)

### 已完成功能 ✅
- [x] Phase 1: 环境搭建、数据库建模、手机号登录系统
- [x] Phase 2: 企业落地页、认证体系、管理后台基础架构
- [x] Phase 3: Dashboard 撰写页面（前端UI）、历史记录管理（完整CRUD）
- [x] Phase 4: 管理后台完整功能（用户管理、审计日志、反馈管理、操作日志、Dashboard统计）
- [x] Phase 5: AI 生成核心逻辑（接入 DeepSeek API、阿里云内容审核、零宽水印植入）

### 待完成功能 🚧
- [ ] Phase 6: 数据导出优化、性能调优、安全加固
- [ ] Phase 7: 内部验收、部署至华为云生产环境、启动算法备案流程

### 未来规划 🔮
- [ ] Phase 8: 上下文回复功能（基于邮件往来历史）
- [ ] Phase 9: 付费闭环（订阅制、按量计费）
- [ ] Phase 10: 移动端适配、国际化（多语言支持）
- [ ] Phase 11: A/B测试、数据驱动优化

---

## 9. 附录 (Appendix)

### 9.1 数据字典

#### 审核状态 (audit_logs.status)
| 值 | 含义 | 前端显示 | 说明 |
|----|------|---------|------|
| 0 | 审核拦截 | "违规拦截" | 后台手动标记违规 |
| 1 | 通过 | "通过" | 审核通过 |
| 2 | 系统拦截 | "系统拦截" | AI自动拦截 |

#### 用户角色 (users.role)
| 值 | 含义 | 前端显示 |
|----|------|---------|
| 0 | 管理员 | "管理员" |
| 1 | 普通用户 | "普通用户" |

#### 用户状态 (users.status)
| 值 | 含义 | 前端显示 |
|----|------|---------|
| 0 | 封禁 | "已封禁" |
| 1 | 正常 | "正常" |

#### 反馈类型 (feedbacks.type)
| 值 | 含义 | 前端显示 |
|----|------|---------|
| COMPLAINT | 投诉 | "投诉" |
| REPORT | 举报 | "举报" |
| SUGGESTION | 建议 | "建议" |

#### 反馈状态 (feedbacks.status)
| 值 | 含义 | 前端显示 |
|----|------|---------|
| 0 | 待处理 | "待处理" |
| 1 | 已处理 | "已处理" |

#### 操作类型 (admin_operation_logs.action_type)
| 值 | 含义 |
|----|------|
| BAN_USER | 封禁用户 |
| UNBAN_USER | 解封用户 |
| CREATE_USER | 创建用户 |
| UPDATE_USER | 修改用户 |
| DELETE_USER | 删除用户 |
| PROCESS_FEEDBACK | 处理反馈 |
| MARK_VIOLATION | 标记违规 |
| MARK_PASSED | 标记通过 |
| EXPORT_USERS | 导出用户数据 |
| EXPORT_AUDIT_LOGS | 导出审计日志 |
| EXPORT_FEEDBACKS | 导出反馈数据 |
| EXPORT_OPERATION_LOGS | 导出操作日志 |

### 9.2 设计规范

#### 颜色系统
- 主色：`#0052D9` (primary)
- 背景色（浅色）：`#f5f6f8`
- 背景色（深色）：`#0f1723`
- 文字颜色（浅色）：`#0c121d`
- 文字颜色（深色）：`white`
- 辅助色：`#4568a1` (secondary)
- 成功色：`#10B981` (green)
- 危险色：`#EF4444` (red)

#### 字体系统
- 主字体：Inter
- 中文字体：Noto Sans SC
- 图标字体：Material Symbols Outlined

#### 响应式断点
- 移动端（<768px）：单列布局
- 平板端（768px-1024px）：调整间距和字体大小
- 桌面端（>1024px）：完整双列布局

---

## 10. 开发协议 (Workflow Protocol)

### 10.1 规范驱动开发 (SDD)
1. **第一阶段：需求对齐与 Specs 生成**
   - 输入：用户描述的功能核心需求
   - 动作：生成/更新 `docs/specs/` 下的 Markdown 文档
   - 标准：Specs 必须包含：功能描述、功能逻辑、接口定义、涉及的DB变更、异常情况处理

2. **第二阶段：开发计划分解**
   - 动作：基于已确认的 Specs，列出详细的 Checklist
   - 顺序：必须遵循：修改数据库(Prisma) → 基础设施(Lib) → 业务逻辑(Service) → 接口(API) → UI(Components)

3. **第三阶段：规范化代码实现**
   - 动作：严格按计划编写代码
   - 家法：
     - 每个文件头部必须标注：`Spec: /docs/specs/xxx.md`
     - 核心业务必须放在 `services/` 层，禁止在 API Route 中写逻辑
     - 必须从 Request Header 提取真实的 `user_ip` 进行合规审计

4. **第四阶段：智能文档维护**
   - 触发条件：任何代码修改（由AI自动分析）
   - 动作：AI自动分析代码修改的内容、范围和影响程度
   - 判断标准：
     - 重大功能更改：新功能、核心逻辑重构、架构调整
     - 中等更改：功能增强、接口调整、非核心逻辑修改
     - 轻微更改：样式调整、小bug修复、文档注释更新
   - 决策流程：
     - AI判断为重大/中等更改：自动询问用户是否需要更新相关文档
     - AI判断为轻微更改：默认不更新文档，但可手动触发

### 10.2 Coding Standards
- **Strict Typing**: 严禁使用 `any`。必须在 `types/` 目录或 Service 内部定义接口。
- **Error Handling**: 统一使用全局错误处理机制。Service 层应抛出业务异常，由 API 层捕获并返回格式化的 JSON。
- **Naming**:
  - 数据库字段名使用 camelCase (Prisma 侧)
  - Service 函数命名应具有描述性（例：`generateMailWithAudit` 而非 `genMail`）
- **Security**:
  - 必须从请求头获取真实的 `user_ip`
  - 所有输入必须经过 `moderationService` 审核

### 10.3 Traceability Map
- 用户权限 → `services/userService.ts`
- 内容安全 → `services/audit.service.ts` & `utils/watermark.ts`
- AI 核心 → `services/aiService.ts`（待实现）
- 历史记录 → `services/historyService.ts`

---

**批准人**：[Your Name]
**日期**：2026-01-19
**文档维护**：如有重大功能变更或需求调整，请及时更新本PRD文档。

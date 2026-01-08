[PRD] FluentWJ 跨境商务写作助手项目需求文档
文档版本：v1.1 (Build 20250107)
产品状态：Draft / MVP Development
项目负责人：[Your Name]
核心目标：合规性准入（算法备案） + 跨境 B 端外包展示 + C 端付费闭环

1. 项目综述 (Executive Summary)
1.1 产品定义
FluentWJ 是一款针对跨境电商及外贸行业设计的智能商务写作工具。产品基于国内已备案大模型（DeepSeek-V3），提供结构化撰写、智能回复及多语言润色功能，并内置符合中国监管要求的“内容安全与溯源审计系统”。
1.2 商业价值
● 合规资产：通过网信办“深度合成服务算法备案”，获得 AI 业务合规身份。
● 技术溢价：展示企业在 AI 垂直场景的应用能力，辅助承接南沙及大湾区企业软件外包业务。
● 生产力工具：解决外贸人员在多语言环境下的表达痛点，提升回复时效。

2. 角色与权限 (Roles & Permissions)
角色	SQL映射 (role)	定义	核心权限
访客	-	未注册/未登录用户	仅可浏览首页、查看产品介绍、访问登录页面。
注册用户	1	已完成手机号验证的用户	使用 AI 撰写、回复邮件；查看个人生成历史；反馈违规内容。
管理员	0	公司内部管理人员	访问 /admin 后台；查阅审计日志；执行用户封禁；管理投诉。

3. 功能需求 (Functional Requirements)
3.1 账号体系 (Identity & Access Management)
● [REQ-01] 手机号实名登录：
  ○ 集成国内主流 SMS 接口（华为云）。
  ○ 流程：输入手机号 -> 发送验证码（60s冷却）-> 验证登录。
  ○ 合规性：后端必须持久化手机号与 UID 的关联关系，作为实名审计基础。
● [REQ-02] 用户状态管理：
  ○ 系统需支持 NORMAL（正常）和 BANNED（封禁）状态。封禁用户调用 API 时返回 403 错误。
3.2 AI 写作核心逻辑 (AI Composition Engine)
● [REQ-03] 结构化撰写 (Structured Input)：
  ○ 用户需通过预设表单输入：发件人、收件人、场景（Dropdown）、核心要点（Textarea）、语气 (Tone)。
  ○ 禁止对话框：前端不提供自由对话（Chat）接口，规避舆论属性风险。
● [REQ-04] 上下文回复 (Contextual Reply)：
  ○ 支持“原文引用”功能。系统提取原文关键信息，结合用户意图（同意/拒绝/议价）生成针对性回复。
3.3 内容安全防火墙 (Security & Moderation) - P0 优先级
● [REQ-05] 穿透式审计记录：
  ○ 每次生成行为必须向 audit_logs 写入：user_ip（客户端真实IP）、user_phone（冗余记录）、input_prompt、output_content。
● [REQ-06] 内容风险标记：
  ○ 敏感词命中：若触发外部审核（华为云/阿里云），需在 is_sensitive 标记为 TRUE，并保存外部请求 ID external_audit_id 以便溯源。
● [REQ-07] 溯源水印 (Traceability)：
  ○ 生成结果需包含：
    ■ 显式声明：“由 GlobalMail AI 算法辅助生成”。
    ■ 隐式溯源：使用 audit_token 字段生成的零宽字符隐式嵌入文本。

4. 管理后台需求 (Admin Dashboard)
4.1 审计日志模块 (Compliance Audit)
● [REQ-08] 全链路存证列表：
  ○ 字段要求：时间戳、用户 UID（手机号）、访问 IP、输入原文、AI 输出文本、安全审核状态。
  ○ 搜索功能：支持按手机号精确查询。
  ○ 存留期：系统需确保数据物理存留期 ≥ 180 天。
4.2 处置中心 (Disposal Center)
● [REQ-08] 用户封禁逻辑：管理员可在后台列表一键更改用户状态，立即阻断其 API 访问。
● [REQ-10] 投诉管理：展示前端用户反馈的“内容不当”记录，支持处理状态标记。
● 用户可针对某一笔生成的邮件发起举报。系统需在 feedbacks 表中关联 log_i
4.3 管理员行为审计 (Admin Operation Audit)
● 操作留痕：管理员在执行“封禁用户”、“删除违规记录”等操作时，系统必须自动记录至 admin_operation_logs，包含 action_type、操作原因 detail 及操作人 IP
● d

5. 数据架构与技术选型 (Technical Specification)
5.1 技术栈 (Tech Stack)
● Framework: Next.js 15 (App Router)
● ORM: Prisma
● Database: PostgreSQL (Docker-based)
● Auth: NextAuth.js
● Styling: Tailwind CSS + Shadcn/UI
● Infrastructure: 华为云 Flexus X 实例 (Ubuntu 24.04)
5.2 数据库 Schema 概览 (Entity Relationship)
model User {
  id              String    @id @default(uuid())
  phone           String    @unique
  passwordHash    String    @map("password_hash")
  role            Int       @default(1) // 0:Admin, 1:User
  status          Int       @default(1) // 0:Banned, 1:Normal
  lastLoginIp     String?   @map("last_login_ip")
  lastLoginTime   DateTime? @map("last_login_time")
  createdTime     DateTime  @default(now()) @map("created_time")
  updatedTime     DateTime  @updatedAt @map("updated_time")

  auditLogs       AuditLog[]
  feedbacks       Feedback[]
  adminLogs       AdminOpLog[] @relation("AdminToLog")

  @@map("users")
}

model AuditLog {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  userPhone       String?  @map("user_phone")
  userIp          String   @map("user_ip")
  scene           String?
  tone            String?
  inputPrompt     String   @map("input_prompt") @db.Text
  outputContent   String   @map("output_content") @db.Text
  modelName       String?  @map("model_name")
  auditToken      String?  @map("audit_token")
  status          Int      @default(1) // 1:Pass, 2:Block
  isSensitive     Boolean  @default(false) @map("is_sensitive")
  externalAuditId String?  @map("external_audit_id")
  createdTime     DateTime @default(now()) @map("created_time")

  user            User     @relation(fields: [userId], references: [id])
  feedbacks       Feedback[]

  @@map("audit_logs")
}

model Feedback {
  id            String    @id @default(uuid())
  userId        String    @map("user_id")
  logId         String?   @map("log_id")
  type          String    // COMPLAINT, REPORT, SUGGESTION
  content       String    @db.Text
  status        Int       @default(0) // 0:Pending, 1:Done
  adminNote     String?   @map("admin_note") @db.Text
  processedTime DateTime? @map("processed_time")
  createdTime   DateTime  @default(now()) @map("created_time")

  user          User      @relation(fields: [userId], references: [id])
  auditLog      AuditLog? @relation(fields: [logId], references: [id])

  @@map("feedbacks")
}

model AdminOpLog {
  id          String   @id @default(uuid())
  adminId     String   @map("admin_id")
  actionType  String   @map("action_type")
  targetId    String?  @map("target_id")
  detail      String?  @db.Text
  ip          String?
  createdTime DateTime @default(now()) @map("created_time")

  admin       User     @relation("AdminToLog", fields: [adminId], references: [id])

  @@map("admin_operation_logs")
}

6. 非功能性需求 (Non-functional Requirements)
6.1 合规性要求 (Regulatory Compliance)
1. 算法备案：系统功能设计必须完全对应《互联网信息服务深度合成管理规定》。
2. 数据本地化：所有用户信息、生成日志必须存储在华为云广州机房，禁止跨境传输。
3. 日志完整性：修改数据库记录的操作需被严格限制，确保审计证据链闭环。
6.2 性能与稳定性
● 并发处理：首屏渲染（LCP）时间 < 1.5s。
● 生成时效：DeepSeek API 采用流式（SSE）传输，用户端首字出现时间 < 2s。

7. 实施路线图 (Roadmap & Milestones)
● T+1W (Phase 1): 环境搭建、数据库建模、手机号登录系统。
● T+2W (Phase 2): AI 生成逻辑开发、双向内容审核集成、水印植入。
● T+3W (Phase 3): 管理后台（审计日志、用户管理）交付。
● T+4W (Phase 4): 内部验收、部署至华为云生产环境、启动算法备案流程。

8. 指导 Cursor 开发的核心 Prompt (Vibe-Coding Instructions)
指令 A (系统初始化)：
"Act as a Senior Full-stack Engineer. Initialize a Next.js 15 project with Prisma and Shadcn/UI. Use the database schema defined in the PRD. Ensure all logs are saved to PostgreSQL."
指令 B (合规流实现)：
"Implement the POST /api/generate route. Logic: 1. Verify Session. 2. Call Huawei Cloud Moderation API to check input. 3. If pass, call DeepSeek-V3. 4. Append visible watermark and inject zero-width invisible watermark using the AuditLog ID. 5. Save everything to AuditLog table before returning."
指令 C (后台管理)：
"Create an admin-only route group /(admin). Use Shadcn/UI table to display AuditLog records. Must include pagination and search-by-phone functionality for regulatory audit purposes."

批准人：[Your Name]
日期：2024/10/27
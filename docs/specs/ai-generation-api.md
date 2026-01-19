# AI 邮件生成 API 规范

## Spec 概述

本规范描述 FluentWJ 的核心功能：AI 邮件生成接口的完整实现逻辑。

**文档版本**: v1.0  
**创建日期**: 2025-01-19  
**相关文件**:
- `app/api/generate/route.ts` - HTTP API 接口
- `services/aiService.ts` - 业务逻辑层
- `lib/deepseek.ts` - DeepSeek API 封装
- `lib/moderation.ts` - 阿里云内容审核
- `utils/watermark.ts` - 水印生成工具

---

## 功能描述

用户通过结构化表单输入业务场景、语气、收件人信息和核心要点，系统调用 DeepSeek-V3 生成专业的商务邮件内容，并进行全链路的内容安全审核和溯源水印植入。

**核心特性**：
1. 结构化输入（禁止自由对话，规避舆论属性风险）
2. 双重内容审核（用户输入 + AI 输出）
3. 穿透式审计记录（符合算法备案要求）
4. 显式 + 隐式水印（满足深度合成管理规定）
5. 非流式生成（确保"先审后发"合规流程）

---

## 接口定义

### 请求接口

**端点**: `POST /api/generate`

**请求头**:
```
Content-Type: application/json
Cookie: auth_token=<JWT_TOKEN>
```

**请求体**:
```typescript
{
  scenario: string;        // 业务场景：email | report | proposal | notice
  tone: string;            // 语气：formal | friendly | urgent | humorous
  language: string;        // 语言：zh-CN | en-US | zh-TW | ja-JP | ko-KR
  recipientName: string;   // 收件人姓名
  recipientRole: string;   // 收件人身份/职位
  senderName?: string;     // 发件人姓名（可选）
  keyPoints: string;       // 核心要点（多行文本）
}
```

**参数说明**:

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| scenario | string | 是 | 业务场景 | "email" |
| tone | string | 是 | 语气风格 | "formal" |
| language | string | 是 | 目标语言 | "zh-CN" |
| recipientName | string | 是 | 收件人姓名 | "张先生" |
| recipientRole | string | 是 | 收件人职位/背景 | "采购总监" |
| senderName | string | 否 | 发件人姓名，用于邮件签名 | "李明" |
| keyPoints | string | 是 | 核心要点，最多 2000 字符 | "询问产品报价\n希望建立长期合作" |

---

### 响应接口

**成功响应** (200):
```typescript
{
  success: true;
  data: {
    content: string;       // 生成的邮件内容（含水印）
    auditLogId: string;    // 审计日志 ID（用于溯源）
  }
}
```

**错误响应**:
```typescript
{
  success: false;
  error: {
    code: string;          // 错误码
    message: string;       // 用户友好的错误提示
    details?: {            // 可选：详细信息
      field?: string;      // 违规字段
      reason?: string;     // 具体原因
    }
  }
}
```

---

## 功能逻辑

### 完整流程图

```
用户提交表单
    ↓
① 验证 Session（JWT Token）
    ↓
② 检查用户状态（是否被封禁）
    ↓
③ 提取真实 IP（从 Request Header）
    ↓
④ 调用阿里云审核用户输入
    ├─ 通过 → 继续
    └─ 拒绝 → 返回 400 错误
    ↓
⑤ 调用 DeepSeek-V3 生成内容
    ↓
⑥ 生成 auditToken（UUID）
    ↓
⑦ 植入水印（显式声明 + 零宽字符）
    ↓
⑧ 使用 Prisma 事务写入数据库
    ├─ audit_logs（审计日志）
    └─ mail_histories（用户历史）
    ↓
⑨ 返回生成结果
```

### 详细步骤说明

#### 步骤 ①：验证 Session

```typescript
// 调用 utils/auth.ts 的 authenticateRequest()
const user = await authenticateRequest(request);
// 返回：{ userId, phone, role }
```

**失败处理**：
- Token 无效/过期 → 返回 401 错误

#### 步骤 ②：检查用户状态

```typescript
// 查询数据库检查用户状态
const dbUser = await prisma.users.findUnique({
  where: { id: user.userId },
  select: { status: true }
});

if (dbUser.status === 0) {
  throw new ForbiddenError('账号已被封禁');
}
```

**失败处理**：
- 用户被封禁 → 返回 403 错误

#### 步骤 ③：提取真实 IP

```typescript
// 调用 utils/request.ts 的 getClientIP()
const clientIp = getClientIP(request);
// 优先读取 x-forwarded-for，其次 x-real-ip
```

#### 步骤 ④：内容审核（用户输入）

```typescript
// 调用 lib/moderation.ts 的 moderateContent()
const inputText = `${recipientName} ${recipientRole} ${keyPoints}`;
const moderationResult = await moderateContent(inputText);

if (!moderationResult.pass) {
  // 记录审计日志（标记为系统拦截）
  await prisma.audit_logs.create({
    data: {
      user_id: user.userId,
      user_phone: user.phone,
      user_ip: clientIp,
      scene: scenario,
      tone: tone,
      input_prompt: keyPoints,
      output_content: '',
      model_name: 'DeepSeek-V3',
      status: 2, // 系统拦截
      is_sensitive: true,
      external_audit_id: moderationResult.externalAuditId
    }
  });
  
  throw new ValidationError('您输入的内容包含敏感信息，请修改后重试');
}
```

**失败处理**：
- 审核不通过 → 返回 400 错误 + 具体原因

#### 步骤 ⑤：调用 DeepSeek 生成

```typescript
// 构建 Prompt
const prompt = buildPrompt({
  scenario,
  tone,
  language,
  recipientName,
  recipientRole,
  keyPoints
});

// 调用 lib/deepseek.ts 的 callDeepSeek()
const generatedContent = await callDeepSeek(prompt);
```

**失败处理**：
- API 调用失败 → 自动重试 3 次
- 重试后仍失败 → 返回 500 错误

#### 步骤 ⑥：生成 auditToken

```typescript
// 使用 crypto.randomUUID() 生成唯一标识
const auditToken = crypto.randomUUID();
```

#### 步骤 ⑦：植入水印

```typescript
// 调用 utils/watermark.ts 的 addWatermark()
const contentWithWatermark = addWatermark(generatedContent, auditToken);
```

#### 步骤 ⑧：数据库事务写入

```typescript
// 使用 Prisma 事务确保数据一致性
const result = await prisma.$transaction(async (tx) => {
  // 写入审计日志
  const auditLog = await tx.audit_logs.create({
    data: {
      user_id: user.userId,
      user_phone: user.phone,
      user_ip: clientIp,
      scene: scenario,
      tone: tone,
      input_prompt: keyPoints,
      output_content: contentWithWatermark,
      model_name: 'DeepSeek-V3',
      audit_token: auditToken,
      status: 1, // 审核通过
      is_sensitive: false
    }
  });

  // 写入用户历史
  await tx.mail_histories.create({
    data: {
      user_id: user.userId,
      audit_log_id: auditLog.id,
      scene: scenario,
      tone: tone,
      recipient_name: recipientName,
      sender_name: '', // 可选
      core_points: keyPoints,
      mail_content: contentWithWatermark
    }
  });

  return auditLog;
});
```

**失败处理**：
- 事务回滚 → 返回 500 错误

#### 步骤 ⑨：返回结果

```typescript
return {
  success: true,
  data: {
    content: contentWithWatermark,
    auditLogId: result.id
  }
};
```

---

## 异常处理

### 1. Session 失效 (401)

**HTTP 状态码**: 401  
**错误码**: `AUTH_EXPIRED`

**返回结构**:
```json
{
  "success": false,
  "error": {
    "code": "AUTH_EXPIRED",
    "message": "您的登录状态已失效，请重新登录后继续使用。"
  }
}
```

**前端处理**:
- 显示 Toast 提示
- 3 秒后自动跳转到登录页 (`/login`)

---

### 2. 用户被封禁 (403)

**HTTP 状态码**: 403  
**错误码**: `ACCOUNT_BANNED`

**返回结构**:
```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_BANNED",
    "message": "您的账号因违反服务条款已被暂停使用，如有疑问请联系客服。"
  }
}
```

**前端处理**:
- 显示 Modal 弹窗（不可关闭）
- 提供客服联系方式（电话/邮箱）

---

### 3. 内容违规 (400)

**HTTP 状态码**: 400  
**错误码**: `CONTENT_VIOLATION`

**返回结构**:
```json
{
  "success": false,
  "error": {
    "code": "CONTENT_VIOLATION",
    "message": "您输入的内容包含敏感信息，请修改后重试",
    "details": {
      "field": "keyPoints",
      "reason": "检测到政治敏感词汇"
    }
  }
}
```

**前端处理**:
- 高亮违规的表单字段（红色边框）
- 在字段下方显示具体原因
- 不自动清空用户输入（方便修改）

---

### 4. AI 服务失败 (500)

**HTTP 状态码**: 500  
**错误码**: `AI_SERVICE_ERROR`

**返回结构**:
```json
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "AI 生成服务暂时不可用，请稍后重试或联系技术支持。"
  }
}
```

**前端处理**:
- 显示错误 Toast
- 显示"重试"按钮
- 自动重试机制（最多 3 次，间隔 2 秒）
- 提供"联系技术支持"按钮

---

### 5. 数据库写入失败 (500)

**HTTP 状态码**: 500  
**错误码**: `DATABASE_ERROR`

**返回结构**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "数据保存失败，请稍后再试。如果问题持续出现，请联系技术支持。"
  }
}
```

**前端处理**:
- 显示错误 Toast
- 提供"重试"按钮
- 如果重试 3 次仍失败，提示联系技术支持

---

## 涉及的 DB 变更

### audit_logs 表（审计日志）

**说明**：记录每次 AI 生成的完整链路，用于监管审计。

**写入字段**:
```typescript
{
  id: string;              // UUID（自动生成）
  user_id: string;         // 用户 ID
  user_phone: string;      // 手机号（冗余，方便查询）
  user_ip: string;         // 真实 IP
  scene: string;           // 业务场景
  tone: string;            // 语气
  input_prompt: string;    // 用户输入（核心要点）
  output_content: string;  // AI 输出（含水印）
  model_name: string;      // 模型名称（DeepSeek-V3）
  audit_token: string;     // 溯源标识（UUID）
  status: number;          // 1=通过, 2=系统拦截, 0=人工拦截
  is_sensitive: boolean;   // 是否敏感内容
  external_audit_id: string; // 阿里云审核 ID（可选）
  created_time: Date;      // 创建时间
}
```

---

### mail_histories 表（用户历史）

**说明**：保存用户的邮件生成历史，用于历史记录页面展示。

**写入字段**:
```typescript
{
  id: string;              // UUID（自动生成）
  user_id: string;         // 用户 ID
  audit_log_id: string;    // 关联的审计日志 ID
  scene: string;           // 业务场景
  tone: string;            // 语气
  recipient_name: string;  // 收件人姓名
  sender_name: string;     // 发件人姓名（可选）
  core_points: string;     // 核心要点
  mail_content: string;    // 生成的邮件内容
  is_favorite: boolean;    // 是否收藏（默认 false）
  is_deleted: boolean;     // 是否删除（默认 false）
  created_time: Date;      // 创建时间
  updated_time: Date;      // 更新时间
}
```

---

## 技术选型

### 内容审核

**服务商**: 阿里云内容安全  
**API 版本**: 2022-03-02  
**审核类型**: textModeration（文本反垃圾）  
**SDK**: `@alicloud/pop-core`

**审核维度**:
- 违禁内容（暴恐、色情、赌博）
- 敏感词（政治敏感、人身攻击）
- 垃圾广告

---

### AI 模型

**服务商**: DeepSeek  
**模型版本**: DeepSeek-V3  
**API 地址**: `https://api.deepseek.com/v1/chat/completions`

**调用方式**:
- 请求方式：POST
- 内容格式：JSON
- 认证方式：Bearer Token

---

### 生成模式

**选择**: 非流式（Non-Streaming）

**原因**:
1. 确保"先审后发"流程，符合算法备案要求
2. 可以在返回前对 AI 输出进行完整审核
3. 避免违规内容已被用户看到的风险

**未来规划**:
- 在算法备案通过后，可考虑流式输出（需与监管部门确认）
- 需实现实时内容截断机制

---

## 前端体验优化

### 加载状态

**文案**: "AI 正在为您生成专业内容，预计需要 10-30 秒..."

**视觉**:
- 显示 Loading 动画（旋转图标）
- 禁用"立即生成"按钮
- 显示"取消生成"按钮

### 超时控制

**超时时间**: 45 秒

**超时处理**:
- 自动取消请求（使用 `AbortController`）
- 显示错误提示："生成超时，请重试"
- 提供"重试"按钮

### 取消功能

**实现方式**:
```typescript
const abortController = new AbortController();

fetch('/api/generate', {
  signal: abortController.signal,
  // ...
});

// 用户点击"取消"按钮
abortController.abort();
```

---

## 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 平均响应时间 | 10-20 秒 | 包含审核 + 生成 + 数据库写入 |
| 超时时间 | 45 秒 | 超过自动取消 |
| 首字出现时间 | N/A | 非流式模式不适用 |
| 并发支持 | 100 QPS | 单实例性能 |

---

## 安全与合规

### 合规性检查清单

- [x] 每次生成都写入 `audit_logs`（穿透式审计）
- [x] 记录真实 IP（从 Request Header 提取）
- [x] 用户输入经过内容审核
- [x] 内容包含显式水印声明
- [x] 内容包含隐式溯源标识（零宽字符）
- [x] 敏感内容被正确标记（`is_sensitive = true`）
- [x] 审核失败时阻止生成并返回友好提示

### 数据留存

**存留期**: ≥ 180 天（监管要求）

**实现方式**:
- 数据库记录不允许物理删除
- 定期归档到冷存储（超过 1 年的数据）

---

## 后续扩展

1. **流式输出**（V2.0）：需与监管部门确认可行性
2. **多语言支持**：扩展更多语言（法语、德语、西班牙语）
3. **上下文回复**：支持"原文引用"功能
4. **智能推荐**：根据历史记录推荐常用场景
5. **A/B 测试**：对比不同 Prompt 模板的生成效果

---

## 验收标准

- [x] 接口定义清晰，包含完整的 Input/Output
- [x] 异常处理完善，覆盖所有错误场景
- [x] 数据库变更明确，字段说明详细
- [x] 技术选型合理，符合合规要求
- [x] 性能指标量化，可衡量
- [x] 安全与合规清单完整

---

**文档维护**：本规范与代码实现保持同步，如有变更需及时更新。

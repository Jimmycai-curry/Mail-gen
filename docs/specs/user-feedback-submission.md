# 用户反馈提交功能规范

## Spec 概述
本规范描述 FluentWJ 用户在生成内容后提交反馈的功能，包括建议、内容举报和自定义反馈三种类型。用户可以对生成的内容进行反馈，帮助改进 AI 生成质量和内容合规性。

**文档版本**: v1.0  
**创建日期**: 2026-01-19  
**相关 PRD**: `/docs/prd/[PRD] FluentWJ 跨境商务写作助手项目需求文档.md`  
**相关 Spec**: `/docs/specs/dashboard-writing-page.md`  
**实施方式**: 规范驱动开发 (SDD)

---

## 功能描述

### 1. 反馈类型

用户可以对生成的内容提交三种类型的反馈：

**建议（SUGGESTION）**：
- 用途：用户认为生成结果还不错，但有改进空间
- 场景：语气不够准确、格式需要调整、措辞可以更优化等
- 图标：Lightbulb（灯泡）

**内容举报（REPORT）**：
- 用途：用户发现生成内容存在严重问题
- 场景：包含不当内容、事实错误、敏感信息、违规内容等
- 图标：Flag（旗帜）

**用户反馈（CUSTOM）**：
- 用途：用户的自定义反馈，不限于以上两种类型
- 场景：功能建议、使用体验、bug 报告等
- 图标：MessageSquare（消息框）

---

### 2. 交互流程

```
用户生成内容
  ↓
查看生成结果
  ↓
点击反馈按钮（建议/举报/反馈）
  ↓
弹出输入框
  ↓
填写反馈内容（1-500字符）
  ↓
点击提交
  ↓
验证身份 & 参数校验
  ↓
写入 feedbacks 数据库
  ↓
显示成功提示（Toast）
  ↓
按钮图标变为 Check（已完成）
```

---

### 3. 核心功能

#### 3.1 反馈输入弹窗

**UI 特性**：
- 毛玻璃背景效果（`backdrop-blur-md`）
- 弹窗居中显示（最大宽度 512px）
- 圆角卡片设计（`rounded-xl`）
- 深色模式适配

**交互特性**：
- Textarea 输入框，支持换行
- 实时字符计数（0/500）
- 字符限制：1-500 字符
- 点击背景或按 ESC 键关闭
- 底部操作按钮：取消 / 提交

**标题和占位符**：
| 反馈类型 | 弹窗标题 | 输入框占位符 |
|---------|---------|-------------|
| SUGGESTION | 提交建议 | 请告诉我们您的改进建议... |
| REPORT | 内容举报 | 请描述内容存在的问题... |
| CUSTOM | 用户反馈 | 请告诉我们您的想法和意见... |

---

#### 3.2 按钮状态管理

**初始状态**：
- 显示对应类型的图标（Lightbulb / Flag / MessageSquare）
- 颜色：`text-slate-500`

**已提交状态**：
- 图标变为 Check（对勾）
- 颜色：`text-green-500`（或主题色）
- 仍可点击，用户可重复提交新反馈

**状态持久化**：
- 状态仅在当前页面会话有效
- 刷新页面后状态重置
- 不存储到 localStorage（避免数据冗余）

---

## 功能逻辑

### 1. 反馈提交流程

```
用户点击反馈按钮
  ↓
[前端] 检查是否有生成内容
  ├─ 有内容 → 打开反馈弹窗
  └─ 无内容 → 显示 Toast 提示"请先生成内容"
  ↓
用户填写反馈内容
  ↓
点击"提交"按钮
  ↓
[前端] 参数校验
  ├─ 内容为空 → 显示 Toast 提示"请填写反馈内容"
  ├─ 内容超过 500 字符 → 禁止输入（前端限制）
  └─ 校验通过 → 发送 API 请求
  ↓
[API] POST /api/feedbacks
  ├─ Session 验证
  │   ├─ 未登录 → 返回 401
  │   └─ 已登录 → 继续
  ├─ 参数校验（Zod Schema）
  │   ├─ logId 格式错误 → 返回 400
  │   ├─ type 不合法 → 返回 400
  │   ├─ content 长度不合法 → 返回 400
  │   └─ 校验通过 → 继续
  ├─ 验证 logId 存在性
  │   ├─ logId 不存在 → 返回 400 "关联的生成记录不存在"
  │   └─ 存在 → 继续
  ├─ 调用 Service 层插入数据
  └─ 返回成功响应
  ↓
[前端] 处理响应
  ├─ 成功 → Toast 提示 + 更新按钮状态
  └─ 失败 → Toast 显示错误信息
```

---

### 2. Service 层逻辑

**方法名**：`submitUserFeedback()`

**参数**：
```typescript
{
  userId: string;      // 用户 UUID（从 Session 获取）
  logId: string;       // 关联的 audit_logs.id
  type: string;        // 'SUGGESTION' | 'REPORT' | 'CUSTOM'
  content: string;     // 反馈内容（1-500字符）
}
```

**处理步骤**：
1. **参数校验**：
   - `type` 必须在 `['SUGGESTION', 'REPORT', 'CUSTOM']` 范围内
   - `content` 不能为空且长度 1-500 字符

2. **验证 logId**：
   - 查询 `audit_logs` 表，确认 `logId` 存在
   - 不存在 → 抛出 `NotFoundError('关联的生成记录不存在')`

3. **插入 feedbacks 表**：
   ```typescript
   await prisma.feedbacks.create({
     data: {
       user_id: userId,
       log_id: logId,
       type: type,
       content: content,
       status: 0,  // 待处理
       // created_time 自动生成
     }
   })
   ```

4. **返回成功**：
   - 无需返回数据，仅确认操作成功

---

## 接口定义

### POST /api/feedbacks - 提交用户反馈

**请求方式**: POST  
**权限要求**: 已登录用户（Session 验证）  
**Content-Type**: application/json

**请求体**:
```typescript
{
  logId: string;       // 关联的审计日志 ID（UUID 格式）
  type: string;        // 反馈类型：'SUGGESTION' | 'REPORT' | 'CUSTOM'
  content: string;     // 反馈内容（1-500字符）
}
```

**请求示例**:
```json
{
  "logId": "d4f8e2a1-5c3b-4f9a-8e2d-1a2b3c4d5e6f",
  "type": "SUGGESTION",
  "content": "生成的邮件语气有点过于正式，建议可以增加一些友好的措辞。"
}
```

---

**成功响应** (200):
```json
{
  "success": true,
  "message": "反馈提交成功"
}
```

---

**错误响应**:

**401 - 未登录**:
```json
{
  "success": false,
  "error": {
    "code": "AUTH_EXPIRED",
    "message": "会话已过期，请重新登录"
  }
}
```

**400 - 参数错误**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "反馈内容长度必须在 1-500 字符之间"
  }
}
```

**400 - logId 不存在**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "关联的生成记录不存在"
  }
}
```

---

## 数据库操作

### 使用现有表：feedbacks

**表结构**（已存在，无需修改）:
```sql
CREATE TABLE feedbacks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  log_id          UUID,
  type            VARCHAR(30) NOT NULL,
  content         TEXT NOT NULL,
  status          SMALLINT DEFAULT 0,
  admin_note      TEXT,
  processed_time  TIMESTAMPTZ,
  created_time    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feedbacks_status ON feedbacks(status);
```

---

### 插入操作

**SQL 示例**:
```sql
INSERT INTO feedbacks (
  user_id,
  log_id,
  type,
  content,
  status
) VALUES (
  '用户UUID',
  '审计日志UUID',
  'SUGGESTION',
  '用户填写的反馈内容',
  0  -- 待处理
);
```

**字段说明**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | UUID | 是 | 提交反馈的用户 ID |
| log_id | UUID | 是 | 关联的 audit_logs.id |
| type | VARCHAR(30) | 是 | 反馈类型：SUGGESTION/REPORT/CUSTOM |
| content | TEXT | 是 | 反馈内容（1-500字符） |
| status | SMALLINT | 否 | 默认 0（待处理） |
| admin_note | TEXT | 否 | 管理员备注（由后台填写） |
| processed_time | TIMESTAMPTZ | 否 | 处理时间（由后台更新） |
| created_time | TIMESTAMPTZ | 否 | 自动生成当前时间 |

---

## 异常处理

### 1. 未登录用户

**场景**: 用户 Session 失效或未登录

**处理**:
```typescript
const user = await authenticateRequest(request);
if (!user) {
  return NextResponse.json({
    success: false,
    error: {
      code: 'AUTH_EXPIRED',
      message: '会话已过期，请重新登录'
    }
  }, { status: 401 });
}
```

---

### 2. 参数校验失败

**场景**: 请求参数不合法

**处理**:
```typescript
const feedbackSchema = z.object({
  logId: z.string().uuid('logId 必须是有效的 UUID 格式'),
  type: z.enum(['SUGGESTION', 'REPORT', 'CUSTOM'], {
    errorMap: () => ({ message: '反馈类型必须是 SUGGESTION、REPORT 或 CUSTOM' })
  }),
  content: z.string()
    .min(1, '反馈内容不能为空')
    .max(500, '反馈内容最多 500 字符')
});

const validation = feedbackSchema.safeParse(body);
if (!validation.success) {
  const errorMessage = validation.error.errors[0].message;
  return NextResponse.json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: errorMessage
    }
  }, { status: 400 });
}
```

---

### 3. 关联的生成记录不存在

**场景**: 用户提交的 logId 在数据库中不存在

**处理**:
```typescript
const auditLog = await prisma.audit_logs.findUnique({
  where: { id: logId }
});

if (!auditLog) {
  throw new NotFoundError('关联的生成记录不存在');
}
```

**响应**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "关联的生成记录不存在"
  }
}
```

---

### 4. 数据库写入失败

**场景**: Prisma 插入操作失败

**处理**:
```typescript
try {
  await prisma.feedbacks.create({ data });
} catch (error) {
  console.error('[FeedbackService] 插入反馈失败:', error);
  throw new Error('反馈提交失败，请稍后重试');
}
```

---

## 安全与合规

### 1. 身份验证

**要求**:
- 所有反馈提交必须验证用户 Session
- 使用 `authenticateRequest()` 工具函数
- Session 失效时返回 401 错误

**实现**:
```typescript
const user = await authenticateRequest(request);
// user 包含 { userId, phone }
```

---

### 2. 参数校验

**前端校验**:
- 字符计数器实时显示（0/500）
- 超过 500 字符禁止继续输入（`maxLength={500}`）
- 空内容禁用提交按钮

**后端校验**:
- Zod Schema 验证所有字段
- 类型必须在枚举范围内
- 长度限制严格执行

---

### 3. 真实 IP 记录（可选）

**说明**: 当前 feedbacks 表没有 IP 字段，如需记录用户 IP 用于审计，需要扩展表结构。

**建议**（未来扩展）:
```sql
ALTER TABLE feedbacks ADD COLUMN user_ip VARCHAR(45);
```

**获取 IP**:
```typescript
const clientIp = getClientIP(request);
```

---

### 4. 内容审核（可选）

**说明**: 当前版本不对用户反馈内容进行审核，直接入库。如需审核，可集成内容审核服务。

**建议**（未来扩展）:
- 调用 `moderationService.checkContent(content)`
- 敏感内容标记但不阻止提交
- 由管理员后台审核处理

---

### 5. 防刷机制（可选）

**建议**（未来扩展）:
- 同一用户对同一 `log_id` 的相同类型反馈，限制频率
- 使用 Redis 记录提交时间，实现滑动窗口限流
- 限制：每小时最多 3 次相同类型反馈

**伪代码**:
```typescript
const key = `feedback:${userId}:${logId}:${type}`;
const count = await redis.incr(key);
if (count === 1) {
  await redis.expire(key, 3600); // 1小时过期
}
if (count > 3) {
  throw new ValidationError('提交过于频繁，请稍后再试');
}
```

---

## 前端组件设计

### 1. FeedbackModal 组件

**文件**: `components/writing/FeedbackModal.tsx`

**Props**:
```typescript
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  title: string;          // 弹窗标题
  placeholder: string;    // 输入框占位符
  isSubmitting: boolean;  // 提交中状态
}
```

**样式规范**:
- 背景蒙层：`fixed inset-0 bg-black/20 backdrop-blur-sm`
- 弹窗：`max-w-lg rounded-xl shadow-2xl`
- 输入框：`h-32 resize-none`
- 字符计数：`text-xs text-slate-400`

---

### 2. ResultViewer 组件更新

**新增 Props**:
```typescript
interface ResultViewerProps {
  content?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  auditLogId?: string;     // 新增：关联的审计日志 ID
}
```

**新增状态**:
```typescript
const [feedbackModal, setFeedbackModal] = useState<{
  isOpen: boolean;
  type: 'SUGGESTION' | 'REPORT' | 'CUSTOM';
  title: string;
  placeholder: string;
} | null>(null);

const [buttonStates, setButtonStates] = useState({
  suggestion: false,
  report: false,
  custom: false,
});

const [isSubmitting, setIsSubmitting] = useState(false);
```

---

## 测试用例

### 功能测试

| 测试项 | 预期结果 | 状态 |
|--------|---------|------|
| 点击"建议"按钮 | 弹出输入框，标题为"提交建议" | [ ] |
| 点击"内容举报"按钮 | 弹出输入框，标题为"内容举报" | [ ] |
| 点击"用户反馈"按钮 | 弹出输入框，标题为"用户反馈" | [ ] |
| 输入框字符计数 | 实时显示 0/500 | [ ] |
| 空内容提交 | 显示提示"请填写反馈内容" | [ ] |
| 超过 500 字符 | 无法继续输入 | [ ] |
| 点击背景 | 关闭弹窗 | [ ] |
| 按 ESC 键 | 关闭弹窗 | [ ] |
| 提交成功 | Toast 提示 + 按钮变为 Check | [ ] |
| 重复提交 | 可以再次打开弹窗提交 | [ ] |

---

### API 测试

| 测试项 | 请求 | 预期响应 | 状态 |
|--------|------|---------|------|
| 未登录提交 | 无 Session | 401 AUTH_EXPIRED | [ ] |
| 无效 logId | logId 不存在 | 400 NOT_FOUND | [ ] |
| 空内容 | content 为空 | 400 VALIDATION_ERROR | [ ] |
| 内容过长 | content 超过 500 字符 | 400 VALIDATION_ERROR | [ ] |
| 类型不合法 | type 为 'INVALID' | 400 VALIDATION_ERROR | [ ] |
| 正常提交 | 所有参数合法 | 200 success: true | [ ] |
| 数据库记录 | 正常提交后 | feedbacks 表新增记录 | [ ] |

---

### 样式测试

| 测试项 | 预期效果 | 状态 |
|--------|---------|------|
| 按钮顺序 | 复制 → 建议 → 举报 → 反馈 | [ ] |
| 未提交按钮 | 显示对应图标，灰色 | [ ] |
| 已提交按钮 | 显示 Check，绿色 | [ ] |
| 按钮 hover | 背景变浅，平滑过渡 | [ ] |
| 弹窗毛玻璃 | 背景模糊效果 | [ ] |
| 深色模式 | 所有样式正常 | [ ] |
| Toast 位置 | 屏幕居中 | [ ] |
| Toast 动画 | 淡入淡出平滑 | [ ] |

---

## 后续扩展

1. **IP 记录**：扩展 feedbacks 表，添加 `user_ip` 字段
2. **内容审核**：集成内容审核服务，对反馈内容进行检测
3. **防刷限制**：使用 Redis 实现反馈提交频率限制
4. **敏感词过滤**：对用户反馈内容进行敏感词检测
5. **管理后台通知**：高优先级举报实时推送通知管理员
6. **反馈统计**：Dashboard 显示反馈数量趋势图

---

## 备注

1. **无需操作日志**：用户反馈行为不记录到 `admin_operation_logs`（仅管理员操作需要）
2. **无需审核流程**：用户可直接提交，由管理员后台统一处理
3. **类型可扩展**：未来可增加更多反馈类型（如 BUG_REPORT、FEATURE_REQUEST）
4. **关联 log_id**：必须关联生成记录，便于管理员追溯上下文
5. **状态管理**：前端按钮状态仅会话有效，不持久化存储

---

**文档维护**: 如实现过程中发现规范不合理或需要调整，请及时更新本文档。

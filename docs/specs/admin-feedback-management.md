# 管理后台反馈管理功能开发规范

## Spec 概述
本规范描述 FluentWJ 管理后台的反馈管理功能，用于管理和处理来自用户的投诉、举报与建议，包括反馈列表展示、搜索、筛选、处理弹窗、数据导出等核心功能。

**文档版本**: v1.0  
**创建日期**: 2026-01-16  
**相关 PRD**: `/docs/prd/[PRD] FluentWJ 跨境商务写作助手项目需求文档.md`  
**相关设计稿**: `/docs/ui/fluentwj_admin_audit_log_&_details_3`, `/docs/ui/fluentwj_admin_audit_log_&_details_4`  
**实施方式**: 规范驱动开发 (SDD)

---

## 功能描述

### 1. 反馈列表展示
展示系统中所有用户提交的反馈记录，支持分页浏览。

**核心功能**：
- 表格形式展示反馈记录（用户信息、反馈类型、内容摘要、提交日期、操作按钮）
- 分页展示（默认每页 20 条）
- 支持按提交时间倒序排列
- 显示总反馈数统计
- Tab 切换：待处理（带红色徽章显示数量）/ 已处理
- 反馈类型可视化（投诉/举报/建议）
- 选中行高亮效果

---

### 2. 搜索功能
支持通过关键词快速查找反馈记录。

**核心功能**：
- 支持按用户名搜索（模糊匹配）
- 支持按用户手机号搜索（模糊匹配）
- 支持按反馈内容搜索（模糊匹配）
- 实时搜索（300ms 防抖）
- 搜索结果保持分页
- 清空搜索框恢复列表

---

### 3. 筛选功能
支持按反馈类型和时间范围进行筛选。

**核心功能**：
- 按反馈类型筛选（所有类型/投诉/举报/建议）
- 按时间范围筛选（最近24小时/最近7天/最近30天/自定义）
- 支持多条件组合筛选
- 筛选后保持分页
- 显示筛选条件标签

---

### 4. 处理弹窗
点击"处理"按钮，弹出毛玻璃效果的处理界面。

**核心功能**：
- 显示用户原始反馈内容
- 显示用户基本信息（姓名、手机号、提交时间）
- 提供管理员备注输入框（Textarea）
- 毛玻璃背景效果 + 背景模糊
- 底部操作按钮：取消 / 标记为已处理
- 弹窗滑入/滑出动画
- 点击关闭按钮或取消时关闭弹窗

---

### 5. 数据导出
支持将反馈记录导出为 CSV 文件。

**核心功能**：
- 导出当前筛选/搜索结果
- CSV 格式（UTF-8 BOM 编码，支持中文）
- 包含字段：反馈ID、用户信息、反馈类型、反馈内容、提交时间、处理状态、管理员备注
- 限制最大导出数量（10,000 条）
- 导出时记录操作日志

---

## 功能逻辑

### 1. 反馈列表查询流程

```
客户端请求 GET /api/admin/feedbacks?page=1&pageSize=20&status=0
  ↓
[Middleware] JWT Token 验证
  ├─ 验证 Token 有效性
  ├─ 解析 userId 和 role
  └─ role !== 0 → 返回 403（非管理员）
  ↓
[API层] 参数校验与解析
  ├─ page: number (默认 1)
  ├─ pageSize: number (默认 20, 最大 100)
  ├─ keyword: string (可选，搜索关键词)
  ├─ type: string (可选, 'COMPLAINT', 'REPORT', 'SUGGESTION')
  ├─ status: number (可选, 0=待处理, 1=已处理)
  ├─ startDate: string (可选, ISO日期字符串)
  └─ endDate: string (可选, ISO日期字符串)
  ↓
[Service层] getFeedbackList(params)
  ├─ 构建 Prisma 查询条件
  │   ├─ 如果有 keyword: 用户名 LIKE 或 手机号 LIKE 或 内容 LIKE
  │   ├─ 如果有 type: type = ?
  │   ├─ 如果有 status: status = ?
  │   ├─ 如果有 startDate: created_time >= ?
  │   └─ 如果有 endDate: created_time <= ?
  ├─ JOIN users 表获取用户信息
  ├─ 执行两个查询:
  │   ├─ prisma.feedbacks.count() - 获取总数
  │   └─ prisma.feedbacks.findMany() - 获取分页数据
  ├─ 计算偏移量: skip = (page - 1) * pageSize
  ├─ 按 created_time DESC 排序
  ├─ 手机号脱敏处理（中间4位替换为星号）
  └─ 返回 { data: Feedback[], total: number }
  ↓
[API层] 返回 JSON 响应
  └─ { code: 200, data: { list, total } }
```

---

### 2. 处理反馈流程

```
用户点击"处理"按钮
  ↓
[前端] 弹出处理弹窗
  ├─ 显示用户原始反馈内容
  └─ 提供管理员备注输入框
  ↓
用户输入管理员备注，点击"标记为已处理"
  ↓
[前端] 发送 POST /api/admin/feedbacks/:id/process
  └─ Body: { adminNote: string }
  ↓
[Middleware] JWT Token 验证 + 管理员权限校验
  ↓
[API层] 参数校验
  ├─ id: string (UUID格式)
  └─ adminNote: string (可选)
  ↓
[Service层] processFeedback(id, data, adminId, adminIp)
  ├─ 查询反馈是否存在
  │   └─ 不存在 → 抛出 NotFoundError
  ├─ 更新反馈状态
  │   ├─ status = 1 (已处理)
  │   ├─ admin_note = adminNote
  │   └─ processed_time = 当前时间
  ├─ 记录操作日志到 admin_operation_logs
  │   ├─ action_type: 'PROCESS_FEEDBACK'
  │   ├─ target_id: feedbackId
  │   ├─ detail: 反馈类型 + 管理员备注
  │   └─ ip: adminIp
  └─ 返回成功
  ↓
[API层] 返回 JSON 响应
  └─ { code: 200, message: '处理成功' }
  ↓
[前端] 关闭弹窗，刷新列表
```

---

### 3. 数据导出流程

```
用户点击「导出报表」按钮
  ↓
[前端] 发送 GET /api/admin/feedbacks/export?keyword=...&type=...&status=...&startDate=...&endDate=...
  └─ 携带当前筛选条件
  ↓
[Middleware] JWT Token 验证 + 管理员权限校验
  ↓
[Service层] exportFeedbacks(params)
  ├─ 检查导出数量
  │   ├─ 执行 count 查询
  │   └─ 超过 10,000 → 抛出 ValidationError
  ├─ 查询所有匹配数据（不分页）
  │   └─ prisma.feedbacks.findMany({ where, orderBy })
  ├─ JOIN users 表获取用户信息
  ├─ 生成 CSV 内容
  │   ├─ 表头: 反馈ID,用户姓名,用户手机号,反馈类型,反馈内容,提交时间,处理状态,管理员备注
  │   ├─ 数据行: 逐行拼接
  │   ├─ 手机号脱敏
  │   ├─ 状态值转换（0=待处理, 1=已处理）
  │   ├─ 类型值转换（COMPLAINT=投诉, REPORT=举报, SUGGESTION=建议）
  │   └─ UTF-8 BOM 编码（\uFEFF）
  ├─ 记录操作日志到 admin_operation_logs
  └─ 返回 CSV 字符串
  ↓
[API层] 设置响应头
  ├─ Content-Type: text/csv; charset=utf-8
  ├─ Content-Disposition: attachment; filename="feedbacks_时间戳.csv"
  └─ 返回 CSV 内容
  ↓
[前端] 浏览器自动下载文件
```

---

## 接口定义

### 1. GET /api/admin/feedbacks - 获取反馈列表

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**Query 参数**:
```typescript
{
  page?: number          // 页码，默认 1
  pageSize?: number      // 每页数量，默认 20，最大 100
  keyword?: string       // 搜索关键词（用户名/手机号/反馈内容）
  type?: string          // 反馈类型筛选（'COMPLAINT', 'REPORT', 'SUGGESTION'）
  status?: number        // 状态筛选（0=待处理, 1=已处理）
  startDate?: string     // 开始时间（ISO 格式，如 "2026-01-01T00:00:00Z"）
  endDate?: string       // 结束时间（ISO 格式）
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "张三",
        "userPhone": "138****0001",
        "type": "COMPLAINT",
        "content": "生成结果中包含了一些明显不实的信息...",
        "status": 0,
        "adminNote": null,
        "processedTime": null,
        "createdTime": "2023-10-24T14:20:05.000Z"
      }
    ],
    "total": 125
  }
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 参数格式错误

---

### 2. GET /api/admin/feedbacks/:id - 获取反馈详情

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**URL 参数**:
- `id`: 反馈 UUID

**成功响应** (200):
```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "userName": "张三",
    "userPhone": "138****0001",
    "type": "COMPLAINT",
    "content": "生成结果中包含了一些明显不实的信息，建议加强模型对事实性内容的审核。我在使用 GPT-4 模型进行法律条文查询时，出现了引用不存在条款的情况。",
    "status": 0,
    "adminNote": null,
    "processedTime": null,
    "createdTime": "2023-10-24T14:20:05.000Z",
    "logId": "uuid"
  }
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 404: 反馈不存在

---

### 3. POST /api/admin/feedbacks/:id/process - 处理反馈

**请求方式**: POST  
**权限要求**: 管理员（role = 0）

**URL 参数**:
- `id`: 反馈 UUID

**Body 参数**:
```typescript
{
  adminNote?: string     // 管理员备注（可选）
}
```

**成功响应** (200):
```json
{
  "code": 200,
  "message": "处理成功"
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 404: 反馈不存在
- 400: 参数格式错误

---

### 4. GET /api/admin/feedbacks/export - 导出反馈数据

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**Query 参数**:
```typescript
{
  keyword?: string       // 搜索关键词
  type?: string          // 反馈类型筛选
  status?: number        // 状态筛选
  startDate?: string     // 开始时间
  endDate?: string       // 结束时间
}
```

**成功响应** (200):
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="feedbacks_20260116_143022.csv"`
- Body: CSV 文件内容

**CSV 格式**:
```csv
反馈ID,用户姓名,用户手机号,反馈类型,反馈内容,提交时间,处理状态,管理员备注
uuid-1234,张三,138****0001,投诉,生成结果中包含了...,2023-10-24 14:20:05,待处理,
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 导出数量超过限制（10,000条）

---

## 数据库变更

### 无需修改 Prisma Schema

当前 `feedbacks` 表结构已满足需求：

```prisma
model feedbacks {
  id             String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id        String    @db.Uuid
  log_id         String?   @db.Uuid
  type           String    @db.VarChar(30)
  content        String
  status         Int?      @default(0) @db.SmallInt
  admin_note     String?
  processed_time DateTime? @db.Timestamptz(6)
  created_time   DateTime? @default(now()) @db.Timestamptz(6)

  @@index([status], map: "idx_feedbacks_status")
}
```

**说明**:
- 状态字段 status: 0=待处理, 1=已处理
- 反馈类型 type: 'COMPLAINT'=投诉, 'REPORT'=举报, 'SUGGESTION'=建议
- 已有索引 `idx_feedbacks_status` 可优化状态筛选查询
- 需要 JOIN `users` 表获取用户的姓名和手机号

---

## 数据字典

### 反馈类型 (type)

| 值 | 含义 | 前端显示 | 样式 |
|----|------|---------|------|
| COMPLAINT | 投诉 | "投诉" | 红色徽章 (bg-red-100 text-red-600) |
| REPORT | 举报 | "举报" | 橙色徽章 (bg-orange-100 text-orange-600) |
| SUGGESTION | 建议 | "建议" | 蓝色徽章 (bg-blue-100 text-blue-600) |

### 处理状态 (status)

| 值 | 含义 | 前端显示 |
|----|------|---------|
| 0 | 待处理 | Tab 显示红色徽章 + 数量 |
| 1 | 已处理 | 显示处理时间和管理员备注 |

---

## 异常处理

### 1. 权限不足

**场景**: 非管理员访问反馈管理 API

**处理**:
```typescript
if (userRole !== 0) {
  throw new ForbiddenError('需要管理员权限')
}
```

**响应**:
```json
{
  "code": 403,
  "error": "需要管理员权限"
}
```

---

### 2. 反馈不存在

**场景**: 处理反馈时反馈 ID 不存在

**处理**:
```typescript
const feedback = await prisma.feedbacks.findUnique({ where: { id } })
if (!feedback) {
  throw new NotFoundError('反馈不存在')
}
```

**响应**:
```json
{
  "code": 404,
  "error": "反馈不存在"
}
```

---

### 3. 导出数据过大限制

**场景**: 导出数据超过 10,000 条

**处理**:
```typescript
const count = await prisma.feedbacks.count({ where })
if (count > 10000) {
  throw new ValidationError(`数据量过大，最多支持导出 10,000 条记录，当前 ${count} 条`)
}
```

**响应**:
```json
{
  "code": 400,
  "error": "数据量过大，最多支持导出 10,000 条记录，当前 15432 条"
}
```

---

### 4. 参数格式错误

**场景**: 时间范围参数格式不正确

**处理**:
```typescript
if (startDate && !isValidISODate(startDate)) {
  throw new ValidationError('开始时间格式错误，请使用 ISO 8601 格式')
}
```

**响应**:
```json
{
  "code": 400,
  "error": "开始时间格式错误，请使用 ISO 8601 格式"
}
```

---

## 安全审计

### 操作日志记录

所有关键操作必须记录到 `admin_operation_logs` 表：

| 操作类型 | action_type | 记录内容 |
|---------|-------------|---------|
| 处理反馈 | PROCESS_FEEDBACK | 反馈ID、反馈类型、管理员备注 |
| 导出数据 | EXPORT_FEEDBACKS | 导出条件、数量 |

**日志结构**:
```typescript
{
  admin_id: string      // 操作管理员 ID
  action_type: string   // 操作类型
  target_id: string     // 目标反馈 ID（可选）
  detail: string        // 操作详情
  ip: string            // 操作 IP
  created_time: Date    // 操作时间
}
```

---

## 性能优化

### 1. 数据库索引

确保以下索引存在（已在 schema 中定义）：
- `idx_feedbacks_status` - 状态索引，优化状态筛选查询

**建议新增索引**（可选）:
```sql
CREATE INDEX idx_feedbacks_created_time ON feedbacks(created_time DESC);
CREATE INDEX idx_feedbacks_type ON feedbacks(type);
```

### 2. 分页查询

使用 Prisma `skip` 和 `take` 实现分页：
```typescript
const feedbacks = await prisma.feedbacks.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  where,
  orderBy: { created_time: 'desc' },
  include: {
    // JOIN users 表
  }
})
```

### 3. 搜索优化

对于关键词搜索，使用 OR 条件组合：
```typescript
where: {
  OR: [
    { content: { contains: keyword } },
    { users: { phone: { contains: keyword } } }
  ]
}
```

### 4. 数据脱敏

手机号脱敏统一使用工具函数：
```typescript
function maskPhone(phone: string): string {
  if (!phone || phone.length !== 11) return phone
  return phone.slice(0, 3) + '****' + phone.slice(7)
}
// 示例: "13800138000" → "138****8000"
```

---

## 前端设计规范

### 设计风格: 现代企业级仪表板 (Modern Enterprise Dashboard)

**Typography**:
- 主字体: Inter（与后台其他页面保持一致）
- 中文字体: Noto Sans SC
- 图标字体: Material Symbols Outlined

**Color Palette**:
- 主色调: #0052D9（FluentWJ 品牌色）
- 投诉: #EF4444（红色）
- 举报: #F97316（橙色）
- 建议: #3B82F6（蓝色）
- 中性灰: #64748B
- 背景色: #f5f6f8（浅灰）
- 卡片背景: #FFFFFF

**Spacing**:
- 表格行高: 64px
- 表格内边距: px-6 py-4
- 弹窗宽度: 640px (max-w-2xl)
- 搜索栏高度: 48px
- 卡片圆角: rounded-xl (12px)
- 按钮圆角: rounded-lg (8px)

**Micro-interactions**:
- 表格行 hover: hover:bg-slate-50/80 + transition-colors
- 弹窗背景模糊: backdrop-blur-sm
- 毛玻璃效果: frosted-glass 自定义类
- 按钮 hover: hover:bg-primary/90 + transition-all
- 搜索框聚焦: focus:ring-primary focus:border-primary

**Layout Structure**:
```
┌─────────────────────────────────────────────────┐
│ Header (80px)                                   │
│ - 标题 + 副标题                                  │
│ - Tab 切换（待处理 / 已处理）                    │
│ - 导出按钮                                       │
├─────────────────────────────────────────────────┤
│ Filters (64px)                                  │
│ - 搜索框 + 反馈类型筛选 + 提交日期筛选           │
├─────────────────────────────────────────────────┤
│ Table (flex-1, overflow-auto)                   │
│ - 5列数据（用户、类型、内容、日期、操作）        │
├─────────────────────────────────────────────────┤
│ Pagination Footer (56px)                        │
│ - 显示条数 + 上一页/下一页按钮                   │
└─────────────────────────────────────────────────┘

Process Modal (fixed, z-50, centered):
┌─────────────────────────────────────────────────┐
│ Modal Header                                    │
│ - 图标 + 标题 + 关闭按钮                         │
├─────────────────────────────────────────────────┤
│ Modal Body                                      │
│ - 用户原始反馈（带背景卡片）                     │
│ - 管理员备注输入框（Textarea）                   │
├─────────────────────────────────────────────────┤
│ Modal Footer                                    │
│ - 取消按钮 + 标记为已处理按钮                    │
└─────────────────────────────────────────────────┘
```

---

## 测试用例

### 1. 反馈列表加载
- [ ] 页面打开自动加载第一页数据
- [ ] 分页组件显示正确的总数和页码
- [ ] 表格正确显示反馈信息
- [ ] 反馈类型徽章正确显示（投诉/举报/建议）
- [ ] 手机号正确脱敏显示
- [ ] Tab 切换正常，待处理显示红色徽章 + 数量

### 2. 搜索功能
- [ ] 输入关键词能搜索到对应反馈
- [ ] 输入用户手机号能搜索到对应反馈
- [ ] 输入反馈内容能搜索到对应反馈
- [ ] 搜索结果实时更新（300ms 防抖）
- [ ] 清空搜索框恢复完整列表

### 3. 筛选功能
- [ ] 按反馈类型筛选正确过滤
- [ ] 按处理状态筛选正确过滤
- [ ] 按时间范围筛选正确过滤
- [ ] 组合筛选正确工作
- [ ] 筛选后分页正常

### 4. 处理弹窗
- [ ] 点击"处理"按钮显示处理弹窗
- [ ] 弹窗毛玻璃效果正确显示
- [ ] 背景模糊效果正确显示
- [ ] 显示用户原始反馈内容
- [ ] 管理员备注输入框可输入
- [ ] 点击"取消"按钮关闭弹窗
- [ ] 点击"标记为已处理"成功处理反馈
- [ ] 处理后列表自动刷新

### 5. 数据导出
- [ ] 点击「导出报表」按钮开始下载
- [ ] CSV 文件格式正确
- [ ] 中文内容显示正常（UTF-8 BOM）
- [ ] 导出数据与当前筛选一致
- [ ] 手机号在导出文件中正确脱敏
- [ ] 超过 10,000 条显示错误提示

### 6. 响应式布局
- [ ] 在 1920px 宽屏幕正常显示
- [ ] 在 1366px 笔记本屏幕正常显示
- [ ] 弹窗在小屏幕上不遮挡主要内容
- [ ] 深色模式切换正常

---

## 备注

1. **手机号脱敏**: 所有展示和导出的手机号必须脱敏（中间4位星号）
2. **权限校验**: 所有 API 必须验证管理员权限（role = 0）
3. **操作日志**: 处理反馈和导出操作必须记录到 admin_operation_logs 表
4. **真实 IP**: 从请求头提取 x-forwarded-for 或 x-real-ip
5. **用户信息**: 需要 JOIN users 表获取用户姓名和手机号
6. **反馈类型映射**: 前端展示时需要将英文类型转换为中文（COMPLAINT→投诉, REPORT→举报, SUGGESTION→建议）

---

**文档维护**: 如实现过程中发现规范不合理或需要调整，请及时更新本文档。

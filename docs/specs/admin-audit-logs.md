# 管理后台审计日志功能开发规范

## Spec 概述
本规范描述 FluentWJ 管理后台的审计日志功能，用于监控和审计平台生成的所有 AI 内容，包括日志列表展示、搜索、筛选、详情查看、数据导出等核心功能。

**文档版本**: v1.0  
**创建日期**: 2026-01-16  
**相关 PRD**: `/docs/prd/[PRD] FluentWJ 跨境商务写作助手项目需求文档.md`  
**相关设计稿**: `/docs/ui/fluentwj_admin_audit_log_&_details_2`  
**实施方式**: 规范驱动开发 (SDD)

---

## 功能描述

### 1. 审计日志列表展示
展示系统中所有 AI 生成内容的审计记录，支持分页浏览。

**核心功能**：
- 表格形式展示审计日志（生成时间、用户手机号、客户端IP、底层模型、审核状态）
- 分页展示（默认每页 20 条）
- 支持按生成时间倒序排列
- 显示总日志数统计
- 状态可视化（通过/违规拦截）
- 选中行高亮效果（带边框）

---

### 2. 搜索功能
支持通过关键词快速查找审计日志。

**核心功能**：
- 支持按用户手机号搜索（模糊匹配）
- 支持按客户端 IP 搜索（精确匹配）
- 支持按底层模型名称搜索（模糊匹配）
- 实时搜索（300ms 防抖）
- 搜索结果保持分页
- 清空搜索框恢复列表

---

### 3. 筛选功能
支持按审核状态和时间范围进行筛选。

**核心功能**：
- 按审核状态筛选（所有状态/通过/违规拦截）
- 按时间范围筛选（最近24小时/最近7天/最近30天/自定义）
- 支持多条件组合筛选
- 筛选后保持分页
- 显示筛选条件标签

---

### 4. 详情查看
点击任意日志行，右侧滑出详情面板展示完整信息。

**核心功能**：
- 显示用户原始输入（input_prompt）
- 显示 AI 生成结果（output_content）
- 显示安全元数据：
  - 客户端归属地（IP 地址解析）
  - 敏感词命中情况
  - 内容合规分
  - 审核接口 ID（external_audit_id）
- 面板滑入/滑出动画
- 点击关闭按钮或其他行时关闭面板

---

### 5. 数据导出
支持将审计日志导出为 CSV 文件。

**核心功能**：
- 导出当前筛选/搜索结果
- CSV 格式（UTF-8 BOM 编码，支持中文）
- 包含字段：日志ID、用户手机号、客户端IP、底层模型、审核状态、生成时间、用户输入、AI输出
- 限制最大导出数量（10,000 条）
- 导出时记录操作日志

---

### 6. 批量操作（仅 UI，暂不实现后端）
详情面板底部提供操作按钮（仅展示，不调用 API）。

**核心功能**：
- 「加入白名单」按钮（白色样式）
- 「标记违规」按钮（红色危险样式）
- 点击时显示 Toast 提示（功能开发中）

---

## 功能逻辑

### 1. 审计日志列表查询流程

```
客户端请求 GET /api/admin/audit-logs?page=1&pageSize=20
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
  ├─ status: number (可选, 0=违规拦截, 1=通过)
  ├─ startDate: string (可选, ISO日期字符串)
  └─ endDate: string (可选, ISO日期字符串)
  ↓
[Service层] getAuditLogs(params)
  ├─ 构建 Prisma 查询条件
  │   ├─ 如果有 keyword: 手机号 LIKE 或 IP = 或 model_name LIKE
  │   ├─ 如果有 status: status = ?
  │   ├─ 如果有 startDate: created_time >= ?
  │   └─ 如果有 endDate: created_time <= ?
  ├─ 执行两个查询:
  │   ├─ prisma.audit_logs.count() - 获取总数
  │   └─ prisma.audit_logs.findMany() - 获取分页数据
  ├─ 计算偏移量: skip = (page - 1) * pageSize
  ├─ 按 created_time DESC 排序
  ├─ 手机号脱敏处理（中间4位替换为星号）
  └─ 返回 { data: AuditLog[], total: number }
  ↓
[API层] 返回 JSON 响应
  └─ { code: 200, data: { list, total } }
```

---

### 2. 搜索实时查询流程

```
用户输入搜索关键词
  ↓
[前端] 防抖处理 (300ms)
  └─ 避免频繁请求
  ↓
[前端] 发送 GET /api/admin/audit-logs?keyword=关键词&page=1
  ├─ 重置页码为 1
  └─ 保持当前筛选条件（status, startDate, endDate）
  ↓
[后端] 执行搜索查询
  ├─ 手机号模糊匹配: user_phone LIKE '%关键词%'
  ├─ 或 IP 精确匹配: user_ip = '关键词'
  ├─ 或 模型名称模糊匹配: model_name LIKE '%关键词%'
  └─ 返回匹配结果
  ↓
[前端] 更新列表展示
  └─ 显示搜索结果
```

---

### 3. 详情查看流程

```
用户点击表格行
  ↓
[前端] 记录选中日志的 ID
  ↓
[前端] 发送 GET /api/admin/audit-logs/:id
  ↓
[Middleware] JWT Token 验证 + 管理员权限校验
  ↓
[Service层] getAuditLogDetail(id)
  ├─ 查询审计日志完整信息
  │   └─ prisma.audit_logs.findUnique({ where: { id } })
  ├─ 检查日志是否存在
  │   └─ 不存在 → 抛出 NotFoundError
  ├─ 手机号脱敏处理
  ├─ IP 归属地解析（可选功能）
  │   └─ 使用 IP 库或第三方 API 查询地理位置
  ├─ 计算内容合规分（模拟数据）
  │   └─ 基于 is_sensitive 字段生成 0.0-1.0 分数
  └─ 返回完整详情数据
  ↓
[API层] 返回 JSON 响应
  └─ { code: 200, data: AuditLogDetail }
  ↓
[前端] 右侧滑出详情面板
  ├─ 显示用户原始输入
  ├─ 显示 AI 生成结果
  ├─ 显示安全元数据
  └─ 显示操作按钮（仅 UI）
```

---

### 4. 数据导出流程

```
用户点击「导出日志」按钮
  ↓
[前端] 发送 GET /api/admin/audit-logs/export?keyword=...&status=...&startDate=...&endDate=...
  └─ 携带当前筛选条件
  ↓
[Middleware] JWT Token 验证 + 管理员权限校验
  ↓
[Service层] exportAuditLogs(params)
  ├─ 检查导出数量
  │   ├─ 执行 count 查询
  │   └─ 超过 10,000 → 抛出 ValidationError
  ├─ 查询所有匹配数据（不分页）
  │   └─ prisma.audit_logs.findMany({ where, orderBy })
  ├─ 生成 CSV 内容
  │   ├─ 表头: 日志ID,用户手机号,客户端IP,底层模型,审核状态,生成时间,用户输入,AI输出
  │   ├─ 数据行: 逐行拼接
  │   ├─ 手机号脱敏
  │   ├─ 状态值转换（1=通过, 0=违规拦截）
  │   └─ UTF-8 BOM 编码（\uFEFF）
  ├─ 记录操作日志到 admin_operation_logs
  └─ 返回 CSV 字符串
  ↓
[API层] 设置响应头
  ├─ Content-Type: text/csv; charset=utf-8
  ├─ Content-Disposition: attachment; filename="audit_logs_时间戳.csv"
  └─ 返回 CSV 内容
  ↓
[前端] 浏览器自动下载文件
```

---

## 接口定义

### 1. GET /api/admin/audit-logs - 获取审计日志列表

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**Query 参数**:
```typescript
{
  page?: number          // 页码，默认 1
  pageSize?: number      // 每页数量，默认 20，最大 100
  keyword?: string       // 搜索关键词（手机号/IP/模型名称）
  status?: number        // 状态筛选（0=违规拦截, 1=通过）
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
        "userPhone": "138****0000",
        "userIp": "192.168.1.1",
        "modelName": "DeepSeek-V3",
        "status": 1,
        "createdTime": "2023-10-24T14:20:05.000Z"
      }
    ],
    "total": 5432
  }
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 参数格式错误

---

### 2. GET /api/admin/audit-logs/:id - 获取审计日志详情

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**URL 参数**:
- `id`: 审计日志 UUID

**成功响应** (200):
```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "userPhone": "159****1234",
    "userIp": "210.12.45.67",
    "modelName": "DeepSeek-V3",
    "status": 0,
    "createdTime": "2023-10-24T14:18:22.000Z",
    "inputPrompt": "请帮我写一段关于量子物理的介绍...",
    "outputContent": "想象你有两枚"魔法硬币"...",
    "scene": "商务邮件",
    "tone": "正式",
    "isSensitive": false,
    "externalAuditId": "audit-v3-9921-prod",
    "ipLocation": "浙江 杭州",
    "complianceScore": 0.99
  }
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 404: 审计日志不存在

---

### 3. GET /api/admin/audit-logs/export - 导出审计日志

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**Query 参数**:
```typescript
{
  keyword?: string       // 搜索关键词
  status?: number        // 状态筛选
  startDate?: string     // 开始时间
  endDate?: string       // 结束时间
}
```

**成功响应** (200):
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="audit_logs_20260116_143022.csv"`
- Body: CSV 文件内容

**CSV 格式**:
```csv
日志ID,用户手机号,客户端IP,底层模型,审核状态,生成时间,用户输入,AI输出
uuid-1234,138****0000,192.168.1.1,DeepSeek-V3,通过,2023-10-24 14:20:05,请帮我写...,量子物理是...
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 导出数量超过限制（10,000条）

---

## 数据库变更

### 无需修改 Prisma Schema

当前 `audit_logs` 表结构已满足需求：

```prisma
model audit_logs {
  id                String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id           String    @db.Uuid
  user_phone        String?   @db.VarChar(20)
  user_ip           String    @db.VarChar(45)
  scene             String?   @db.VarChar(50)
  tone              String?   @db.VarChar(50)
  input_prompt      String
  output_content    String
  model_name        String?   @db.VarChar(50)
  audit_token       String?
  status            Int?      @default(1) @db.SmallInt
  is_sensitive      Boolean?  @default(false)
  external_audit_id String?   @db.VarChar(100)
  created_time      DateTime? @default(now()) @db.Timestamptz(6)

  @@index([status, created_time], map: "idx_audit_logs_status_time")
  @@index([user_id], map: "idx_audit_logs_user_id")
}
```

**说明**:
- 状态字段 status: 1=通过, 0=违规拦截
- 已有索引 `idx_audit_logs_status_time` 可优化筛选和排序查询
- 已有索引 `idx_audit_logs_user_id` 可优化用户维度查询

---

## 数据字典

### 审核状态 (status)

| 值 | 含义 | 前端显示 | 样式 |
|----|------|---------|------|
| 1 | 审核通过 | "通过" | 绿色圆点 + 绿色背景 |
| 0 | 违规拦截 | "违规拦截" | 红色脉冲圆点 + 红色背景 |

### 底层模型 (model_name)

| 模型名称 | 显示徽章颜色 |
|---------|-------------|
| DeepSeek-V3 | 蓝色（primary） |
| GPT-4 | 紫色（indigo） |
| Claude | 橙色（amber） |
| 其他 | 灰色（slate） |

### 敏感内容标记 (is_sensitive)

| 值 | 含义 | 详情面板显示 |
|----|------|------------|
| true | 检测到敏感词 | "命中" + 红色背景 |
| false | 无敏感内容 | "无" + 绿色背景 |

---

## 异常处理

### 1. 权限不足

**场景**: 非管理员访问审计日志 API

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

### 2. 审计日志不存在

**场景**: 查询详情时日志 ID 不存在

**处理**:
```typescript
const log = await prisma.audit_logs.findUnique({ where: { id } })
if (!log) {
  throw new NotFoundError('审计日志不存在')
}
```

**响应**:
```json
{
  "code": 404,
  "error": "审计日志不存在"
}
```

---

### 3. 导出数据过大限制

**场景**: 导出数据超过 10,000 条

**处理**:
```typescript
const count = await prisma.audit_logs.count({ where })
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
| 查看详情 | VIEW_AUDIT_LOG | 目标日志ID |
| 导出数据 | EXPORT_AUDIT_LOGS | 导出条件、数量 |

**日志结构**:
```typescript
{
  admin_id: string      // 操作管理员 ID
  action_type: string   // 操作类型
  target_id: string     // 目标日志 ID（可选）
  detail: string        // 操作详情
  ip: string            // 操作 IP
  created_time: Date    // 操作时间
}
```

---

## 性能优化

### 1. 数据库索引

确保以下索引存在（已在 schema 中定义）：
- `idx_audit_logs_status_time` - 状态和时间复合索引，优化筛选和排序
- `idx_audit_logs_user_id` - 用户ID索引，优化用户维度查询

### 2. 分页查询

使用 Prisma `skip` 和 `take` 实现分页：
```typescript
const logs = await prisma.audit_logs.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  where,
  orderBy: { created_time: 'desc' }
})
```

### 3. 搜索优化

对于 IP 精确匹配优先使用等值查询（利用索引）：
```typescript
// IP 精确匹配（性能最佳）
where: { user_ip: keyword }

// 手机号/模型名称模糊匹配（性能较差）
where: { 
  OR: [
    { user_phone: { contains: keyword } },
    { model_name: { contains: keyword } }
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
- 主色调: #0054db（FluentWJ 品牌色）
- 成功/通过: #10B981（绿色）
- 危险/违规: #EF4444（红色）
- 中性灰: #64748B
- 背景色: #f8f9fc（浅灰）
- 卡片背景: #FFFFFF

**Spacing**:
- 表格行高: 64px
- 表格内边距: px-6 py-4
- 详情面板宽度: 420px
- 搜索栏高度: 48px
- 卡片圆角: rounded-xl (12px)
- 按钮圆角: rounded-lg (8px)

**Micro-interactions**:
- 表格行 hover: bg-slate-50/80 + transition-colors
- 选中行高亮: bg-slate-50 + ring-1 ring-primary/20
- 详情面板滑入: translate-x-0 + transition-transform duration-300
- 违规状态脉冲: animate-pulse on red dot
- 按钮 hover: hover:scale-[1.02] + shadow-lg
- 搜索框聚焦: focus:ring-primary focus:border-primary

**Layout Structure**:
```
┌─────────────────────────────────────────────────┐
│ Header (80px)                                   │
│ - 标题 + 副标题                                  │
│ - 导出/刷新按钮                                  │
├─────────────────────────────────────────────────┤
│ Filters (64px)                                  │
│ - 搜索框 + 状态筛选 + 时间筛选                    │
├─────────────────────────────────────────────────┤
│ Table (flex-1, overflow-auto)                   │
│ - 5列数据 + 选中行高亮                           │
├─────────────────────────────────────────────────┤
│ Detail Panel (420px, absolute right-0)          │
│ - 用户输入 + AI输出 + 安全元数据 + 操作按钮       │
└─────────────────────────────────────────────────┘
```

---

## 测试用例

### 1. 审计日志列表加载
- [ ] 页面打开自动加载第一页数据
- [ ] 分页组件显示正确的总数和页码
- [ ] 表格正确显示审计日志信息
- [ ] 状态徽章正确显示（通过/违规拦截）
- [ ] 手机号正确脱敏显示

### 2. 搜索功能
- [ ] 输入手机号能搜索到对应日志
- [ ] 输入 IP 地址能搜索到对应日志
- [ ] 输入模型名称能搜索到对应日志
- [ ] 搜索结果实时更新（300ms 防抖）
- [ ] 清空搜索框恢复完整列表

### 3. 筛选功能
- [ ] 按审核状态筛选正确过滤
- [ ] 按时间范围筛选正确过滤
- [ ] 组合筛选正确工作
- [ ] 筛选后分页正常

### 4. 详情查看
- [ ] 点击表格行显示详情面板
- [ ] 详情面板滑入动画流畅
- [ ] 显示完整的用户输入和 AI 输出
- [ ] 显示安全元数据（归属地、敏感词等）
- [ ] 点击关闭按钮面板滑出
- [ ] 点击其他行切换详情内容

### 5. 数据导出
- [ ] 点击「导出日志」按钮开始下载
- [ ] CSV 文件格式正确
- [ ] 中文内容显示正常（UTF-8 BOM）
- [ ] 导出数据与当前筛选一致
- [ ] 手机号在导出文件中正确脱敏

### 6. 响应式布局
- [ ] 在 1920px 宽屏幕正常显示
- [ ] 在 1366px 笔记本屏幕正常显示
- [ ] 详情面板在小屏幕上不遮挡主要内容
- [ ] 深色模式切换正常

---

## 备注

1. **手机号脱敏**: 所有展示和导出的手机号必须脱敏（中间4位星号）
2. **IP 归属地**: 可使用免费 IP 库（如 ip2region）或第三方 API，若无法获取则显示 "-"
3. **内容合规分**: 当前为模拟数据（基于 is_sensitive 字段计算），后续可接入真实审核接口
4. **操作按钮**: 详情面板的「加入白名单」「标记违规」按钮仅展示 UI，不调用 API
5. **权限校验**: 所有 API 必须验证管理员权限（role = 0）
6. **操作日志**: 导出操作必须记录到 admin_operation_logs 表
7. **真实 IP**: 从请求头提取 x-forwarded-for 或 x-real-ip

---

**文档维护**: 如实现过程中发现规范不合理或需要调整，请及时更新本文档。

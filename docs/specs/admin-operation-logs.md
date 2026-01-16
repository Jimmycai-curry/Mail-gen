# 管理后台操作日志功能开发规范

## Spec 概述
本规范描述 FluentWJ 管理后台的操作日志功能,用于记录和展示管理员的所有操作行为,包括封禁用户、修改敏感词、处理反馈、配置变更等,支持日志列表展示、搜索、筛选、分页、数据导出等核心功能。

**文档版本**: v1.0  
**创建日期**: 2026-01-16  
**相关 PRD**: `/docs/prd/[PRD] FluentWJ 跨境商务写作助手项目需求文档.md`  
**相关设计稿**: `/docs/ui/fluentwj_admin_audit_log_&_details_1`  
**实施方式**: 规范驱动开发 (SDD)

---

## 功能描述

### 1. 操作日志列表展示
展示系统中所有管理员的操作记录,支持分页浏览。

**核心功能**：
- 表格形式展示操作日志（管理员账号、操作行为、目标ID、详细描述、IP地址、操作时间）
- 分页展示（默认每页 20 条）
- 支持按操作时间倒序排列
- 显示总日志数统计
- 操作类型可视化（彩色标签：红色/橙色/蓝色/紫色/绿色）
- Hover 悬停效果

---

### 2. 搜索功能
支持通过管理员账号快速查找操作日志。

**核心功能**：
- 支持按管理员账号搜索（模糊匹配手机号）
- 实时搜索（300ms 防抖）
- 搜索结果保持分页
- 清空搜索框恢复列表

---

### 3. 筛选功能
支持按操作类型和时间范围进行筛选。

**核心功能**：
- 按操作类型筛选（全部/封禁用户/解封用户/修改敏感词/处理反馈/配置变更）
- 按时间范围筛选（最近24小时/最近7天/最近30天/自定义）
- 支持多条件组合筛选
- 筛选后保持分页
- 显示筛选条件标签

---

### 4. 数据导出
支持将操作日志导出为 CSV 文件。

**核心功能**：
- 导出当前筛选/搜索结果
- CSV 格式（UTF-8 BOM 编码，支持中文）
- 包含字段：日志ID、管理员账号、操作类型、目标ID、详细描述、IP地址、操作时间
- 限制最大导出数量（10,000 条）
- 导出时记录操作日志

---

## 功能逻辑

### 1. 操作日志列表查询流程

```
客户端请求 GET /api/admin/operation-logs?page=1&pageSize=20
  ↓
[Middleware] JWT Token 验证
  ├─ 验证 Token 有效性
  ├─ 解析 userId 和 role
  └─ role !== 0 → 返回 403（非管理员）
  ↓
[API层] 参数校验与解析
  ├─ page: number (默认 1)
  ├─ pageSize: number (默认 20, 最大 100)
  ├─ keyword: string (可选，搜索管理员账号)
  ├─ actionType: string (可选, 操作类型)
  ├─ startDate: string (可选, ISO日期字符串)
  └─ endDate: string (可选, ISO日期字符串)
  ↓
[Service层] getOperationLogs(params)
  ├─ 构建 Prisma 查询条件
  │   ├─ JOIN users 表获取管理员手机号
  │   ├─ 如果有 keyword: phone LIKE %keyword%
  │   ├─ 如果有 actionType: action_type = ?
  │   ├─ 如果有 startDate: created_time >= ?
  │   └─ 如果有 endDate: created_time <= ?
  ├─ 执行两个查询:
  │   ├─ prisma.admin_operation_logs.count() - 获取总数
  │   └─ prisma.admin_operation_logs.findMany() - 获取分页数据
  ├─ 计算偏移量: skip = (page - 1) * pageSize
  ├─ 按 created_time DESC 排序
  ├─ 获取管理员手机号（完整显示，不脱敏）
  └─ 返回 { list: OperationLog[], total: number }
  ↓
[API层] 返回 JSON 响应
  └─ { code: 200, data: { list, total } }
```

---

### 2. 搜索实时查询流程

```
用户输入搜索关键词（管理员账号）
  ↓
[前端] 防抖处理 (300ms)
  └─ 避免频繁请求
  ↓
[前端] 发送 GET /api/admin/operation-logs?keyword=关键词&page=1
  ├─ 重置页码为 1
  └─ 保持当前筛选条件（actionType, startDate, endDate）
  ↓
[后端] 执行搜索查询
  ├─ 手机号模糊匹配: phone LIKE '%关键词%'
  └─ 返回匹配结果
  ↓
[前端] 更新列表展示
  └─ 显示搜索结果
```

---

### 3. 数据导出流程

```
用户点击「导出日志」按钮
  ↓
[前端] 发送 GET /api/admin/operation-logs/export?keyword=...&actionType=...&startDate=...&endDate=...
  └─ 携带当前筛选条件
  ↓
[Middleware] JWT Token 验证 + 管理员权限校验
  ↓
[Service层] exportOperationLogs(params)
  ├─ 检查导出数量
  │   ├─ 执行 count 查询
  │   └─ 超过 10,000 → 抛出 ValidationError
  ├─ 查询所有匹配数据（不分页）
  │   └─ prisma.admin_operation_logs.findMany({ where, orderBy })
  ├─ 生成 CSV 内容
  │   ├─ 表头: 日志ID,管理员账号,操作类型,目标ID,详细描述,IP地址,操作时间
  │   ├─ 数据行: 逐行拼接
  │   ├─ 管理员账号完整显示（不脱敏）
  │   ├─ 操作类型中文转换（BAN_USER → 封禁用户）
  │   └─ UTF-8 BOM 编码（\uFEFF）
  ├─ 记录操作日志到 admin_operation_logs
  └─ 返回 CSV 字符串
  ↓
[API层] 设置响应头
  ├─ Content-Type: text/csv; charset=utf-8
  ├─ Content-Disposition: attachment; filename="operation_logs_时间戳.csv"
  └─ 返回 CSV 内容
  ↓
[前端] 浏览器自动下载文件
```

---

## 接口定义

### 1. GET /api/admin/operation-logs - 获取操作日志列表

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**Query 参数**:
```typescript
{
  page?: number          // 页码，默认 1
  pageSize?: number      // 每页数量，默认 20，最大 100
  keyword?: string       // 搜索关键词（管理员账号）
  actionType?: string    // 操作类型筛选
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
        "adminAccount": "13800138000",
        "actionType": "BAN_USER",
        "targetId": "USR_99210",
        "detail": "违规发布虚假广告信息，经多次警告无效，执行永久封禁。",
        "ip": "182.16.4.122",
        "createdTime": "2023-10-24T14:20:05.000Z"
      }
    ],
    "total": 1280
  }
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 参数格式错误

---

### 2. GET /api/admin/operation-logs/export - 导出操作日志

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**Query 参数**:
```typescript
{
  keyword?: string       // 搜索关键词
  actionType?: string    // 操作类型筛选
  startDate?: string     // 开始时间
  endDate?: string       // 结束时间
}
```

**成功响应** (200):
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="operation_logs_20260116_143022.csv"`
- Body: CSV 文件内容

**CSV 格式**:
```csv
日志ID,管理员账号,操作类型,目标ID,详细描述,IP地址,操作时间
uuid-1234,13800138000,封禁用户,USR_99210,违规发布虚假广告信息,182.16.4.122,2023-10-24 14:20:05
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 导出数量超过限制（10,000条）

---

## 数据库变更

### 无需修改 Prisma Schema

当前 `admin_operation_logs` 表结构已满足需求：

```prisma
model admin_operation_logs {
  id           String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  admin_id     String    @db.Uuid
  action_type  String    @db.VarChar(50)
  target_id    String?   @db.VarChar(50)
  detail       String?
  ip           String?   @db.VarChar(45)
  created_time DateTime? @default(now()) @db.Timestamptz(6)
}
```

**说明**:
- `admin_id` 通过 JOIN `users` 表获取管理员手机号（完整显示，不脱敏）
- `action_type` 存储操作类型（BAN_USER, UNBAN_USER 等）
- `target_id` 存储被操作对象的ID
- `detail` 存储操作详情描述
- `ip` 存储管理员操作时的IP地址

**建议添加索引**（如需优化性能）:
```sql
CREATE INDEX idx_admin_operation_logs_admin_id ON admin_operation_logs(admin_id);
CREATE INDEX idx_admin_operation_logs_action_type ON admin_operation_logs(action_type);
CREATE INDEX idx_admin_operation_logs_created_time ON admin_operation_logs(created_time DESC);
```

---

## 数据字典

### 操作类型 (action_type)

| 值 | 中文显示 | 前端样式 | 说明 |
|----|---------|---------|------|
| BAN_USER | 封禁用户 | 红色圆点 + 红色背景 | 管理员封禁违规用户 |
| UNBAN_USER | 解封用户 | 绿色圆点 + 绿色背景 | 管理员解除用户封禁 |
| UPDATE_SENSITIVE_WORDS | 修改敏感词 | 橙色圆点 + 橙色背景 | 管理员更新敏感词库 |
| PROCESS_FEEDBACK | 处理反馈 | 蓝色圆点 + 蓝色背景 | 管理员处理用户反馈 |
| CONFIG_CHANGE | 配置变更 | 紫色圆点 + 紫色背景 | 管理员修改系统配置 |
| CREATE_USER | 创建用户 | 绿色圆点 + 绿色背景 | 管理员创建新用户 |
| DELETE_USER | 删除用户 | 红色圆点 + 红色背景 | 管理员删除用户 |
| UPDATE_USER | 修改用户 | 蓝色圆点 + 蓝色背景 | 管理员修改用户信息 |

### 目标 ID 格式

| 操作类型 | 目标ID格式 | 示例 |
|---------|-----------|------|
| BAN_USER / UNBAN_USER | USR_{用户ID后5位} | USR_99210 |
| UPDATE_SENSITIVE_WORDS | DIC_{词库ID} | DIC_004 |
| PROCESS_FEEDBACK | FBK_{反馈ID后4位} | FBK_8832 |
| CONFIG_CHANGE | SYS_CONF | SYS_CONF |

---

## 异常处理

### 1. 权限不足

**场景**: 非管理员访问操作日志 API

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

### 2. 导出数据过大限制

**场景**: 导出数据超过 10,000 条

**处理**:
```typescript
const count = await prisma.admin_operation_logs.count({ where })
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

### 3. 参数格式错误

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

### 记录操作日志

所有导出操作必须记录到 `admin_operation_logs` 表：

| 操作类型 | action_type | 记录内容 |
|---------|-------------|---------|
| 导出数据 | EXPORT_OPERATION_LOGS | 导出条件、数量 |

**日志结构**:
```typescript
{
  admin_id: string      // 操作管理员 ID
  action_type: 'EXPORT_OPERATION_LOGS'
  target_id: null
  detail: string        // 例："导出 328 条操作日志，筛选条件：actionType=BAN_USER，时间范围：2023-10-01 ~ 2023-10-31"
  ip: string            // 操作 IP
  created_time: Date    // 操作时间
}
```

---

## 性能优化

### 1. 数据库索引

建议添加以下索引（SQL）：
```sql
CREATE INDEX idx_admin_operation_logs_admin_id ON admin_operation_logs(admin_id);
CREATE INDEX idx_admin_operation_logs_action_type ON admin_operation_logs(action_type);
CREATE INDEX idx_admin_operation_logs_created_time ON admin_operation_logs(created_time DESC);
```

### 2. 分页查询

使用 Prisma `skip` 和 `take` 实现分页：
```typescript
const logs = await prisma.admin_operation_logs.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  where,
  include: {
    // JOIN users 表获取管理员信息
  },
  orderBy: { created_time: 'desc' }
})
```

### 3. 搜索优化

对于管理员账号模糊匹配，先 JOIN 再筛选：
```typescript
// 通过 admin_id 关联 users 表
where: {
  users: {
    phone: { contains: keyword }
  }
}
```

### 4. 数据显示

管理员账号（手机号）完整显示，不进行脱敏处理：
```typescript
// 直接显示完整手机号
const adminAccount = adminPhone || '-';
// 示例: "13800138000"（完整显示）
```

**说明**: 操作日志用于内部审计，需要完整记录管理员信息，因此不进行脱敏。

---

## 前端设计规范

### 设计风格: 现代企业级仪表板 (Modern Enterprise Dashboard)

**Typography**:
- 主字体: Inter（与后台其他页面保持一致）
- 中文字体: Noto Sans SC
- 图标字体: Material Symbols Outlined

**Color Palette**:
- 主色调: #0052D9（FluentWJ 品牌色）
- 封禁用户: #EF4444（红色）
- 修改敏感词: #F97316（橙色）
- 处理反馈: #3B82F6（蓝色）
- 配置变更: #A855F7（紫色）
- 解封用户: #10B981（绿色）
- 中性灰: #64748B
- 背景色: #f5f6f8（浅灰）
- 卡片背景: #FFFFFF

**Spacing**:
- 表格行高: 64px
- 表格内边距: px-6 py-4
- 搜索栏高度: 48px
- 卡片圆角: rounded-xl (12px)
- 按钮圆角: rounded-lg (8px)

**Micro-interactions**:
- 表格行 hover: bg-slate-50/80 + transition-colors
- 按钮 hover: hover:bg-slate-50 + transition-all
- 搜索框聚焦: focus:ring-primary focus:border-primary
- 下拉菜单展开: slide-in animation

**Layout Structure**:
```
┌─────────────────────────────────────────────────┐
│ Header (80px)                                   │
│ - 标题 + 副标题                                  │
│ - 导出按钮                                       │
├─────────────────────────────────────────────────┤
│ Filters (64px)                                  │
│ - 搜索框 + 操作类型筛选 + 时间筛选               │
├─────────────────────────────────────────────────┤
│ Table (flex-1, overflow-auto)                   │
│ - 6列数据 + Hover效果                           │
├─────────────────────────────────────────────────┤
│ Pagination (56px)                               │
│ - 数据统计 + 上一页/下一页按钮                   │
└─────────────────────────────────────────────────┘
```

---

## 测试用例

### 1. 操作日志列表加载
- [ ] 页面打开自动加载第一页数据
- [ ] 分页组件显示正确的总数和页码
- [ ] 表格正确显示操作日志信息
- [ ] 操作类型徽章正确显示且颜色符合设计稿
- [ ] 管理员账号完整显示（不脱敏）

### 2. 搜索功能
- [ ] 输入管理员账号能搜索到对应日志
- [ ] 搜索结果实时更新（300ms 防抖）
- [ ] 清空搜索框恢复完整列表
- [ ] 搜索结果保持分页

### 3. 筛选功能
- [ ] 按操作类型筛选正确过滤
- [ ] 按时间范围筛选正确过滤
- [ ] 组合筛选正确工作
- [ ] 筛选后分页正常

### 4. 数据导出
- [ ] 点击「导出日志」按钮开始下载
- [ ] CSV 文件格式正确
- [ ] 中文内容显示正常（UTF-8 BOM）
- [ ] 导出数据与当前筛选一致
- [ ] 管理员账号在导出文件中完整显示
- [ ] 超过10,000条时显示错误提示

### 5. 权限控制
- [ ] 非管理员访问返回403
- [ ] Token过期时返回401
- [ ] 管理员正常访问

### 6. 响应式布局
- [ ] 在 1920px 宽屏幕正常显示
- [ ] 在 1366px 笔记本屏幕正常显示
- [ ] 表格在小屏幕上可横向滚动
- [ ] 深色模式切换正常

---

## 备注

1. **管理员账号显示**: 管理员账号（手机号）完整显示，不脱敏（用于内部审计）
2. **操作类型映射**: 前端需要将 `action_type` 英文值转换为中文显示
3. **权限校验**: 所有 API 必须验证管理员权限（role = 0）
4. **操作日志记录**: 导出操作必须记录到 admin_operation_logs 表
5. **真实 IP**: 从请求头提取 x-forwarded-for 或 x-real-ip
6. **性能考虑**: 如日志量超过百万级，考虑添加数据库索引或引入 Redis 缓存

---

**文档维护**: 如实现过程中发现规范不合理或需要调整，请及时更新本文档。

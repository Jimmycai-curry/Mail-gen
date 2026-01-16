# 管理后台用户管理功能开发规范

## Spec 概述
本规范描述 FluentWJ 管理后台的用户管理功能，包括用户列表展示、搜索、筛选、状态管理、新增用户、数据导出等核心功能。

**文档版本**: v1.0  
**创建日期**: 2025-01-16  
**相关 PRD**: `/docs/prd/[PRD] FluentWJ 跨境商务写作助手项目需求文档.md`  
**相关设计稿**: `/docs/ui/fluentwj_admin_user_management`  
**实施方式**: 规范驱动开发 (SDD)

---

## 功能描述

### 1. 用户列表展示
展示系统中所有用户的基本信息，支持分页浏览。

**核心功能**：
- 表格形式展示用户信息（ID、手机号、角色、状态、注册时间、最后登录）
- 分页展示（默认每页 10 条）
- 支持按注册时间倒序排列
- 显示总用户数统计
- 状态可视化（正常/已封禁）

---

### 2. 搜索功能
支持通过关键词快速查找用户。

**核心功能**：
- 支持按手机号搜索（精确匹配或模糊匹配）
- 支持按用户 ID 搜索（精确匹配）
- 实时搜索（300ms 防抖）
- 搜索结果保持分页
- 清空搜索框恢复列表

---

### 3. 筛选功能
支持按用户角色和状态进行筛选。

**核心功能**：
- 按角色筛选（管理员/普通用户）
- 按状态筛选（正常/已封禁）
- 支持多条件组合筛选
- 筛选后保持分页
- 显示筛选条件标签

---

### 4. 用户状态管理
管理员可以启用或禁用用户账户。

**核心功能**：
- 禁用正常用户（status: 1 → 0）
- 启用已封禁用户（status: 0 → 1）
- 操作前二次确认
- 状态变更实时反馈
- 记录操作日志到 admin_operation_logs

---

### 5. 新增用户
管理员可以手动创建新用户账户。

**核心功能**：
- 填写手机号（必填，格式验证）
- 选择用户角色（管理员/普通用户）
- 手机号唯一性校验
- 自动生成用户 ID
- 创建成功后刷新列表
- 记录操作日志

---

### 6. 数据导出
支持将用户数据导出为 CSV 文件。

**核心功能**：
- 导出当前筛选/搜索结果
- CSV 格式（UTF-8 BOM 编码，支持中文）
- 包含字段：用户ID、手机号、角色、状态、注册时间、最后登录时间
- 限制最大导出数量（10,000 条）
- 大数据量异步导出（可选）

---

## 功能逻辑

### 1. 用户列表查询流程

```
客户端请求 GET /api/admin/users?page=1&pageSize=10
  ↓
[Middleware] JWT Token 验证
  ├─ 验证 Token 有效性
  ├─ 解析 userId 和 role
  └─ role !== 0 → 返回 403（非管理员）
  ↓
[API层] 参数校验与解析
  ├─ page: number (默认 1)
  ├─ pageSize: number (默认 10, 最大 100)
  ├─ search: string (可选)
  ├─ role: number (可选, 0=管理员, 1=普通用户)
  └─ status: number (可选, 0=封禁, 1=正常)
  ↓
[Service层] getUserList(query)
  ├─ 构建 Prisma 查询条件
  │   ├─ 如果有 search: 手机号 LIKE 或 ID 精确匹配
  │   ├─ 如果有 role: role = ?
  │   └─ 如果有 status: status = ?
  ├─ 执行两个查询:
  │   ├─ prisma.users.count() - 获取总数
  │   └─ prisma.users.findMany() - 获取分页数据
  ├─ 计算偏移量: skip = (page - 1) * pageSize
  ├─ 按 created_time DESC 排序
  └─ 返回 { users, total, page, pageSize }
  ↓
[API层] 返回 JSON 响应
  └─ { success: true, data: { users, total, page, pageSize } }
```

---

### 2. 搜索实时查询流程

```
用户输入搜索关键词
  ↓
[前端] 防抖处理 (300ms)
  └─ 避免频繁请求
  ↓
[前端] 发送 GET /api/admin/users?search=关键词&page=1
  ├─ 重置页码为 1
  └─ 保持当前筛选条件
  ↓
[后端] 执行搜索查询
  ├─ 手机号模糊匹配: phone LIKE '%关键词%'
  ├─ 或 ID 精确匹配: id = '关键词'
  └─ 返回匹配结果
  ↓
[前端] 更新列表展示
  └─ 显示搜索结果 + 高亮关键词
```

---

### 3. 状态切换流程

```
用户点击「禁用账户」或「启用账户」按钮
  ↓
[前端] 弹出确认对话框
  ├─ 显示用户信息（手机号）
  ├─ 显示操作类型（禁用/启用）
  └─ 危险操作警告（禁用时）
  ↓
用户确认操作
  ↓
[前端] 发送 PUT /api/admin/users/:id/status
  └─ Body: { status: 0 或 1 }
  ↓
[Middleware] JWT Token 验证 + 管理员权限校验
  ↓
[API层] 参数校验
  ├─ userId: string (UUID 格式)
  ├─ status: number (0 或 1)
  └─ 验证失败 → 返回 400
  ↓
[Service层] updateUserStatus(userId, status, adminId, adminIp)
  ├─ 检查用户是否存在
  │   └─ 不存在 → 抛出 NotFoundError
  ├─ 检查是否为自己
  │   └─ 禁用自己 → 抛出 ValidationError
  ├─ 更新用户状态
  │   └─ prisma.users.update({ where: { id }, data: { status } })
  ├─ 记录操作日志
  │   └─ prisma.admin_operation_logs.create({
  │         admin_id: adminId,
  │         action_type: status === 0 ? 'DISABLE_USER' : 'ENABLE_USER',
  │         target_id: userId,
  │         detail: `修改用户 ${phone} 状态为 ${status}`,
  │         ip: adminIp
  │       })
  └─ 返回更新后的用户信息
  ↓
[API层] 返回成功响应
  └─ { success: true, data: { user } }
  ↓
[前端] 关闭对话框 + 刷新列表 + Toast 提示
```

---

### 4. 新增用户流程

```
用户点击「新增用户」按钮
  ↓
[前端] 弹出新增用户对话框
  ├─ 表单字段: 手机号、角色
  └─ 表单验证: 手机号格式（11位，1开头）
  ↓
用户填写表单并提交
  ↓
[前端] 发送 POST /api/admin/users
  └─ Body: { phone, role }
  ↓
[Middleware] JWT Token 验证 + 管理员权限校验
  ↓
[API层] 参数校验
  ├─ phone: string (11位，1开头)
  ├─ role: number (0 或 1)
  └─ 验证失败 → 返回 400
  ↓
[Service层] createUser(phone, role, adminId, adminIp)
  ├─ 检查手机号是否已存在
  │   ├─ prisma.users.findUnique({ where: { phone } })
  │   └─ 已存在 → 抛出 ValidationError
  ├─ 创建新用户
  │   └─ prisma.users.create({
  │         phone,
  │         role,
  │         status: 1,
  │         password_hash: '' // 首次登录强制设置密码
  │       })
  ├─ 记录操作日志
  │   └─ prisma.admin_operation_logs.create({
  │         admin_id: adminId,
  │         action_type: 'CREATE_USER',
  │         target_id: newUser.id,
  │         detail: `创建用户 ${phone}, 角色: ${role}`,
  │         ip: adminIp
  │       })
  └─ 返回新用户信息
  ↓
[API层] 返回成功响应
  └─ { success: true, data: { userId, phone } }
  ↓
[前端] 关闭对话框 + 刷新列表 + Toast 提示
```

---

### 5. 数据导出流程

```
用户点击「导出」按钮
  ↓
[前端] 发送 GET /api/admin/users/export?search=...&role=...&status=...
  └─ 携带当前筛选条件
  ↓
[Middleware] JWT Token 验证 + 管理员权限校验
  ↓
[Service层] exportUsers(query)
  ├─ 检查导出数量
  │   ├─ 执行 count 查询
  │   └─ 超过 10,000 → 抛出 ValidationError
  ├─ 查询所有匹配数据（不分页）
  │   └─ prisma.users.findMany({ where, orderBy })
  ├─ 生成 CSV 内容
  │   ├─ 表头: 用户ID,手机号,角色,状态,注册时间,最后登录时间
  │   ├─ 数据行: 逐行拼接
  │   └─ UTF-8 BOM 编码（\uFEFF）
  └─ 返回 CSV 字符串
  ↓
[API层] 设置响应头
  ├─ Content-Type: text/csv; charset=utf-8
  ├─ Content-Disposition: attachment; filename="users_导出时间.csv"
  └─ 返回 CSV 内容
  ↓
[前端] 浏览器自动下载文件
```

---

## 接口定义

### 1. GET /api/admin/users - 获取用户列表

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**Query 参数**:
```typescript
{
  page?: number          // 页码，默认 1
  pageSize?: number      // 每页数量，默认 10，最大 100
  search?: string        // 搜索关键词（手机号或ID）
  role?: number          // 角色筛选（0=管理员, 1=普通用户）
  status?: number        // 状态筛选（0=封禁, 1=正常）
}
```

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "phone": "13800138000",
        "role": 1,
        "status": 1,
        "created_time": "2023-11-12T06:20:00.000Z",
        "last_login_time": "2023-11-15T03:45:00.000Z",
        "last_login_ip": "192.168.1.1"
      }
    ],
    "total": 1240,
    "page": 1,
    "pageSize": 10
  }
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 参数格式错误

---

### 2. PUT /api/admin/users/:id/status - 更新用户状态

**请求方式**: PUT  
**权限要求**: 管理员（role = 0）

**URL 参数**:
- `id`: 用户 UUID

**Request Body**:
```json
{
  "status": 0  // 0=封禁, 1=正常
}
```

**成功响应** (200):
```json
{
  "success": true,
  "message": "用户状态更新成功",
  "data": {
    "id": "uuid",
    "phone": "13800138000",
    "status": 0
  }
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 404: 用户不存在
- 400: 不能禁用自己

---

### 3. POST /api/admin/users - 新增用户

**请求方式**: POST  
**权限要求**: 管理员（role = 0）

**Request Body**:
```json
{
  "phone": "13900139000",
  "role": 1  // 0=管理员, 1=普通用户
}
```

**成功响应** (201):
```json
{
  "success": true,
  "message": "用户创建成功",
  "data": {
    "userId": "uuid",
    "phone": "13900139000",
    "role": 1
  }
}
```

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 手机号格式错误
- 409: 手机号已存在

---

### 4. GET /api/admin/users/export - 导出用户数据

**请求方式**: GET  
**权限要求**: 管理员（role = 0）

**Query 参数**:
```typescript
{
  search?: string        // 搜索关键词
  role?: number          // 角色筛选
  status?: number        // 状态筛选
}
```

**成功响应** (200):
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="users_20250116.csv"`
- Body: CSV 文件内容

**错误响应**:
- 401: Token 无效或过期
- 403: 非管理员权限
- 400: 导出数量超过限制（10,000条）

---

## 数据库变更

### 无需修改 Prisma Schema

当前 `users` 表结构已满足需求：

```prisma
model users {
  id              String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  phone           String    @unique @db.VarChar(20)
  password_hash   String?
  role            Int?      @default(1) @db.SmallInt
  status          Int?      @default(1) @db.SmallInt
  last_login_ip   String?   @db.VarChar(45)
  last_login_time DateTime? @db.Timestamptz(6)
  created_time    DateTime? @default(now()) @db.Timestamptz(6)
  updated_time    DateTime? @default(now()) @db.Timestamptz(6)

  @@index([phone], map: "idx_users_phone")
  @@index([role, status], map: "idx_users_role_status")
}
```

**说明**:
- 暂时用 `phone` 字段代替「姓名」显示
- 后续如需添加 `name` 字段，需执行数据库迁移

---

## 异常处理

### 1. 权限不足

**场景**: 非管理员访问管理后台 API

**处理**:
```typescript
if (userRole !== 0) {
  throw new ForbiddenError('需要管理员权限')
}
```

**响应**:
```json
{
  "success": false,
  "error": "需要管理员权限",
  "code": 403
}
```

---

### 2. 用户不存在

**场景**: 更新状态时用户 ID 不存在

**处理**:
```typescript
const user = await prisma.users.findUnique({ where: { id } })
if (!user) {
  throw new NotFoundError('用户不存在')
}
```

**响应**:
```json
{
  "success": false,
  "error": "用户不存在",
  "code": 404
}
```

---

### 3. 状态更新冲突

**场景**: 管理员尝试禁用自己的账户

**处理**:
```typescript
if (userId === adminId && status === 0) {
  throw new ValidationError('不能禁用自己的账户')
}
```

**响应**:
```json
{
  "success": false,
  "error": "不能禁用自己的账户",
  "code": 400
}
```

---

### 4. 导出数据过大限制

**场景**: 导出数据超过 10,000 条

**处理**:
```typescript
const count = await prisma.users.count({ where })
if (count > 10000) {
  throw new ValidationError(`数据量过大，最多支持导出 10,000 条记录，当前 ${count} 条`)
}
```

**响应**:
```json
{
  "success": false,
  "error": "数据量过大，最多支持导出 10,000 条记录，当前 15000 条",
  "code": 400
}
```

---

### 5. 手机号已存在

**场景**: 新增用户时手机号重复

**处理**:
```typescript
const existing = await prisma.users.findUnique({ where: { phone } })
if (existing) {
  throw new ValidationError('手机号已存在')
}
```

**响应**:
```json
{
  "success": false,
  "error": "手机号已存在",
  "code": 409
}
```

---

## 安全审计

### 操作日志记录

所有关键操作必须记录到 `admin_operation_logs` 表：

| 操作类型 | action_type | 记录内容 |
|---------|-------------|---------|
| 禁用用户 | DISABLE_USER | 目标用户ID、手机号 |
| 启用用户 | ENABLE_USER | 目标用户ID、手机号 |
| 新增用户 | CREATE_USER | 新用户ID、手机号、角色 |
| 导出数据 | EXPORT_USERS | 导出条件、数量 |

**日志结构**:
```typescript
{
  admin_id: string      // 操作管理员 ID
  action_type: string   // 操作类型
  target_id: string     // 目标用户 ID（可选）
  detail: string        // 操作详情
  ip: string            // 操作 IP
  created_time: Date    // 操作时间
}
```

---

## 性能优化

### 1. 数据库索引

确保以下索引存在：
- `idx_users_phone` - 手机号搜索
- `idx_users_role_status` - 筛选查询
- `idx_users_created_time` - 排序优化

### 2. 分页查询

使用 Prisma `skip` 和 `take` 实现分页：
```typescript
const users = await prisma.users.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  where,
  orderBy: { created_time: 'desc' }
})
```

### 3. 搜索优化

对于手机号搜索，优先使用精确匹配（利用索引）：
```typescript
// 优先精确匹配
where: { phone: search }

// 或模糊匹配（性能较差）
where: { phone: { contains: search } }
```

---

## 前端设计规范

### 设计风格: 精致简约 (Refined Minimalism)

**Typography**:
- 主字体: IBM Plex Sans
- 中文字体: Noto Sans SC
- 避免使用 Inter（过于常见）

**Color Palette**:
- 主色调: #0054db（FluentWJ 品牌色）
- 成功/正常: #10B981（绿色）
- 危险/封禁: #EF4444（红色）
- 中性灰: #64748B

**Spacing**:
- 表格行高: 56px
- 表格内边距: px-6 py-4
- 卡片圆角: rounded-xl (12px)
- 按钮圆角: rounded-lg (8px)

**Micro-interactions**:
- 表格行 hover: bg-slate-50 transition-colors
- 按钮 hover: scale-105 + shadow-md
- 搜索框聚焦: ring-2 ring-primary/20
- 状态指示器: 小圆点闪烁动画（pulse）

---

## 测试用例

### 1. 用户列表加载
- [ ] 页面打开自动加载第一页数据
- [ ] 分页组件显示正确的总数和页码
- [ ] 表格正确显示用户信息
- [ ] 状态徽章正确显示（正常/已封禁）

### 2. 搜索功能
- [ ] 输入手机号能搜索到对应用户
- [ ] 输入用户 ID 能搜索到对应用户
- [ ] 搜索结果实时更新（300ms 防抖）
- [ ] 清空搜索框恢复完整列表

### 3. 筛选功能
- [ ] 按角色筛选正确过滤
- [ ] 按状态筛选正确过滤
- [ ] 组合筛选正确工作
- [ ] 筛选后分页正常

### 4. 状态切换
- [ ] 点击「禁用账户」弹出确认框
- [ ] 确认后用户状态更新为已封禁
- [ ] 点击「启用账户」恢复正常状态
- [ ] 操作成功显示 Toast 提示

### 5. 新增用户
- [ ] 点击「新增用户」弹出对话框
- [ ] 手机号格式验证正常
- [ ] 手机号重复显示错误提示
- [ ] 创建成功后列表自动刷新

### 6. 数据导出
- [ ] 点击「导出」按钮开始下载
- [ ] CSV 文件格式正确
- [ ] 中文内容显示正常（UTF-8 BOM）
- [ ] 导出数据与当前筛选一致

---

## 备注

1. **暂用 phone 代替 name**: 由于数据库暂无 `name` 字段，界面上「姓名」列暂时显示手机号
2. **后续扩展**: 如需添加姓名、邮箱等字段，需修改 Prisma schema 并执行迁移
3. **权限校验**: 所有 API 必须验证管理员权限（role = 0）
4. **操作日志**: 关键操作必须记录到 admin_operation_logs 表
5. **真实 IP**: 从请求头提取 x-forwarded-for 或 x-real-ip

---

**文档维护**: 如实现过程中发现规范不合理或需要调整，请及时更新本文档。

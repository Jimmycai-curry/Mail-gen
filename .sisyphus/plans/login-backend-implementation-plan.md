# 登录逻辑后端开发实施计划

**项目**: FluentWJ 跨境商务写作助手  
**功能**: 登录后端API开发（阿里云SMS + 双模式登录 + 强制密码设置）  
**创建日期**: 2025-01-14  
**状态**: 规划阶段，待用户确认后实施

---

## 📋 一、现状分析

### 1.1 已完成的基础设施 ✅

| 组件 | 状态 | 说明 |
|------|------|------|
| **前端登录页面** | ✅ 完成 | `app/(auth)/login/page.tsx` + `components/auth/LoginForm.tsx` |
| **数据库Schema** | ✅ 完成 | `prisma/schema.prisma` - users表（password_hash为可选） |
| **阿里云SMS封装** | ✅ 完成 | `lib/sms.ts` - 已实现sendSMS()函数 |
| **Redis连接** | ✅ 完成 | `lib/redis.ts` - 单例模式，支持TTL |
| **Prisma连接** | ✅ 完成 | `lib/db.ts` - 单例模式，自动断连 |
| **JWT工具** | ✅ 完成 | `utils/jwt.ts` - generateToken/verifyToken/decodeToken |
| **表单验证** | ✅ 完成 | `utils/validation.ts` - 手机号/密码/验证码验证 |
| **技术规范** | ✅ 完成 | `docs/specs/login-backend.md` - 详细接口定义和逻辑流程 |

### 1.2 待实现的功能模块 ❌

| 模块 | 状态 | 说明 |
|------|------|------|
| **类型定义** | ❌ 待创建 | `types/auth.ts` - TypeScript接口定义 |
| **Service层** | ❌ 待创建 | `services/auth.service.ts` - 核心业务逻辑 |
| **API路由** | ❌ 待创建 | `app/api/auth/*` - 5个RESTful接口 |
| **中间件** | ❌ 待创建 | `middleware.ts` - JWT认证中间件 |
| **密码设置页面** | ❌ 待创建 | `app/(auth)/set-password/page.tsx` |
| **前端API集成** | ❌ 待更新 | LoginForm对接真实API |

### 1.3 新增需求分析 🔴

**用户核心需求**：
> 用户首次登录使用验证码登录注册，注册后要求用户设置密码，以后用户可以自由选择使用验证码或密码进行登录。

**关键变更**：
1. 首次验证码登录后，如果 `password_hash === null`，返回 `needsPasswordSetup: true`
2. 前端强制跳转到密码设置页面
3. 用户设置密码后，才能进入系统
4. 以后可选择SMS验证码或密码登录

---

## 🎯 二、实施目标

### 2.1 核心功能

1. ✅ **短信验证码发送**：60秒冷却、每日10次限制、Redis存储（5分钟过期）
2. ✅ **验证码登录**：验证码校验、自动创建用户、强制密码设置检测
3. ✅ **密码登录**：bcrypt验证、用户状态检查
4. ✅ **强制密码设置**：首次登录后跳转设置页面
5. ✅ **JWT认证**：Token生成、验证、中间件保护

---

## 📐 三、架构设计

### 3.1 分层架构

```
前端层 → API路由层 → Service层 → Lib层 → Utils层
```

### 3.2 数据流：验证码登录 + 强制密码设置

```
用户输入手机号 + 验证码
  ↓
POST /api/auth/login (mode='code')
  ↓
[Service层]
  1. 验证手机号格式
  2. 从Redis验证验证码
  3. 查询用户，不存在则创建（password_hash=null）
  4. 检查用户状态
  5. 更新登录信息
  6. 生成JWT Token
  7. 删除Redis验证码
  8. 判断 needsPasswordSetup = (password_hash === null)
  ↓
返回响应 { token, user, needsPasswordSetup: true/false }
  ↓
前端处理：
  - 保存token到localStorage
  - 如果 needsPasswordSetup = true → 跳转到 /set-password
  - 如果 needsPasswordSetup = false → 跳转到 /dashboard
  ↓
用户设置密码
  ↓
POST /api/auth/set-password
  ↓
更新数据库 password_hash = bcrypt哈希值
  ↓
跳转到 /dashboard
```

---

## 🔧 四、实施步骤

### 阶段1：类型定义和错误处理（P0 - 0.5天）

#### 文件1: `types/auth.ts`
创建所有认证相关的TypeScript接口：
- SendCodeRequest, LoginRequest, SetPasswordRequest
- ApiResponse, LoginResponse, UserResponse
- SendCodeResult, LoginResult
- LoginLog, AuditLog

#### 文件2: `utils/error.ts`
创建统一错误处理：
- AppError基类
- ValidationError (400)
- UnauthorizedError (401)
- ForbiddenError (403)
- NotFoundError (404)
- RateLimitError (429)
- handleError() 工具函数
- withErrorHandler() 包装器

### 阶段2：Service层核心业务逻辑（P0 - 1.5天）

#### 文件3: `services/sms.service.ts`
短信验证码服务：
- generateCode() - 生成6位验证码
- sendVerificationCode() - 发送验证码（含限流）
- verifyCode() - 验证验证码
- consumeCode() - 删除已使用的验证码

Redis keys:
- `sms_code:{phone}` - 验证码（TTL: 300s）
- `sms_cooldown:{phone}` - 冷却时间（TTL: 60s）
- `sms_count:{phone}:{date}` - 每日发送次数（TTL: 86400s）

#### 文件4: `services/user.service.ts`
用户服务：
- getUserByPhone() - 查询用户
- createUser() - 创建新用户（password_hash=null）
- updateLoginInfo() - 更新登录信息
- verifyPassword() - bcrypt验证密码
- setPassword() - 设置密码（首次或修改）
- updatePassword() - 修改密码（验证旧密码）
- checkUserStatus() - 检查用户状态

#### 文件5: `services/auth.service.ts`
认证服务：
- loginWithCode() - 验证码登录
  - 验证码校验
  - 查询/创建用户
  - 状态检查
  - 生成JWT
  - 返回 needsPasswordSetup 标志
- loginWithPassword() - 密码登录
- setPasswordAfterLogin() - 设置密码
- getCurrentUser() - 获取当前用户

### 阶段3：API路由层实现（P0 - 1天）

#### 文件6: `utils/request.ts`
请求工具：
- getClientIP() - 从请求头提取真实IP

#### 文件7-11: API路由
1. `app/api/auth/send-code/route.ts` - POST 发送验证码
2. `app/api/auth/login/route.ts` - POST 登录（code/password双模式）
3. `app/api/auth/set-password/route.ts` - POST 设置密码（需认证）
4. `app/api/auth/me/route.ts` - GET 获取当前用户（需认证）
5. `app/api/auth/update-password/route.ts` - POST 修改密码（需认证）

每个API路由：
- 使用 withErrorHandler 包装
- 提取user_ip
- 调用Service层
- 返回标准响应格式

### 阶段4：前端页面实现（P1 - 1天）

#### 文件12: `app/(auth)/set-password/page.tsx`
密码设置页面：
- Logo和标题
- 密码输入框 + 可见性切换
- 确认密码输入框
- 密码强度提示（可选）
- 提交按钮
- 成功后跳转到dashboard

关键逻辑：
```typescript
// 从localStorage读取token
const token = localStorage.getItem('auth_token');

// 调用API
await fetch('/api/auth/set-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({ password, confirmPassword }),
});

// 跳转
router.push('/dashboard');
```

#### 修改: `components/auth/LoginForm.tsx`
集成真实API：
- 实现 `/api/auth/send-code` 调用
- 实现 `/api/auth/login` 调用
- 保存JWT token到localStorage
- 处理 `needsPasswordSetup` 标志，跳转到 `/set-password`
- 替换alert为toast错误提示

### 阶段5：中间件和路由保护（P1 - 0.5天）

#### 文件13: `middleware.ts`
路由保护：
- PROTECTED_ROUTES: ['/dashboard', '/settings']
- 验证JWT token
- 未登录重定向到 `/login`
- 已登录访问 `/login` 重定向到 `/dashboard`
- 配置matcher

### 阶段6：测试（P2 - 1天）

#### 文件14-15: 测试文件
1. `tests/api/auth.test.ts` - API集成测试
2. `tests/services/auth.service.test.ts` - Service单元测试

测试覆盖：
- 发送验证码（成功/冷却/超限）
- 验证码登录（新用户/老用户/封禁/验证码错误）
- 密码登录（成功/失败/未设置密码）
- 设置密码（成功/不一致）
- JWT验证（有效/过期/无效）

---

## 📊 五、数据库Schema确认

### 当前Schema（无需变更）✅

```prisma
model users {
  id              String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  phone           String    @unique @db.VarChar(20)
  password_hash   String?   // 可选，首次登录为空，设置密码后为bcrypt哈希
  role            Int?      @default(1) @db.SmallInt
  status          Int?      @default(1) @db.SmallInt  // 1=正常，0=封禁
  last_login_ip   String?   @db.VarChar(45)
  last_login_time DateTime? @db.Timestamptz(6)
  created_time    DateTime? @default(now()) @db.Timestamptz(6)
  updated_time    DateTime? @default(now()) @db.Timestamptz(6)
}
```

**关键设计**：
- `password_hash` 已设计为可选字段 ✅
- 首次登录：`password_hash = null`
- 设置密码后：`password_hash = bcrypt哈希值`
- Schema完全满足需求，无需变更 ✅

---

## 🔐 六、安全设计

### 6.1 密码安全
- bcrypt哈希，salt rounds = 10
- 密码长度：6-20位
- 明文密码不记录日志
- JWT密钥 >= 32字符

### 6.2 验证码安全
- 一次性使用（登录后删除）
- 5分钟过期（Redis TTL）
- 60秒冷却
- 每日10次限制

### 6.3 API安全
- IP地址记录
- 错误信息脱敏（统一返回"手机号或密码错误"）
- CORS控制

---

## 📝 七、环境变量配置

添加到 `.env`：

```bash
# 阿里云SMS
ALIYUN_ACCESS_KEY_ID=your_key_id
ALIYUN_ACCESS_KEY_SECRET=your_secret
ALIYUN_SMS_SIGN_NAME=FluentWJ
ALIYUN_SMS_TEMPLATE_CODE=SMS_xxxxx

# JWT
JWT_SECRET=your_jwt_secret_at_least_32_characters_long
JWT_EXPIRY=1d

# Redis（已存在）
REDIS_URL=redis://localhost:6379
```

---

## ✅ 八、验收标准

### 8.1 功能验收
- [ ] 短信验证码发送成功
- [ ] 60秒冷却和每日10次限制生效
- [ ] 验证码登录创建新用户
- [ ] 新用户首次登录返回 `needsPasswordSetup: true`
- [ ] 密码设置成功后可以密码登录
- [ ] JWT认证和中间件保护生效

### 8.2 安全验收
- [ ] 密码使用bcrypt哈希
- [ ] 验证码一次性使用
- [ ] 所有关键操作有日志

### 8.3 性能验收
- [ ] API响应 < 200ms（不含SMS发送）

---

## 🚀 九、实施时间估算

| 阶段 | 任务 | 预估时间 | 优先级 |
|------|------|----------|--------|
| 阶段1 | 类型定义和错误处理 | 0.5天 | P0 |
| 阶段2 | Service层核心业务逻辑 | 1.5天 | P0 |
| 阶段3 | API路由层实现 | 1天 | P0 |
| 阶段4 | 前端页面实现 | 1天 | P1 |
| 阶段5 | 中间件和路由保护 | 0.5天 | P1 |
| 阶段6 | 测试 | 1天 | P2 |
| **总计** | | **5.5天** | |

---

## 📌 十、注意事项

### 10.1 开发规范
1. 所有文件头部必须包含 `Spec: /docs/specs/login-backend.md` 注释
2. 核心逻辑必须包含中文注释
3. 严禁使用 `any` 类型
4. 错误统一使用自定义异常类
5. IP地址必须从请求头提取

### 10.2 已知风险
1. 阿里云SMS配额有限，需监控使用量
2. 需确保Redis服务正常运行
3. Token存储当前使用localStorage（不推荐生产环境）

### 10.3 后续优化
1. 图形验证码（防机器人）
2. 登录失败次数限制（防暴力破解）
3. 设备指纹（异常登录检测）
4. OAuth集成（微信、企业微信）
5. 密码强度检测

---

**文档状态**: ✅ 规划完成，待用户确认  
**下一步**: 用户确认后，开始实施（从阶段1开始）  
**预期完成时间**: 5.5个工作日


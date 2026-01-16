# 登录逻辑后端开发规范

## Spec 概述
本规范描述 FluentWJ 登录功能的后端实现，包括验证码发送、验证码登录、密码登录等核心功能。

**文档版本**: v1.0  
**创建日期**: 2025-01-14  
**相关 PRD**: `/docs/prd/[PRD] FluentWJ 跨境商务写作助手项目需求文档.md`  
**相关前端规范**: `/docs/specs/login-page.md`  
**实施方式**: 规范驱动开发 (SDD)

---

## 功能描述

### 1. 发送验证码
通过阿里云SMS服务向用户手机号发送6位数字验证码，用于验证码登录。

**核心功能**：
- 手机号格式验证
- 发送频率限制（60秒冷却）
- 每日发送次数限制（最多10次）
- 验证码存储到Redis（5分钟过期）
- 发送成功/失败反馈

---

### 2. 验证码登录
用户通过手机号 + 短信验证码进行登录。

**核心功能**：
- 验证码校验（从Redis读取）
- 自动创建新用户（首次登录）
- 更新登录信息（IP、时间）
- 生成JWT Token
- 删除已使用的验证码

---

### 3. 密码登录
用户通过手机号 + 密码进行登录。

**核心功能**：
- 用户存在性检查
- 密码哈希验证（bcrypt）
- 用户状态检查（封禁判断）
- 更新登录信息（IP、时间）
- 生成JWT Token

---

### 4. 重置密码（忘记密码）
用户通过手机号 + 验证码重置密码（无需登录）。

**核心功能**：
- 验证码校验（从Redis读取）
- 用户存在性检查（用户必须存在）
- 用户状态检查（封禁判断）
- 更新密码（bcrypt哈希）
- 删除已使用的验证码

---

### 5. 登录日志
记录每次登录尝试，用于安全审计。

**核心功能**：
- 记录登录时间、IP、登录方式
- 记录登录状态（成功/失败）
- 支持异常登录检测

---

## 功能逻辑

### 1. 发送验证码流程

```
客户端发送 POST /api/auth/send-code
  ↓
[API层] 参数校验
  ├─ 验证请求体格式（phone字段必填）
  └─ 从请求头提取 user_ip
  ↓
[Service层] 手机号验证
  ├─ 检查手机号格式（11位数字，1开头）
  └─ 格式错误 → 返回 400 错误
  ↓
[Service层] 限流检查
  ├─ 检查60秒冷却（Redis: sms_cooldown:{phone}）
  │   └─ 剩余冷却时间 > 0 → 返回 429，带上冷却时间
  ├─ 检查每日发送次数（Redis: sms_count:{phone}:{date}）
  │   └─ 次数 >= 10 → 返回 429
  └─ 通过限流检查
  ↓
[Service层] 生成验证码
  ├─ 生成6位随机数字
  └─ 例如：123456
  ↓
[Service层] 调用阿里云SMS发送
  ├─ 调用 lib/sms.sendSMS(phone, code)
  ├─ 发送成功
  │   ├─ 存储验证码到Redis（sms_code:{phone}，5分钟过期）
  │   ├─ 记录冷却时间（sms_cooldown:{phone}，60秒过期）
  │   ├─ 记录发送次数（sms_count:{phone}:{date}，1天过期）
  │   └─ 返回成功
  └─ 发送失败
      └─ 返回 500 错误
```

---

### 2. 验证码登录流程

```
客户端发送 POST /api/auth/login（mode: 'code'）
  ↓
[API层] 参数校验
  ├─ 验证请求体格式（phone, code必填）
  └─ 从请求头提取 user_ip
  ↓
[Service层] 验证码校验
  ├─ 从Redis读取验证码（sms_code:{phone}）
  ├─ 验证码不存在 → 返回 400（验证码过期）
  ├─ 验证码不匹配 → 返回 400（验证码错误）
  └─ 验证码正确
  ↓
[Service层] 用户查询
  ├─ 从数据库查询用户（prisma.users.findUnique({ phone })）
  ├─ 用户不存在
  │   ├─ 创建新用户（password_hash为空）
  │   └─ 用户存在，继续
  └─ 获取用户信息
  ↓
[Service层] 用户状态检查
  ├─ 检查 status 字段（1=正常，0=封禁）
  ├─ status !== 1 → 返回 403（账户被封禁）
  └─ 用户正常
  ↓
[Service层] 更新登录信息
  ├─ 更新 last_login_ip
  ├─ 更新 last_login_time
  └─ 更新 updated_time
  ↓
[Service层] 生成JWT Token
  ├─ 调用 utils/jwt.generateToken(payload)
  └─ payload = { userId, phone, role }
  ↓
[Service层] 清理验证码
  └─ 删除Redis中的验证码（sms_code:{phone}）
  ↓
[Service层] 记录登录日志
  └─ 可选：写入 login_logs 表
  ↓
返回成功响应（token + user信息）
```

---

### 3. 密码登录流程

```
客户端发送 POST /api/auth/login（mode: 'password'）
  ↓
[API层] 参数校验
  ├─ 验证请求体格式（phone, password必填）
  └─ 从请求头提取 user_ip
  ↓
[Service层] 用户查询
  ├─ 从数据库查询用户（prisma.users.findUnique({ phone })）
  ├─ 用户不存在 → 返回 401（手机号或密码错误）
  └─ 用户存在
  ↓
[Service层] 密码验证
  ├─ 使用 bcrypt.compare(password, password_hash)
  ├─ 密码不匹配 → 返回 401（手机号或密码错误）
  └─ 密码正确
  ↓
[Service层] 用户状态检查
  ├─ 检查 status 字段（1=正常，0=封禁）
  ├─ status !== 1 → 返回 403（账户被封禁）
  └─ 用户正常
  ↓
[Service层] 更新登录信息
  ├─ 更新 last_login_ip
  ├─ 更新 last_login_time
  └─ 更新 updated_time
  ↓
[Service层] 生成JWT Token
  ├─ 调用 utils/jwt.generateToken(payload)
  └─ payload = { userId, phone, role }
  ↓
[Service层] 记录登录日志
  └─ 可选：写入 login_logs 表
  ↓
返回成功响应（token + user信息）
```

---

### 4. 重置密码流程

```
客户端发送 POST /api/auth/reset-password
  ↓
[API层] 参数校验
  ├─ 验证请求体格式（phone, code, newPassword, confirmPassword必填）
  └─ 验证各字段格式
  ↓
[Service层] 验证码校验
  ├─ 从Redis读取验证码（sms_code:{phone}）
  ├─ 验证码不存在 → 返回 401（验证码过期）
  ├─ 验证码不匹配 → 返回 401（验证码错误）
  └─ 验证码正确
  ↓
[Service层] 用户查询
  ├─ 从数据库查询用户（prisma.users.findUnique({ phone })）
  ├─ 用户不存在 → 返回 401（该手机号未注册）
  └─ 用户存在
  ↓
[Service层] 用户状态检查
  ├─ 检查 status 字段（1=正常，0=封禁）
  ├─ status !== 1 → 返回 403（账户被封禁）
  └─ 用户正常
  ↓
[Service层] 更新密码
  ├─ 使用 bcrypt.hash() 加密新密码
  └─ 更新数据库 password_hash 字段
  ↓
[Service层] 清理验证码
  └─ 删除Redis中的验证码（sms_code:{phone}）
  ↓
返回成功响应
```

---

## 接口定义

### 1. 数据类型定义

**types/auth.ts**：
```typescript
/**
 * 发送验证码请求
 */
export interface SendCodeRequest {
  phone: string  // 手机号（11位数字）
}

/**
 * 登录请求
 */
export interface LoginRequest {
  phone: string       // 手机号（11位数字）
  code?: string       // 验证码（验证码登录时使用）
  password?: string   // 密码（密码登录时使用）
  mode: 'code' | 'password'  // 登录模式
}

/**
 * 重置密码请求（忘记密码场景，通过验证码）
 */
export interface ResetPasswordRequest {
  phone: string           // 手机号
  code: string            // 短信验证码
  newPassword: string     // 新密码（6-20位）
  confirmPassword: string // 确认密码
}

/**
 * 认证响应（通用）
 */
export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    phone: string
    role: number
  }
  token?: string
  cooldown?: number  // 剩余冷却时间（仅send-code接口）
}

/**
 * Service层返回类型
 */
export interface SendCodeResult {
  success: boolean
  message: string
  cooldown?: number
}

export interface LoginResult {
  success: boolean
  message: string
  user?: {
    id: string
    phone: string
    role: number
  }
  token?: string
}

export interface ResetPasswordResult {
  success: boolean
  message: string
}

/**
 * 登录日志记录
 */
export interface LoginLog {
  userId: string
  phone: string
  ip: string
  method: 'code' | 'password'
  status: 'success' | 'failed'
  failureReason?: string  // 失败原因（可选）
  loginTime: Date
}
```

export interface ResetPasswordResult {
  success: boolean
  message: string
}
```

---

### 2. API 接口定义

#### 2.1 POST /api/auth/send-code

**请求**：
```http
POST /api/auth/send-code
Content-Type: application/json

{
  "phone": "13800138000"
}
```

**响应（成功）**：
```json
{
  "success": true,
  "message": "验证码已发送"
}
```

**响应（冷却中）**：
```json
{
  "success": false,
  "message": "发送过于频繁，请稍后再试",
  "cooldown": 45
}
```

**响应（失败）**：
```json
{
  "success": false,
  "message": "短信服务异常，请稍后重试"
}
```

---

#### 2.2 POST /api/auth/login

**请求（验证码登录）**：
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "code": "123456",
  "mode": "code"
}
```

**请求（密码登录）**：
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "user_password",
  "mode": "password"
}
```

**响应（成功）**：
```json
{
  "success": true,
  "message": "登录成功",
  "user": {
    "id": "uuid-here",
    "phone": "13800138000",
    "role": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应（失败）**：
```json
{
  "success": false,
  "message": "手机号或密码错误"
}
```

---

#### 2.3 POST /api/auth/reset-password

**请求**：
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "phone": "13800138000",
  "code": "123456",
  "newPassword": "new_password_123",
  "confirmPassword": "new_password_123"
}
```

**响应（成功）**：
```json
{
  "success": true,
  "message": "密码重置成功"
}
```

**响应（失败 - 验证码错误）**：
```json
{
  "success": false,
  "message": "验证码错误或已过期"
}
```

**响应（失败 - 用户不存在）**：
```json
{
  "success": false,
  "message": "该手机号未注册"
}
```

---

## Service层设计

### 1. sendCodeService.ts

**函数签名**：
```typescript
/**
 * 发送短信验证码
 * 
 * @param phone - 用户手机号
 * @param ip - 用户IP地址（用于日志记录）
 * @returns 发送结果
 */
export async function sendVerificationCode(
  phone: string, 
  ip: string
): Promise<SendCodeResult>
```

**实现逻辑**：
```typescript
// 1. 验证手机号格式
// 2. 检查60秒冷却（Redis: sms_cooldown:{phone}）
// 3. 检查每日发送次数（Redis: sms_count:{phone}:{date}）
// 4. 生成6位随机验证码
// 5. 调用阿里云SMS发送
// 6. 发送成功：
//    - 存储验证码（sms_code:{phone}，5分钟过期）
//    - 记录冷却时间（sms_cooldown:{phone}，60秒过期）
//    - 记录发送次数（sms_count:{phone}:{date}，1天过期）
// 7. 返回结果
```

---

### 2. loginService.ts

**函数签名**：
```typescript
/**
 * 验证码登录
 * 
 * @param phone - 用户手机号
 * @param code - 短信验证码
 * @param ip - 用户IP地址
 * @returns 登录结果
 */
export async function loginWithCode(
  phone: string,
  code: string,
  ip: string
): Promise<LoginResult>

/**
 * 密码登录
 * 
 * @param phone - 用户手机号
 * @param password - 用户密码
 * @param ip - 用户IP地址
 * @returns 登录结果
 */
export async function loginWithPassword(
  phone: string,
  password: string,
  ip: string
): Promise<LoginResult>
```

**实现逻辑（验证码登录）**：
```typescript
// 1. 验证手机号格式
// 2. 从Redis读取验证码（sms_code:{phone}）
// 3. 验证码不存在 → 返回错误（验证码过期）
// 4. 验证码不匹配 → 返回错误（验证码错误）
// 5. 查询用户（prisma.users.findUnique）
// 6. 用户不存在 → 创建新用户（password_hash为空）
// 7. 检查用户状态（status !== 1 → 封禁）
// 8. 更新登录信息（last_login_ip, last_login_time）
// 9. 生成JWT Token
// 10. 删除Redis中的验证码
// 11. 记录登录日志
// 12. 返回成功响应
```

**实现逻辑（密码登录）**：
```typescript
// 1. 验证手机号格式
// 2. 查询用户（prisma.users.findUnique）
// 3. 用户不存在 → 返回错误（手机号或密码错误）
// 4. 验证密码（bcrypt.compare）
// 5. 密码错误 → 返回错误（手机号或密码错误）
// 6. 检查用户状态（status !== 1 → 封禁）
// 7. 更新登录信息（last_login_ip, last_login_time）
// 8. 生成JWT Token
// 9. 记录登录日志
// 10. 返回成功响应
```

---

### 3. resetPasswordService.ts

**函数签名**：
```typescript
/**
 * 重置密码（忘记密码场景）
 * 
 * @param phone - 用户手机号
 * @param code - 短信验证码
 * @param newPassword - 新密码
 * @param confirmPassword - 确认密码
 * @returns 重置结果
 */
export async function resetPasswordWithCode(
  phone: string,
  code: string,
  newPassword: string,
  confirmPassword: string
): Promise<ResetPasswordResult>
```

**实现逻辑**：
```typescript
// 1. 验证密码一致性
// 2. 验证密码格式（6-20位）
// 3. 从Redis读取验证码（sms_code:{phone}）
// 4. 验证码不存在 → 返回错误（验证码过期）
// 5. 验证码不匹配 → 返回错误（验证码错误）
// 6. 查询用户（prisma.users.findUnique）
// 7. 用户不存在 → 返回错误（该手机号未注册）
// 8. 检查用户状态（status !== 1 → 封禁）
// 9. 更新密码（bcrypt.hash + prisma.users.update）
// 10. 删除Redis中的验证码
// 11. 返回成功响应
```

---

### 4. 辅助函数

**generateCode()** - 生成6位随机验证码：
```typescript
function generateCode(): string {
  const code = Math.floor(Math.random() * 1000000).toString()
  return code.padStart(6, '0')
}
```

**hashPassword()** - 密码哈希（用于未来注册功能）：
```typescript
import bcrypt from 'bcryptjs'

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}
```

---

## Redis数据结构设计

### 1. 验证码存储
```
Key: sms_code:{phone}
Type: String
Value: 6位验证码（例如：123456）
TTL: 300秒（5分钟）

示例：
sms_code:13800138000 = "123456"
```

---

### 2. 冷却时间记录
```
Key: sms_cooldown:{phone}
Type: String
Value: 发送时间戳（Unix时间戳）
TTL: 60秒

示例：
sms_cooldown:13800138000 = "1705228800"
```

---

### 3. 每日发送次数
```
Key: sms_count:{phone}:{date}
Type: String
Value: 发送次数
TTL: 86400秒（1天）

示例：
sms_count:13800138000:20250114 = "3"
```

---

### 4. Redis操作示例

```typescript
import { redis } from '@/lib/redis'

// 存储验证码（5分钟过期）
await redis.set(`sms_code:${phone}`, code, 'EX', 300)

// 读取验证码
const storedCode = await redis.get(`sms_code:${phone}`)

// 删除验证码
await redis.del(`sms_code:${phone}`)

// 检查冷却时间
const cooldownKey = `sms_cooldown:${phone}`
const cooldownTimestamp = await redis.get(cooldownKey)
if (cooldownTimestamp) {
  const cooldownTime = parseInt(cooldownTimestamp, 10)
  const remainingCooldown = 60 - Math.floor((D

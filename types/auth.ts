// Spec: /docs/specs/login-backend.md
// 说明: 认证相关的TypeScript接口定义
// 包含请求、响应、Service层返回类型等

/**
 * 发送验证码请求
 */
export interface SendCodeRequest {
  phone: string  // 手机号（11位数字）
}

/**
 * 登录请求（双模式：验证码/密码）
 */
export interface LoginRequest {
  phone: string       // 手机号（11位数字）
  code?: string       // 验证码（验证码登录时使用）
  password?: string   // 密码（密码登录时使用）
  mode: 'code' | 'password'  // 登录模式
}

/**
 * 设置密码请求（首次登录后）
 */
export interface SetPasswordRequest {
  password: string        // 新密码（6-20位）
  confirmPassword: string  // 确认密码
}

/**
 * 修改密码请求（已登录用户）
 */
export interface UpdatePasswordRequest {
  oldPassword: string     // 旧密码
  newPassword: string      // 新密码
  confirmPassword: string  // 确认新密码
}

/**
 * 通用API响应格式
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: string
  }
}

/**
 * 登录响应
 */
export interface LoginResponse {
  success: boolean
  message: string
  user?: UserResponse
  token?: string
  needsPasswordSetup?: boolean  // 首次登录需设置密码
}

/**
 * 用户信息响应（脱敏）
 */
export interface UserResponse {
  id: string
  phone: string
  role: number
  status: number
  lastLoginTime?: string
  createdAt?: string
}

/**
 * 设置密码响应
 */
export interface SetPasswordResponse {
  success: boolean
  message: string
}

/**
 * 修改密码响应
 */
export interface UpdatePasswordResponse {
  success: boolean
  message: string
}

/**
 * 获取当前用户响应
 */
export interface GetCurrentUserResponse {
  success: boolean
  user?: UserResponse
}

/**
 * 发送验证码Service层返回类型
 */
export interface SendCodeResult {
  success: boolean
  message: string
  cooldown?: number  // 剩余冷却时间（秒）
}

/**
 * 登录Service层返回类型
 */
export interface LoginResult {
  success: boolean
  message: string
  user?: {
    id: string
    phone: string
    role: number
  }
  token?: string
  needsPasswordSetup?: boolean
}

/**
 * 设置密码Service层返回类型
 */
export interface SetPasswordResult {
  success: boolean
  message: string
}

/**
 * 修改密码Service层返回类型
 */
export interface UpdatePasswordResult {
  success: boolean
  message: string
}

/**
 * 登录日志记录（用于审计）
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

/**
 * JWT Payload（在Token中存储的用户信息）
 */
export interface JWTPayload {
  userId: string
  phone: string
  role: number
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  NORMAL = 1,    // 正常
  BANNED = 0,    // 封禁
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 0,     // 管理员
  USER = 1,      // 普通用户
}

/**
 * 登录方式枚举
 */
export enum LoginMethod {
  CODE = 'code',         // 验证码登录
  PASSWORD = 'password', // 密码登录
}

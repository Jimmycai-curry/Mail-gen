// Spec: /docs/specs/login-backend.md
// 说明: 认证服务
// 负责验证码登录、密码登录、设置密码等核心认证业务逻辑

import {
  verifyCode,
  consumeCode
} from '@/services/sms.service'
import {
  getUserByPhone,
  createUser,
  verifyPassword,
  setPassword,
  updatePassword,
  updateLoginInfo,
  checkUserStatus,
  getUserById
} from '@/services/user.service'
import { generateToken } from '@/utils/jwt'
import { ValidationError, UnauthorizedError } from '@/utils/error'
import { LoginResult, SetPasswordResult, UpdatePasswordResult } from '@/types/auth'
import { JWTPayload } from '@/types/auth'

/**
 * 验证码登录
 *
 * 核心流程:
 * 1. 验证手机号格式
 * 2. 从Redis验证验证码
 * 3. 查询用户，不存在则创建
 * 4. 检查用户状态
 * 5. 更新登录信息
 * 6. 生成JWT Token
 * 7. 删除Redis验证码
 * 8. 判断是否需要设置密码（password_hash === null）
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
): Promise<LoginResult> {
  console.log('[AuthService] 验证码登录请求:', { phone, ip })

  const isValidCode = await verifyCode(phone, code)
  if (!isValidCode) {
    console.log('[AuthService] 验证码验证失败')
    throw new UnauthorizedError('验证码错误或已过期')
  }

  let user = await getUserByPhone(phone)

  if (!user) {
    console.log('[AuthService] 用户不存在，创建新用户')
    user = await createUser(phone)
  }

  checkUserStatus(user)

  await updateLoginInfo(user.id, ip)

  const payload: JWTPayload = {
    userId: user.id,
    phone: user.phone,
    role: user.role ?? 1
  }

  const token = await generateToken(payload)

  await consumeCode(phone)

  // 首次验证码登录时 password_hash 为空或空字符串，需引导设置密码
  const needsPasswordSetup = !user.password_hash

  console.log('[AuthService] 验证码登录成功:', {
    userId: user.id,
    needsPasswordSetup
  })

  return {
    success: true,
    message: '登录成功',
    user: {
      id: user.id,
      phone: user.phone,
      role: user.role ?? 1
    },
    token,
    needsPasswordSetup
  }
}

/**
 * 密码登录
 *
 * 核心流程:
 * 1. 验证手机号格式
 * 2. 查询用户
 * 3. 验证密码
 * 4. 检查用户状态
 * 5. 更新登录信息
 * 6. 生成JWT Token
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
): Promise<LoginResult> {
  console.log('[AuthService] 密码登录请求:', { phone, ip })

  const user = await getUserByPhone(phone)

  if (!user) {
    console.log('[AuthService] 用户不存在')
    throw new UnauthorizedError('手机号或密码错误')
  }

  if (!user.password_hash) {
    console.log('[AuthService] 用户未设置密码')
    throw new UnauthorizedError('请先设置密码')
  }

  const isPasswordValid = await verifyPassword(password, user.password_hash)
  if (!isPasswordValid) {
    console.log('[AuthService] 密码验证失败')
    throw new UnauthorizedError('手机号或密码错误')
  }

  checkUserStatus(user)

  await updateLoginInfo(user.id, ip)

  const payload: JWTPayload = {
    userId: user.id,
    phone: user.phone,
    role: user.role ?? 1
  }

  const token = await generateToken(payload)

  console.log('[AuthService] 密码登录成功:', { userId: user.id })

  return {
    success: true,
    message: '登录成功',
    user: {
      id: user.id,
      phone: user.phone,
      role: user.role ?? 1
    },
    token,
    needsPasswordSetup: false
  }
}

/**
 * 设置密码（首次登录后）
 *
 * @param userId - 用户ID
 * @param password - 新密码
 * @param confirmPassword - 确认密码
 * @returns 设置结果
 */
export async function setPasswordAfterLogin(
  userId: string,
  password: string,
  confirmPassword: string
): Promise<SetPasswordResult> {
  console.log('[AuthService] 设置密码:', { userId })

  if (password !== confirmPassword) {
    throw new ValidationError('两次输入的密码不一致')
  }

  if (password.length < 6) {
    throw new ValidationError('密码长度不能少于6位')
  }

  if (password.length > 20) {
    throw new ValidationError('密码长度不能超过20位')
  }

  const user = await getUserById(userId)

  if (!user) {
    throw new UnauthorizedError('用户不存在')
  }

  await setPassword(userId, password)

  console.log('[AuthService] 密码设置成功:', { userId })

  return {
    success: true,
    message: '密码设置成功'
  }
}

/**
 * 修改密码（已登录用户）
 *
 * @param userId - 用户ID
 * @param oldPassword - 旧密码
 * @param newPassword - 新密码
 * @param confirmPassword - 确认新密码
 * @returns 修改结果
 */
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<UpdatePasswordResult> {
  console.log('[AuthService] 修改密码:', { userId })

  if (newPassword !== confirmPassword) {
    throw new ValidationError('两次输入的密码不一致')
  }

  if (newPassword.length < 6) {
    throw new ValidationError('密码长度不能少于6位')
  }

  if (newPassword.length > 20) {
    throw new ValidationError('密码长度不能超过20位')
  }

  if (oldPassword === newPassword) {
    throw new ValidationError('新密码不能与旧密码相同')
  }

  await updatePassword(userId, oldPassword, newPassword)

  console.log('[AuthService] 密码修改成功:', { userId })

  return {
    success: true,
    message: '密码修改成功'
  }
}

/**
 * 获取当前用户信息
 *
 * @param userId - 用户ID（从JWT Token解析）
 * @returns 用户信息
 */
export async function getCurrentUser(userId: string) {
  console.log('[AuthService] 获取当前用户:', { userId })

  const user = await getUserById(userId)

  if (!user) {
    console.log('[AuthService] 用户不存在:', { userId })
    return null
  }

  return user
}

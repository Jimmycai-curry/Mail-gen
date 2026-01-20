// Spec: /docs/specs/login-backend.md
// 说明: 用户服务
// 负责用户相关的数据库操作：查询、创建、密码验证、状态检查、更新登录信息等

import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { ValidationError, NotFoundError, ForbiddenError } from '@/utils/error'
import { UserStatus } from '@/types/auth'

/**
 * 根据手机号查询用户
 *
 * @param phone - 用户手机号
 * @returns 用户对象，不存在返回null
 */
export async function getUserByPhone(phone: string) {
  console.log('[UserService] 查询用户:', { phone })

  const user = await prisma.users.findUnique({
    where: { phone },
    select: {
      id: true,
      phone: true,
      password_hash: true,
      role: true,
      status: true,
      last_login_ip: true,
      last_login_time: true,
      created_time: true,
      updated_time: true
    }
  })

  console.log('[UserService] 查询结果:', { phone, exists: !!user })

  return user
}

/**
 * 创建新用户（首次验证码登录时）
 *
 * @param phone - 用户手机号
 * @returns 创建的用户对象
 */
export async function createUser(phone: string) {
  console.log('[UserService] 创建新用户:', { phone })

  const user = await prisma.users.create({
    data: {
      phone,
      role: 1,
      status: UserStatus.NORMAL,
      // 兼容旧库的 NOT NULL 约束，首次登录用空字符串占位
      password_hash: ''
    },
    select: {
      id: true,
      phone: true,
      password_hash: true,
      role: true,
      status: true,
      last_login_ip: true,
      last_login_time: true,
      created_time: true,
      updated_time: true
    }
  })

  console.log('[UserService] 用户创建成功:', { phone, userId: user.id })

  return user
}

/**
 * 验证密码
 *
 * @param plainPassword - 明文密码
 * @param hashedPassword - bcrypt哈希密码
 * @returns 验证结果
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword)
    console.log('[UserService] 密码验证结果:', { isValid })
    return isValid
  } catch (error) {
    console.error('[UserService] 密码验证异常:', error)
    return false
  }
}

/**
 * 设置密码（首次设置或修改密码）
 *
 * @param userId - 用户ID
 * @param password - 明文密码
 * @returns 更新后的用户对象
 */
export async function setPassword(userId: string, password: string) {
  console.log('[UserService] 设置密码:', { userId })

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = await prisma.users.update({
    where: { id: userId },
    data: {
      password_hash: passwordHash,
      updated_time: new Date()
    },
    select: {
      id: true,
      phone: true,
      role: true,
      status: true
    }
  })

  console.log('[UserService] 密码设置成功:', { userId })

  return user
}

/**
 * 更新密码（验证旧密码后更新）
 *
 * @param userId - 用户ID
 * @param oldPassword - 旧密码
 * @param newPassword - 新密码
 * @returns 更新后的用户对象
 */
export async function updatePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  console.log('[UserService] 更新密码:', { userId })

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      password_hash: true
    }
  })

  if (!user || !user.password_hash) {
    throw new ValidationError('用户未设置密码')
  }

  const isOldPasswordValid = await verifyPassword(oldPassword, user.password_hash)
  if (!isOldPasswordValid) {
    throw new ValidationError('旧密码错误')
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(newPassword, salt)

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      password_hash: passwordHash,
      updated_time: new Date()
    },
    select: {
      id: true,
      phone: true,
      role: true,
      status: true
    }
  })

  console.log('[UserService] 密码更新成功:', { userId })

  return updatedUser
}

/**
 * 更新用户登录信息
 *
 * @param userId - 用户ID
 * @param ip - 用户IP地址
 * @returns 更新后的用户对象
 */
export async function updateLoginInfo(userId: string, ip: string) {
  console.log('[UserService] 更新登录信息:', { userId, ip })

  const user = await prisma.users.update({
    where: { id: userId },
    data: {
      last_login_ip: ip,
      last_login_time: new Date(),
      updated_time: new Date()
    },
    select: {
      id: true,
      phone: true,
      role: true,
      status: true,
      last_login_ip: true,
      last_login_time: true
    }
  })

  console.log('[UserService] 登录信息更新成功:', { userId, ip })

  return user
}

/**
 * 检查用户状态
 *
 * @param user - 用户对象
 * @throws {ForbiddenError} 用户被封禁时抛出
 */
export function checkUserStatus(user: { status?: number | null }): void {
  if (user.status !== UserStatus.NORMAL) {
    console.log('[UserService] 用户状态异常:', { status: user.status })
    throw new ForbiddenError('账户已被封禁，请联系管理员')
  }

  console.log('[UserService] 用户状态正常:', { status: user.status })
}

/**
 * 获取用户信息（根据ID）
 *
 * @param userId - 用户ID
 * @returns 用户信息（不含密码）
 */
export async function getUserById(userId: string) {
  console.log('[UserService] 获取用户信息:', { userId })

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      name: true,      // 新增 name 字段
      avatar: true,    // 新增 avatar 字段
      role: true,
      status: true,
      last_login_ip: true,
      last_login_time: true,
      created_time: true
    }
  })

  if (!user) {
    console.log('[UserService] 用户不存在:', { userId })
    return null
  }

  return user
}

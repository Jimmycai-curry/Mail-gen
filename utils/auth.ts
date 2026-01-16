// Spec: /docs/specs/history-page.md
// 说明: 认证辅助函数
// 提供从请求中提取和验证 JWT Token 的工具函数

import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from './jwt'
import { UnauthorizedError } from './error'

/**
 * 用户认证信息接口
 * 包含从 JWT Token 解析出的用户身份信息
 */
export interface AuthenticatedUser {
  /** 用户唯一标识符（UUID） */
  userId: string
  /** 用户手机号 */
  phone: string
  /** 用户角色（0-管理员，1-普通用户） */
  role: number
}

/**
 * 从请求中获取 Token
 * 优先从 Cookie 读取（auth_token），如果没有则尝试从 Authorization Header 读取
 * 
 * 使用场景:
 * - Web 应用：Token 存储在 Cookie 中，自动携带
 * - 移动端/API 调用：通过 Authorization Header 手动传递
 * 
 * @param request - Next.js 请求对象
 * @returns Token 字符串或 null
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // 优先从 Cookie 读取 Token（Web 应用标准方式）
  const token = request.cookies.get('auth_token')?.value
  if (token) {
    console.log('[Auth] 从 Cookie 读取 Token 成功')
    return token
  }

  // 如果 Cookie 中没有，尝试从 Authorization Header 读取（兼容移动端）
  // 格式: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    console.log('[Auth] 从 Authorization Header 读取 Token 成功')
    return token
  }

  // 既没有 Cookie 也没有 Header，说明未登录
  console.log('[Auth] 未找到 Token')
  return null
}

/**
 * 验证请求并返回用户信息
 * 从请求中提取 Token，验证其有效性，并返回解析后的用户信息
 * 
 * 使用场景:
 * - API 路由中需要认证时调用
 * - 自动处理 Token 不存在或无效的情况
 * 
 * @param request - Next.js 请求对象
 * @returns 用户认证信息
 * @throws UnauthorizedError - Token 不存在或无效时抛出
 * 
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const user = await authenticateRequest(request)
 *   console.log('当前用户:', user.userId)
 *   // ... 业务逻辑
 * }
 * ```
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedUser> {
  // 1. 从请求中提取 Token
  const token = getTokenFromRequest(request)
  
  // 2. 检查 Token 是否存在
  if (!token) {
    console.log('[Auth] Token 不存在，拒绝访问')
    throw new UnauthorizedError('未登录或登录已过期')
  }

  // 3. 验证 Token 有效性
  const payload = await verifyToken(token)
  
  // 4. 检查 Token 是否有效（可能过期、签名错误等）
  if (!payload) {
    console.log('[Auth] Token 验证失败，拒绝访问')
    throw new UnauthorizedError('Token 无效或已过期')
  }

  // 5. 返回用户认证信息
  const user: AuthenticatedUser = {
    userId: payload.userId,
    phone: payload.phone,
    role: payload.role
  }

  console.log('[Auth] 用户认证成功:', { userId: user.userId, phone: user.phone })
  return user
}

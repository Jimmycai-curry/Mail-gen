// Spec: /docs/specs/login-page.md
// 说明: JWT工具函数,用于生成、验证和解码Token
// 使用jose库(Node.js官方推荐的JWT库)

import { SignJWT, jwtVerify } from 'jose'

/**
 * JWT Payload接口定义
 *
 * 包含用户的核心身份信息:
 * - userId: 用户唯一标识(UUID)
 * - phone: 用户手机号
 * - role: 用户角色(0-管理员, 1-普通用户)
 */
export interface JWTPayload {
  userId: string
  phone: string
  role: number
}

/**
 * 生成JWT Token
 *
 * 使用方式:
 * ```typescript
 * const token = await generateToken({
 *   userId: 'user-uuid',
 *   phone: '13800138000',
 *   role: 1
 * })
 * ```
 *
 * @param payload - JWT载荷数据(用户信息)
 * @returns JWT Token字符串
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  // 获取JWT密钥,至少32字符
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET环境变量未设置或长度不足32字符')
  }

  // 获取Token有效期,默认1天
  const expiry = process.env.JWT_EXPIRY || '1d'

  // 将密钥转换为Uint8Array(jose库要求)
  const key = new TextEncoder().encode(secret)

  // 创建并签名JWT Token
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' }) // 使用HS256算法签名
    .setIssuedAt()                      // 设置签发时间
    .setExpirationTime(expiry)            // 设置过期时间
    .sign(key)

  return token
}

/**
 * 验证JWT Token
 *
 * 使用方式:
 * ```typescript
 * const payload = await verifyToken(token)
 * if (payload) {
 *   console.log('用户ID:', payload.userId)
 *   console.log('手机号:', payload.phone)
 * }
 * ```
 *
 * @param token - 待验证的JWT Token
 * @returns 验证成功返回payload,验证失败返回null
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    // 获取JWT密钥
    const secret = process.env.JWT_SECRET
    if (!secret) {
      return null
    }

    // 将密钥转换为Uint8Array
    const key = new TextEncoder().encode(secret)

    // 验证Token
    const { payload } = await jwtVerify(token, key)

    return payload as unknown as JWTPayload
  } catch (error) {
    // Token验证失败的情况:
    // 1. Token格式错误
    // 2. 签名不匹配(密钥错误)
    // 3. Token已过期
    // 4. Token被篡改
    console.error('[JWT] Token验证失败:', error)
    return null
  }
}

/**
 * 解码JWT Token(不验证签名和过期时间)
 *
 * 注意: 此方法仅用于调试,不要用于身份验证!
 *
 * 使用方式:
 * ```typescript
 * const payload = decodeToken(token)
 * console.log('Token内容:', payload)
 * ```
 *
 * @param token - 待解码的JWT Token
 * @returns 解码后的payload(可能为null)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    // JWT由三部分组成: header.payload.signature
    // 我们只需要中间的payload部分
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // 解码Base64URL格式的payload
    const payloadBase64 = parts[1]
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8')

    return JSON.parse(payloadJson) as JWTPayload
  } catch (error) {
    console.error('[JWT] Token解码失败:', error)
    return null
  }
}

// Spec: /docs/specs/login-backend.md
import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/services/auth.service'
import { withErrorHandler } from '@/utils/error'
import { verifyToken } from '@/utils/jwt'
import { GetCurrentUserResponse } from '@/types/auth'

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    // 从 Cookie 获取 Token
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return Response.json(
        {
          success: false,
          message: '未授权访问'
        },
        { status: 401 }
      )
    }

    // 验证 Token
    const payload = await verifyToken(token)

    if (!payload) {
      return Response.json(
        {
          success: false,
          message: 'Token无效或已过期'
        },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(payload.userId)

    if (!user) {
      return Response.json(
        {
          success: false,
          message: '用户不存在'
        },
        { status: 404 }
      )
    }

    // 调试日志：打印完整的用户对象
    console.log('[API /api/auth/me] 数据库返回的完整用户对象:', JSON.stringify(user, null, 2))
    console.log('[API /api/auth/me] name 字段值:', user.name)
    console.log('[API /api/auth/me] avatar 字段值:', user.avatar)

    const response: GetCurrentUserResponse = {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name, // 返回用户名
        avatar: user.avatar, // 返回头像 URL
        role: user.role ?? 1,
        status: user.status ?? 1,
        lastLoginTime: user.last_login_time?.toISOString(),
        createdAt: user.created_time?.toISOString()
      }
    }

    console.log('[API /api/auth/me] API 返回的响应数据:', JSON.stringify(response, null, 2))

    return Response.json(response)
  })
}

// Spec: /docs/specs/login-backend.md
import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/services/auth.service'
import { withErrorHandler } from '@/utils/error'
import { verifyToken } from '@/utils/jwt'
import { GetCurrentUserResponse } from '@/types/auth'

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        {
          success: false,
          message: '未授权访问'
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
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

    const response: GetCurrentUserResponse = {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role ?? 1,
        status: user.status ?? 1,
        lastLoginTime: user.last_login_time?.toISOString(),
        createdAt: user.created_time?.toISOString()
      }
    }

    return Response.json(response)
  })
}

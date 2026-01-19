// Spec: /docs/specs/login-backend.md
import { NextRequest } from 'next/server'
import { changePassword } from '@/services/auth.service'
import { validatePassword, validateConfirmPassword } from '@/utils/validation'
import { withErrorHandler } from '@/utils/error'
import { verifyToken } from '@/utils/jwt'
import { UpdatePasswordRequest } from '@/types/auth'

export async function POST(request: NextRequest) {
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

    const body = await request.json() as UpdatePasswordRequest
    const { oldPassword, newPassword, confirmPassword } = body

    if (!oldPassword || !newPassword || !confirmPassword) {
      return Response.json(
        {
          success: false,
          message: '请输入旧密码和新密码'
        },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return Response.json(
        {
          success: false,
          message: passwordValidation.error || '密码格式错误'
        },
        { status: 400 }
      )
    }

    const confirmValidation = validateConfirmPassword(newPassword, confirmPassword)
    if (!confirmValidation.isValid) {
      return Response.json(
        {
          success: false,
          message: confirmValidation.error || '密码确认失败'
        },
        { status: 400 }
      )
    }

    const result = await changePassword(
      payload.userId,
      oldPassword,
      newPassword,
      confirmPassword
    )

    return Response.json(result)
  })
}

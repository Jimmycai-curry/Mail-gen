// Spec: /docs/specs/login-backend.md
import { NextRequest } from 'next/server'
import { setPasswordAfterLogin } from '@/services/auth.service'
import { validatePassword, validateConfirmPassword } from '@/utils/validation'
import { withErrorHandler } from '@/utils/error'
import { verifyToken } from '@/utils/jwt'
import { SetPasswordRequest } from '@/types/auth'

export async function POST(request: NextRequest) {
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

    const body = await request.json() as SetPasswordRequest
    const { password, confirmPassword } = body

    if (!password || !confirmPassword) {
      return Response.json(
        {
          success: false,
          message: '请输入密码和确认密码'
        },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return Response.json(
        {
          success: false,
          message: passwordValidation.error || '密码格式错误'
        },
        { status: 400 }
      )
    }

    const confirmValidation = validateConfirmPassword(password, confirmPassword)
    if (!confirmValidation.isValid) {
      return Response.json(
        {
          success: false,
          message: confirmValidation.error || '密码确认失败'
        },
        { status: 400 }
      )
    }

    const result = await setPasswordAfterLogin(
      payload.userId,
      password,
      confirmPassword
    )

    return Response.json(result)
  })
}

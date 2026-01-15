// Spec: /docs/specs/login-backend.md
import { NextRequest } from 'next/server'
import { loginWithCode, loginWithPassword } from '@/services/auth.service'
import { validatePhone, validatePassword, validateCode } from '@/utils/validation'
import { withErrorHandler } from '@/utils/error'
import { getClientIP } from '@/utils/request'
import { LoginRequest } from '@/types/auth'

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const body = await request.json() as LoginRequest

    const { phone, code, password, mode } = body

    if (!phone || !mode) {
      return Response.json(
        {
          success: false,
          message: '请输入手机号'
        },
        { status: 400 }
      )
    }

    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.isValid) {
      return Response.json(
        {
          success: false,
          message: phoneValidation.error || '手机号格式错误'
        },
        { status: 400 }
      )
    }

    const ip = getClientIP(request)

    if (mode === 'code') {
      if (!code) {
        return Response.json(
          {
            success: false,
            message: '请输入验证码'
          },
          { status: 400 }
        )
      }

      const codeValidation = validateCode(code)
      if (!codeValidation.isValid) {
        return Response.json(
          {
            success: false,
            message: codeValidation.error || '验证码格式错误'
          },
          { status: 400 }
        )
      }

      const result = await loginWithCode(phone, code, ip)

      return Response.json(result)
    } else if (mode === 'password') {
      if (!password) {
        return Response.json(
          {
            success: false,
            message: '请输入密码'
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

      const result = await loginWithPassword(phone, password, ip)

      return Response.json(result)
    } else {
      return Response.json(
        {
          success: false,
          message: '无效的登录模式'
        },
        { status: 400 }
      )
    }
  })
}

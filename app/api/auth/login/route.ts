// Spec: /docs/specs/login-backend.md
import { NextRequest, NextResponse } from 'next/server'
import { loginWithCode, loginWithPassword } from '@/services/auth.service'
import { validatePhone, validatePassword, validateCode } from '@/utils/validation'
import { withErrorHandler } from '@/utils/error'
import { getClientIP } from '@/utils/request'
import { LoginRequest } from '@/types/auth'

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const body = await request.json() as LoginRequest & { isAdmin?: boolean }

    const { phone, code, password, mode, isAdmin = false } = body

    if (!phone || !mode) {
      return NextResponse.json(
        {
          success: false,
          message: '请输入手机号'
        },
        { status: 400 }
      )
    }

    const phoneValidation = validatePhone(phone)
    if (!phoneValidation.isValid) {
      return NextResponse.json(
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
        return NextResponse.json(
          {
            success: false,
            message: '请输入验证码'
          },
          { status: 400 }
        )
      }

      const codeValidation = validateCode(code)
      if (!codeValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            message: codeValidation.error || '验证码格式错误'
          },
          { status: 400 }
        )
      }

      const result = await loginWithCode(phone, code, ip)

      // 创建响应并设置安全的 Cookie
      const response = NextResponse.json(result)

      if (result.success && result.token) {
        // 设置 HttpOnly Cookie，防止 XSS 攻击窃取 Token
        response.cookies.set('auth_token', result.token, {
          httpOnly: true,  // 禁止 JavaScript 读取 Cookie，防止 XSS 攻击
          secure: process.env.NODE_ENV === 'production',  // 生产环境必须使用 HTTPS
          sameSite: 'strict',  // 防止 CSRF 攻击
          maxAge: 60 * 60 * 24,  // 1 天有效期（与 JWT 过期时间一致）
          path: '/',  // 在整个域名下有效
        })
        console.log('[Login] Cookie 已安全设置:', { httpOnly: true, sameSite: 'strict' })
      }

      return response
    } else if (mode === 'password') {
      if (!password) {
        return NextResponse.json(
          {
            success: false,
            message: '请输入密码'
          },
          { status: 400 }
        )
      }

      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            message: passwordValidation.error || '密码格式错误'
          },
          { status: 400 }
        )
      }

      const result = await loginWithPassword(phone, password, ip, isAdmin)

      // 创建响应并设置安全的 Cookie
      const response = NextResponse.json(result)

      if (result.success && result.token) {
        // 设置 HttpOnly Cookie，防止 XSS 攻击窃取 Token
        response.cookies.set('auth_token', result.token, {
          httpOnly: true,  // 禁止 JavaScript 读取 Cookie，防止 XSS 攻击
          secure: process.env.NODE_ENV === 'production',  // 生产环境必须使用 HTTPS
          sameSite: 'strict',  // 防止 CSRF 攻击
          maxAge: 60 * 60 * 24,  // 1 天有效期（与 JWT 过期时间一致）
          path: '/',  // 在整个域名下有效
        })
        console.log('[Login] Cookie 已安全设置:', { httpOnly: true, sameSite: 'strict' })
      }

      return response
    } else {
      return NextResponse.json(
        {
          success: false,
          message: '无效的登录模式'
        },
        { status: 400 }
      )
    }
  })
}

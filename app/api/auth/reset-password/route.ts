// Spec: /docs/specs/login-backend.md
// 说明: 重置密码API（忘记密码场景，通过验证码重置密码）
// 此接口不需要登录，用户通过手机号+验证码来重置密码

import { NextRequest } from 'next/server'
import { resetPasswordWithCode } from '@/services/auth.service'
import { validatePhone, validateCode, validatePassword, validateConfirmPassword } from '@/utils/validation'
import { withErrorHandler } from '@/utils/error'
import { ResetPasswordRequest } from '@/types/auth'

/**
 * POST /api/auth/reset-password
 * 
 * 忘记密码场景的密码重置接口
 * 不需要登录token，通过验证码验证身份
 * 
 * @param request - 包含 phone, code, newPassword, confirmPassword
 * @returns 重置结果
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    // 1. 解析请求体
    const body = await request.json() as ResetPasswordRequest
    const { phone, code, newPassword, confirmPassword } = body

    // 2. 参数完整性检查
    if (!phone || !code || !newPassword || !confirmPassword) {
      return Response.json(
        {
          success: false,
          message: '请填写完整信息'
        },
        { status: 400 }
      )
    }

    // 3. 验证手机号格式
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

    // 4. 验证验证码格式
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

    // 5. 验证新密码格式
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

    // 6. 验证确认密码
    const confirmValidation = validateConfirmPassword(newPassword, confirmPassword)
    if (!confirmValidation.isValid) {
      return Response.json(
        {
          success: false,
          message: confirmValidation.error || '两次密码不一致'
        },
        { status: 400 }
      )
    }

    // 7. 调用Service层执行密码重置
    const result = await resetPasswordWithCode(
      phone,
      code,
      newPassword,
      confirmPassword
    )

    // 8. 返回成功响应
    return Response.json(result)
  })
}

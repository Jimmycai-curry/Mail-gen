// Spec: /docs/specs/login-backend.md
import { NextRequest } from 'next/server'
import { sendVerificationCode } from '@/services/sms.service'
import { validatePhone } from '@/utils/validation'
import { withErrorHandler } from '@/utils/error'
import { getClientIP } from '@/utils/request'
import { SendCodeRequest } from '@/types/auth'

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    const body = await request.json() as SendCodeRequest

    const { phone } = body

    if (!phone) {
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

    const result = await sendVerificationCode(phone, ip)

    if (!result.success) {
      const statusCode = result.cooldown !== undefined ? 429 : 500
      return Response.json(result, { status: statusCode })
    }

    return Response.json(result)
  })
}

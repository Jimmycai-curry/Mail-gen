// Spec: /docs/specs/login-backend.md
// 说明: 短信验证码服务
// 负责生成、发送、验证短信验证码，包含限流机制

import { redis } from '@/lib/redis'
import { sendSMS } from '@/lib/sms'
import { ValidationError, RateLimitError, InternalServerError } from '@/utils/error'
import { SendCodeResult } from '@/types/auth'

/**
 * Redis Key 常量
 */
const REDIS_KEYS = {
  CODE: (phone: string) => `sms_code:${phone}`,
  COOLDOWN: (phone: string) => `sms_cooldown:${phone}`,
  COUNT: (phone: string, date: string) => `sms_count:${phone}:${date}`
} as const

/**
 * 验证码过期时间（秒）
 */
const CODE_TTL = 300

/**
 * 冷却时间（秒）
 */
const COOLDOWN_TTL = 60

/**
 * 每日最大发送次数
 */
const MAX_DAILY_COUNT = 10

/**
 * 生成6位随机验证码
 *
 * @returns 6位数字字符串
 */
function generateCode(): string {
  const code = Math.floor(Math.random() * 1000000).toString()
  return code.padStart(6, '0')
}

/**
 * 获取今日日期字符串（YYYYMMDD格式）
 *
 * @returns 日期字符串
 */
function getTodayDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

/**
 * 发送短信验证码
 *
 * 核心流程:
 * 1. 验证手机号格式
 * 2. 检查60秒冷却时间
 * 3. 检查每日发送次数限制
 * 4. 生成6位随机验证码
 * 5. 调用阿里云SMS发送
 * 6. 存储验证码到Redis（5分钟过期）
 * 7. 记录冷却时间和发送次数
 *
 * @param phone - 用户手机号
 * @param ip - 用户IP地址（用于日志记录）
 * @returns 发送结果
 */
export async function sendVerificationCode(
  phone: string,
  ip: string
): Promise<SendCodeResult> {
  console.log('[SMS] 发送验证码请求:', { phone, ip })

  try {
    const today = getTodayDate()

    const cooldownKey = REDIS_KEYS.COOLDOWN(phone)
    const countKey = REDIS_KEYS.COUNT(phone, today)

    const cooldownTimestamp = await redis.get(cooldownKey)
    if (cooldownTimestamp) {
      const cooldownTime = parseInt(cooldownTimestamp, 10)
      const elapsed = Math.floor(Date.now() / 1000) - cooldownTime
      const remainingCooldown = Math.max(0, COOLDOWN_TTL - elapsed)

      if (remainingCooldown > 0) {
        console.log('[SMS] 冷却中:', { phone, remainingCooldown })
        return {
          success: false,
          message: '发送过于频繁，请稍后再试',
          cooldown: remainingCooldown
        }
      }
    }

    const countStr = await redis.get(countKey)
    const count = countStr ? parseInt(countStr, 10) : 0

    if (count >= MAX_DAILY_COUNT) {
      console.log('[SMS] 超出每日限制:', { phone, count })
      return {
        success: false,
        message: '今日发送次数已达上限，请明天再试'
      }
    }

    const code = generateCode()
    console.log('[SMS] 生成验证码:', { phone, code })

    const smsResult = await sendSMS(phone, code)
    if (!smsResult.success) {
      console.error('[SMS] 发送失败:', { phone, message: smsResult.message })
      return {
        success: false,
        message: smsResult.message
      }
    }

    const codeKey = REDIS_KEYS.CODE(phone)
    await redis.set(codeKey, code, 'EX', CODE_TTL)
    console.log('[SMS] 验证码已存储:', { phone, key: codeKey, ttl: CODE_TTL })

    await redis.set(cooldownKey, Math.floor(Date.now() / 1000), 'EX', COOLDOWN_TTL)
    console.log('[SMS] 冷却时间已记录:', { phone, key: cooldownKey, ttl: COOLDOWN_TTL })

    await redis.incr(countKey)
    await redis.expire(countKey, 86400)
    console.log('[SMS] 发送次数已更新:', { phone, key: countKey, count: count + 1 })

    return {
      success: true,
      message: '验证码已发送'
    }
  } catch (error) {
    console.error('[SMS] 发送验证码异常:', error)
    throw new InternalServerError('短信服务异常，请稍后重试')
  }
}

/**
 * 验证短信验证码
 *
 * @param phone - 用户手机号
 * @param code - 用户输入的验证码
 * @returns 验证结果
 */
export async function verifyCode(
  phone: string,
  code: string
): Promise<boolean> {
  console.log('[SMS] 验证验证码:', { phone })

  try {
    const codeKey = REDIS_KEYS.CODE(phone)
    const storedCode = await redis.get(codeKey)

    if (!storedCode) {
      console.log('[SMS] 验证码不存在或已过期:', { phone })
      return false
    }

    const isValid = storedCode === code
    console.log('[SMS] 验证结果:', { phone, isValid })

    return isValid
  } catch (error) {
    console.error('[SMS] 验证验证码异常:', error)
    return false
  }
}

/**
 * 消耗验证码（删除已使用的验证码）
 *
 * @param phone - 用户手机号
 */
export async function consumeCode(phone: string): Promise<void> {
  console.log('[SMS] 消耗验证码:', { phone })

  try {
    const codeKey = REDIS_KEYS.CODE(phone)
    await redis.del(codeKey)
    console.log('[SMS] 验证码已删除:', { phone, key: codeKey })
  } catch (error) {
    console.error('[SMS] 删除验证码异常:', error)
  }
}

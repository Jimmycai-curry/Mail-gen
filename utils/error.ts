// Spec: /docs/specs/login-backend.md
// 说明: 统一错误处理机制
// 提供自定义异常类和错误处理工具函数

/**
 * 应用程序基础错误类
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = isOperational

    // 保持正确的堆栈跟踪
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * 验证错误（400 Bad Request）
 */
export class ValidationError extends AppError {
  constructor(message: string = '请求参数验证失败') {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

/**
 * 未授权错误（401 Unauthorized）
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权访问') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

/**
 * 禁止访问错误（403 Forbidden）
 */
export class ForbiddenError extends AppError {
  constructor(message: string = '禁止访问') {
    super(message, 403, 'FORBIDDEN')
  }
}

/**
 * 资源未找到错误（404 Not Found）
 */
export class NotFoundError extends AppError {
  constructor(message: string = '资源未找到') {
    super(message, 404, 'NOT_FOUND')
  }
}

/**
 * 限流错误（429 Too Many Requests）
 */
export class RateLimitError extends AppError {
  public readonly retryAfter?: number

  constructor(message: string = '请求过于频繁', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT')
    this.retryAfter = retryAfter
  }
}

/**
 * 内部服务器错误（500 Internal Server Error）
 */
export class InternalServerError extends AppError {
  constructor(message: string = '服务器内部错误') {
    super(message, 500, 'INTERNAL_SERVER_ERROR', false)
  }
}

/**
 * AI 服务错误（500 Internal Server Error）
 * 用于 AI 生成服务相关的错误
 */
export class AIServiceError extends AppError {
  constructor(message: string = 'AI 服务异常') {
    super(message, 500, 'AI_SERVICE_ERROR')
  }
}

/**
 * 错误响应接口
 */
export interface ErrorResponse {
  success: false
  status: number
  error: {
    code: string
    message: string
    details?: string
  }
}

/**
 * 将错误转换为标准API响应格式
 *
 * @param error - 错误对象
 * @returns 标准错误响应
 */
export function handleError(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      status: error.statusCode,
      error: {
        code: error.code,
        message: error.message,
        details: error.isOperational ? undefined : '请联系管理员'
      }
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      status: 500,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '服务器内部错误',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    }
  }

  return {
    success: false,
    status: 500,
    error: {
      code: 'UNKNOWN_ERROR',
      message: '服务器内部错误'
    }
  }
}

/**
 * 错误处理包装器（用于API Route）
 *
 * 使用方式:
 * ```typescript
 * export async function POST(request: Request) {
 *   return withErrorHandler(async () => {
 *     const body = await request.json()
 *     // 业务逻辑
 *     return Response.json({ success: true, data })
 *   })
 * }
 * ```
 *
 * @param handler - 异步处理函数
 * @returns Next.js Response对象
 */
export async function withErrorHandler<T>(
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    return await handler()
  } catch (error) {
    console.error('[Error]', error)

    const errorResponse = handleError(error)
    let statusCode = 500

    if (error instanceof AppError) {
      statusCode = error.statusCode
    }

    return Response.json(errorResponse, { status: statusCode })
  }
}

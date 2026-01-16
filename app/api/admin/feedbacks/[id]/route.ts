// Spec: /docs/specs/admin-feedback-management.md
// 说明: 反馈详情和处理 API
// 权限: 管理员（role = 0）

import { NextRequest, NextResponse } from 'next/server'
import { getFeedbackDetail, processFeedback } from '@/services/feedback.service'
import { ProcessFeedbackData } from '@/types/admin'
import { ValidationError, NotFoundError } from '@/utils/error'
import { verifyToken } from '@/utils/jwt'
import { getClientIP } from '@/utils/request'

/**
 * GET /api/admin/feedbacks/:id - 获取反馈详情
 * 
 * 权限要求: 管理员（role = 0）- 已由 Middleware 验证
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 获取反馈 ID（Middleware 已验证管理员权限）
    const { id } = await params

    // 调用 Service 层
    const detail = await getFeedbackDetail(id)

    // 返回成功响应
    return NextResponse.json({
      code: 200,
      data: detail
    })
  } catch (error) {
    console.error('[FeedbackAPI] 获取反馈详情失败:', error)
    
    // 统一错误处理
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { code: 404, error: error.message },
        { status: 404 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { code: 500, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { code: 500, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/feedbacks/:id/process - 处理反馈
 * 
 * 功能: 将反馈状态更新为已处理，并记录管理员备注
 * 权限要求: 管理员（role = 0）- 已由 Middleware 验证
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. 从 Cookie 获取 Token（Middleware 已验证，这里只为获取 userId）
    const token = request.cookies.get('auth_token')?.value
    const decoded = token ? await verifyToken(token) : null
    
    if (!decoded) {
      // 理论上不会到达这里（Middleware 已拦截）
      return NextResponse.json(
        { code: 401, error: 'Token 无效' },
        { status: 401 }
      )
    }

    // 2. 获取反馈 ID（Next.js 15: params 是 Promise）
    const { id } = await params

    // 3. 解析请求体
    let body: ProcessFeedbackData
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('请求体格式错误')
    }

    // 4. 提取真实 IP
    const adminIp = getClientIP(request)

    // 5. 调用 Service 层处理反馈
    await processFeedback(id, body, decoded.userId, adminIp)

    // 返回成功响应
    return NextResponse.json({
      code: 200,
      message: '处理成功'
    })
  } catch (error) {
    console.error('[FeedbackAPI] 处理反馈失败:', error)
    
    // 统一错误处理
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { code: 404, error: error.message },
        { status: 404 }
      )
    }
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { code: 400, error: error.message },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { code: 500, error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { code: 500, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

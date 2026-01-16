// Spec: /docs/specs/admin-feedback-management.md
// 说明: 导出反馈数据 API - 将反馈数据导出为 CSV 文件
// 权限: 管理员（role = 0）

import { NextRequest, NextResponse } from 'next/server'
import { exportFeedbacks } from '@/services/feedback.service'
import { FeedbackQueryParams } from '@/types/admin'
import { ValidationError } from '@/utils/error'
import { verifyToken } from '@/utils/jwt'
import { getClientIP } from '@/utils/request'

/**
 * GET /api/admin/feedbacks/export - 导出反馈数据
 * 
 * 功能:
 * - 根据筛选条件导出反馈数据为 CSV 文件
 * - 限制最大导出数量为 10,000 条
 * - 记录操作日志
 * 
 * 权限要求: 管理员（role = 0）- 已由 Middleware 验证
 */
export async function GET(request: NextRequest) {
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

    // 2. 解析查询参数（筛选条件）
    const { searchParams } = new URL(request.url)
    
    const params: FeedbackQueryParams = {
      keyword: searchParams.get('keyword') || undefined,
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') ? parseInt(searchParams.get('status')!) : undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    }

    // 3. 提取真实 IP
    const adminIp = getClientIP(request)

    // 4. 调用 Service 层导出数据
    const csv = await exportFeedbacks(params, decoded.userId, adminIp)

    // 5. 生成文件名（带时间戳）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `feedbacks_${timestamp}.csv`

    // 返回 CSV 文件
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('[FeedbackAPI] 导出反馈失败:', error)
    
    // 统一错误处理
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

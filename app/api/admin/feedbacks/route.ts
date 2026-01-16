// Spec: /docs/specs/admin-feedback-management.md
// 说明: 反馈列表 API - 获取反馈列表（支持分页、搜索、筛选）
// 权限: 管理员（role = 0）

import { NextRequest, NextResponse } from 'next/server'
import { getFeedbackList } from '@/services/feedback.service'
import { FeedbackQueryParams } from '@/types/admin'

/**
 * GET /api/admin/feedbacks - 获取反馈列表
 * 
 * 支持功能:
 * - 分页查询
 * - 关键词搜索（用户名/手机号/反馈内容）
 * - 反馈类型筛选（投诉/举报/建议）
 * - 状态筛选（待处理/已处理）
 * - 时间范围筛选
 * 
 * 权限要求: 管理员（role = 0）- 已由 Middleware 验证
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数（Middleware 已验证管理员权限）
    const { searchParams } = new URL(request.url)
    
    const params: FeedbackQueryParams = {
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '20'),
      keyword: searchParams.get('keyword') || undefined,
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') ? parseInt(searchParams.get('status')!) : undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    }

    // 调用 Service 层
    const result = await getFeedbackList(params)

    // 返回成功响应
    return NextResponse.json({
      code: 200,
      data: result
    })
  } catch (error) {
    console.error('[FeedbackAPI] 获取反馈列表失败:', error)
    
    // 统一错误处理
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

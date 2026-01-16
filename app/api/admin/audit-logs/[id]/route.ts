// Spec: /docs/specs/admin-audit-logs.md
// 说明: 管理后台审计日志API - 详情查询
// GET /api/admin/audit-logs/:id - 获取审计日志详情

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import { getAuditLogDetail } from '@/services/audit.service'
import { NotFoundError } from '@/utils/error'

/**
 * 验证管理员权限
 * 从请求头提取JWT Token并验证，确保用户为管理员（role = 0）
 */
async function verifyAdmin(req: NextRequest) {
  // 从 Authorization 头获取 Token
  const authHeader = req.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { code: 401, error: 'Missing or invalid token' },
      { status: 401 }
    )
  }

  const token = authHeader.substring(7)

  // 验证 Token
  const payload = await verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { code: 401, error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  // 检查是否为管理员
  if (payload.role !== 0) {
    return NextResponse.json(
      { code: 403, error: '需要管理员权限' },
      { status: 403 }
    )
  }

  return { payload }
}

/**
 * GET /api/admin/audit-logs/:id
 * 获取审计日志详情
 * 
 * URL参数:
 * - id: 审计日志UUID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const auth = await verifyAdmin(req)
    if (auth instanceof NextResponse) {
      return auth // 返回错误响应
    }

    // 获取审计日志ID
    const { id } = params

    // ID格式验证（UUID格式）
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { code: 400, error: '无效的审计日志ID格式' },
        { status: 400 }
      )
    }

    // 调用 Service 层获取审计日志详情
    const detail = await getAuditLogDetail(id)

    return NextResponse.json({
      code: 200,
      data: detail
    })
  } catch (error: any) {
    console.error('[API] 获取审计日志详情失败:', error)

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { code: 404, error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { code: 500, error: '服务器错误' },
      { status: 500 }
    )
  }
}

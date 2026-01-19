// Spec: /docs/specs/admin-audit-logs.md
// 说明: 管理后台审计日志API - 标记违规
// PUT /api/admin/audit-logs/:id/mark-violation - 标记审计日志为违规

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import { markAuditLogAsViolation } from '@/services/audit.service'
import { NotFoundError } from '@/utils/error'

/**
 * 从请求头提取真实IP地址
 * 优先级: x-forwarded-for > x-real-ip > unknown
 */
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return 'unknown'
}

/**
 * 验证管理员权限
 * 从 Cookie 读取 JWT Token 并验证，确保用户为管理员（role = 0）
 */
async function verifyAdmin(req: NextRequest) {
  // 从 Cookie 获取 Token（Middleware 已验证过一次，这里再验证确保安全）
  const token = req.cookies.get('auth_token')?.value
  
  if (!token) {
    return NextResponse.json(
      { code: 401, error: 'Missing or invalid token' },
      { status: 401 }
    )
  }

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

  return { payload, ip: getClientIP(req) }
}

/**
 * PUT /api/admin/audit-logs/:id/mark-violation
 * 标记审计日志为违规
 * 
 * URL参数:
 * - id: 审计日志UUID
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证管理员权限
    const auth = await verifyAdmin(req)
    if (auth instanceof NextResponse) {
      return auth // 返回错误响应
    }

    const { payload, ip } = auth

    // 获取审计日志ID（Next.js 15 中 params 是 Promise）
    const { id } = await params
    
    console.log('[API] 标记审计日志为违规，ID:', id)

    // ID格式验证（UUID格式）
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      console.error('[API] 无效的审计日志ID格式:', id)
      return NextResponse.json(
        { code: 400, error: `无效的审计日志ID格式: ${id}` },
        { status: 400 }
      )
    }

    // 调用 Service 层标记为违规
    const updatedLog = await markAuditLogAsViolation(id, payload.userId, ip)

    return NextResponse.json({
      code: 200,
      message: '已成功标记为违规',
      data: updatedLog
    })
  } catch (error: any) {
    console.error('[API] 标记审计日志为违规失败:', error)

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

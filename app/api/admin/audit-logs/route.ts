// Spec: /docs/specs/admin-audit-logs.md
// 说明: 管理后台审计日志API - 列表查询
// GET /api/admin/audit-logs - 获取审计日志列表（分页、搜索、筛选）

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import { getAuditLogs } from '@/services/audit.service'
import { ValidationError } from '@/utils/error'

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

  return { payload, ip: getClientIP(req) }
}

/**
 * GET /api/admin/audit-logs
 * 获取审计日志列表（支持分页、搜索、筛选）
 * 
 * Query参数:
 * - page: 页码（默认 1）
 * - pageSize: 每页数量（默认 20，最大 100）
 * - keyword: 搜索关键词（手机号/IP/模型名称）
 * - status: 状态筛选（0=违规拦截, 1=通过）
 * - startDate: 开始时间（ISO 格式）
 * - endDate: 结束时间（ISO 格式）
 */
export async function GET(req: NextRequest) {
  try {
    // 验证管理员权限
    const auth = await verifyAdmin(req)
    if (auth instanceof NextResponse) {
      return auth // 返回错误响应
    }

    // 解析查询参数
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 100)
    const keyword = searchParams.get('keyword') || undefined
    const statusParam = searchParams.get('status')
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    // 参数验证
    if (page < 1) {
      return NextResponse.json(
        { code: 400, error: '页码必须大于0' },
        { status: 400 }
      )
    }

    if (pageSize < 1) {
      return NextResponse.json(
        { code: 400, error: '每页数量必须大于0' },
        { status: 400 }
      )
    }

    // 时间格式验证
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json(
        { code: 400, error: '开始时间格式错误，请使用 ISO 8601 格式' },
        { status: 400 }
      )
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json(
        { code: 400, error: '结束时间格式错误，请使用 ISO 8601 格式' },
        { status: 400 }
      )
    }

    // 构建查询参数
    const query = {
      page,
      pageSize,
      keyword,
      status: statusParam !== null ? parseInt(statusParam) : undefined,
      startDate,
      endDate
    }

    // 调用 Service 层获取审计日志列表
    const result = await getAuditLogs(query)

    return NextResponse.json({
      code: 200,
      data: result
    })
  } catch (error: any) {
    console.error('[API] 获取审计日志列表失败:', error)

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { code: 400, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { code: 500, error: '服务器错误' },
      { status: 500 }
    )
  }
}

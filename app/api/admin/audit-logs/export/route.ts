// Spec: /docs/specs/admin-audit-logs.md
// 说明: 管理后台审计日志API - 数据导出
// GET /api/admin/audit-logs/export - 导出审计日志为CSV文件

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import { exportAuditLogs } from '@/services/audit.service'
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
 * GET /api/admin/audit-logs/export
 * 导出审计日志为CSV文件
 * 
 * Query参数:
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

    const { payload, ip } = auth

    // 解析查询参数
    const searchParams = req.nextUrl.searchParams
    const keyword = searchParams.get('keyword') || undefined
    const statusParam = searchParams.get('status')
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

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
      keyword,
      status: statusParam !== null ? parseInt(statusParam) : undefined,
      startDate,
      endDate
    }

    // 调用 Service 层导出审计日志
    const csvContent = await exportAuditLogs(query, payload.userId, ip)

    // 生成文件名（包含时间戳）
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `audit_logs_${timestamp}.csv`

    // 设置响应头
    const headers = new Headers()
    headers.set('Content-Type', 'text/csv; charset=utf-8')
    headers.set('Content-Disposition', `attachment; filename="${filename}"`)

    return new NextResponse(csvContent, {
      status: 200,
      headers
    })
  } catch (error: any) {
    console.error('[API] 导出审计日志失败:', error)

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

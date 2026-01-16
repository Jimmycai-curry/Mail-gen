// Spec: /docs/specs/admin-user-management.md
// 说明: 管理后台用户管理API - 导出用户数据
// GET /api/admin/users/export - 导出用户数据（CSV格式）

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import { exportUsers } from '@/services/admin.service'
import { ValidationError } from '@/utils/error'

/**
 * 从请求头提取真实IP地址
 * 优先级: x-forwarded-for > x-real-ip > req.ip
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
      { success: false, error: 'Missing or invalid token' },
      { status: 401 }
    )
  }

  const token = authHeader.substring(7)

  // 验证 Token
  const payload = await verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  // 检查是否为管理员
  if (payload.role !== 0) {
    return NextResponse.json(
      { success: false, error: '需要管理员权限' },
      { status: 403 }
    )
  }

  return { payload, ip: getClientIP(req) }
}

/**
 * GET /api/admin/users/export
 * 导出用户数据（CSV格式）
 * 
 * Query参数:
 * - search: 搜索关键词（手机号或ID）
 * - role: 角色筛选（0=管理员, 1=普通用户）
 * - status: 状态筛选（0=封禁, 1=正常）
 * 
 * 返回: CSV 文件流
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
    const search = searchParams.get('search') || undefined
    const roleParam = searchParams.get('role')
    const statusParam = searchParams.get('status')

    // 构建查询参数
    const query = {
      search,
      role: roleParam !== null ? parseInt(roleParam) : undefined,
      status: statusParam !== null ? parseInt(statusParam) : undefined
    }

    // 调用 Service 层导出用户数据
    const csv = await exportUsers(query, payload.userId, ip)

    // 生成文件名（使用当前日期时间）
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '')
    const filename = `users_${dateStr}_${timeStr}.csv`

    // 返回 CSV 文件
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    })
  } catch (error: any) {
    console.error('[API] 导出用户数据失败:', error)

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    )
  }
}

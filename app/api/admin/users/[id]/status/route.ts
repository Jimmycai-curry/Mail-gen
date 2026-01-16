// Spec: /docs/specs/admin-user-management.md
// 说明: 管理后台用户管理API - 更新用户状态
// PUT /api/admin/users/:id/status - 更新用户状态（启用/禁用）

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import { updateUserStatus } from '@/services/admin.service'
import { ValidationError, NotFoundError } from '@/utils/error'

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
 * PUT /api/admin/users/:id/status
 * 更新用户状态（启用/禁用）
 * 
 * Request Body:
 * - status: 目标状态（0=封禁, 1=正常）
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

    // 获取用户 ID（从 URL 参数）
    const { id: userId } = await params

    // 解析请求体
    const body = await req.json()
    const { status } = body

    // 参数验证
    if (status === undefined || status === null) {
      return NextResponse.json(
        { success: false, error: '状态值不能为空' },
        { status: 400 }
      )
    }

    if (status !== 0 && status !== 1) {
      return NextResponse.json(
        { success: false, error: '状态值无效，必须为 0（封禁）或 1（正常）' },
        { status: 400 }
      )
    }

    // 调用 Service 层更新用户状态
    const updatedUser = await updateUserStatus(userId, status, payload.userId, ip)

    return NextResponse.json({
      success: true,
      message: '用户状态更新成功',
      data: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        status: updatedUser.status
      }
    })
  } catch (error: any) {
    console.error('[API] 更新用户状态失败:', error)

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      )
    }

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

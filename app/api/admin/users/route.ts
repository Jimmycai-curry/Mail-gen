// Spec: /docs/specs/admin-user-management.md
// 说明: 管理后台用户管理API - 用户列表查询和新增用户
// GET /api/admin/users - 获取用户列表（分页、搜索、筛选）
// POST /api/admin/users - 新增用户

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import { getUserList, createUser } from '@/services/admin.service'
import { ValidationError, NotFoundError, ForbiddenError } from '@/utils/error'

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
 * GET /api/admin/users
 * 获取用户列表（支持分页、搜索、筛选）
 * 
 * Query参数:
 * - page: 页码（默认 1）
 * - pageSize: 每页数量（默认 10，最大 100）
 * - search: 搜索关键词（手机号或ID）
 * - role: 角色筛选（0=管理员, 1=普通用户）
 * - status: 状态筛选（0=封禁, 1=正常）
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
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10'), 100)
    const search = searchParams.get('search') || undefined
    const roleParam = searchParams.get('role')
    const statusParam = searchParams.get('status')

    // 参数验证
    if (page < 1) {
      return NextResponse.json(
        { success: false, error: '页码必须大于0' },
        { status: 400 }
      )
    }

    if (pageSize < 1) {
      return NextResponse.json(
        { success: false, error: '每页数量必须大于0' },
        { status: 400 }
      )
    }

    // 构建查询参数
    const query = {
      page,
      pageSize,
      search,
      role: roleParam !== null ? parseInt(roleParam) : undefined,
      status: statusParam !== null ? parseInt(statusParam) : undefined
    }

    // 调用 Service 层获取用户列表
    const result = await getUserList(query)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    console.error('[API] 获取用户列表失败:', error)

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

/**
 * POST /api/admin/users
 * 新增用户
 * 
 * Request Body:
 * - phone: 手机号（必填，11位数字）
 * - role: 角色（必填，0=管理员, 1=普通用户）
 */
export async function POST(req: NextRequest) {
  try {
    // 验证管理员权限
    const auth = await verifyAdmin(req)
    if (auth instanceof NextResponse) {
      return auth // 返回错误响应
    }

    const { payload, ip } = auth

    // 解析请求体
    const body = await req.json()
    const { phone, role } = body

    // 参数验证
    if (!phone) {
      return NextResponse.json(
        { success: false, error: '手机号不能为空' },
        { status: 400 }
      )
    }

    if (role === undefined || role === null) {
      return NextResponse.json(
        { success: false, error: '角色不能为空' },
        { status: 400 }
      )
    }

    // 调用 Service 层创建用户
    const newUser = await createUser(phone, role, payload.userId, ip)

    return NextResponse.json({
      success: true,
      message: '用户创建成功',
      data: {
        userId: newUser.id,
        phone: newUser.phone,
        role: newUser.role
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('[API] 创建用户失败:', error)

    if (error instanceof ValidationError) {
      // 手机号已存在等验证错误
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.message.includes('已存在') ? 409 : 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    )
  }
}

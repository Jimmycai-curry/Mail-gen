// Spec: /docs/specs/admin-dashboard.md (待创建)
// 说明: Dashboard 数据接口，提供统计卡片、用户增长趋势、最新用户列表

import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats, getUserGrowthTrend, getLatestUsers } from '@/services/admin.service'
import { verifyToken } from '@/utils/jwt'
import { DashboardResponse } from '@/types/admin'

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

  // 验证管理员角色（role = 0）
  if (payload.role !== 0) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions. Admin role required.' },
      { status: 403 }
    )
  }

  return { payload, response: null }
}

/**
 * GET /api/admin/dashboard
 * 获取 Dashboard 完整数据
 * 
 * 权限要求：管理员
 * 
 * 返回数据：
 * - stats: 统计数据（总用户量、今日新增、今日生成量、今日拦截）
 * - growthTrend: 用户增长趋势（30天）
 * - latestUsers: 最新注册用户（10条）
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[API] GET /api/admin/dashboard - 开始处理')

    // 1. 验证管理员权限
    const authResult = await verifyAdmin(request)
    if (authResult.response) {
      console.error('[API] Dashboard 访问失败: 权限验证失败')
      return authResult.response
    }

    const { payload } = authResult
    console.log(`[API] 管理员验证通过: ${payload.userId}`)

    // 2. 并行调用 3 个 Service 函数获取数据
    const [stats, growthTrend, latestUsers] = await Promise.all([
      getDashboardStats(),
      getUserGrowthTrend(30),
      getLatestUsers(10)
    ])

    // 3. 构建响应数据
    const response: DashboardResponse = {
      stats,
      growthTrend,
      latestUsers
    }

    console.log('[API] Dashboard 数据获取成功')

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('[API] Dashboard 数据获取失败:', error)
    
    return NextResponse.json(
      { 
        error: '获取 Dashboard 数据失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

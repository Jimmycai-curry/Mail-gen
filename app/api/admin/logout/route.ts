// Spec: 管理员登出功能
// 说明: 管理员登出接口
// 功能: 清除 HttpOnly Cookie，不记录登出日志

import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/admin/logout
 * 
 * 功能：
 * 1. 清除 auth_token Cookie
 * 2. 返回成功响应
 * 
 * 注意：
 * - 无需验证 Token（允许过期 Token 也能登出）
 * - 不记录登出日志（根据需求）
 * - 前端需要自行跳转到管理员登录页
 */
export async function POST(request: NextRequest) {
  console.log('[AdminLogout] 管理员登出请求')

  // 创建响应对象
  const response = NextResponse.json({
    success: true,
    message: '登出成功'
  })

  // 清除 auth_token Cookie
  // 通过设置 maxAge=0 来立即过期
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // 立即过期
    path: '/', // 必须与设置时的 path 一致
  })

  console.log('[AdminLogout] Cookie 已清除')

  return response
}

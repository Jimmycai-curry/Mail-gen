// Spec: /docs/specs/login-backend.md, /docs/specs/admin-auth-middleware.md
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/utils/jwt'

// ==================== 管理后台路由配置 ====================
// 管理后台受保护的路由（需要管理员权限 role === 0）
const ADMIN_PROTECTED_ROUTES = ['/admin', '/api/admin']
// 管理后台公开路由（无需登录即可访问）
const ADMIN_PUBLIC_ROUTES = ['/admin/login']

// ==================== 普通用户路由配置 ====================
// 受保护的路由列表（需要登录才能访问）
const PROTECTED_ROUTES = ['/dashboard', '/settings']
// 公开的路由列表（无需登录即可访问）
const PUBLIC_ROUTES = ['/login', '/set-password']

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // 统一获取 Token，避免重复代码
  const token = request.cookies.get('auth_token')?.value

  // ==================== 管理后台路由保护（优先级最高）====================
  // 判断是否为管理后台路由
  const isAdminRoute = ADMIN_PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  
  if (isAdminRoute) {
    // 公开路由直接放行（如 /admin/login）
    if (ADMIN_PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // 判断是否为 API 路由（需要返回 JSON 而不是重定向）
    const isApiRoute = pathname.startsWith('/api/admin')

    // 检查 Token 是否存在
    if (!token) {
      if (isApiRoute) {
        // API 路由：返回 401 JSON 错误
        return NextResponse.json(
          { 
            success: false,
            error: 'Unauthorized', 
            message: '需要管理员权限，请先登录' 
          },
          { status: 401 }
        )
      }
      // 页面路由：重定向到管理员登录页
      return redirectToAdminLogin(request, pathname)
    }

    // 验证 Token 有效性
    const payload = await verifyToken(token)
    if (!payload) {
      if (isApiRoute) {
        // API 路由：返回 401 JSON 错误
        return NextResponse.json(
          { 
            success: false,
            error: 'Unauthorized', 
            message: 'Token 无效或已过期' 
          },
          { status: 401 }
        )
      }
      // 页面路由：重定向到管理员登录页
      return redirectToAdminLogin(request, pathname)
    }

    // ⚠️ 关键：验证管理员角色（role === 0）
    if (payload.role !== 0) {
      if (isApiRoute) {
        // API 路由：返回 403 JSON 错误（已登录但权限不足）
        return NextResponse.json(
          { 
            success: false,
            error: 'Forbidden', 
            message: '需要管理员权限，当前用户权限不足' 
          },
          { status: 403 }
        )
      }
      // 页面路由：重定向到管理员登录页并提示权限不足
      return redirectToAdminLogin(request, pathname, 'unauthorized')
    }
    
    // ✅ Token 有效且是管理员，允许访问
    return NextResponse.next()
  }

  // ==================== 普通用户路由保护 ====================
  // 公开路由直接放行，不检查 Token
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // 受保护路由需要验证 Token
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!token) {
      // 未登录，重定向到登录页，并保存原始路径
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // 验证 Token 有效性
    const payload = await verifyToken(token)
    if (!payload) {
      // Token 无效或过期，重定向到登录页
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Token 有效，允许访问
    return NextResponse.next()
  }

  // ==================== 根路由处理 ====================
  // 根路由处理：已登录用户跳转到 Dashboard
  if (pathname === '/') {
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // 其他情况放行
  return NextResponse.next()
}

/**
 * 辅助函数：重定向到管理员登录页
 * 
 * @param request - Next.js 请求对象
 * @param pathname - 原始访问路径
 * @param reason - 拒绝访问的原因（可选）
 * @returns 重定向响应
 */
function redirectToAdminLogin(
  request: NextRequest,
  pathname: string,
  reason?: 'unauthorized'
): NextResponse {
  const url = new URL('/admin/login', request.url)
  
  // 保存原始路径，便于登录后跳转回来
  url.searchParams.set('redirect', pathname)
  
  // 如果是权限不足，添加错误参数
  if (reason === 'unauthorized') {
    url.searchParams.set('error', 'unauthorized')
  }
  
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // 匹配所有路由，但排除以下内容：
    // - /_next/static (Next.js 静态资源)
    // - /_next/image (Next.js 图片优化)
    // - /favicon.ico (网站图标)
    // 注意：不排除 /api，因为我们需要保护 /api/admin/* 路由
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

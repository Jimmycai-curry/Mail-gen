// Spec: /docs/specs/login-backend.md
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/utils/jwt'

// 受保护的路由列表（需要登录才能访问）
const PROTECTED_ROUTES = ['/dashboard', '/settings']
// 公开的路由列表（无需登录即可访问）
const PUBLIC_ROUTES = ['/login', '/set-password']

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // 统一获取 Token，避免重复代码
  const token = request.cookies.get('auth_token')?.value

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

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

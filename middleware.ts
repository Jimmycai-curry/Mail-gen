// Spec: /docs/specs/login-backend.md
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/utils/jwt'

const PROTECTED_ROUTES = ['/dashboard', '/settings']
const PUBLIC_ROUTES = ['/login', '/set-password']

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)
  const token = request.cookies.get('auth_token')?.value

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    const payload = await verifyToken(token)
    if (!payload) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/' && token) {
    const payload = await verifyToken(token)
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

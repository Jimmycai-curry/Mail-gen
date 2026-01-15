// Spec: /docs/specs/login-backend.md
// 说明: 请求工具函数
// 用于从请求头中提取真实IP地址（处理代理、CDN等场景）

/**
 * 从请求中提取真实IP地址
 *
 * 优先级顺序:
 * 1. X-Forwarded-For: 代理服务器传递的客户端IP列表（第一个为真实IP）
 * 2. X-Real-IP: Nginx等代理传递的真实IP
 * 3. CF-Connecting-IP: Cloudflare传递的客户端IP
 * 4. 直接连接的IP
 *
 * @param request - Next.js Request对象
 * @returns 客户端真实IP地址
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    const realClientIP = ips[0]
    console.log('[Request] 从 X-Forwarded-For 提取IP:', realClientIP)
    return realClientIP
  }

  if (realIP) {
    console.log('[Request] 从 X-Real-IP 提取IP:', realIP)
    return realIP
  }

  if (cfConnectingIP) {
    console.log('[Request] 从 CF-Connecting-IP 提取IP:', cfConnectingIP)
    return cfConnectingIP
  }

  const fallbackIP = '0.0.0.0'
  console.log('[Request] 未能提取到真实IP，使用默认值:', fallbackIP)
  return fallbackIP
}

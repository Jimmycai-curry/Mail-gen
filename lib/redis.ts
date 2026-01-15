// Spec: /docs/specs/login-page.md
// 说明: Redis客户端单例模式,用于存储短信验证码、限流记录等临时数据
// 为什么需要单例? Next.js开发模式热重载会导致多个Redis连接,耗尽连接池

import Redis from 'ioredis'

// 定义全局类型,用于存储Redis客户端实例
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

/**
 * 导出Redis客户端实例(单例模式)
 *
 * 使用方式:
 * ```typescript
 * import { redis } from '@/lib/redis'
 *
 * // 存储数据(带过期时间)
 * await redis.set('key', 'value', 'EX', 300) // 5分钟后过期
 *
 * // 读取数据
 * const value = await redis.get('key')
 *
 * // 删除数据
 * await redis.del('key')
 * ```
 */
export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3, // 最多重试3次
    enableReadyCheck: true,  // 启用就绪检查
  })

// 在开发环境缓存Redis客户端实例(热重载时复用)
if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

// 监听连接错误,避免进程崩溃
redis.on('error', (error) => {
  console.error('[Redis] 连接错误:', error.message)
})

// 监听连接成功
redis.on('connect', () => {
  console.log('[Redis] 连接成功')
})

// ✅ 优雅关闭Redis连接(应用退出时调用)
export const disconnect = async () => {
  await redis.quit()
}

// ✅ 监听进程退出事件,自动关闭连接
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await disconnect()
  })
}

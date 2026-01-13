import { PrismaClient } from '@/app/generated/prisma/client'

/**
 * Prisma Client 单例模式
 * 
 * 为什么需要单例？
 * - Next.js 开发模式会热重载，每次重载都会创建新的 Prisma Client
 * - 多个 Client 实例会导致数据库连接池耗尽
 * - 使用全局变量缓存 Client 实例，确保整个应用只有一个实例
 */

// 定义全局类型（用于存储 Prisma Client）
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * 导出 Prisma Client 实例
 * 
 * 使用方式：
 * ```typescript
 * import { prisma } from '@/lib/db'
 * 
 * const users = await prisma.users.findMany()
 * ```
 */
export const prisma = 
  globalForPrisma.prisma ?? 
  new PrismaClient({
    // 开发环境打印所有查询日志，生产环境只打印错误
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })

// 在开发环境缓存 Prisma Client 实例（热重载时复用）
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ✅ 优雅关闭数据库连接（应用退出时调用）
export const disconnect = async () => {
    await prisma.$disconnect()
}

// ✅ 监听进程退出事件，自动关闭连接
if (typeof window === 'undefined') {
process.on('beforeExit', async () => {
    await disconnect()
})
}

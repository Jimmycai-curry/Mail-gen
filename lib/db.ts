import { PrismaClient } from '@/lib/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 使用独立变量缓存 Prisma 实例，避免覆盖全局对象
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const databaseUrl = process.env.DATABASE_URL
const useAccelerate =
  Boolean(databaseUrl) &&
  (databaseUrl?.startsWith('prisma+postgres://') || databaseUrl?.startsWith('prisma://'))
const useAdapter =
  Boolean(databaseUrl) &&
  (databaseUrl?.startsWith('postgresql://') || databaseUrl?.startsWith('postgres://'))
const adapter =
  useAdapter && databaseUrl
    ? new PrismaPg(
        new Pool({
          connectionString: databaseUrl
        })
      )
    : undefined

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Prisma Postgres/Accelerate 场景需要提供 accelerateUrl
    ...(useAccelerate && databaseUrl ? { accelerateUrl: databaseUrl } : {}),
    // 本地 PostgreSQL 使用 adapter 直连
    ...(adapter ? { adapter } : {})
  })

if (process.env.NODE_ENV !== 'production') {
  // 开发环境复用单例，避免热重载创建多连接
  globalForPrisma.prisma = prisma
}

export const disconnect = async () => {
  await prisma.$disconnect()
}

if (typeof window === 'undefined') {
  // Node.js 进程退出前释放连接
  process.on('beforeExit', async () => {
    await disconnect()
  })
}

// Spec: /docs/specs/admin-user-management.md
// 说明: 管理后台用户管理服务
// 负责用户列表查询、状态管理、新增用户、数据导出等核心业务逻辑

import { prisma } from '@/lib/db'
import { ValidationError, NotFoundError } from '@/utils/error'
import { UserListQuery, UserListResponse, UserListItem } from '@/types/admin'
import bcrypt from 'bcryptjs'

/**
 * 获取用户列表（支持分页、搜索、筛选）
 * 
 * @param query - 查询参数（page, pageSize, search, role, status）
 * @returns 用户列表响应数据
 */
export async function getUserList(query: UserListQuery): Promise<UserListResponse> {
  console.log('[AdminService] 获取用户列表:', query)

  const { page, pageSize, search, role, status } = query

  // 构建查询条件
  const where: any = {}

  // 搜索条件：手机号模糊匹配或ID精确匹配
  if (search) {
    // 判断是否为有效的UUID格式（36位，包含4个连字符）
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(search)
    
    if (isUUID) {
      // 如果是UUID，同时搜索手机号和ID
      where.OR = [
        { phone: { contains: search } },
        { id: search }
      ]
    } else {
      // 如果不是UUID，只搜索手机号
      where.phone = { contains: search }
    }
  }

  // 角色筛选
  if (role !== undefined) {
    where.role = role
  }

  // 状态筛选
  if (status !== undefined) {
    where.status = status
  }

  // 计算偏移量
  const skip = (page - 1) * pageSize

  // 并行执行：查询总数 + 查询数据
  const [total, users] = await Promise.all([
    prisma.users.count({ where }),
    prisma.users.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_time: 'desc' },
      select: {
        id: true,
        phone: true,
        role: true,
        status: true,
        created_time: true,
        last_login_time: true,
        last_login_ip: true
      }
    })
  ])

  console.log('[AdminService] 查询结果:', { total, count: users.length })

  return {
    users: users as UserListItem[],
    total,
    page,
    pageSize
  }
}

/**
 * 更新用户状态（启用/禁用）
 * 
 * @param userId - 用户ID
 * @param status - 目标状态（0=封禁, 1=正常）
 * @param adminId - 操作管理员ID
 * @param adminIp - 操作管理员IP
 * @returns 更新后的用户信息
 */
export async function updateUserStatus(
  userId: string,
  status: number,
  adminId: string,
  adminIp: string
) {
  console.log('[AdminService] 更新用户状态:', { userId, status, adminId })

  // 验证状态值
  if (status !== 0 && status !== 1) {
    throw new ValidationError('状态值无效，必须为 0（封禁）或 1（正常）')
  }

  // 检查用户是否存在
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      role: true,
      status: true
    }
  })

  if (!user) {
    throw new NotFoundError('用户不存在')
  }

  // 不能禁用自己
  if (userId === adminId && status === 0) {
    throw new ValidationError('不能禁用自己的账户')
  }

  // 更新用户状态
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      status,
      updated_time: new Date()
    },
    select: {
      id: true,
      phone: true,
      role: true,
      status: true
    }
  })

  // 记录操作日志
  await prisma.admin_operation_logs.create({
    data: {
      admin_id: adminId,
      action_type: status === 0 ? 'DISABLE_USER' : 'ENABLE_USER',
      target_id: userId,
      detail: `修改用户 ${user.phone} 状态为 ${status === 0 ? '封禁' : '正常'}`,
      ip: adminIp
    }
  })

  console.log('[AdminService] 用户状态更新成功:', { userId, status })

  return updatedUser
}

/**
 * 创建新用户
 * 
 * @param phone - 手机号
 * @param role - 角色（0=管理员, 1=普通用户）
 * @param adminId - 操作管理员ID
 * @param adminIp - 操作管理员IP
 * @returns 新创建的用户信息
 */
export async function createUser(
  phone: string,
  role: number,
  adminId: string,
  adminIp: string
) {
  console.log('[AdminService] 创建新用户:', { phone, role })

  // 验证手机号格式
  const phoneRegex = /^1\d{10}$/
  if (!phoneRegex.test(phone)) {
    throw new ValidationError('手机号格式错误，必须是11位数字且以1开头')
  }

  // 验证角色值
  if (role !== 0 && role !== 1) {
    throw new ValidationError('角色值无效，必须为 0（管理员）或 1（普通用户）')
  }

  // 检查手机号是否已存在
  const existingUser = await prisma.users.findUnique({
    where: { phone }
  })

  if (existingUser) {
    throw new ValidationError('手机号已存在')
  }

  // 创建新用户
  const newUser = await prisma.users.create({
    data: {
      phone,
      role,
      status: 1, // 默认状态为正常
      password_hash: '' // 首次登录强制设置密码
    },
    select: {
      id: true,
      phone: true,
      role: true,
      status: true,
      created_time: true
    }
  })

  // 记录操作日志
  await prisma.admin_operation_logs.create({
    data: {
      admin_id: adminId,
      action_type: 'CREATE_USER',
      target_id: newUser.id,
      detail: `创建用户 ${phone}，角色: ${role === 0 ? '管理员' : '普通用户'}`,
      ip: adminIp
    }
  })

  console.log('[AdminService] 用户创建成功:', { userId: newUser.id, phone })

  return newUser
}

/**
 * 导出用户数据（CSV格式）
 * 
 * @param query - 查询参数（search, role, status）
 * @param adminId - 操作管理员ID
 * @param adminIp - 操作管理员IP
 * @returns CSV格式的字符串
 */
export async function exportUsers(
  query: Omit<UserListQuery, 'page' | 'pageSize'>,
  adminId: string,
  adminIp: string
): Promise<string> {
  console.log('[AdminService] 导出用户数据:', query)

  const { search, role, status } = query

  // 构建查询条件
  const where: any = {}

  if (search) {
    // 判断是否为有效的UUID格式（36位，包含4个连字符）
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(search)
    
    if (isUUID) {
      // 如果是UUID，同时搜索手机号和ID
      where.OR = [
        { phone: { contains: search } },
        { id: search }
      ]
    } else {
      // 如果不是UUID，只搜索手机号
      where.phone = { contains: search }
    }
  }

  if (role !== undefined) {
    where.role = role
  }

  if (status !== undefined) {
    where.status = status
  }

  // 检查导出数量限制
  const count = await prisma.users.count({ where })

  if (count > 10000) {
    throw new ValidationError(`数据量过大，最多支持导出 10,000 条记录，当前 ${count} 条`)
  }

  // 查询所有匹配数据
  const users = await prisma.users.findMany({
    where,
    orderBy: { created_time: 'desc' },
    select: {
      id: true,
      phone: true,
      role: true,
      status: true,
      created_time: true,
      last_login_time: true,
      last_login_ip: true
    }
  })

  // 生成CSV内容（UTF-8 BOM）
  const BOM = '\uFEFF'
  const header = '用户ID,手机号,角色,状态,注册时间,最后登录时间,最后登录IP\n'

  const rows = users.map(user => {
    const roleName = user.role === 0 ? '管理员' : '普通用户'
    const statusName = user.status === 1 ? '正常' : '已封禁'
    const createdTime = user.created_time ? new Date(user.created_time).toLocaleString('zh-CN') : ''
    const lastLoginTime = user.last_login_time ? new Date(user.last_login_time).toLocaleString('zh-CN') : ''
    const lastLoginIp = user.last_login_ip || ''

    return `${user.id},${user.phone},${roleName},${statusName},${createdTime},${lastLoginTime},${lastLoginIp}`
  }).join('\n')

  const csv = BOM + header + rows

  // 记录操作日志
  await prisma.admin_operation_logs.create({
    data: {
      admin_id: adminId,
      action_type: 'EXPORT_USERS',
      target_id: null,
      detail: `导出用户数据，条件: ${JSON.stringify(query)}，数量: ${count}`,
      ip: adminIp
    }
  })

  console.log('[AdminService] 用户数据导出成功:', { count })

  return csv
}

/**
 * 获取用户统计信息（用于仪表盘）
 * 
 * @returns 用户统计数据
 */
export async function getUserStats() {
  console.log('[AdminService] 获取用户统计信息')

  // 并行查询各项统计
  const [
    totalUsers,
    normalUsers,
    bannedUsers,
    adminUsers,
    todayUsers
  ] = await Promise.all([
    // 总用户数
    prisma.users.count(),
    // 正常用户数
    prisma.users.count({ where: { status: 1 } }),
    // 已封禁用户数
    prisma.users.count({ where: { status: 0 } }),
    // 管理员数
    prisma.users.count({ where: { role: 0 } }),
    // 今日新增用户数
    prisma.users.count({
      where: {
        created_time: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })
  ])

  const stats = {
    totalUsers,
    normalUsers,
    bannedUsers,
    adminUsers,
    todayUsers
  }

  console.log('[AdminService] 用户统计:', stats)

  return stats
}

/**
 * 获取 Dashboard 统计数据
 * Spec: /docs/specs/admin-dashboard.md (待创建)
 * 
 * @returns Dashboard 统计数据（包含总用户量、今日新增、今日生成量、今日拦截等）
 */
export async function getDashboardStats() {
  console.log('[AdminService] 获取 Dashboard 统计数据')

  // 计算时间范围
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
  const yesterdayEnd = new Date(todayEnd.getTime() - 24 * 60 * 60 * 1000)
  
  // 上月同期（用于对比总用户量增长）
  const lastMonthToday = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 23, 59, 59, 999)

  // 并行查询所有统计数据
  const [
    totalUsers,
    lastMonthUsers,
    todayNewUsers,
    yesterdayNewUsers,
    todayGenerations,
    yesterdayGenerations,
    todayBlocked,
    yesterdayBlocked,
  ] = await Promise.all([
    // 1. 总用户数
    prisma.users.count(),
    
    // 2. 上月同期用户数（用于计算增长率）
    prisma.users.count({
      where: {
        created_time: {
          lte: lastMonthToday
        }
      }
    }),
    
    // 3. 今日新增用户数
    prisma.users.count({
      where: {
        created_time: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    }),
    
    // 4. 昨日新增用户数
    prisma.users.count({
      where: {
        created_time: {
          gte: yesterdayStart,
          lte: yesterdayEnd
        }
      }
    }),
    
    // 5. 今日生成量（audit_logs 总数）
    prisma.audit_logs.count({
      where: {
        created_time: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    }),
    
    // 6. 昨日生成量
    prisma.audit_logs.count({
      where: {
        created_time: {
          gte: yesterdayStart,
          lte: yesterdayEnd
        }
      }
    }),
    
    // 7. 今日拦截数（status = 2，系统拦截）
    prisma.audit_logs.count({
      where: {
        created_time: {
          gte: todayStart,
          lte: todayEnd
        },
        status: 2  // 系统拦截
      }
    }),
    
    // 8. 昨日拦截数
    prisma.audit_logs.count({
      where: {
        created_time: {
          gte: yesterdayStart,
          lte: yesterdayEnd
        },
        status: 2  // 系统拦截
      }
    }),
  ])

  // 计算拦截率（百分比）
  const todayBlockRate = todayGenerations > 0 
    ? (todayBlocked / todayGenerations) * 100 
    : 0
  const yesterdayBlockRate = yesterdayGenerations > 0 
    ? (yesterdayBlocked / yesterdayGenerations) * 100 
    : 0

  const stats = {
    totalUsers,
    lastMonthUsers,
    todayNewUsers,
    yesterdayNewUsers,
    todayGenerations,
    yesterdayGenerations,
    todayBlocked,
    yesterdayBlocked,
    todayBlockRate,
    yesterdayBlockRate,
  }

  console.log('[AdminService] Dashboard 统计数据:', stats)

  return stats
}

/**
 * 获取用户增长趋势数据
 * Spec: /docs/specs/admin-dashboard.md (待创建)
 * 
 * @param days - 查询天数（默认 30 天）
 * @returns 用户增长趋势数据点数组
 */
export async function getUserGrowthTrend(days: number = 30) {
  console.log(`[AdminService] 获取用户增长趋势数据（近 ${days} 天）`)

  // 计算起始日期
  const endDate = new Date()
  endDate.setHours(23, 59, 59, 999)
  
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - (days - 1))
  startDate.setHours(0, 0, 0, 0)

  // 查询所有在时间范围内的用户
  const users = await prisma.users.findMany({
    where: {
      created_time: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      created_time: true
    },
    orderBy: {
      created_time: 'asc'
    }
  })

  // 按日期分组统计
  const dateCountMap = new Map<string, number>()
  
  // 初始化所有日期为 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    dateCountMap.set(dateStr, 0)
  }

  // 统计每天的用户数
  users.forEach(user => {
    if (user.created_time) {
      const dateStr = new Date(user.created_time).toISOString().split('T')[0]
      const currentCount = dateCountMap.get(dateStr) || 0
      dateCountMap.set(dateStr, currentCount + 1)
    }
  })

  // 转换为数组格式
  const trendData = Array.from(dateCountMap.entries()).map(([date, count]) => ({
    date,
    count
  }))

  console.log(`[AdminService] 用户增长趋势数据点数量: ${trendData.length}`)

  return trendData
}

/**
 * 获取最新注册用户列表
 * Spec: /docs/specs/admin-dashboard.md (待创建)
 * 
 * @param limit - 返回数量限制（默认 10 条）
 * @returns 最新注册用户数据数组
 */
export async function getLatestUsers(limit: number = 10) {
  console.log(`[AdminService] 获取最新注册用户（限制 ${limit} 条）`)

  // 查询最新注册的用户
  const users = await prisma.users.findMany({
    select: {
      id: true,
      phone: true,
      status: true,
      created_time: true,
      last_login_time: true
    },
    orderBy: {
      created_time: 'desc'
    },
    take: limit
  })

  console.log(`[AdminService] 查询到最新用户数量: ${users.length}`)

  return users
}

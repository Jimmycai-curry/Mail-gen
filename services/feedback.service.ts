// Spec: /docs/specs/admin-feedback-management.md
// 说明: 管理后台反馈管理服务
// 负责反馈列表查询、详情获取、处理反馈、数据导出等核心业务逻辑

import { prisma } from '@/lib/db'
import { ValidationError, NotFoundError } from '@/utils/error'
import { 
  FeedbackQueryParams, 
  FeedbackListResponse, 
  FeedbackListItem,
  FeedbackDetail,
  ProcessFeedbackData,
  FeedbackTypeLabel,
} from '@/types/admin'

/**
 * 手机号脱敏处理
 * 
 * @param phone - 原始手机号
 * @returns 脱敏后的手机号（如 "138****0001"）
 */
function maskPhone(phone: string | null): string {
  if (!phone || phone.length !== 11) return phone || '-'
  return phone.slice(0, 3) + '****' + phone.slice(7)
}

/**
 * 格式化时间为 ISO 字符串
 * 
 * @param date - Date 对象或 null
 * @returns ISO 格式时间字符串
 */
function formatISODate(date: Date | null): string {
  return date ? date.toISOString() : ''
}

/**
 * 获取反馈列表（支持分页、搜索、筛选）
 * 
 * @param params - 查询参数（page, pageSize, keyword, type, status, startDate, endDate）
 * @returns 反馈列表响应数据
 */
export async function getFeedbackList(params: FeedbackQueryParams): Promise<FeedbackListResponse> {
  console.log('[FeedbackService] 获取反馈列表:', params)

  const { 
    page = 1, 
    pageSize = 20, 
    keyword, 
    type,
    status, 
    startDate, 
    endDate 
  } = params

  // 验证分页参数
  if (page < 1) {
    throw new ValidationError('页码必须大于 0')
  }
  if (pageSize < 1 || pageSize > 100) {
    throw new ValidationError('每页数量必须在 1-100 之间')
  }

  // 构建 where 查询条件
  const where: any = {}

  // 关键词搜索（用户名/手机号/反馈内容）
  if (keyword && keyword.trim()) {
    where.OR = [
      // 搜索反馈内容
      { content: { contains: keyword.trim() } },
    ]
    // 通过 users 表搜索手机号（需要在 include 中配合使用）
    // 注意：Prisma 不支持直接在 relation 中进行 OR 查询，需要特殊处理
  }

  // 反馈类型筛选
  if (type) {
    where.type = type
  }

  // 状态筛选
  if (status !== undefined) {
    where.status = status
  }

  // 时间范围筛选
  if (startDate) {
    where.created_time = {
      ...where.created_time,
      gte: new Date(startDate)
    }
  }
  if (endDate) {
    where.created_time = {
      ...where.created_time,
      lte: new Date(endDate)
    }
  }

  try {
    // 执行两个并行查询：总数 + 分页数据
    const [total, feedbacks] = await Promise.all([
      // 查询总数
      prisma.feedbacks.count({ where }),
      
      // 查询分页数据（需要 JOIN users 表获取用户信息）
      prisma.feedbacks.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_time: 'desc' },
        // 注意：Prisma schema 中 feedbacks 表没有定义 relation
        // 需要手动通过 user_id 查询 users 表
      })
    ])

    // 获取所有用户 ID
    const userIds = feedbacks.map(f => f.user_id)
    
    // 批量查询用户信息
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        phone: true,
      }
    })

    // 创建用户 ID 到用户信息的映射
    const userMap = new Map(users.map(u => [u.id, u]))

    // 格式化数据
    const list: FeedbackListItem[] = feedbacks.map(feedback => {
      const user = userMap.get(feedback.user_id)
      const phone = user?.phone || ''
      
      return {
        id: feedback.id,
        userId: feedback.user_id,
        userName: phone ? `用户 ${phone.slice(-4)}` : '未知用户', // 根据手机号后4位生成显示名
        userPhone: maskPhone(phone),
        type: feedback.type,
        content: feedback.content,
        status: feedback.status || 0,
        adminNote: feedback.admin_note,
        processedTime: formatISODate(feedback.processed_time),
        createdTime: formatISODate(feedback.created_time),
        logId: feedback.log_id,
      }
    })

    // 如果有关键词搜索，额外过滤手机号匹配的结果
    let filteredList = list
    if (keyword && keyword.trim()) {
      filteredList = list.filter(item => 
        item.content.includes(keyword.trim()) ||
        item.userPhone.includes(keyword.trim()) ||
        item.userName.includes(keyword.trim())
      )
    }

    console.log(`[FeedbackService] 成功查询反馈列表，共 ${total} 条，返回第 ${page} 页`)

    return {
      list: filteredList,
      total
    }
  } catch (error) {
    console.error('[FeedbackService] 查询反馈列表失败:', error)
    throw error
  }
}

/**
 * 获取反馈详情
 * 
 * @param id - 反馈 UUID
 * @returns 反馈详情数据
 */
export async function getFeedbackDetail(id: string): Promise<FeedbackDetail> {
  console.log('[FeedbackService] 获取反馈详情:', id)

  try {
    // 查询反馈记录
    const feedback = await prisma.feedbacks.findUnique({
      where: { id }
    })

    if (!feedback) {
      throw new NotFoundError('反馈不存在')
    }

    // 查询用户信息
    const user = await prisma.users.findUnique({
      where: { id: feedback.user_id },
      select: {
        id: true,
        phone: true,
      }
    })

    const phone = user?.phone || ''

    const detail: FeedbackDetail = {
      id: feedback.id,
      userId: feedback.user_id,
      userName: phone ? `用户 ${phone.slice(-4)}` : '未知用户',
      userPhone: maskPhone(phone),
      type: feedback.type,
      content: feedback.content,
      status: feedback.status || 0,
      adminNote: feedback.admin_note,
      processedTime: formatISODate(feedback.processed_time),
      createdTime: formatISODate(feedback.created_time),
      logId: feedback.log_id,
    }

    console.log('[FeedbackService] 成功获取反馈详情')
    return detail
  } catch (error) {
    console.error('[FeedbackService] 获取反馈详情失败:', error)
    throw error
  }
}

/**
 * 处理反馈（更新状态为已处理）
 * 
 * @param id - 反馈 UUID
 * @param data - 处理数据（管理员备注）
 * @param adminId - 操作管理员 ID
 * @param adminIp - 管理员操作 IP
 */
export async function processFeedback(
  id: string, 
  data: ProcessFeedbackData, 
  adminId: string, 
  adminIp: string
): Promise<void> {
  console.log('[FeedbackService] 处理反馈:', { id, adminId, adminIp })

  try {
    // 查询反馈是否存在
    const feedback = await prisma.feedbacks.findUnique({
      where: { id }
    })

    if (!feedback) {
      throw new NotFoundError('反馈不存在')
    }

    // 检查是否已处理
    if (feedback.status === 1) {
      throw new ValidationError('该反馈已处理，无需重复操作')
    }

    // 更新反馈状态
    await prisma.feedbacks.update({
      where: { id },
      data: {
        status: 1,
        admin_note: data.adminNote || null,
        processed_time: new Date(),
      }
    })

    // 记录操作日志
    await prisma.admin_operation_logs.create({
      data: {
        admin_id: adminId,
        action_type: 'PROCESS_FEEDBACK',
        target_id: id,
        detail: `处理反馈: ${FeedbackTypeLabel[feedback.type] || feedback.type}${data.adminNote ? `, 备注: ${data.adminNote}` : ''}`,
        ip: adminIp,
      }
    })

    console.log('[FeedbackService] 反馈处理成功')
  } catch (error) {
    console.error('[FeedbackService] 处理反馈失败:', error)
    throw error
  }
}

/**
 * 导出反馈数据为 CSV 格式
 * 
 * @param params - 查询参数（筛选条件）
 * @param adminId - 操作管理员 ID
 * @param adminIp - 管理员操作 IP
 * @returns CSV 字符串
 */
export async function exportFeedbacks(
  params: FeedbackQueryParams,
  adminId: string,
  adminIp: string
): Promise<string> {
  console.log('[FeedbackService] 导出反馈数据:', params)

  const { keyword, type, status, startDate, endDate } = params

  // 构建 where 查询条件（与 getFeedbackList 相同）
  const where: any = {}

  if (type) {
    where.type = type
  }

  if (status !== undefined) {
    where.status = status
  }

  if (startDate) {
    where.created_time = {
      ...where.created_time,
      gte: new Date(startDate)
    }
  }
  if (endDate) {
    where.created_time = {
      ...where.created_time,
      lte: new Date(endDate)
    }
  }

  try {
    // 检查导出数量
    const count = await prisma.feedbacks.count({ where })
    if (count > 10000) {
      throw new ValidationError(`数据量过大，最多支持导出 10,000 条记录，当前 ${count} 条`)
    }

    // 查询所有匹配数据（不分页）
    const feedbacks = await prisma.feedbacks.findMany({
      where,
      orderBy: { created_time: 'desc' },
    })

    // 获取所有用户 ID
    const userIds = feedbacks.map(f => f.user_id)
    
    // 批量查询用户信息
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        phone: true,
      }
    })

    // 创建用户 ID 到用户信息的映射
    const userMap = new Map(users.map(u => [u.id, u]))

    // 生成 CSV 内容
    // UTF-8 BOM 编码（用于 Excel 正确识别中文）
    let csv = '\uFEFF'
    
    // CSV 表头
    csv += '反馈ID,用户姓名,用户手机号,反馈类型,反馈内容,提交时间,处理状态,管理员备注\n'
    
    // CSV 数据行
    feedbacks.forEach(feedback => {
      const user = userMap.get(feedback.user_id)
      const phone = user?.phone || ''
      const userName = phone ? `用户 ${phone.slice(-4)}` : '未知用户'
      const userPhone = maskPhone(phone)
      const typeLabel = FeedbackTypeLabel[feedback.type] || feedback.type
      const statusLabel = feedback.status === 1 ? '已处理' : '待处理'
      const createdTime = feedback.created_time 
        ? new Date(feedback.created_time).toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })
        : ''
      
      // 转义 CSV 特殊字符（双引号、逗号、换行）
      const escapeCsvField = (field: string | null) => {
        if (!field) return ''
        const str = String(field)
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      csv += [
        escapeCsvField(feedback.id),
        escapeCsvField(userName),
        escapeCsvField(userPhone),
        escapeCsvField(typeLabel),
        escapeCsvField(feedback.content),
        escapeCsvField(createdTime),
        escapeCsvField(statusLabel),
        escapeCsvField(feedback.admin_note),
      ].join(',') + '\n'
    })

    // 记录操作日志
    await prisma.admin_operation_logs.create({
      data: {
        admin_id: adminId,
        action_type: 'EXPORT_FEEDBACKS',
        target_id: null,
        detail: `导出反馈数据 ${count} 条，筛选条件: ${JSON.stringify({ type, status, startDate, endDate })}`,
        ip: adminIp,
      }
    })

    console.log(`[FeedbackService] 成功导出 ${count} 条反馈数据`)
    return csv
  } catch (error) {
    console.error('[FeedbackService] 导出反馈数据失败:', error)
    throw error
  }
}

/**
 * 获取待处理反馈数量（用于徽章显示）
 * 
 * @returns 待处理反馈数量
 */
export async function getPendingFeedbackCount(): Promise<number> {
  try {
    const count = await prisma.feedbacks.count({
      where: {
        status: 0 // 待处理
      }
    })
    return count
  } catch (error) {
    console.error('[FeedbackService] 获取待处理反馈数量失败:', error)
    return 0
  }
}

/**
 * 用户提交反馈（建议、举报、自定义反馈）
 * Spec: /docs/specs/user-feedback-submission.md
 * 
 * @param data - 反馈数据
 * @param data.userId - 用户 UUID
 * @param data.logId - 关联的 audit_logs.id
 * @param data.type - 反馈类型：'SUGGESTION' | 'REPORT' | 'CUSTOM'
 * @param data.content - 反馈内容（1-500字符）
 */
export async function submitUserFeedback(data: {
  userId: string;
  logId: string;
  type: string;
  content: string;
}): Promise<void> {
  console.log('[FeedbackService] 用户提交反馈:', {
    userId: data.userId,
    logId: data.logId,
    type: data.type,
    contentLength: data.content.length
  })

  const { userId, logId, type, content } = data

  // ========== 步骤 1: 参数校验 ==========
  const validTypes = ['SUGGESTION', 'REPORT', 'CUSTOM']
  if (!validTypes.includes(type)) {
    throw new ValidationError(`反馈类型必须是 ${validTypes.join('、')}`)
  }

  if (!content || content.trim().length === 0) {
    throw new ValidationError('反馈内容不能为空')
  }

  if (content.length > 500) {
    throw new ValidationError('反馈内容最多 500 字符')
  }

  try {
    // ========== 步骤 2: 验证 logId 是否存在 ==========
    const auditLog = await prisma.audit_logs.findUnique({
      where: { id: logId }
    })

    if (!auditLog) {
      throw new NotFoundError('关联的生成记录不存在')
    }

    // ========== 步骤 3: 插入 feedbacks 表 ==========
    await prisma.feedbacks.create({
      data: {
        user_id: userId,
        log_id: logId,
        type: type,
        content: content.trim(),
        status: 0,  // 待处理
        // created_time 会自动生成
      }
    })

    console.log('[FeedbackService] 反馈提交成功', {
      userId,
      logId,
      type
    })

  } catch (error) {
    // 如果是已知的业务异常，直接抛出
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error
    }

    // 数据库错误
    console.error('[FeedbackService] 提交反馈失败:', error)
    throw new Error('反馈提交失败，请稍后重试')
  }
}

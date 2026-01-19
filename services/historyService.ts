// Spec: /docs/specs/history-page.md
// 说明: 历史记录业务逻辑层
// 负责处理历史记录的增删改查业务逻辑

import { prisma } from '@/lib/db'
import { HistoryItem, HistoryDetail, GetHistoriesRequest } from '@/types/history'
import { NotFoundError } from '@/utils/error'

/**
 * 筛选参数接口
 * 用于查询历史记录列表时的过滤条件
 */
interface FilterParams {
  /** 页码，默认 1 */
  page?: number
  /** 每页数量，默认 20 */
  pageSize?: number
  /** 开始日期，格式 YYYY-MM-DD */
  startDate?: string
  /** 结束日期，格式 YYYY-MM-DD */
  endDate?: string
  /** 是否仅显示收藏 */
  showOnlyFavorites?: boolean
  /** 快捷筛选（all/today/week/month） */
  quickFilter?: 'all' | 'today' | 'week' | 'month'
}

/**
 * 历史记录列表返回结果
 */
interface HistoryListResult {
  /** 历史记录列表 */
  list: HistoryItem[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
}

/**
 * 历史记录服务类
 * 处理所有历史记录相关的业务逻辑
 */
export class HistoryService {
  /**
   * 获取历史记录列表
   * 
   * 功能:
   * - 根据用户 ID 查询对应用户的历史记录
   * - 支持分页查询
   * - 支持时间范围筛选
   * - 支持收藏筛选
   * - 支持快捷筛选（今日/本周/本月）
   * - 按创建时间倒序排列
   * 
   * @param userId - 用户 ID（从 JWT Token 解析）
   * @param filters - 筛选参数
   * @returns 历史记录列表和分页信息
   */
  static async getHistories(userId: string, filters: FilterParams = {}): Promise<HistoryListResult> {
    const {
      page = 1,
      pageSize = 20,
      startDate,
      endDate,
      showOnlyFavorites = false,
      quickFilter = 'all'
    } = filters

    console.log('[HistoryService] 获取历史记录列表:', { userId, filters })

    // 1. 构建基础查询条件
    const where: any = {
      user_id: userId,           // 只查询当前用户的数据
      is_deleted: false          // 排除已删除的记录
    }

    // 2. 处理快捷筛选
    let filterStartDate: Date | undefined
    let filterEndDate: Date | undefined

    if (quickFilter === 'today') {
      // 今日：从今天 00:00:00 到明天 00:00:00
      const today = new Date()
      filterStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      filterEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    } else if (quickFilter === 'week') {
      // 本周：从本周一 00:00:00 到下周日 00:00:00
      const now = new Date()
      const dayOfWeek = now.getDay() || 7 // 周日是 0，改成 7
      filterStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 1)
      filterEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 8)
    } else if (quickFilter === 'month') {
      // 本月：从本月 1 日 00:00:00 到下月 1 日 00:00:00
      const now = new Date()
      filterStartDate = new Date(now.getFullYear(), now.getMonth(), 1)
      filterEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    }

    // 3. 处理时间范围筛选
    if (filterStartDate || filterEndDate || startDate || endDate) {
      where.created_time = {}

      // 快捷筛选的时间范围
      if (filterStartDate) {
        where.created_time.gte = filterStartDate
      }
      if (filterEndDate) {
        where.created_time.lt = filterEndDate
      }

      // 手动设置的时间范围（优先级高于快捷筛选）
      if (startDate) {
        where.created_time.gte = new Date(startDate)
      }
      if (endDate) {
        // 使用 lt（小于）而不是 lte（小于等于）
        // 例如：endDate = "2025-01-20" 表示查询到 2025-01-19 23:59:59 为止
        // 不包含 2025-01-20 00:00:00 及之后的记录
        where.created_time.lt = new Date(endDate)
      }
    }

    // 4. 处理收藏筛选
    if (showOnlyFavorites) {
      where.is_favorite = true
    }

    console.log('[HistoryService] 查询条件:', where)

    // 5. 查询总数
    const total = await prisma.mail_histories.count({ where })

    // 6. 分页查询列表
    const list = await prisma.mail_histories.findMany({
      where,
      orderBy: { created_time: 'desc' }, // 按时间倒序
      skip: (page - 1) * pageSize,     // 跳过前面的记录
      take: pageSize,                  // 取指定数量的记录
      select: {
        id: true,
        scene: true,
        sender_name: true,
        recipient_name: true,
        core_points: true,
        is_favorite: true,
        created_time: true
      }
    })

    // 7. 格式化返回数据
    const formattedList = list.map(item => this.formatHistoryItem(item))

    console.log('[HistoryService] 查询成功:', {
      total,
      count: formattedList.length,
      page,
      pageSize
    })

    return {
      list: formattedList,
      total,
      page,
      pageSize
    }
  }

  /**
   * 格式化历史记录项
   * 将数据库记录转换为前端需要的格式
   * 
   * @param item - Prisma 查询结果
   * @returns 格式化后的历史记录项
   */
  private static formatHistoryItem(item: any): HistoryItem {
    // 标题：优先使用 scene，为空则使用 sender_name + recipient_name
    const title = item.scene || `${item.sender_name || ''} → ${item.recipient_name || ''}`

    // 预览内容：截取 core_points 前 80 字符
    const preview = this.getPreviewText(item.core_points, 80)

    // 格式化日期时间：YYYY-MM-DD HH:mm
    const createdAt = this.formatDateTime(item.created_time)

    return {
      id: item.id,
      title,
      preview,
      isFavorite: item.is_favorite || false,
      createdAt
    }
  }

  /**
   * 截取预览文本
   * 限制文本长度，超出部分添加省略号
   * 
   * @param content - 原始内容
   * @param maxLength - 最大长度
   * @returns 截取后的文本
   */
  private static getPreviewText(content: string | null | undefined, maxLength: number): string {
    if (!content) return ''
    
    const text = content.substring(0, maxLength)
    return text + (content.length > maxLength ? '...' : '')
  }

  /**
   * 格式化日期时间
   * 将 Date 对象格式化为 "YYYY-MM-DD HH:mm" 格式
   * 
   * @param date - 日期对象
   * @returns 格式化后的字符串
   */
  private static formatDateTime(date: Date | null | undefined): string {
    if (!date) return ''
    
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  /**
   * 搜索历史记录
   * 根据关键词在多个字段中进行模糊匹配，支持时间范围、收藏筛选
   * 
   * 功能:
   * - 在 scene、sender_name、recipient_name、core_points、mail_content 中搜索关键词
   * - 支持大小写不敏感的模糊匹配（使用 PostgreSQL ILIKE）
   * - 支持时间范围筛选
   * - 支持收藏筛选
   * - 支持分页查询
   * - 按创建时间倒序排列
   * 
   * @param keyword - 搜索关键词（至少2个字符）
   * @param userId - 用户 ID（从 JWT Token 解析）
   * @param filters - 筛选参数
   * @returns 搜索结果和分页信息
   * 
   * @example
   * ```typescript
   * const result = await HistoryService.searchHistories('邀请', 'user-uuid', {
   *   page: 1,
   *   pageSize: 20,
   *   showOnlyFavorites: true
   * })
   * ```
   */
  static async searchHistories(keyword: string, userId: string, filters: FilterParams = {}): Promise<HistoryListResult> {
    const {
      page = 1,
      pageSize = 20,
      startDate,
      endDate,
      showOnlyFavorites = false
    } = filters

    console.log('[HistoryService] 搜索历史记录:', { keyword, userId, filters })

    // 1. 构建基础查询条件
    const where: any = {
      user_id: userId,           // 只查询当前用户的数据
      is_deleted: false,         // 排除已删除的记录
      // OR 条件：在多个字段中搜索关键词
      OR: [
        { scene: { contains: keyword, mode: 'insensitive' } },
        { sender_name: { contains: keyword, mode: 'insensitive' } },
        { recipient_name: { contains: keyword, mode: 'insensitive' } },
        { core_points: { contains: keyword, mode: 'insensitive' } },
        { mail_content: { contains: keyword, mode: 'insensitive' } }
      ]
    }

    // 2. 处理时间范围筛选（复用现有逻辑）
    if (startDate || endDate) {
      where.created_time = {}

      if (startDate) {
        where.created_time.gte = new Date(startDate)
      }
      if (endDate) {
        // 使用 lt（小于）而不是 lte（小于等于）
        // 例如：endDate = "2025-01-20" 表示查询到 2025-01-19 23:59:59 为止
        // 不包含 2025-01-20 00:00:00 及之后的记录
        where.created_time.lt = new Date(endDate)
      }
    }

    // 3. 处理收藏筛选（复用现有逻辑）
    if (showOnlyFavorites) {
      where.is_favorite = true
    }

    console.log('[HistoryService] 搜索条件:', JSON.stringify(where, null, 2))

    // 4. 查询总数
    const total = await prisma.mail_histories.count({ where })

    // 5. 分页查询列表
    const list = await prisma.mail_histories.findMany({
      where,
      orderBy: { created_time: 'desc' }, // 按时间倒序
      skip: (page - 1) * pageSize,     // 跳过前面的记录
      take: pageSize,                  // 取指定数量的记录
      select: {
        id: true,
        scene: true,
        sender_name: true,
        recipient_name: true,
        core_points: true,
        is_favorite: true,
        created_time: true
      }
    })

    // 6. 格式化返回数据（复用现有方法）
    const formattedList = list.map(item => this.formatHistoryItem(item))

    console.log('[HistoryService] 搜索成功:', {
      keyword,
      total,
      count: formattedList.length,
      page,
      pageSize
    })

    return {
      list: formattedList,
      total,
      page,
      pageSize
    }
  }

  /**
   * 获取历史记录详情
   * 根据历史记录 ID 获取完整的详情信息，包括输入需求和 AI 生成结果
   * 
   * 功能:
   * - 查询数据库获取完整的记录信息
   * - 验证记录是否属于当前用户（防止越权访问）
   * - 将 core_points 按换行符分割为数组
   * - 格式化日期时间为 "YYYY-MM-DD HH:mm" 格式
   * 
   * @param id - 历史记录 ID（UUID）
   * @param userId - 用户 ID（从 JWT Token 解析）
   * @returns 历史记录详情
   * @throws NotFoundError - 记录不存在或已被删除
   * 
   * @example
   * ```typescript
   * const detail = await HistoryService.getHistoryDetail('550e8400-e29b-41d4-a716-446655440000', 'user-uuid')
   * // 返回: {
   * //   id: '550e8400-e29b-41d4-a716-446655440000',
   * //   senderName: '市场部 张伟',
   * //   recipientName: '极光科技 卢经理',
   * //   tone: '专业严谨,诚恳礼貌',
   * //   scene: '商业合作伙伴年度邀请',
   * //   corePoints: ['要点1', '要点2'],
   * //   mailContent: '完整的邮件内容...',
   * //   isFavorite: true,
   * //   createdAt: '2025-01-15 14:30'
   * // }
   * ```
   */
  static async getHistoryDetail(id: string, userId: string): Promise<HistoryDetail> {
    console.log('[HistoryService] 获取历史记录详情:', { id, userId })

    // 1. 查询数据库，根据 id 和 user_id 查找记录
    // 注意：同时匹配 id 和 user_id 可以防止越权访问（用户只能访问自己的数据）
    const history = await prisma.mail_histories.findFirst({
      where: {
        id: id,                    // 记录 ID
        user_id: userId,            // 用户 ID（确保只能访问自己的数据）
        is_deleted: false           // 排除已删除的记录
      },
      select: {
        id: true,
        sender_name: true,
        recipient_name: true,
        tone: true,
        scene: true,
        core_points: true,
        mail_content: true,
        is_favorite: true,
        created_time: true
      }
    })

    // 2. 权限检查：如果记录不存在，返回 404 错误
    // 这里不需要额外检查 user_id，因为查询时已经过滤了
    if (!history) {
      console.log('[HistoryService] 历史记录不存在或无权访问:', { id, userId })
      throw new NotFoundError('历史记录不存在')
    }

    // 3. 数据转换：将数据库记录转换为前端需要的格式
    const result = {
      id: history.id,
      // 发送者姓名：如果为空，返回空字符串
      senderName: history.sender_name || '',
      // 接收者姓名：如果为空，返回空字符串
      recipientName: history.recipient_name || '',
      // 语气风格：如果为空，返回空字符串
      tone: history.tone || '',
      // 应用场景：如果为空，返回空字符串
      scene: history.scene || '',
      // 核心要点：按换行符分割为数组，并过滤掉空行
      corePoints: history.core_points
        ? history.core_points.split('\n').filter(point => point.trim())
        : [],
      // 邮件内容：完整的 AI 生成结果
      mailContent: history.mail_content,
      // 收藏状态：如果为空，默认为 false
      isFavorite: history.is_favorite || false,
      // 创建时间：格式化为 "YYYY-MM-DD HH:mm" 格式
      createdAt: this.formatDateTime(history.created_time)
    }

    console.log('[HistoryService] 查询成功:', {
      id: result.id,
      senderName: result.senderName,
      recipientName: result.recipientName
    })

    return result
  }

  /**
   * 切换收藏状态（TODO: 待实现）
   * @param id - 历史记录 ID
   * @param userId - 用户 ID
   * @param isFavorite - 收藏状态
   * @returns 更新结果
   */
  static async toggleFavorite(id: string, userId: string, isFavorite: boolean): Promise<{ success: boolean }> {
    throw new Error('toggleFavorite 方法待实现')
  }

  /**
   * 删除历史记录（TODO: 待实现）
   * @param id - 历史记录 ID
   * @param userId - 用户 ID
   * @returns 删除结果
   */
  static async deleteHistory(id: string, userId: string): Promise<{ success: boolean }> {
    throw new Error('deleteHistory 方法待实现')
  }
}

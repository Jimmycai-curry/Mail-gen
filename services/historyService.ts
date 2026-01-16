// Spec: /docs/specs/history-page.md
// 说明: 历史记录业务逻辑层
// 负责处理历史记录的增删改查业务逻辑

import { prisma } from '@/lib/db'
import { HistoryItem } from '@/types/history'
import { GetHistoriesRequest } from '@/types/history'

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
        where.created_time.lte = new Date(endDate)
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
   * 搜索历史记录（TODO: 待实现）
   * @param keyword - 搜索关键词
   * @param userId - 用户 ID
   * @param filters - 筛选参数
   * @returns 搜索结果
   */
  static async searchHistories(keyword: string, userId: string, filters: FilterParams = {}): Promise<HistoryListResult> {
    throw new Error('searchHistories 方法待实现')
  }

  /**
   * 获取历史记录详情（TODO: 待实现）
   * @param id - 历史记录 ID
   * @param userId - 用户 ID
   * @returns 历史记录详情
   */
  static async getHistoryDetail(id: string, userId: string): Promise<any> {
    throw new Error('getHistoryDetail 方法待实现')
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

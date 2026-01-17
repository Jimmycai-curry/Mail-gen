// Spec: /docs/specs/history-page.md
// 说明: 前端历史记录 API 调用层
// 封装所有历史记录相关的 API 请求

import { GetHistoriesRequest, GetHistoriesResponse, GetHistoryDetailResponse } from '@/types/history'

/**
 * 历史记录 API 客户端
 * 封装前端对后端 API 的所有调用
 * 
 * 说明:
 * - 所有请求会自动携带 Cookie（浏览器行为）
 * - 后端从 Cookie 读取 JWT Token 进行认证
 * - 无需手动设置 Authorization Header
 */
export class HistoryApiClient {
  /**
   * 获取历史记录列表
   * 
   * 认证方式:
   * - 浏览器自动从 Cookie 读取 auth_token
   * - 后端验证 Token 并提取 userId
   * - 只返回对应用户的历史记录
   * 
   * @param filters - 筛选参数
   * @returns API 响应
   * 
   * @example
   * ```typescript
   * // 获取第一页数据
   * const response = await HistoryApiClient.getHistories()
   * 
   * // 获取第二页，每页 10 条
   * const response = await HistoryApiClient.getHistories({ page: 2, pageSize: 10 })
   * 
   * // 仅显示收藏的记录
   * const response = await HistoryApiClient.getHistories({ showOnlyFavorites: true })
   * 
   * // 显示今日的记录
   * const response = await HistoryApiClient.getHistories({ quickFilter: 'today' })
   * ```
   */
  static async getHistories(filters: GetHistoriesRequest = {}): Promise<GetHistoriesResponse> {
    console.log('[HistoryApiClient] 请求获取历史记录列表:', filters)

    // 1. 构建 URL 查询参数
    const params = new URLSearchParams()
    
    // 添加分页参数
    if (filters.page !== undefined) params.set('page', filters.page.toString())
    if (filters.pageSize !== undefined) params.set('pageSize', filters.pageSize.toString())
    
    // 添加时间范围参数
    if (filters.startDate) params.set('startDate', filters.startDate)
    if (filters.endDate) params.set('endDate', filters.endDate)
    
    // 添加收藏筛选参数
    if (filters.showOnlyFavorites !== undefined) params.set('showOnlyFavorites', filters.showOnlyFavorites.toString())
    
    // 添加快捷筛选参数
    if (filters.quickFilter) params.set('quickFilter', filters.quickFilter)

    // 2. 发起 GET 请求
    // 注意：Cookie 会自动携带，无需手动设置
    const response = await fetch(`/api/history?${params.toString()}`)

    // 3. 检查响应状态
    if (!response.ok) {
      console.error('[HistoryApiClient] 请求失败:', {
        status: response.status,
        statusText: response.statusText
      })
      
      // 如果是 401，说明 Token 无效或过期，跳转到登录页
      if (response.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        throw new Error('未登录或登录已过期')
      }
      
      throw new Error('获取历史记录失败')
    }

    // 4. 解析 JSON 响应
    const data: GetHistoriesResponse = await response.json()
    
    console.log('[HistoryApiClient] 获取历史记录成功:', {
      total: data.data.total,
      count: data.data.list.length
    })

    return data
  }

  /**
   * 搜索历史记录（TODO: 待实现）
   * @param keyword - 搜索关键词
   * @param filters - 筛选参数
   * @returns 搜索结果
   */
  static async searchHistories(keyword: string, filters?: GetHistoriesRequest): Promise<any> {
    throw new Error('searchHistories 方法待实现')
  }

  /**
   * 获取历史记录详情
   * 根据历史记录 ID 获取完整的详情信息
   *
   * 认证方式:
   * - 浏览器自动从 Cookie 读取 auth_token
   * - 后端验证 Token 并提取 userId
   * - 只返回对应用户的历史记录
   *
   * @param id - 历史记录 ID（UUID）
   * @returns API 响应
   *
   * @example
   * ```typescript
   * // 获取某个历史记录的详情
   * const response = await HistoryApiClient.getHistoryDetail('550e8400-e29b-41d4-a716-446655440000')
   *
   * if (response.success) {
   *   console.log('历史记录详情:', response.data)
   *   // response.data 包含：
   *   // - id, senderName, recipientName
   *   // - tone, scene, corePoints
   *   // - mailContent, isFavorite, createdAt
   * }
   * ```
   */
  static async getHistoryDetail(id: string): Promise<GetHistoryDetailResponse> {
    console.log('[HistoryApiClient] 请求获取历史记录详情:', id)

    // 1. 发起 GET 请求到详情接口
    // 注意：Cookie 会自动携带，无需手动设置
    const response = await fetch(`/api/history/${id}`)

    // 2. 检查响应状态
    if (!response.ok) {
      console.error('[HistoryApiClient] 请求失败:', {
        status: response.status,
        statusText: response.statusText
      })

      // 如果是 401，说明 Token 无效或过期，跳转到登录页
      if (response.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        throw new Error('未登录或登录已过期')
      }

      // 如果是 404，说明历史记录不存在或无权访问
      if (response.status === 404) {
        throw new Error('历史记录不存在或无权访问')
      }

      throw new Error('获取历史记录详情失败')
    }

    // 3. 解析 JSON 响应
    const data: GetHistoryDetailResponse = await response.json()

    console.log('[HistoryApiClient] 获取历史记录详情成功:', {
      id: data.data.id,
      senderName: data.data.senderName,
      recipientName: data.data.recipientName
    })

    return data
  }

  /**
   * 切换收藏状态（TODO: 待实现）
   * @param id - 历史记录 ID
   * @param isFavorite - 收藏状态
   * @returns 更新结果
   */
  static async toggleFavorite(id: string, isFavorite?: boolean): Promise<any> {
    throw new Error('toggleFavorite 方法待实现')
  }

  /**
   * 删除历史记录（TODO: 待实现）
   * @param id - 历史记录 ID
   * @returns 删除结果
   */
  static async deleteHistory(id: string): Promise<any> {
    throw new Error('deleteHistory 方法待实现')
  }
}

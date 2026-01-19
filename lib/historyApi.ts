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
   * 搜索历史记录
   * 
   * 认证方式:
   * - 浏览器自动从 Cookie 读取 auth_token
   * - 后端验证 Token 并提取 userId
   * - 只返回对应用户的历史记录
   * 
   * @param params - 搜索参数（包含关键词和筛选条件）
   * @returns API 响应
   * 
   * @example
   * ```typescript
   * // 基础搜索
   * const response = await HistoryApiClient.searchHistories({
   *   keyword: '邀请'
   * })
   * 
   * // 搜索 + 筛选
   * const response = await HistoryApiClient.searchHistories({
   *   keyword: '合作',
   *   startDate: '2025-01-01',
   *   endDate: '2025-01-31',
   *   showOnlyFavorites: true
   * })
   * ```
   */
  static async searchHistories(params: {
    keyword: string;
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    showOnlyFavorites?: boolean;
  }): Promise<GetHistoriesResponse> {
    console.log('[HistoryApiClient] 请求搜索历史记录:', params)

    // 1. 发起 POST 请求到搜索接口
    // 注意：Cookie 会自动携带，无需手动设置
    const response = await fetch('/api/history/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    // 2. 检查响应状态
    if (!response.ok) {
      console.error('[HistoryApiClient] 搜索失败:', {
        status: response.status,
        statusText: response.statusText
      })
      
      // 如果是 401，说明 Token 无效或过期，跳转到登录页
      if (response.status === 401) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
        throw new Error('未登录或登录已过期')
      }
      
      // 如果是 400，可能是参数错误
      if (response.status === 400) {
        const errorData = await response.json()
        throw new Error(errorData.message || '搜索参数错误')
      }
      
      throw new Error('搜索历史记录失败')
    }

    // 3. 解析 JSON 响应
    const data: GetHistoriesResponse = await response.json()
    
    console.log('[HistoryApiClient] 搜索历史记录成功:', {
      keyword: params.keyword,
      total: data.data.total,
      count: data.data.list.length
    })

    return data
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
   * 切换收藏状态
   * 支持两种模式：
   * - 不传 isFavorite 参数：切换当前状态（收藏 <-> 取消收藏）
   * - 传 isFavorite 参数：设置为指定状态（幂等操作）
   * 
   * 认证方式:
   * - 浏览器自动从 Cookie 读取 auth_token
   * - 后端验证 Token 并提取 userId
   * - 只能操作对应用户的历史记录
   * 
   * @param id - 历史记录 ID（UUID）
   * @param isFavorite - 目标收藏状态（可选）
   * @returns API 响应
   * 
   * @example
   * ```typescript
   * // 切换模式：如果当前是收藏，则取消收藏；如果当前是未收藏，则收藏
   * const response = await HistoryApiClient.toggleFavorite('550e8400-e29b-41d4-a716-446655440000')
   * 
   * // 设置模式：直接设置为收藏
   * const response = await HistoryApiClient.toggleFavorite('550e8400-e29b-41d4-a716-446655440000', true)
   * 
   * // 设置模式：直接设置为未收藏
   * const response = await HistoryApiClient.toggleFavorite('550e8400-e29b-41d4-a716-446655440000', false)
   * ```
   */
  static async toggleFavorite(id: string, isFavorite?: boolean): Promise<{
    success: boolean;
    data: { id: string; isFavorite: boolean };
  }> {
    console.log('[HistoryApiClient] 请求切换收藏状态:', { id, isFavorite })

    // 1. 发起 PUT 请求到收藏接口
    // 注意：Cookie 会自动携带，无需手动设置
    const response = await fetch(`/api/history/${id}/favorite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      // 如果指定了 isFavorite，则发送请求体；否则发送空对象
      body: JSON.stringify(isFavorite !== undefined ? { isFavorite } : {}),
    })

    // 2. 检查响应状态
    if (!response.ok) {
      console.error('[HistoryApiClient] 切换收藏失败:', {
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

      throw new Error('切换收藏状态失败')
    }

    // 3. 解析 JSON 响应
    const data = await response.json()

    console.log('[HistoryApiClient] 切换收藏成功:', {
      id: data.data.id,
      isFavorite: data.data.isFavorite
    })

    return data
  }

  /**
   * 删除历史记录
   * 采用软删除策略，将历史记录标记为已删除（is_deleted = true）
   * 
   * 认证方式:
   * - 浏览器自动从 Cookie 读取 auth_token
   * - 后端验证 Token 并提取 userId
   * - 只能删除对应用户的历史记录
   * 
   * @param id - 历史记录 ID（UUID）
   * @returns API 响应
   * 
   * @example
   * ```typescript
   * // 删除某条历史记录
   * const response = await HistoryApiClient.deleteHistory('550e8400-e29b-41d4-a716-446655440000')
   * 
   * if (response.success) {
   *   console.log(response.message) // "删除成功"
   * }
   * ```
   */
  static async deleteHistory(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    console.log('[HistoryApiClient] 请求删除历史记录:', id)

    // 1. 发起 DELETE 请求到删除接口
    // 注意：Cookie 会自动携带，无需手动设置
    const response = await fetch(`/api/history/${id}`, {
      method: 'DELETE',
    })

    // 2. 检查响应状态
    if (!response.ok) {
      console.error('[HistoryApiClient] 删除失败:', {
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

      throw new Error('删除历史记录失败')
    }

    // 3. 解析 JSON 响应
    const data = await response.json()

    console.log('[HistoryApiClient] 删除成功:', {
      id,
      message: data.message
    })

    return data
  }
}

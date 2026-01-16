// Spec: /docs/specs/history-page.md
// 说明: 历史记录列表 API 路由
// 提供 GET /api/history 接口，从 Cookie 读取 JWT Token 进行认证

import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/utils/auth'
import { withErrorHandler } from '@/utils/error'
import { HistoryService } from '@/services/historyService'
import { GetHistoriesRequest } from '@/types/history'

/**
 * 获取历史记录列表
 * GET /api/history
 * 
 * 认证方式:
 * - 从 Cookie 中读取 auth_token
 * - 验证 Token 有效性
 * - 提取 userId 查询对应用户的数据
 * 
 * 查询参数（全部可选）:
 * - page: 页码，默认 1
 * - pageSize: 每页数量，默认 20
 * - startDate: 开始日期，格式 YYYY-MM-DD
 * - endDate: 结束日期，格式 YYYY-MM-DD
 * - showOnlyFavorites: 是否仅显示收藏，默认 false
 * - quickFilter: 快捷筛选（all/today/week/month），默认 all
 * 
 * 响应格式:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "list": [...],
 *     "total": 100,
 *     "page": 1,
 *     "pageSize": 20
 *   }
 * }
 * ```
 * 
 * 错误响应:
 * - 401: 未登录或 Token 无效
 * - 400: 参数验证失败
 * - 500: 服务器错误
 */
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    console.log('[History API] 收到获取历史记录列表请求')

    // 1. 认证：从 Cookie 读取 Token 并验证
    const user = await authenticateRequest(request)
    console.log('[History API] 用户已认证:', { userId: user.userId })

    // 2. 解析查询参数
    const searchParams = request.nextUrl.searchParams
    
    // 页码和每页数量
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    
    // 时间范围筛选
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined
    
    // 收藏筛选
    const showOnlyFavorites = searchParams.get('showOnlyFavorites') === 'true'
    
    // 快捷筛选
    const quickFilter = (searchParams.get('quickFilter') as GetHistoriesRequest['quickFilter']) || 'all'

    // 3. 构建筛选参数对象
    const filters: GetHistoriesRequest = {
      page,
      pageSize,
      startDate,
      endDate,
      showOnlyFavorites,
      quickFilter
    }

    console.log('[History API] 查询参数:', filters)

    // 4. 调用 Service 层获取数据
    // 注意：Service 层接收 userId 参数，从 JWT Token 解析而来
    const result = await HistoryService.getHistories(user.userId, filters)

    // 5. 返回成功响应
    console.log('[History API] 查询成功:', {
      total: result.total,
      count: result.list.length
    })

    return Response.json({
      success: true,
      data: result
    })
  })
}

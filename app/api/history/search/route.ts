// Spec: /docs/specs/history-page.md
// 说明: 历史记录搜索 API 路由
// 提供 POST /api/history/search 接口，支持关键词在多个字段中模糊搜索

import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/utils/auth'
import { withErrorHandler, ValidationError } from '@/utils/error'
import { HistoryService } from '@/services/historyService'
import { SearchHistoriesRequest } from '@/types/history'

/**
 * 搜索历史记录
 * POST /api/history/search
 * 
 * 认证方式:
 * - 从 Cookie 中读取 auth_token
 * - 验证 Token 有效性
 * - 提取 userId 查询对应用户的数据
 * 
 * 请求体参数:
 * - keyword: 搜索关键词（必填，至少2个字符）
 * - page: 页码，默认 1
 * - pageSize: 每页数量，默认 20，最大 100
 * - startDate: 开始日期，格式 YYYY-MM-DD（可选）
 * - endDate: 结束日期，格式 YYYY-MM-DD（可选）
 * - showOnlyFavorites: 是否仅显示收藏，默认 false（可选）
 * 
 * 搜索范围:
 * - scene: 应用场景
 * - sender_name: 发送者姓名
 * - recipient_name: 接收者姓名
 * - core_points: 核心要点
 * - mail_content: 邮件内容
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
 * - 400: 参数验证失败（关键词为空或过短）
 * - 500: 服务器错误
 * 
 * @example
 * 请求示例：
 * POST /api/history/search
 * Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * Body: {
 *   "keyword": "邀请",
 *   "page": 1,
 *   "pageSize": 20,
 *   "showOnlyFavorites": false
 * }
 * 
 * 响应示例：
 * {
 *   "success": true,
 *   "data": {
 *     "list": [
 *       {
 *         "id": "550e8400-e29b-41d4-a716-446655440000",
 *         "title": "业务邀请函",
 *         "preview": "关于明年的战略合作伙伴邀请函...",
 *         "isFavorite": true,
 *         "createdAt": "2025-01-15 14:30"
 *       }
 *     ],
 *     "total": 5,
 *     "page": 1,
 *     "pageSize": 20
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    console.log('[SearchAPI] 收到搜索历史记录请求')

    // 1. 认证：从 Cookie 读取 Token 并验证
    const user = await authenticateRequest(request)
    console.log('[SearchAPI] 用户已认证:', { userId: user.userId })

    // 2. 解析请求体
    const body: SearchHistoriesRequest = await request.json()
    const {
      keyword,
      page = 1,
      pageSize = 20,
      startDate,
      endDate,
      showOnlyFavorites = false
    } = body

    console.log('[SearchAPI] 请求参数:', { keyword, page, pageSize, startDate, endDate, showOnlyFavorites })

    // 3. 参数验证
    // 3.1 关键词验证
    if (!keyword || typeof keyword !== 'string') {
      throw new ValidationError('搜索关键词不能为空')
    }

    const trimmedKeyword = keyword.trim()
    if (trimmedKeyword.length < 2) {
      throw new ValidationError('搜索关键词至少需要2个字符')
    }

    if (trimmedKeyword.length > 100) {
      throw new ValidationError('搜索关键词最多100个字符')
    }

    // 3.2 分页参数验证
    if (page < 1) {
      throw new ValidationError('页码必须大于0')
    }

    if (pageSize < 1 || pageSize > 100) {
      throw new ValidationError('每页数量必须在1-100之间')
    }

    // 3.3 日期范围验证
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (isNaN(start.getTime())) {
        throw new ValidationError('开始日期格式无效')
      }
      
      if (isNaN(end.getTime())) {
        throw new ValidationError('结束日期格式无效')
      }
      
      if (start > end) {
        throw new ValidationError('开始日期不能晚于结束日期')
      }
    }

    // 4. 构建筛选参数对象
    const filters = {
      page,
      pageSize,
      startDate,
      endDate,
      showOnlyFavorites
    }

    console.log('[SearchAPI] 调用 Service 层搜索:', { keyword: trimmedKeyword, filters })

    // 5. 调用 Service 层搜索数据
    const result = await HistoryService.searchHistories(trimmedKeyword, user.userId, filters)

    // 6. 返回成功响应
    console.log('[SearchAPI] 搜索成功:', {
      keyword: trimmedKeyword,
      total: result.total,
      count: result.list.length
    })

    return Response.json({
      success: true,
      data: result
    })
  })
}

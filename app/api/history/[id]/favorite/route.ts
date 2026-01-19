// Spec: /docs/specs/history-page.md
// 说明: 切换收藏状态 API 路由
// 提供 PUT /api/history/[id]/favorite 接口，从 Cookie 读取 JWT Token 进行认证

import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/utils/auth'
import { withErrorHandler } from '@/utils/error'
import { HistoryService } from '@/services/historyService'
import { ToggleFavoriteRequest } from '@/types/history'

/**
 * 切换历史记录收藏状态
 * PUT /api/history/[id]/favorite
 * 
 * 认证方式:
 * - 从 Cookie 中读取 auth_token
 * - 验证 Token 有效性
 * - 提取 userId 验证对应用户的数据
 * 
 * 路径参数:
 * - id: 历史记录 UUID（例如：550e8400-e29b-41d4-a716-446655440000）
 * 
 * 请求体（可选）:
 * ```json
 * {
 *   "isFavorite": true  // 可选，不传则切换状态
 * }
 * ```
 * 
 * 功能说明:
 * - 不传 isFavorite 参数：切换当前状态（收藏 <-> 取消收藏）
 * - 传 isFavorite 参数：设置为指定状态（幂等操作）
 * 
 * 响应格式:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "isFavorite": true
 *   }
 * }
 * ```
 * 
 * 错误响应:
 * - 401: 未登录或 Token 无效
 * - 404: 历史记录不存在或无权访问
 * - 500: 服务器错误
 * 
 * @example
 * 请求示例1（切换模式）：
 * PUT /api/history/550e8400-e29b-41d4-a716-446655440000/favorite
 * Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * 请求示例2（设置模式）：
 * PUT /api/history/550e8400-e29b-41d4-a716-446655440000/favorite
 * Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * Content-Type: application/json
 * { "isFavorite": true }
 * 
 * 响应示例：
 * {
 *   "success": true,
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "isFavorite": true
 *   }
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    console.log('[ToggleFavorite API] 收到切换收藏状态请求')

    // 1. 认证：从 Cookie 读取 Token 并验证
    const user = await authenticateRequest(request)
    console.log('[ToggleFavorite API] 用户已认证:', { userId: user.userId })

    // 2. 获取历史记录 ID（从 URL 路径参数）
    const { id: historyId } = await params
    console.log('[ToggleFavorite API] 历史记录 ID:', historyId)

    // 3. 解析请求体（可选参数）
    // 如果请求体为空或解析失败，返回空对象
    const body = await request.json().catch(() => ({}))
    const { isFavorite } = body as ToggleFavoriteRequest
    console.log('[ToggleFavorite API] 请求参数:', { isFavorite })

    // 4. 调用 Service 层切换收藏状态
    // 注意：Service 层接收 userId 参数，从 JWT Token 解析而来
    // Service 层会自动验证记录是否属于该用户
    const result = await HistoryService.toggleFavorite(historyId, user.userId, isFavorite)

    // 5. 返回成功响应
    console.log('[ToggleFavorite API] 切换成功:', {
      id: result.id,
      isFavorite: result.isFavorite
    })

    return Response.json({
      success: true,
      data: result
    })
  })
}

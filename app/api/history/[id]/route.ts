// Spec: /docs/specs/history-page.md
// 说明: 历史记录详情 API 路由
// 提供 GET /api/history/[id] 接口（获取详情）和 DELETE /api/history/[id] 接口（删除记录）
// 从 Cookie 读取 JWT Token 进行认证

import { NextRequest } from 'next/server'
import { authenticateRequest } from '@/utils/auth'
import { withErrorHandler } from '@/utils/error'
import { HistoryService } from '@/services/historyService'

/**
 * 获取历史记录详情
 * GET /api/history/[id]
 * 
 * 认证方式:
 * - 从 Cookie 中读取 auth_token
 * - 验证 Token 有效性
 * - 提取 userId 查询对应用户的数据
 * 
 * 路径参数:
 * - id: 历史记录 UUID（例如：550e8400-e29b-41d4-a716-446655440000）
 * 
 * 响应格式:
 * ```json
 * {
 *   "success": true,
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "senderName": "市场部 张伟",
 *     "recipientName": "极光科技 卢经理",
 *     "tone": "专业严谨,诚恳礼貌",
 *     "scene": "商业合作伙伴年度邀请",
 *     "corePoints": ["要点1", "要点2"],
 *     "mailContent": "完整的邮件内容...",
 *     "isFavorite": true,
 *     "createdAt": "2025-01-15 14:30"
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
 * 请求示例：
 * GET /api/history/550e8400-e29b-41d4-a716-446655440000
 * Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * 响应示例：
 * {
 *   "success": true,
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "senderName": "市场部 张伟",
 *     "recipientName": "极光科技 卢经理",
 *     ...
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    console.log('[HistoryDetail API] 收到获取历史记录详情请求')

    // 1. 认证：从 Cookie 读取 Token 并验证
    const user = await authenticateRequest(request)
    console.log('[HistoryDetail API] 用户已认证:', { userId: user.userId })

    // 2. 获取历史记录 ID（从 URL 路径参数）
    const { id: historyId } = await params
    console.log('[HistoryDetail API] 查询历史记录 ID:', historyId)

    // 3. 调用 Service 层获取详情
    // 注意：Service 层接收 userId 参数，从 JWT Token 解析而来
    // Service 层会自动验证记录是否属于该用户
    const detail = await HistoryService.getHistoryDetail(historyId, user.userId)

    // 4. 返回成功响应
    console.log('[HistoryDetail API] 查询成功:', {
      id: detail.id,
      senderName: detail.senderName,
      recipientName: detail.recipientName
    })

    return Response.json({
      success: true,
      data: detail
    })
  })
}

/**
 * 删除历史记录
 * DELETE /api/history/[id]
 * 
 * 认证方式:
 * - 从 Cookie 中读取 auth_token
 * - 验证 Token 有效性
 * - 提取 userId 验证对应用户的数据
 * 
 * 路径参数:
 * - id: 历史记录 UUID（例如：550e8400-e29b-41d4-a716-446655440000）
 * 
 * 功能说明:
 * - 采用软删除策略：将 is_deleted 标记为 true
 * - 数据保留在数据库中，仅对用户隐藏
 * - 用户只能删除自己的记录（通过 user_id 匹配）
 * 
 * 响应格式:
 * ```json
 * {
 *   "success": true,
 *   "message": "删除成功"
 * }
 * ```
 * 
 * 错误响应:
 * - 401: 未登录或 Token 无效
 * - 404: 历史记录不存在、已被删除或无权访问
 * - 500: 服务器错误
 * 
 * @example
 * 请求示例：
 * DELETE /api/history/550e8400-e29b-41d4-a716-446655440000
 * Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * 响应示例：
 * {
 *   "success": true,
 *   "message": "删除成功"
 * }
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    console.log('[DeleteHistory API] 收到删除历史记录请求')

    // 1. 认证：从 Cookie 读取 Token 并验证
    const user = await authenticateRequest(request)
    console.log('[DeleteHistory API] 用户已认证:', { userId: user.userId })

    // 2. 获取历史记录 ID（从 URL 路径参数）
    const { id: historyId } = await params
    console.log('[DeleteHistory API] 删除历史记录 ID:', historyId)

    // 3. 调用 Service 层执行删除
    // 注意：Service 层接收 userId 参数，从 JWT Token 解析而来
    // Service 层会自动验证记录是否属于该用户，并执行软删除
    await HistoryService.deleteHistory(historyId, user.userId)

    // 4. 返回成功响应
    console.log('[DeleteHistory API] 删除成功:', { id: historyId })

    return Response.json({
      success: true,
      message: '删除成功'
    })
  })
}

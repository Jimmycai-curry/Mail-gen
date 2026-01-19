// Spec: /docs/specs/user-feedback-submission.md
// 说明: 用户反馈提交 API 接口
// 支持用户对生成内容提交建议、举报和自定义反馈

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/utils/auth';
import { handleError } from '@/utils/error';
import { submitUserFeedback } from '@/services/feedback.service';

/**
 * 请求体校验 Schema
 * 
 * 包含三个必填字段：
 * - logId: 关联的审计日志 ID（UUID格式）
 * - type: 反馈类型（SUGGESTION/REPORT/CUSTOM）
 * - content: 反馈内容（1-500字符）
 */
const feedbackSchema = z.object({
  logId: z.string().uuid('logId 必须是有效的 UUID 格式'),
  type: z.enum(['SUGGESTION', 'REPORT', 'CUSTOM'], {
    errorMap: () => ({ message: '反馈类型必须是 SUGGESTION、REPORT 或 CUSTOM' })
  }),
  content: z.string()
    .min(1, '反馈内容不能为空')
    .max(500, '反馈内容最多 500 字符')
});

/**
 * POST /api/feedbacks
 * 用户反馈提交接口
 * 
 * 功能：
 * - 验证用户身份（Session）
 * - 校验请求参数
 * - 调用 Service 层插入反馈记录
 * - 返回成功响应
 */
export async function POST(request: NextRequest) {
  console.log('[API /feedbacks] 收到反馈提交请求');

  try {
    // ========== 步骤 1: 验证 Session ==========
    console.log('[API /feedbacks] 验证 Session...');
    const user = await authenticateRequest(request);

    console.log('[API /feedbacks] Session 验证通过', {
      userId: user.userId,
      phone: user.phone
    });

    // ========== 步骤 2: 解析并校验请求体 ==========
    console.log('[API /feedbacks] 解析请求体...');
    const body = await request.json();

    const validation = feedbackSchema.safeParse(body);
    if (!validation.success) {
      const errorMessage = validation.error.errors[0].message;
      console.warn('[API /feedbacks] 参数校验失败:', errorMessage);

      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: errorMessage
        }
      }, { status: 400 });
    }

    const { logId, type, content } = validation.data;
    console.log('[API /feedbacks] 请求参数校验通过', {
      logId,
      type,
      contentLength: content.length
    });

    // ========== 步骤 3: 调用 Service 层提交反馈 ==========
    console.log('[API /feedbacks] 调用 feedbackService.submitUserFeedback...');
    await submitUserFeedback({
      userId: user.userId,
      logId,
      type,
      content
    });

    console.log('[API /feedbacks] 反馈提交成功');

    // ========== 步骤 4: 返回成功响应 ==========
    return NextResponse.json({
      success: true,
      message: '反馈提交成功'
    }, { status: 200 });

  } catch (error: any) {
    console.error('[API /feedbacks] 提交失败:', error);

    // 使用统一错误处理
    const errorResponse = handleError(error);
    
    // 返回错误响应
    return NextResponse.json({
      success: false,
      error: errorResponse.error
    }, { status: errorResponse.status });
  }
}

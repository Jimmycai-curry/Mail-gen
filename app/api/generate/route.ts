// Spec: /docs/specs/ai-generation-api.md
// 说明: AI 邮件生成 API 接口

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/utils/auth';
import { getClientIP } from '@/utils/request';
import { handleError } from '@/utils/error';
import { prisma } from '@/lib/db';
import { generateMail } from '@/services/aiService';
import type { GenerateRequestBody, GenerateSuccessResponse, ErrorCode } from '@/types/ai';
import { ErrorMessages } from '@/types/ai';

/**
 * 请求体校验 Schema
 */
const generateSchema = z.object({
  scenario: z.enum(['email', 'report', 'proposal', 'notice'], {
    errorMap: () => ({ message: '业务场景必须是 email, report, proposal 或 notice' })
  }),
  tone: z.enum(['formal', 'friendly', 'urgent', 'humorous'], {
    errorMap: () => ({ message: '语气必须是 formal, friendly, urgent 或 humorous' })
  }),
  language: z.enum(['zh-CN', 'en-US', 'zh-TW', 'ja-JP', 'ko-KR'], {
    errorMap: () => ({ message: '语言必须是支持的语言之一' })
  }),
  recipientName: z.string().min(1, '收件人姓名不能为空').max(100, '收件人姓名最多100个字符'),
  recipientRole: z.string().min(1, '收件人身份不能为空').max(200, '收件人身份最多200个字符'),
  keyPoints: z.string().min(1, '核心要点不能为空').max(2000, '核心要点最多2000个字符')
});

/**
 * POST /api/generate
 * AI 邮件生成接口
 */
export async function POST(request: NextRequest) {
  console.log('[API /generate] 收到生成请求');

  try {
    // ========== 步骤 1: 验证 Session ==========
    console.log('[API /generate] 验证 Session...');
    const user = await authenticateRequest(request);

    console.log('[API /generate] Session 验证通过', {
      userId: user.userId,
      phone: user.phone
    });

    // ========== 步骤 2: 检查用户状态 ==========
    console.log('[API /generate] 检查用户状态...');
    const dbUser = await prisma.users.findUnique({
      where: { id: user.userId },
      select: { status: true, role: true }
    });

    if (!dbUser) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'AUTH_EXPIRED' as ErrorCode,
          message: ErrorMessages['AUTH_EXPIRED']
        }
      }, { status: 401 });
    }

    if (dbUser.status === 0) {
      console.warn('[API /generate] 用户已被封禁', { userId: user.userId });
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCOUNT_BANNED' as ErrorCode,
          message: ErrorMessages['ACCOUNT_BANNED']
        }
      }, { status: 403 });
    }

    console.log('[API /generate] 用户状态正常');

    // ========== 步骤 3: 提取真实 IP ==========
    const clientIp = getClientIP(request);
    console.log('[API /generate] 客户端 IP:', clientIp);

    // ========== 步骤 4: 解析并校验请求体 ==========
    console.log('[API /generate] 解析请求体...');
    const body = await request.json();

    const validation = generateSchema.safeParse(body);
    if (!validation.success) {
      const errorMessage = validation.error.errors[0].message;
      console.warn('[API /generate] 参数校验失败:', errorMessage);

      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR' as ErrorCode,
          message: errorMessage
        }
      }, { status: 400 });
    }

    const requestBody: GenerateRequestBody = validation.data;
    console.log('[API /generate] 请求参数校验通过');

    // ========== 步骤 5: 调用业务逻辑 ==========
    console.log('[API /generate] 调用 aiService.generateMail...');
    const result = await generateMail({
      userId: user.userId,
      userPhone: user.phone,
      userIp: clientIp,
      scenario: requestBody.scenario,
      tone: requestBody.tone,
      language: requestBody.language,
      recipientName: requestBody.recipientName,
      recipientRole: requestBody.recipientRole,
      keyPoints: requestBody.keyPoints
    });

    console.log('[API /generate] 邮件生成成功', {
      auditLogId: result.auditLogId
    });

    // ========== 步骤 6: 返回成功响应 ==========
    const response: GenerateSuccessResponse = {
      success: true,
      data: {
        content: result.content,
        auditLogId: result.auditLogId
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error: any) {
    console.error('[API /generate] 生成失败:', error);

    // 使用统一错误处理
    const errorResponse = handleError(error);
    
    // 返回错误响应
    return NextResponse.json({
      success: false,
      error: errorResponse.error
    }, { status: errorResponse.status });
  }
}

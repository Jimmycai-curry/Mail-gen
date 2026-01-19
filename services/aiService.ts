// Spec: /docs/specs/ai-generation-api.md
// 说明: AI 邮件生成核心业务逻辑，整合审核、生成、水印、数据库写入

import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { callDeepSeek, type DeepSeekParams } from '@/lib/deepseek';
import { moderateContent } from '@/lib/moderation';
import { addWatermark } from '@/utils/watermark';
import { ValidationError, AIServiceError } from '@/utils/error';

/**
 * AI 邮件生成参数接口
 */
export interface GenerateMailParams {
  userId: string;          // 用户 ID
  userPhone: string;       // 用户手机号
  userIp: string;          // 用户真实 IP
  scenario: string;        // 业务场景
  tone: string;            // 语气
  language: string;        // 语言
  recipientName: string;   // 收件人姓名
  recipientRole: string;   // 收件人职位
  keyPoints: string;       // 核心要点
}

/**
 * AI 邮件生成结果接口
 */
export interface GenerateMailResult {
  content: string;         // 生成的邮件内容（含水印）
  auditLogId: string;      // 审计日志 ID
}

/**
 * AI 邮件生成核心函数
 * 
 * 完整流程：
 * 1. 审核用户输入
 * 2. 调用 DeepSeek 生成
 * 3. 生成 auditToken
 * 4. 植入水印
 * 5. 事务写入数据库（audit_logs + mail_histories）
 * 6. 返回结果
 * 
 * @param params - 生成参数
 * @returns 生成结果
 * @throws ValidationError - 内容违规
 * @throws AIServiceError - AI 服务失败
 */
export async function generateMail(params: GenerateMailParams): Promise<GenerateMailResult> {
  console.log('[AIService] 开始生成邮件...', {
    userId: params.userId,
    scenario: params.scenario,
    tone: params.tone,
    language: params.language,
    timestamp: new Date().toISOString()
  });

  const startTime = Date.now();

  try {
    // ========== 步骤 1: 审核用户输入（AI 安全护栏）==========
    console.log('[AIService] 步骤 1/7: 审核用户输入 (AI 安全护栏)...');
    
    // 合并所有输入字段进行审核
    const inputText = `${params.recipientName} ${params.recipientRole} ${params.keyPoints}`;
    const inputModeration = await moderateContent(inputText);

    if (!inputModeration.pass) {
      console.warn('[AIService] 用户输入审核失败', {
        isSensitive: inputModeration.isSensitive,
        riskLevel: inputModeration.riskLevel,
        sensitiveLevel: inputModeration.sensitiveLevel,
        attackLevel: inputModeration.attackLevel,
        blockedReason: inputModeration.blockedReason
      });

      // 记录审计日志（系统拦截）
      await prisma.audit_logs.create({
        data: {
          user_id: params.userId,
          user_phone: params.userPhone,
          user_ip: params.userIp,
          scene: params.scenario,
          tone: params.tone,
          input_prompt: params.keyPoints,
          output_content: '',
          model_name: 'DeepSeek-V3',
          status: 2, // 系统拦截
          is_sensitive: true,
          external_audit_id: inputModeration.externalAuditId
        }
      });

      // 构建友好的错误提示
      let errorMessage = inputModeration.blockedReason || '您输入的内容不符合规范，请修改后重试';

      // 如果检测到攻击行为，使用特殊提示
      if (inputModeration.attackLevel === 'high') {
        errorMessage = '检测到恶意输入行为，请修改后重试';
      }
      
      // 如果检测到敏感信息，使用特殊提示
      if (inputModeration.sensitiveLevel && parseInt(inputModeration.sensitiveLevel.substring(1)) >= 3) {
        errorMessage = '您输入的内容包含敏感信息（如身份证、银行卡号等），请移除后重试';
      }

      // 如果有自动拒答建议，优先使用
      if (inputModeration.adviceAnswer) {
        errorMessage = inputModeration.adviceAnswer;
      }

      // 抛出验证错误
      throw new ValidationError(errorMessage);
    }

    console.log('[AIService] 用户输入审核通过', {
      riskLevel: inputModeration.riskLevel,
      sensitiveLevel: inputModeration.sensitiveLevel,
      attackLevel: inputModeration.attackLevel
    });

    // ========== 步骤 2: 调用 DeepSeek 生成 ==========
    console.log('[AIService] 步骤 2/7: 调用 DeepSeek 生成内容...');

    const deepseekParams: DeepSeekParams = {
      scenario: params.scenario,
      tone: params.tone,
      language: params.language,
      recipientName: params.recipientName,
      recipientRole: params.recipientRole,
      keyPoints: params.keyPoints
    };

    const generatedContent = await callDeepSeek(deepseekParams);

    if (!generatedContent || generatedContent.trim().length === 0) {
      throw new AIServiceError('AI 生成内容为空');
    }

    console.log('[AIService] DeepSeek 生成成功', {
      contentLength: generatedContent.length
    });

    // ========== 步骤 3: 审核 AI 输出（可选） ==========
    // 注释掉此步骤以提高性能，仅在需要时启用
    /*
    console.log('[AIService] 步骤 3/7: 审核 AI 输出...');
    const outputModeration = await moderateContent(generatedContent);

    if (!outputModeration.pass) {
      console.error('[AIService] AI 输出审核失败', {
        isSensitive: outputModeration.isSensitive,
        blockedReason: outputModeration.blockedReason
      });

      // 记录审计日志
      await prisma.audit_logs.create({
        data: {
          user_id: params.userId,
          user_phone: params.userPhone,
          user_ip: params.userIp,
          scene: params.scenario,
          tone: params.tone,
          input_prompt: params.keyPoints,
          output_content: generatedContent,
          model_name: 'DeepSeek-V3',
          status: 2, // 系统拦截
          is_sensitive: true,
          external_audit_id: outputModeration.externalAuditId
        }
      });

      throw new AIServiceError('生成的内容不符合规范，请重试');
    }

    console.log('[AIService] AI 输出审核通过');
    */

    // ========== 步骤 4: 生成 auditToken ==========
    console.log('[AIService] 步骤 4/7: 生成 auditToken...');
    const auditToken = crypto.randomUUID();
    console.log('[AIService] auditToken 生成完成:', auditToken);

    // ========== 步骤 5: 植入水印 ==========
    console.log('[AIService] 步骤 5/7: 植入水印...');
    const contentWithWatermark = addWatermark(generatedContent, auditToken);

    // ========== 步骤 6: 数据库事务写入 ==========
    console.log('[AIService] 步骤 6/7: 写入数据库...');

    const result = await prisma.$transaction(async (tx) => {
      // 写入审计日志
      const auditLog = await tx.audit_logs.create({
        data: {
          user_id: params.userId,
          user_phone: params.userPhone,
          user_ip: params.userIp,
          scene: params.scenario,
          tone: params.tone,
          input_prompt: params.keyPoints,
          output_content: contentWithWatermark,
          model_name: 'DeepSeek-V3',
          audit_token: auditToken,
          status: 1, // 审核通过
          is_sensitive: false,
          external_audit_id: inputModeration.externalAuditId
        }
      });

      // 写入用户历史
      await tx.mail_histories.create({
        data: {
          user_id: params.userId,
          audit_log_id: auditLog.id,
          scene: params.scenario,
          tone: params.tone,
          recipient_name: params.recipientName,
          sender_name: '', // 可选字段，暂为空
          core_points: params.keyPoints,
          mail_content: contentWithWatermark
        }
      });

      return auditLog;
    });

    console.log('[AIService] 数据库写入成功', {
      auditLogId: result.id
    });

    // ========== 步骤 7: 返回结果 ==========
    const duration = Date.now() - startTime;
    console.log('[AIService] 邮件生成完成', {
      auditLogId: result.id,
      contentLength: contentWithWatermark.length,
      duration: `${duration}ms`
    });

    return {
      content: contentWithWatermark,
      auditLogId: result.id
    };

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('[AIService] 邮件生成失败', {
      error: error.message,
      duration: `${duration}ms`
    });

    // 重新抛出错误（保留错误类型）
    throw error;
  }
}

// Spec: /docs/specs/ai-generation-api.md
// 说明: AI 邮件生成相关的类型定义

/**
 * 生成请求体接口
 */
export interface GenerateRequestBody {
  scenario: string;        // 业务场景：email | report | proposal | notice
  tone: string;            // 语气：formal | friendly | urgent | humorous
  language: string;        // 语言：zh-CN | en-US | zh-TW | ja-JP | ko-KR
  recipientName: string;   // 收件人姓名
  recipientRole: string;   // 收件人身份/职位
  keyPoints: string;       // 核心要点
}

/**
 * 生成响应数据接口
 */
export interface GenerateResponseData {
  content: string;         // 生成的邮件内容（含水印）
  auditLogId: string;      // 审计日志 ID（用于溯源）
}

/**
 * 生成成功响应接口
 */
export interface GenerateSuccessResponse {
  success: true;
  data: GenerateResponseData;
}

/**
 * 错误详情接口
 */
export interface ErrorDetails {
  field?: string;          // 违规字段
  reason?: string;         // 具体原因
}

/**
 * 错误响应接口
 */
export interface GenerateErrorResponse {
  success: false;
  error: {
    code: string;          // 错误码
    message: string;       // 用户友好的错误提示
    details?: ErrorDetails; // 可选：详细信息
  };
}

/**
 * 生成响应（成功或失败）
 */
export type GenerateResponse = GenerateSuccessResponse | GenerateErrorResponse;

/**
 * 错误码枚举
 */
export enum ErrorCode {
  // 认证相关
  AUTH_EXPIRED = 'AUTH_EXPIRED',           // 登录已过期
  
  // 权限相关
  ACCOUNT_BANNED = 'ACCOUNT_BANNED',       // 账号已被封禁
  
  // 内容审核相关
  CONTENT_VIOLATION = 'CONTENT_VIOLATION', // 内容违规
  ATTACK_DETECTED = 'ATTACK_DETECTED',     // 检测到恶意攻击
  SENSITIVE_INFO = 'SENSITIVE_INFO',       // 包含敏感信息
  
  // AI 服务相关
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',   // AI 服务失败
  
  // 数据库相关
  DATABASE_ERROR = 'DATABASE_ERROR',       // 数据库错误
  
  // 参数验证相关
  VALIDATION_ERROR = 'VALIDATION_ERROR',   // 参数验证失败
  
  // 未知错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'          // 未知错误
}

/**
 * 错误消息映射
 */
export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_EXPIRED]: '您的登录状态已失效，请重新登录后继续使用。',
  [ErrorCode.ACCOUNT_BANNED]: '您的账号因违反服务条款已被暂停使用，如有疑问请联系客服。',
  [ErrorCode.CONTENT_VIOLATION]: '您输入的内容包含敏感信息，请修改后重试',
  [ErrorCode.ATTACK_DETECTED]: '检测到恶意输入行为，请修改后重试',
  [ErrorCode.SENSITIVE_INFO]: '您输入的内容包含敏感信息（如身份证、银行卡号等），请移除后重试',
  [ErrorCode.AI_SERVICE_ERROR]: 'AI 生成服务暂时不可用，请稍后重试或联系技术支持。',
  [ErrorCode.DATABASE_ERROR]: '数据保存失败，请稍后再试。如果问题持续出现，请联系技术支持。',
  [ErrorCode.VALIDATION_ERROR]: '请求参数不合法',
  [ErrorCode.UNKNOWN_ERROR]: '系统异常，请稍后再试'
};

/**
 * Spec: /docs/specs/user-feedback-submission.md
 * 
 * 用户反馈相关的 TypeScript 类型定义
 * 用于前端组件和 API 交互
 */

/**
 * 反馈类型枚举
 * 
 * - SUGGESTION: 建议（用户认为内容还不错，但有改进空间）
 * - REPORT: 内容举报（用户发现内容存在严重问题）
 * - CUSTOM: 自定义反馈（用户的自定义反馈）
 */
export type FeedbackType = 'SUGGESTION' | 'REPORT' | 'CUSTOM';

/**
 * 用户反馈提交请求
 * 
 * 用于前端向后端提交反馈时的请求体
 */
export interface SubmitFeedbackRequest {
  logId: string;        // 关联的审计日志 ID（audit_logs.id）
  type: FeedbackType;   // 反馈类型
  content: string;      // 反馈内容（1-500字符）
}

/**
 * 用户反馈提交响应
 * 
 * 后端返回的响应数据
 */
export interface SubmitFeedbackResponse {
  success: boolean;     // 是否成功
  message?: string;     // 成功消息
  error?: {
    code: string;       // 错误码
    message: string;    // 错误信息
  };
}

/**
 * 反馈按钮状态
 * 
 * 用于记录用户已提交的反馈类型
 * - true: 该类型已提交
 * - false: 该类型未提交
 */
export interface FeedbackButtonState {
  suggestion: boolean;    // 是否已提交建议
  report: boolean;        // 是否已提交举报
  custom: boolean;        // 是否已提交自定义反馈
}

/**
 * 反馈弹窗状态
 * 
 * 用于控制反馈输入弹窗的显示和内容
 */
export interface FeedbackModalState {
  isOpen: boolean;        // 是否打开
  type: FeedbackType;     // 反馈类型
  title: string;          // 弹窗标题
  placeholder: string;    // 输入框占位符
}

/**
 * 反馈类型配置
 * 
 * 用于前端显示不同反馈类型的标题和占位符
 */
export interface FeedbackTypeConfig {
  type: FeedbackType;
  title: string;          // 弹窗标题
  placeholder: string;    // 输入框占位符
  buttonLabel: string;    // 按钮文字
}

/**
 * 反馈类型配置常量
 * 
 * 预定义的三种反馈类型配置
 */
export const FEEDBACK_TYPE_CONFIGS: Record<FeedbackType, Omit<FeedbackTypeConfig, 'type'>> = {
  SUGGESTION: {
    title: '提交建议',
    placeholder: '请告诉我们您的改进建议...',
    buttonLabel: '建议'
  },
  REPORT: {
    title: '内容举报',
    placeholder: '请描述内容存在的问题...',
    buttonLabel: '内容举报'
  },
  CUSTOM: {
    title: '用户反馈',
    placeholder: '请告诉我们您的想法和意见...',
    buttonLabel: '用户反馈'
  }
};

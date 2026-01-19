"use client";

import { useState } from "react";
import { Copy, Lightbulb, Flag, MessageSquare, Check, Loader2 } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import type { FeedbackType, FeedbackButtonState, SubmitFeedbackResponse } from "@/types/feedback";
import type { ToastType } from "@/components/ui/Toast";
import { FEEDBACK_TYPE_CONFIGS } from "@/types/feedback";

/**
 * ResultViewer Props 接口
 */
interface ResultViewerProps {
  content?: string;            // 生成的内容
  isLoading?: boolean;         // 是否正在加载
  isEmpty?: boolean;           // 是否为空状态
  auditLogId?: string;         // 关联的审计日志 ID（用于反馈提交）
}

/**
 * ResultViewer 组件
 * 结果展示区，包含工具栏、内容展示和提示信息
 * 
 * Spec: /docs/specs/user-feedback-submission.md
 * 支持用户对生成内容提交反馈（建议、举报、自定义反馈）
 */
export function ResultViewer({ content = "", isLoading = false, isEmpty = true, auditLogId }: ResultViewerProps) {
  
  // 反馈弹窗状态
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    type: FeedbackType;
    title: string;
    placeholder: string;
  } | null>(null);

  // 反馈按钮状态（记录哪些类型已提交）
  const [buttonStates, setButtonStates] = useState<FeedbackButtonState>({
    suggestion: false,
    report: false,
    custom: false,
  });

  // 是否正在提交反馈
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 显示 Toast 提示
   * 
   * @param type - Toast 类型
   * @param message - 提示消息
   */
  const showToast = (type: ToastType, message: string) => {
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { type, message, duration: 2000 },
      })
    );
  };

  /**
   * 复制到剪贴板
   */
  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      showToast('success', '已复制到剪贴板');
    }
  };

  /**
   * 打开反馈弹窗
   * 
   * @param type - 反馈类型
   */
  const openFeedbackModal = (type: FeedbackType) => {
    // 如果没有生成内容或没有 auditLogId，提示用户
    if (!content || !auditLogId) {
      showToast('error', '请先生成内容后再提交反馈');
      return;
    }

    // 获取对应类型的配置
    const config = FEEDBACK_TYPE_CONFIGS[type];
    
    // 设置弹窗状态
    setFeedbackModal({
      isOpen: true,
      type,
      title: config.title,
      placeholder: config.placeholder,
    });
  };

  /**
   * 关闭反馈弹窗
   */
  const closeFeedbackModal = () => {
    setFeedbackModal(null);
  };

  /**
   * 提交反馈
   * 
   * @param feedbackContent - 反馈内容
   */
  const handleFeedbackSubmit = async (feedbackContent: string) => {
    if (!auditLogId || !feedbackModal) {
      showToast('error', '无法提交反馈：未找到关联的生成记录');
      return;
    }

    setIsSubmitting(true);

    try {
      // 调用反馈提交 API
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId: auditLogId,
          type: feedbackModal.type,
          content: feedbackContent,
        }),
      });

      const data: SubmitFeedbackResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || '提交失败');
      }

      // 成功提示
      showToast('success', '反馈提交成功，感谢您的宝贵意见！');

      // 更新按钮状态（标记为已提交）
      const stateKey = feedbackModal.type.toLowerCase() as keyof FeedbackButtonState;
      setButtonStates(prev => ({
        ...prev,
        [stateKey]: true,
      }));

      // 关闭弹窗
      closeFeedbackModal();

    } catch (error: any) {
      console.error('[ResultViewer] 反馈提交失败:', error);
      showToast('error', error.message || '反馈提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 顶部标题和工具栏 */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          您的专属邮件内容
        </h3>
        
        {/* 工具栏按钮 - 按顺序：复制、建议、内容举报、用户反馈 */}
        <div className="flex items-center gap-2">
          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            disabled={!content}
            className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            title="复制"
          >
            <Copy size={20} />
          </button>
          
          {/* 建议按钮 */}
          <button
            onClick={() => openFeedbackModal('SUGGESTION')}
            disabled={!content}
            className={`p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              buttonStates.suggestion
                ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'
            }`}
            title="建议"
          >
            {buttonStates.suggestion ? <Check size={20} /> : <Lightbulb size={20} />}
          </button>
          
          {/* 内容举报按钮 */}
          <button
            onClick={() => openFeedbackModal('REPORT')}
            disabled={!content}
            className={`p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              buttonStates.report
                ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'
            }`}
            title="内容举报"
          >
            {buttonStates.report ? <Check size={20} /> : <Flag size={20} />}
          </button>
          
          {/* 用户反馈按钮 */}
          <button
            onClick={() => openFeedbackModal('CUSTOM')}
            disabled={!content}
            className={`p-2 rounded-lg transition-colors border border-transparent hover:border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              buttonStates.custom
                ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'
            }`}
            title="用户反馈"
          >
            {buttonStates.custom ? <Check size={20} /> : <MessageSquare size={20} />}
          </button>
        </div>
      </div>

      {/* 内容展示区 */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 overflow-y-auto flex flex-col">
        <div className="prose dark:prose-invert max-w-none flex-1">
          {/* 加载状态 */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
              <Loader2 size={48} className="animate-spin text-primary" />
              <p className="text-sm">AI 正在生成中，请稍候...</p>
            </div>
          )}

          {/* 空状态提示 */}
          {!isLoading && isEmpty && !content && (
            <p className="text-slate-400 italic">
              点击左侧"立即生成"按钮开始撰写...
            </p>
          )}
          
          {/* 生成内容展示 */}
          {!isLoading && content && (
            <div className="whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
      </div>

      {/* 底部提示信息 */}
      <div className="px-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
          {/* Info 图标 - 使用文字占位 */}
          <span className="text-primary/70 text-sm">ℹ️</span>
          <p>
            由 FluentWJ 生成。AI 算法提供内容，仅供参考。请在发送前核实关键信息。
          </p>
        </div>
      </div>

      {/* 反馈弹窗 */}
      {feedbackModal && (
        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={closeFeedbackModal}
          onSubmit={handleFeedbackSubmit}
          title={feedbackModal.title}
          placeholder={feedbackModal.placeholder}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}


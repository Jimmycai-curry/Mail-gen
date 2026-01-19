/**
 * Spec: /docs/specs/admin-feedback-management.md
 * 
 * 反馈管理 - 处理反馈侧边栏组件
 * 
 * Features:
 * - 右侧滑入面板（参考审计日志详情面板）
 * - 背景遮罩 + 模糊效果
 * - 显示用户原始反馈内容
 * - 管理员备注输入框（Textarea）
 * - 底部操作按钮：标记为已处理
 * - 滑入/滑出动画
 */

"use client";

import { useState, useEffect } from "react";
import { FeedbackListItem, FeedbackTypeLabel } from "@/types/admin";
import { toast } from "@/utils/toast";

interface FeedbackProcessModalProps {
  feedback: FeedbackListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (adminNote: string) => Promise<void>;
}

export default function FeedbackProcessModal({
  feedback,
  isOpen,
  onClose,
  onSubmit,
}: FeedbackProcessModalProps) {
  // 管理员备注状态
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 控制滑入动画
  const [isVisible, setIsVisible] = useState(false);

  // 组件挂载后触发滑入动画
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  // 如果弹窗未打开或没有反馈数据，不渲染
  if (!isOpen || !feedback) return null;

  // 处理关闭（先触发滑出动画，再调用 onClose）
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setAdminNote(""); // 清空备注
      onClose();
    }, 300); // 与动画时长一致
  };

  // 处理提交
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(adminNote);
      handleClose();
    } catch (error) {
      console.error("处理反馈失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 格式化日期时间
  const formatDateTime = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(/\//g, "-");
  };

  return (
    <>
      {/* 半透明背景遮罩 */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>

      {/* 右侧滑入面板 */}
      <div
        className={`fixed inset-y-0 right-0 w-[500px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 头部 */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">rate_review</span>
              处理反馈
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              反馈类型：{FeedbackTypeLabel[feedback.type] || feedback.type} · 用户：{feedback.userName}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-500">
              close
            </span>
          </button>
        </div>

        {/* 内容区（可滚动） */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* 1. 反馈详情信息 */}
          <section>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-[18px]">
                info
              </span>
              反馈详情
            </h4>
            <div className="space-y-3">
              {/* 用户手机号 */}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500">用户手机号</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {feedback.userPhone}
                </span>
              </div>

              {/* 提交时间 */}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500">提交时间</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {formatDateTime(feedback.createdTime)}
                </span>
              </div>

              {/* 反馈ID（完整显示） */}
              <div className="py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">反馈 ID</span>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(feedback.id);
                        toast.success("反馈 ID 复制成功");
                      } catch (error) {
                        console.error("复制失败:", error);
                        toast.error("复制失败，请稍后重试");
                      }
                    }}
                    className="text-[10px] text-primary hover:text-[#0047BD] transition-colors"
                    title="点击复制到剪贴板"
                  >
                    复制
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-400 break-all leading-relaxed">
                  {feedback.id}
                </p>
              </div>
            </div>
          </section>

          {/* 2. 用户原始反馈 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0054db] text-[18px]">
                  chat_bubble
                </span>
                用户原始反馈
              </h4>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">
                Feedback
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {feedback.content}
              </p>
            </div>
          </section>

          {/* 3. 管理员处理备注 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500 text-[18px]">
                  edit_note
                </span>
                管理员处理备注
              </h4>
            </div>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 resize-none"
              placeholder="请输入处理意见或回复内容..."
              rows={6}
            />
          </section>
        </div>

        {/* 底部操作按钮 */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex gap-3 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-primary hover:bg-[#0047BD] text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                处理中...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                标记为已处理
              </>
            )}
          </button>
        </div>
      </div>

      {/* 自定义滚动条样式 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </>
  );
}

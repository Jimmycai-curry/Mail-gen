"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

/**
 * FeedbackModal Props 接口
 * 
 * 反馈输入弹窗组件的属性
 */
interface FeedbackModalProps {
  isOpen: boolean;           // 是否打开弹窗
  onClose: () => void;       // 关闭弹窗的回调
  onSubmit: (content: string) => void;  // 提交反馈的回调
  title: string;             // 弹窗标题（如"提交建议"）
  placeholder: string;       // 输入框占位符
  isSubmitting: boolean;     // 是否正在提交中
}

/**
 * FeedbackModal 组件
 * 
 * 用户反馈输入弹窗，支持：
 * - 毛玻璃背景效果
 * - Textarea 输入框（1-500字符限制）
 * - 实时字符计数
 * - ESC 键关闭
 * - 点击背景关闭
 * - 提交中状态显示
 */
export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  isSubmitting
}: FeedbackModalProps) {
  // 反馈内容状态
  const [content, setContent] = useState("");

  // 监听 ESC 键关闭弹窗
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // 弹窗关闭时清空内容
  useEffect(() => {
    if (!isOpen) {
      setContent("");
    }
  }, [isOpen]);

  /**
   * 处理提交
   */
  const handleSubmit = () => {
    // 校验内容不能为空
    if (!content.trim()) {
      return;
    }

    // 调用父组件的提交回调
    onSubmit(content.trim());
  };

  // 如果弹窗未打开，不渲染
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* 背景蒙层 - 毛玻璃效果 */}
      <div
        className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 弹窗主体 */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="关闭"
            >
              <X size={20} />
            </button>
          </div>

          {/* 弹窗内容 */}
          <div className="px-6 py-5">
            {/* Textarea 输入框 */}
            <textarea
              value={content}
              onChange={(e) => {
                // 限制最大字符数为 500
                if (e.target.value.length <= 500) {
                  setContent(e.target.value);
                }
              }}
              placeholder={placeholder}
              disabled={isSubmitting}
              className="w-full h-32 px-4 py-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus
            />

            {/* 字符计数器 */}
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">
                {content.length === 0 && "请输入 1-500 个字符"}
                {content.length > 0 && content.length < 500 && ""}
                {content.length === 500 && "已达到字符上限"}
              </p>
              <p className={`text-xs font-medium ${
                content.length === 500 
                  ? "text-orange-500" 
                  : "text-slate-400"
              }`}>
                {content.length}/500
              </p>
            </div>
          </div>

          {/* 弹窗底部 - 操作按钮 */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
            {/* 取消按钮 */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              取消
            </button>

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "提交中..." : "提交"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { Copy, ThumbsDown, ThumbsUp, RefreshCw, Loader2 } from "lucide-react";

/**
 * ResultViewer Props 接口
 */
interface ResultViewerProps {
  content?: string;            // 生成的内容
  isLoading?: boolean;         // 是否正在加载
  isEmpty?: boolean;           // 是否为空状态
  onRegenerate?: () => void;   // 重新生成回调
}

/**
 * ResultViewer 组件
 * 结果展示区，包含工具栏、内容展示和提示信息
 */
export function ResultViewer({ content = "", isLoading = false, isEmpty = true, onRegenerate }: ResultViewerProps) {
  
  // 工具栏操作
  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      // TODO: 使用 toast 替代 alert
      alert("已复制到剪贴板");
    }
  };

  const handleThumbDown = () => {
    console.log("点踩");
    // TODO: 后续实现反馈功能
  };

  const handleThumbUp = () => {
    console.log("点赞");
    // TODO: 后续实现反馈功能
  };

  const handleRegenerate = () => {
    console.log("重新生成");
    onRegenerate?.();
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 顶部标题和工具栏 */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          您的专属邮件内容
        </h3>
        
        {/* 工具栏按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="复制"
          >
            <Copy size={20} />
          </button>
          
          <button
            onClick={handleThumbDown}
            className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="点踩"
          >
            <ThumbsUp size={20} className="rotate-180" />
          </button>
          
          <button
            onClick={handleThumbUp}
            className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="点赞"
          >
            <ThumbsUp size={20} />
          </button>
          
          <button
            onClick={handleRegenerate}
            className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="重新生成"
          >
            <RefreshCw size={20} />
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
    </div>
  );
}


"use client";

import { useState } from "react";
import { Copy, ThumbsDown, ThumbsUp, RefreshCw } from "lucide-react";

/**
 * ResultViewer 组件
 * 结果展示区，包含工具栏、内容展示和提示信息
 */
export function ResultViewer() {
  const [content, setContent] = useState(""); // 生成内容状态

  // 工具栏操作
  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      alert("已复制到剪贴板");
    }
  };

  const handleThumbDown = () => {
    console.log("点踩");
    // TODO: 后续实现
  };

  const handleThumbUp = () => {
    console.log("点赞");
    // TODO: 后续实现
  };

  const handleRegenerate = () => {
    console.log("重新生成");
    // TODO: 后续实现
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
          {/* 空状态提示 */}
          {!content && (
            <p className="text-slate-400 italic">
              点击左侧"立即生成"按钮开始撰写...
            </p>
          )}
          
          {/* 生成内容展示 */}
          {content && (
            <div>
              {/* 示例内容（实际内容由 API 返回） */}
              <h2 className="text-xl font-bold mb-4">
                关于下季度销售目标的会议邀约
              </h2>
              <p>尊敬的销售总监：</p>
              <p>您好！希望这封邮件时您正一切顺利。</p>
              <p>
                根据我们最新的业务分析，我想邀请您参加一个关于下季度销售目标的讨论会议。在本次会议中，我们将重点讨论以下几个核心要点：
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>区域市场的扩张策略</li>
                <li>针对核心大客户的激励方案</li>
                <li>渠道合作伙伴的赋能计划</li>
              </ul>
              <p>期待与您共同探讨。顺颂商祺。</p>
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


"use client";

import { HistoryDetailProps } from "@/types/history";
import { Copy, Heart, FileText, Info } from "lucide-react";

/**
 * Spec: /docs/specs/history-page.md
 *
 * HistoryDetail 组件
 * 历史记录详情展示，包含工具栏、输入需求详情和 AI 生成结果
 */
export function HistoryDetail({ detail }: HistoryDetailProps) {
  // 空状态：没有选中历史记录时显示
  if (!detail) {
    return (
      <div className="flex items-center justify-center h-full bg-background-light dark:bg-background-dark">
        <div className="text-center">
          {/* 空状态图标 */}
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            选择左侧历史记录查看详情
          </p>
        </div>
      </div>
    );
  }

  /**
   * 处理复制操作
   * 功能待实现：暂无实际复制逻辑
   */
  const handleCopy = () => {
    console.log("复制功能待实现");
    // TODO: 实现复制到剪贴板功能
  };

  /**
   * 处理收藏操作
   * 功能待实现：暂无实际收藏逻辑
   */
  const handleFavorite = () => {
    console.log("收藏功能待实现");
    // TODO: 实现收藏切换功能
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-gray-900/30 sticky top-0 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10">
        <div className="flex items-center gap-3">
          {/* 文档图标 */}
          <FileText className="text-gray-400 w-5 h-5" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">查看详情</h2>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="复制内容"
          >
            <Copy className="w-4 h-4" />
            复制内容
          </button>

          {/* 收藏按钮 */}
          <button
            onClick={handleFavorite}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={detail.isFavorite ? "取消收藏" : "添加收藏"}
          >
            <Heart className={`w-4 h-4 ${detail.isFavorite ? "fill-primary text-primary" : "text-gray-300"}`} />
            {detail.isFavorite ? "已收藏" : "添加收藏"}
          </button>
        </div>
      </div>

      {/* 内容展示区 */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* 左右分栏布局：左侧输入需求（4列），右侧AI结果（6列） */}
          <div className="grid grid-cols-10 gap-6">
            {/* 左侧：输入需求详情 */}
            <div className="col-span-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 h-full">
                {/* 小标题 */}
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  输入需求详情
                </h4>

                {/* 需求信息列表 */}
                <div className="space-y-5">
{/* 发送者/接收者 */}
          <div>
            <p className="text-xs text-gray-400 mb-1">发送者 / 接收者</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {detail.senderName} → {detail.recipientName}
            </p>
          </div>

                  {/* 语气风格 */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">语气风格</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {detail.tone.split(",").map((style, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-blue-500/20 text-blue-600 dark:bg-emerald-500/20 dark:text-emerald-400 text-[11px] rounded"
                        >
                          {style.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 应用场景 */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">应用场景</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {detail.scene}
                    </p>
                  </div>

                  {/* 核心要点 */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">核心要点</p>
                    <ul className="text-sm space-y-2 mt-1 list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed">
                      {detail.corePoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：AI 生成结果 */}
            <div className="col-span-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-800 min-h-[600px]">
                {/* 小标题 */}
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                  AI 生成结果
                </h4>

                {/* 邮件内容（富文本展示） */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-loose">
                  {/* 邮件内容分段展示 */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: detail.mailContent.replace(/\n/g, '<br/>')
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 底部提示信息 */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 py-4">
            <Info className="w-4 h-4" />
            <p>
              AI 生成内容仅供参考，请根据实际业务情况进行校对。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { HistoryDetailProps } from "@/types/history";
import { Copy, Heart, FileText, Info } from "lucide-react";
import { toast } from "@/utils/toast";

/**
 * Spec: /docs/specs/history-page.md
 *
 * HistoryDetail 组件
 * 历史记录详情展示，包含工具栏、输入需求详情和 AI 生成结果
 */
export function HistoryDetail({ detail, isLoading = false, onToggleFavorite }: HistoryDetailProps) {
  // 加载状态：显示加载动画
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background-light dark:bg-background-dark">
        <div className="text-center">
          {/* 加载动画 */}
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            加载中...
          </p>
        </div>
      </div>
    );
  }

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
   * 复制 AI 生成的邮件内容到剪贴板
   * 成功后使用新样式的 toast 提示用户
   */
  const handleCopy = async () => {
    if (!detail?.mailContent) {
      toast.error("没有可复制的内容");
      return;
    }

    try {
      // 将邮件内容复制到剪贴板
      // 移除 HTML 标签，只复制纯文本
      const plainText = detail.mailContent.replace(/<br\/?>/g, '\n');
      await navigator.clipboard.writeText(plainText);
      
      // 显示成功提示（使用新的绿色 ✓ 样式）
      toast.success("复制成功");
    } catch (error) {
      // 复制失败时显示错误提示（使用新的红色 × 样式）
      console.error("复制失败:", error);
      toast.error("复制失败，请稍后重试");
    }
  };

  /**
   * 处理收藏操作
   * 调用父组件传入的回调函数切换收藏状态
   */
  const handleFavorite = () => {
    if (detail && onToggleFavorite) {
      onToggleFavorite(detail.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/50 dark:bg-gray-900/30 sticky top-0 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10">
        <div className="flex items-center gap-2">
          {/* 文档图标 */}
          <FileText className="text-gray-400 w-4 h-4" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">查看详情</h2>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          {/* 复制按钮 */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="复制内容"
          >
            <Copy className="w-3.5 h-3.5" />
            复制内容
          </button>

          {/* 收藏按钮 */}
          <button
            onClick={handleFavorite}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title={detail.isFavorite ? "取消收藏" : "添加收藏"}
          >
            <Heart className={`w-3.5 h-3.5 ${detail.isFavorite ? "fill-red-500 text-red-500" : "text-gray-300"}`} />
            {detail.isFavorite ? "已收藏" : "添加收藏"}
          </button>
        </div>
      </div>

      {/* 内容展示区 */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* 左右分栏布局：左侧输入需求（3列，纵向50%），右侧AI结果（7列，纵向70%） */}
          <div className="grid grid-cols-10 gap-4">
            {/* 左侧：输入需求详情 */}
            <div className="col-span-3">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 h-[50vh] overflow-y-auto">
                {/* 小标题 */}
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  输入需求详情
                </h4>

                {/* 需求信息列表 */}
                <div className="space-y-4">
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
                    <ul className="text-sm space-y-1.5 mt-1 list-disc list-inside text-gray-600 dark:text-gray-400 leading-relaxed">
                      {detail.corePoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：AI 生成结果 */}
            <div className="col-span-7">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-800 h-[70vh] flex flex-col">
                {/* 小标题 */}
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex-shrink-0">
                  AI 生成结果
                </h4>

                {/* 邮件内容（富文本展示）- 可滚动 */}
                <div className="flex-1 overflow-y-auto prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed">
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

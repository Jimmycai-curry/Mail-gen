"use client";

import { HistoryListProps, HistoryItem } from "@/types/history";
import { Search, Filter, Heart, Calendar } from "lucide-react";

/**
 * Spec: /docs/specs/history-page.md
 *
 * HistoryList 组件
 * 历史记录列表，包含搜索框、筛选按钮和卡片列表
 * 展示历史记录的标题、预览内容、创建时间和收藏状态
 */
export function HistoryList({ histories, selectedId, onSelectHistory }: HistoryListProps) {
  /**
   * 渲染单个历史记录卡片
   * @param history - 历史记录数据
   * @returns 卡片元素
   */
  const renderCard = (history: HistoryItem) => {
    const isSelected = selectedId === history.id;

    return (
      <div
        key={history.id}
        // 根据选中状态应用不同的样式
        // 选中：primary 背景色 + 边框
        // 未选中：透明边框 + hover 效果
        className={`p-4 rounded-xl cursor-pointer transition-colors ${
          isSelected
            ? "bg-primary/5 border border-primary/20"
            : "border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }`}
        onClick={() => onSelectHistory(history.id)}
      >
        {/* 卡片顶部：标题和收藏图标 */}
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-semibold text-sm ${
            isSelected ? "text-blue-600" : "text-gray-800 dark:text-gray-100 group-hover:text-primary"
          }`}>
            {history.title}
          </h3>
          {/* 收藏图标：实心爱心（已收藏）或空心爱心（未收藏） */}
          {history.isFavorite ? (
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          ) : (
            <Heart className="w-5 h-5 text-gray-300 hover:text-primary" />
          )}
        </div>

        {/* 预览内容：最多 2 行，超出省略 */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
          {history.preview}
        </p>

        {/* 创建时间 */}
        <div className="flex items-center text-[11px] text-gray-400">
          <Calendar className="w-3 h-3 mr-1" />
          {history.createdAt}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* 顶部区域：标题和搜索筛选 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-6 tracking-tight">历史记录</h1>

        {/* 搜索框和筛选按钮 */}
        <div className="flex gap-2">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索历史记录"
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              // 功能待实现：暂无搜索逻辑
            />
          </div>

          {/* 筛选按钮 */}
          <button className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 历史记录列表：可滚动区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {histories.map((history) => renderCard(history))}
      </div>
    </div>
  );
}

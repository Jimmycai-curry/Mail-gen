"use client";

import { HistoryListProps, HistoryItem } from "@/types/history";
import { Search, Filter, Heart, Calendar, Trash2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { FilterDropdown } from "./FilterDropdown";

/**
 * Spec: /docs/specs/history-page.md
 *
 * HistoryList 组件
 * 历史记录列表，包含搜索框、筛选按钮和卡片列表
 * 展示历史记录的标题、预览内容、创建时间和收藏状态
 */
export function HistoryList({ histories, selectedId, onSelectHistory, onFilterChange, isLoading, error }: HistoryListProps) {
  // 搜索关键词状态
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 筛选状态管理
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<{
    startDate: string;
    endDate: string;
    showOnlyFavorites: boolean;
    quickFilter: 'all' | 'today' | 'week' | 'month' | 'year';
  }>({
    startDate: '',
    endDate: '',
    showOnlyFavorites: false,
    quickFilter: 'today'
  });

  // 删除确认弹窗状态管理
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 控制弹窗显示/隐藏
  const [historyToDelete, setHistoryToDelete] = useState<HistoryItem | null>(null); // 存储待删除的历史记录

  // 当quickFilter为today时，自动填充日期
  React.useEffect(() => {
    if (filterState.quickFilter === 'today') {
      const today = new Date();
      // 今天：从今天开始到明天开始（包含今天整天）
      const startDate = format(startOfDay(today), 'yyyy-MM-dd');
      const endDate = format(startOfDay(subDays(today, -1)), 'yyyy-MM-dd'); // 明天的开始
      
      setFilterState(prev => ({
        ...prev,
        startDate,
        endDate
      }));
    }
  }, [filterState.quickFilter]);

  const filterDropdownRef = useRef<HTMLDivElement>(null);

  /**
   * 处理筛选按钮点击
   */
  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  /**
   * 处理点击外部关闭下拉框
   */
  const handleOutsideClick = (event: MouseEvent) => {
    if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
      setIsFilterOpen(false);
    }
  };

  // 添加和移除点击事件监听器
  useEffect(() => {
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isFilterOpen]);

  /**
   * 处理日期选择
   */
  const handleDateChange = (field: string, value: any) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 处理快捷筛选选项
   * 
   * 日期范围说明：
   * - 今天：从今天 00:00 到明天 00:00（包含今天整天）
   * - 本周：从本周一 00:00 到下周一 00:00（包含本周整周）
   * - 本月：从本月1日 00:00 到下月1日 00:00（包含本月整月）
   * - 近一年：从一年前 00:00 到明天 00:00（包含近365天）
   */
  const handleQuickFilter = (option: 'today' | 'week' | 'month' | 'year') => {
    const today = new Date();
    let startDate = '';
    let endDate = '';

    switch (option) {
      case 'today':
        // 今天：从今天开始到明天开始（不包含明天）
        // 例如：2025-01-19 00:00:00 到 2025-01-20 00:00:00
        startDate = format(startOfDay(today), 'yyyy-MM-dd');
        endDate = format(startOfDay(subDays(today, -1)), 'yyyy-MM-dd'); // 明天的开始
        break;
      case 'week':
        // 本周：从本周一开始到下周一开始（不包含下周一）
        // 例如：2025-01-13 00:00:00 到 2025-01-20 00:00:00
        startDate = format(startOfWeek(today), 'yyyy-MM-dd');
        endDate = format(startOfWeek(subDays(today, -7)), 'yyyy-MM-dd'); // 下周一的开始
        break;
      case 'month':
        // 本月：从本月1日开始到下月1日开始（不包含下月1日）
        // 例如：2025-01-01 00:00:00 到 2025-02-01 00:00:00
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        endDate = format(startOfMonth(subDays(today, -31)), 'yyyy-MM-dd'); // 下月1日的开始
        break;
      case 'year':
        // 近一年：从365天前开始到明天开始（不包含明天）
        // 例如：2024-01-19 00:00:00 到 2025-01-20 00:00:00
        startDate = format(startOfDay(subDays(today, 365)), 'yyyy-MM-dd');
        endDate = format(startOfDay(subDays(today, -1)), 'yyyy-MM-dd'); // 明天的开始
        break;
    }

    setFilterState(prev => ({
      ...prev,
      startDate,
      endDate,
      quickFilter: option
    }));
  };

  /**
   * 处理收藏筛选切换
   */
  const handleFavoriteToggle = () => {
    setFilterState(prev => ({
      ...prev,
      showOnlyFavorites: !prev.showOnlyFavorites
    }));
  };


  /**
   * 重置筛选条件
   */
  const handleReset = () => {
    setFilterState({
      startDate: '',
      endDate: '',
      showOnlyFavorites: false,
      quickFilter: 'all'
    });
  };

  /**
   * 应用筛选条件
   * 通过 props 回调函数通知父组件
   */
  const handleApply = () => {
    // 关闭筛选下拉框
    setIsFilterOpen(false);

    // 构建筛选参数
    const filters = {
      keyword: searchKeyword,  // 包含搜索关键词
      startDate: filterState.startDate,
      endDate: filterState.endDate,
      showOnlyFavorites: filterState.showOnlyFavorites,
      quickFilter: filterState.quickFilter as 'all' | 'today' | 'week' | 'month' | undefined
    };

    // 通过回调函数通知父组件
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  /**
   * 处理搜索
   * 在搜索框按下回车键或失去焦点时触发
   */
  const handleSearch = () => {
    // 构建搜索参数
    const filters = {
      keyword: searchKeyword,
      startDate: filterState.startDate,
      endDate: filterState.endDate,
      showOnlyFavorites: filterState.showOnlyFavorites
    };

    // 通过回调函数通知父组件执行搜索
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  /**
   * 处理搜索框按键事件
   * 按下回车键时触发搜索
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 处理删除按钮点击
   * 打开确认弹窗，不直接删除
   */
  const handleDeleteClick = (history: HistoryItem, event: React.MouseEvent) => {
    // 阻止事件冒泡，避免触发卡片点击事件
    event.stopPropagation();
    // 设置待删除的历史记录
    setHistoryToDelete(history);
    // 打开确认弹窗
    setIsDeleteModalOpen(true);
  };

  /**
   * 确认删除操作
   * 用户点击弹窗中的确认按钮后调用
   */
  const handleConfirmDelete = () => {
    if (historyToDelete) {
      // TODO: 这里将来调用后端删除 API
      console.log('删除历史记录:', historyToDelete.id, historyToDelete.title);
      // 暂时只打印日志，等后端 API 做好后再实现实际删除
    }
    // 关闭弹窗
    setIsDeleteModalOpen(false);
    // 清空待删除的记录
    setHistoryToDelete(null);
  };

  /**
   * 取消删除操作
   * 用户点击弹窗中的取消按钮后调用
   */
  const handleCancelDelete = () => {
    // 关闭弹窗
    setIsDeleteModalOpen(false);
    // 清空待删除的记录
    setHistoryToDelete(null);
  };

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

        {/* 创建时间和删除按钮 */}
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          {/* 左侧：创建时间 */}
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {history.createdAt}
          </div>
          {/* 右侧：删除图标 - 和右上角的爱心垂直对齐 */}
          <Trash2
            className="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer transition-colors"
            onClick={(event) => handleDeleteClick(history, event)}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 主容器 */}
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
                placeholder="搜索历史记录（按回车搜索）"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>

            {/* 筛选按钮和下拉框 */}
            <div ref={filterDropdownRef}>
              <FilterDropdown
                isOpen={isFilterOpen}
                onToggle={handleFilterClick}
                filterState={filterState}
                onFilterChange={handleDateChange}
                onQuickFilter={handleQuickFilter}
                onFavoriteToggle={handleFavoriteToggle}
                onReset={handleReset}
                onApply={handleApply}
              />
            </div>
          </div>
        </div>

        {/* 历史记录列表：可滚动区域 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          {isLoading ? (
            // 加载中状态
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-gray-500">加载中...</p>
            </div>
          ) : error ? (
            // 错误状态
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-gray-500 text-sm mb-2">加载失败</p>
              <p className="text-gray-400 text-xs">{error}</p>
            </div>
          ) : histories.length === 0 ? (
            // 空状态：区分是搜索无结果还是没有记录
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">
                {searchKeyword.trim() ? '🔍' : '📋'}
              </div>
              <p className="text-gray-500 text-sm mb-2">
                {searchKeyword.trim() ? '未搜索到相关记录' : '暂无历史记录'}
              </p>
              {searchKeyword.trim() && (
                <p className="text-gray-400 text-xs">
                  搜索关键词："{searchKeyword}"
                </p>
              )}
            </div>
          ) : (
            // 有数据：显示列表
            histories.map((history) => renderCard(history))
          )}
        </div>
      </div>

      {/* 删除确认弹窗 - 磨砂玻璃效果 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景模糊层 - 磨砂玻璃效果 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />

          {/* 弹窗主体 */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
            {/* 警告图标 */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* 标题 */}
            <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
              确认删除
            </h3>

            {/* 提示信息 */}
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
              你确定要删除这条历史记录吗？<br />
              删除后无法恢复。
            </p>

            {/* 按钮组 */}
            <div className="flex gap-3">
              {/* 取消按钮 */}
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>

              {/* 确认按钮 - 红色 */}
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

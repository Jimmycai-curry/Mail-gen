"use client";

import { useState } from "react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Filter } from "lucide-react";

/**
 * Spec: /docs/specs/history-page.md
 * 
 * FilterDropdown 组件
 * 独立的筛选下拉框组件，包含时间筛选、快捷选项和收藏筛选功能
 */
interface FilterDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  filterState: {
    startDate: string;
    endDate: string;
    showOnlyFavorites: boolean;
    quickFilter: 'all' | 'today' | 'week' | 'month' | 'year';
  };
  onFilterChange: (field: string, value: any) => void;
  onQuickFilter: (option: 'today' | 'week' | 'month' | 'year') => void;
  onFavoriteToggle: () => void;
  onReset: () => void;
  onApply: () => void;
}

export function FilterDropdown({
  isOpen,
  onToggle,
  filterState,
  onFilterChange,
  onQuickFilter,
  onFavoriteToggle,
  onReset,
  onApply
}: FilterDropdownProps) {
  /**
   * 处理快捷筛选选项的日期计算
   */
  const handleQuickFilter = (option: 'today' | 'week' | 'month' | 'year') => {
    const today = new Date();
    let startDate = '';
    let endDate = '';

    switch (option) {
      case 'today':
        startDate = format(startOfDay(today), 'yyyy-MM-dd');
        endDate = format(endOfDay(today), 'yyyy-MM-dd');
        break;
      case 'week':
        startDate = format(startOfWeek(today), 'yyyy-MM-dd');
        endDate = format(endOfWeek(today), 'yyyy-MM-dd');
        break;
      case 'month':
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      case 'year':
        startDate = format(subDays(today, 365), 'yyyy-MM-dd');
        endDate = format(endOfDay(today), 'yyyy-MM-dd');
        break;
    }

    onFilterChange('startDate', startDate);
    onFilterChange('endDate', endDate);
    onFilterChange('quickFilter', option);
  };

  /**
   * 处理日期输入框变化，取消快捷选项选中
   */
  const handleDateInputChange = (field: string, value: string) => {
    // 如果修改了日期，取消快捷选项的选中状态
    if (filterState.quickFilter !== 'all') {
      onFilterChange('quickFilter', 'all');
    }
    onFilterChange(field, value);
  };

  return (
    <div className="relative">
      {/* 筛选按钮 */}
      <button 
        onClick={onToggle}
        className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
      >
        <Filter className="w-5 h-5" />
      </button>

      {/* 筛选下拉框 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {/* 时间筛选区域 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">时间筛选</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">开始日期</label>
                <input
                  type="date"
                  value={filterState.startDate}
                  onChange={(e) => {
                    // 当手动修改日期时，取消快捷选项的选中状态
                    if (filterState.quickFilter !== 'all') {
                      onFilterChange('quickFilter', 'all');
                    }
                    onFilterChange('startDate', e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">结束日期</label>
                <input
                  type="date"
                  value={filterState.endDate}
                  onChange={(e) => {
                    // 当手动修改日期时，取消快捷选项的选中状态
                    if (filterState.quickFilter !== 'all') {
                      onFilterChange('quickFilter', 'all');
                    }
                    onFilterChange('endDate', e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
            </div>

            {/* 快捷选项 */}
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">快捷选项</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickFilter('today')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    filterState.quickFilter === 'today' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  今日
                </button>
                <button
                  onClick={() => handleQuickFilter('week')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    filterState.quickFilter === 'week' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  最近7天
                </button>
                <button
                  onClick={() => handleQuickFilter('month')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    filterState.quickFilter === 'month' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  最近30天
                </button>
                <button
                  onClick={() => handleQuickFilter('year')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                    filterState.quickFilter === 'year' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  最近一年
                </button>
              </div>
            </div>
          </div>

          {/* 快捷选项区域 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">快捷选项</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="favorites-only"
                checked={filterState.showOnlyFavorites}
                onChange={onFavoriteToggle}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="favorites-only" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                仅显示已收藏内容
              </label>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className="p-4 flex gap-2">
            <button
              onClick={onReset}
              className="flex-1 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              重置
            </button>
            <button
              onClick={onApply}
              className="flex-1 px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              确认应用
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
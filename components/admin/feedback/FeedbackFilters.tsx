/**
 * Spec: /docs/specs/admin-feedback-management.md
 * 
 * 反馈管理 - 搜索和筛选组件
 * 
 * Features:
 * - 搜索框（支持关键词、用户名、内容摘要搜索，300ms 防抖）
 * - 反馈类型筛选（投诉/举报/建议）
 * - 提交日期筛选（最近24小时/最近7天/最近30天/自定义）
 */

"use client";

import { useState, useEffect, useCallback } from "react";

// 筛选参数类型
interface FilterParams {
  keyword: string;
  type: string;
  dateRange: string;
}

interface FeedbackFiltersProps {
  onFilterChange: (filters: FilterParams) => void;
}

export default function FeedbackFilters({ onFilterChange }: FeedbackFiltersProps) {
  // 本地状态
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [dateRange, setDateRange] = useState("");

  // 防抖处理 - 300ms 后触发搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ keyword, type, dateRange });
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, type, dateRange, onFilterChange]);

  // 处理类型筛选变化
  const handleTypeChange = (newType: string) => {
    setType(newType);
  };

  // 处理日期筛选变化
  const handleDateRangeChange = (newRange: string) => {
    setDateRange(newRange);
  };

  return (
    <section className="p-8 pb-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* 搜索框 */}
        <div className="flex-1 w-full">
          <label className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 focus:ring-primary focus:border-primary text-sm text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
              placeholder="搜索关键词、用户名或内容摘要..."
            />
          </label>
        </div>

        {/* 筛选按钮组 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 反馈类型筛选 */}
          <div className="relative">
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 appearance-none pr-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <option value="">所有类型</option>
              <option value="COMPLAINT">投诉</option>
              <option value="REPORT">举报</option>
              <option value="SUGGESTION">建议</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
              filter_list
            </span>
          </div>

          {/* 提交日期筛选 */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 appearance-none pr-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <option value="">所有时间</option>
              <option value="24h">最近24小时</option>
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
              calendar_today
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

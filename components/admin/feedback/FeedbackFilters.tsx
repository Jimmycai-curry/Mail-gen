/**
 * Spec: /docs/specs/admin-feedback-management.md
 * 
 * 反馈管理 - 搜索和筛选组件
 * 
 * Features:
 * - 搜索框（支持关键词、用户名、内容摘要搜索，300ms 防抖）
 * - 反馈类型筛选（投诉/举报/建议）
 * - 提交日期筛选（日期范围选择器 + 快捷按钮：最近24小时/最近7天/最近30天）
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// 筛选参数类型（扩展，支持 ISO 格式的日期）
interface FilterParams {
  keyword: string;
  type: string;
  dateRange: string;
  startDate?: string;  // ISO 格式
  endDate?: string;    // ISO 格式
}

interface FeedbackFiltersProps {
  onFilterChange: (filters: FilterParams) => void;
}

export default function FeedbackFilters({ onFilterChange }: FeedbackFiltersProps) {
  // 本地状态
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [dateRange, setDateRange] = useState("");
  
  // 日期输入框的引用
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // 防抖处理 - 300ms 后触发搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      // 解析日期范围
      const [startStr, endStr] = dateRange.split(' ~ ');
      let startDate: string | undefined;
      let endDate: string | undefined;
      
      if (startStr && endStr) {
        const start = new Date(startStr);
        const end = new Date(endStr);
        end.setHours(23, 59, 59, 999); // 设置为当天结束时间
        
        startDate = start.toISOString();
        endDate = end.toISOString();
      }
      
      onFilterChange({ keyword, type, dateRange, startDate, endDate });
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, type, dateRange, onFilterChange]);

  // 处理类型筛选变化
  const handleTypeChange = (newType: string) => {
    setType(newType);
  };

  /**
   * 处理日期范围变化
   */
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  /**
   * 快速选择日期范围
   */
  const handleQuickDateSelect = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    setDateRange(`${startStr} ~ ${endStr}`);
  };

  return (
    <section className="p-8 pb-4 shrink-0">
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
              className="appearance-none flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 pr-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <option value="">所有类型</option>
              <option value="CUSTOM">反馈</option>
              <option value="REPORT">举报</option>
              <option value="SUGGESTION">建议</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
              filter_list
            </span>
          </div>

          {/* 日期范围筛选 */}
          <div className="flex items-center gap-2">
            {/* 开始日期 */}
            <div className="relative">
              <input
                ref={startDateRef}
                type="date"
                value={dateRange.split(' ~ ')[0] || ''}
                onChange={(e) => {
                  const newStart = e.target.value;
                  const currentEnd = dateRange.split(' ~ ')[1] || '';
                  if (newStart && currentEnd) {
                    handleDateRangeChange(`${newStart} ~ ${currentEnd}`);
                  } else if (newStart) {
                    setDateRange(newStart);
                  }
                }}
                className="pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (startDateRef.current) {
                    // 尝试使用 showPicker (现代浏览器)
                    try {
                      (startDateRef.current as any).showPicker?.();
                    } catch {
                      // 回退到 click 方法
                      startDateRef.current.focus();
                      startDateRef.current.click();
                    }
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0052D9] transition-colors cursor-pointer z-10"
                title="选择开始日期"
              >
                <span className="material-symbols-outlined text-[20px]">
                  calendar_month
                </span>
              </button>
            </div>

            <span className="text-slate-400">~</span>

            {/* 结束日期 */}
            <div className="relative">
              <input
                ref={endDateRef}
                type="date"
                value={dateRange.split(' ~ ')[1] || ''}
                onChange={(e) => {
                  const newEnd = e.target.value;
                  const currentStart = dateRange.split(' ~ ')[0] || '';
                  if (currentStart && newEnd) {
                    handleDateRangeChange(`${currentStart} ~ ${newEnd}`);
                  } else if (newEnd) {
                    setDateRange(newEnd);
                  }
                }}
                className="pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (endDateRef.current) {
                    // 尝试使用 showPicker (现代浏览器)
                    try {
                      (endDateRef.current as any).showPicker?.();
                    } catch {
                      // 回退到 click 方法
                      endDateRef.current.focus();
                      endDateRef.current.click();
                    }
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0052D9] transition-colors cursor-pointer z-10"
                title="选择结束日期"
              >
                <span className="material-symbols-outlined text-[20px]">
                  calendar_month
                </span>
              </button>
            </div>
          </div>

          {/* 快速选择按钮 */}
          <div className="hidden lg:flex items-center gap-2 ml-2">
            <button
              onClick={() => handleQuickDateSelect(1)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              最近24小时
            </button>
            <button
              onClick={() => handleQuickDateSelect(7)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              最近7天
            </button>
            <button
              onClick={() => handleQuickDateSelect(30)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              最近30天
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

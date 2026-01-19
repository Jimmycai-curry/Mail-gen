/**
 * Spec: /docs/specs/admin-audit-logs.md
 * 
 * 审计日志筛选组件
 * 
 * Features:
 * - 搜索框（支持手机号/IP/模型名称搜索）
 * - 状态下拉菜单（所有状态/通过/违规拦截）
 * - 时间范围选择器（日期范围选择器 + 快捷按钮：最近24小时/最近7天/最近30天）
 * - 实时搜索（300ms 防抖）
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { AuditLogQueryParams } from "@/types/admin";

interface AuditLogFiltersProps {
  onFilterChange: (filters: Partial<AuditLogQueryParams>) => void;
  currentFilters: AuditLogQueryParams;
}

export default function AuditLogFilters({
  onFilterChange,
  currentFilters,
}: AuditLogFiltersProps) {
  // ========== 状态管理 ==========
  
  // 搜索关键词（本地状态，用于防抖）
  const [searchKeyword, setSearchKeyword] = useState(currentFilters.keyword || "");
  // 状态筛选（0=违规拦截, 1=通过, undefined=所有）
  const [statusFilter, setStatusFilter] = useState<number | undefined>(currentFilters.status);
  // 日期范围（格式: "YYYY-MM-DD ~ YYYY-MM-DD"）
  const [dateRange, setDateRange] = useState<string>("");
  // 下拉菜单展开状态
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  
  // 日期输入框的引用
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // ========== 防抖处理 ==========
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 防抖搜索（300ms）
   */
  const debouncedSearch = useCallback((keyword: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onFilterChange({ keyword: keyword || undefined });
    }, 300);
  }, [onFilterChange]);

  /**
   * 处理搜索输入变化
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    debouncedSearch(value);
  };

  /**
   * 处理状态筛选变化
   */
  const handleStatusChange = (status: number | undefined) => {
    setStatusFilter(status);
    setStatusDropdownOpen(false);
    onFilterChange({ status });
  };

  /**
   * 处理日期范围变化
   */
  const handleDateRangeChange = (value: string) => {
    setDateRange(value);

    if (!value) {
      // 清空日期筛选
      onFilterChange({ startDate: undefined, endDate: undefined });
      return;
    }

    // 解析日期范围（格式: "YYYY-MM-DD ~ YYYY-MM-DD"）
    const [startStr, endStr] = value.split(' ~ ');
    if (startStr && endStr) {
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      endDate.setHours(23, 59, 59, 999); // 设置为当天结束时间

      onFilterChange({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    }
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
    onFilterChange({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  /**
   * 点击外部关闭下拉菜单
   */
  useEffect(() => {
    const handleClickOutside = () => {
      setStatusDropdownOpen(false);
    };

    if (statusDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [statusDropdownOpen]);

  // ========== 渲染 ==========

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
              value={searchKeyword}
              onChange={handleSearchChange}
              placeholder="搜索手机号、IP 或模型名称..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-[#0054db]/20 focus:border-[#0054db]"
            />
          </label>
        </div>

        {/* 筛选按钮组 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 状态筛选下拉菜单 */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStatusDropdownOpen(!statusDropdownOpen);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {statusFilter === undefined
                ? "所有状态"
                : statusFilter === 1
                ? "通过"
                : statusFilter === 0
                ? "审核拦截"
                : statusFilter === 2
                ? "系统拦截"
                : "未知"}
              <span className="material-symbols-outlined text-[18px]">
                expand_more
              </span>
            </button>

            {/* 下拉选项 */}
            {statusDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => handleStatusChange(undefined)}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  所有状态
                </button>
                <button
                  onClick={() => handleStatusChange(1)}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  通过
                </button>
                <button
                  onClick={() => handleStatusChange(0)}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  审核拦截
                </button>
                <button
                  onClick={() => handleStatusChange(2)}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  系统拦截
                </button>
              </div>
            )}
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

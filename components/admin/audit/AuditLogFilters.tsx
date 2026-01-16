/**
 * Spec: /docs/specs/admin-audit-logs.md
 * 
 * 审计日志筛选组件
 * 
 * Features:
 * - 搜索框（支持手机号/IP/模型名称搜索）
 * - 状态下拉菜单（所有状态/通过/违规拦截）
 * - 时间范围选择器（最近24小时/最近7天/最近30天/自定义）
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
  // 时间范围筛选（预设选项）
  const [timeRange, setTimeRange] = useState<string>("all");
  // 下拉菜单展开状态
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);

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
   * 处理时间范围变化
   */
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    setTimeDropdownOpen(false);

    // 计算时间范围
    const now = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined = now.toISOString();

    switch (range) {
      case "24h":
        // 最近24小时
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case "7d":
        // 最近7天
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "30d":
        // 最近30天
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "all":
      default:
        // 所有时间
        startDate = undefined;
        endDate = undefined;
        break;
    }

    onFilterChange({ startDate, endDate });
  };

  /**
   * 点击外部关闭下拉菜单
   */
  useEffect(() => {
    const handleClickOutside = () => {
      setStatusDropdownOpen(false);
      setTimeDropdownOpen(false);
    };

    if (statusDropdownOpen || timeDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [statusDropdownOpen, timeDropdownOpen]);

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
                setTimeDropdownOpen(false);
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

          {/* 时间范围下拉菜单 */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTimeDropdownOpen(!timeDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {timeRange === "24h"
                ? "最近 24 小时"
                : timeRange === "7d"
                ? "最近 7 天"
                : timeRange === "30d"
                ? "最近 30 天"
                : "所有时间"}
              <span className="material-symbols-outlined text-[18px]">
                calendar_today
              </span>
            </button>

            {/* 下拉选项 */}
            {timeDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => handleTimeRangeChange("all")}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  所有时间
                </button>
                <button
                  onClick={() => handleTimeRangeChange("24h")}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  最近 24 小时
                </button>
                <button
                  onClick={() => handleTimeRangeChange("7d")}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  最近 7 天
                </button>
                <button
                  onClick={() => handleTimeRangeChange("30d")}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  最近 30 天
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

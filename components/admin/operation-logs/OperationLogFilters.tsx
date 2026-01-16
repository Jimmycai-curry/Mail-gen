/**
 * Spec: /docs/specs/admin-operation-logs.md
 * 
 * 操作日志筛选栏组件
 * 
 * Features:
 * - 搜索框：管理员账号搜索（300ms 防抖）
 * - 操作类型下拉：全部/封禁用户/修改敏感词/处理反馈/配置变更
 * - 日期范围选择器：自定义日期范围
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { OperationLogQueryParams } from "@/types/admin";

interface OperationLogFiltersProps {
  onFilterChange: (filters: Partial<OperationLogQueryParams>) => void;
  currentFilters: OperationLogQueryParams;
}

export default function OperationLogFilters({
  onFilterChange,
  currentFilters,
}: OperationLogFiltersProps) {
  // ========== 状态管理 ==========

  const [keyword, setKeyword] = useState(currentFilters.keyword || "");
  const [actionType, setActionType] = useState(currentFilters.actionType || "");
  const [dateRange, setDateRange] = useState<string>("");
  
  // 日期输入框的引用
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // ========== 搜索防抖 ==========

  /**
   * 防抖：300ms 后触发搜索
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword !== currentFilters.keyword) {
        onFilterChange({ keyword: keyword || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]); // 注意：不要依赖 onFilterChange 和 currentFilters，避免死循环

  // ========== 事件处理 ==========

  /**
   * 处理操作类型变化
   */
  const handleActionTypeChange = (value: string) => {
    setActionType(value);
    onFilterChange({ actionType: value || undefined });
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

  // ========== 渲染 ==========

  return (
    <section className="p-8 pb-4 shrink-0">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* 搜索框 */}
        <div className="flex-1 w-full">
          <label className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400">
              person_search
            </span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 focus:ring-[#0052D9] focus:border-[#0052D9] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
              placeholder="通过管理员账号搜索..."
            />
          </label>
        </div>

        {/* 筛选按钮组 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 操作类型筛选 */}
          <div className="relative">
            <select
              value={actionType}
              onChange={(e) => handleActionTypeChange(e.target.value)}
              className="appearance-none flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 pr-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <option value="">全部操作</option>
              <option value="BAN_USER">封禁用户</option>
              <option value="UNBAN_USER">解封用户</option>
              <option value="UPDATE_SENSITIVE_WORDS">修改敏感词</option>
              <option value="PROCESS_FEEDBACK">处理反馈</option>
              <option value="CONFIG_CHANGE">配置变更</option>
              <option value="CREATE_USER">创建用户</option>
              <option value="UPDATE_USER">修改用户</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
              filter_alt
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

          {/* 快速选择按钮（可选） */}
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

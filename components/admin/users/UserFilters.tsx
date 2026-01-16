/**
 * Spec: /docs/specs/admin-user-management.md
 * 
 * 搜索与筛选栏组件
 * 
 * Features:
 * - 搜索框（实时搜索，300ms防抖）
 * - 筛选下拉（角色、状态）
 * - 导出按钮
 * - 新增用户按钮
 */

"use client";

import { useState, useEffect } from "react";

interface UserFiltersProps {
  onSearch: (search: string) => void;         // 搜索回调
  onFilter: (role?: number, status?: number) => void;  // 筛选回调
  onExport: () => void;                       // 导出回调
  onAddUser: () => void;                      // 新增用户回调
}

export default function UserFilters({
  onSearch,
  onFilter,
  onExport,
  onAddUser,
}: UserFiltersProps) {
  // ========== 状态管理 ==========
  
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // ========== 搜索防抖 ==========

  useEffect(() => {
    // 300ms 防抖
    const timer = setTimeout(() => {
      onSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ========== 筛选处理 ==========

  const handleRoleChange = (role?: number) => {
    setRoleFilter(role);
    onFilter(role, statusFilter);
    setShowFilterDropdown(false);
  };

  const handleStatusChange = (status?: number) => {
    setStatusFilter(status);
    onFilter(roleFilter, status);
    setShowFilterDropdown(false);
  };

  const handleClearFilters = () => {
    setRoleFilter(undefined);
    setStatusFilter(undefined);
    onFilter(undefined, undefined);
    setShowFilterDropdown(false);
  };

  // 判断是否有激活的筛选
  const hasActiveFilters = roleFilter !== undefined || statusFilter !== undefined;

  // ========== 渲染 ==========

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center">
      {/* 搜索框 */}
      <div className="flex-1 min-w-[300px]">
        <label className="relative block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <span className="material-symbols-outlined">search</span>
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
            placeholder="按手机号或 ID 搜索"
          />
        </label>
      </div>

      {/* 操作按钮组 */}
      <div className="flex gap-3">
        {/* 筛选按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              hasActiveFilters
                ? "bg-primary text-white"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-lg">filter_list</span>
            筛选
            {hasActiveFilters && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                {(roleFilter !== undefined ? 1 : 0) + (statusFilter !== undefined ? 1 : 0)}
              </span>
            )}
          </button>

          {/* 筛选下拉菜单 */}
          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 overflow-hidden">
              {/* 角色筛选 */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">角色</div>
                <div className="space-y-1">
                  <button
                    onClick={() => handleRoleChange(undefined)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      roleFilter === undefined
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => handleRoleChange(0)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      roleFilter === 0
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    管理员
                  </button>
                  <button
                    onClick={() => handleRoleChange(1)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      roleFilter === 1
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    普通用户
                  </button>
                </div>
              </div>

              {/* 状态筛选 */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">状态</div>
                <div className="space-y-1">
                  <button
                    onClick={() => handleStatusChange(undefined)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      statusFilter === undefined
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => handleStatusChange(1)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      statusFilter === 1
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    正常
                  </button>
                  <button
                    onClick={() => handleStatusChange(0)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      statusFilter === 0
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    已封禁
                  </button>
                </div>
              </div>

              {/* 清除筛选 */}
              {hasActiveFilters && (
                <div className="p-3">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-3 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    清除所有筛选
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 导出按钮 */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          导出
        </button>

        {/* 新增用户按钮 */}
        <button
          onClick={onAddUser}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          新增用户
        </button>
      </div>

      {/* 点击外部关闭下拉菜单 */}
      {showFilterDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilterDropdown(false)}
        />
      )}
    </div>
  );
}

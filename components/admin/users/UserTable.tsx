/**
 * Spec: /docs/specs/admin-user-management.md
 * 
 * 用户列表表格组件
 * 
 * Features:
 * - 展示用户信息（ID、手机号、角色、状态、注册时间、最后登录）
 * - 状态徽章可视化（正常/已封禁）
 * - 操作按钮（启用/禁用账户）
 * - 分页组件
 * - 加载状态
 * - 空状态占位
 */

"use client";

import { UserListItem } from "@/types/admin";

interface UserTableProps {
  users: UserListItem[];      // 用户列表数据
  total: number;              // 总用户数
  page: number;               // 当前页码
  pageSize: number;           // 每页数量
  loading: boolean;           // 加载状态
  onPageChange: (page: number) => void;  // 分页变更回调
  onStatusChange: (user: UserListItem, targetStatus: number) => void;  // 状态变更回调
}

export default function UserTable({
  users,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onStatusChange,
}: UserTableProps) {
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 格式化时间
  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 角色名称映射
  const getRoleName = (role: number) => {
    return role === 0 ? "管理员" : "普通用户";
  };

  // 生成分页按钮
  const getPaginationButtons = () => {
    const buttons: (number | string)[] = [];

    // 始终显示第一页
    buttons.push(1);

    // 当前页前后的页码
    if (page > 3) {
      buttons.push("...");
    }

    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        buttons.push(i);
      }
    }

    if (page < totalPages - 2) {
      buttons.push("...");
    }

    // 始终显示最后一页
    if (totalPages > 1) {
      buttons.push(totalPages);
    }

    return buttons;
  };

  // ========== 渲染 ==========

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* 表格容器 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* 表头 */}
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                用户 ID
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                手机号
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                角色
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                注册时间
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                最后登录
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                操作
              </th>
            </tr>
          </thead>

          {/* 表体 */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              // 加载状态
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span>加载中...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              // 空状态
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
                    person_off
                  </span>
                  <p>暂无用户数据</p>
                </td>
              </tr>
            ) : (
              // 用户数据行
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* 用户 ID */}
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {user.id.slice(0, 8)}...
                  </td>

                  {/* 手机号 */}
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-200 font-medium">
                    {user.phone}
                  </td>

                  {/* 角色 */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                      {getRoleName(user.role)}
                    </span>
                  </td>

                  {/* 状态 */}
                  <td className="px-6 py-4">
                    {user.status === 1 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                        正常
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                        <span className="size-1.5 rounded-full bg-red-500"></span>
                        已封禁
                      </span>
                    )}
                  </td>

                  {/* 注册时间 */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(user.created_time)}
                  </td>

                  {/* 最后登录 */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(user.last_login_time)}
                  </td>

                  {/* 操作按钮 */}
                  <td className="px-6 py-4 text-right">
                    {user.status === 1 ? (
                      <button
                        onClick={() => onStatusChange(user, 0)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      >
                        禁用账户
                      </button>
                    ) : (
                      <button
                        onClick={() => onStatusChange(user, 1)}
                        className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      >
                        启用账户
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页组件 */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        {/* 左侧：总数统计 */}
        <div className="text-sm text-slate-500">
          共 <span className="font-bold text-slate-900 dark:text-white">{total}</span> 名用户
        </div>

        {/* 右侧：分页按钮 */}
        <div className="flex items-center gap-1">
          {/* 上一页 */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {/* 页码按钮 */}
          {getPaginationButtons().map((btn, index) => {
            if (btn === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                  ...
                </span>
              );
            }

            const pageNum = btn as number;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`size-8 rounded-lg text-sm font-bold transition-colors ${
                  page === pageNum
                    ? "bg-primary text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* 下一页 */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Spec: /docs/specs/admin-user-management.md
 * 
 * 状态确认对话框组件
 * 
 * Features:
 * - 确认禁用/启用操作
 * - 显示用户信息
 * - 危险操作警告提示
 */

"use client";

import { UserListItem } from "@/types/admin";

interface StatusConfirmDialogProps {
  open: boolean;                          // 对话框是否打开
  user: UserListItem | null;              // 目标用户
  targetStatus: number;                   // 目标状态（0=封禁, 1=正常）
  onClose: () => void;                    // 关闭对话框回调
  onConfirm: () => void;                  // 确认操作回调
}

export default function StatusConfirmDialog({
  open,
  user,
  targetStatus,
  onClose,
  onConfirm,
}: StatusConfirmDialogProps) {
  // 如果对话框未打开或用户为空，不渲染
  if (!open || !user) return null;

  // 判断是禁用还是启用
  const isDisabling = targetStatus === 0;

  // ========== 渲染 ==========

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* 对话框容器（阻止事件冒泡） */}
        <div
          className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 对话框头部 */}
          <div
            className={`px-6 py-4 border-b flex items-center gap-3 ${
              isDisabling
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                : "bg-primary/10 border-primary/20"
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl ${
                isDisabling ? "text-red-600 dark:text-red-400" : "text-primary"
              }`}
            >
              {isDisabling ? "warning" : "check_circle"}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isDisabling ? "确认禁用用户" : "确认启用用户"}
            </h3>
          </div>

          {/* 对话框内容 */}
          <div className="p-6 space-y-4">
            {/* 用户信息 */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">用户 ID</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">手机号</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {user.phone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">角色</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {user.role === 0 ? "管理员" : "普通用户"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">当前状态</span>
                <span
                  className={`text-sm font-bold ${
                    user.status === 1
                      ? "text-primary"
                      : "text-slate-500"
                  }`}
                >
                  {user.status === 1 ? "正常" : "已封禁"}
                </span>
              </div>
            </div>

            {/* 警告提示 */}
            {isDisabling ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl mt-0.5">
                    error
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-900 dark:text-red-200 mb-1">
                      危险操作
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      禁用后，该用户将无法登录系统。如需恢复，可随时启用该账户。
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                    info
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                      操作说明
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      启用后，该用户将恢复正常登录权限。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 确认问题 */}
            <p className="text-center text-sm text-slate-700 dark:text-slate-300 font-medium">
              确认{isDisabling ? "禁用" : "启用"}用户{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {user.phone}
              </span>{" "}
              吗？
            </p>

            {/* 按钮组 */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold transition-colors"
              >
                取消
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  isDisabling
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                {isDisabling ? "确认禁用" : "确认启用"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

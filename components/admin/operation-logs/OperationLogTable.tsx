/**
 * Spec: /docs/specs/admin-operation-logs.md
 * 
 * 操作日志表格组件
 * 
 * Features:
 * - 6列数据展示（管理员账号、操作行为、目标ID、详细描述、IP地址、操作时间）
 * - 操作行为彩色标签（红色/橙色/蓝色/紫色/绿色）
 * - Hover 悬停效果
 * - 分页功能
 * - 加载状态
 * - 空状态展示
 */

"use client";

import type { OperationLog } from "@/types/admin";

interface OperationLogTableProps {
  logs: OperationLog[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function OperationLogTable({
  logs,
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
}: OperationLogTableProps) {
  // ========== 工具函数 ==========

  /**
   * 格式化时间（ISO -> 本地时间）
   */
  const formatTime = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  /**
   * 获取操作类型徽章样式（根据设计稿）
   */
  const getActionTypeBadge = (actionType: string) => {
    const badgeMap: Record<
      string,
      { label: string; bgColor: string; textColor: string }
    > = {
      BAN_USER: {
        label: "封禁用户",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-600 dark:text-red-400",
      },
      UNBAN_USER: {
        label: "解封用户",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-600 dark:text-green-400",
      },
      UPDATE_SENSITIVE_WORDS: {
        label: "修改敏感词",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        textColor: "text-orange-600 dark:text-orange-400",
      },
      PROCESS_FEEDBACK: {
        label: "处理反馈",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      CONFIG_CHANGE: {
        label: "配置变更",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        textColor: "text-purple-600 dark:text-purple-400",
      },
      CREATE_USER: {
        label: "创建用户",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        textColor: "text-green-600 dark:text-green-400",
      },
      UPDATE_USER: {
        label: "修改用户",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        textColor: "text-blue-600 dark:text-blue-400",
      },
      DELETE_USER: {
        label: "删除用户",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        textColor: "text-red-600 dark:text-red-400",
      },
      EXPORT_OPERATION_LOGS: {
        label: "导出日志",
        bgColor: "bg-slate-100 dark:bg-slate-900/30",
        textColor: "text-slate-600 dark:text-slate-400",
      },
    };

    const badge = badgeMap[actionType] || {
      label: actionType,
      bgColor: "bg-slate-100 dark:bg-slate-900/30",
      textColor: "text-slate-600 dark:text-slate-400",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${badge.bgColor} ${badge.textColor}`}
      >
        {badge.label}
      </span>
    );
  };

  /**
   * 计算总页数
   */
  const totalPages = Math.ceil(total / pageSize);

  // ========== 渲染 ==========

  return (
    <section className="flex flex-col h-full px-8 pb-8">
      {/* 表格容器 */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
        {/* 表格内容（可滚动） */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="w-40 px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  管理员账号
                </th>
                <th className="w-32 px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  操作行为
                </th>
                <th className="w-32 px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                  目标 ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  详细描述
                </th>
                <th className="w-40 px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  IP 地址
                </th>
                <th className="w-48 px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  操作时间
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                // 加载中状态
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-8 border-4 border-[#0052D9]/20 border-t-[#0052D9] rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        加载中...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                // 空状态
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">
                        folder_open
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        暂无操作日志数据
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // 数据列表
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* 管理员账号 */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0052D9] text-lg">
                          {log.adminAccount.includes("admin") || log.adminAccount.includes("root")
                            ? "admin_panel_settings"
                            : "account_circle"}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {log.adminAccount}
                        </span>
                      </div>
                    </td>

                    {/* 操作行为（彩色标签） */}
                    <td className="px-6 py-4">{getActionTypeBadge(log.actionType)}</td>

                    {/* 目标 ID */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-mono text-slate-500">
                        {log.targetId || "-"}
                      </span>
                    </td>

                    {/* 详细描述（截断显示） */}
                    <td className="px-6 py-4">
                      <p
                        className="text-sm text-slate-600 dark:text-slate-400 truncate"
                        title={log.detail || ""}
                      >
                        {log.detail || "-"}
                      </p>
                    </td>

                    {/* IP 地址 */}
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                      {log.ip || "-"}
                    </td>

                    {/* 操作时间 */}
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {formatTime(log.createdTime)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页栏 */}
        {!loading && logs.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {/* 左侧：数据统计 */}
            <p className="text-xs text-slate-500">
              显示第 {(currentPage - 1) * pageSize + 1} 到{" "}
              {Math.min(currentPage * pageSize, total)} 条，共 {total} 条审计日志
            </p>

            {/* 右侧：分页按钮 */}
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-bold text-slate-700 dark:text-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                上一页
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-bold text-slate-700 dark:text-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 自定义滚动条样式 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}

/**
 * Spec: /docs/specs/admin-audit-logs.md
 * 
 * 审计日志表格组件
 * 
 * Features:
 * - 5列数据展示（生成时间、用户手机号、客户端IP、底层模型、审核状态）
 * - 状态标签样式（通过=绿色，违规拦截=红色脉冲）
 * - 选中行高亮效果（背景色 + 边框）
 * - 点击行触发详情面板
 * - 分页功能
 * - 加载状态
 * - 空状态展示
 */

"use client";

import type { AuditLog } from "@/types/admin";

interface AuditLogTableProps {
  logs: AuditLog[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  selectedId?: string;
  onRowClick: (log: AuditLog) => void;
  onPageChange: (page: number) => void;
}

export default function AuditLogTable({
  logs,
  loading,
  total,
  currentPage,
  pageSize,
  selectedId,
  onRowClick,
  onPageChange,
}: AuditLogTableProps) {
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
   * 获取状态徽章样式
   */
  const getStatusBadge = (status: number) => {
    if (status === 1) {
      // 通过
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20">
          <span className="size-1.5 rounded-full bg-green-500"></span>
          通过
        </span>
      );
    } else {
      // 违规拦截
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
          <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
          违规拦截
        </span>
      );
    }
  };

  /**
   * 获取模型徽章样式
   */
  const getModelBadge = (modelName: string | null) => {
    if (!modelName) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-500/10 text-slate-600 dark:bg-slate-500/20">
          -
        </span>
      );
    }

    // 根据模型名称选择不同颜色
    if (modelName.includes("DeepSeek")) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#0054db]/10 text-[#0054db] dark:bg-[#0054db]/20">
          {modelName}
        </span>
      );
    } else if (modelName.includes("GPT")) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20">
          {modelName}
        </span>
      );
    } else if (modelName.includes("Claude")) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/20">
          {modelName}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-500/10 text-slate-600 dark:bg-slate-500/20">
          {modelName}
        </span>
      );
    }
  };

  /**
   * 计算总页数
   */
  const totalPages = Math.ceil(total / pageSize);

  /**
   * 计算分页显示范围
   */
  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const showPages = 5; // 显示的页码数量

    if (totalPages <= showPages) {
      // 总页数较少，全部显示
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // 总页数较多，显示部分 + 省略号
      if (currentPage <= 3) {
        // 当前页靠前
        for (let i = 1; i <= 4; i++) {
          range.push(i);
        }
        range.push("...");
        range.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 当前页靠后
        range.push(1);
        range.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        // 当前页居中
        range.push(1);
        range.push("...");
        range.push(currentPage - 1);
        range.push(currentPage);
        range.push(currentPage + 1);
        range.push("...");
        range.push(totalPages);
      }
    }

    return range;
  };

  // ========== 渲染 ==========

  return (
    <section className="flex flex-col h-full p-8 pt-0">
      {/* 表格容器 */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
        {/* 表格内容（可滚动） */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  生成时间
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  用户手机号
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  客户端 IP
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  底层模型
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  审核状态
                </th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                // 加载中状态
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-8 border-4 border-[#0054db]/20 border-t-[#0054db] rounded-full animate-spin"></div>
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
                        暂无审计日志数据
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // 数据列表
                logs.map((log) => {
                  const isSelected = log.id === selectedId;
                  return (
                    <tr
                      key={log.id}
                      onClick={() => onRowClick(log)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected
                          ? "bg-slate-50 dark:bg-slate-800/30 ring-1 ring-[#0054db]/20 ring-inset"
                          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                        {formatTime(log.createdTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-semibold">
                        {log.userPhone}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {log.userIp}
                      </td>
                      <td className="px-6 py-4">{getModelBadge(log.modelName)}</td>
                      <td className="px-6 py-4">{getStatusBadge(log.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`material-symbols-outlined transition-colors ${
                            isSelected
                              ? "text-[#0054db]"
                              : "text-slate-400 group-hover:text-[#0054db]"
                          }`}
                        >
                          chevron_right
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页栏 */}
        {!loading && logs.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            {/* 左侧：数据统计 */}
            <div className="text-sm text-slate-600 dark:text-slate-400">
              共 <span className="font-semibold text-slate-900 dark:text-white">{total}</span>{" "}
              条记录，第{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              -{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {Math.min(currentPage * pageSize, total)}
              </span>{" "}
              条
            </div>

            {/* 右侧：分页按钮 */}
            <div className="flex items-center gap-2">
              {/* 上一页 */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>

              {/* 页码 */}
              {getPaginationRange().map((page, index) => {
                if (page === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-1.5 text-sm text-slate-400"
                    >
                      ...
                    </span>
                  );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#0054db] text-white"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* 下一页 */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </section>
  );
}

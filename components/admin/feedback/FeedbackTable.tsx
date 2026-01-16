/**
 * Spec: /docs/specs/admin-feedback-management.md
 * 
 * 反馈管理 - 反馈列表表格组件
 * 
 * Features:
 * - 表格展示反馈列表（用户信息、反馈类型、内容摘要、提交日期、操作按钮）
 * - 反馈类型徽章（投诉/举报/建议，不同颜色）
 * - 行 hover 效果
 * - 点击"处理"按钮触发处理弹窗
 * - 分页功能
 */

"use client";

import { FeedbackListItem, FeedbackTypeLabel, FeedbackTypeColor } from "@/types/admin";

interface FeedbackTableProps {
  feedbacks: FeedbackListItem[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onProcessClick: (feedback: FeedbackListItem) => void;
}

export default function FeedbackTable({
  feedbacks,
  total,
  page,
  pageSize,
  onPageChange,
  onProcessClick,
}: FeedbackTableProps) {
  // 计算分页信息
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);
  const hasNextPage = page * pageSize < total;
  const hasPrevPage = page > 1;

  // 格式化日期时间
  const formatDateTime = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(/\//g, "-");
  };

  // 获取用户头像首字母
  const getUserAvatar = (userName: string) => {
    if (!userName) return "?";
    // 提取中文首字或英文首字母
    const match = userName.match(/[\u4e00-\u9fa5]|[a-zA-Z]/);
    return match ? match[0].toUpperCase() : "?";
  };

  return (
    <section className="flex-1 px-8 pb-8 overflow-auto custom-scrollbar">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                用户
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                反馈类型
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                内容摘要
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                提交日期
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  暂无反馈数据
                </td>
              </tr>
            ) : (
              feedbacks.map((feedback) => (
                <tr
                  key={feedback.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* 用户信息 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs">
                        {getUserAvatar(feedback.userName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {feedback.userName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {feedback.userPhone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 反馈类型徽章 */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold ${
                        FeedbackTypeColor[feedback.type] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {FeedbackTypeLabel[feedback.type] || feedback.type}
                    </span>
                  </td>

                  {/* 内容摘要 */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1 max-w-md">
                      {feedback.content}
                    </p>
                  </td>

                  {/* 提交日期 */}
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {formatDateTime(feedback.createdTime)}
                  </td>

                  {/* 操作按钮 */}
                  <td className="px-6 py-4 text-center">
                    {feedback.status === 0 ? (
                      <button
                        onClick={() => onProcessClick(feedback)}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
                      >
                        处理
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">已处理</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 分页信息 */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            显示第 {startIndex} 到 {endIndex} 条，共 {total} 条反馈
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrevPage}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                hasPrevPage
                  ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              上一页
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNextPage}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                hasNextPage
                  ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

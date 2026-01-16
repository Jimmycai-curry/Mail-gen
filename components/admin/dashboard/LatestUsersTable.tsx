/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * 最新注册用户表格组件
 * 
 * Features:
 * - 显示最新注册的用户列表
 * - 表头：用户、注册时间、最后登录、状态
 * - 用户信息：首字母头像 + 姓名 + 邮箱
 * - 状态徽章：正常(绿色) / 已禁用(红色)
 * - hover 高亮行
 */

import type { LatestUser } from "@/types/admin";

interface LatestUsersTableProps {
  users: LatestUser[];  // 用户数据列表
}

export default function LatestUsersTable({ users }: LatestUsersTableProps) {
  return (
    <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* 顶部：标题 + 查看全部按钮 */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          最新注册用户
        </h2>
        <button className="text-[#0054db] text-sm font-medium hover:underline">
          查看全部
        </button>
      </div>

      {/* 表格区域 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* 表头 */}
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                用户
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                注册时间
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                最后登录
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                状态
              </th>
            </tr>
          </thead>

          {/* 表体 */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* 用户信息列 */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* 首字母头像 */}
                    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs">
                      {user.avatar}
                    </div>
                    {/* 姓名和邮箱 */}
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                {/* 注册时间列 */}
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {user.registeredAt}
                </td>

                {/* 最后登录列 */}
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  {user.lastLogin}
                </td>

                {/* 状态列 */}
                <td className="px-6 py-4 text-right">
                  {user.status === "normal" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      正常
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
                      已禁用
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

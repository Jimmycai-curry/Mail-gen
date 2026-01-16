/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * 最新注册用户表格组件（真实数据驱动）
 * 
 * Features:
 * - 显示最新注册的用户列表（基于数据库数据）
 * - 表头：用户、注册时间、最后登录、状态
 * - 用户信息：手机号前2位头像 + 完整手机号
 * - 状态徽章：正常(绿色) / 已封禁(红色)
 * - hover 高亮行
 */

import type { LatestUserData } from "@/types/admin";

interface LatestUsersTableProps {
  users: LatestUserData[];  // 用户数据列表（来自数据库）
}

/**
 * 根据手机号生成头像字符（取前2位数字）
 * @param phone - 手机号
 * @returns 头像显示字符
 */
function generateAvatar(phone: string): string {
  return phone.substring(0, 2)
}

/**
 * 格式化注册时间（标准格式）
 * @param date - 日期对象
 * @returns 格式化后的时间字符串，如 "2024-01-16 14:30"
 */
function formatRegisteredTime(date: Date): string {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

/**
 * 格式化最后登录时间（相对时间）
 * @param date - 日期对象或 null
 * @returns 相对时间字符串，如 "2 分钟前"、"昨天"、"从未登录"
 */
function formatLastLogin(date: Date | null): string {
  if (!date) {
    return '从未登录'
  }

  const now = new Date()
  const lastLogin = new Date(date)
  const diffMs = now.getTime() - lastLogin.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) {
    return '刚刚'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`
  } else if (diffHours < 24) {
    return `${diffHours} 小时前`
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays} 天前`
  } else {
    return formatRegisteredTime(lastLogin)
  }
}

export default function LatestUsersTable({ users }: LatestUsersTableProps) {
  return (
    <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* 顶部：标题 + 查看全部按钮 */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          最新注册用户
        </h2>
        <a 
          href="/admin/users" 
          className="text-[#0054db] text-sm font-medium hover:underline"
        >
          查看全部
        </a>
      </div>

      {/* 表格区域 */}
      <div className="overflow-x-auto">
        {users.length === 0 ? (
          // 无数据提示
          <div className="p-12 text-center text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-2">person_off</span>
            <p className="text-sm">暂无用户数据</p>
          </div>
        ) : (
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
                      {/* 手机号前2位头像 */}
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-xs">
                        {generateAvatar(user.phone)}
                      </div>
                      {/* 手机号 */}
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {user.phone}
                        </p>
                        <p className="text-xs text-slate-500">ID: {user.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>

                  {/* 注册时间列 */}
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {formatRegisteredTime(user.created_time)}
                  </td>

                  {/* 最后登录列 */}
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {formatLastLogin(user.last_login_time)}
                  </td>

                  {/* 状态列 */}
                  <td className="px-6 py-4 text-right">
                    {user.status === 1 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        正常
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
                        已封禁
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/**
 * Spec: /docs/specs/history-page.md
 *
 * Dashboard 根路由重定向
 * 访问 /dashboard 时自动重定向到 /dashboard/writing（撰写页面）
 */

import { redirect } from 'next/navigation';

/**
 * Dashboard 根路由重定向组件
 * 当用户访问 /dashboard 时，自动跳转到撰写页面
 */
export default function DashboardRootPage() {
  // 重定向到撰写页面
  redirect('/dashboard/writing');
}

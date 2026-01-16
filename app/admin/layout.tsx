/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * FluentWJ 管理后台专属布局组件
 * 
 * Features:
 * - 左侧固定侧边栏 (AdminSidebar)
 * - 顶部固定导航栏 (AdminHeader)
 * - 主内容区域左侧留出 256px 空间
 * - 响应式布局支持
 * - 登录页面不显示侧边栏和头部
 */

"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // 判断是否为登录页面或其他无需布局的页面
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/forgot-password";

  // 如果是认证页面，直接渲染子组件，不显示侧边栏和头部
  if (isAuthPage) {
    return <>{children}</>;
  }

  // 正常的管理后台布局
  return (
    <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-background-dark">
      {/* 左侧侧边栏 */}
      <AdminSidebar />

      {/* 主内容区域 */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* 顶部导航栏 */}
        <AdminHeader />

        {/* 页面内容 */}
        {children}
      </main>
    </div>
  );
}

/**
 * Spec: /docs/specs/dashboard-writing-page.md
 *
 * Dashboard 路由组布局
 * 为所有 dashboard 相关页面（writing、history 等）提供统一的布局结构
 * 包含左侧侧边栏、主内容区和底部 Footer
 */

"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { Footer } from "@/components/ui/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 获取当前路径，用于判断激活的导航项
  const pathname = usePathname();

  // 根据当前路径设置激活的导航项
  // history 页面激活 'history'，其他页面激活 'writing'
  const activeNav = pathname.includes('/history') ? 'history' : 'writing';

  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      {/* 左侧侧边栏：根据当前页面动态设置 activeNav */}
      <Sidebar activeNav={activeNav} />

      {/* 右侧主内容区 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 页面内容 */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* 底部 Footer */}
        <Footer />
      </main>
    </div>
  );
}

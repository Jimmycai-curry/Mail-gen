/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * FluentWJ 管理后台顶部栏组件
 * 
 * Features:
 * - 固定在顶部 (sticky, h-16)
 * - 左侧: 面包屑导航(支持多级)
 * - 白色背景 + 底部边框
 */

"use client";

import { usePathname } from "next/navigation";
import type { BreadcrumbItem } from "@/types/admin";

interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbItem[];  // 面包屑导航数据（可选）
}

export default function AdminHeader({ breadcrumbs }: AdminHeaderProps) {
  const pathname = usePathname();
  
  // 根据路由自动生成面包屑导航
  const getAutoBreadcrumbs = (): BreadcrumbItem[] => {
    const baseBreadcrumb = { label: "控制台" };
    
    if (pathname === "/admin/dashboard") {
      return [baseBreadcrumb, { label: "概览" }];
    } else if (pathname === "/admin/users") {
      return [baseBreadcrumb, { label: "用户管理" }];
    } else if (pathname === "/admin/audit") {
      return [baseBreadcrumb, { label: "审计日志" }];
    } else if (pathname === "/admin/feedback") {
      return [baseBreadcrumb, { label: "反馈管理" }];
    } else if (pathname === "/admin/operations") {
      return [baseBreadcrumb, { label: "操作日志" }];
    }
    
    return [baseBreadcrumb, { label: "概览" }];
  };

  // 使用传入的面包屑或自动生成
  const currentBreadcrumbs = breadcrumbs || getAutoBreadcrumbs();

  return (
    <header className="h-16 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* 左侧：面包屑导航 */}
      <div className="flex items-center gap-2">
        {currentBreadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-300">/</span>}
            {item.href ? (
              <a
                href={item.href}
                className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={
                  index === currentBreadcrumbs.length - 1
                    ? "text-slate-900 dark:text-white text-sm font-medium"
                    : "text-slate-400 text-sm"
                }
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}

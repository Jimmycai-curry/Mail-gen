/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * FluentWJ 管理后台顶部栏组件
 * 
 * Features:
 * - 固定在顶部 (sticky, h-16)
 * - 左侧: 面包屑导航(支持多级)
 * - 右侧: 搜索框、通知按钮(红点标记)、帮助按钮
 * - 白色背景 + 底部边框
 */

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { BreadcrumbItem } from "@/types/admin";

interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbItem[];  // 面包屑导航数据（可选）
}

export default function AdminHeader({ breadcrumbs }: AdminHeaderProps) {
  // 搜索框输入状态
  const [searchQuery, setSearchQuery] = useState("");
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

  /**
   * 处理搜索提交
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("搜索:", searchQuery);
      // TODO: 实现搜索功能
    }
  };

  /**
   * 处理通知点击
   */
  const handleNotificationClick = () => {
    console.log("打开通知面板");
    // TODO: 实现通知面板
  };

  /**
   * 处理帮助点击
   */
  const handleHelpClick = () => {
    console.log("打开帮助");
    // TODO: 实现帮助文档
  };

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

      {/* 右侧：搜索框 + 操作按钮 */}
      <div className="flex items-center gap-4">
        {/* 搜索框（响应式：移动端隐藏） */}
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            placeholder="搜索功能或数据..."
          />
        </form>

        {/* 通知按钮（带红点标记） */}
        <button
          onClick={handleNotificationClick}
          className="size-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          title="通知"
        >
          <span className="material-symbols-outlined">notifications</span>
          {/* 未读通知红点 */}
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
        </button>

        {/* 分隔线 */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

        {/* 帮助按钮 */}
        <button
          onClick={handleHelpClick}
          className="size-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="帮助"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
      </div>
    </header>
  );
}

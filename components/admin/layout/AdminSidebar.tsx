/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * FluentWJ 管理后台侧边栏组件
 * 
 * Features:
 * - 固定在左侧 (fixed, w-64, h-full)
 * - Logo 区域 + 品牌标识
 * - 5个导航菜单项(使用 Material Icons)
 * - 底部管理员信息卡片(头像、姓名、邮箱、登出按钮)
 * - 支持 active 状态高亮(左侧白色竖条 + 半透明背景)
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import type { NavItem } from "@/types/admin";

// 导航菜单配置
const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "概览",
    icon: "dashboard",
    href: "/admin/dashboard",
  },
  {
    id: "users",
    label: "用户管理",
    icon: "group",
    href: "/admin/users",
  },
  {
    id: "audit",
    label: "审计日志",
    icon: "manage_search",
    href: "/admin/audit",
  },
  {
    id: "feedback",
    label: "反馈管理",
    icon: "rate_review",
    href: "/admin/feedback",
  },
  {
    id: "operation-logs",
    label: "操作日志",
    icon: "history_edu",
    href: "/admin/operation-logs",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  /**
   * 处理登出操作
   * 调用后端接口清除 HttpOnly Cookie，然后跳转到管理员登录页
   */
  const handleLogout = async () => {
    try {
      // 调用后端登出接口清除 Cookie
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include', // 确保发送 Cookie
      });

      const result = await response.json();

      if (result.success) {
        console.log('[AdminLogout] 登出成功，跳转到管理员登录页');
        // 跳转到管理员登录页
        router.push('/admin/login');
      } else {
        console.error('[AdminLogout] 登出失败:', result.message);
        alert('登出失败，请重试');
      }
    } catch (error) {
      console.error('[AdminLogout] 登出请求失败:', error);
      // 即使请求失败，也跳转到登录页（容错处理）
      router.push('/admin/login');
    }
  };

  return (
    <aside className="w-64 bg-[#0054db] text-white flex flex-col fixed h-full z-50">
      {/* Logo 区域 */}
      <div className="p-6 flex items-center gap-3">
        <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white">
            keyboard_command_key
          </span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none tracking-tight">
            FluentWJ
          </h1>
          <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">
            Enterprise Console
          </p>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          // 判断当前菜单项是否处于激活状态
          const isActive = pathname === item.href;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-white/10 border-l-4 border-white"
                  : "hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* 底部管理员信息卡片 */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          {/* 管理员头像 */}
          <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
            AU
          </div>
          {/* 管理员信息 */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">Admin User</p>
            <p className="text-[10px] text-white/50 truncate">
              admin@fluentwj.com
            </p>
          </div>
          {/* 登出按钮 */}
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white transition-colors"
            title="登出"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

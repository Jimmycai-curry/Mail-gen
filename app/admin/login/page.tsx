/**
 * Spec: /docs/specs/login-backend.md (基于参考设计 fluentwj_admin_backend_login)
 * 
 * FluentWJ 管理后台登录页面
 * 
 * Features:
 * - 独立的管理后台登录入口
 * - 蓝色主题 (#0054db)
 * - 网格背景
 * - 居中卡片布局
 * - 仅支持密码登录
 */

import AdminLoginForm from "@/components/auth/AdminLoginForm";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden admin-grid-pattern bg-[#f5f6f8] dark:bg-[#0f1723]">
      {/* Logo 区域 */}
      <div className="mb-8 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0054db] text-white shadow-lg shadow-[#0054db]/20">
          <span className="material-symbols-outlined text-3xl">mail</span>
        </div>
      </div>

      {/* 登录表单 */}
      <AdminLoginForm />

      {/* 页脚审计信息 */}
      <footer className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500 tracking-wider">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4">
          <span>© 2026 FluentWJ 管理系统</span>
          <span className="hidden sm:inline">|</span>
          <span>仅限授权人员访问</span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">gavel</span>
            系统已开启全面审计
          </span>
        </div>
      </footer>
    </div>
  );
}

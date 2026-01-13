/**
 * Spec: /docs/specs/login-page.md
 * 
 * FluentWJ 登录页面
 * 包含 Logo、登录表单、Footer 和深色模式切换按钮
 */

"use client";

import { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  // 初始化主题（从 localStorage 读取）
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 切换深色模式
  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Logo 和标题 */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0052D9] text-white">
          {/* 使用 Material Symbols 的邮件图标 */}
          <span className="material-symbols-outlined text-2xl">mail</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0c0c1d] dark:text-white">
          FluentWJ
        </h1>
      </div>

      {/* 登录表单组件 */}
      <LoginForm />

      {/* Footer 版权信息 */}
      <footer className="mt-auto py-8 text-center text-xs text-gray-400 dark:text-gray-500 space-y-1">
        <p>© 2024 FluentWJ AI Writing Assistant. All rights reserved.</p>
        <div className="flex justify-center gap-4">
          <span>粤ICP备2023000000号-1</span>
          <span>AI 算法备案号: 44030000000000000001</span>
        </div>
      </footer>

      {/* 深色模式切换按钮（右上角） */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm dark:text-white transition-colors hover:scale-110 active:scale-95"
        aria-label="切换深色模式"
      >
        <span className="material-symbols-outlined text-[20px]">dark_mode</span>
      </button>
    </div>
  );
}

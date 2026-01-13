/**
 * Spec: /docs/specs/login-page.md
 * 
 * 认证页面专用布局
 * 提供简洁的居中布局，无侧边栏，适用于登录、注册等认证相关页面
 */

import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "登录 - FluentWJ",
  description: "FluentWJ 跨境商务写作助手 - 用户登录",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {/* 全屏容器，带深浅色背景 */}
      <div className="min-h-screen bg-[#f5f5f8] dark:bg-[#0f0f23] transition-colors duration-200">
        {children}
      </div>
    </ThemeProvider>
  );
}

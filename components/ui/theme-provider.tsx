"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * 主题提供者组件
 * 封装 next-themes 的 ThemeProvider，提供深色/浅色模式切换功能
 * 
 * @param children - 子组件
 * @param attribute - 用于切换主题的 HTML 属性（默认为 class）
 * @param defaultTheme - 默认主题（system 表示跟随系统）
 * @param enableSystem - 是否允许跟随系统主题
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}


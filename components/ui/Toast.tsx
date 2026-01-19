"use client";

import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

/**
 * Toast 类型
 */
export type ToastType = "success" | "error" | "info" | "warning";

/**
 * Toast 配置接口
 */
export interface ToastConfig {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Toast 容器组件
 * 用于显示所有 Toast 提示
 * 特性：
 * - 顶部居中显示（参考 fluentwj_toast 设计）
 * - 自动2秒后消失
 * - 优雅的淡入淡出动画
 * - 支持多个 Toast 堆叠显示
 * - 成功用绿色 ✓，失败用红色 ×
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  useEffect(() => {
    // 监听全局 toast 事件
    const handleToast = (event: CustomEvent<Omit<ToastConfig, "id">>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastConfig = {
        id,
        ...event.detail,
        duration: event.detail.duration || 2000, // 默认 2 秒
      };

      setToasts((prev) => [...prev, newToast]);

      // 自动移除
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    };

    window.addEventListener("show-toast" as any, handleToast);

    return () => {
      window.removeEventListener("show-toast" as any, handleToast);
    };
  }, []);

  /**
   * 移除指定的 Toast
   * @param id - Toast ID
   */
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

/**
 * 单个 Toast 组件
 * 设计参考：fluentwj_toast/screen.png
 * - 白色背景
 * - 圆形图标：成功用绿色 ✓，失败用红色 ×
 * - 简洁优雅的设计
 */
function ToastItem({
  toast,
  index,
  onClose,
}: {
  toast: ToastConfig;
  index: number;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 延迟显示，触发进入动画
    setTimeout(() => setIsVisible(true), 10);

    // 在消失前 500ms 开始淡出动画
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, (toast.duration || 2000) - 500);

    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, [toast.duration]);

  /**
   * 获取 Toast 样式配置
   * 参考设计图：绿色圆圈 ✓ 表示成功，红色圆圈 × 表示失败
   */
  const getToastStyle = () => {
    const styles = {
      success: {
        // 成功：绿色圆圈 + 白色勾号
        iconBgColor: "bg-green-500",
        iconColor: "text-white",
        icon: <Check className="w-4 h-4 stroke-[3]" />,
      },
      error: {
        // 失败：红色圆圈 + 白色叉号
        iconBgColor: "bg-red-500",
        iconColor: "text-white",
        icon: <X className="w-4 h-4 stroke-[3]" />,
      },
      info: {
        // 信息：蓝色圆圈
        iconBgColor: "bg-blue-500",
        iconColor: "text-white",
        icon: <Check className="w-4 h-4 stroke-[3]" />,
      },
      warning: {
        // 警告：橙色圆圈
        iconBgColor: "bg-orange-500",
        iconColor: "text-white",
        icon: <Check className="w-4 h-4 stroke-[3]" />,
      },
    };

    return styles[toast.type];
  };

  const style = getToastStyle();

  return (
    <div
      className={`transition-all ${
        isFadingOut
          ? "duration-500 opacity-0 translate-y-[-10px]"
          : "duration-300"
      } ${
        isVisible && !isFadingOut
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-[-10px]"
      }`}
    >
      {/* Toast 主体 - 参考设计图的简洁样式 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[200px] max-w-[400px] border border-gray-100 dark:border-gray-700">
        {/* 圆形图标 - 成功绿色 ✓，失败红色 × */}
        <div
          className={`flex-shrink-0 ${style.iconBgColor} ${style.iconColor} w-6 h-6 rounded-full flex items-center justify-center`}
        >
          {style.icon}
        </div>

        {/* 消息文本 */}
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {toast.message}
        </p>
      </div>
    </div>
  );
}

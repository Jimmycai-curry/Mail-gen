"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

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
 * - 屏幕中间显示
 * - 自动2秒后消失
 * - 点击外部提前关闭（渐隐动画）
 * - 支持多个 Toast 堆叠显示
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
    <>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}

/**
 * 单个 Toast 组件
 */
function ToastItem({
  toast,
  onClose,
}: {
  toast: ToastConfig;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 延迟显示，触发进入动画
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  /**
   * 处理点击外部关闭
   */
  const handleBackdropClick = () => {
    setIsVisible(false);
    // 等待动画结束后移除
    setTimeout(onClose, 300);
  };

  /**
   * 获取 Toast 样式配置
   */
  const getToastStyle = () => {
    const styles = {
      success: {
        bgColor: "bg-green-500",
        icon: <CheckCircle className="w-6 h-6" />,
      },
      error: {
        bgColor: "bg-red-500",
        icon: <XCircle className="w-6 h-6" />,
      },
      info: {
        bgColor: "bg-blue-500",
        icon: <Info className="w-6 h-6" />,
      },
      warning: {
        bgColor: "bg-yellow-500",
        icon: <AlertTriangle className="w-6 h-6" />,
      },
    };

    return styles[toast.type];
  };

  const style = getToastStyle();

  return (
    <>
      {/* 背景蒙层 - 点击关闭 */}
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
          isVisible ? "bg-black/20" : "bg-transparent pointer-events-none"
        }`}
        onClick={handleBackdropClick}
      />

      {/* Toast 主体 */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] transition-all duration-300 ${
          isVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className={`${style.bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] max-w-[400px]`}
        >
          {/* 图标 */}
          <div className="flex-shrink-0">{style.icon}</div>

          {/* 消息文本 */}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </div>
      </div>
    </>
  );
}

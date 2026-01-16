/**
 * Spec: /docs/specs/admin-user-management.md
 * 
 * 新增用户对话框组件
 * 
 * Features:
 * - Modal 对话框
 * - 表单字段：手机号、角色选择
 * - 表单验证（手机号格式、必填项）
 * - 提交后关闭并刷新列表
 */

"use client";

import { useState } from "react";

interface AddUserDialogProps {
  open: boolean;                  // 对话框是否打开
  onClose: () => void;            // 关闭对话框回调
  onSuccess: () => void;          // 创建成功回调
}

export default function AddUserDialog({
  open,
  onClose,
  onSuccess,
}: AddUserDialogProps) {
  // ========== 状态管理 ==========
  
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<number>(1); // 默认普通用户
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ========== 表单验证 ==========

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1\d{10}$/;
    return phoneRegex.test(phone);
  };

  // ========== 表单提交 ==========

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 验证手机号
    if (!phone.trim()) {
      setError("请输入手机号");
      return;
    }

    if (!validatePhone(phone)) {
      setError("手机号格式错误，必须是11位数字且以1开头");
      return;
    }

    // 提交表单
    setSubmitting(true);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone,
          role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "创建用户失败");
      }

      const data = await response.json();

      if (data.success) {
        // 成功：关闭对话框并刷新列表
        handleClose();
        onSuccess();
        alert(`用户 ${phone} 创建成功`);
      } else {
        setError(data.error || "创建用户失败");
      }
    } catch (error: any) {
      console.error("创建用户失败:", error);
      setError(error.message || "创建用户失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  // ========== 关闭对话框 ==========

  const handleClose = () => {
    // 重置表单
    setPhone("");
    setRole(1);
    setError("");
    setSubmitting(false);
    // 关闭对话框
    onClose();
  };

  // 如果对话框未打开，不渲染
  if (!open) return null;

  // ========== 渲染 ==========

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* 对话框容器（阻止事件冒泡） */}
        <div
          className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 对话框头部 */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              新增用户
            </h3>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* 对话框内容 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* 手机号输入框 */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                手机号 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => {
                  // 只允许输入数字
                  const value = e.target.value.replace(/[^\d]/g, '');
                  setPhone(value);
                }}
                className="block w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                placeholder="请输入11位手机号"
                maxLength={11}
                disabled={submitting}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            {/* 角色选择 */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                角色 <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(parseInt(e.target.value))}
                className="block w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                disabled={submitting}
              >
                <option value={1} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2">普通用户</option>
                <option value={0} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-2">管理员</option>
              </select>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 提示信息 */}
            <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-lg text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-slate-400 text-base mt-0.5">
                  info
                </span>
                <p>
                  新用户创建后，密码为空，首次登录时需通过验证码登录并设置密码。
                </p>
              </div>
            </div>

            {/* 按钮组 */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    创建中...
                  </>
                ) : (
                  "创建用户"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

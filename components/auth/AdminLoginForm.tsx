/**
 * Spec: /docs/specs/login-backend.md (基于参考设计 fluentwj_admin_backend_login)
 * 
 * FluentWJ 管理后台登录表单组件
 * 仅支持密码登录（不支持验证码登录）
 * 
 * Features:
 * - 账号（手机号）+ 密码登录
 * - 密码可见性切换
 * - 记住我功能
 * - 忘记密码链接
 */

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validatePhone, validatePassword } from "@/utils/validation";

// 管理后台登录表单数据接口
interface AdminLoginFormData {
  phone: string;
  password: string;
  rememberMe: boolean;
}

// 组件 Props 接口
interface AdminLoginFormProps {
  onSubmit?: (data: AdminLoginFormData) => void;
  isLoading?: boolean;
}

export default function AdminLoginForm({ onSubmit, isLoading = false }: AdminLoginFormProps) {
  const router = useRouter();
  
  // 表单数据状态
  const [formData, setFormData] = useState<AdminLoginFormData>({
    phone: '',
    password: '',
    rememberMe: false,
  });

  // 密码可见性状态
  const [showPassword, setShowPassword] = useState(false);

  /**
   * 提交表单
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // 1. 验证手机号
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      alert(phoneValidation.error);
      return;
    }
    
    // 2. 验证密码（管理员密码至少8位）
    if (formData.password.length < 8) {
      alert('管理员密码至少需要8位');
      return;
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.error);
      return;
    }
    
    // 3. 如果父组件提供了 onSubmit 回调，调用它
    if (onSubmit) {
      onSubmit(formData);
      return;
    }
    
    // 4. 默认行为：调用真实登录 API（传递 isAdmin: true）
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
          mode: 'password',
          isAdmin: true  // 标识为管理后台登录
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        alert(result.message || '登录失败');
        return;
      }
      
      // 存储 token 到 localStorage
      localStorage.setItem('auth_token', result.token);
      
      // 跳转到管理后台首页
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败，请稍后重试');
    }
  };

  return (
    <div className="w-full max-w-[440px] px-6">
      {/* 表单容器 */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2332] p-8 shadow-sm">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#0c121d] dark:text-white">
            管理后台系统
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            请使用管理员账号登录以确保访问安全
          </p>
        </div>

        {/* 登录表单 */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* 账号输入 */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#0c121d] dark:text-white">
              账号
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
                person
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  // 只允许输入数字，最多11位
                  const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                  setFormData({ ...formData, phone: value });
                }}
                placeholder="请输入管理员手机号"
                className="flex h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054db] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[#0c121d] dark:text-white"
              />
            </div>
          </div>

          {/* 密码输入 */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-[#0c121d] dark:text-white">
              密码
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[20px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="请输入密码"
                className="flex h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-10 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054db] focus-visible:ring-offset-2 pr-12 text-[#0c121d] dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* 选项行：记住我 + 忘记密码 */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-[#0054db] focus:ring-[#0054db]"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                记住我
              </span>
            </label>
            <a
              href="/admin/forgot-password"
              className="text-sm font-medium text-[#0054db] hover:underline underline-offset-4"
            >
              忘记密码？
            </a>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-[#0054db] px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-[#0054db]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054db] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full mt-2"
          >
            {isLoading ? '登录中...' : '安全登录'}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Spec: /docs/ui/fluentwj_login_page_(cn)_3/code.html
 *
 * FluentWJ 忘记密码表单组件
 * 支持通过手机验证码重置密码
 *
 * Features:
 * - 手机号输入与验证
 * - 验证码发送与倒计时(60秒)
 * - 新密码与确认密码输入
 * - 密码可见性切换
 * - 表单验证
 * - 模拟 API 调用(演示模式)
 */

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  validatePhone,
  validateCode,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validation";

// 表单数据接口
interface ForgotPasswordFormData {
  phone: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// 组件 Props 接口
interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordFormData) => void;
  isLoading?: boolean;
}

export default function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
}: ForgotPasswordFormProps) {
  const router = useRouter();

  // 表单数据状态
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    phone: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 验证码倒计时状态
  const [countdown, setCountdown] = useState(0);
  const [isGettingCode, setIsGettingCode] = useState(false);

  // 密码可见性状态
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 验证码倒计时效果
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsGettingCode(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  /**
   * 获取验证码
   */
  const handleGetCode = async () => {
    // 验证手机号
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      alert(phoneValidation.error);
      return;
    }

    setIsGettingCode(true);

    try {
      // 调用真实后端API发送验证码
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const result = await response.json();

      if (!result.success) {
        // 发送失败，显示错误信息
        alert(result.message || '验证码发送失败');
        setIsGettingCode(false);
        return;
      }

      // 发送成功，启动倒计时
      setCountdown(60);
      alert(result.message || '验证码已发送');
    } catch (error) {
      console.error('发送验证码失败:', error);
      alert('网络错误，请稍后重试');
      setIsGettingCode(false);
    }
  };

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

    // 2. 验证验证码
    const codeValidation = validateCode(formData.code);
    if (!codeValidation.isValid) {
      alert(codeValidation.error);
      return;
    }

    // 3. 验证新密码
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.error);
      return;
    }

    // 4. 验证确认密码
    const confirmPasswordValidation = validateConfirmPassword(
      formData.newPassword,
      formData.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      alert(confirmPasswordValidation.error);
      return;
    }

    // 5. 如果父组件提供了 onSubmit 回调,调用它
    if (onSubmit) {
      onSubmit(formData);
      return;
    }

    try {
      // 6. 调用真实后端API重置密码
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          code: formData.code,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        // 重置失败，显示错误信息
        alert(result.message || '密码重置失败');
        return;
      }

      // 7. 重置成功，提示并跳转到登录页
      alert(result.message || '密码重置成功');
      router.push("/login");
    } catch (error) {
      console.error('重置密码失败:', error);
      alert('网络错误，请稍后重试');
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      {/* 表单容器 */}
      <div className="rounded-lg bg-white dark:bg-[#0f0f23]/50 p-8 shadow-xl dark:border dark:border-white/10">
        {/* 标题 */}
        <h2 className="mb-8 text-center text-[28px] font-bold leading-tight text-[#0c0c1d] dark:text-white">
          找回密码
        </h2>

        {/* 找回密码表单 */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* 手机号输入 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-normal text-[#0c0c1d] dark:text-white/80">
              手机号
            </p>
            <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
              <span className="flex items-center justify-center pl-4 pr-2 text-[#4545a1] dark:text-white/60 font-medium text-sm">
                +86
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  // 只允许输入数字,最多11位
                  const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setFormData({ ...formData, phone: value });
                }}
                placeholder="请输入手机号"
                className="flex w-full min-w-0 flex-1 border-none bg-transparent h-12 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[12px] pl-2 text-sm font-normal focus:ring-0 focus:outline-none"
              />
              <div className="flex items-center justify-center pr-[12px] text-[#4545a1] dark:text-white/60">
                <span className="material-symbols-outlined text-xl">
                  smartphone
                </span>
              </div>
            </div>
          </div>

          {/* 验证码输入 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-normal text-[#0c0c1d] dark:text-white/80">
              验证码
            </p>
            <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
              <input
                type="text"
                value={formData.code}
                onChange={(e) => {
                  // 只允许输入数字,最多6位
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setFormData({ ...formData, code: value });
                }}
                placeholder="请输入验证码"
                className="flex w-full min-w-0 flex-1 border-none bg-transparent h-12 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[12px] text-sm font-normal focus:ring-0 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleGetCode}
                disabled={
                  countdown > 0 || !formData.phone || isLoading
                }
                className="flex items-center justify-center px-4 text-[#0052D9] font-medium text-sm hover:text-[#0052D9]/80 transition-colors whitespace-nowrap disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {countdown > 0
                  ? `${countdown}s 后重新获取`
                  : "获取验证码"}
              </button>
            </div>
          </div>

          {/* 新密码输入 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-normal text-[#0c0c1d] dark:text-white/80">
              设置新密码
            </p>
            <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="请输入新密码"
                className="flex w-full min-w-0 flex-1 border-none bg-transparent h-12 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[12px] text-sm font-normal focus:ring-0 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="flex items-center justify-center pr-[12px] text-[#4545a1] dark:text-white/60 cursor-pointer hover:text-[#0052D9] transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showNewPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* 确认新密码输入 */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-normal text-[#0c0c1d] dark:text-white/80">
              确认新密码
            </p>
            <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="请再次确认新密码"
                className="flex w-full min-w-0 flex-1 border-none bg-transparent h-12 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[12px] text-sm font-normal focus:ring-0 focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="flex items-center justify-center pr-[12px] text-[#4545a1] dark:text-white/60 cursor-pointer hover:text-[#0052D9] transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showConfirmPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          {/* 立即重置按钮 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg h-12 bg-[#0052D9] text-white text-base font-bold shadow-lg shadow-[#0052D9]/20 hover:bg-[#0052D9]/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "重置中..." : "立即重置"}
            </button>
          </div>

          {/* 返回登录链接 */}
          <div className="text-center pt-2">
            <a
              href="/login"
              className="text-sm text-[#4545a1] dark:text-white/60 hover:text-[#0052D9] dark:hover:text-[#0052D9] transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              返回登录
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

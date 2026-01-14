/**
 * Spec: /docs/specs/login-page.md
 * 
 * FluentWJ 登录表单组件
 * 支持验证码登录和密码登录两种模式
 * 
 * Features:
 * - Tab 切换（验证码/密码登录）
 * - 手机号格式校验
 * - 验证码倒计时（60秒）
 * - 密码可见性切换
 * - 协议勾选验证
 */

"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { 
  validatePhone, 
  validateCode, 
  validatePassword, 
  validateAgreement 
} from "@/utils/validation";

// 登录模式类型
type LoginMode = 'code' | 'password';

// 表单数据接口
interface LoginFormData {
  phone: string;
  code?: string;
  password?: string;
  agreed: boolean;
}

// 组件 Props 接口
interface LoginFormProps {
  onSubmit?: (data: LoginFormData, mode: LoginMode) => void;
  isLoading?: boolean;
}

export default function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const router = useRouter();
  
  // 登录模式状态（默认为验证码登录）
  const [loginMode, setLoginMode] = useState<LoginMode>('code');
  
  // 表单数据状态
  const [formData, setFormData] = useState<LoginFormData>({
    phone: '',
    code: '',
    password: '',
    agreed: false,
  });

  // 验证码倒计时状态
  const [countdown, setCountdown] = useState(0);
  const [isGettingCode, setIsGettingCode] = useState(false);

  // 密码可见性状态
  const [showPassword, setShowPassword] = useState(false);

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
   * 切换登录模式（验证码/密码）
   */
  const switchTab = (mode: LoginMode) => {
    setLoginMode(mode);
    // 保留手机号，清空验证码和密码
    setFormData((prev) => ({
      ...prev,
      code: '',
      password: '',
    }));
  };

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

    // TODO: 后续对接真实的短信验证码 API
    // try {
    //   await fetch('/api/auth/send-code', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ phone: formData.phone }),
    //   });
    // } catch (error) {
    //   console.error('发送验证码失败:', error);
    //   setIsGettingCode(false);
    //   return;
    // }

    // 模拟发送成功，启动倒计时
    setCountdown(60);
    alert('验证码已发送（演示模式）');
  };

  /**
   * 提交表单
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 1. 验证手机号
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      alert(phoneValidation.error);
      return;
    }

    // 2. 根据登录模式验证验证码或密码
    if (loginMode === 'code') {
      const codeValidation = validateCode(formData.code || '');
      if (!codeValidation.isValid) {
        alert(codeValidation.error);
        return;
      }
    } else {
      const passwordValidation = validatePassword(formData.password || '');
      if (!passwordValidation.isValid) {
        alert(passwordValidation.error);
        return;
      }
    }

    // 3. 验证协议勾选
    const agreementValidation = validateAgreement(formData.agreed);
    if (!agreementValidation.isValid) {
      alert(agreementValidation.error);
      return;
    }

    // 4. 如果父组件提供了 onSubmit 回调，调用它
    if (onSubmit) {
      onSubmit(formData, loginMode);
      return;
    }

    // 5. 默认行为：控制台输出并跳转到工作台（演示模式）
    console.log('登录信息:', { ...formData, mode: loginMode });
    alert('登录成功（演示模式）');
    
    // TODO: 后续对接真实登录 API，获取 token 并存储
    router.push('/dashboard/writing');
  };

  return (
    <div className="w-full max-w-[440px]">
      {/* 表单容器 */}
      <div className="rounded-xl bg-white dark:bg-[#0f0f23]/50 p-8 shadow-xl dark:border dark:border-white/10">
        {/* 标题 */}
        <h2 className="mb-8 text-center text-[28px] font-bold leading-tight text-[#0c0c1d] dark:text-white">
          登录 FluentWJ
        </h2>

        {/* Tab 切换 */}
        <div className="mb-8 flex border-b border-[#cdcdea] dark:border-white/10">
          <button
            type="button"
            onClick={() => switchTab('code')}
            className={`tab-btn relative flex-1 pb-3 text-sm font-medium transition-colors hover:text-[#0052D9] ${
              loginMode === 'code'
                ? 'text-[#0052D9] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0052D9]'
                : 'text-[#4545a1] dark:text-white/60'
            }`}
          >
            验证码登录
          </button>
          <button
            type="button"
            onClick={() => switchTab('password')}
            className={`tab-btn relative flex-1 pb-3 text-sm font-medium transition-colors hover:text-[#0052D9] ${
              loginMode === 'password'
                ? 'text-[#0052D9] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0052D9]'
                : 'text-[#4545a1] dark:text-white/60'
            }`}
          >
            密码登录
          </button>
        </div>

        {/* 登录表单 */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 手机号输入 */}
          <div className="flex flex-col gap-2">
            <p className="text-base font-medium leading-normal text-[#0c0c1d] dark:text-white">
              手机号
            </p>
            <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
              <span className="flex items-center justify-center pl-4 pr-2 text-[#4545a1] dark:text-white/60 font-medium">
                +86
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  // 只允许输入数字，最多11位
                  const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                  setFormData({ ...formData, phone: value });
                }}
                placeholder="请输入手机号"
                className="flex w-full min-w-0 flex-1 border-none bg-transparent h-14 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[15px] pl-2 text-base font-normal focus:ring-0 focus:outline-none"
              />
              <div className="flex items-center justify-center pr-[15px] text-[#4545a1] dark:text-white/60">
                <span className="material-symbols-outlined">smartphone</span>
              </div>
            </div>
          </div>

          {/* 验证码输入（验证码登录模式） */}
          {loginMode === 'code' && (
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium leading-normal text-[#0c0c1d] dark:text-white">
                验证码
              </p>
              <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => {
                    // 只允许输入数字，最多6位
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData({ ...formData, code: value });
                  }}
                  placeholder="请输入验证码"
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent h-14 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[15px] text-base font-normal focus:ring-0 focus:outline-none"
                />
                <div className="flex items-center justify-center pr-2">
                  <button
                    type="button"
                    onClick={handleGetCode}
                    disabled={countdown > 0 || !formData.phone || isLoading}
                    className="flex min-w-[100px] items-center justify-center rounded-lg h-9 px-3 border border-[#0052D9] bg-transparent text-[#0052D9] dark:text-[#0052D9] dark:border-[#0052D9]/80 text-sm font-bold hover:bg-[#0052D9] hover:text-white transition-all active:scale-95 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  >
                    {countdown > 0 ? `${countdown}s 后重新获取` : '获取验证码'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 密码输入（密码登录模式） */}
          {loginMode === 'password' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium leading-normal text-[#0c0c1d] dark:text-white">
                  密码
                </p>
                <a
                  href="/forgot-password"
                  className="text-sm text-[#0052D9] hover:underline"
                >
                  忘记密码？
                </a>
              </div>
              <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="请输入密码"
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent h-14 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[15px] text-base font-normal focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center pr-[15px] text-[#4545a1] dark:text-white/60 cursor-pointer hover:text-[#0052D9] transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 登录按钮 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg h-14 bg-[#0052D9] text-white text-base font-bold shadow-lg shadow-[#0052D9]/20 hover:bg-[#0052D9]/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </div>

          {/* 协议勾选 */}
          <div className="flex items-start gap-2 pt-2">
            <div className="flex h-5 items-center">
              <input
                type="checkbox"
                id="agreement"
                checked={formData.agreed}
                onChange={(e) =>
                  setFormData({ ...formData, agreed: e.target.checked })
                }
                className="h-4 w-4 rounded border-[#cdcdea] text-[#0052D9] focus:ring-[#0052D9] cursor-pointer"
              />
            </div>
            <label
              htmlFor="agreement"
              className="text-sm text-[#4545a1] dark:text-white/60 leading-tight cursor-pointer"
            >
              我已阅读并同意{' '}
              <a
                href="/terms"
                target="_blank"
                className="text-[#0052D9] hover:underline"
              >
                服务协议
              </a>{' '}
              和{' '}
              <a
                href="/privacy"
                target="_blank"
                className="text-[#0052D9] hover:underline"
              >
                隐私政策
              </a>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validatePassword, validateConfirmPassword } from "@/utils/validation";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.error);
      return;
    }

    const confirmValidation = validateConfirmPassword(password, confirmPassword);
    if (!confirmValidation.isValid) {
      alert(confirmValidation.error);
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 设置密码成功后，清除 localStorage（现在使用 Cookie 存储 token）
        localStorage.removeItem("auth_token");
        // 直接跳转到 dashboard，不需要重新登录
        router.push("/dashboard");
      } else {
        alert(result.message || "设置密码失败");
      }
    } catch (error) {
      console.error("设置密码失败:", error);
      alert("设置密码失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0052D9] text-white">
          <span className="material-symbols-outlined text-2xl">lock</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0c0c1d] dark:text-white">
          设置密码
        </h1>
      </div>

      <div className="w-full max-w-[440px]">
        <div className="rounded-xl bg-white dark:bg-[#0f0f23]/50 p-8 shadow-xl dark:border dark:border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium leading-normal text-[#0c0c1d] dark:text-white">
                新密码
              </p>
              <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入新密码（8-20位）"
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent h-14 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[15px] text-base font-normal focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center pr-[15px] text-[#4545a1] dark:text-white/60 cursor-pointer hover:text-[#0052D9] transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-base font-medium leading-normal text-[#0c0c1d] dark:text-white">
                确认密码
              </p>
              <div className="flex w-full items-stretch rounded-lg border border-[#cdcdea] dark:border-white/20 bg-[#f5f5f8] dark:bg-[#0f0f23]/30 focus-within:ring-2 focus-within:ring-[#0052D9]/20 focus-within:border-[#0052D9] transition-all">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  className="flex w-full min-w-0 flex-1 border-none bg-transparent h-14 placeholder:text-[#4545a1]/60 dark:placeholder:text-white/30 p-[15px] text-base font-normal focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="flex items-center justify-center pr-[15px] text-[#4545a1] dark:text-white/60 cursor-pointer hover:text-[#0052D9] transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg h-14 bg-[#0052D9] text-white text-base font-bold shadow-lg shadow-[#0052D9]/20 hover:bg-[#0052D9]/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "设置中..." : "设置密码"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

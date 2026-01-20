/**
 * Spec: /docs/ui/fluentwj_login_page_(cn)_3/code.html
 *
 * FluentWJ 忘记密码页面
 * 包含 Logo、忘记密码表单和 Footer
 */

import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "找回密码 - FluentWJ",
  description: "FluentWJ 跨境商务写作助手 - 找回密码",
};

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Logo 和标题 */}
      <div className="mb-8 flex items-center gap-2">
        <div className="flex items-center">
          {/* 使用 logo SVG 替代原来的图标，宽度设置为 40px 保持视觉效果 */}
          <img 
            src="/fluentWJ_logo_svg_without_character.svg" 
            alt="FluentWJ Logo" 
            className="w-[40px] h-auto"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0c0c1d] dark:text-white">
          FluentWJ
        </h1>
      </div>

      {/* 忘记密码表单组件 */}
      <ForgotPasswordForm />

      {/* Footer 版权信息 */}
      <footer className="mt-auto py-8 text-center text-xs text-gray-400 dark:text-gray-500 space-y-2">
        <p>© 2024 FluentWJ AI Writing Assistant. All rights reserved.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <span>粤ICP备2023000000号-1</span>
          <span>AI 算法备案号: 44030000000000000001</span>
        </div>
      </footer>
    </div>
  );
}

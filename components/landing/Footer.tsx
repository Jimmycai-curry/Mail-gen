// Spec: /docs/specs/landing-page.md
'use client';

/**
 * 页脚组件
 * 功能：展示合规信息、版权声明和相关链接
 */
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo区域 */}
          <div className="flex items-center gap-3">
            <div className="text-primary/70 flex items-center">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <span className="text-slate-900 dark:text-slate-100 font-bold tracking-tight">
              FluentWJ
            </span>
          </div>

          {/* 链接区域 */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <a
              className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('ICP 备案信息');
              }}
            >
              ICP 备案信息
            </a>
            <a
              className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('AI 算法备案登记');
              }}
            >
              AI 算法备案登记
            </a>
            <a
              className="text-slate-600 dark:text-slate-400 hover:text-primary text-sm font-medium transition-colors"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('隐私政策');
              }}
            >
              隐私政策
            </a>
          </div>
        </div>

        {/* 版权信息和图标 */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-8 md:flex-row">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © 2026 FluentWJ Enterprise. 版权所有。
          </p>
          <div className="mt-4 flex gap-6 md:mt-0">
            
          </div>
        </div>
      </div>
    </footer>
  );
}

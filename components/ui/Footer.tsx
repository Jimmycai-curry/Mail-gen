/**
 * Footer 组件
 * 工作台底部信息栏，包含版权、链接和备案号
 */
export function Footer() {
  return (
    <footer className="h-10 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 text-[10px] text-slate-400">
      {/* 左侧版权和链接 */}
      <div className="flex items-center gap-4">
        <span>© 2024 FluentWJ. All rights reserved.</span>
        <span className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800"></span>
        <a className="hover:text-primary transition-colors" href="#">隐私政策</a>
        <a className="hover:text-primary transition-colors" href="#">服务协议</a>
      </div>

      {/* 右侧备案信息 */}
      <div className="flex items-center gap-4">
        <span>ICP备案号：京ICP备2023000000号-1</span>
        <span>算法备案号：FluentWJ-LLM-2024-001</span>
      </div>
    </footer>
  );
}


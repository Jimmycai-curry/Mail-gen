// Spec: /docs/specs/landing-page.md
'use client';

import { useRouter } from 'next/navigation';
import { showComingSoonToast } from '@/utils/toast';

/**
 * 顶部导航栏组件
 * 功能：展示Logo、导航链接和登录按钮
 */
export default function Navbar() {
  // 路由跳转钩子
  const router = useRouter();

  // 处理登录按钮点击
  const handleLoginClick = () => {
    router.push('/login');
  };

  // 处理语言切换
  const handleLanguageChange = () => {
    alert('语言切换功能开发中，敬请期待');
  };

  // 处理导航链接点击
  const handleNavLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    showComingSoonToast();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 dark:backdrop-blur-md">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-4">
        <nav className="flex items-center justify-between whitespace-nowrap">
          {/* Logo区域 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {/* 使用 logo SVG 替代图标,宽度设置为 30px 保持与 text-3xl 相同大小 */}
              <img 
                src="/fluentWJ_logo_svg_without_character.svg" 
                alt="FluentWJ Logo" 
                className="w-[30px] h-auto"
              />
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              FluentWJ
            </h2>
          </div>

          {/* 导航链接 */}
          <div className="hidden md:flex flex-1 justify-center gap-10">
            {/* <a
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
              href="#"
              onClick={handleNavLinkClick}
            >
              产品特性
            </a>
            <a
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
              href="#"
              onClick={handleNavLinkClick}
            >
              行业解决方案
            </a>
            <a
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
              href="#"
              onClick={handleNavLinkClick}
            >
              价格方案
            </a> */}
          </div>

          {/* 登录按钮和语言切换 */}
          <div className="flex items-center gap-4">
            {/* 语言切换图标 */}
            {/* <span 
              className="material-symbols-outlined text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
              onClick={handleLanguageChange}
            >
              language
            </span> */}
            
            {/* 登录按钮 */}
            <button
              onClick={handleLoginClick}
              className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold tracking-wide hover:bg-primary/90 transition-all"
            >
              登录
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

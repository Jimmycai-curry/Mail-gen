"use client";

import { useState } from "react"; // 引入 useState 来管理收缩状态
import { Mail, PenSquare, History, ChevronLeft, ChevronRight, Heart, HeartOff } from "lucide-react"; // 新增 ChevronRight 图标

/**
 * Sidebar 组件
 * 侧边栏导航，包含 Logo、导航菜单和用户信息
 * 支持展开/收缩模式切换
 * 
 * @param activeNav - 当前激活的导航项
 */
interface SidebarProps {
  activeNav?: 'writing' | 'history';
}

export function Sidebar({ activeNav = 'writing' }: SidebarProps) {
  // 使用 state 来管理侧边栏是否处于收缩状态
  // false = 展开状态（显示文字），true = 收缩状态（只显示图标）
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 切换收缩状态的函数
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      // 动态设置宽度：展开时 256px (w-64)，收缩时 80px (w-20)
      // transition-all 添加平滑过渡动画
      // relative 为了让绝对定位的按钮相对于侧边栏定位
      className={`sidebar ${isCollapsed ? 'w-20' : 'w-64'} bg-background-light dark:bg-[#0d0d1c] text-gray-800 dark:text-white flex flex-col justify-between py-6 transition-all duration-300 relative`}
    >
      {/* Logo 区域 */}
      <div className="flex flex-col gap-8">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6 gap-3'}`}>
          {/* Logo 图标 */}
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Mail className="text-white" size={24} />
          </div>
          
          {/* Logo 文字 - 收缩时隐藏 */}
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <h1 className="text-lg font-bold leading-tight">FluentWJ</h1>
              <p className="text-slate-400 text-xs font-normal">AI Writing Assistant</p>
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <nav className="flex flex-col gap-1 overflow-hidden">
          {/* 撰写 - 激活状态 */}
          <a
            href="/dashboard/writing"
            className={`flex items-center border-r-4 whitespace-nowrap transition-colors ${
              // 根据收缩状态动态调整 padding 和 justify（居中对齐）
              isCollapsed ? 'justify-center px-0 py-3' : 'px-6 py-3 gap-3'
            } ${
              activeNav === 'writing'
                ? 'bg-white/10 border-white text-gray-800 dark:text-white'
                : 'text-slate-400 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <PenSquare size={20} />
            {/* 文字标签 - 收缩时隐藏 */}
            {!isCollapsed && <span className="text-sm font-medium">撰写</span>}
          </a>

          {/* 历史记录 */}
          <a
            href="/dashboard/history"
            className={`flex items-center border-r-4 whitespace-nowrap transition-colors ${
              // 根据收缩状态动态调整 padding 和 justify（居中对齐）
              isCollapsed ? 'justify-center px-0 py-3' : 'px-6 py-3 gap-3'
            } ${
              activeNav === 'history'
                ? 'bg-white/10 border-white text-gray-800 dark:text-white'
                : 'text-slate-400 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <History size={20} />
            {/* 文字标签 - 收缩时隐藏 */}
            {!isCollapsed && <span className="text-sm font-medium">历史记录</span>}
          </a>
        </nav>
      </div>

      {/* 底部区域：用户信息 */}
      <div className={`flex flex-col gap-3 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {/* 用户信息卡片 - 收缩时只显示头像 */}
        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 overflow-hidden">
          {/* 用户头像 */}
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20 shrink-0"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtomjlKAlPEzLdqqIEYZSFOMX_HIxMOjhyuSm72v0-CAZvtDAMTLXxj9FPEWQWLdweeh1wf7H0mpPqTZs7U6Oh7uLGtqlzQicd5uqlqpaPaQ9y6xAXweIyzsIdKCrYZEZAdZmMieV8eArCk_ZuIB30qdVXajfEcg0Qab8eawtX8wH4Ea8nqQVZsSyKV-JQBaOJxpkuatMnDEqMF6JAf-TIQWHYDXuxMKKHOxG3LJIl5e1RS_kGImuTSgmgnp0vgI3qExmbYTG6pUMI')`
            }}
          />

          {/* 用户信息 - 收缩时隐藏 */}
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <p className="text-sm font-medium truncate">企业管理员</p>
              <p className="text-xs text-slate-400 truncate">Pro Account</p>
            </div>
          )}
        </div>
      </div>

      {/* 收缩/展开按钮 - 绝对定位在右侧边缘中间 */}
      <button
        onClick={toggleCollapse}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 
          w-6 h-12 rounded-l-lg 
          bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10
          flex items-center justify-center 
          transition-all duration-300 
          text-slate-300 dark:text-gray-400 hover:text-white
          border-l border-white/10 dark:border-white/20
          group
        `}
        title={isCollapsed ? '展开侧边栏' : '收缩侧边栏'} // 鼠标悬停时的提示文字
      >
        {/* 根据状态显示不同的图标方向 */}
        <span className={`
          ${isCollapsed ? 'rotate-180' : 'rotate-0'} 
          transition-transform duration-300
        `}>
          <ChevronLeft size={16} />
        </span>
      </button>
    </aside>
  );
}


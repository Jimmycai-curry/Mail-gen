"use client";

import { Mail, PenSquare, History, ChevronLeft } from "lucide-react";

/**
 * Sidebar 组件
 * 侧边栏导航，包含 Logo、导航菜单和用户信息
 * 
 * @param activeNav - 当前激活的导航项
 */
interface SidebarProps {
  activeNav?: 'writing' | 'history';
}

export function Sidebar({ activeNav = 'writing' }: SidebarProps) {
  return (
    <aside className="sidebar w-64 bg-[#0d0d1c] text-white flex flex-col justify-between py-6 transition-all duration-300">
      {/* Logo 区域 */}
      <div className="flex flex-col gap-8">
        <div className="px-6 flex items-center gap-3">
          {/* Logo 图标 */}
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Mail className="text-white" size={24} />
          </div>
          
          {/* Logo 文字 */}
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <h1 className="text-lg font-bold leading-tight">FluentWJ</h1>
            <p className="text-slate-400 text-xs font-normal">AI Writing Assistant</p>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex flex-col gap-1 overflow-hidden">
          {/* 撰写 - 激活状态 */}
          <a
            href="/dashboard"
            className={`flex items-center gap-3 px-6 py-3 border-r-4 whitespace-nowrap ${
              activeNav === 'writing'
                ? 'bg-white/10 border-white text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent transition-colors'
            }`}
          >
            <PenSquare size={20} />
            <span className="text-sm font-medium">撰写</span>
          </a>

          {/* 历史记录 */}
          <a
            href="/dashboard/history"
            className={`flex items-center gap-3 px-6 py-3 border-r-4 whitespace-nowrap ${
              activeNav === 'history'
                ? 'bg-white/10 border-white text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent transition-colors'
            }`}
          >
            <History size={20} />
            <span className="text-sm font-medium">历史记录</span>
          </a>
        </nav>
      </div>

      {/* 用户信息卡片 */}
      <div className="px-4">
        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 overflow-hidden">
          {/* 用户头像 - 使用占位图片 */}
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20 shrink-0"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtomjlKAlPEzLdqqIEYZSFOMX_HIxMOjhyuSm72v0-CAZvtDAMTLXxj9FPEWQWLdweeh1wf7H0mpPqTZs7U6Oh7uLGtqlzQicd5uqlqpaPaQ9y6xAXweIyzsIdKCrYZEZAdZmMieV8eArCk_ZuIB30qdVXajfEcg0Qab8eawtX8wH4Ea8nqQVZsSyKV-JQBaOJxpkuatMnDEqMF6JAf-TIQWHYDXuxMKKHOxG3LJIl5e1RS_kGImuTSgmgnp0vgI3qExmbYTG6pUMI')`
            }}
          />

          {/* 用户信息 */}
          <div className="flex flex-col overflow-hidden whitespace-nowrap">
            <p className="text-sm font-medium truncate">企业管理员</p>
            <p className="text-xs text-slate-400 truncate">Pro Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


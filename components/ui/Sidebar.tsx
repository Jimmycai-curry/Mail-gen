"use client";

"use client";

import { useState, useEffect } from "react"; // 引入 useState 和 useEffect
import { useRouter } from "next/navigation"; // 引入 useRouter 用于页面跳转
import { Mail, PenSquare, History, ChevronLeft, ChevronRight, Heart, HeartOff, LogOut } from "lucide-react"; // 新增 LogOut 图标

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

// 用户信息接口
interface UserInfo {
  id: string;
  name?: string;
  avatar?: string;
  phone: string;
  role: number;
}

export function Sidebar({ activeNav = 'writing' }: SidebarProps) {
  const router = useRouter(); // 初始化路由器
  
  // 使用 state 来管理侧边栏是否处于收缩状态
  // false = 展开状态（显示文字），true = 收缩状态（只显示图标）
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // 管理登出确认弹窗的显示状态
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // 管理登出加载状态
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      // 调用 /api/auth/me 接口获取当前用户信息
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Sidebar] 获取到的用户数据:', data); // 调试：打印完整响应数据
        console.log('[Sidebar] 用户名:', data.user?.name); // 调试：打印用户名
        console.log('[Sidebar] 手机号:', data.user?.phone); // 调试：打印手机号
        // 设置用户信息
        setUserInfo(data.user);
      } else {
        console.error('[Sidebar] 获取用户信息失败');
      }
    } catch (error) {
      console.error('[Sidebar] 获取用户信息错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 切换收缩状态的函数
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 显示登出确认弹窗
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // 取消登出
  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // 确认登出
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // 调用后端登出接口清除 Cookie
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // 确保发送 Cookie
      });

      const result = await response.json();

      if (result.success) {
        console.log('[Logout] 登出成功，跳转到首页');
        // 跳转到 Landing Page
        router.push('/');
      } else {
        console.error('[Logout] 登出失败:', result.message);
        alert('登出失败，请重试');
        setIsLoggingOut(false);
        setShowLogoutConfirm(false);
      }
    } catch (error) {
      console.error('[Logout] 登出请求失败:', error);
      alert('登出失败，请重试');
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <aside 
      // 动态设置宽度：展开时 256px (w-64)，收缩时 80px (w-20)
      // transition-all 添加平滑过渡动画
      // relative 为了让绝对定位的按钮相对于侧边栏定位
      className={`sidebar ${isCollapsed ? 'w-20' : 'w-64'} bg-background-light dark:bg-[#0d0d1c] text-gray-800 dark:text-white flex flex-col justify-between py-6 transition-all duration-300 relative border-r border-gray-200 dark:border-gray-700`}
    >
      {/* Logo 区域 */}
      <div className="flex flex-col gap-8">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6 gap-3'}`}>
          {/* Logo 图标 */}
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <img src="/FluentWJ_logo.png" alt="FluentWJ Logo" className="w-8 h-8" />
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

      {/* 底部区域：用户信息 + 登出按钮 */}
      <div className={`flex flex-col gap-3 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {/* 用户信息卡片 - 收缩时只显示头像 */}
        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 overflow-hidden">
          {/* 用户头像 */}
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20 shrink-0"
            style={{
              backgroundImage: userInfo?.avatar 
                ? `url('${userInfo.avatar}')`
                : `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtomjlKAlPEzLdqqIEYZSFOMX_HIxMOjhyuSm72v0-CAZvtDAMTLXxj9FPEWQWLdweeh1wf7H0mpPqTZs7U6Oh7uLGtqlzQicd5uqlqpaPaQ9y6xAXweIyzsIdKCrYZEZAdZmMieV8eArCk_ZuIB30qdVXajfEcg0Qab8eawtX8wH4Ea8nqQVZsSyKV-JQBaOJxpkuatMnDEqMF6JAf-TIQWHYDXuxMKKHOxG3LJIl5e1RS_kGImuTSgmgnp0vgI3qExmbYTG6pUMI')`
            }}
          />

          {/* 用户信息 - 收缩时隐藏 */}
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              {/* 用户名：显示 name 字段，如果没有就不显示（不显示默认值） */}
              {userInfo?.name && (
                <p className="text-sm font-medium truncate">
                  {userInfo.name}
                </p>
              )}
              {/* 手机号：隐藏中间四位，例如 190****9907 */}
              <p className="text-xs text-slate-400 truncate">
                {userInfo?.phone ? `${userInfo.phone.substring(0, 3)}****${userInfo.phone.substring(7)}` : 'Pro Account'}
              </p>
            </div>
          )}
        </div>

        {/* 登出按钮 */}
        {isCollapsed ? (
          // 收缩状态：只显示图标按钮
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="flex items-center justify-center p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="登出"
          >
            <LogOut size={20} />
          </button>
        ) : (
          // 展开状态：完整按钮
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">
              {isLoggingOut ? '登出中...' : '登出'}
            </span>
          </button>
        )}
      </div>

      {/* 收缩/展开按钮 - 绝对定位在右侧边缘中间 */}
      <button
        onClick={toggleCollapse}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 
          w-6 h-12 rounded-l-lg 
          bg-blue-600 dark:bg-white/5 hover:bg-blue-700 dark:hover:bg-white/10
          flex items-center justify-center 
          transition-all duration-300 
          text-black dark:text-gray-400 hover:text-white
          border border-gray-200 dark:border-gray-700
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

      {/* 登出确认弹窗 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            {/* 弹窗标题 */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              确认退出登录
            </h3>
            
            {/* 弹窗内容 */}
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              您确定要退出登录吗？退出后需要重新登录才能访问。
            </p>
            
            {/* 按钮组 */}
            <div className="flex gap-3 justify-end">
              {/* 取消按钮 */}
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              
              {/* 确认按钮 */}
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? '退出中...' : '确认退出'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}


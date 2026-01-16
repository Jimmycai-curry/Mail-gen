/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * Admin Dashboard 相关的 TypeScript 类型定义
 */

// 统计卡片数据结构
export interface StatCardData {
  value: number | string;  // 统计值，如 "128,430" 或 "+1,240"
  change: string;          // 变化百分比，如 "+5.2%" 或 "-2.4%"
  trend: 'up' | 'down';    // 趋势方向：上升或下降
}

// Dashboard 统计数据汇总
export interface DashboardStats {
  totalUsers: StatCardData;    // 总用户量
  todayNew: StatCardData;      // 今日新增
  todayUsage: StatCardData;    // 今日生成量
  todayBlocked: StatCardData;  // 今日拦截
}

// 最新注册用户信息
export interface LatestUser {
  id: string;              // 用户 ID
  name: string;            // 用户姓名
  email: string;           // 用户邮箱
  avatar: string;          // 首字母缩写，如 "ZH"
  registeredAt: string;    // 注册时间，如 "2023-10-30 14:23"
  lastLogin: string;       // 最后登录时间，如 "2 分钟前"
  status: 'normal' | 'disabled';  // 用户状态：正常或已禁用
}

// 侧边栏导航菜单项
export interface NavItem {
  id: string;              // 菜单项唯一标识
  label: string;           // 菜单项文字（中文）
  icon: string;            // Material Icon 名称
  href: string;            // 跳转路径
  active?: boolean;        // 是否为当前激活状态
}

// 管理员信息
export interface AdminInfo {
  name: string;            // 管理员姓名
  email: string;           // 管理员邮箱
  avatar?: string;         // 头像 URL（可选）
}

// 面包屑导航项
export interface BreadcrumbItem {
  label: string;           // 导航项文字
  href?: string;           // 跳转路径（可选，最后一项通常无链接）
}

/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * Dashboard 统计卡片组件
 * 
 * Features:
 * - 白色卡片 + 圆角边框
 * - 左上角图标（带颜色背景）
 * - 右上角英文标题
 * - 中文标签 + 大数字统计值
 * - 底部趋势指示器（上升绿色 / 下降红色）
 */

interface StatsCardProps {
  icon: string;              // Material Icon 名称
  title: string;             // 英文标题，如 "Total Users"
  label: string;             // 中文标签，如 "总用户量"
  value: string | number;    // 统计值，如 "128,430" 或 "+1,240"
  change: string;            // 变化百分比，如 "较上月 +5.2%"
  trend: "up" | "down";      // 趋势方向：上升或下降
  variant?: "primary" | "rose"; // 颜色变体：主色(蓝色)或警告色(红色)
}

export default function StatsCard({
  icon,
  title,
  label,
  value,
  change,
  trend,
  variant = "primary",
}: StatsCardProps) {
  // 根据 variant 和 trend 确定样式
  const iconColorClass =
    variant === "rose"
      ? "text-rose-500 bg-rose-500/10"
      : "text-[#0054db] bg-[#0054db]/10";

  const trendColorClass =
    trend === "up" ? "text-emerald-600" : "text-rose-600";

  const trendIcon = trend === "up" ? "trending_up" : "trending_down";

  return (
    <div className="bg-white dark:bg-background-dark p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      {/* 顶部：图标 + 英文标题 */}
      <div className="flex justify-between items-start mb-4">
        {/* 左侧：图标 */}
        <span
          className={`material-symbols-outlined p-2 rounded-lg ${iconColorClass}`}
        >
          {icon}
        </span>
        {/* 右侧：英文标题 */}
        <span className="text-xs font-medium text-slate-400">{title}</span>
      </div>

      {/* 中文标签 */}
      <p className="text-slate-500 text-sm mb-1">{label}</p>

      {/* 统计值（大数字） */}
      <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </h3>

      {/* 底部：趋势指示器 */}
      <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trendColorClass}`}>
        <span className="material-symbols-outlined text-[14px]">
          {trendIcon}
        </span>
        <span>{change}</span>
      </div>
    </div>
  );
}

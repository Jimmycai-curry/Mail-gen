/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * 用户增长趋势图表组件
 * 
 * Features:
 * - 使用 SVG 绘制曲线图（完全还原设计稿）
 * - 渐变填充：#0054db 透明度 0.2 -> 0
 * - 水平网格线（虚线）
 * - 底部日期标签（10-01 ~ 10-30）
 * - 顶部卡片标题 + 操作按钮
 */

export default function UserGrowthChart() {
  return (
    <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* 顶部：标题 + 操作按钮 */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            近 30 天用户增长趋势
          </h2>
          <p className="text-sm text-slate-500">2023年10月数据表现概览</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            导出数据
          </button>
          <button className="px-3 py-1.5 text-xs font-medium bg-[#0054db] text-white rounded-md hover:bg-[#0054db]/90 transition-colors">
            详情报告
          </button>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="p-6">
        <div className="h-80 w-full relative">
          {/* SVG 曲线图 */}
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
          >
            {/* 定义渐变填充 */}
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0054db" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0054db" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 水平网格线（虚线） */}
            <line
              x1="0"
              y1="50"
              x2="1000"
              y2="50"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4"
              className="dark:stroke-slate-800"
            />
            <line
              x1="0"
              y1="150"
              x2="1000"
              y2="150"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4"
              className="dark:stroke-slate-800"
            />
            <line
              x1="0"
              y1="250"
              x2="1000"
              y2="250"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4"
              className="dark:stroke-slate-800"
            />

            {/* 渐变填充区域（曲线下方） */}
            <path
              d="M0,250 Q100,230 200,180 T400,150 T600,80 T800,100 T1000,40 V300 H0 Z"
              fill="url(#chartGradient)"
            />

            {/* 曲线路径 */}
            <path
              d="M0,250 Q100,230 200,180 T400,150 T600,80 T800,100 T1000,40"
              fill="none"
              stroke="#0054db"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* 底部日期标签 */}
          <div className="absolute bottom-[-10px] w-full flex justify-between px-2 text-[11px] text-slate-400 font-medium">
            <span>10-01</span>
            <span>10-05</span>
            <span>10-10</span>
            <span>10-15</span>
            <span>10-20</span>
            <span>10-25</span>
            <span>10-30</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * 用户增长趋势图表组件（真实数据驱动）
 * 
 * Features:
 * - 使用 SVG 绘制曲线图（完全还原设计稿）
 * - 根据真实数据动态生成曲线路径
 * - 渐变填充：#0054db 透明度 0.2 -> 0
 * - 水平网格线（虚线）
 * - 底部日期标签（动态生成）
 * - 顶部卡片标题 + 操作按钮
 */

import type { UserGrowthDataPoint } from '@/types/admin'

interface UserGrowthChartProps {
  data: UserGrowthDataPoint[];  // 用户增长趋势数据（30天）
}

/**
 * 将数据点转换为 SVG path 坐标
 * @param data - 用户增长数据点数组
 * @returns SVG path 字符串
 */
function generateSvgPath(data: UserGrowthDataPoint[]): { linePath: string; areaPath: string } {
  if (data.length === 0) {
    return { linePath: 'M0,250', areaPath: 'M0,250 V300 H0 Z' }
  }

  // 计算数据范围
  const maxCount = Math.max(...data.map(d => d.count), 1) // 避免除以0
  const dataPoints = data.length

  // 生成坐标点
  const points = data.map((point, index) => {
    const x = (index / (dataPoints - 1)) * 1000  // X轴：0-1000
    const y = 300 - (point.count / maxCount) * 250  // Y轴：50-300（留50px上边距）
    return { x, y }
  })

  // 生成曲线路径（使用线性连接，保持简洁）
  let linePath = `M${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    linePath += ` L${points[i].x},${points[i].y}`
  }

  // 生成填充区域路径（曲线 + 底边闭合）
  let areaPath = linePath + ` V300 H0 Z`

  return { linePath, areaPath }
}

/**
 * 格式化日期标签（MM-DD 格式）
 * @param dateStr - ISO 日期字符串
 * @returns 格式化后的日期，如 "01-15"
 */
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  // 生成 SVG 路径
  const { linePath, areaPath } = generateSvgPath(data)

  // 选择要显示的日期标签（均匀分布7个标签）
  const labelIndices = data.length > 0
    ? [0, Math.floor(data.length / 6), Math.floor(data.length / 3), Math.floor(data.length / 2), Math.floor(data.length * 2 / 3), Math.floor(data.length * 5 / 6), data.length - 1]
    : []
  
  const dateLabels = labelIndices.map(i => data[i] ? formatDateLabel(data[i].date) : '')

  // 计算当前年月（用于副标题）
  const currentYearMonth = data.length > 0 
    ? new Date(data[data.length - 1].date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
    : '暂无数据'
  return (
    <div className="bg-white dark:bg-background-dark rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* 顶部：标题 + 操作按钮 */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            近 {data.length} 天用户增长趋势
          </h2>
          <p className="text-sm text-slate-500">{currentYearMonth} 数据表现概览</p>
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
        {data.length === 0 ? (
          // 无数据提示
          <div className="h-80 w-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl mb-2">insert_chart</span>
              <p className="text-sm">暂无用户增长数据</p>
            </div>
          </div>
        ) : (
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
                d={areaPath}
                fill="url(#chartGradient)"
              />

              {/* 曲线路径 */}
              <path
                d={linePath}
                fill="none"
                stroke="#0054db"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            {/* 底部日期标签（动态生成） */}
            <div className="absolute bottom-[-10px] w-full flex justify-between px-2 text-[11px] text-slate-400 font-medium">
              {dateLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

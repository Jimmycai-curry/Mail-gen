/**
 * Spec: /docs/specs/admin-dashboard.md (待创建)
 * 
 * FluentWJ 管理后台 Dashboard 主页面（真实数据驱动）
 * 
 * Features:
 * - 4个统计卡片网格：总用户量、今日新增、今日生成量、今日拦截（从 API 获取真实数据）
 * - 用户增长趋势图表（30天数据，真实数据库查询）
 * - 最新注册用户表格（最新10条记录）
 * - 响应式网格布局
 * - Loading 和 Error 状态处理
 */

'use client'

import { useEffect, useState } from 'react'
import StatsCard from "@/components/admin/dashboard/StatsCard"
import UserGrowthChart from "@/components/admin/dashboard/UserGrowthChart"
import LatestUsersTable from "@/components/admin/dashboard/LatestUsersTable"
import type { DashboardResponse } from "@/types/admin"

/**
 * 格式化数字为千位分隔符格式
 * @param num - 数字
 * @returns 格式化后的字符串，如 "128,430"
 */
function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/**
 * 计算增长率并格式化为百分比字符串
 * @param current - 当前值
 * @param previous - 之前的值
 * @returns 格式化后的百分比，如 "+5.2%" 或 "-2.4%"
 */
function calculateGrowthRate(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? '+100.0%' : '0.0%'
  }
  const rate = ((current - previous) / previous) * 100
  const sign = rate >= 0 ? '+' : ''
  return `${sign}${rate.toFixed(1)}%`
}

export default function AdminDashboardPage() {
  // 状态管理
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)

  // 获取 Dashboard 数据
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // 调用 API
        // Token 通过 HttpOnly Cookie 自动发送，无需手动添加 Authorization 头
        const response = await fetch('/api/admin/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 确保发送 Cookie
        })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setError('权限不足，请重新登录')
            // 跳转到登录页
            window.location.href = '/admin/login'
            return
          }
          throw new Error(`API 请求失败: ${response.status}`)
        }

        const data: DashboardResponse = await response.json()
        setDashboardData(data)

      } catch (err) {
        console.error('[Dashboard] 获取数据失败:', err)
        setError(err instanceof Error ? err.message : '获取数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Loading 状态
  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0054db] mx-auto mb-4"></div>
            <p className="text-slate-500">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error 状态
  if (error || !dashboardData) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
            <p className="text-red-600 font-medium mb-2">数据加载失败</p>
            <p className="text-slate-500 text-sm">{error || '未知错误'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#0054db] text-white rounded-md hover:bg-[#0054db]/90"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 解构数据
  const { stats, growthTrend, latestUsers } = dashboardData

  // 计算统计卡片数据
  const totalUsersGrowth = calculateGrowthRate(stats.totalUsers, stats.lastMonthUsers)
  const todayNewGrowth = calculateGrowthRate(stats.todayNewUsers, stats.yesterdayNewUsers)
  const todayGenerationsGrowth = calculateGrowthRate(stats.todayGenerations, stats.yesterdayGenerations)
  const blockRateChange = stats.todayBlockRate - stats.yesterdayBlockRate

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* 统计卡片网格 (4列响应式布局) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 卡片1: 总用户量 */}
        <StatsCard
          icon="group"
          title="Total Users"
          label="总用户量"
          value={formatNumber(stats.totalUsers)}
          change={`较上月 ${totalUsersGrowth}`}
          trend={stats.totalUsers >= stats.lastMonthUsers ? 'up' : 'down'}
        />

        {/* 卡片2: 今日新增 */}
        <StatsCard
          icon="person_add"
          title="Today's Growth"
          label="今日新增"
          value={`+${formatNumber(stats.todayNewUsers)}`}
          change={`较昨日 ${todayNewGrowth}`}
          trend={stats.todayNewUsers >= stats.yesterdayNewUsers ? 'up' : 'down'}
        />

        {/* 卡片3: 今日生成量 */}
        <StatsCard
          icon="bolt"
          title="Usage"
          label="今日生成量"
          value={formatNumber(stats.todayGenerations)}
          change={`较昨日 ${todayGenerationsGrowth}`}
          trend={stats.todayGenerations >= stats.yesterdayGenerations ? 'up' : 'down'}
        />

        {/* 卡片4: 今日拦截 (使用 rose 变体) */}
        <StatsCard
          icon="block"
          title="Security"
          label="今日拦截"
          value={formatNumber(stats.todayBlocked)}
          change={`拦截率 ${blockRateChange >= 0 ? '+' : ''}${blockRateChange.toFixed(1)}%`}
          trend={blockRateChange <= 0 ? 'down' : 'up'}
          variant="rose"
        />
      </div>

      {/* 用户增长趋势图表（传入真实数据） */}
      <UserGrowthChart data={growthTrend} />

      {/* 最新注册用户表格（传入真实数据） */}
      <LatestUsersTable users={latestUsers} />
    </div>
  )
}

/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * FluentWJ 管理后台 Dashboard 主页面
 * 
 * Features:
 * - 4个统计卡片网格：总用户量、今日新增、今日生成量、今日拦截
 * - 用户增长趋势图表（30天数据）
 * - 最新注册用户表格（4行数据）
 * - 响应式网格布局
 */

import StatsCard from "@/components/admin/dashboard/StatsCard";
import UserGrowthChart from "@/components/admin/dashboard/UserGrowthChart";
import LatestUsersTable from "@/components/admin/dashboard/LatestUsersTable";
import type { LatestUser } from "@/types/admin";

export default function AdminDashboardPage() {
  // 模拟数据：最新注册用户列表
  const mockLatestUsers: LatestUser[] = [
    {
      id: "1",
      name: "张伟",
      email: "zhangwei@example.com",
      avatar: "ZH",
      registeredAt: "2023-10-30 14:23",
      lastLogin: "2 分钟前",
      status: "normal",
    },
    {
      id: "2",
      name: "李明",
      email: "liming@example.com",
      avatar: "LM",
      registeredAt: "2023-10-30 12:11",
      lastLogin: "1 小时前",
      status: "normal",
    },
    {
      id: "3",
      name: "王芳",
      email: "wangfang@example.com",
      avatar: "WF",
      registeredAt: "2023-10-30 09:45",
      lastLogin: "5 小时前",
      status: "disabled",
    },
    {
      id: "4",
      name: "陈浩",
      email: "chenhao@example.com",
      avatar: "CH",
      registeredAt: "2023-10-29 23:30",
      lastLogin: "昨天",
      status: "normal",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* 统计卡片网格 (4列响应式布局) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 卡片1: 总用户量 */}
        <StatsCard
          icon="group"
          title="Total Users"
          label="总用户量"
          value="128,430"
          change="较上月 +5.2%"
          trend="up"
        />

        {/* 卡片2: 今日新增 */}
        <StatsCard
          icon="person_add"
          title="Today's Growth"
          label="今日新增"
          value="+1,240"
          change="较昨日 +12.5%"
          trend="up"
        />

        {/* 卡片3: 今日生成量 */}
        <StatsCard
          icon="bolt"
          title="Usage"
          label="今日生成量"
          value="85,020"
          change="较昨日 +8.1%"
          trend="up"
        />

        {/* 卡片4: 今日拦截 (使用 rose 变体) */}
        <StatsCard
          icon="block"
          title="Security"
          label="今日拦截"
          value="12"
          change="拦截率降低 2.4%"
          trend="down"
          variant="rose"
        />
      </div>

      {/* 用户增长趋势图表 */}
      <UserGrowthChart />

      {/* 最新注册用户表格 */}
      <LatestUsersTable users={mockLatestUsers} />
    </div>
  );
}

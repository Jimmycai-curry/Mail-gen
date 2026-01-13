import { Sidebar } from "@/components/ui/Sidebar";
import { Footer } from "@/components/ui/Footer";

/**
 * Dashboard 布局组件
 * 提供 Sidebar、主内容区和 Footer 的布局结构
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      {/* 左侧侧边栏 */}
      <Sidebar activeNav="writing" />

      {/* 右侧主内容区 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 页面内容 */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* 底部 Footer */}
        <Footer />
      </main>
    </div>
  );
}


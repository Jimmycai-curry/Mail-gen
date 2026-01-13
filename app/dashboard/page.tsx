import { WritingForm } from "@/components/writing/WritingForm";
import { ResultViewer } from "@/components/writing/ResultViewer";

/**
 * 撰写页面
 * 工作台首页，左侧是撰写表单，右侧是结果展示
 */
export default function DashboardPage() {
  return (
    <main className="flex-1 flex overflow-hidden">
      {/* 左侧表单区域 - 40% 宽度 */}
      <section className="w-40-percent overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8">
        <div className="max-w-xl mx-auto">
          <WritingForm />
        </div>
      </section>

      {/* 右侧结果展示区 - 60% 宽度 */}
      <section className="w-60-percent bg-background-light dark:bg-background-dark p-8 flex flex-col">
        <ResultViewer />
      </section>
    </main>
  );
}


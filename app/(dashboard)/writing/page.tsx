/**
 * Spec: /docs/specs/dashboard-writing-page.md
 * 
 * 撰写页面
 * 商务写作助手的核心页面，左侧为撰写表单，右侧为结果展示区
 */

import { WritingForm } from "@/components/writing/WritingForm";
import { ResultViewer } from "@/components/writing/ResultViewer";

export default function WritingPage() {
  return (
    <div className="flex gap-6 h-full p-6">
      {/* 左侧：撰写表单 - 占 4 份 */}
      <div className="basis-[40%] flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full">
          <WritingForm />
        </div>
      </div>

      {/* 右侧：结果展示区 - 占 6 份 */}
      <div className="basis-[60%] min-w-0">
        <ResultViewer />
      </div>
    </div>
  );
}


/**
 * Spec: /docs/specs/dashboard-writing-page.md
 * 
 * 撰写页面
 * 商务写作助手的核心页面，左侧为撰写表单，右侧为结果展示区
 */

"use client";

import { useState } from "react";
import { WritingForm } from "@/components/writing/WritingForm";
import { ResultViewer } from "@/components/writing/ResultViewer";

export default function WritingPage() {
  // 状态管理
  const [content, setContent] = useState("");         // 生成的内容
  const [isLoading, setIsLoading] = useState(false);  // 是否正在加载
  const [error, setError] = useState<string | null>(null); // 错误信息
  const [auditLogId, setAuditLogId] = useState<string | undefined>(); // 审计日志 ID（用于反馈提交）

  /**
   * 开始生成的回调
   */
  const handleGenerateStart = () => {
    setIsLoading(true);
    setError(null);
    console.log('[WritingPage] 开始生成...');
  };

  /**
   * 生成成功的回调
   * 
   * @param generatedContent - 生成的内容
   * @param logId - 审计日志 ID
   */
  const handleGenerateSuccess = (generatedContent: string, logId: string) => {
    setContent(generatedContent);
    setAuditLogId(logId);
    setIsLoading(false);
    setError(null);
    console.log('[WritingPage] 生成成功', { auditLogId: logId });
  };

  /**
   * 生成失败的回调
   */
  const handleGenerateError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    console.error('[WritingPage] 生成失败:', errorMessage);
    
    // TODO: 使用 toast 显示错误
    alert(errorMessage);
  };

  return (
    <div className="flex gap-6 h-full p-6">
      {/* 左侧：撰写表单 - 占 4 份 */}
      <div className="basis-[40%] shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 h-full">
          <WritingForm 
            onGenerateStart={handleGenerateStart}
            onGenerateSuccess={handleGenerateSuccess}
            onGenerateError={handleGenerateError}
          />
        </div>
      </div>

      {/* 右侧：结果展示区 - 占 6 份 */}
      <div className="basis-[60%] min-w-0">
        <ResultViewer 
          content={content}
          isLoading={isLoading}
          isEmpty={!content && !isLoading}
          auditLogId={auditLogId}
        />
      </div>
    </div>
  );
}


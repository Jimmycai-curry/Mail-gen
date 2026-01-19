"use client";

import { useState } from "react";
import { Zap, Loader2, X } from "lucide-react";
import type { GenerateRequestBody, GenerateSuccessResponse, GenerateErrorResponse } from "@/types/ai";

/**
 * WritingForm Props 接口
 */
interface WritingFormProps {
  onGenerateStart?: () => void;                           // 开始生成的回调
  onGenerateSuccess?: (content: string) => void;          // 生成成功的回调
  onGenerateError?: (error: string) => void;              // 生成失败的回调
}

/**
 * WritingForm 组件
 * 撰写表单，包含业务场景、语气选择、收件人信息和核心要点
 */
export function WritingForm({ onGenerateStart, onGenerateSuccess, onGenerateError }: WritingFormProps) {
  // 表单状态管理
  const [scenario, setScenario] = useState("");
  const [language, setLanguage] = useState("zh-CN"); // 新增：语言选择
  const [tone, setTone] = useState("formal");
  const [recipientName, setRecipientName] = useState("");
  const [recipientRole, setRecipientRole] = useState("");
  const [keyPoints, setKeyPoints] = useState("");

  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // 语气选项
  const tones = [
    { id: "formal", label: "正式" },
    { id: "friendly", label: "友好" },
    { id: "urgent", label: "紧急" },
    { id: "humorous", label: "幽默" },
  ];

  // 业务场景选项
  const scenarios = [
    { value: "", label: "请选择业务场景" },
    { value: "email", label: "商务邮件" },
    { value: "report", label: "工作汇报" },
    { value: "proposal", label: "项目提案" },
    { value: "notice", label: "正式公告" },
  ];

  // 语言选项
  const languages = [
    { value: "zh-CN", label: "中文" },
    { value: "en-US", label: "English" },
    { value: "zh-TW", label: "繁體中文" },
    { value: "ja-JP", label: "日本語" },
    { value: "ko-KR", label: "한국어" },
  ];

  /**
   * 取消生成
   */
  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsGenerating(false);
      console.log('[WritingForm] 用户取消生成');
    }
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!scenario) {
      onGenerateError?.('请选择业务场景');
      return;
    }

    if (!recipientName.trim()) {
      onGenerateError?.('请输入收件人姓名');
      return;
    }

    if (!recipientRole.trim()) {
      onGenerateError?.('请输入收件人身份');
      return;
    }

    if (!keyPoints.trim()) {
      onGenerateError?.('请输入核心要点');
      return;
    }

    console.log('[WritingForm] 开始生成...', {
      scenario,
      tone,
      language,
      recipientName,
      recipientRole,
      keyPoints: keyPoints.substring(0, 50) + '...'
    });

    // 创建 AbortController（用于取消）
    const controller = new AbortController();
    setAbortController(controller);
    setIsGenerating(true);
    onGenerateStart?.();

    try {
      // 构建请求体
      const requestBody: GenerateRequestBody = {
        scenario,
        tone,
        language,
        recipientName: recipientName.trim(),
        recipientRole: recipientRole.trim(),
        keyPoints: keyPoints.trim()
      };

      // 调用 API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      const data = await response.json() as GenerateSuccessResponse | GenerateErrorResponse;

      // 检查响应
      if (!response.ok || !data.success) {
        const errorData = data as GenerateErrorResponse;
        console.error('[WritingForm] 生成失败:', errorData.error);
        
        // 根据错误码处理
        if (errorData.error.code === 'AUTH_EXPIRED') {
          // 跳转到登录页
          window.location.href = '/login';
          return;
        }
        
        onGenerateError?.(errorData.error.message);
        return;
      }

      const successData = data as GenerateSuccessResponse;
      console.log('[WritingForm] 生成成功', {
        auditLogId: successData.data.auditLogId,
        contentLength: successData.data.content.length
      });

      // 回调成功
      onGenerateSuccess?.(successData.data.content);

    } catch (error: any) {
      // 处理取消
      if (error.name === 'AbortError') {
        console.log('[WritingForm] 请求已取消');
        onGenerateError?.('生成已取消');
        return;
      }

      // 处理网络错误
      console.error('[WritingForm] 请求失败:', error);
      onGenerateError?.('网络请求失败，请检查连接后重试');

    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 页面标题 */}
      <header>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">撰写需求</h2>
        <p className="text-slate-500 text-sm mt-1">
          请填写以下信息，AI 将为您生成专业的商务内容
        </p>
      </header>

      {/* 业务场景和语言选择 - 并排布局，各占一半 */}
      <div className="flex gap-4">
        {/* 业务场景 */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            业务场景
          </label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none px-4"
          >
            {scenarios.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* 语言选择 */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            语言
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none px-4"
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 语气选择 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          语气选择
        </label>
        <div className="flex gap-3 flex-wrap">
          {tones.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTone(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tone === item.id
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 收件人姓名 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          收件人姓名
        </label>
        <input
          type="text"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="输入收件人姓名"
          className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none px-4"
        />
      </div>

      {/* 收件人身份 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          收件人身份
        </label>
        <input
          type="text"
          value={recipientRole}
          onChange={(e) => setRecipientRole(e.target.value)}
          placeholder="输入收件人职位或身份（如：销售总监、技术合作伙伴）"
          className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none px-4"
        />
      </div>

      {/* 核心要点 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          核心要点
        </label>
        <textarea
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          placeholder="请简述您想表达的核心内容，多个要点请分行输入..."
          rows={6}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none p-4 resize-none"
        />
      </div>

      {/* 立即生成按钮 / 取消按钮 */}
      {!isGenerating ? (
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={20} />
          立即生成内容
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          {/* 加载提示 */}
          <div className="w-full h-12 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg flex items-center justify-center gap-3">
            <Loader2 size={20} className="animate-spin" />
            <span>AI 正在为您生成专业内容，预计需要 10-30 秒...</span>
          </div>
          
          {/* 取消按钮 */}
          <button
            type="button"
            onClick={handleCancel}
            className="w-full h-10 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <X size={16} />
            取消生成
          </button>
        </div>
      )}
    </form>
  );
}


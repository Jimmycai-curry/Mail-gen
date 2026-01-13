"use client";

import { useState } from "react";
import { Zap } from "lucide-react";

/**
 * WritingForm 组件
 * 撰写表单，包含业务场景、语气选择、收件人信息和核心要点
 */
export function WritingForm() {
  // 表单状态管理
  const [scenario, setScenario] = useState("");
  const [language, setLanguage] = useState("zh-CN"); // 新增：语言选择
  const [tone, setTone] = useState("formal");
  const [recipientName, setRecipientName] = useState("");
  const [recipientRole, setRecipientRole] = useState("");
  const [keyPoints, setKeyPoints] = useState("");

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

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("表单数据：", {
      scenario,
      tone,
      recipientName,
      recipientRole,
      keyPoints,
    });
    // TODO: 后续调用 API 生成内容
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
          收件人姓名
        </label>
        <input
          type="text"
          value={recipientRole}
          onChange={(e) => setRecipientRole(e.target.value)}
          placeholder="输入收件人姓名"
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

      {/* 立即生成按钮 */}
      <button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-4"
      >
        <Zap size={20} />
        立即生成内容
      </button>
    </form>
  );
}


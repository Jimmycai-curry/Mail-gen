/**
 * Spec: /docs/specs/admin-audit-logs.md
 * 
 * 审计日志详情面板组件
 * 
 * Features:
 * - 固定定位（absolute right-0 inset-y-0）
 * - 三个内容区块：
 *   1. 用户原始输入（带"PROMPT"标签）
 *   2. AI 生成结果（带"OUTPUT"标签 + 绿色左边框）
 *   3. 安全元数据（IP归属地、敏感词命中、内容合规分、审核接口ID）
 * - 底部操作按钮（仅 UI，不调用 API）：
 *   - "加入白名单" 按钮（白色）
 *   - "标记违规" 按钮（红色）
 * - 关闭按钮（右上角 X 图标）
 * - 滑入/滑出动画
 */

"use client";

import { useEffect, useState } from "react";
import type { AuditLogDetail } from "@/types/admin";

interface AuditLogDetailPanelProps {
  log: AuditLogDetail;
  loading: boolean;
  onClose: () => void;
}

export default function AuditLogDetailPanel({
  log,
  loading,
  onClose,
}: AuditLogDetailPanelProps) {
  // ========== 动画状态 ==========
  
  // 控制滑入动画
  const [isVisible, setIsVisible] = useState(false);

  // 组件挂载后触发滑入动画
  useEffect(() => {
    setIsVisible(true);
  }, []);

  /**
   * 处理关闭（先触发滑出动画，再调用 onClose）
   */
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // 与动画时长一致
  };

  /**
   * 处理审核通过操作（真实业务逻辑）
   */
  const handleMarkPassed = async () => {
    if (!confirm(`确定要将此审计日志标记为通过吗？\n\n日志ID: ${log.id}\n用户手机号: ${log.userPhone}`)) {
      return;
    }

    try {
      // 调用标记通过 API
      // Token 通过 HttpOnly Cookie 自动发送，无需手动添加 Authorization 头
      const response = await fetch(`/api/admin/audit-logs/${log.id}/mark-passed`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保发送 Cookie
      });

      const result = await response.json();

      if (response.ok && result.code === 200) {
        alert("标记通过成功！");
        onClose(); // 关闭详情面板
        window.location.reload(); // 刷新页面显示最新状态
      } else {
        alert(`标记失败: ${result.error || '未知错误'}`);
      }
    } catch (error: any) {
      console.error("[AuditLogDetail] 标记通过失败:", error);
      alert(`标记失败: ${error.message}`);
    }
  };

  /**
   * 处理标记违规操作（真实业务逻辑）
   */
  const handleMarkViolation = async () => {
    if (!confirm(`确定要将此审计日志标记为违规吗？\n\n日志ID: ${log.id}\n用户手机号: ${log.userPhone}`)) {
      return;
    }

    try {
      // 调用标记违规 API
      // Token 通过 HttpOnly Cookie 自动发送，无需手动添加 Authorization 头
      const response = await fetch(`/api/admin/audit-logs/${log.id}/mark-violation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保发送 Cookie
      });

      const result = await response.json();

      if (response.ok && result.code === 200) {
        alert("标记违规成功！");
        onClose(); // 关闭详情面板
        window.location.reload(); // 刷新页面显示最新状态
      } else {
        alert(`标记失败: ${result.error || '未知错误'}`);
      }
    } catch (error: any) {
      console.error("[AuditLogDetail] 标记违规失败:", error);
      alert(`标记失败: ${error.message}`);
    }
  };

  // ========== 渲染 ==========

  return (
    <>
      {/* 半透明背景遮罩 */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>

      {/* 详情面板 */}
      <div
        className={`fixed inset-y-0 right-0 w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-50 transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 头部 */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              记录详情
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              ID: {log.id}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-500">
              close
            </span>
          </button>
        </div>

        {/* 内容区（可滚动） */}
        {loading ? (
          // 加载中状态
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-8 border-4 border-[#0054db]/20 border-t-[#0054db] rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                加载中...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* 1. 用户原始输入 */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0054db] text-[18px]">
                      chat_bubble
                    </span>
                    用户原始输入
                  </h4>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">
                    Prompt
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {log.inputPrompt}
                  </p>
                </div>
              </section>

              {/* 2. AI 生成结果 */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500 text-[18px]">
                      smart_toy
                    </span>
                    AI 生成结果
                  </h4>
                  <span className="text-[10px] bg-green-500/10 dark:bg-green-500/20 px-2 py-0.5 rounded text-green-600 font-bold uppercase">
                    Output
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 border-l-4 border-l-green-500">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {log.outputContent}
                  </p>
                </div>
              </section>

              {/* 3. 安全元数据 */}
              <section>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-500 text-[18px]">
                    security
                  </span>
                  安全元数据
                </h4>
                <div className="space-y-3">
                  {/* IP地址 */}
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500">IP地址</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {log.userIp || "-"}
                    </span>
                  </div>

                  {/* 敏感词命中 */}
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500">敏感词命中</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        log.isSensitive
                          ? "text-red-600 bg-red-500/10"
                          : "text-green-600 bg-green-500/10"
                      }`}
                    >
                      {log.isSensitive ? "命中" : "无"}
                    </span>
                  </div>

                  {/* 用户手机号 */}
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500">用户手机号</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {log.userPhone || "-"}
                    </span>
                  </div>

                  {/* 审核接口 ID */}
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500">审核接口 ID</span>
                    <span className="text-xs font-mono text-slate-400">
                      {log.externalAuditId || "-"}
                    </span>
                  </div>

                  {/* 底层模型 */}
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500">底层模型</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {log.modelName || "-"}
                    </span>
                  </div>

                  {/* 场景类型 */}
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500">场景类型</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {log.scene || "-"}
                    </span>
                  </div>

                  {/* 语气风格 */}
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-slate-500">语气风格</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {log.tone || "-"}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* 底部操作按钮 */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex gap-3 shrink-0">
              <button
                onClick={handleMarkPassed}
                className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-green-500/20 transition-all"
              >
                审核通过
              </button>
              <button
                onClick={handleMarkViolation}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                标记违规
              </button>
            </div>
          </>
        )}
      </div>

      {/* 自定义滚动条样式 */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </>
  );
}

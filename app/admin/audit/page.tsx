/**
 * Spec: /docs/specs/admin-audit-logs.md
 * 
 * FluentWJ 管理后台 - 审计日志页面
 * 
 * Features:
 * - 审计日志列表展示（表格形式，分页）
 * - 搜索功能（手机号/IP/模型名称）
 * - 筛选功能（状态/时间范围）
 * - 详情面板（右侧滑出）
 * - 数据导出（CSV 格式）
 * - 响应式布局
 * - 深色模式支持
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import AuditLogFilters from "@/components/admin/audit/AuditLogFilters";
import AuditLogTable from "@/components/admin/audit/AuditLogTable";
import AuditLogDetailPanel from "@/components/admin/audit/AuditLogDetailPanel";
import type { AuditLog, AuditLogDetail, AuditLogQueryParams } from "@/types/admin";
import { toast } from "@/utils/toast";

export default function AuditLogPage() {
  // ========== 状态管理 ==========
  
  // 审计日志列表数据
  const [logs, setLogs] = useState<AuditLog[]>([]);
  // 总数量（用于分页）
  const [total, setTotal] = useState(0);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 选中的日志详情
  const [selectedLog, setSelectedLog] = useState<AuditLogDetail | null>(null);
  // 详情加载状态
  const [detailLoading, setDetailLoading] = useState(false);
  // 查询参数（包含分页、搜索、筛选）
  const [queryParams, setQueryParams] = useState<AuditLogQueryParams>({
    page: 1,
    pageSize: 20,
  });

  // ========== 数据获取 ==========

  /**
   * 获取审计日志列表
   */
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      // 构建查询字符串
      const params = new URLSearchParams();
      params.append("page", String(queryParams.page || 1));
      params.append("pageSize", String(queryParams.pageSize || 20));
      
      if (queryParams.keyword) params.append("keyword", queryParams.keyword);
      if (queryParams.status !== undefined) params.append("status", String(queryParams.status));
      if (queryParams.startDate) params.append("startDate", queryParams.startDate);
      if (queryParams.endDate) params.append("endDate", queryParams.endDate);

      // 调用 API
      // Token 通过 HttpOnly Cookie 自动发送，无需手动添加 Authorization 头
      const response = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保发送 Cookie
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.code === 200) {
        setLogs(result.data.list);
        setTotal(result.data.total);
        console.log("[AuditLog] 审计日志加载成功:", { count: result.data.list.length, total: result.data.total });
      } else {
        console.error("[AuditLog] 加载失败:", result.error);
      }
    } catch (error) {
      console.error("[AuditLog] 请求失败:", error);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  /**
   * 获取审计日志详情
   */
  const fetchLogDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      // 调用 API
      // Token 通过 HttpOnly Cookie 自动发送，无需手动添加 Authorization 头
      const response = await fetch(`/api/admin/audit-logs/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保发送 Cookie
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[AuditLog] 详情加载失败:", { status: response.status, error: errorData });
        throw new Error(`HTTP ${response.status}: ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (result.code === 200) {
        setSelectedLog(result.data);
        console.log("[AuditLog] 详情加载成功:", { id });
      } else {
        console.error("[AuditLog] 详情加载失败:", result.error);
        toast.error(`加载详情失败: ${result.error}`);
      }
    } catch (error: any) {
      console.error("[AuditLog] 请求失败:", error);
      toast.error(`加载详情失败: ${error.message}`);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  /**
   * 导出审计日志
   */
  const handleExport = async () => {
    try {
      // 构建查询字符串（不包含分页参数）
      const params = new URLSearchParams();
      
      if (queryParams.keyword) params.append("keyword", queryParams.keyword);
      if (queryParams.status !== undefined) params.append("status", String(queryParams.status));
      if (queryParams.startDate) params.append("startDate", queryParams.startDate);
      if (queryParams.endDate) params.append("endDate", queryParams.endDate);

      // 调用导出 API
      // Token 通过 HttpOnly Cookie 自动发送，无需手动添加 Authorization 头
      const response = await fetch(`/api/admin/audit-logs/export?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 确保发送 Cookie
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "导出失败");
        return;
      }

      // 下载 CSV 文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // 导出成功提示
      toast.success("审计日志导出成功");
      console.log("[AuditLog] 导出成功");
    } catch (error) {
      console.error("[AuditLog] 导出失败:", error);
      toast.error("导出失败，请稍后重试");
    }
  };

  /**
   * 处理表格行点击（打开详情面板）
   */
  const handleRowClick = (log: AuditLog) => {
    fetchLogDetail(log.id);
  };

  /**
   * 处理详情面板关闭
   */
  const handleCloseDetail = () => {
    setSelectedLog(null);
  };

  /**
   * 处理筛选条件变化
   */
  const handleFilterChange = (newFilters: Partial<AuditLogQueryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // 重置页码
    }));
  };

  /**
   * 处理分页变化
   */
  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // ========== 副作用 ==========

  // 监听查询参数变化，自动刷新数据
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ========== 渲染 ==========

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fc] dark:bg-background-dark relative">
      {/* 顶部标题栏 */}
      <header className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-8 py-6 flex flex-wrap justify-between items-center gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            审计日志
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            监控和审计平台生成的所有 AI 内容
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 导出按钮 */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              file_download
            </span>
            导出日志
          </button>
          
          {/* 刷新按钮 */}
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="bg-[#0054db] hover:bg-[#0054db]/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#0054db]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            刷新数据
          </button>
        </div>
      </header>

      {/* 搜索 + 筛选区 */}
      <AuditLogFilters 
        onFilterChange={handleFilterChange}
        currentFilters={queryParams}
      />

      {/* 表格区域 */}
      <div className="flex-1 overflow-hidden">
        <AuditLogTable
          logs={logs}
          loading={loading}
          total={total}
          currentPage={queryParams.page || 1}
          pageSize={queryParams.pageSize || 20}
          selectedId={selectedLog?.id}
          onRowClick={handleRowClick}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 右侧详情面板 */}
      {selectedLog && (
        <AuditLogDetailPanel
          log={selectedLog}
          loading={detailLoading}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

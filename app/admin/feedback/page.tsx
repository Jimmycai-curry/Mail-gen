/**
 * Spec: /docs/specs/admin-feedback-management.md
 * 
 * 反馈管理主页面
 * 
 * Features:
 * - 反馈列表展示（支持分页）
 * - 搜索和筛选功能
 * - Tab 切换（待处理/已处理）
 * - 处理反馈弹窗
 * - 导出功能
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import FeedbackFilters from "@/components/admin/feedback/FeedbackFilters";
import FeedbackTable from "@/components/admin/feedback/FeedbackTable";
import FeedbackProcessModal from "@/components/admin/feedback/FeedbackProcessModal";
import { FeedbackListItem } from "@/types/admin";
import { toast } from "@/utils/toast";

export default function FeedbackPage() {
  const router = useRouter();

  // 状态管理
  const [feedbacks, setFeedbacks] = useState<FeedbackListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  
  // 筛选条件
  const [selectedTab, setSelectedTab] = useState<number>(0); // 0=待处理, 1=已处理
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [dateRange, setDateRange] = useState("");

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackListItem | null>(null);

  // 待处理数量（用于徽章显示）
  const [pendingCount, setPendingCount] = useState(0);

  /**
   * 加载反馈列表
   */
  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        status: selectedTab.toString(),
      });

      if (keyword) params.append("keyword", keyword);
      if (type) params.append("type", type);
      
      // 处理日期范围
      if (dateRange) {
        const now = new Date();
        let startDate: Date | null = null;
        
        switch (dateRange) {
          case "24h":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case "7d":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "30d":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        }
        
        if (startDate) {
          params.append("startDate", startDate.toISOString());
        }
      }

      // 发送请求（浏览器自动携带 Cookie）
      const response = await fetch(`/api/admin/feedbacks?${params.toString()}`, {
        credentials: 'include', // 确保携带 Cookie
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();

      if (data.code === 200) {
        setFeedbacks(data.data.list);
        setTotal(data.data.total);
        
        // 如果是待处理 tab，更新待处理数量
        if (selectedTab === 0) {
          setPendingCount(data.data.total);
        }
      } else {
        toast.error(data.error || "加载失败");
      }
    } catch (error) {
      console.error("加载反馈列表失败:", error);
      toast.error("网络错误");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, selectedTab, keyword, type, dateRange, router]);

  /**
   * 初始加载和依赖变化时重新加载
   */
  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  /**
   * 处理筛选条件变化
   */
  const handleFilterChange = useCallback((filters: { keyword: string; type: string; dateRange: string }) => {
    setKeyword(filters.keyword);
    setType(filters.type);
    setDateRange(filters.dateRange);
    setPage(1); // 重置到第一页
  }, []);

  /**
   * 处理 Tab 切换
   */
  const handleTabChange = (tab: number) => {
    setSelectedTab(tab);
    setPage(1); // 重置到第一页
  };

  /**
   * 处理分页变化
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  /**
   * 打开处理弹窗
   */
  const handleProcessClick = (feedback: FeedbackListItem) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  /**
   * 关闭处理弹窗
   */
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  /**
   * 提交处理反馈
   */
  const handleProcessSubmit = async (adminNote: string) => {
    if (!selectedFeedback) return;

    try {
      const response = await fetch(`/api/admin/feedbacks/${selectedFeedback.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // 确保携带 Cookie
        body: JSON.stringify({ adminNote }),
      });

      const data = await response.json();

      if (data.code === 200) {
        // 处理成功：直接关闭面板并刷新列表，无需额外提示
        handleModalClose();
        loadFeedbacks(); // 重新加载列表
      } else {
        toast.error(data.error || "处理失败");
      }
    } catch (error) {
      console.error("处理反馈失败:", error);
      toast.error("网络错误");
    }
  };

  /**
   * 导出反馈数据
   */
  const handleExport = async () => {
    try {
      // 构建查询参数
      const params = new URLSearchParams({
        status: selectedTab.toString(),
      });

      if (keyword) params.append("keyword", keyword);
      if (type) params.append("type", type);
      
      if (dateRange) {
        const now = new Date();
        let startDate: Date | null = null;
        
        switch (dateRange) {
          case "24h":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case "7d":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "30d":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        }
        
        if (startDate) {
          params.append("startDate", startDate.toISOString());
        }
      }

      // 直接发送请求，浏览器会自动显示下载提示
      const response = await fetch(`/api/admin/feedbacks/export?${params.toString()}`, {
        credentials: 'include', // 确保携带 Cookie
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (response.ok) {
        // 下载 CSV 文件（浏览器会自动显示下载提示，无需额外弹窗）
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `feedbacks_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        toast.error(data.error || "导出失败");
      }
    } catch (error) {
      console.error("导出失败:", error);
      toast.error("网络错误");
    }
  };

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      {/* 页面头部 */}
      <header className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-8 pt-8 pb-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              反馈管理
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              查看并处理来自用户的意见、投诉与举报
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">file_download</span>
              导出报表
            </button>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-8 border-b border-transparent">
          <button
            onClick={() => handleTabChange(0)}
            className={`pb-4 px-1 border-b-2 text-sm font-bold flex items-center gap-2 transition-colors ${
              selectedTab === 0
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            待处理
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange(1)}
            className={`pb-4 px-1 border-b-2 text-sm font-medium transition-colors ${
              selectedTab === 1
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            已处理
          </button>
        </div>
      </header>

      {/* 筛选区域 */}
      <FeedbackFilters onFilterChange={handleFilterChange} />

      {/* 加载状态 */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">
              sync
            </span>
            <p className="text-slate-500">加载中...</p>
          </div>
        </div>
      ) : (
        /* 反馈列表表格 */
        <FeedbackTable
          feedbacks={feedbacks}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onProcessClick={handleProcessClick}
        />
      )}

      {/* 处理反馈弹窗 */}
      <FeedbackProcessModal
        feedback={selectedFeedback}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleProcessSubmit}
      />
    </main>
  );
}

/**
 * Spec: /docs/specs/history-page.md
 *
 * 历史记录页面
 * 展示历史记录列表和详情，支持点击查看完整信息
 * 对接真实的后端 API
 */

"use client";

import { useState, useEffect } from "react";
import { HistoryList } from "@/components/history/HistoryList";
import { HistoryDetail as HistoryDetailView } from "@/components/history/HistoryDetail";
import { HistoryItem, HistoryDetail } from "@/types/history";
import { HistoryApiClient } from "@/lib/historyApi";
import { toast } from "@/utils/toast";

export default function HistoryPage() {
  // 当前选中的历史记录 ID
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 当前选中的历史记录详情
  const [selectedDetail, setSelectedDetail] = useState<HistoryDetail | null>(null);
  // 加载详情的状态
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);

  // 历史记录列表数据
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  // 加载状态
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 错误状态
  const [error, setError] = useState<string | null>(null);

  /**
   * 加载历史记录列表
   * 页面加载时自动调用
   */
  useEffect(() => {
    loadHistories();
  }, []);

  /**
   * 加载历史记录列表数据
   * 调用后端 API 获取数据
   * 
   * 说明:
   * - 前端调用 HistoryApiClient.getHistories()
   * - Cookie 自动携带 auth_token
   * - 后端从 Cookie 读取 Token 进行认证
   * - 后端提取 userId 查询对应用户的数据
   */
  const loadHistories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 调用 API 客户端获取历史记录
      // 注意：前端不需要传递 userId，由后端从 Cookie 中的 Token 解析
      const response = await HistoryApiClient.getHistories();

      // 检查响应是否成功
      if (response.success) {
        setHistories(response.data.list);
        console.log('[HistoryPage] 加载历史记录成功:', {
          total: response.data.total,
          count: response.data.list.length
        });
      } else {
        setError('加载历史记录失败');
        toast.error('加载历史记录失败，请稍后重试');
      }
    } catch (err) {
      console.error('[HistoryPage] 加载历史记录失败:', err);
      setError('加载历史记录失败');
      toast.error('加载历史记录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理选择历史记录
   * @param id - 历史记录 ID
   *
   * 说明:
   * - 前端调用 HistoryApiClient.getHistoryDetail(id)
   * - Cookie 自动携带 auth_token
   * - 后端从 Cookie 读取 Token 进行认证
   * - 后端提取 userId 查询对应用户的详情数据
   */
  const handleSelectHistory = async (id: string) => {
    setSelectedId(id);

    try {
      console.log('[HistoryPage] 开始加载历史记录详情:', id);
      setIsDetailLoading(true);

      // 调用 API 客户端获取详情
      const response = await HistoryApiClient.getHistoryDetail(id);

      // 检查响应是否成功
      if (response.success) {
        setSelectedDetail(response.data);
        console.log('[HistoryPage] 加载历史记录详情成功:', {
          id: response.data.id,
          senderName: response.data.senderName,
          recipientName: response.data.recipientName
        });
      } else {
        toast.error('加载历史记录详情失败');
      }
    } catch (err) {
      console.error('[HistoryPage] 加载历史记录详情失败:', err);
      toast.error('加载历史记录详情失败，请稍后重试');
    } finally {
      setIsDetailLoading(false);
    }
  };

  /**
   * 处理筛选变更
   * 当用户点击"确认应用"按钮时调用
   * @param filters - 筛选参数
   * 
   * 说明:
   * - 前端调用 HistoryApiClient.getHistories(filters)
   * - Cookie 自动携带 auth_token
   * - 后端从 Token 解析 userId，应用筛选条件查询数据
   */
  const handleFilterChange = async (filters: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // 调用 API 客户端获取筛选后的数据
      const response = await HistoryApiClient.getHistories(filters);

      if (response.success) {
        setHistories(response.data.list);
        console.log('[HistoryPage] 筛选历史记录成功:', {
          filters,
          count: response.data.list.length
        });
      } else {
        setError('筛选失败');
        toast.error('筛选失败，请稍后重试');
      }
    } catch (err) {
      console.error('[HistoryPage] 筛选历史记录失败:', err);
      setError('筛选失败');
      toast.error('筛选失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* 左侧历史记录列表：固定宽度 400px */}
      <section className="w-[400px] border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <HistoryList
          histories={histories}
          selectedId={selectedId}
          onSelectHistory={handleSelectHistory}
          onFilterChange={handleFilterChange}
          isLoading={isLoading}
          error={error}
        />
      </section>

      {/* 右侧详情展示：flex-1 占据剩余空间 */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <HistoryDetailView detail={selectedDetail} isLoading={isDetailLoading} />
      </section>
    </div>
  );
}

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
   * 处理筛选变更和搜索
   * 当用户点击"确认应用"按钮或按回车搜索时调用
   * @param filters - 筛选参数（可能包含搜索关键词）
   * 
   * 说明:
   * - 如果有关键词，调用 HistoryApiClient.searchHistories()
   * - 如果没有关键词，调用 HistoryApiClient.getHistories()
   * - Cookie 自动携带 auth_token
   * - 后端从 Token 解析 userId，应用筛选条件查询数据
   */
  const handleFilterChange = async (filters: any) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      
      // 判断是搜索还是普通筛选
      if (filters.keyword && filters.keyword.trim()) {
        // 有关键词：调用搜索接口
        console.log('[HistoryPage] 执行搜索:', filters);
        response = await HistoryApiClient.searchHistories({
          keyword: filters.keyword.trim(),
          page: filters.page,
          pageSize: filters.pageSize,
          startDate: filters.startDate,
          endDate: filters.endDate,
          showOnlyFavorites: filters.showOnlyFavorites
        });
      } else {
        // 无关键词：调用普通筛选接口
        console.log('[HistoryPage] 执行筛选:', filters);
        response = await HistoryApiClient.getHistories(filters);
      }

      if (response.success) {
        setHistories(response.data.list);
        console.log('[HistoryPage] 操作成功:', {
          filters,
          total: response.data.total,
          count: response.data.list.length
        });
      } else {
        setError('操作失败');
        toast.error('操作失败，请稍后重试');
      }
    } catch (err) {
      console.error('[HistoryPage] 操作失败:', err);
      setError('操作失败');
      
      // 显示更友好的错误提示
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('操作失败，请稍后重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理收藏状态切换
   * 当用户点击收藏按钮时调用
   * @param id - 历史记录 ID
   * 
   * 说明:
   * - 调用 HistoryApiClient.toggleFavorite(id)
   * - Cookie 自动携带 auth_token
   * - 后端验证权限并更新收藏状态
   * - 成功后更新本地状态（列表和详情）
   */
  const handleToggleFavorite = async (id: string) => {
    try {
      console.log('[HistoryPage] 切换收藏状态:', id);

      // 调用 API 切换收藏状态
      const response = await HistoryApiClient.toggleFavorite(id);

      if (response.success) {
        const newFavoriteStatus = response.data.isFavorite;
        console.log('[HistoryPage] 切换收藏成功:', {
          id: response.data.id,
          isFavorite: newFavoriteStatus
        });

        // 更新列表中的收藏状态
        setHistories(prevHistories =>
          prevHistories.map(history =>
            history.id === id
              ? { ...history, isFavorite: newFavoriteStatus }
              : history
          )
        );

        // 如果当前正在查看这条记录，也更新详情的收藏状态
        if (selectedDetail && selectedDetail.id === id) {
          setSelectedDetail(prevDetail =>
            prevDetail ? { ...prevDetail, isFavorite: newFavoriteStatus } : null
          );
        }

        // 显示成功提示
        toast.success(newFavoriteStatus ? '已添加到收藏' : '已取消收藏');
      } else {
        toast.error('操作失败，请稍后重试');
      }
    } catch (err) {
      console.error('[HistoryPage] 切换收藏失败:', err);
      
      // 显示更友好的错误提示
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('操作失败，请稍后重试');
      }
    }
  };

  /**
   * 处理删除历史记录
   * 当用户在列表中点击删除图标并确认后调用
   * @param id - 历史记录 ID
   * 
   * 说明:
   * - 二次确认在 HistoryList 组件中完成（自定义弹窗）
   * - 此函数直接调用 API 删除
   * - Cookie 自动携带 auth_token
   * - 后端验证权限并执行软删除（is_deleted = true）
   * - 成功后从本地状态中移除该记录
   * - 自动选中下一条记录（如果有）
   * - 如果没有下一条，清空详情区
   */
  const handleDeleteHistory = async (id: string) => {
    try {
      console.log('[HistoryPage] 开始删除历史记录:', id);

      // 1. 调用 API 删除
      const response = await HistoryApiClient.deleteHistory(id);

      if (response.success) {
        console.log('[HistoryPage] 删除成功:', id);

        // 2. 更新本地状态：从列表中移除该项
        const currentIndex = histories.findIndex(h => h.id === id);
        const newHistories = histories.filter(h => h.id !== id);
        setHistories(newHistories);

        // 3. 处理选中状态
        if (selectedDetail?.id === id) {
          // 如果删除的是当前选中项
          if (newHistories.length > 0) {
            // 选中下一条（如果删除的是最后一条，则选中新的最后一条）
            const nextIndex = currentIndex < newHistories.length ? currentIndex : newHistories.length - 1;
            const nextItem = newHistories[nextIndex];
            console.log('[HistoryPage] 自动选中下一条记录:', nextItem.id);
            handleSelectHistory(nextItem.id); // 自动选中下一条
          } else {
            // 列表为空，清空详情区
            console.log('[HistoryPage] 列表为空，清空详情区');
            setSelectedDetail(null);
            setSelectedId(null);
          }
        }

        // 4. 显示成功提示
        toast.success('删除成功');
      } else {
        toast.error('删除失败，请稍后重试');
      }
    } catch (err) {
      console.error('[HistoryPage] 删除失败:', err);
      
      // 显示更友好的错误提示
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('删除失败，请稍后重试');
      }
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
          onToggleFavorite={handleToggleFavorite}
          onDeleteHistory={handleDeleteHistory}
          isLoading={isLoading}
          error={error}
        />
      </section>

      {/* 右侧详情展示：flex-1 占据剩余空间 */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <HistoryDetailView 
          detail={selectedDetail} 
          isLoading={isDetailLoading}
          onToggleFavorite={handleToggleFavorite}
        />
      </section>
    </div>
  );
}

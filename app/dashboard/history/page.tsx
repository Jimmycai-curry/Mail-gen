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
   * 注意：详情获取功能暂未实现，当前仍使用 Mock 详情数据
   * 后续需要创建 GET /api/history/[id] 接口
   */
  const handleSelectHistory = (id: string) => {
    setSelectedId(id);

    // TODO: 这里应该调用 API 获取详情数据
    // 暂时使用 Mock 详情数据
    const mockDetails: Record<string, HistoryDetail> = {
      "1": {
        id: "1",
        senderName: "市场部 张伟",
        recipientName: "极光科技 卢经理",
        tone: "专业严谨,诚恳礼貌",
        scene: "商业合作伙伴年度邀请",
        corePoints: [
          "回顾过去一年在云服务领域的紧密合作",
          "诚邀对方参加 11月15日 的战略研讨会",
          "提及我司最新的 AIGC 解决方案优势",
          "确认双方在明年的市场共享策略"
        ],
        mailContent: `尊敬的卢经理：

您好！

回顾即将过去的 2023 年，我们双方在云服务基础设施建设领域的紧密协作不仅取得了令人瞩目的市场成绩，更建立起了深厚的战略互信。在此，我谨代表市场部向贵司一直以来的支持与配合表示最诚挚的谢意。

为了进一步深化双方合作关系，并共同探讨在 AIGC 技术爆发背景下的市场新机遇，我们计划于 2023年11月15日 在上海总部举办"2024 年度战略合作伙伴研讨会"。届时，我司将首次公开演示最新的 FluentWJ 企业级 AIGC 解决方案，旨在通过 AI 技术赋能双方在业务流程自动化方面的效率提升。

我们非常期待能与贵司在明年的市场共享策略及联合营销方案上达成更高水平的共识。随信附上本次会议的初步议程，请您查收。

顺颂商祺！

张伟
市场部
2023年10月24日`,
        isFavorite: true,
        createdAt: "2023-10-24 14:30"
      }
    };

    const detail = mockDetails[id];
    setSelectedDetail(detail || null);
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
        <HistoryDetailView detail={selectedDetail} />
      </section>
    </div>
  );
}

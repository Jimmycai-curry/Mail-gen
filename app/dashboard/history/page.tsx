/**
 * Spec: /docs/specs/history-page.md
 *
 * 历史记录页面
 * 展示历史记录列表和详情，支持点击查看完整信息
 */

"use client";

import { useState } from "react";
import { HistoryList } from "@/components/history/HistoryList";
import { HistoryDetail as HistoryDetailView } from "@/components/history/HistoryDetail";
import { HistoryItem, HistoryDetail } from "@/types/history";

/**
 * Mock 数据：历史记录列表
 * 后续将从 API 获取真实数据
 */
const mockHistories: HistoryItem[] = [
  {
    id: "1",
    title: "业务邀请函",
    preview: "关于明年的战略合作伙伴邀请函，重点突出技术优势与市场份额...",
    isFavorite: true,
    createdAt: "2023-10-24 14:30"
  },
  {
    id: "2",
    title: "项目进度报告",
    preview: "Q3季度智慧城市项目的开发进展，包含已完成模块与风险评估...",
    isFavorite: false,
    createdAt: "2023-10-23 11:15"
  },
  {
    id: "3",
    title: "会议纪要",
    preview: "关于研发中心扩建的讨论摘要，明确了选址标准与预算范围...",
    isFavorite: false,
    createdAt: "2023-10-23 09:45"
  },
  {
    id: "4",
    title: "员工表彰草案",
    preview: "针对年度优秀团队的颁奖词，要求语气诚恳且富有激励性...",
    isFavorite: false,
    createdAt: "2023-10-22 18:20"
  }
];

/**
 * Mock 数据：历史记录详情
 * 后续将从 API 获取真实数据
 */
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

export default function HistoryPage() {
  // 当前选中的历史记录 ID
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 当前选中的历史记录详情
  const [selectedDetail, setSelectedDetail] = useState<HistoryDetail | null>(null);

  /**
   * 处理选择历史记录
   * @param id - 历史记录 ID
   */
  const handleSelectHistory = (id: string) => {
    setSelectedId(id);
    // 根据 ID 查找详情数据
    const detail = mockDetails[id];
    setSelectedDetail(detail || null);
  };

  return (
    <div className="flex h-full">
      {/* 左侧历史记录列表：固定宽度 400px */}
      <section className="w-[400px] border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <HistoryList
          histories={mockHistories}
          selectedId={selectedId}
          onSelectHistory={handleSelectHistory}
        />
      </section>

      {/* 右侧详情展示：flex-1 占据剩余空间 */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <HistoryDetailView detail={selectedDetail} />
      </section>
    </div>
  );
}

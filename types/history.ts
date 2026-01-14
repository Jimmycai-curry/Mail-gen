/**
 * Spec: /docs/specs/history-page.md
 *
 * 历史记录相关类型定义
 * 基于 mail_histories 数据库表结构
 */

/**
 * 历史记录列表项
 * 用于左侧 HistoryList 组件展示
 */
export interface HistoryItem {
  /** 唯一标识符 */
  id: string;
  /** 显示标题（使用 scene 或 sender_name + recipient_name） */
  title: string;
  /** 预览内容（core_points 前 80 字符） */
  preview: string;
  /** 是否已收藏 */
  isFavorite: boolean;
  /** 创建时间（格式：YYYY-MM-DD HH:mm） */
  createdAt: string;
}

/**
 * 历史记录详情
 * 用于右侧 HistoryDetail 组件展示完整信息
 */
export interface HistoryDetail {
  /** 唯一标识符 */
  id: string;
  /** 发送者姓名 */
  senderName: string;
  /** 接收者姓名 */
  recipientName: string;
  /** 语气风格（逗号分隔，如："专业严谨,诚恳礼貌"） */
  tone: string;
  /** 应用场景 */
  scene: string;
  /** 核心要点数组 */
  corePoints: string[];
  /** AI 生成的完整邮件内容 */
  mailContent: string;
  /** 是否已收藏 */
  isFavorite: boolean;
  /** 创建时间（格式：YYYY-MM-DD HH:mm） */
  createdAt: string;
}

/**
 * 历史记录列表组件 Props
 */
export interface HistoryListProps {
  /** 历史记录数据列表 */
  histories: HistoryItem[];
  /** 当前选中的记录 ID */
  selectedId?: string | null;
  /** 选择记录的回调函数 */
  onSelectHistory: (id: string) => void;
}

/**
 * 历史记录详情组件 Props
 */
export interface HistoryDetailProps {
  /** 当前选中的详情数据（可选，支持空状态） */
  detail?: HistoryDetail | null;
}

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
  /** 筛选变更回调函数 */
  onFilterChange?: (filters: any) => void;
  /** 切换收藏状态的回调函数 */
  onToggleFavorite?: (id: string) => void;
  /** 删除历史记录的回调函数 */
  onDeleteHistory?: (id: string) => void;
  /** 加载状态 */
  isLoading?: boolean;
  /** 错误信息 */
  error?: string | null;
}
/**
 * 历史记录详情组件 Props
 */
export interface HistoryDetailProps {
  /** 当前选中的详情数据（可选，支持空状态） */
  detail?: HistoryDetail | null;
  /** 加载状态 */
  isLoading?: boolean;
  /** 切换收藏状态的回调函数 */
  onToggleFavorite?: (id: string) => void;
}

/**
 * 历史记录列表请求参数
 * 用于 GET /api/history 接口的查询参数
 */
export interface GetHistoriesRequest {
  /** 页码，默认 1 */
  page?: number;
  /** 每页数量，默认 20，最大 100 */
  pageSize?: number;
  /** 开始日期，格式 YYYY-MM-DD */
  startDate?: string;
  /** 结束日期，格式 YYYY-MM-DD */
  endDate?: string;
  /** 是否仅显示收藏 */
  showOnlyFavorites?: boolean;
  /** 快捷筛选选项 */
  quickFilter?: 'all' | 'today' | 'week' | 'month';
}

/**
 * 历史记录列表响应
 * GET /api/history 接口的响应格式
 */
export interface GetHistoriesResponse {
  success: boolean;
  data: {
    /** 历史记录列表 */
    list: HistoryItem[];
    /** 总记录数 */
    total: number;
    /** 当前页码 */
    page: number;
    /** 每页数量 */
    pageSize: number;
  };
}

/**
 * 搜索历史记录请求参数
 * 用于 POST /api/history/search 接口
 */
export interface SearchHistoriesRequest {
  /** 搜索关键词（必填，至少2个字符） */
  keyword: string;
  /** 页码，默认 1 */
  page?: number;
  /** 每页数量，默认 20 */
  pageSize?: number;
  /** 开始日期，格式 YYYY-MM-DD */
  startDate?: string;
  /** 结束日期，格式 YYYY-MM-DD */
  endDate?: string;
  /** 是否仅显示收藏 */
  showOnlyFavorites?: boolean;
}

/**
 * 切换收藏状态请求参数
 * 用于 PUT /api/history/[id]/favorite 接口
 */
export interface ToggleFavoriteRequest {
  /** 目标收藏状态（可选，不传则切换） */
  isFavorite?: boolean;
}

/**
 * 切换收藏状态响应
 */
export interface ToggleFavoriteResponse {
  success: boolean;
  data: {
    id: string;
    isFavorite: boolean;
  };
}

/**
 * 删除历史记录响应
 */
export interface DeleteHistoryResponse {
  success: boolean;
  message: string;
}

/**
 * 获取历史记录详情响应
 * GET /api/history/[id] 接口的响应格式
 */
export interface GetHistoryDetailResponse {
  success: boolean;
  data: HistoryDetail;
}
/**
 * Spec: 基于设计稿 docs/ui/fluentwj_admin_overview_dashboard
 * 
 * Admin Dashboard 相关的 TypeScript 类型定义
 */

// 统计卡片数据结构
export interface StatCardData {
  value: number | string;  // 统计值，如 "128,430" 或 "+1,240"
  change: string;          // 变化百分比，如 "+5.2%" 或 "-2.4%"
  trend: 'up' | 'down';    // 趋势方向：上升或下降
}

// Dashboard 统计数据汇总
export interface DashboardStats {
  totalUsers: StatCardData;    // 总用户量
  todayNew: StatCardData;      // 今日新增
  todayUsage: StatCardData;    // 今日生成量
  todayBlocked: StatCardData;  // 今日拦截
}

// 最新注册用户信息
export interface LatestUser {
  id: string;              // 用户 ID
  name: string;            // 用户姓名
  email: string;           // 用户邮箱
  avatar: string;          // 首字母缩写，如 "ZH"
  registeredAt: string;    // 注册时间，如 "2023-10-30 14:23"
  lastLogin: string;       // 最后登录时间，如 "2 分钟前"
  status: 'normal' | 'disabled';  // 用户状态：正常或已禁用
}

// 侧边栏导航菜单项
export interface NavItem {
  id: string;              // 菜单项唯一标识
  label: string;           // 菜单项文字（中文）
  icon: string;            // Material Icon 名称
  href: string;            // 跳转路径
  active?: boolean;        // 是否为当前激活状态
}

// 管理员信息
export interface AdminInfo {
  name: string;            // 管理员姓名
  email: string;           // 管理员邮箱
  avatar?: string;         // 头像 URL（可选）
}

// 面包屑导航项
export interface BreadcrumbItem {
  label: string;           // 导航项文字
  href?: string;           // 跳转路径（可选，最后一项通常无链接）
}

// ============ 用户管理相关类型 ============

// 用户列表项
export interface UserListItem {
  id: string;                    // 用户 UUID
  phone: string;                 // 手机号
  role: number;                  // 角色：0=管理员, 1=普通用户
  status: number;                // 状态：0=封禁, 1=正常
  created_time: Date;            // 注册时间
  last_login_time: Date | null;  // 最后登录时间
  last_login_ip: string | null;  // 最后登录 IP
}

// 用户列表查询参数
export interface UserListQuery {
  page: number;         // 页码（从 1 开始）
  pageSize: number;     // 每页数量
  search?: string;      // 搜索关键词（手机号或ID）
  role?: number;        // 角色筛选（0=管理员, 1=普通用户）
  status?: number;      // 状态筛选（0=封禁, 1=正常）
}

// 用户列表响应数据
export interface UserListResponse {
  users: UserListItem[];  // 用户列表
  total: number;          // 总用户数
  page: number;           // 当前页码
  pageSize: number;       // 每页数量
}

// 用户角色枚举
export enum UserRole {
  ADMIN = 0,      // 管理员
  USER = 1,       // 普通用户
}

// 用户状态枚举
export enum UserStatus {
  BANNED = 0,     // 已封禁
  NORMAL = 1,     // 正常
}

// ============ 审计日志相关类型 ============

// 审计日志列表项
export interface AuditLog {
  id: string
  userPhone: string        // 脱敏手机号（如 "138****0000"）
  userIp: string           // 客户端 IP
  modelName: string | null // 底层模型（如 "DeepSeek-V3"）
  status: number           // 审核状态：1=通过, 0=违规拦截
  createdTime: string      // ISO 时间字符串
}

// 审计日志详情（继承列表项，增加更多字段）
export interface AuditLogDetail extends AuditLog {
  inputPrompt: string      // 用户输入
  outputContent: string    // AI 生成结果
  scene: string | null     // 场景类型
  tone: string | null      // 语气风格
  isSensitive: boolean     // 是否敏感内容
  externalAuditId: string | null  // 外部审计 ID
  // 扩展字段（从 IP 解析或计算）
  ipLocation?: string      // IP 归属地（如 "浙江 杭州"）
  complianceScore?: number // 内容合规分（0.0-1.0）
}

// 审计日志查询参数
export interface AuditLogQueryParams {
  page?: number            // 页码（从 1 开始）
  pageSize?: number        // 每页数量
  keyword?: string         // 搜索关键词（手机号/IP/模型名称）
  status?: number          // 状态筛选（0=违规拦截, 1=通过）
  startDate?: string       // 开始时间（ISO 格式）
  endDate?: string         // 结束时间（ISO 格式）
}

// 审计日志列表响应数据
export interface AuditLogListResponse {
  list: AuditLog[]         // 审计日志列表
  total: number            // 总数量
}

// 审计日志状态枚举
export enum AuditLogStatus {
  MANUAL_BLOCKED = 0,   // 审核拦截（后台手动标记）
  PASSED = 1,           // 审核通过
  SYSTEM_BLOCKED = 2,   // 系统识别拦截（AI自动拦截）
}

// ============ 操作日志相关类型 ============

// 操作日志列表项
export interface OperationLog {
  id: string                    // 日志 UUID
  adminAccount: string          // 管理员账号（手机号，完整显示）
  actionType: string            // 操作类型（如 "BAN_USER"）
  targetId: string | null       // 目标ID（如 "USR_99210"）
  detail: string | null         // 操作详情描述
  ip: string | null             // 管理员操作IP
  createdTime: string           // ISO 时间字符串
}

// 操作日志查询参数
export interface OperationLogQueryParams {
  page?: number                 // 页码（从 1 开始）
  pageSize?: number             // 每页数量
  keyword?: string              // 搜索关键词（管理员账号）
  actionType?: string           // 筛选操作类型
  startDate?: string            // 开始时间（ISO 格式）
  endDate?: string              // 结束时间（ISO 格式）
}

// 操作日志列表响应数据
export interface OperationLogListResponse {
  list: OperationLog[]          // 操作日志列表
  total: number                 // 总数量
}

// 操作类型枚举（对应设计稿中的彩色标签）
export enum ActionType {
  BAN_USER = 'BAN_USER',                          // 封禁用户（红色）
  UNBAN_USER = 'UNBAN_USER',                      // 解封用户（绿色）
  UPDATE_SENSITIVE_WORDS = 'UPDATE_SENSITIVE_WORDS', // 修改敏感词（橙色）
  PROCESS_FEEDBACK = 'PROCESS_FEEDBACK',          // 处理反馈（蓝色）
  CONFIG_CHANGE = 'CONFIG_CHANGE',                // 配置变更（紫色）
  CREATE_USER = 'CREATE_USER',                    // 创建用户（绿色）
  DELETE_USER = 'DELETE_USER',                    // 删除用户（红色）
  UPDATE_USER = 'UPDATE_USER',                    // 修改用户（蓝色）
  EXPORT_OPERATION_LOGS = 'EXPORT_OPERATION_LOGS', // 导出操作日志
  EXPORT_FEEDBACKS = 'EXPORT_FEEDBACKS',          // 导出反馈数据
}

// ============ 反馈管理相关类型 ============

// 反馈类型枚举
export enum FeedbackType {
  COMPLAINT = 'COMPLAINT',     // 投诉
  REPORT = 'REPORT',           // 举报
  SUGGESTION = 'SUGGESTION',   // 建议
}

// 反馈状态枚举
export enum FeedbackStatus {
  PENDING = 0,      // 待处理
  PROCESSED = 1,    // 已处理
}

// 反馈列表项
export interface FeedbackListItem {
  id: string                    // 反馈 UUID
  userId: string                // 用户 ID
  userName: string              // 用户姓名（从 users 表 JOIN）
  userPhone: string             // 脱敏手机号（如 "138****0001"）
  type: string                  // 反馈类型：'COMPLAINT', 'REPORT', 'SUGGESTION'
  content: string               // 反馈内容
  status: number                // 状态：0=待处理, 1=已处理
  adminNote: string | null      // 管理员备注
  processedTime: string | null  // 处理时间（ISO 格式）
  createdTime: string           // 提交时间（ISO 格式）
  logId: string | null          // 关联的审计日志 ID（可选）
}

// 反馈详情（继承列表项）
export interface FeedbackDetail extends FeedbackListItem {
  // 详情可能包含更多信息，当前与列表项相同
}

// 反馈查询参数
export interface FeedbackQueryParams {
  page?: number            // 页码（从 1 开始）
  pageSize?: number        // 每页数量
  keyword?: string         // 搜索关键词（用户名/手机号/反馈内容）
  type?: string            // 反馈类型筛选（'COMPLAINT', 'REPORT', 'SUGGESTION'）
  status?: number          // 状态筛选（0=待处理, 1=已处理）
  startDate?: string       // 开始时间（ISO 格式）
  endDate?: string         // 结束时间（ISO 格式）
}

// 反馈列表响应数据
export interface FeedbackListResponse {
  list: FeedbackListItem[]  // 反馈列表
  total: number             // 总数量
}

// 处理反馈数据
export interface ProcessFeedbackData {
  adminNote?: string        // 管理员备注（可选）
}

// 反馈类型映射（用于前端展示）
export const FeedbackTypeLabel: Record<string, string> = {
  COMPLAINT: '投诉',
  REPORT: '举报',
  SUGGESTION: '建议',
}

// 反馈类型颜色映射（用于前端徽章样式）
export const FeedbackTypeColor: Record<string, string> = {
  COMPLAINT: 'bg-red-100 text-red-600 dark:bg-red-900/30',
  REPORT: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
  SUGGESTION: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
}

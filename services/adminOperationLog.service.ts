/**
 * Spec: /docs/specs/admin-operation-logs.md
 * 
 * 管理员操作日志 Service 层
 * 
 * 职责：
 * - 操作日志列表查询（支持搜索、筛选、分页）
 * - 操作日志导出为 CSV
 * - 记录新的操作日志
 */

import { prisma } from '@/lib/db';
import type { OperationLogQueryParams, OperationLog } from '@/types/admin';

/**
 * 操作类型转换为中文显示
 * @param actionType - 操作类型英文值
 * @returns 中文显示名称
 */
export function getActionTypeLabel(actionType: string): string {
  const labelMap: Record<string, string> = {
    'BAN_USER': '封禁用户',
    'UNBAN_USER': '解封用户',
    'UPDATE_SENSITIVE_WORDS': '修改敏感词',
    'PROCESS_FEEDBACK': '处理反馈',
    'CONFIG_CHANGE': '配置变更',
    'CREATE_USER': '创建用户',
    'DELETE_USER': '删除用户',
    'UPDATE_USER': '修改用户',
    'EXPORT_OPERATION_LOGS': '导出操作日志',
  };
  return labelMap[actionType] || actionType;
}

/**
 * 获取操作日志列表（支持搜索、筛选、分页）
 * @param params - 查询参数
 * @returns 操作日志列表和总数
 */
export async function getOperationLogs(
  params: OperationLogQueryParams
): Promise<{ list: OperationLog[]; total: number }> {
  const {
    page = 1,
    pageSize = 20,
    keyword,
    actionType,
    startDate,
    endDate,
  } = params;

  // 校验参数
  const validPage = Math.max(1, page);
  const validPageSize = Math.min(100, Math.max(1, pageSize));

  // 构建查询条件
  const where: any = {};

  // 筛选操作类型
  if (actionType && actionType.trim()) {
    where.action_type = actionType.trim();
  }

  // 筛选时间范围
  if (startDate || endDate) {
    where.created_time = {};
    if (startDate) {
      where.created_time.gte = new Date(startDate);
    }
    if (endDate) {
      where.created_time.lte = new Date(endDate);
    }
  }

  // 如果有搜索关键词，需要先查询匹配的管理员ID
  if (keyword && keyword.trim()) {
    const matchedAdmins = await prisma.users.findMany({
      where: {
        phone: {
          contains: keyword.trim(),
        },
      },
      select: { id: true },
    });

    if (matchedAdmins.length === 0) {
      // 没有匹配的管理员，返回空结果
      return { list: [], total: 0 };
    }

    where.admin_id = {
      in: matchedAdmins.map((admin) => admin.id),
    };
  }

  // 执行查询
  const [logs, total] = await Promise.all([
    // 查询分页数据
    prisma.admin_operation_logs.findMany({
      where,
      skip: (validPage - 1) * validPageSize,
      take: validPageSize,
      orderBy: {
        created_time: 'desc', // 按时间倒序
      },
    }),
    // 查询总数
    prisma.admin_operation_logs.count({ where }),
  ]);

  // 获取所有管理员信息（批量查询，提高性能）
  const adminIds = [...new Set(logs.map((log) => log.admin_id))];
  const admins = await prisma.users.findMany({
    where: {
      id: { in: adminIds },
    },
    select: {
      id: true,
      phone: true,
    },
  });

  const adminMap = new Map(admins.map((admin) => [admin.id, admin.phone]));

  // 数据转换：获取管理员手机号（完整显示，不脱敏）
  const list: OperationLog[] = logs.map((log) => {
    const adminPhone = adminMap.get(log.admin_id) || null;

    return {
      id: log.id,
      adminAccount: adminPhone || '-', // 完整显示管理员账号
      actionType: log.action_type,
      userId: log.user_id || null,     // 修改：被操作的用户ID
      auditId: log.audit_id || null,   // 修改：审计日志表对应ID
      detail: log.detail,
      ip: log.ip,
      createdTime: log.created_time?.toISOString() || '',
    };
  });

  return { list, total };
}

/**
 * 导出操作日志为 CSV 格式
 * @param params - 查询参数（与列表查询相同，但不包含分页）
 * @returns CSV 字符串
 */
export async function exportOperationLogs(
  params: Omit<OperationLogQueryParams, 'page' | 'pageSize'>
): Promise<string> {
  const { keyword, actionType, startDate, endDate } = params;

  // 构建查询条件（同 getOperationLogs）
  const where: any = {};

  if (actionType && actionType.trim()) {
    where.action_type = actionType.trim();
  }

  if (startDate || endDate) {
    where.created_time = {};
    if (startDate) {
      where.created_time.gte = new Date(startDate);
    }
    if (endDate) {
      where.created_time.lte = new Date(endDate);
    }
  }

  // 如果有搜索关键词，需要先查询匹配的管理员ID
  if (keyword && keyword.trim()) {
    const matchedAdmins = await prisma.users.findMany({
      where: {
        phone: {
          contains: keyword.trim(),
        },
      },
      select: { id: true },
    });

    if (matchedAdmins.length === 0) {
      // 没有匹配的管理员，返回空CSV
      return '\uFEFF日志ID,管理员账号,操作类型,被操作用户ID,审计日志ID,详细描述,IP地址,操作时间';
    }

    where.admin_id = {
      in: matchedAdmins.map((admin) => admin.id),
    };
  }

  // 检查导出数量限制（最大 10,000 条）
  const count = await prisma.admin_operation_logs.count({ where });
  if (count > 10000) {
    throw new Error(`数据量过大，最多支持导出 10,000 条记录，当前 ${count} 条`);
  }

  // 查询所有匹配数据（不分页）
  const logs = await prisma.admin_operation_logs.findMany({
    where,
    orderBy: {
      created_time: 'desc',
    },
  });

  // 获取管理员信息
  const adminIds = [...new Set(logs.map((log) => log.admin_id))];
  const admins = await prisma.users.findMany({
    where: {
      id: { in: adminIds },
    },
    select: {
      id: true,
      phone: true,
    },
  });

  const adminMap = new Map(admins.map((admin) => [admin.id, admin.phone]));

  // 生成 CSV 内容
  const rows: string[] = [];

  // CSV 表头（UTF-8 BOM）
  rows.push('\uFEFF日志ID,管理员账号,操作类型,被操作用户ID,审计日志ID,详细描述,IP地址,操作时间');

  // CSV 数据行
  for (const log of logs) {
    const adminPhone = adminMap.get(log.admin_id) || '-';
    // 完整显示管理员账号，不脱敏
    const actionLabel = getActionTypeLabel(log.action_type);
    const createdTime = log.created_time
      ? new Date(log.created_time).toLocaleString('zh-CN', { hour12: false })
      : '-';

    // 处理CSV中的特殊字符（逗号、引号、换行）
    const csvEscape = (str: string | null): string => {
      if (!str) return '';
      // 如果包含逗号、引号或换行，需要用引号包裹，且内部引号需要转义
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    rows.push(
      [
        log.id,
        adminPhone, // 完整显示管理员账号
        actionLabel,
        log.user_id || '-',      // 修改：被操作的用户ID
        log.audit_id || '-',     // 修改：审计日志表对应ID
        csvEscape(log.detail),
        log.ip || '-',
        createdTime,
      ].join(',')
    );
  }

  return rows.join('\n');
}

/**
 * 记录新的操作日志
 * @param data - 操作日志数据
 */
export async function logAdminOperation(data: {
  adminId: string;
  actionType: string;
  userId?: string;      // 修改：被操作的用户ID（原来是 targetId）
  auditId?: string;     // 新增：审计日志表对应ID
  detail?: string;
  ip?: string;
}): Promise<void> {
  await prisma.admin_operation_logs.create({
    data: {
      admin_id: data.adminId,
      action_type: data.actionType,
      user_id: data.userId || null,     // 修改：使用 user_id
      audit_id: data.auditId || null,   // 新增：使用 audit_id
      detail: data.detail || null,
      ip: data.ip || null,
    },
  });
}

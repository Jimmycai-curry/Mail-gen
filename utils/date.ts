/**
 * Spec: /docs/specs/history-page.md
 *
 * 日期工具函数
 * 提供日期格式化、快捷筛选计算等功能
 */
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm 格式
 * @param date - Date 对象
 * @returns 格式化后的字符串，如 "2025-01-15 14:30"
 *
 * 示例：
 * formatDateTime(new Date('2025-01-15T14:30:00Z')) // "2025-01-15 14:30"
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd HH:mm');
}

/**
 * 根据快捷筛选选项计算日期范围
 * @param filter - 快捷筛选选项
 * @returns 日期范围对象，startDate 和 endDate 均为可选
 *
 * 快捷选项说明：
 * - all: 不设置日期范围
 * - today: 今天 00:00:00 到 23:59:59
 * - week: 本周一 00:00:00 到本周日 23:59:59
 * - month: 本月1日 00:00:00 到本月最后一天 23:59:59
 *
 * 示例：
 * getDateRangeByQuickFilter('today')
 * // { startDate: Date(2025-01-15 00:00:00), endDate: Date(2025-01-15 23:59:59) }
 */
export function getDateRangeByQuickFilter(filter: 'all' | 'today' | 'week' | 'month'): {
  startDate?: Date;
  endDate?: Date;
} {
  const today = new Date();

  switch (filter) {
    case 'today':
      return {
        startDate: startOfDay(today),
        endDate: endOfDay(today)
      };

    case 'week':
      return {
        startDate: startOfWeek(today),
        endDate: endOfWeek(today)
      };

    case 'month':
      return {
        startDate: startOfMonth(today),
        endDate: endOfMonth(today)
      };

    case 'all':
    default:
      // 不设置日期范围
      return {};
  }
}

/**
 * 解析 YYYY-MM-DD 格式的日期字符串为 Date 对象
 * @param dateStr - 日期字符串，格式为 YYYY-MM-DD
 * @returns Date 对象
 * @throws 如果日期格式无效，抛出 Error
 *
 * 示例：
 * parseDateString('2025-01-15') // Date(2025-01-15T00:00:00.000Z)
 * parseDateString('invalid-date') // throws Error
 */
export function parseDateString(dateStr: string): Date {
  // 验证格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    throw new Error('日期格式无效，请使用 YYYY-MM-DD 格式');
  }

  const date = new Date(dateStr);

  // 验证日期是否有效
  if (isNaN(date.getTime())) {
    throw new Error('日期值无效');
  }

  return date;
}

/**
 * 截取预览文本（用于历史记录列表）
 * @param content - 原始文本内容
 * @param maxLength - 最大长度，默认 80
 * @returns 截取后的文本，超出部分用 "..." 代替
 *
 * 示例：
 * getPreviewText('这是一段很长的文本内容...', 10) // "这是一段很长的..."
 * getPreviewText('短文本', 10) // "短文本"
 */
export function getPreviewText(content: string, maxLength = 80): string {
  if (!content) {
    return '';
  }

  const text = content.substring(0, maxLength);
  return content.length > maxLength ? text + '...' : text;
}

/**
 * 将 core_points 字符串拆分为数组
 * @param corePoints - 多行文本，使用换行符分隔
 * @returns 拆分后的数组，过滤空行
 *
 * 示例：
 * parseCorePoints('要点1\n要点2\n\n要点3') // ['要点1', '要点2', '要点3']
 * parseCorePoints('') // []
 */
export function parseCorePoints(corePoints: string | null | undefined): string[] {
  if (!corePoints) {
    return [];
  }

  return corePoints
    .split('\n')
    .map(point => point.trim())
    .filter(point => point.length > 0);
}

/**
 * 验证日期字符串格式
 * @param dateStr - 日期字符串
 * @returns 验证结果
 *
 * 示例：
 * validateDateString('2025-01-15') // { isValid: true }
 * validateDateString('2025/01/15') // { isValid: false, error: '日期格式无效' }
 * validateDateString('2025-13-45') // { isValid: false, error: '日期值无效' }
 */
export function validateDateString(dateStr: string): {
  isValid: boolean;
  error?: string;
} {
  if (!dateStr) {
    return { isValid: true }; // 空值是有效的（表示不限制）
  }

  try {
    parseDateString(dateStr);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : '日期格式无效'
    };
  }
}

/**
 * 验证日期范围的有效性
 * @param startDate - 开始日期字符串
 * @param endDate - 结束日期字符串
 * @returns 验证结果
 *
 * 示例：
 * validateDateRange('2025-01-01', '2025-01-31') // { isValid: true }
 * validateDateRange('2025-01-31', '2025-01-01') // { isValid: false, error: '开始日期不能大于结束日期' }
 */
export function validateDateRange(startDate?: string, endDate?: string): {
  isValid: boolean;
  error?: string;
} {
  // 如果任一日期为空，不验证范围
  if (!startDate || !endDate) {
    return { isValid: true };
  }

  const start = parseDateString(startDate);
  const end = parseDateString(endDate);

  if (start > end) {
    return {
      isValid: false,
      error: '开始日期不能大于结束日期'
    };
  }

  return { isValid: true };
}

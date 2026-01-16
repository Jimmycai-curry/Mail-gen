/**
 * Spec: /docs/specs/admin-operation-logs.md
 * 
 * 管理员操作日志列表 API
 * 
 * GET /api/admin/operation-logs
 * - 获取操作日志列表（支持搜索、筛选、分页）
 * - 权限：仅管理员（role = 0）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOperationLogs } from '@/services/adminOperationLog.service';
import type { OperationLogQueryParams } from '@/types/admin';

/**
 * GET 处理函数：获取操作日志列表
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const keyword = searchParams.get('keyword') || undefined;
    const actionType = searchParams.get('actionType') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    // 参数校验
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { code: 400, error: '页码参数无效' },
        { status: 400 }
      );
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { code: 400, error: '每页数量参数无效（范围：1-100）' },
        { status: 400 }
      );
    }

    // 日期格式校验（简单检查）
    if (startDate && isNaN(Date.parse(startDate))) {
      return NextResponse.json(
        { code: 400, error: '开始时间格式错误，请使用 ISO 8601 格式' },
        { status: 400 }
      );
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return NextResponse.json(
        { code: 400, error: '结束时间格式错误，请使用 ISO 8601 格式' },
        { status: 400 }
      );
    }

    // 构建查询参数
    const queryParams: OperationLogQueryParams = {
      page,
      pageSize,
      keyword,
      actionType,
      startDate,
      endDate,
    };

    // 调用 Service 层
    const result = await getOperationLogs(queryParams);

    // 返回成功响应
    return NextResponse.json({
      code: 200,
      data: result,
    });
  } catch (error: unknown) {
    console.error('[API] 获取操作日志失败:', error);

    // 错误处理
    if (error instanceof Error) {
      return NextResponse.json(
        { code: 500, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { code: 500, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

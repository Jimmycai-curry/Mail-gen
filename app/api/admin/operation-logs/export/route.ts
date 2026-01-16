/**
 * Spec: /docs/specs/admin-operation-logs.md
 * 
 * 管理员操作日志导出 API
 * 
 * GET /api/admin/operation-logs/export
 * - 导出操作日志为 CSV 文件
 * - 权限：仅管理员（role = 0）
 * - 限制：最大导出 10,000 条记录
 */

import { NextRequest, NextResponse } from 'next/server';
import { exportOperationLogs, logAdminOperation } from '@/services/adminOperationLog.service';
import { getClientIp } from '@/utils/request';

/**
 * GET 处理函数：导出操作日志为 CSV
 */
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get('keyword') || undefined;
    const actionType = searchParams.get('actionType') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

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

    // 调用 Service 层导出数据
    const csv = await exportOperationLogs({
      keyword,
      actionType,
      startDate,
      endDate,
    });

    // TODO: 记录操作日志（需要从 request 中获取管理员 ID）
    // 这里暂时注释，等待 middleware 传递管理员 ID
    // const adminId = request.headers.get('x-admin-id');
    // const ip = getClientIp(request);
    // if (adminId) {
    //   await logAdminOperation({
    //     adminId,
    //     actionType: 'EXPORT_OPERATION_LOGS',
    //     detail: `导出操作日志，筛选条件：${JSON.stringify({ keyword, actionType, startDate, endDate })}`,
    //     ip,
    //   });
    // }

    // 生成文件名（时间戳）
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[-:T]/g, '')
      .slice(0, 14); // YYYYMMDDHHMMSS
    const filename = `operation_logs_${timestamp}.csv`;

    // 返回 CSV 文件
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error('[API] 导出操作日志失败:', error);

    // 错误处理
    if (error instanceof Error) {
      // 特殊处理数据量过大错误
      if (error.message.includes('数据量过大')) {
        return NextResponse.json(
          { code: 400, error: error.message },
          { status: 400 }
        );
      }

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

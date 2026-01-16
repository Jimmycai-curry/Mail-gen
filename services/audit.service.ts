// Spec: /docs/specs/admin-audit-logs.md
// 说明: 管理后台审计日志服务
// 负责审计日志查询、详情获取、数据导出等核心业务逻辑

import { prisma } from '@/lib/db'
import { ValidationError, NotFoundError } from '@/utils/error'
import { 
  AuditLogQueryParams, 
  AuditLogListResponse, 
  AuditLog,
  AuditLogDetail 
} from '@/types/admin'

/**
 * 手机号处理（现在返回完整手机号）
 * 
 * @param phone - 原始手机号
 * @returns 完整手机号
 */
function formatPhone(phone: string | null): string {
  return phone || '-'
}

/**
 * 格式化时间为 ISO 字符串
 * 
 * @param date - Date 对象或 null
 * @returns ISO 格式时间字符串
 */
function formatISODate(date: Date | null): string {
  return date ? date.toISOString() : ''
}

/**
 * 解析 IP 归属地（模拟实现）
 * 实际项目中可使用 ip2region 库或第三方 API
 * 
 * @param ip - IP 地址
 * @returns 归属地字符串（如 "浙江 杭州"）
 */
function resolveIpLocation(ip: string): string {
  // TODO: 集成真实的 IP 地理位置库或 API
  // 这里返回模拟数据作为占位符
  if (ip.startsWith('192.168') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return '内网地址'
  }
  return '未知地区' // 实际应调用 IP 库
}

/**
 * 计算内容合规分（基于 is_sensitive 字段模拟）
 * 实际项目中应对接真实的内容审核接口
 * 
 * @param isSensitive - 是否敏感内容
 * @returns 合规分数（0.0-1.0）
 */
function calculateComplianceScore(isSensitive: boolean): number {
  // 模拟数据：敏感内容分数较低，正常内容接近满分
  return isSensitive ? 0.45 : 0.99
}

/**
 * 获取审计日志列表（支持分页、搜索、筛选）
 * 
 * @param params - 查询参数（page, pageSize, keyword, status, startDate, endDate）
 * @returns 审计日志列表响应数据
 */
export async function getAuditLogs(params: AuditLogQueryParams): Promise<AuditLogListResponse> {
  console.log('[AuditService] 获取审计日志列表:', params)

  const { 
    page = 1, 
    pageSize = 20, 
    keyword, 
    status, 
    startDate, 
    endDate 
  } = params

  // 验证分页参数
  if (page < 1) {
    throw new ValidationError('页码必须大于等于 1')
  }
  if (pageSize < 1 || pageSize > 100) {
    throw new ValidationError('每页数量必须在 1-100 之间')
  }

  // 构建查询条件
  const where: any = {}

  // 搜索条件：手机号/IP/模型名称
  if (keyword) {
    where.OR = [
      { user_phone: { contains: keyword } },      // 手机号模糊匹配
      { user_ip: keyword },                       // IP 精确匹配
      { model_name: { contains: keyword } }       // 模型名称模糊匹配
    ]
  }

  // 状态筛选
  if (status !== undefined) {
    where.status = status
  }

  // 时间范围筛选
  if (startDate || endDate) {
    where.created_time = {}
    if (startDate) {
      where.created_time.gte = new Date(startDate)
    }
    if (endDate) {
      where.created_time.lte = new Date(endDate)
    }
  }

  // 计算偏移量
  const skip = (page - 1) * pageSize

  // 并行执行：查询总数 + 查询数据
  const [total, logs] = await Promise.all([
    prisma.audit_logs.count({ where }),
    prisma.audit_logs.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_time: 'desc' }, // 按时间倒序
      select: {
        id: true,
        user_phone: true,
        user_ip: true,
        model_name: true,
        status: true,
        created_time: true
      }
    })
  ])

  console.log('[AuditService] 查询结果:', { total, count: logs.length })

  // 转换数据格式（显示完整手机号）
  const list: AuditLog[] = logs.map(log => ({
    id: log.id,
    userPhone: formatPhone(log.user_phone),
    userIp: log.user_ip,
    modelName: log.model_name,
    status: log.status ?? 1,
    createdTime: formatISODate(log.created_time)
  }))

  return {
    list,
    total
  }
}

/**
 * 获取审计日志详情
 * 
 * @param id - 审计日志 ID
 * @returns 审计日志详情数据
 */
export async function getAuditLogDetail(id: string): Promise<AuditLogDetail> {
  console.log('[AuditService] 获取审计日志详情:', id)

  // 查询完整的审计日志信息
  const log = await prisma.audit_logs.findUnique({
    where: { id },
    select: {
      id: true,
      user_phone: true,
      user_ip: true,
      model_name: true,
      status: true,
      created_time: true,
      input_prompt: true,
      output_content: true,
      scene: true,
      tone: true,
      is_sensitive: true,
      external_audit_id: true
    }
  })

  // 检查日志是否存在
  if (!log) {
    throw new NotFoundError('审计日志不存在')
  }

  console.log('[AuditService] 日志详情查询成功:', { id, status: log.status })

  // 构建详情数据（显示完整手机号）
  const detail: AuditLogDetail = {
    id: log.id,
    userPhone: formatPhone(log.user_phone),
    userIp: log.user_ip,
    modelName: log.model_name,
    status: log.status ?? 1,
    createdTime: formatISODate(log.created_time),
    inputPrompt: log.input_prompt,
    outputContent: log.output_content,
    scene: log.scene,
    tone: log.tone,
    isSensitive: log.is_sensitive ?? false,
    externalAuditId: log.external_audit_id,
    // 扩展字段
    ipLocation: resolveIpLocation(log.user_ip),
    complianceScore: calculateComplianceScore(log.is_sensitive ?? false)
  }

  return detail
}

/**
 * 导出审计日志（CSV格式）
 * 
 * @param params - 查询参数（keyword, status, startDate, endDate）
 * @param adminId - 操作管理员ID
 * @param adminIp - 操作管理员IP
 * @returns CSV格式的字符串
 */
export async function exportAuditLogs(
  params: Omit<AuditLogQueryParams, 'page' | 'pageSize'>,
  adminId: string,
  adminIp: string
): Promise<string> {
  console.log('[AuditService] 导出审计日志:', params)

  const { keyword, status, startDate, endDate } = params

  // 构建查询条件（与列表查询相同）
  const where: any = {}

  if (keyword) {
    where.OR = [
      { user_phone: { contains: keyword } },
      { user_ip: keyword },
      { model_name: { contains: keyword } }
    ]
  }

  if (status !== undefined) {
    where.status = status
  }

  if (startDate || endDate) {
    where.created_time = {}
    if (startDate) {
      where.created_time.gte = new Date(startDate)
    }
    if (endDate) {
      where.created_time.lte = new Date(endDate)
    }
  }

  // 检查导出数量限制
  const count = await prisma.audit_logs.count({ where })

  if (count > 10000) {
    throw new ValidationError(`数据量过大，最多支持导出 10,000 条记录，当前 ${count} 条`)
  }

  // 查询所有匹配数据（不分页）
  const logs = await prisma.audit_logs.findMany({
    where,
    orderBy: { created_time: 'desc' },
    select: {
      id: true,
      user_phone: true,
      user_ip: true,
      model_name: true,
      status: true,
      created_time: true,
      input_prompt: true,
      output_content: true
    }
  })

  // 生成CSV内容（UTF-8 BOM）
  const BOM = '\uFEFF'
  const header = '日志ID,用户手机号,客户端IP,底层模型,审核状态,生成时间,用户输入,AI输出\n'

  const rows = logs.map(log => {
    // 状态映射：0=审核拦截（手动）, 1=通过, 2=系统拦截
    let statusName = '通过'
    if (log.status === 0) {
      statusName = '审核拦截'
    } else if (log.status === 2) {
      statusName = '系统拦截'
    }
    
    const createdTime = log.created_time 
      ? new Date(log.created_time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) 
      : ''
    const phone = formatPhone(log.user_phone)
    const modelName = log.model_name || '-'
    
    // CSV 字段中的特殊字符处理（逗号、换行符、引号）
    const escapeCSV = (str: string) => {
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    return [
      log.id,
      phone,
      log.user_ip,
      modelName,
      statusName,
      createdTime,
      escapeCSV(log.input_prompt),
      escapeCSV(log.output_content)
    ].join(',')
  }).join('\n')

  const csv = BOM + header + rows

  // 记录操作日志
  await prisma.admin_operation_logs.create({
    data: {
      admin_id: adminId,
      action_type: 'EXPORT_AUDIT_LOGS',
      target_id: null,
      detail: `导出审计日志，条件: ${JSON.stringify(params)}，数量: ${count}`,
      ip: adminIp
    }
  })

  console.log('[AuditService] 审计日志导出成功:', { count })

  return csv
}

/**
 * 标记审计日志为违规
 * 
 * @param id - 审计日志 ID
 * @param adminId - 操作管理员 ID
 * @param adminIp - 操作管理员 IP
 * @returns 更新后的审计日志
 */
export async function markAuditLogAsViolation(
  id: string,
  adminId: string,
  adminIp: string
) {
  console.log('[AuditService] 标记审计日志为违规:', { id, adminId })

  // 检查审计日志是否存在
  const log = await prisma.audit_logs.findUnique({
    where: { id },
    select: {
      id: true,
      user_phone: true,
      status: true,
    }
  })

  if (!log) {
    throw new NotFoundError('审计日志不存在')
  }

  // 更新审计日志状态为违规（0=违规拦截）
  const updatedLog = await prisma.audit_logs.update({
    where: { id },
    data: {
      status: 0,
      is_sensitive: true,
    },
    select: {
      id: true,
      status: true,
      is_sensitive: true,
    }
  })

  // 记录操作日志到 admin_operation_logs
  await prisma.admin_operation_logs.create({
    data: {
      admin_id: adminId,
      action_type: 'MARK_VIOLATION',
      target_id: id,
      detail: `手动标记审计日志为违规，用户手机号: ${log.user_phone}`,
      ip: adminIp,
    }
  })

  console.log('[AuditService] 审计日志标记成功:', { id, status: updatedLog.status })

  return updatedLog
}

/**
 * 标记审计日志为通过
 * 
 * @param id - 审计日志 ID
 * @param adminId - 操作管理员 ID
 * @param adminIp - 操作管理员 IP
 * @returns 更新后的审计日志
 */
export async function markAuditLogAsPassed(
  id: string,
  adminId: string,
  adminIp: string
) {
  console.log('[AuditService] 标记审计日志为通过:', { id, adminId })

  // 检查审计日志是否存在
  const log = await prisma.audit_logs.findUnique({
    where: { id },
    select: {
      id: true,
      user_phone: true,
      status: true,
    }
  })

  if (!log) {
    throw new NotFoundError('审计日志不存在')
  }

  // 更新审计日志状态为通过（1=审核通过）
  const updatedLog = await prisma.audit_logs.update({
    where: { id },
    data: {
      status: 1,
      is_sensitive: false,
    },
    select: {
      id: true,
      status: true,
      is_sensitive: true,
    }
  })

  // 记录操作日志到 admin_operation_logs
  await prisma.admin_operation_logs.create({
    data: {
      admin_id: adminId,
      action_type: 'MARK_PASSED',
      target_id: id,
      detail: `手动标记审计日志为通过，用户手机号: ${log.user_phone}`,
      ip: adminIp,
    }
  })

  console.log('[AuditService] 审计日志标记通过成功:', { id, status: updatedLog.status })

  return updatedLog
}

// Spec: /docs/specs/moderation-integration.md
// 说明: 阿里云 AI 安全护栏 API 封装，提供文本审核能力

import RPCClient from '@alicloud/pop-core';
import crypto from 'crypto';

/**
 * 审核结果接口
 */
export interface ModerationResult {
  pass: boolean;                          // 是否通过审核
  isSensitive: boolean;                   // 是否包含敏感内容
  externalAuditId?: string;               // 阿里云审核 ID（用于溯源）
  blockedReason?: string;                 // 拒绝原因
  riskLevel?: 'high' | 'medium' | 'low' | 'none';  // 风险等级
  sensitiveLevel?: string;                // 敏感等级（S0-S4）
  attackLevel?: 'high' | 'medium' | 'low' | 'none'; // 攻击等级
  labels?: string[];                      // 命中的标签
  sensitiveData?: string[];               // 检测到的敏感数据
  adviceAnswer?: string;                  // 自动拒答建议
}

/**
 * 阿里云 AI 安全护栏审核响应接口
 */
interface AliyunModerationResponse {
  Code: number;
  Message: string;
  RequestId: string;
  Data: {
    RiskLevel: 'high' | 'medium' | 'low' | 'none';  // 风险等级
    SensitiveLevel?: string;                        // 敏感等级（S0-S4）
    AttackLevel?: 'high' | 'medium' | 'low' | 'none'; // 攻击等级
    Result?: Array<{                                // 合规风险结果
      Label: string;
      Confidence: number;
      Riskwords?: string;
      Description?: string;
      CustomizedHit?: Array<{
        LibName: string;
        Keywords: string;
      }>;
    }>;
    SensitiveResult?: Array<{                       // 敏感信息结果
      Label: string;
      SensitiveLevel: string;
      Description?: string;
      SensitiveData?: string[];
    }>;
    AttackResult?: Array<{                          // 攻击检测结果
      Label: string;
      AttackLevel: string;
      Confidence: number;
      Description?: string;
    }>;
    Advice?: Array<{                                // 自动拒答建议
      Answer: string;
      HitLabel?: string;
      HitLibName?: string;
    }>;
  };
}

/**
 * 本地敏感词库（降级策略用）
 * 生产环境应从数据库或 Redis 加载
 */
const FALLBACK_SENSITIVE_KEYWORDS = [
  // 政治敏感词（示例，实际应更完善）
  '暴力', '恐怖', '政治敏感词',
  // 色情低俗词（示例）
  '色情词', '低俗词',
  // 违禁内容（示例）
  '赌博', '毒品',
  // 辱骂词（示例）
  '脏话', '人身攻击'
];

/**
 * 脱敏处理 AccessKey（用于日志）
 */
function maskAccessKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.slice(0, 4)}***${key.slice(-4)}`;
}

/**
 * 延迟函数（用于重试）
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 解析阿里云 AI 安全护栏审核响应
 */
function parseModerationResponse(response: AliyunModerationResponse): ModerationResult {
  // 检查响应码
  if (response.Code !== 200) {
    throw new Error(`阿里云审核服务返回错误: ${response.Message}`);
  }

  // 直接使用 RiskLevel（API 已计算好）
  const riskLevel = response.Data.RiskLevel || 'none';
  const sensitiveLevel = response.Data.SensitiveLevel || 'S0';
  const attackLevel = response.Data.AttackLevel || 'none';

  // 判断是否通过（高风险、中风险、攻击高风险都拒绝）
  const hasRisk = riskLevel === 'high' || riskLevel === 'medium';
  const hasAttack = attackLevel === 'high';
  const hasSensitive = sensitiveLevel !== 'S0' && parseInt(sensitiveLevel.substring(1)) >= 3; // S3, S4 拒绝
  
  const pass = !hasRisk && !hasAttack && !hasSensitive;

  // 提取标签
  const labels: string[] = [];
  if (response.Data.Result) {
    labels.push(...response.Data.Result.map(r => r.Label));
  }
  if (response.Data.AttackResult) {
    labels.push(...response.Data.AttackResult.map(r => r.Label));
  }

  // 提取拒绝原因
  const reasons: string[] = [];
  
  // 合规风险原因
  if (response.Data.Result && response.Data.Result.length > 0) {
    const highRiskResults = response.Data.Result.filter(r => r.Confidence >= 80);
    reasons.push(...highRiskResults.map(r => r.Description || r.Label));
  }

  // 攻击检测原因
  if (response.Data.AttackResult && response.Data.AttackResult.length > 0) {
    const highAttackResults = response.Data.AttackResult.filter(r => r.AttackLevel === 'high');
    reasons.push(...highAttackResults.map(r => r.Description || r.Label));
  }

  // 敏感信息原因
  if (response.Data.SensitiveResult && response.Data.SensitiveResult.length > 0) {
    const highSensitiveResults = response.Data.SensitiveResult.filter(r => {
      const level = parseInt(r.SensitiveLevel.substring(1));
      return level >= 3;
    });
    reasons.push(...highSensitiveResults.map(r => r.Description || `敏感信息(${r.SensitiveLevel})`));
  }

  // 提取敏感数据（用于日志记录，不返回给用户）
  const sensitiveData: string[] = [];
  if (response.Data.SensitiveResult) {
    response.Data.SensitiveResult.forEach(sr => {
      if (sr.SensitiveData) {
        sensitiveData.push(...sr.SensitiveData);
      }
    });
  }

  // 提取自动拒答建议
  let adviceAnswer: string | undefined;
  if (response.Data.Advice && response.Data.Advice.length > 0) {
    adviceAnswer = response.Data.Advice[0].Answer;
  }

  const blockedReason = reasons.length > 0 ? reasons.join('; ') : undefined;

  return {
    pass,
    isSensitive: hasRisk || hasSensitive,
    externalAuditId: response.RequestId,
    blockedReason: !pass ? blockedReason : undefined,
    riskLevel,
    sensitiveLevel,
    attackLevel,
    labels: labels.length > 0 ? labels : undefined,
    sensitiveData: sensitiveData.length > 0 ? sensitiveData : undefined,
    adviceAnswer: !pass ? adviceAnswer : undefined
  };
}

/**
 * 降级策略：本地关键词过滤
 * 当阿里云审核服务不可用时使用
 */
function applyFallbackStrategy(text: string): ModerationResult {
  console.warn('[Moderation] 使用降级策略：本地关键词过滤');

  // 转为小写进行匹配
  const lowerText = text.toLowerCase();

  // 检测是否包含敏感词
  for (const keyword of FALLBACK_SENSITIVE_KEYWORDS) {
    if (lowerText.includes(keyword.toLowerCase())) {
      console.warn('[Moderation] 本地过滤检测到敏感内容:', keyword);
      return {
        pass: false,
        isSensitive: true,
        blockedReason: `检测到敏感内容（本地过滤）`,
        riskLevel: 'high',
        labels: ['本地过滤']
      };
    }
  }

  // 未检测到敏感词，通过审核
  console.log('[Moderation] 本地过滤通过');
  return {
    pass: true,
    isSensitive: false,
    riskLevel: 'low'
  };
}

/**
 * 阿里云内容审核内部调用（单次）
 */
async function moderateContentInternal(text: string): Promise<ModerationResult> {
  // 检查环境变量
  if (!process.env.ALIYUN_ACCESS_KEY_ID) {
    throw new Error('阿里云 AccessKey ID 未配置');
  }

  if (!process.env.ALIYUN_ACCESS_KEY_SECRET) {
    throw new Error('阿里云 AccessKey Secret 未配置');
  }

  // 创建阿里云客户端（AI 安全护栏）
  const client = new RPCClient({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    endpoint: process.env.ALIYUN_MODERATION_ENDPOINT || 'https://green-cip.cn-shanghai.aliyuncs.com',
    apiVersion: '2022-03-02'
  });

  // 记录日志（脱敏）
  console.log('[Moderation] 开始审核内容 (AI 安全护栏)...', {
    textLength: text.length,
    accessKeyId: maskAccessKey(process.env.ALIYUN_ACCESS_KEY_ID),
    endpoint: process.env.ALIYUN_MODERATION_ENDPOINT || 'https://green-cip.cn-shanghai.aliyuncs.com',
    timestamp: new Date().toISOString()
  });

  const startTime = Date.now();

  try {
    // 生成唯一的 chatId（标识一轮对话）
    const chatId = crypto.randomUUID();

    // 构建请求参数（AI 安全护栏格式）
    const params = {
      Service: 'query_security_check',  // AI 输入内容安全检测
      ServiceParameters: JSON.stringify({
        content: text,
        chatId: chatId  // 用于标识一轮对话
      })
    };

    const requestOption = {
      method: 'POST',
      timeout: parseInt(process.env.ALIYUN_MODERATION_TIMEOUT || '10000')
    };

    // 调用阿里云 AI 安全护栏 API
    const response: AliyunModerationResponse = await client.request(
      'TextModerationPlus',  // AI 安全护栏 API
      params,
      requestOption
    );

    // 解析响应
    const result = parseModerationResponse(response);

    // 记录成功日志
    const duration = Date.now() - startTime;
    console.log('[Moderation] 审核完成 (AI 安全护栏)', {
      pass: result.pass,
      isSensitive: result.isSensitive,
      riskLevel: result.riskLevel,
      sensitiveLevel: result.sensitiveLevel,
      attackLevel: result.attackLevel,
      hasSensitiveData: result.sensitiveData ? result.sensitiveData.length : 0,
      externalAuditId: result.externalAuditId,
      duration: `${duration}ms`
    });

    // 如果检测到敏感数据，单独记录警告日志
    if (result.sensitiveData && result.sensitiveData.length > 0) {
      console.warn('[Moderation] 检测到敏感信息!', {
        sensitiveLevel: result.sensitiveLevel,
        sensitiveCount: result.sensitiveData.length,
        // 不记录具体数据，只记录数量
        externalAuditId: result.externalAuditId
      });
    }

    // 如果检测到攻击，单独记录警告日志
    if (result.attackLevel === 'high' || result.attackLevel === 'medium') {
      console.warn('[Moderation] 检测到恶意攻击行为!', {
        attackLevel: result.attackLevel,
        labels: result.labels,
        externalAuditId: result.externalAuditId
      });
    }

    return result;

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('[Moderation] 审核失败', {
      error: error.message,
      statusCode: error.statusCode,
      duration: `${duration}ms`
    });

    throw error;
  }
}

/**
 * 调用阿里云内容安全 API 审核文本内容（带重试和降级）
 * 
 * @param text - 待审核的文本内容
 * @returns 审核结果
 * @throws Error - 降级策略失败
 */
export async function moderateContent(text: string): Promise<ModerationResult> {
  // 空内容直接通过
  if (!text || text.trim().length === 0) {
    console.log('[Moderation] 内容为空，直接通过');
    return {
      pass: true,
      isSensitive: false,
      riskLevel: 'low'
    };
  }

  try {
    // 第一次尝试
    console.log('[Moderation] 第 1 次调用阿里云审核...');
    return await moderateContentInternal(text);
  } catch (firstError: any) {
    console.warn('[Moderation] 第 1 次调用失败，准备重试', { error: firstError.message });

    // 判断错误类型
    const isRetriableError = 
      firstError.code === 'ECONNREFUSED' ||
      firstError.code === 'ETIMEDOUT' ||
      firstError.code === 'ENOTFOUND' ||
      firstError.statusCode === 503 ||
      firstError.statusCode === 429;

    // 认证失败不重试
    if (firstError.statusCode === 401 || firstError.statusCode === 403) {
      console.error('[Moderation] 阿里云认证失败，执行降级策略');
      return applyFallbackStrategy(text);
    }

    // 可重试的错误，等待 1 秒后重试
    if (isRetriableError) {
      await sleep(1000);

      try {
        console.log('[Moderation] 第 2 次调用阿里云审核...');
        return await moderateContentInternal(text);
      } catch (secondError: any) {
        console.error('[Moderation] 第 2 次调用仍失败，执行降级策略', {
          error: secondError.message
        });
        return applyFallbackStrategy(text);
      }
    }

    // 不可重试的错误，直接降级
    console.error('[Moderation] 不可重试的错误，执行降级策略');
    return applyFallbackStrategy(text);
  }
}

/**
 * 从 Redis 或数据库加载敏感词库（可选，用于降级策略优化）
 * 生产环境应实现此函数
 */
export async function loadSensitiveKeywords(): Promise<string[]> {
  // TODO: 从 Redis 或数据库加载
  // const cached = await redis.get('sensitive_keywords');
  // if (cached) return JSON.parse(cached);
  
  // 暂时返回默认词库
  return FALLBACK_SENSITIVE_KEYWORDS;
}

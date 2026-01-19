// Spec: /docs/specs/deepseek-integration.md
// 说明: DeepSeek-V3 API 封装，提供统一的文本生成接口

import { AIServiceError } from '@/utils/error';

/**
 * DeepSeek 生成参数接口
 */
export interface DeepSeekParams {
  scenario: string;        // 业务场景
  tone: string;            // 语气
  language: string;        // 目标语言
  recipientName: string;   // 收件人姓名
  recipientRole: string;   // 收件人职位
  senderName?: string;     // 发件人姓名（可选）
  keyPoints: string;       // 核心要点
}

/**
 * DeepSeek API 响应接口
 */
interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 获取场景名称（中文）
 */
function getScenarioName(scenario: string): string {
  const scenarioMap: Record<string, string> = {
    'email': '商务邮件',
    'report': '工作汇报',
    'proposal': '项目提案',
    'notice': '正式公告'
  };
  return scenarioMap[scenario] || '商务邮件';
}

/**
 * 获取语气名称（中文）
 */
function getToneName(tone: string): string {
  const toneMap: Record<string, string> = {
    'formal': '正式、严谨',
    'friendly': '友好、亲切',
    'urgent': '紧急、简洁',
    'humorous': '轻松、幽默'
  };
  return toneMap[tone] || '正式';
}

/**
 * 获取语言名称
 */
function getLanguageName(language: string): string {
  const languageMap: Record<string, string> = {
    'zh-CN': '简体中文',
    'en-US': 'English',
    'zh-TW': '繁體中文',
    'ja-JP': '日本語',
    'ko-KR': '한국어'
  };
  return languageMap[language] || '简体中文';
}

/**
 * 构建系统消息（System Message）
 */
function buildSystemMessage(params: DeepSeekParams): string {
  return `你是一位专业的商务写作助手，擅长撰写各类商务邮件和文档。
请根据用户提供的信息，生成一份${getScenarioName(params.scenario)}。

要求：
1. 语气：${getToneName(params.tone)}
2. 语言：${getLanguageName(params.language)}
3. 格式：专业、清晰、结构化
4. 长度：适中（200-500 字）
5. 不要添加额外的称谓或签名，直接输出正文内容;
6. 不得使用markdown格式,直接输出纯文本`;
}

/**
 * 构建用户消息（User Message）
 */
function buildUserMessage(params: DeepSeekParams): string {
  // 基础信息
  let message = `请为我撰写一份${getScenarioName(params.scenario)}：

**收件人信息**：
- 姓名：${params.recipientName}
- 职位/背景：${params.recipientRole}
`;

  // 如果提供了发件人姓名，增加到 Prompt 中
  if (params.senderName && params.senderName.trim()) {
    message += `
**发件人信息**：
- 姓名：${params.senderName}
`;
  }

  // 核心要点
  message += `
**核心要点**：
${params.keyPoints}

请直接输出邮件正文内容`;

  // 如果提供了发件人姓名，提示 AI 在结尾使用
  if (params.senderName && params.senderName.trim()) {
    message += `，并在结尾处使用发件人姓名作为签名`;
  }

  message += `。`;

  return message;
}

/**
 * 脱敏处理 API Key（用于日志）
 */
function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.slice(0, 3)}***${key.slice(-4)}`;
}

/**
 * 延迟函数（用于重试）
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * DeepSeek API 内部调用（单次）
 */
async function callDeepSeekInternal(params: DeepSeekParams): Promise<string> {
  // 检查环境变量
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new AIServiceError('DeepSeek API Key 未配置');
  }

  if (!process.env.DEEPSEEK_API_URL) {
    throw new AIServiceError('DeepSeek API URL 未配置');
  }

  // 构建 Prompt
  const systemMessage = buildSystemMessage(params);
  const userMessage = buildUserMessage(params);

  // 构建请求体
  const requestBody = {
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage }
    ],
    temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7'),
    max_tokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '2000'),
    stream: false // 非流式模式
  };

  // 记录日志（脱敏）
  console.log('[DeepSeek] 开始调用 API...', {
    model: requestBody.model,
    scenario: params.scenario,
    tone: params.tone,
    language: params.language,
    apiKey: maskApiKey(process.env.DEEPSEEK_API_KEY),
    timestamp: new Date().toISOString()
  });

  const startTime = Date.now();

  try {
    // 发起 HTTP 请求
    const timeout = parseInt(process.env.DEEPSEEK_TIMEOUT || '45000');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(process.env.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // 检查 HTTP 状态码
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DeepSeek] API 返回错误:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      // 根据状态码处理
      switch (response.status) {
        case 401:
          throw new AIServiceError('DeepSeek API 认证失败，请检查 API Key');
        case 429:
          throw new Error('DeepSeek 请求频率超限');
        case 503:
          throw new Error('DeepSeek 服务暂时不可用');
        default:
          throw new Error(`DeepSeek API 返回错误: ${response.status}`);
      }
    }

    // 解析响应
    const data: DeepSeekResponse = await response.json();

    // 检查响应结构
    if (!data.choices || data.choices.length === 0) {
      console.error('[DeepSeek] 响应结构异常:', data);
      throw new Error('DeepSeek API 返回结果为空');
    }

    // 提取生成内容
    const generatedContent = data.choices[0].message.content.trim();

    // 记录成功日志
    const duration = Date.now() - startTime;
    console.log('[DeepSeek] API 调用成功', {
      contentLength: generatedContent.length,
      tokens: data.usage?.total_tokens || 0,
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      duration: `${duration}ms`
    });

    return generatedContent;

  } catch (error: unknown) {
    const duration = Date.now() - startTime;

    // 类型守卫：检查是否为 Error 对象
    const isError = error instanceof Error;
    
    // 类型守卫：检查是否有 code 属性（网络错误）
    const hasCode = typeof error === 'object' && error !== null && 'code' in error;
    
    // 处理超时错误
    if (isError && error.name === 'AbortError') {
      console.error('[DeepSeek] 请求超时', { duration: `${duration}ms` });
      throw new AIServiceError('AI 生成超时，请重试');
    }

    // 处理网络错误
    if (hasCode) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'ECONNREFUSED' || errorCode === 'ENOTFOUND') {
        const errorMessage = isError ? error.message : '网络错误';
        console.error('[DeepSeek] 网络连接失败', { error: errorMessage });
        throw new AIServiceError('无法连接到 DeepSeek 服务');
      }
    }

    // 抛出原始错误
    throw error;
  }
}

/**
 * 调用 DeepSeek-V3 生成文本内容（带重试机制）
 * 
 * @param params - 生成参数
 * @returns 生成的文本内容
 * @throws AIServiceError - API 调用失败
 */
export async function callDeepSeek(params: DeepSeekParams): Promise<string> {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[DeepSeek] 尝试调用 (${attempt}/${maxRetries})`);
      return await callDeepSeekInternal(params);
    } catch (error: unknown) {
      // 安全地提取错误信息
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      console.error(`[DeepSeek] 第 ${attempt} 次调用失败:`, errorMessage);

      // 最后一次尝试失败，直接抛出错误
      if (attempt === maxRetries) {
        console.error('[DeepSeek] 所有重试均失败');
        throw new AIServiceError('DeepSeek API 调用失败，请稍后重试');
      }

      // 判断是否需要重试
      const shouldRetry = 
        errorMessage.includes('频率超限') ||
        errorMessage.includes('暂时不可用') ||
        errorMessage.includes('网络') ||
        errorMessage.includes('超时');

      if (!shouldRetry) {
        // 不可重试的错误（如认证失败），直接抛出
        throw error;
      }

      // 指数退避重试（2s, 4s, 8s）
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`[DeepSeek] 等待 ${delay}ms 后重试...`);
      await sleep(delay);
    }
  }

  // 理论上不会到达这里
  throw new AIServiceError('DeepSeek API 调用失败');
}

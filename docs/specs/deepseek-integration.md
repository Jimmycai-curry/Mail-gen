# DeepSeek API 集成规范

## Spec 概述

本规范描述如何封装 DeepSeek-V3 API，为 FluentWJ 提供稳定、可靠的 AI 文本生成能力。

**文档版本**: v1.0  
**创建日期**: 2025-01-19  
**相关文件**:
- `lib/deepseek.ts` - DeepSeek API 封装实现
- `services/aiService.ts` - 调用方

---

## 功能描述

封装 DeepSeek-V3 API 调用逻辑，提供统一的文本生成接口。包含：
1. 环境变量配置
2. Prompt 构建策略
3. HTTP 请求封装
4. 超时控制与重试机制
5. 错误处理与日志记录

---

## 接口定义

### 主函数签名

```typescript
/**
 * 调用 DeepSeek-V3 生成文本内容
 * @param params - 生成参数
 * @returns 生成的文本内容
 * @throws AIServiceError - API 调用失败
 */
export async function callDeepSeek(params: DeepSeekParams): Promise<string>
```

### 参数接口

```typescript
interface DeepSeekParams {
  scenario: string;        // 业务场景
  tone: string;            // 语气
  language: string;        // 目标语言
  recipientName: string;   // 收件人姓名
  recipientRole: string;   // 收件人职位
  keyPoints: string;       // 核心要点
}
```

### 返回值

**成功**: 返回生成的完整邮件内容（纯文本）

**失败**: 抛出 `AIServiceError` 异常

---

## 环境变量配置

### 必需变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-xxxxxxxxxxxxxxxx` |
| `DEEPSEEK_API_URL` | API 端点地址 | `https://api.deepseek.com/v1/chat/completions` |

### 可选变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DEEPSEEK_MODEL` | 模型名称 | `deepseek-chat` |
| `DEEPSEEK_MAX_TOKENS` | 最大生成 Token 数 | `2000` |
| `DEEPSEEK_TEMPERATURE` | 温度参数（创造性） | `0.7` |
| `DEEPSEEK_TIMEOUT` | 请求超时时间（毫秒） | `45000` |

### 配置示例

在 `.env` 文件中添加：

```bash
# DeepSeek API 配置
DEEPSEEK_API_KEY=sk-your-api-key-here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_MAX_TOKENS=2000
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_TIMEOUT=45000
```

---

## Prompt 构建策略

### Prompt 模板

根据不同的 `scenario` 和 `tone`，构建结构化的 Prompt。

#### 系统消息（System Message）

```typescript
const systemMessage = `你是一位专业的商务写作助手，擅长撰写各类商务邮件和文档。
请根据用户提供的信息，生成一份${getScenarioName(scenario)}。

要求：
1. 语气：${getToneName(tone)}
2. 语言：${getLanguageName(language)}
3. 格式：专业、清晰、结构化
4. 长度：适中（200-500 字）
5. 不要添加额外的称谓或签名，直接输出正文内容
`;
```

#### 用户消息（User Message）

```typescript
const userMessage = `请为我撰写一份${getScenarioName(scenario)}：

**收件人信息**：
- 姓名：${recipientName}
- 职位/背景：${recipientRole}

**核心要点**：
${keyPoints}

请直接输出邮件正文内容。`;
```

### 场景映射

```typescript
function getScenarioName(scenario: string): string {
  const scenarioMap: Record<string, string> = {
    'email': '商务邮件',
    'report': '工作汇报',
    'proposal': '项目提案',
    'notice': '正式公告'
  };
  return scenarioMap[scenario] || '商务邮件';
}
```

### 语气映射

```typescript
function getToneName(tone: string): string {
  const toneMap: Record<string, string> = {
    'formal': '正式、严谨',
    'friendly': '友好、亲切',
    'urgent': '紧急、简洁',
    'humorous': '轻松、幽默'
  };
  return toneMap[tone] || '正式';
}
```

### 语言映射

```typescript
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
```

---

## HTTP 请求封装

### 请求格式

```typescript
// DeepSeek API 请求结构
interface DeepSeekRequest {
  model: string;           // 模型名称
  messages: Message[];     // 消息列表
  temperature: number;     // 温度参数
  max_tokens: number;      // 最大 Token 数
  stream: false;           // 非流式模式
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

### 请求示例

```typescript
const requestBody: DeepSeekRequest = {
  model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  messages: [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage }
  ],
  temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7'),
  max_tokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '2000'),
  stream: false
};

const response = await fetch(process.env.DEEPSEEK_API_URL!, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
  },
  body: JSON.stringify(requestBody),
  signal: AbortSignal.timeout(parseInt(process.env.DEEPSEEK_TIMEOUT || '45000'))
});
```

### 响应格式

```typescript
interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
```

### 提取生成内容

```typescript
if (!response.ok) {
  throw new Error(`DeepSeek API 返回错误: ${response.status}`);
}

const data: DeepSeekResponse = await response.json();

if (!data.choices || data.choices.length === 0) {
  throw new Error('DeepSeek API 返回结果为空');
}

const generatedContent = data.choices[0].message.content.trim();
return generatedContent;
```

---

## 超时控制与重试机制

### 超时控制

**超时时间**: 45 秒

**实现方式**:
```typescript
// 使用 AbortSignal.timeout() 控制超时
const signal = AbortSignal.timeout(45000);

fetch(url, { signal });
```

### 重试机制

**重试次数**: 最多 3 次  
**重试间隔**: 2 秒（指数退避）

**实现逻辑**:
```typescript
async function callDeepSeekWithRetry(
  params: DeepSeekParams,
  retries = 3
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[DeepSeek] 尝试调用 (${attempt}/${retries})`);
      return await callDeepSeekInternal(params);
    } catch (error) {
      console.error(`[DeepSeek] 第 ${attempt} 次调用失败:`, error);
      
      // 最后一次尝试失败，直接抛出错误
      if (attempt === retries) {
        throw new AIServiceError('DeepSeek API 调用失败，请稍后重试');
      }
      
      // 等待后重试（指数退避）
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`[DeepSeek] 等待 ${delay}ms 后重试...`);
      await sleep(delay);
    }
  }
  
  throw new AIServiceError('DeepSeek API 调用失败');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

---

## 错误处理

### 错误分类

| 错误类型 | HTTP 状态码 | 处理方式 |
|---------|------------|---------|
| API Key 无效 | 401 | 抛出异常，记录日志 |
| 请求超时 | - | 自动重试 |
| 服务不可用 | 503 | 自动重试 |
| Token 超限 | 429 | 等待后重试 |
| 参数错误 | 400 | 抛出异常，记录日志 |
| 内部错误 | 500 | 自动重试 |

### 错误处理示例

```typescript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    switch (response.status) {
      case 401:
        console.error('[DeepSeek] API Key 无效');
        throw new AIServiceError('API 认证失败');
      
      case 429:
        console.warn('[DeepSeek] 请求频率超限');
        await sleep(2000);
        throw new Error('Rate limit exceeded');
      
      case 503:
        console.warn('[DeepSeek] 服务暂时不可用');
        throw new Error('Service unavailable');
      
      default:
        console.error(`[DeepSeek] API 返回错误: ${response.status}`);
        throw new Error(`API error: ${response.status}`);
    }
  }
  
  // 解析响应...
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('[DeepSeek] 请求超时');
    throw new AIServiceError('AI 生成超时，请重试');
  }
  
  console.error('[DeepSeek] 调用失败:', error);
  throw error;
}
```

---

## 日志记录

### 日志级别

| 级别 | 说明 | 示例 |
|------|------|------|
| INFO | 正常调用信息 | `[DeepSeek] 开始调用 API...` |
| WARN | 警告（重试） | `[DeepSeek] 第 1 次调用失败，准备重试` |
| ERROR | 错误（失败） | `[DeepSeek] API 调用失败: 401 Unauthorized` |

### 日志内容

**调用前**:
```typescript
console.log('[DeepSeek] 开始调用 API...', {
  scenario: params.scenario,
  tone: params.tone,
  language: params.language,
  timestamp: new Date().toISOString()
});
```

**调用成功**:
```typescript
console.log('[DeepSeek] API 调用成功', {
  contentLength: result.length,
  tokens: usage.total_tokens,
  duration: Date.now() - startTime
});
```

**调用失败**:
```typescript
console.error('[DeepSeek] API 调用失败', {
  attempt: currentAttempt,
  error: error.message,
  statusCode: response?.status
});
```

---

## Token 计费统计（可选）

### 统计字段

```typescript
interface TokenUsage {
  promptTokens: number;      // 输入 Token 数
  completionTokens: number;  // 输出 Token 数
  totalTokens: number;       // 总 Token 数
  cost: number;              // 预估成本（元）
}
```

### 成本计算

**DeepSeek-V3 价格**（2025年1月）:
- Input: ¥0.001 / 1K tokens
- Output: ¥0.002 / 1K tokens

```typescript
function calculateCost(usage: Usage): number {
  const inputCost = (usage.prompt_tokens / 1000) * 0.001;
  const outputCost = (usage.completion_tokens / 1000) * 0.002;
  return inputCost + outputCost;
}
```

### 统计记录（可选）

可以将 Token 使用情况记录到数据库：

```typescript
// 扩展 audit_logs 表（可选）
await prisma.audit_logs.update({
  where: { id: auditLogId },
  data: {
    prompt_tokens: usage.prompt_tokens,
    completion_tokens: usage.completion_tokens,
    total_tokens: usage.total_tokens
  }
});
```

---

## 性能优化

### 1. 连接池复用

```typescript
// 复用 HTTP 连接（Node.js 自动处理）
import { Agent } from 'https';

const agent = new Agent({
  keepAlive: true,
  maxSockets: 10
});

fetch(url, { agent });
```

### 2. 响应缓存（可选）

对于相同的输入参数，可以缓存响应结果（需评估合理性）：

```typescript
import { createHash } from 'crypto';

function getCacheKey(params: DeepSeekParams): string {
  const data = JSON.stringify(params);
  return createHash('md5').update(data).digest('hex');
}

// 使用 Redis 缓存
const cacheKey = getCacheKey(params);
const cached = await redis.get(cacheKey);
if (cached) {
  return cached;
}

const result = await callDeepSeekInternal(params);
await redis.set(cacheKey, result, 'EX', 3600); // 缓存 1 小时
return result;
```

---

## 测试建议

### 单元测试

```typescript
describe('DeepSeek API', () => {
  it('应该成功生成邮件内容', async () => {
    const params: DeepSeekParams = {
      scenario: 'email',
      tone: 'formal',
      language: 'zh-CN',
      recipientName: '张先生',
      recipientRole: '采购总监',
      keyPoints: '询问产品报价'
    };
    
    const result = await callDeepSeek(params);
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(50);
  });
  
  it('应该在 API Key 无效时抛出错误', async () => {
    // Mock 401 响应
    await expect(callDeepSeek(params)).rejects.toThrow('API 认证失败');
  });
  
  it('应该在超时后重试', async () => {
    // Mock 超时场景
    // 验证重试逻辑
  });
});
```

### 集成测试

```bash
# 测试真实 API 调用（需要有效的 API Key）
npm run test:integration -- deepseek
```

---

## 安全注意事项

### 1. API Key 保护

- ❌ **禁止**在代码中硬编码 API Key
- ✅ **必须**使用环境变量 (`process.env.DEEPSEEK_API_KEY`)
- ✅ **必须**在 `.gitignore` 中排除 `.env` 文件

### 2. 敏感信息处理

- ❌ **禁止**在日志中打印完整的 API Key
- ✅ **必须**在日志中脱敏处理：`sk-***********1234`

```typescript
function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.slice(0, 3)}***${key.slice(-4)}`;
}

console.log('[DeepSeek] 使用 API Key:', maskApiKey(process.env.DEEPSEEK_API_KEY!));
```

### 3. 请求限流

建议在应用层实现限流（防止恶意调用）：

```typescript
// 使用 Redis 实现简单限流
async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `ratelimit:deepseek:${userId}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 60); // 1 分钟窗口
  }
  
  return count <= 10; // 每分钟最多 10 次
}
```

---

## 故障排查

### 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 401 Unauthorized | API Key 无效或过期 | 检查环境变量配置 |
| 429 Too Many Requests | 请求频率超限 | 增加重试间隔 |
| 超时 | 网络不稳定或 API 响应慢 | 增加超时时间 |
| 返回内容为空 | Prompt 格式错误 | 检查 Prompt 构建逻辑 |
| 格式错误 | 响应 JSON 解析失败 | 检查 API 返回结构 |

### 调试技巧

**开启详细日志**:
```bash
DEBUG=deepseek npm run dev
```

**查看完整请求**:
```typescript
if (process.env.DEBUG === 'deepseek') {
  console.log('[DeepSeek] 请求详情:', {
    url: process.env.DEEPSEEK_API_URL,
    model: process.env.DEEPSEEK_MODEL,
    messages: requestBody.messages
  });
}
```

---

## 版本兼容性

| DeepSeek API 版本 | 本规范版本 | 兼容性 |
|------------------|-----------|--------|
| v1 | v1.0 | ✅ 完全兼容 |
| v2（未来） | 待更新 | ⚠️ 需评估 |

---

## 后续优化方向

1. **流式输出支持**：实现 SSE 流式传输（需配合前端）
2. **多模型支持**：支持切换不同的 DeepSeek 模型
3. **智能降级**：API 不可用时自动切换到备用模型
4. **A/B 测试**：对比不同 Prompt 策略的生成效果
5. **性能监控**：接入 APM 工具监控调用性能

---

## 验收标准

- [x] 环境变量配置清晰
- [x] Prompt 构建策略合理
- [x] HTTP 请求封装完整
- [x] 超时控制与重试机制完善
- [x] 错误处理覆盖所有场景
- [x] 日志记录详细且脱敏
- [x] 代码注释完整（中文）

---

**文档维护**：本规范与 `lib/deepseek.ts` 实现保持同步。

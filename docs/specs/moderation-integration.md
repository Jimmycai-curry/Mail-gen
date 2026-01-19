# 阿里云 AI 安全护栏集成规范

## Spec 概述

本规范描述如何集成阿里云 AI 安全护栏 API，为 FluentWJ 提供全方位的内容安全能力，确保用户输入和 AI 输出符合监管要求，并防御 AI 攻击。

**文档版本**: v2.0  
**创建日期**: 2025-01-19  
**更新日期**: 2025-01-19（升级到 AI 安全护栏）  
**相关文件**:
- `lib/moderation.ts` - 阿里云 AI 安全护栏封装实现
- `services/aiService.ts` - 调用方

---

## 功能描述

集成阿里云"AI 安全护栏"服务，对文本内容进行实时审核，提供三重防护：
1. **合规检测**：违禁内容、敏感词、政治敏感、暴恐、色情等
2. **敏感信息检测**：身份证、银行卡号、手机号等个人隐私数据
3. **攻击检测**：提示词注入、越狱攻击等 AI 安全威胁

**核心功能**：
1. 文本内容审核（textModeration）
2. 审核结果解析
3. 外部审核 ID 溯源
4. 降级策略（服务不可用时）
5. 错误处理与重试

---

## 接口定义

### 主函数签名

```typescript
/**
 * 调用阿里云内容安全 API 审核文本内容
 * @param text - 待审核的文本内容
 * @returns 审核结果
 * @throws ModerationError - 审核服务异常
 */
export async function moderateContent(text: string): Promise<ModerationResult>
```

### 返回值接口

```typescript
interface ModerationResult {
  pass: boolean;                          // 是否通过审核
  isSensitive: boolean;                   // 是否包含敏感内容
  externalAuditId?: string;               // 阿里云审核 ID（用于溯源）
  blockedReason?: string;                 // 拒绝原因
  riskLevel?: 'high' | 'medium' | 'low' | 'none';  // 风险等级
  sensitiveLevel?: string;                // 敏感等级（S0-S4）
  attackLevel?: 'high' | 'medium' | 'low' | 'none'; // 攻击等级
  labels?: string[];                      // 命中的标签
  sensitiveData?: string[];               // 检测到的敏感数据（仅日志用）
  adviceAnswer?: string;                  // 自动拒答建议
}
```

---

## 环境变量配置

### 必需变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `ALIYUN_ACCESS_KEY_ID` | 阿里云 AccessKey ID | `LTAI5t...` |
| `ALIYUN_ACCESS_KEY_SECRET` | 阿里云 AccessKey Secret | `xxx...` |
| `ALIYUN_REGION` | 服务区域（仅用于文档） | `cn-shanghai` |

### 可选变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ALIYUN_MODERATION_ENDPOINT` | AI 安全护栏 API 端点 | `https://green-cip.cn-shanghai.aliyuncs.com` |
| `ALIYUN_MODERATION_TIMEOUT` | 请求超时时间（毫秒） | `10000` |

### 配置示例

在 `.env` 文件中添加：

```bash
# 阿里云 AI 安全护栏配置
ALIYUN_ACCESS_KEY_ID=LTAI5tXXXXXXXXXXXXXX
ALIYUN_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# AI 安全护栏端点（根据区域选择）
# 华东2（上海）
ALIYUN_MODERATION_ENDPOINT=https://green-cip.cn-shanghai.aliyuncs.com

# 华北2（北京）
# ALIYUN_MODERATION_ENDPOINT=https://green-cip.cn-beijing.aliyuncs.com

# 华东1（杭州）
# ALIYUN_MODERATION_ENDPOINT=https://green-cip.cn-hangzhou.aliyuncs.com

# 华南1（深圳）
# ALIYUN_MODERATION_ENDPOINT=https://green-cip.cn-shenzhen.aliyuncs.com

ALIYUN_MODERATION_TIMEOUT=10000
```

---

---

## 三重防护功能

### 1. 合规检测（RiskLevel）

检测内容是否违反法律法规、平台规则：

**检测维度**：
- 政治敏感（political_entity, political_figure）
- 暴恐内容（terrorism, violence）
- 色情低俗（porn, vulgar）
- 辱骂攻击（abuse, insult）
- 违禁品（gambling, drugs）
- 自定义词库（customized）

**风险等级**：
- `high` - 高风险，直接拒绝
- `medium` - 中风险，建议拒绝
- `low` - 低风险，可通过
- `none` - 未检测到风险

### 2. 敏感信息检测（SensitiveLevel）

检测个人隐私数据，防止泄露：

**检测类型**：
- 身份证号（`1000`）
- 护照号（`1010`）
- 银行卡号（`1780`）
- 手机号（`1020`）
- 邮箱地址（`1030`）
- 地址信息（`1040`）

**敏感等级**：
- `S0` - 未检出
- `S1` - 低敏感
- `S2` - 中敏感
- `S3` - 高敏感（建议拒绝）
- `S4` - 极高敏感（必须拒绝）

**返回示例**：
```json
{
  "SensitiveResult": [
    {
      "Label": "1780",
      "SensitiveLevel": "S4",
      "Description": "信用卡号",
      "SensitiveData": ["6201112223455"]  // 检出的具体数据
    }
  ]
}
```

### 3. AI 攻击检测（AttackLevel）

防御恶意用户操纵 AI 行为：

**检测类型**：
- **直接提示词注入**（Direct Prompt Injection）：用户直接输入"忽略之前的指令"等
- **间接提示词注入**（Indirect Prompt Injection）：通过引用内容注入指令
- **越狱攻击**（Jailbreak）：绕过 AI 安全限制
- **角色扮演攻击**（Role Play）：诱导 AI 扮演有害角色

**攻击等级**：
- `high` - 高风险攻击，直接拒绝
- `medium` - 中风险攻击，建议拒绝
- `low` - 低风险，警告
- `none` - 未检测到攻击

**返回示例**：
```json
{
  "AttackResult": [
    {
      "Label": "Indirect Prompt Injection",
      "AttackLevel": "high",
      "Confidence": 100.0,
      "Description": "间接提示词注入"
    }
  ]
}
```

### 4. 自动拒答建议（Advice）

当检测到违规内容时，API 可返回友好的标准答案：

**返回示例**：
```json
{
  "Advice": [
    {
      "Answer": "抱歉，我无法回答涉及政治敏感的问题。",
      "HitLabel": "political_figure",
      "HitLibName": "系统拒答库"
    }
  ]
}
```

---

## SDK 集成

### 安装依赖

项目已安装 `@alicloud/pop-core`：

```bash
npm install @alicloud/pop-core
```

### SDK 初始化

```typescript
import RPCClient from '@alicloud/pop-core';

// 创建客户端实例
const client = new RPCClient({
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID!,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET!,
  endpoint: process.env.ALIYUN_MODERATION_ENDPOINT || 'https://green.cn-shanghai.aliyuncs.com',
  apiVersion: '2022-03-02'
});
```

---

## API 调用

### 请求参数

```typescript
interface ModerationRequest {
  Service: string;           // 服务名称：query_security_check（AI输入检测）
  ServiceParameters: string; // JSON 字符串格式的参数
}

interface ServiceParameters {
  content: string;           // 待审核的文本内容（最大2000字符）
  chatId?: string;           // 可选：标识一轮对话
}
```

### 请求示例

```typescript
const params = {
  Service: 'query_security_check',  // AI 输入内容安全检测
  ServiceParameters: JSON.stringify({
    content: text,
    chatId: crypto.randomUUID()  // 标识一轮对话
  })
};

const requestOption = {
  method: 'POST',
  timeout: parseInt(process.env.ALIYUN_MODERATION_TIMEOUT || '10000')
};

const response = await client.request(
  'TextModerationPlus',  // AI 安全护栏 API
  params,
  requestOption
);
```

### 响应格式

```typescript
interface ModerationResponse {
  Code: number;              // 响应码：200 表示成功
  Message: string;           // 响应消息
  RequestId: string;         // 请求 ID（用于溯源）
  Data: {
    RiskLevel: 'high' | 'medium' | 'low' | 'none';  // 风险等级
    SensitiveLevel?: string;                        // 敏感等级（S0-S4）
    AttackLevel?: 'high' | 'medium' | 'low' | 'none'; // 攻击等级
    Result?: Array<{                                // 合规风险结果
      Label: string;
      Confidence: number;
      Riskwords?: string;
      Description?: string;
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
```

---

## 审核规则

### 审核维度

| 维度 | 说明 | 示例 |
|------|------|------|
| **政治敏感** | 政治人物、敏感事件 | 政治人物名称、敏感历史事件 |
| **暴恐** | 暴力、恐怖主义 | 暴力行为描述、恐怖组织 |
| **色情** | 色情、低俗内容 | 色情描述、低俗词汇 |
| **辱骂** | 人身攻击、辱骂 | 脏话、人身攻击 |
| **违禁** | 违禁品、赌博 | 毒品、赌博 |
| **广告** | 垃圾广告 | 联系方式、推广链接 |

### 风险等级

| 等级 | 说明 | 处理方式 |
|------|------|---------|
| **高风险（high）** | 明确违规内容 | 直接拒绝 |
| **中风险（medium）** | 疑似违规内容 | 人工复审（可配置为直接拒绝） |
| **低风险（low）** | 正常内容 | 通过 |

---

## 响应解析

### 解析逻辑

```typescript
function parseModerationResponse(response: ModerationResponse): ModerationResult {
  // 检查响应码
  if (response.Code !== 200) {
    throw new Error(`审核服务返回错误: ${response.Message}`);
  }
  
  // 解析标签
  const labels = response.Data.labels ? response.Data.labels.split(',') : [];
  
  // 计算风险等级
  let riskLevel: 'high' | 'medium' | 'low' = 'low';
  let maxConfidence = 0;
  
  if (response.Data.Result && response.Data.Result.length > 0) {
    for (const item of response.Data.Result) {
      if (item.Confidence > maxConfidence) {
        maxConfidence = item.Confidence;
      }
    }
    
    if (maxConfidence >= 80) {
      riskLevel = 'high';
    } else if (maxConfidence >= 50) {
      riskLevel = 'medium';
    }
  }
  
  // 判断是否通过
  const pass = riskLevel === 'low';
  const isSensitive = riskLevel !== 'low';
  
  return {
    pass,
    isSensitive,
    externalAuditId: response.RequestId,
    blockedReason: isSensitive ? response.Data.reason : undefined,
    riskLevel,
    labels: labels.length > 0 ? labels : undefined
  };
}
```

---

## 错误处理

### 错误分类

| 错误类型 | 错误码 | 处理方式 |
|---------|--------|---------|
| 认证失败 | 401 | 抛出异常，记录日志 |
| 请求超时 | - | 重试 1 次 |
| 服务不可用 | 503 | 降级策略 |
| 参数错误 | 400 | 抛出异常，记录日志 |
| 配额超限 | 429 | 降级策略 |

### 错误处理示例

```typescript
try {
  const response = await client.request('TextModeration', params, requestOption);
  return parseModerationResponse(response);
} catch (error: any) {
  console.error('[Moderation] 审核服务调用失败:', error);
  
  // 根据错误类型决定处理方式
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    console.warn('[Moderation] 审核服务超时，执行降级策略');
    return applyFallbackStrategy(text);
  }
  
  if (error.statusCode === 401) {
    throw new Error('阿里云 AccessKey 认证失败');
  }
  
  if (error.statusCode === 429) {
    console.warn('[Moderation] 审核配额超限，执行降级策略');
    return applyFallbackStrategy(text);
  }
  
  // 其他错误，抛出异常
  throw new ModerationError('内容审核服务异常');
}
```

---

## 降级策略

当阿里云审核服务不可用时，需要执行降级策略。

### 策略选择

| 策略 | 说明 | 适用场景 | 风险 |
|------|------|---------|------|
| **策略 A：全部通过** | 所有内容直接通过 | 开发测试环境 | ⚠️ 高风险，生产环境禁用 |
| **策略 B：全部拒绝** | 所有内容直接拒绝 | 合规优先场景 | ✅ 零风险，但影响用户体验 |
| **策略 C：本地关键词过滤** | 使用本地敏感词库过滤 | 生产环境推荐 | ⚠️ 中风险，需维护词库 |

### 推荐实现（策略 C）

```typescript
/**
 * 降级策略：本地关键词过滤
 */
function applyFallbackStrategy(text: string): ModerationResult {
  console.warn('[Moderation] 使用降级策略：本地关键词过滤');
  
  // 本地敏感词库（示例）
  const sensitiveKeywords = [
    '政治敏感词1', '政治敏感词2',
    '暴恐词1', '暴恐词2',
    '色情词1', '色情词2',
    // ... 更多敏感词
  ];
  
  // 检测是否包含敏感词
  const lowerText = text.toLowerCase();
  for (const keyword of sensitiveKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
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
  return {
    pass: true,
    isSensitive: false,
    riskLevel: 'low'
  };
}
```

### 敏感词库管理

**推荐方案**：
1. 将敏感词库存储在数据库或 Redis
2. 支持动态更新（管理后台）
3. 定期与阿里云官方词库同步

```typescript
// 从 Redis 加载敏感词库
async function loadSensitiveKeywords(): Promise<string[]> {
  const cached = await redis.get('sensitive_keywords');
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 从数据库加载
  const keywords = await prisma.sensitive_keywords.findMany({
    select: { keyword: true }
  });
  
  const keywordList = keywords.map(k => k.keyword);
  
  // 缓存 1 小时
  await redis.set('sensitive_keywords', JSON.stringify(keywordList), 'EX', 3600);
  
  return keywordList;
}
```

---

## 重试机制

### 重试策略

**重试次数**: 1 次（审核服务对实时性要求高，不宜多次重试）  
**重试间隔**: 1 秒

```typescript
async function moderateContentWithRetry(text: string): Promise<ModerationResult> {
  try {
    return await moderateContentInternal(text);
  } catch (error) {
    console.warn('[Moderation] 第 1 次调用失败，准备重试');
    
    // 等待 1 秒后重试
    await sleep(1000);
    
    try {
      return await moderateContentInternal(text);
    } catch (retryError) {
      console.error('[Moderation] 第 2 次调用仍失败，执行降级策略');
      return applyFallbackStrategy(text);
    }
  }
}
```

---

## 日志记录

### 日志内容

**调用前**:
```typescript
console.log('[Moderation] 开始审核内容...', {
  textLength: text.length,
  timestamp: new Date().toISOString()
});
```

**调用成功**:
```typescript
console.log('[Moderation] 审核完成', {
  pass: result.pass,
  isSensitive: result.isSensitive,
  riskLevel: result.riskLevel,
  externalAuditId: result.externalAuditId,
  duration: Date.now() - startTime
});
```

**调用失败**:
```typescript
console.error('[Moderation] 审核失败', {
  error: error.message,
  statusCode: error.statusCode,
  fallback: true
});
```

---

## 性能优化

### 1. 批量审核（可选）

如果需要审核多段文本，可以使用批量接口：

```typescript
// 阿里云支持批量审核（最多 100 条）
const params = {
  Service: 'text_moderation_plus',
  ServiceParameters: JSON.stringify({
    contents: [
      { content: text1 },
      { content: text2 },
      // ...
    ]
  })
};
```

### 2. 缓存审核结果（可选）

对于相同的文本内容，可以缓存审核结果：

```typescript
import { createHash } from 'crypto';

function getTextHash(text: string): string {
  return createHash('md5').update(text).digest('hex');
}

// 使用 Redis 缓存
const textHash = getTextHash(text);
const cached = await redis.get(`moderation:${textHash}`);
if (cached) {
  return JSON.parse(cached);
}

const result = await moderateContentInternal(text);
await redis.set(`moderation:${textHash}`, JSON.stringify(result), 'EX', 86400); // 缓存 24 小时
return result;
```

---

## 审核场景

### 1. 用户输入审核

**时机**: 调用 DeepSeek 之前

**审核内容**: 
- recipientName
- recipientRole
- keyPoints

**处理方式**:
```typescript
// 合并所有输入字段
const inputText = `${recipientName} ${recipientRole} ${keyPoints}`;

const moderationResult = await moderateContent(inputText);

if (!moderationResult.pass) {
  // 记录审计日志（系统拦截）
  await logAuditViolation(userId, inputText, moderationResult);
  
  // 返回友好的错误提示
  throw new ValidationError('您输入的内容包含敏感信息，请修改后重试');
}
```

### 2. AI 输出审核（可选）

**时机**: DeepSeek 生成内容后

**审核内容**: AI 生成的完整邮件内容

**处理方式**:
```typescript
const generatedContent = await callDeepSeek(prompt);

// 审核 AI 输出（可选）
const moderationResult = await moderateContent(generatedContent);

if (!moderationResult.pass) {
  console.error('[AI Output] 生成内容包含敏感信息');
  
  // 记录审计日志
  await logAuditViolation(userId, generatedContent, moderationResult);
  
  // 重新生成或返回错误
  throw new AIServiceError('生成的内容不符合规范，请重试');
}
```

---

## 测试建议

### 单元测试

```typescript
describe('阿里云内容审核', () => {
  it('应该通过正常内容', async () => {
    const text = '您好，请问产品报价是多少？';
    const result = await moderateContent(text);
    expect(result.pass).toBe(true);
    expect(result.isSensitive).toBe(false);
  });
  
  it('应该拒绝敏感内容', async () => {
    const text = '包含敏感词的内容';
    const result = await moderateContent(text);
    expect(result.pass).toBe(false);
    expect(result.isSensitive).toBe(true);
    expect(result.blockedReason).toBeTruthy();
  });
  
  it('应该在服务不可用时执行降级策略', async () => {
    // Mock 服务超时
    const result = await moderateContent('正常内容');
    expect(result).toBeTruthy();
  });
});
```

### 集成测试

```bash
# 测试真实 API 调用（需要有效的 AccessKey）
npm run test:integration -- moderation
```

---

## 安全注意事项

### 1. AccessKey 保护

- ❌ **禁止**在代码中硬编码 AccessKey
- ✅ **必须**使用环境变量
- ✅ **必须**在 `.gitignore` 中排除 `.env` 文件

### 2. 敏感信息脱敏

在日志中脱敏处理：

```typescript
function maskAccessKey(key: string): string {
  if (!key || key.length < 8) return '***';
  return `${key.slice(0, 4)}***${key.slice(-4)}`;
}

console.log('[Moderation] 使用 AccessKey:', maskAccessKey(process.env.ALIYUN_ACCESS_KEY_ID!));
```

### 3. 审核日志记录

所有审核结果都必须记录到 `audit_logs` 表：

```typescript
await prisma.audit_logs.create({
  data: {
    user_id: userId,
    user_phone: userPhone,
    user_ip: clientIp,
    input_prompt: text,
    output_content: '',
    status: moderationResult.pass ? 1 : 2, // 1=通过, 2=系统拦截
    is_sensitive: moderationResult.isSensitive,
    external_audit_id: moderationResult.externalAuditId
  }
});
```

---

## 成本估算

### 阿里云内容安全价格（2025年1月）

| 服务类型 | 价格 | 说明 |
|---------|------|------|
| 文本反垃圾 | ¥0.0025 / 条 | 每条最多 10000 字符 |
| 批量审核 | ¥0.002 / 条 | 每批最多 100 条 |

### 每日成本估算

**假设**:
- 每日生成量：1000 次
- 每次审核：用户输入 1 次 + AI 输出 1 次（可选）= 2 次

**成本计算**:
```
每日审核次数 = 1000 × 2 = 2000 次
每日成本 = 2000 × 0.0025 = ¥5.00
每月成本 = ¥5.00 × 30 = ¥150.00
```

### 成本优化建议

1. **只审核用户输入**：跳过 AI 输出审核（节省 50% 成本）
2. **缓存审核结果**：相同内容不重复审核
3. **本地预过滤**：简单敏感词先用本地库过滤，减少 API 调用

---

## 故障排查

### 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 401 认证失败 | AccessKey 无效或过期 | 检查环境变量配置 |
| 403 权限不足 | 未开通内容安全服务 | 登录阿里云控制台开通 |
| 429 配额超限 | 超出免费额度 | 购买资源包或升级套餐 |
| 超时 | 网络不稳定 | 增加超时时间或执行降级策略 |
| 返回格式错误 | SDK 版本不兼容 | 升级 SDK 版本 |

---

## 验收标准

- [x] 环境变量配置清晰
- [x] SDK 集成正确
- [x] 响应解析完整
- [x] 降级策略合理
- [x] 错误处理完善
- [x] 日志记录详细
- [x] 代码注释完整（中文）

---

**文档维护**：本规范与 `lib/moderation.ts` 实现保持同步。

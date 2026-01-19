# 水印服务规范

## Spec 概述

本规范描述如何为 AI 生成的内容植入显式声明和隐式溯源水印，满足《互联网信息服务深度合成管理规定》的要求。

**文档版本**: v2.0  
**创建日期**: 2025-01-19  
**更新日期**: 2025-01-19（移除显式水印，改为 UI 提示）  
**相关文件**:
- `utils/watermark.ts` - 水印服务实现
- `services/aiService.ts` - 调用方
- `components/writing/ResultViewer.tsx` - 显式声明 UI

---

## 功能描述

为 AI 生成的商务内容植入隐式水印，配合页面 UI 显式声明：
1. **隐式水印**：使用零宽字符将 `auditToken` 编码并嵌入内容中（用户不可见）
2. **显式声明**：在页面 UI 中展示（"ℹ️ 由 FluentWJ 生成"），不在生成内容中重复

**核心目标**：
- 满足监管要求（深度合成标识）
- 实现内容溯源（通过 auditToken 追溯到审计日志）
- 保护用户隐私（auditToken 不以明文出现）
- 用户体验友好（不在内容中添加多余文本）

---

## 接口定义

### 1. 添加水印

```typescript
/**
 * 为内容添加隐式水印（零宽字符）
 * @param content - 原始内容
 * @param auditToken - 审计日志 UUID（用于溯源）
 * @returns 带隐式水印的内容
 */
export function addWatermark(content: string, auditToken: string): string
```

**示例**:
```typescript
const original = "尊敬的张先生，关于贵司的产品询价...";
const auditToken = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

const watermarked = addWatermark(original, auditToken);
// 输出：
// "尊敬的张先生[零宽字符]，关于贵司的产品询价..."
// 
// 注意：
// - 零宽字符在视觉上不可见
// - auditToken 不以明文形式出现
// - 页面 UI 会显示 "ℹ️ 由 FluentWJ 生成" 提示
```

---

### 2. 提取水印

```typescript
/**
 * 从内容中提取隐式水印（auditToken）
 * @param content - 带水印的内容
 * @returns 提取的 auditToken，如果不存在则返回 null
 */
export function extractWatermark(content: string): string | null
```

**用途**:
- 内容溯源（用户举报时）
- 验证内容来源

---

## 显式声明（UI 层面）

### 实现位置

**在页面 UI 中展示，而非生成内容中**：

```html
<div class="text-sm text-gray-500">
  ℹ️ 由 FluentWJ 生成。AI 算法提供内容，仅供参考。请在发送前核实关键信息。
</div>
```

### 设计理由

**为什么不在内容中添加显式水印**：

1. **用户体验** ⭐
   - 避免在生成内容中添加多余文本
   - 用户复制内容时不会带上水印

2. **隐私保护** 🔒
   - `auditToken` 是内部溯源标识，不应该暴露给用户
   - 避免泄露技术实现细节

3. **合规性** ✅
   - 监管要求"显著标识"，页面 UI 提示已满足
   - 不要求在生成内容本身中添加文本

4. **灵活性** 🎯
   - UI 提示可以随时更新，无需改变生成内容
   - 便于多语言支持

**结论**：显式声明通过页面 UI 实现，不修改生成内容。

---

## 隐式水印

### 技术原理

使用**零宽字符**（Zero-Width Characters）将 `auditToken` 编码并嵌入内容中。

### 零宽字符说明

| 字符 | Unicode | 说明 |
|------|---------|------|
| `\u200B` | U+200B | Zero Width Space（零宽空格） |
| `\u200C` | U+200C | Zero Width Non-Joiner（零宽非连接符） |
| `\u200D` | U+200D | Zero Width Joiner（零宽连接符） |

**特性**:
- 不可见（不影响视觉效果）
- 可复制（随内容一起传播）
- 部分客户端可能过滤（风险）

---

### 编码策略

#### 方案A：二进制编码（推荐）

将 `auditToken` 的每个字符转为二进制，使用两种零宽字符表示 0 和 1。

**编码规则**:
- `0` → `\u200B`（零宽空格）
- `1` → `\u200C`（零宽非连接符）
- 分隔符 → `\u200D`（零宽连接符）

**示例**:
```typescript
function encodeToZeroWidth(token: string): string {
  let encoded = '';
  
  for (const char of token) {
    const charCode = char.charCodeAt(0);
    const binary = charCode.toString(2).padStart(8, '0');
    
    for (const bit of binary) {
      encoded += bit === '0' ? '\u200B' : '\u200C';
    }
    
    encoded += '\u200D'; // 字符分隔符
  }
  
  return encoded;
}
```

**解码**:
```typescript
function decodeFromZeroWidth(encoded: string): string {
  const chars = encoded.split('\u200D').filter(c => c.length > 0);
  let decoded = '';
  
  for (const charBits of chars) {
    let binary = '';
    for (const bit of charBits) {
      binary += bit === '\u200B' ? '0' : '1';
    }
    
    const charCode = parseInt(binary, 2);
    decoded += String.fromCharCode(charCode);
  }
  
  return decoded;
}
```

---

#### 方案B：Base64编码（备选）

将 `auditToken` 转为 Base64，再使用零宽字符映射。

**优点**:
- 编码效率更高
- 字符集固定（64 个字符）

**缺点**:
- 实现复杂度稍高

```typescript
function encodeBase64ToZeroWidth(token: string): string {
  const base64 = Buffer.from(token).toString('base64');
  
  // 使用 3 种零宽字符表示 Base64 的 64 个字符
  const zeroWidthMap: Record<string, string> = {
    'A': '\u200B\u200B', 'B': '\u200B\u200C', // ...
    // 完整映射表（64 个字符）
  };
  
  let encoded = '';
  for (const char of base64) {
    encoded += zeroWidthMap[char] || '';
  }
  
  return encoded;
}
```

---

### 水印嵌入位置

**策略**：在内容的**前 100 个字符**中嵌入

**原因**:
- 提高提取成功率（用户通常复制开头部分）
- 避免被截断（邮件预览等）

**实现**:
```typescript
function embedInvisibleWatermark(content: string, watermark: string): string {
  // 在内容开头后的第一个句号后插入
  const sentenceEnd = content.indexOf('。') || content.indexOf('.') || 50;
  
  return content.slice(0, sentenceEnd + 1) + watermark + content.slice(sentenceEnd + 1);
}
```

---

## 完整实现

### addWatermark 函数

```typescript
export function addWatermark(content: string, auditToken: string): string {
  console.log('[Watermark] 添加水印...', { auditToken });
  
  // 1. 添加隐式水印（零宽字符）
  const invisibleWatermark = encodeToZeroWidth(auditToken);
  const contentWithInvisible = embedInvisibleWatermark(content, invisibleWatermark);
  
  // 2. 添加显式水印（可见声明）
  const contentWithBoth = addVisibleWatermark(contentWithInvisible, auditToken);
  
  console.log('[Watermark] 水印添加完成', {
    originalLength: content.length,
    finalLength: contentWithBoth.length,
    invisibleWatermarkLength: invisibleWatermark.length
  });
  
  return contentWithBoth;
}
```

---

### extractWatermark 函数

```typescript
export function extractWatermark(content: string): string | null {
  console.log('[Watermark] 提取水印...');
  
  try {
    // 1. 尝试提取显式水印
    const visibleMatch = content.match(/溯源标识：([a-f0-9\-]{36})/);
    if (visibleMatch) {
      console.log('[Watermark] 从显式水印提取成功:', visibleMatch[1]);
      return visibleMatch[1];
    }
    
    // 2. 尝试提取隐式水印
    const zeroWidthChars = content.match(/[\u200B\u200C\u200D]+/g);
    if (zeroWidthChars) {
      for (const encoded of zeroWidthChars) {
        try {
          const decoded = decodeFromZeroWidth(encoded);
          
          // 验证是否为有效的 UUID
          if (/^[a-f0-9\-]{36}$/.test(decoded)) {
            console.log('[Watermark] 从隐式水印提取成功:', decoded);
            return decoded;
          }
        } catch (e) {
          // 解码失败，继续尝试下一个
          continue;
        }
      }
    }
    
    console.warn('[Watermark] 未找到有效水印');
    return null;
  } catch (error) {
    console.error('[Watermark] 水印提取失败:', error);
    return null;
  }
}
```

---

## 兼容性考虑

### 零宽字符兼容性

| 平台/应用 | 支持情况 | 说明 |
|---------|---------|------|
| 现代浏览器 | ✅ 完全支持 | Chrome, Firefox, Safari, Edge |
| 微信 | ⚠️ 部分支持 | 可能被过滤 |
| 邮件客户端 | ⚠️ 不稳定 | Outlook 可能过滤 |
| Word/Excel | ✅ 支持 | Office 365 支持 |
| 纯文本编辑器 | ✅ 支持 | VS Code, Sublime Text |

### 降级策略

如果隐式水印被过滤，仍可通过显式水印溯源：

```typescript
// 优先使用隐式水印，失败则使用显式水印
const auditToken = extractWatermark(content) || extractVisibleWatermark(content);
```

---

## 安全性考虑

### 1. 防止水印被篡改

**风险**:
- 用户手动删除显式水印
- 用户使用工具清除零宽字符

**对策**:
- 双重水印（显式 + 隐式）
- 在审计日志中记录内容哈希（验证内容是否被修改）

```typescript
import { createHash } from 'crypto';

function calculateContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

// 在写入 audit_logs 时记录
await prisma.audit_logs.create({
  data: {
    // ...
    output_content: contentWithWatermark,
    content_hash: calculateContentHash(contentWithWatermark) // 新增字段
  }
});
```

---

### 2. 防止水印被伪造

**风险**:
- 恶意用户伪造 auditToken

**对策**:
- 使用 UUID v4（随机性强）
- 在数据库中验证 auditToken 的有效性

```typescript
// 验证 auditToken 是否存在
async function verifyWatermark(auditToken: string): Promise<boolean> {
  const log = await prisma.audit_logs.findUnique({
    where: { audit_token: auditToken }
  });
  
  return log !== null;
}
```

---

## 合规性说明

### 监管要求

根据《互联网信息服务深度合成管理规定》第十七条：

> 深度合成服务提供者应当在生成或者编辑的信息内容的合理位置、区域进行显著标识，向公众提示深度合成情况。

**本实现的符合性**:

| 要求 | 实现方式 | 符合性 |
|------|---------|--------|
| 显著标识 | 显式水印（文末声明） | ✅ 符合 |
| 合理位置 | 内容末尾 | ✅ 符合 |
| 提示深度合成情况 | "此内容由 FluentWJ AI 算法辅助生成" | ✅ 符合 |
| 可溯源 | auditToken + 审计日志 | ✅ 符合 |

---

## 性能指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 编码耗时 | < 5ms | 对 36 字符 UUID 编码 |
| 解码耗时 | < 10ms | 从内容中提取并解码 |
| 水印长度 | ~500 字符 | 零宽字符编码后的长度 |
| 内存占用 | < 1KB | 单次操作 |

---

## 测试建议

### 单元测试

```typescript
describe('水印服务', () => {
  const testToken = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const testContent = '尊敬的张先生，关于贵司的产品询价...';
  
  it('应该成功添加水印', () => {
    const watermarked = addWatermark(testContent, testToken);
    expect(watermarked).toContain('此内容由 FluentWJ AI 算法辅助生成');
    expect(watermarked).toContain(testToken);
  });
  
  it('应该从显式水印中提取 auditToken', () => {
    const watermarked = addWatermark(testContent, testToken);
    const extracted = extractWatermark(watermarked);
    expect(extracted).toBe(testToken);
  });
  
  it('应该从隐式水印中提取 auditToken', () => {
    const watermarked = addWatermark(testContent, testToken);
    
    // 删除显式水印
    const withoutVisible = watermarked.replace(/\n\n---\n[\s\S]*$/, '');
    
    const extracted = extractWatermark(withoutVisible);
    expect(extracted).toBe(testToken);
  });
  
  it('零宽字符编码应该可逆', () => {
    const encoded = encodeToZeroWidth(testToken);
    const decoded = decodeFromZeroWidth(encoded);
    expect(decoded).toBe(testToken);
  });
});
```

### 集成测试

```typescript
describe('水印集成测试', () => {
  it('水印应该能在数据库中溯源', async () => {
    // 1. 生成内容并添加水印
    const auditToken = crypto.randomUUID();
    const content = '测试内容';
    const watermarked = addWatermark(content, auditToken);
    
    // 2. 写入数据库
    await prisma.audit_logs.create({
      data: {
        audit_token: auditToken,
        output_content: watermarked,
        // ...
      }
    });
    
    // 3. 从内容中提取水印
    const extracted = extractWatermark(watermarked);
    
    // 4. 在数据库中验证
    const log = await prisma.audit_logs.findUnique({
      where: { audit_token: extracted! }
    });
    
    expect(log).toBeTruthy();
    expect(log?.audit_token).toBe(auditToken);
  });
});
```

---

## 使用示例

### 在 aiService 中使用

```typescript
import { addWatermark } from '@/utils/watermark';
import crypto from 'crypto';

// 生成 auditToken
const auditToken = crypto.randomUUID();

// DeepSeek 生成内容
const generatedContent = await callDeepSeek(prompt);

// 添加水印
const contentWithWatermark = addWatermark(generatedContent, auditToken);

// 写入数据库
await prisma.audit_logs.create({
  data: {
    audit_token: auditToken,
    output_content: contentWithWatermark,
    // ...
  }
});

// 返回给用户
return {
  content: contentWithWatermark,
  auditLogId: auditLog.id
};
```

---

### 在投诉处理中使用

```typescript
import { extractWatermark } from '@/utils/watermark';

// 用户举报某段内容
const reportedContent = req.body.content;

// 提取水印
const auditToken = extractWatermark(reportedContent);

if (auditToken) {
  // 在数据库中查找审计日志
  const auditLog = await prisma.audit_logs.findUnique({
    where: { audit_token: auditToken }
  });
  
  if (auditLog) {
    console.log('内容溯源成功:', {
      userId: auditLog.user_id,
      userPhone: auditLog.user_phone,
      createdTime: auditLog.created_time
    });
  }
} else {
  console.warn('无法提取水印，可能是非本系统生成的内容');
}
```

---

## 后续优化

1. **动态水印**：根据用户等级自定义水印内容
2. **多语言支持**：根据生成语言自动切换水印文案
3. **水印验证服务**：提供公开 API 验证内容来源
4. **区块链溯源**：将 auditToken 上链（增强不可篡改性）

---

## 验收标准

- [x] 显式水印格式清晰
- [x] 隐式水印编码可逆
- [x] 水印嵌入位置合理
- [x] 提取逻辑健壮
- [x] 兼容性考虑完善
- [x] 安全性措施到位
- [x] 符合监管要求
- [x] 代码注释完整（中文）

---

**文档维护**：本规范与 `utils/watermark.ts` 实现保持同步。

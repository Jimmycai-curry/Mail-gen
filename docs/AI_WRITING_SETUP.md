# AI 写作核心逻辑 - 配置与测试指南

## 概述

本文档描述如何配置和测试 FluentWJ 的 AI 写作核心功能。

---

## 环境变量配置

### 必需配置

在 `.env` 文件中添加以下配置：

```bash
# DeepSeek API 配置
DEEPSEEK_API_KEY="sk-your-deepseek-api-key-here"
DEEPSEEK_API_URL="https://api.deepseek.com/v1/chat/completions"

# 阿里云内容安全配置
ALIYUN_ACCESS_KEY_ID="LTAI5tXXXXXXXXXXXXXX"
ALIYUN_ACCESS_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
ALIYUN_REGION="cn-shanghai"
```

### 可选配置

```bash
# DeepSeek 高级配置
DEEPSEEK_MODEL="deepseek-chat"
DEEPSEEK_MAX_TOKENS="2000"
DEEPSEEK_TEMPERATURE="0.7"
DEEPSEEK_TIMEOUT="45000"

# 阿里云高级配置
ALIYUN_MODERATION_ENDPOINT="https://green.cn-shanghai.aliyuncs.com"
ALIYUN_MODERATION_TIMEOUT="10000"
```

---

## 获取 API 密钥

### 1. DeepSeek API Key

1. 访问 [DeepSeek 官网](https://platform.deepseek.com/)
2. 注册/登录账号
3. 进入"API Keys"页面
4. 创建新的 API Key
5. 复制 Key（格式：`sk-xxxxxxxxxx`）

### 2. 阿里云 AccessKey

1. 访问 [阿里云控制台](https://ram.console.aliyun.com/manage/ak)
2. 登录阿里云账号
3. 创建 AccessKey（推荐使用 RAM 子账户）
4. 复制 AccessKey ID 和 AccessKey Secret
5. 确保账号已开通"内容安全"服务

---

## 测试流程

### 步骤 1：启动开发服务器

```bash
npm run dev
```

### 步骤 2：登录系统

1. 访问 `http://localhost:3000/login`
2. 使用手机号和验证码登录
3. 登录成功后会跳转到 Dashboard

### 步骤 3：访问撰写页面

1. 访问 `http://localhost:3000/dashboard/writing`
2. 看到左右分栏布局：
   - 左侧：撰写表单
   - 右侧：结果展示区

### 步骤 4：填写表单

1. **业务场景**：选择"商务邮件"
2. **语言**：选择"中文"
3. **语气**：选择"正式"
4. **收件人姓名**：输入"张先生"
5. **收件人身份**：输入"采购总监"
6. **核心要点**：输入测试内容，例如：
   ```
   询问产品报价
   希望建立长期合作
   请提供详细的产品目录
   ```

### 步骤 5：生成内容

1. 点击"立即生成内容"按钮
2. 观察加载状态：
   - 按钮变为加载动画
   - 显示"AI 正在为您生成专业内容，预计需要 10-30 秒..."
   - 出现"取消生成"按钮
3. 等待生成完成（通常 10-20 秒）
4. 右侧展示区显示生成的内容

### 步骤 6：验证结果

#### 6.1 检查生成内容

生成的内容应该包含：
- ✅ 专业的商务邮件格式
- ✅ 收件人称呼（张先生）
- ✅ 核心要点（询问报价、长期合作、产品目录）
- ✅ 显式水印："此内容由 FluentWJ AI 算法辅助生成"
- ✅ 溯源标识：UUID 格式的审计 Token

#### 6.2 检查数据库记录

连接数据库并查询：

```sql
-- 查询审计日志
SELECT 
  id,
  user_phone,
  user_ip,
  scene,
  tone,
  input_prompt,
  LEFT(output_content, 100) as content_preview,
  audit_token,
  status,
  is_sensitive,
  created_time
FROM audit_logs
ORDER BY created_time DESC
LIMIT 5;

-- 查询用户历史
SELECT 
  id,
  scene,
  tone,
  recipient_name,
  core_points,
  LEFT(mail_content, 100) as content_preview,
  created_time
FROM mail_histories
ORDER BY created_time DESC
LIMIT 5;
```

**验证要点**：
- ✅ `audit_logs` 表有新记录
- ✅ `user_ip` 记录了真实 IP
- ✅ `status = 1`（审核通过）
- ✅ `is_sensitive = false`
- ✅ `audit_token` 为有效的 UUID
- ✅ `mail_histories` 表有对应记录

---

## 常见问题排查

### 问题 1：生成失败 - "DeepSeek API Key 未配置"

**原因**：环境变量未配置或格式错误

**解决方案**：
1. 检查 `.env` 文件是否存在
2. 确认 `DEEPSEEK_API_KEY` 已设置
3. 重启开发服务器（`npm run dev`）

### 问题 2：生成失败 - "401 Unauthorized"

**原因**：DeepSeek API Key 无效或过期

**解决方案**：
1. 登录 DeepSeek 控制台
2. 检查 API Key 是否有效
3. 重新生成 API Key
4. 更新 `.env` 文件

### 问题 3：生成失败 - "阿里云 AccessKey 认证失败"

**原因**：阿里云 AccessKey 无效或未开通服务

**解决方案**：
1. 检查 `ALIYUN_ACCESS_KEY_ID` 和 `ALIYUN_ACCESS_KEY_SECRET`
2. 确认已开通"内容安全"服务
3. 检查 RAM 子账户权限

### 问题 4：生成超时

**原因**：网络问题或 DeepSeek 服务响应慢

**解决方案**：
1. 检查网络连接
2. 增加 `DEEPSEEK_TIMEOUT` 值（如 60000）
3. 重试生成

### 问题 5：内容违规被拦截

**原因**：输入内容包含敏感词

**解决方案**：
1. 检查错误提示中的具体原因
2. 修改输入内容
3. 重新生成

### 问题 6：数据库写入失败

**原因**：数据库连接问题或权限问题

**解决方案**：
1. 检查 `DATABASE_URL` 配置
2. 确认数据库服务正在运行
3. 检查数据库权限
4. 查看服务器日志

---

## 测试场景

### 场景 1：正常生成（商务邮件）

**输入**：
- 业务场景：商务邮件
- 语气：正式
- 收件人姓名：李总
- 收件人身份：采购经理
- 核心要点：询问新产品报价，希望尽快回复

**预期结果**：
- ✅ 生成成功
- ✅ 内容专业且符合商务邮件格式
- ✅ 包含水印

### 场景 2：多语言生成（英文）

**输入**：
- 业务场景：商务邮件
- 语言：English
- 语气：友好
- 收件人姓名：Mr. Smith
- 收件人身份：Product Manager
- 核心要点：Inquiry about product pricing and delivery time

**预期结果**：
- ✅ 生成英文邮件
- ✅ 格式和语气符合要求

### 场景 3：内容审核拦截

**输入**：
- 核心要点：包含政治敏感词或违禁内容

**预期结果**：
- ✅ 生成失败
- ✅ 显示友好的错误提示
- ✅ 数据库记录 `status = 2`（系统拦截）

### 场景 4：取消生成

**操作**：
1. 点击"立即生成"
2. 等待 3 秒
3. 点击"取消生成"

**预期结果**：
- ✅ 请求被取消
- ✅ 按钮恢复为"立即生成内容"
- ✅ 显示"生成已取消"提示

---

## 性能基准

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 平均响应时间 | 10-20 秒 | 包含审核 + 生成 + 数据库写入 |
| 超时时间 | 45 秒 | 超过自动取消 |
| 审核耗时 | < 2 秒 | 阿里云内容审核 |
| 生成耗时 | 8-18 秒 | DeepSeek API 生成 |
| 数据库写入 | < 1 秒 | Prisma 事务 |

---

## 日志查看

### 服务器日志

开发环境下，所有日志会输出到控制台：

```
[AIService] 开始生成邮件...
[Moderation] 开始审核内容...
[Moderation] 审核完成 { pass: true, riskLevel: 'low' }
[DeepSeek] 开始调用 API...
[DeepSeek] API 调用成功 { contentLength: 352, tokens: 89 }
[Watermark] 添加水印...
[AIService] 邮件生成完成 { auditLogId: 'xxx', duration: '15234ms' }
```

### 浏览器控制台

打开浏览器开发者工具（F12）查看前端日志：

```
[WritingForm] 开始生成...
[API /generate] 收到生成请求
[WritingPage] 生成成功
```

---

## 下一步

完成测试后，可以：

1. **优化 Prompt**：调整 `lib/deepseek.ts` 中的 Prompt 模板
2. **扩展功能**：实现"重新生成"、"点赞/点踩"功能
3. **性能优化**：添加 Redis 缓存、优化审核策略
4. **监控接入**：集成 APM 工具监控性能

---

## 完整测试检查清单

- [ ] 环境变量已配置
- [ ] DeepSeek API 调用正常
- [ ] 阿里云内容审核调用正常
- [ ] 水印植入成功
- [ ] `audit_logs` 表写入成功
- [ ] `mail_histories` 表写入成功
- [ ] 前端表单提交成功
- [ ] 错误提示文案准确
- [ ] Session 失效时正确跳转
- [ ] 被封禁用户无法调用 API
- [ ] 取消功能正常
- [ ] 多语言生成正常

---

**文档维护日期**：2025-01-19

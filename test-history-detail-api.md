# 历史记录详情接口测试指南

**接口**: `GET /api/history/[id]`
**文档**: `docs/specs/history-page.md` (第 517-646 行)

---

## 一、测试前置条件

1. **确保数据库中有测试数据**
   - 执行以下 SQL 插入测试数据（或通过已有数据测试）：
   ```sql
   -- 确保有用户数据
   SELECT id, phone FROM users LIMIT 1;
   
   -- 确保有历史记录数据
   SELECT id, user_id, sender_name, recipient_name, scene 
   FROM mail_histories 
   WHERE is_deleted = false 
   LIMIT 1;
   ```

2. **获取有效的 JWT Token**
   - 登录后从 Cookie 中复制 `auth_token`
   - 或通过登录接口获取 Token

---

## 二、测试用例

### 测试 1: 正常获取历史记录详情 ✅

**目标**: 验证接口正常返回数据

**请求**:
```bash
# 替换 HISTORY_ID 为真实的历史记录 ID
curl -X GET "http://localhost:3000/api/history/HISTORY_ID" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN"
```

**预期响应** (HTTP 200):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "senderName": "市场部 张伟",
    "recipientName": "极光科技 卢经理",
    "tone": "专业严谨,诚恳礼貌",
    "scene": "商业合作伙伴年度邀请",
    "corePoints": [
      "回顾过去一年在云服务领域的紧密合作",
      "诚邀对方参加 11月15日 的战略研讨会"
    ],
    "mailContent": "尊敬的卢经理：\n\n您好！\n\n回顾即将过去的...",
    "isFavorite": true,
    "createdAt": "2025-01-15 14:30"
  }
}
```

**验证点**:
- [ ] HTTP 状态码为 200
- [ ] `success` 字段为 `true`
- [ ] `data` 包含所有必要字段
- [ ] `corePoints` 是数组类型（按换行符分割）
- [ ] `createdAt` 格式为 "YYYY-MM-DD HH:mm"
- [ ] 所有字段与数据库记录一致

---

### 测试 2: 未登录访问 ❌

**目标**: 验证未登录时返回 401 错误

**请求**:
```bash
# 不提供 Cookie 或提供无效 Token
curl -X GET "http://localhost:3000/api/history/HISTORY_ID"
```

**预期响应** (HTTP 401):
```json
{
  "success": false,
  "message": "未登录或登录已过期",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

**验证点**:
- [ ] HTTP 状态码为 401
- [ ] `success` 字段为 `false`
- [ ] `error.code` 为 "UNAUTHORIZED"

---

### 测试 3: Token 无效 ❌

**目标**: 验证无效 Token 时返回 401 错误

**请求**:
```bash
# 使用无效的 Token
curl -X GET "http://localhost:3000/api/history/HISTORY_ID" \
  -H "Cookie: auth_token=invalid_token_here"
```

**预期响应** (HTTP 401):
```json
{
  "success": false,
  "message": "Token 无效或已过期",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

**验证点**:
- [ ] HTTP 状态码为 401
- [ ] `success` 字段为 `false`

---

### 测试 4: 历史记录不存在 ❌

**目标**: 验证查询不存在的 ID 时返回 404 错误

**请求**:
```bash
# 使用不存在的 UUID
curl -X GET "http://localhost:3000/api/history/00000000-0000-0000-0000-000000000000" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN"
```

**预期响应** (HTTP 404):
```json
{
  "success": false,
  "message": "历史记录不存在",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

**验证点**:
- [ ] HTTP 状态码为 404
- [ ] `success` 字段为 `false`
- [ ] `error.code` 为 "NOT_FOUND"

---

### 测试 5: 越权访问（访问其他用户的数据）❌

**目标**: 验证用户 A 不能访问用户 B 的历史记录

**前提条件**:
- 用户 A 的 Token: `TOKEN_A`
- 用户 B 的历史记录 ID: `HISTORY_ID_B`

**请求**:
```bash
# 使用用户 A 的 Token 访问用户 B 的历史记录
curl -X GET "http://localhost:3000/api/history/HISTORY_ID_B" \
  -H "Cookie: auth_token=TOKEN_A"
```

**预期响应** (HTTP 404):
```json
{
  "success": false,
  "message": "历史记录不存在",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

**验证点**:
- [ ] HTTP 状态码为 404（而不是 200）
- [ ] 返回"历史记录不存在"，而不是返回数据
- [ ] 用户无法访问其他用户的数据（安全测试）

---

### 测试 6: 格式化验证 ✅

**目标**: 验证数据格式化是否正确

**前提条件**: 数据库中有一条包含完整字段的历史记录

**请求**:
```bash
curl -X GET "http://localhost:3000/api/history/HISTORY_ID" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN" | jq .
```

**验证点**:
- [ ] `corePoints` 是数组，每个元素为字符串（按 `\n` 分割）
- [ ] `createdAt` 格式为 "2025-01-15 14:30"（无秒数）
- [ ] `tone`、`scene` 为空时返回空字符串 `""`
- [ ] `isFavorite` 为布尔值 `true` 或 `false`

---

### 测试 7: 已删除记录访问 ❌

**目标**: 验证访问已删除的记录时返回 404

**前提条件**: 数据库中有一条 `is_deleted = true` 的记录

**请求**:
```bash
curl -X GET "http://localhost:3000/api/history/DELETED_HISTORY_ID" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN"
```

**预期响应** (HTTP 404):
```json
{
  "success": false,
  "message": "历史记录不存在",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

**验证点**:
- [ ] HTTP 状态码为 404
- [ ] 即使记录存在于数据库但已删除，也不返回

---

## 三、浏览器测试（推荐）

使用浏览器开发者工具测试：

1. **登录系统**
   - 访问 `http://localhost:3000/(auth)/login`
   - 输入手机号和验证码登录
   - 登录成功后，打开开发者工具（F12）

2. **查看 Cookie**
   - Application → Cookies → http://localhost:3000
   - 复制 `auth_token` 的值

3. **测试接口**
   - 切换到 Console 标签页
   - 运行以下 JavaScript 代码：
   ```javascript
   // 替换 HISTORY_ID 为真实 ID
   fetch('/api/history/HISTORY_ID', {
     credentials: 'include'  // 自动携带 Cookie
   })
   .then(res => res.json())
   .then(data => console.log(data))
   .catch(err => console.error(err))
   ```

4. **观察结果**
   - 成功：返回完整的 `data` 对象
   - 失败：返回错误信息

---

## 四、验收标准

根据开发计划的验收标准验证：

### 功能验收
- [x] API 路由创建成功：`app/api/history/[id]/route.ts`
- [x] Service 层方法实现：`getHistoryDetail(id, userId)`
- [x] 从 Cookie 读取 Token 认证正常
- [x] 权限验证正常（防止越权访问）
- [x] 数据查询正确（只返回当前用户的数据）
- [x] 数据格式转换正确（core_points 转数组，时间格式化）
- [x] 错误处理完善（404、403、401、500）
- [x] 响应格式符合规范（`ApiResponse<T>`）

### 代码质量验收
- [x] 所有代码包含中文注释
- [x] 遵循项目分层架构（Service 层不包含 HTTP 逻辑）
- [x] 无 linter 错误

---

## 五、常见问题排查

### 问题 1: 返回 401 错误

**可能原因**:
- Cookie 中的 Token 已过期
- Cookie 未正确设置（浏览器禁用了 Cookie）
- Token 格式错误

**解决方法**:
```bash
# 重新登录获取新 Token
# 检查浏览器是否允许 Cookie
# 查看控制台日志，确认 Token 解析是否成功
```

---

### 问题 2: 返回 404 错误

**可能原因**:
- 历史记录 ID 不正确
- 记录已被删除（`is_deleted = true`）
- 记录属于其他用户（越权访问）

**解决方法**:
```sql
-- 查询数据库确认记录是否存在
SELECT * FROM mail_histories WHERE id = 'YOUR_HISTORY_ID';

-- 检查是否属于当前用户
SELECT user_id FROM mail_histories WHERE id = 'YOUR_HISTORY_ID';
```

---

### 问题 3: 返回 500 错误

**可能原因**:
- 数据库连接失败
- Prisma 查询错误
- 代码逻辑错误

**解决方法**:
```bash
# 查看服务器日志
# 检查数据库连接
# 查看控制台错误信息
```

---

## 六、性能验证

使用 Apache Bench 或 wrk 进行压力测试：

```bash
# 使用 ab 测试并发性能
ab -n 1000 -c 10 -H "Cookie: auth_token=YOUR_JWT_TOKEN" \
  http://localhost:3000/api/history/HISTORY_ID
```

**性能指标**:
- [ ] 平均响应时间 < 100ms（根据规范要求）
- [ ] 最大响应时间 < 300ms
- [ ] 无 5xx 错误
- [ ] 成功率 100%

---

## 七、日志检查

在测试过程中，检查以下日志：

1. **认证日志**:
   ```
   [Auth] 从 Cookie 读取 Token 成功
   [Auth] 用户认证成功: { userId: '...', phone: '...' }
   ```

2. **Service 日志**:
   ```
   [HistoryService] 获取历史记录详情: { id: '...', userId: '...' }
   [HistoryService] 查询成功: { id: '...', senderName: '...', recipientName: '...' }
   ```

3. **API 日志**:
   ```
   [HistoryDetail API] 收到获取历史记录详情请求
   [HistoryDetail API] 用户已认证: { userId: '...' }
   [HistoryDetail API] 查询成功: { id: '...', senderName: '...', recipientName: '...' }
   ```

---

**测试完成时间**: __________
**测试执行人**: __________
**测试结果**: □ 通过 □ 不通过
**备注**: ________________________________

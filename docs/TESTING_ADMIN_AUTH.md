# 管理后台权限保护测试指南

**版本**: v1.0  
**创建时间**: 2026-01-16  
**测试目的**: 验证管理后台的身份验证和权限控制机制是否正常工作

---

## 测试前准备

### 1. 确保开发服务器运行

```bash
npm run dev
```

服务器应该运行在 `http://localhost:3000`

### 2. 准备测试账号

确保数据库中有以下测试账号：

| 账号类型 | 手机号 | 密码 | role | 用途 |
|---------|-------|------|------|-----|
| 管理员 | 13265336818 | (你的管理员密码) | 0 | 测试管理员访问 |
| 普通用户 | 11111111111 | (普通用户密码) | 1 | 测试权限拒绝 |

---

## 测试场景

### 场景 1: 未登录访问管理后台页面

**目的**: 验证未登录用户无法访问管理后台

**操作步骤**:

1. 打开浏览器隐私/无痕模式（确保没有任何 Cookie）
2. 直接访问管理后台页面：
   - `http://localhost:3000/admin/dashboard`
   - `http://localhost:3000/admin/users`
   - `http://localhost:3000/admin/audit`

**预期结果**:

- ✅ 所有页面都应该自动重定向到 `/admin/login`
- ✅ URL 应包含 `?redirect=` 参数，如：
  - `/admin/login?redirect=/admin/dashboard`
  - `/admin/login?redirect=/admin/users`
- ✅ 显示管理员登录页面，而不是管理后台内容

**如何验证**:
- 检查浏览器地址栏，确认已重定向
- 检查页面内容，确认显示的是登录表单，而不是管理后台数据

---

### 场景 2: 普通用户访问管理后台

**目的**: 验证普通用户（role=1）无法访问管理后台

**操作步骤**:

1. 清空浏览器 Cookie（或使用隐私模式）
2. 访问普通用户登录页：`http://localhost:3000/login`
3. 使用普通用户账号登录：
   - 手机号：11111111111
   - 密码：(你的普通用户密码)
4. 登录成功后，直接访问管理后台：
   - `http://localhost:3000/admin/dashboard`
   - `http://localhost:3000/admin/users`

**预期结果**:

- ✅ 页面自动重定向到 `/admin/login?error=unauthorized`
- ✅ 登录页显示"需要管理员权限"的提示信息
- ✅ 即使普通用户已登录，也无法访问管理后台

**如何验证**:
- 检查 URL 中是否包含 `error=unauthorized` 参数
- 检查页面是否显示权限不足的提示

---

### 场景 3: 管理员正常访问

**目的**: 验证管理员（role=0）可以正常访问管理后台

**操作步骤**:

1. 清空浏览器 Cookie
2. 访问管理员登录页：`http://localhost:3000/admin/login`
3. 使用管理员账号登录：
   - 手机号：13265336818
   - 密码：(你的管理员密码)
4. 登录成功后，访问管理后台各页面：
   - `http://localhost:3000/admin/dashboard`
   - `http://localhost:3000/admin/users`
   - `http://localhost:3000/admin/audit`

**预期结果**:

- ✅ 登录成功后，自动跳转到原始访问的页面（如果有 `redirect` 参数）
- ✅ 所有管理后台页面都能正常访问，显示完整内容
- ✅ 用户数据、审计日志等数据正常加载

**如何验证**:
- 检查页面是否显示管理后台的导航栏、侧边栏
- 检查数据表格是否正常加载
- 尝试各种功能是否正常工作

---

### 场景 4: Token 过期后访问

**目的**: 验证 Token 过期后会自动重定向到登录页

**操作步骤**:

1. 以管理员身份登录
2. 打开浏览器开发者工具（F12）
3. 找到 `auth_token` Cookie 并删除：
   - Chrome: Application → Cookies → 删除 `auth_token`
   - Firefox: Storage → Cookies → 删除 `auth_token`
4. 刷新管理后台页面或访问其他管理后台页面

**预期结果**:

- ✅ 页面自动重定向到 `/admin/login`
- ✅ URL 包含 `?redirect=` 参数
- ✅ 提示用户需要重新登录

**如何验证**:
- 删除 Cookie 后立即刷新页面
- 确认被重定向到登录页

---

### 场景 5: API 路由保护（未登录）

**目的**: 验证未登录用户无法调用管理后台 API

**操作步骤**:

1. 清空浏览器 Cookie
2. 打开浏览器开发者工具（F12），切换到 Network 标签
3. 在浏览器地址栏访问：
   - `http://localhost:3000/api/admin/users?page=1&pageSize=10`
   - `http://localhost:3000/api/admin/audit-logs?page=1&pageSize=20`

**预期结果**:

- ✅ API 返回 HTTP 401 状态码
- ✅ 响应体为 JSON 格式：
  ```json
  {
    "success": false,
    "error": "Unauthorized",
    "message": "需要管理员权限，请先登录"
  }
  ```

**如何验证**:
- 在 Network 标签中查看请求的状态码（应为 401）
- 点击请求，查看 Response 标签中的响应内容

---

### 场景 6: API 路由保护（普通用户）

**目的**: 验证普通用户无法调用管理后台 API

**操作步骤**:

1. 以普通用户身份登录（`/login`）
2. 打开浏览器开发者工具（F12），切换到 Network 标签
3. 在浏览器地址栏访问：
   - `http://localhost:3000/api/admin/users?page=1&pageSize=10`

**预期结果**:

- ✅ API 返回 HTTP 403 状态码
- ✅ 响应体为 JSON 格式：
  ```json
  {
    "success": false,
    "error": "Forbidden",
    "message": "需要管理员权限，当前用户权限不足"
  }
  ```

**如何验证**:
- 在 Network 标签中查看请求的状态码（应为 403）
- 区分 401（未登录）和 403（已登录但权限不足）

---

### 场景 7: API 路由正常访问（管理员）

**目的**: 验证管理员可以正常调用管理后台 API

**操作步骤**:

1. 以管理员身份登录（`/admin/login`）
2. 打开浏览器开发者工具（F12），切换到 Network 标签
3. 访问管理后台页面（如 `/admin/users`），观察 API 调用

**预期结果**:

- ✅ API 返回 HTTP 200 状态码
- ✅ 响应体包含正常的数据：
  ```json
  {
    "success": true,
    "data": {
      "users": [...],
      "total": 2,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

**如何验证**:
- 在 Network 标签中查看 API 请求
- 确认所有 `/api/admin/*` 请求都返回 200
- 确认数据正常加载到页面上

---

### 场景 8: 登录页面可正常访问

**目的**: 验证 `/admin/login` 可以在未登录状态下正常访问

**操作步骤**:

1. 清空浏览器 Cookie
2. 直接访问：`http://localhost:3000/admin/login`

**预期结果**:

- ✅ 页面正常显示，不会被重定向
- ✅ 显示管理员登录表单
- ✅ 页面样式正常（蓝色主题、网格背景）

**如何验证**:
- 检查地址栏 URL 保持为 `/admin/login`
- 检查页面显示登录表单

---

### 场景 9: 登录后自动跳转

**目的**: 验证登录成功后自动跳转到原始访问的页面

**操作步骤**:

1. 清空浏览器 Cookie
2. 直接访问：`http://localhost:3000/admin/users`
3. 系统自动重定向到：`/admin/login?redirect=/admin/users`
4. 输入管理员账号密码，点击登录

**预期结果**:

- ✅ 登录成功后，自动跳转到 `/admin/users`（而不是 `/admin/dashboard`）
- ✅ 页面显示用户列表数据

**如何验证**:
- 观察登录成功后的跳转行为
- 确认跳转到的是原始访问的页面

---

## 使用浏览器开发者工具测试

### 1. 查看 Middleware 是否拦截

打开浏览器开发者工具 → Network 标签：

- 观察页面请求的状态码：
  - `307` = 重定向到登录页
  - `401` = API 未授权
  - `403` = API 权限不足
  - `200` = 请求成功

### 2. 查看 Cookie

Application → Cookies → `http://localhost:3000`：

- 检查 `auth_token` Cookie 是否存在
- 检查 Cookie 的属性：
  - `HttpOnly`: ✅ (防止 XSS 攻击)
  - `SameSite`: `strict` (防止 CSRF 攻击)

### 3. 查看请求头

Network → 选择一个请求 → Headers：

- 检查 `Cookie` 请求头中是否包含 `auth_token`
- 检查 Middleware 是否正确读取 Token

---

## 使用 curl 命令测试（可选）

### 测试 1: 未登录访问管理后台 API

```bash
curl -i http://localhost:3000/api/admin/users?page=1&pageSize=10
```

**预期输出**:
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{"success":false,"error":"Unauthorized","message":"需要管理员权限，请先登录"}
```

### 测试 2: 管理员登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13265336818","password":"你的密码"}' \
  -c cookies.txt
```

**预期输出**:
```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": { ... }
  }
}
```

### 测试 3: 使用 Token 访问管理后台 API

```bash
curl -i http://localhost:3000/api/admin/users?page=1&pageSize=10 \
  -b cookies.txt
```

**预期输出**:
```
HTTP/1.1 200 OK
Content-Type: application/json

{"success":true,"data":{"users":[...],"total":2}}
```

---

## 测试结果记录

请在完成测试后填写：

| 场景 | 状态 | 备注 |
|-----|------|-----|
| 场景 1: 未登录访问管理后台页面 | ⬜ | |
| 场景 2: 普通用户访问管理后台 | ⬜ | |
| 场景 3: 管理员正常访问 | ⬜ | |
| 场景 4: Token 过期后访问 | ⬜ | |
| 场景 5: API 路由保护（未登录） | ⬜ | |
| 场景 6: API 路由保护（普通用户） | ⬜ | |
| 场景 7: API 路由正常访问（管理员） | ⬜ | |
| 场景 8: 登录页面可正常访问 | ⬜ | |
| 场景 9: 登录后自动跳转 | ⬜ | |

符号说明：
- ⬜ 待测试
- ✅ 测试通过
- ❌ 测试失败

---

## 常见问题排查

### 问题 1: 修改 middleware.ts 后没有生效

**原因**: Next.js 开发服务器可能需要重启

**解决方案**:
```bash
# 停止开发服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 问题 2: 登录后仍然被重定向

**可能原因**:
1. Cookie 设置失败
2. Token 生成失败
3. `JWT_SECRET` 环境变量未配置

**排查步骤**:
1. 检查浏览器 Cookie 中是否有 `auth_token`
2. 检查 `.env` 文件中的 `JWT_SECRET` 配置
3. 查看终端日志中的错误信息

### 问题 3: API 返回 500 错误而不是 401

**可能原因**: Middleware 中的代码有错误

**排查步骤**:
1. 查看终端日志中的错误信息
2. 检查 `middleware.ts` 文件是否有语法错误
3. 使用 `ReadLints` 工具检查 linter 错误

---

## 安全性验证

### ✅ 确认以下安全措施已生效

1. **路由保护**:
   - [ ] 所有 `/admin/*` 页面都需要管理员权限
   - [ ] 所有 `/api/admin/*` API 都需要管理员权限
   - [ ] `/admin/login` 可以在未登录状态下访问

2. **角色验证**:
   - [ ] 普通用户无法访问管理后台
   - [ ] 只有 `role === 0` 的用户可以访问

3. **Token 验证**:
   - [ ] Token 无效时自动重定向
   - [ ] Token 过期时自动重定向
   - [ ] Cookie 设置了 `HttpOnly` 和 `SameSite`

4. **用户体验**:
   - [ ] 重定向时保存原始路径
   - [ ] 登录成功后自动跳转回原页面
   - [ ] 权限不足时显示友好提示

---

## 总结

完成所有测试后，确认：

1. ✅ 管理后台已完全受保护
2. ✅ 未登录用户无法访问
3. ✅ 普通用户无法访问
4. ✅ 管理员可以正常使用
5. ✅ API 路由已正确保护

**安全漏洞已修复！** 🎉

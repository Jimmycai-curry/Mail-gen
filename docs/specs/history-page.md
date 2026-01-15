# 历史记录页面功能规范

## Spec 概述
本规范描述 FluentWJ 工作台历史记录页面的前端组件实现、功能逻辑和后端 API 接口规范。

**文档版本**: v1.1
**创建日期**: 2025-01-14
**最后更新**: 2025-01-15
**更新内容**: 新增完整的 API 接口规范，包含 5 个核心接口

**相关组件**:
- `components/ui/Sidebar.tsx`
- `components/ui/Footer.tsx`
- `components/history/HistoryList.tsx`
- `components/history/HistoryDetail.tsx`
- `components/history/FilterDropdown.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/history/page.tsx`

**相关 API 路由**:
- `GET /api/history` - 获取历史记录列表
- `GET /api/history/[id]` - 获取历史记录详情
- `POST /api/history/search` - 搜索历史记录
- `PUT /api/history/[id]/favorite` - 切换收藏状态
- `DELETE /api/history/[id]` - 删除历史记录

**相关 Service**:
- `services/historyService.ts` - 历史记录业务逻辑层

---

## 功能描述
用户在工作台历史记录页面可以：
1. 查看所有历史写作记录列表（按时间倒序）
2. 点击列表项查看完整详情
3. 在详情页查看输入需求和 AI 生成结果
4. 复制内容到剪贴板（UI 仅展示，功能待实现）
5. 标记收藏状态（UI 仅展示，功能待实现）

## 页面结构

```
┌─────────────────────────────────────────────────────────┐
│                    Sidebar (左侧导航)                   │
│  - Logo 区域（FluentWJ + AI Writing Assistant）        │
│  - 导航菜单（撰写、历史记录）                          │
│  - 用户信息卡片                                       │
├─────────────────────────────────────────────────────────┤
│                     主内容区                           │
│  ┌──────────────────────┬──────────────────────────────┐│
│  │                      │                              ││
│  │    HistoryList       │      HistoryDetail           ││
│  │    (固定400px)        │       (flex-1)              ││
│  │                      │                              ││
│  │ - 搜索框            │ - 工具栏                    ││
│  │   (暂仅UI)          │   - 复制、收藏               ││
│  │ - 筛选按钮          │ - 输入需求详情              ││
│  │   (暂仅UI)          │   - 发送者/接收者           ││
│  │ - 历史记录卡片列表  │   - 语气风格                ││
│  │   - 标题            │   - 应用场景                ││
│  │   - 预览内容        │   - 核心要点                ││
│  │   - 创建时间        │ - AI 生成结果                ││
│  │   - 收藏图标        │ - 底部提示信息              ││
│  │                      │                              ││
│  └──────────────────────┴──────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│                    Footer (底部信息)                     │
│  - 版权、隐私政策、服务协议、备案号                       │
└─────────────────────────────────────────────────────────┘
```

## 数据模型

### mail_histories 表字段映射

| UI 字段 | 数据库字段 | 类型 | 说明 |
|---------|-----------|------|------|
| id | id | String | 唯一标识符 |
| 标题 | scene 或 sender_name + recipient_name | String | 列表显示标题 |
| 预览内容 | core_points | String | 前 80 字符，最多 2 行 |
| 收藏状态 | is_favorite | Boolean | true/false |
| 创建时间 | created_time | DateTime | 格式化为 "YYYY-MM-DD HH:mm" |
| 发送者姓名 | sender_name | String? | 可为空 |
| 接收者姓名 | recipient_name | String? | 可为空 |
| 语气风格 | tone | String? | 逗号分隔，如 "专业严谨,诚恳礼貌" |
| 应用场景 | scene | String? | 业务场景描述 |
| 核心要点 | core_points | String? | 多行文本，可拆分为数组 |
| 邮件内容 | mail_content | String | 完整的 AI 生成结果 |

### 类型定义

```typescript
// types/history.ts
export interface HistoryItem {
  id: string;
  title: string;
  preview: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface HistoryDetail {
  id: string;
  senderName: string;
  recipientName: string;
  tone: string;
  scene: string;
  corePoints: string[];
  mailContent: string;
  isFavorite: boolean;
  createdAt: string;
}
```

## 组件详细说明

### 1. HistoryList 组件 (`components/history/HistoryList.tsx`)

**Props 接口**:
```typescript
interface HistoryListProps {
  histories: HistoryItem[];
  selectedId?: string;
  onSelectHistory: (id: string) => void;
}
```

**功能说明**:
- 顶部搜索框（UI 仅展示，功能待实现）
- 筛选按钮（UI 仅展示，功能待实现）
- 历史记录卡片列表，垂直滚动
- 每个卡片显示：标题、预览内容、创建时间、收藏图标
- 选中状态：高亮背景色 + 主色调边框
- 点击卡片触发 `onSelectHistory`

**样式规范**:
- 容器宽度：`w-[400px]`
- 卡片间距：`space-y-3`
- 卡片圆角：`rounded-xl`
- 卡片内边距：`p-4`
- 选中状态：`bg-primary/5 border-primary/20`
- 未选中状态：`border-transparent hover:bg-gray-50`
- 标题字体：`font-semibold text-sm`
- 预览内容：`text-xs text-gray-500 line-clamp-2`
- 时间字体：`text-[11px] text-gray-400`

**Mock 数据**:
```typescript
const mockHistories: HistoryItem[] = [
  {
    id: "1",
    title: "业务邀请函",
    preview: "关于明年的战略合作伙伴邀请函，重点突出技术优势与市场份额...",
    isFavorite: true,
    createdAt: "2023-10-24 14:30"
  },
  {
    id: "2",
    title: "项目进度报告",
    preview: "Q3季度智慧城市项目的开发进展，包含已完成模块与风险评估...",
    isFavorite: false,
    createdAt: "2023-10-23 11:15"
  }
];
```

---

### 2. HistoryDetail 组件 (`components/history/HistoryDetail.tsx`)

**Props 接口**:
```typescript
interface HistoryDetailProps {
  detail?: HistoryDetail | null;
}
```

**功能说明**:
- 空状态：显示 "选择左侧历史记录查看详情"
- 有内容时：
  - 顶部工具栏：复制、收藏按钮（仅 UI，功能待实现）
  - 左侧栏（4/10）：输入需求详情
    - 发送者/接收者
    - 语气风格（标签展示）
    - 应用场景
    - 核心要点（列表展示）
  - 右侧栏（6/10）：AI 生成结果
    - 邮件内容（富文本展示）
  - 底部提示：AI 免责声明

**布局结构**:
- 工具栏：flex 布局，固定在顶部
- 内容区：`grid grid-cols-10 gap-6`
- 左侧：`col-span-4`
- 右侧：`col-span-6`

**样式规范**:
- 工具栏高度：自适应，`bg-white/50 backdrop-blur-md`
- 工具栏按钮：`px-4 py-2 rounded-lg text-sm`
- 卡片背景：`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm`
- 标签样式：`px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded`
- 内容区：`prose prose-sm dark:prose-invert max-w-none`
- 提示文字：`text-xs text-gray-400`

**空状态**:
```typescript
if (!detail) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <span className="text-4xl mb-4">📋</span>
        <p className="text-gray-500">选择左侧历史记录查看详情</p>
      </div>
    </div>
  );
}
```

---

### 3. 主页面 (`app/(dashboard)/history/page.tsx`)

**布局结构**:
```typescript
export default function HistoryPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<HistoryDetail | null>(null);

  const handleSelectHistory = (id: string) => {
    setSelectedId(id);
    // 根据 ID 查找详情数据
    const detail = mockDetails.find(d => d.id === id);
    setSelectedDetail(detail || null);
  };

  return (
    <div className="flex h-full">
      {/* 左侧历史记录列表 */}
      <section className="w-[400px] border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <HistoryList
          histories={mockHistories}
          selectedId={selectedId}
          onSelectHistory={handleSelectHistory}
        />
      </section>

      {/* 右侧详情展示 */}
      <section className="flex-1 flex flex-col overflow-hidden">
        <HistoryDetail detail={selectedDetail} />
      </section>
    </div>
  );
}
```

**样式规范**:
- 主容器：`flex h-full`
- 左侧：`w-[400px] border-r`
- 右侧：`flex-1`
- 背景色：`bg-white dark:bg-background-dark/50`（左侧）、`bg-background-light dark:bg-background-dark`（右侧）

---

## 布局规范

### Dashboard Layout 更新 (`app/(dashboard)/layout.tsx`)

**当前问题**:
- Sidebar 的 `activeNav` 硬编码为 `'writing'`

**需要修改**:
```typescript
// 修改前
<Sidebar activeNav="writing" />

// 修改后：根据当前路由动态设置 activeNav
// 需要使用 usePathname 判断当前页面
```

**实现方案**:
```typescript
'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from "@/components/ui/Sidebar";
import { Footer } from "@/components/ui/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeNav = pathname.includes('/history') ? 'history' : 'writing';

  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      <Sidebar activeNav={activeNav} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
```

---

## 主题系统

使用与撰写页面相同的主题系统：
- 浅色模式：`#f5f5f8` 背景
- 深色模式：`#0f0f23` 背景
- 主色调：`#0505d6`
- 文字颜色：`#0d0d1c`（浅色）/ 白色（深色）

---

## 功能逻辑

### 基础展示流程（已完成 ✅）
1. 页面加载，显示 Mock 数据列表
2. 用户点击历史记录卡片
3. 触发 `onSelectHistory`，更新选中状态
4. 根据选中 ID 查找详情数据
5. 在右侧 HistoryDetail 中展示完整信息

### 后端 API 集成流程（待实现 🚧）
1. 页面加载时调用 `GET /api/history` 获取列表
2. 用户点击历史记录卡片时调用 `GET /api/history/[id]` 获取详情
3. 用户搜索时调用 `POST /api/history/search`
4. 用户点击收藏时调用 `PUT /api/history/[id]/favorite`
5. 用户删除时调用 `DELETE /api/history/[id]`

### UI 交互状态

| 功能 | UI 状态 | 后端状态 | 说明 |
|------|---------|---------|------|
| 搜索框 | ✅ 已实现 | ✅ API 已定义 | 需前端对接 API |
| 筛选（时间范围） | ✅ 已实现 | ✅ API 已定义 | 需前端对接 API |
| 筛选（收藏） | ✅ 已实现 | ✅ API 已定义 | 需前端对接 API |
| 快捷筛选（今日/本周/本月） | ✅ 已实现 | ✅ API 已定义 | 需前端对接 API |
| 复制内容 | ✅ UI 已实现 | ❌ 不需要 | 需添加前端复制功能 |
| 收藏切换 | ✅ UI 已实现 | ✅ API 已定义 | 需前端对接 API |
| 删除 | ❌ UI 未实现 | ✅ API 已定义 | 需添加前端删除功能 |
| 分页加载 | ❌ UI 未实现 | ✅ API 已定义 | 需前端实现分页 |

---

## API 接口规范

本章节定义历史记录功能的后端 API 接口规范，包含 5 个核心功能。

### 接口列表
1. 获取历史记录列表（支持筛选、分页）
2. 获取历史记录详情
3. 搜索历史记录
4. 切换收藏状态
5. 删除历史记录

---

### 1. 获取历史记录列表

**功能描述**: 获取当前用户的历史记录列表，支持时间范围筛选、收藏筛选、分页等功能。

**路由**: `GET /api/history`

**权限**: 需要用户登录（从 Session 获取 user_id）

#### 请求参数

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| page | number | 否 | 页码，默认 1 | 1 |
| pageSize | number | 否 | 每页数量，默认 20 | 20 |
| startDate | string | 否 | 开始日期，格式 YYYY-MM-DD | "2025-01-01" |
| endDate | string | 否 | 结束日期，格式 YYYY-MM-DD | "2025-01-31" |
| showOnlyFavorites | boolean | 否 | 是否仅显示收藏 | false |
| quickFilter | 'all' \| 'today' \| 'week' \| 'month' | 否 | 快捷筛选 | 'today' |

**请求示例**:
```typescript
// GET /api/history?page=1&pageSize=20&startDate=2025-01-01&endDate=2025-01-31&showOnlyFavorites=false&quickFilter=all
```

#### 响应数据

```typescript
interface HistoryListResponse {
  success: boolean;
  data: {
    list: HistoryItem[];
    total: number;
    page: number;
    pageSize: number;
  };
}

interface HistoryItem {
  id: string;
  title: string;              // 优先使用 scene，为空则使用 sender_name + recipient_name
  preview: string;            // core_points 前 80 字符
  isFavorite: boolean;
  createdAt: string;          // 格式：YYYY-MM-DD HH:mm
}
```

**成功响应示例**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "业务邀请函",
        "preview": "回顾即将过去的2023年，我们双方在云服务基础设施建设领域...",
        "isFavorite": true,
        "createdAt": "2025-01-15 14:30"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

#### 业务逻辑

1. **权限验证**:
   - 从 Session 获取当前登录用户的 user_id
   - 如果未登录，返回 401 UNAUTHORIZED

2. **参数验证**:
   - page 必须 >= 1
   - pageSize 必须 >= 1 且 <= 100
   - startDate 和 endDate 格式必须为 YYYY-MM-DD
   - 如果 startDate > endDate，返回错误

3. **快捷筛选处理**:
   - `today`: 设置 startDate 为今天 00:00:00，endDate 为今天 23:59:59
   - `week`: 设置 startDate 为本周一 00:00:00，endDate 为本周日 23:59:59
   - `month`: 设置 startDate 为本月1日 00:00:00，endDate 为本月最后一天 23:59:59
   - `all`: 不自动设置日期

4. **数据库查询** (Prisma):
   ```typescript
   const where: any = {
     user_id: currentUserId,
     is_deleted: false
   };

   // 时间范围筛选
   if (startDate || endDate) {
     where.created_time = {};
     if (startDate) where.created_time.gte = new Date(startDate);
     if (endDate) where.created_time.lte = new Date(endDate);
   }

   // 收藏筛选
   if (showOnlyFavorites) {
     where.is_favorite = true;
   }

   // 查询总数
   const total = await prisma.mail_histories.count({ where });

   // 分页查询
   const list = await prisma.mail_histories.findMany({
     where,
     orderBy: { created_time: 'desc' },
     skip: (page - 1) * pageSize,
     take: pageSize,
     select: {
       id: true,
       scene: true,
       sender_name: true,
       recipient_name: true,
       core_points: true,
       is_favorite: true,
       created_time: true
     }
   });
   ```

5. **数据转换**:
   ```typescript
   const result = list.map(item => ({
     id: item.id,
     title: item.scene || `${item.sender_name} → ${item.recipient_name}`,
     preview: item.core_points?.substring(0, 80) + '...' || '',
     isFavorite: item.is_favorite,
     createdAt: formatDateTime(item.created_time)  // "YYYY-MM-DD HH:mm"
   }));
   ```

#### 异常处理

| 错误场景 | 错误码 | HTTP 状态码 | 处理方式 |
|---------|--------|-------------|---------|
| 未登录 | UNAUTHORIZED | 401 | 返回错误提示 |
| 参数无效 | INVALID_PARAMS | 400 | 返回具体错误信息 |
| 数据库查询失败 | DATABASE_ERROR | 500 | 记录日志，返回通用错误 |

#### 涉及的 DB 变更
- **查询表**: `mail_histories`
- **索引使用**: `idx_mail_histories_user_id`, `idx_mail_histories_created_time`, `idx_mail_histories_favorite`
- **查询性能**: 预期响应时间 < 200ms

---

### 2. 获取历史记录详情

**功能描述**: 根据历史记录 ID 获取完整的详情信息，包括输入需求和 AI 生成结果。

**路由**: `GET /api/history/[id]`

**权限**: 需要用户登录，且只能访问自己的数据

#### 请求参数

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | string (路径参数) | 是 | 历史记录 UUID | "550e8400-e29b-41d4-a716-446655440000" |

**请求示例**:
```typescript
// GET /api/history/550e8400-e29b-41d4-a716-446655440000
```

#### 响应数据

```typescript
interface HistoryDetailResponse {
  success: boolean;
  data: HistoryDetail;
}

interface HistoryDetail {
  id: string;
  senderName: string;         // 发送者姓名
  recipientName: string;      // 接收者姓名
  tone: string;              // 语气风格（逗号分隔）
  scene: string;             // 应用场景
  corePoints: string[];       // 核心要点数组
  mailContent: string;        // AI 生成的完整邮件内容
  isFavorite: boolean;
  createdAt: string;          // 格式：YYYY-MM-DD HH:mm
}
```

**成功响应示例**:
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
      "诚邀对方参加 11月15日 的战略研讨会",
      "提及我司最新的 AIGC 解决方案优势",
      "确认双方在明年的市场共享策略"
    ],
    "mailContent": "尊敬的卢经理：\n\n您好！\n\n回顾即将过去的...",
    "isFavorite": true,
    "createdAt": "2025-01-15 14:30"
  }
}
```

#### 业务逻辑

1. **权限验证**:
   - 从 Session 获取当前登录用户的 user_id
   - 如果未登录，返回 401 UNAUTHORIZED

2. **参数验证**:
   - id 必须是有效的 UUID 格式

3. **数据库查询** (Prisma):
   ```typescript
   const history = await prisma.mail_histories.findFirst({
     where: {
       id: requestId,
       user_id: currentUserId,
       is_deleted: false
     },
     select: {
       id: true,
       sender_name: true,
       recipient_name: true,
       tone: true,
       scene: true,
       core_points: true,
       mail_content: true,
       is_favorite: true,
       created_time: true
     }
   });
   ```

4. **数据转换**:
   ```typescript
   const result = {
     id: history.id,
     senderName: history.sender_name || '',
     recipientName: history.recipient_name || '',
     tone: history.tone || '',
     scene: history.scene || '',
     corePoints: history.core_points
       ? history.core_points.split('\n').filter(point => point.trim())
       : [],
     mailContent: history.mail_content,
     isFavorite: history.is_favorite,
     createdAt: formatDateTime(history.created_time)
   };
   ```

5. **权限检查**:
   - 如果记录不存在，返回 404 NOT_FOUND
   - 如果记录属于其他用户，返回 403 FORBIDDEN

#### 异常处理

| 错误场景 | 错误码 | HTTP 状态码 | 处理方式 |
|---------|--------|-------------|---------|
| 未登录 | UNAUTHORIZED | 401 | 返回错误提示 |
| 记录不存在 | NOT_FOUND | 404 | 返回"历史记录不存在" |
| 越权访问 | FORBIDDEN | 403 | 返回"无权访问该记录" |
| 数据库查询失败 | DATABASE_ERROR | 500 | 记录日志，返回通用错误 |

#### 涉及的 DB 变更
- **查询表**: `mail_histories`
- **索引使用**: 主键索引（id）
- **查询性能**: 预期响应时间 < 100ms

---

### 3. 搜索历史记录

**功能描述**: 根据关键词在历史记录中搜索，支持多个字段的模糊匹配。

**路由**: `POST /api/history/search`

**权限**: 需要用户登录

#### 请求参数

```typescript
interface SearchRequest {
  keyword: string;                    // 搜索关键词（必填）
  page?: number;                      // 页码，默认 1
  pageSize?: number;                  // 每页数量，默认 20
  startDate?: string;                 // 开始日期（可选）
  endDate?: string;                   // 结束日期（可选）
  showOnlyFavorites?: boolean;         // 是否仅显示收藏（可选）
}
```

**请求示例**:
```json
{
  "keyword": "邀请",
  "page": 1,
  "pageSize": 20,
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "showOnlyFavorites": false
}
```

#### 响应数据

与"获取历史记录列表"接口相同的响应格式。

```typescript
interface SearchResponse {
  success: boolean;
  data: {
    list: HistoryItem[];
    total: number;
    page: number;
    pageSize: number;
  };
}
```

#### 业务逻辑

1. **权限验证**:
   - 从 Session 获取当前登录用户的 user_id
   - 如果未登录，返回 401 UNAUTHORIZED

2. **参数验证**:
   - keyword 不能为空且长度 >= 2
   - 其他参数同"获取历史记录列表"

3. **数据库查询** (Prisma - 使用 PostgreSQL 的 ILIKE):
   ```typescript
   const where: any = {
     user_id: currentUserId,
     is_deleted: false,
     OR: [
       { scene: { contains: keyword, mode: 'insensitive' } },
       { sender_name: { contains: keyword, mode: 'insensitive' } },
       { recipient_name: { contains: keyword, mode: 'insensitive' } },
       { core_points: { contains: keyword, mode: 'insensitive' } },
       { mail_content: { contains: keyword, mode: 'insensitive' } }
     ]
   };

   // 添加时间范围筛选（同列表接口）
   // 添加收藏筛选（同列表接口）
   ```

4. **分页查询**:
   - 使用 `skip` 和 `take` 进行分页
   - 按 `created_time DESC` 排序

5. **数据转换**:
   - 与"获取历史记录列表"相同的转换逻辑

#### 异常处理

| 错误场景 | 错误码 | HTTP 状态码 | 处理方式 |
|---------|--------|-------------|---------|
| 未登录 | UNAUTHORIZED | 401 | 返回错误提示 |
| 关键词为空 | INVALID_PARAMS | 400 | 返回"搜索关键词不能为空" |
| 关键词过短 | INVALID_PARAMS | 400 | 返回"搜索关键词至少2个字符" |
| 数据库查询失败 | DATABASE_ERROR | 500 | 记录日志，返回通用错误 |

#### 涉及的 DB 变更
- **查询表**: `mail_histories`
- **索引使用**: `idx_mail_histories_user_id`
- **性能优化**: 对于大量数据，建议添加全文索引
- **查询性能**: 预期响应时间 < 500ms

---

### 4. 切换收藏状态

**功能描述**: 切换历史记录的收藏状态（收藏/取消收藏）。

**路由**: `PUT /api/history/[id]/favorite`

**权限**: 需要用户登录，且只能操作自己的数据

#### 请求参数

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | string (路径参数) | 是 | 历史记录 UUID | "550e8400-e29b-41d4-a716-446655440000" |
| isFavorite | boolean (请求体) | 否 | 目标收藏状态，不传则切换 | true |

**请求示例**:
```typescript
// 方式1：切换状态
PUT /api/history/550e8400-e29b-41d4-a716-446655440000/favorite
// 请求体: {}

// 方式2：设置状态
PUT /api/history/550e8400-e29b-41d4-a716-446655440000/favorite
// 请求体: { "isFavorite": true }
```

#### 响应数据

```typescript
interface ToggleFavoriteResponse {
  success: boolean;
  data: {
    id: string;
    isFavorite: boolean;
  };
}
```

**成功响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "isFavorite": true
  }
}
```

#### 业务逻辑

1. **权限验证**:
   - 从 Session 获取当前登录用户的 user_id
   - 如果未登录，返回 401 UNAUTHORIZED

2. **参数验证**:
   - id 必须是有效的 UUID 格式

3. **查询当前记录**:
   ```typescript
   const history = await prisma.mail_histories.findFirst({
     where: {
       id: requestId,
       user_id: currentUserId,
       is_deleted: false
     }
   });
   ```

4. **权限检查**:
   - 如果记录不存在，返回 404 NOT_FOUND
   - 如果记录属于其他用户，返回 403 FORBIDDEN

5. **切换逻辑**:
   ```typescript
   let newFavoriteStatus: boolean;

   if (isFavorite !== undefined) {
     // 明确指定状态
     newFavoriteStatus = isFavorite;
   } else {
     // 切换状态
     newFavoriteStatus = !history.is_favorite;
   }

   // 更新数据库
   const updated = await prisma.mail_histories.update({
     where: { id: requestId },
     data: {
       is_favorite: newFavoriteStatus,
       updated_time: new Date()
     },
     select: {
       id: true,
       is_favorite: true
     }
   });
   ```

#### 异常处理

| 错误场景 | 错误码 | HTTP 状态码 | 处理方式 |
|---------|--------|-------------|---------|
| 未登录 | UNAUTHORIZED | 401 | 返回错误提示 |
| 记录不存在 | NOT_FOUND | 404 | 返回"历史记录不存在" |
| 越权访问 | FORBIDDEN | 403 | 返回"无权访问该记录" |
| 数据库更新失败 | DATABASE_ERROR | 500 | 记录日志，返回通用错误 |

#### 涉及的 DB 变更
- **更新表**: `mail_histories`
- **更新字段**: `is_favorite`, `updated_time`
- **索引使用**: 主键索引（id）
- **查询性能**: 预期响应时间 < 150ms

---

### 5. 删除历史记录

**功能描述**: 软删除历史记录（仅用户侧隐藏，保留审计数据）。

**路由**: `DELETE /api/history/[id]`

**权限**: 需要用户登录，且只能删除自己的数据

#### 请求参数

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| id | string (路径参数) | 是 | 历史记录 UUID | "550e8400-e29b-41d4-a716-446655440000" |

**请求示例**:
```typescript
// DELETE /api/history/550e8400-e29b-41d4-a716-446655440000
```

#### 响应数据

```typescript
interface DeleteHistoryResponse {
  success: boolean;
  message: string;
}
```

**成功响应示例**:
```json
{
  "success": true,
  "message": "删除成功"
}
```

#### 业务逻辑

1. **权限验证**:
   - 从 Session 获取当前登录用户的 user_id
   - 如果未登录，返回 401 UNAUTHORIZED

2. **参数验证**:
   - id 必须是有效的 UUID 格式

3. **查询当前记录**:
   ```typescript
   const history = await prisma.mail_histories.findFirst({
     where: {
       id: requestId,
       user_id: currentUserId,
       is_deleted: false
     }
   });
   ```

4. **权限检查**:
   - 如果记录不存在，返回 404 NOT_FOUND
   - 如果记录属于其他用户，返回 403 FORBIDDEN

5. **软删除逻辑**:
   ```typescript
   await prisma.mail_histories.update({
     where: { id: requestId },
     data: {
       is_deleted: true,
       updated_time: new Date()
     }
   });
   ```

6. **审计日志** (可选，建议添加):
   ```typescript
   // 记录删除操作到审计日志（如果需要）
   await prisma.admin_operation_logs.create({
     data: {
       admin_id: currentUserId,
       action_type: 'DELETE_HISTORY',
       target_id: requestId,
       detail: `用户删除历史记录: ${requestId}`,
       ip: userIp
     }
   });
   ```

#### 异常处理

| 错误场景 | 错误码 | HTTP 状态码 | 处理方式 |
|---------|--------|-------------|---------|
| 未登录 | UNAUTHORIZED | 401 | 返回错误提示 |
| 记录不存在 | NOT_FOUND | 404 | 返回"历史记录不存在" |
| 越权访问 | FORBIDDEN | 403 | 返回"无权删除该记录" |
| 数据库更新失败 | DATABASE_ERROR | 500 | 记录日志，返回通用错误 |

#### 涉及的 DB 变更
- **更新表**: `mail_histories`
- **更新字段**: `is_deleted`, `updated_time`
- **索引使用**: 主键索引（id）
- **注意**: 采用软删除，不物理删除数据，保留审计需求
- **查询性能**: 预期响应时间 < 150ms

---

### 通用说明

#### 1. 统一响应格式

所有 API 接口统一使用以下响应格式：

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}
```

**成功示例**:
```json
{
  "success": true,
  "data": { /* 具体数据 */ }
}
```

**失败示例**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "未登录或登录已过期"
  }
}
```

#### 2. 错误码定义

| 错误码 | 说明 | HTTP 状态码 |
|--------|------|-------------|
| UNAUTHORIZED | 未登录 | 401 |
| FORBIDDEN | 权限不足 | 403 |
| NOT_FOUND | 资源不存在 | 404 |
| INVALID_PARAMS | 参数无效 | 400 |
| DATABASE_ERROR | 数据库错误 | 500 |
| INTERNAL_ERROR | 内部错误 | 500 |

#### 3. 用户身份验证

所有接口都需要从 Session 获取当前用户信息：

```typescript
// API 路由中的用户获取逻辑
async function getCurrentUserId(): Promise<string> {
  const session = await getServerSession();
  if (!session || !session.user?.id) {
    throw new Error('UNAUTHORIZED');
  }
  return session.user.id;
}
```

#### 4. 数据格式化工具函数

```typescript
// 格式化日期时间
function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm', { locale: zhCN });
}

// 截取预览文本
function getPreviewText(content: string, maxLength = 80): string {
  if (!content) return '';
  const text = content.substring(0, maxLength);
  return text + (content.length > maxLength ? '...' : '');
}
```

#### 5. 文件结构

```
app/api/history/
├── route.ts                    # GET/POST (列表/搜索)
├── [id]/
│   └── route.ts               # GET (详情)
│   └── favorite/
│       └── route.ts           # PUT (切换收藏)
│   └── route.ts               # DELETE (删除)

services/
└── historyService.ts          # 业务逻辑层
    ├── getHistories()         # 获取列表
    ├── getHistoryById()       # 获取详情
    ├── searchHistories()      # 搜索
    ├── toggleFavorite()       # 切换收藏
    ├── deleteHistory()        # 删除
    └── formatHistoryItem()    # 格式化数据

types/
└── history.ts                # 类型定义
```

#### 6. 性能要求

| 接口 | 预期响应时间 | 最大响应时间 |
|------|-------------|-------------|
| 获取列表 | < 200ms | 500ms |
| 获取详情 | < 100ms | 300ms |
| 搜索 | < 500ms | 1000ms |
| 切换收藏 | < 150ms | 300ms |
| 删除 | < 150ms | 300ms |

---

## 涉及的 DB 变更
本次需要实现完整的后端 API，涉及 `mail_histories` 表的查询和更新操作。

**数据来源**:
- 当前：Mock 数据（硬编码在组件中）
- 后续：从 `mail_histories` 表读取（通过 API）

---

## 异常处理

### 数据为空
- 列表为空：显示 "暂无历史记录"
- 详情为空：显示 "选择左侧历史记录查看详情"

### 数据加载失败（预留）
- 显示错误提示："加载失败，请稍后重试"
- 提供重试按钮

---

## 后续扩展

### 已完成 ✅
1. ~~实现 API 集成（从 mail_histories 表读取数据）~~ - 已完成 API 规范定义
2. ~~实现搜索功能~~ - 已完成 API 接口规范

### 进行中 🚧
3. 实现筛选功能（收藏、时间范围等）- 已完成 API 接口规范，待前端对接
4. 实现收藏功能（更新数据库）- 已完成 API 接口规范，待前端对接
5. 实现删除功能（软删除）- 已完成 API 接口规范，待前端对接

### 待开发 ⏳
6. 实现复制功能（带 Toast 提示）- UI 已有，需添加实际功能
7. 实现分页加载（无限滚动）- API 已支持，需前端实现
8. 添加响应式优化（移动端适配）
9. 添加批量操作功能（批量删除、批量收藏）
10. 添加导出功能（导出为 PDF/Word）

---

## 验收标准

### 前端验收标准
- [x] 所有组件创建完成
- [x] 深色/浅色模式切换正常
- [x] 响应式布局在不同屏幕尺寸下正常
- [x] 视觉样式符合设计稿
- [x] 点击卡片能正确切换详情
- [x] 空状态显示正常
- [x] 代码遵循项目规范
- [x] 规范文档已创建
- [x] 无 linter 错误
- [x] 所有代码包含中文注释

### 后端 API 验收标准
- [ ] 获取历史记录列表接口正常工作
- [ ] 获取历史记录详情接口正常工作
- [ ] 搜索接口支持多字段模糊匹配
- [ ] 切换收藏状态接口正常工作
- [ ] 删除接口实现软删除功能
- [ ] 所有接口的权限验证正常（防止越权访问）
- [ ] 分页功能正常工作
- [ ] 时间范围筛选功能正常
- [ ] 收藏筛选功能正常
- [ ] 错误处理完善，返回正确的错误码和提示
- [ ] 接口响应时间符合性能要求
- [ ] 数据库查询使用正确的索引
- [ ] API 接口代码遵循项目规范
- [ ] Service 层业务逻辑清晰，不包含 HTTP 响应逻辑
- [ ] 所有代码包含中文注释

### 联调验收标准
- [ ] 前端能正确调用后端 API
- [ ] 筛选功能在前后端正常工作
- [ ] 搜索功能在前后端正常工作
- [ ] 收藏功能在前后端正常工作
- [ ] 删除功能在前后端正常工作
- [ ] 数据加载和刷新正常
- [ ] 错误提示友好且准确

---

## Mock 数据示例

### 完整 Mock 数据结构

```typescript
const mockHistories: HistoryItem[] = [
  {
    id: "1",
    title: "业务邀请函",
    preview: "关于明年的战略合作伙伴邀请函，重点突出技术优势与市场份额...",
    isFavorite: true,
    createdAt: "2023-10-24 14:30"
  },
  {
    id: "2",
    title: "项目进度报告",
    preview: "Q3季度智慧城市项目的开发进展，包含已完成模块与风险评估...",
    isFavorite: false,
    createdAt: "2023-10-23 11:15"
  },
  {
    id: "3",
    title: "会议纪要",
    preview: "关于研发中心扩建的讨论摘要，明确了选址标准与预算范围...",
    isFavorite: false,
    createdAt: "2023-10-23 09:45"
  },
  {
    id: "4",
    title: "员工表彰草案",
    preview: "针对年度优秀团队的颁奖词，要求语气诚恳且富有激励性...",
    isFavorite: false,
    createdAt: "2023-10-22 18:20"
  }
];

const mockDetails: HistoryDetail[] = [
  {
    id: "1",
    senderName: "市场部 张伟",
    recipientName: "极光科技 卢经理",
    tone: "专业严谨,诚恳礼貌",
    scene: "商业合作伙伴年度邀请",
    corePoints: [
      "回顾过去一年在云服务领域的紧密合作",
      "诚邀对方参加 11月15日 的战略研讨会",
      "提及我司最新的 AIGC 解决方案优势",
      "确认双方在明年的市场共享策略"
    ],
    mailContent: `尊敬的卢经理：

您好！

回顾即将过去的 2023 年，我们双方在云服务基础设施建设领域的紧密协作不仅取得了令人瞩目的市场成绩，更建立起了深厚的战略互信。在此，我谨代表市场部向贵司一直以来的支持与配合表示最诚挚的谢意。

为了进一步深化双方合作关系，并共同探讨在 AIGC 技术爆发背景下的市场新机遇，我们计划于 2023年11月15日 在上海总部举办"2024 年度战略合作伙伴研讨会"。届时，我司将首次公开演示最新的 FluentWJ 企业级 AIGC 解决方案，旨在通过 AI 技术赋能双方在业务流程自动化方面的效率提升。

我们非常期待能与贵司在明年的市场共享策略及联合营销方案上达成更高水平的共识。随信附上本次会议的初步议程，请您查收。

顺颂商祺！

张伟
市场部
2023年10月24日`,
    isFavorite: true,
    createdAt: "2023-10-24 14:30"
  }
  // ... 其他详情数据
];
```

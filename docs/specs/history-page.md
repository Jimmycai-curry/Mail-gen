# 历史记录页面功能规范

## Spec 概述
本规范描述 FluentWJ 工作台历史记录页面的前端组件实现和功能逻辑。

**文档版本**: v1.0
**创建日期**: 2025-01-14
**相关组件**:
- `components/ui/Sidebar.tsx`
- `components/ui/Footer.tsx`
- `components/history/HistoryList.tsx`
- `components/history/HistoryDetail.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/history/page.tsx`

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

### 基础展示流程
1. 页面加载，显示 Mock 数据列表
2. 用户点击历史记录卡片
3. 触发 `onSelectHistory`，更新选中状态
4. 根据选中 ID 查找详情数据
5. 在右侧 HistoryDetail 中展示完整信息

### UI 交互（暂未实现功能）
- 搜索：在列表中过滤（UI 仅展示）
- 筛选：按收藏、时间等筛选（UI 仅展示）
- 复制：复制邮件内容到剪贴板（UI 仅展示）
- 收藏：切换收藏状态（UI 仅展示）

---

## 涉及的 DB 变更
暂无（本次仅实现前端 UI，使用 Mock 数据，未涉及数据库操作）

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
1. 实现 API 集成（从 mail_histories 表读取数据）
2. 实现搜索功能
3. 实现筛选功能（收藏、时间范围等）
4. 实现复制功能（带 Toast 提示）
5. 实现收藏功能（更新数据库）
6. 实现分页加载（无限滚动）
7. 添加响应式优化（移动端适配）

---

## 验收标准
- [ ] 所有组件创建完成
- [ ] 深色/浅色模式切换正常
- [ ] 响应式布局在不同屏幕尺寸下正常
- [ ] 视觉样式符合设计稿
- [ ] 点击卡片能正确切换详情
- [ ] 空状态显示正常
- [ ] 代码遵循项目规范
- [ ] 规范文档已创建
- [ ] 无 linter 错误
- [ ] 所有代码包含中文注释

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

# Dashboard 撰写页面功能规范

## Spec 概述
本规范描述 FluentWJ 工作台撰写页面的前端组件实现和功能逻辑。

**文档版本**: v1.0
**创建日期**: 2025-01-13
**相关组件**:
- `components/ui/Sidebar.tsx`
- `components/ui/Footer.tsx`
- `components/writing/WritingForm.tsx`
- `components/writing/ResultViewer.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/page.tsx`

---

## 功能描述
用户在工作台撰写页面可以：
1. 通过表单输入业务场景、语气、收件人信息和核心要点
2. 点击生成按钮获取 AI 生成的商务内容
3. 查看生成结果并进行操作（复制、点赞、点踩、重新生成）

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
│  │    WritingForm       │      ResultViewer            ││
│  │    (40%)              │       (60%)                 ││
│  │                      │                              ││
│  │ - 业务场景           │ - 工具栏                    ││
│  │ - 语气选择           │   - 复制、点踩、点赞         ││
│  │ - 收件人姓名         │   - 重新生成                ││
│  │ - 收件人身份         │ - 内容展示区                ││
│  │ - 核心要点           │ - AI 免责声明               ││
│  │ - 立即生成按钮       │                              ││
│  │                      │                              ││
│  └──────────────────────┴──────────────────────────────┘│
├─────────────────────────────────────────────────────────┤
│                    Footer (底部信息)                     │
│  - 版权、隐私政策、服务协议、备案号                       │
└─────────────────────────────────────────────────────────┘
```

## 组件详细说明

### 1. Sidebar 组件 (`components/ui/Sidebar.tsx`)

**Props 接口**:
```typescript
interface SidebarProps {
  activeNav?: 'writing' | 'history';
}
```

**功能说明**:
- 显示 FluentWJ Logo 和副标题
- 导航菜单：撰写、历史记录（已移除收藏功能）
- 用户信息卡片：头像、用户名、账户类型
- 根据当前页面高亮对应导航项

**样式规范**:
- 背景色：`#0d0d1c`
- 文字颜色：白色
- 激活导航项：`bg-white/10` + 左边框 `border-white 3px`
- 宽度：`w-64` (256px)

---

### 2. Footer 组件 (`components/ui/Footer.tsx`)

**功能说明**:
- 版权信息：© 2024 FluentWJ. All rights reserved.
- 链接：隐私政策、服务协议
- 备案信息：ICP 备案号、算法备案号

**样式规范**:
- 高度：`h-10` (40px)
- 背景色：`bg-white` (浅色) / `dark:bg-slate-950` (深色)
- 边框：`border-t border-slate-200 dark:border-slate-800`
- 文字大小：`text-[10px]`

---

### 3. WritingForm 组件 (`components/writing/WritingForm.tsx`)

**Props 接口**:
```typescript
interface WritingFormProps {
  onSubmit?: (data: FormData) => void;
}
```

**表单字段**:
1. **业务场景** (Select)
   - 选项：商务邮件、工作汇报、项目提案、正式公告
   - 默认值：空（提示用户选择）

2. **语气选择** (Button 组)
   - 选项：正式、友好、紧急、幽默
   - 默认值：正式
   - 选中样式：primary 背景 + 白色文字
   - 未选中样式：灰色背景

3. **收件人姓名** (Input)
   - 占位符："输入收件人姓名"

4. **收件人身份** (Input)
   - 占位符："输入收件人职位或背景 (如: 销售总监, 技术合作伙伴)"

5. **核心要点** (Textarea)
   - 占位符："请简述您想表达的核心内容，多个要点请分行输入..."
   - 高度：6 行

6. **立即生成内容** (Button)
   - 完整宽度
   - primary 背景（#0505d6）
   - 图标：Bolt
   - 阴影：`shadow-lg shadow-primary/20`

**状态管理**:
```typescript
const [scenario, setScenario] = useState("");
const [tone, setTone] = useState("formal");
const [recipientName, setRecipientName] = useState("");
const [recipientRole, setRecipientRole] = useState("");
const [keyPoints, setKeyPoints] = useState("");
```

**样式规范**:
- 表单间距：`space-y-6`
- 标签样式：`text-sm font-semibold text-slate-700 dark:text-slate-300`
- 输入框高度：`h-12`
- 圆角：`rounded-lg`

---

### 4. ResultViewer 组件 (`components/writing/ResultViewer.tsx`)

**Props 接口**:
```typescript
interface ResultViewerProps {
  content?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  auditLogId?: string;  // 新增：关联的审计日志 ID（用于反馈提交）
}
```

**功能说明**:
- 顶部工具栏：复制、点踩、点赞、重新生成
- 内容展示区：富文本展示（Prose 样式）
- 空状态："点击左侧"立即生成"按钮开始撰写..."
- 底部提示：AI 免责声明

**工具栏按钮**:
- 复制：`Copy` 图标
- 建议：`Lightbulb` 图标（已提交后显示 `Check`）
- 内容举报：`Flag` 图标（已提交后显示 `Check`）
- 用户反馈：`MessageSquare` 图标（已提交后显示 `Check`）
- ~~点踩、点赞、重新生成：已移除~~
- ~~收藏：已移除~~

**样式规范**:
- 内容区域背景：`bg-white dark:bg-slate-900`
- 边框：`border border-slate-200 dark:border-slate-800`
- 圆角：`rounded-xl`
- 内边距：`p-8`
- 阴影：`shadow-sm`

---

## 布局规范

### Dashboard 布局 (`app/(dashboard)/layout.tsx`)

**布局结构**:
- 左侧：`Sidebar`（固定宽度）
- 右侧：
  - 主内容区：`{children}`（Flex-1）
  - 底部：`Footer`

**样式规范**:
- 高度：`h-screen`
- 背景色：`background-light` / `background-dark`
- 溢出处理：`overflow-hidden`

### 撰写页面布局 (`app/(dashboard)/page.tsx`)

**左右分栏**:
- 左侧表单：`w-40-percent` (40%)
- 右侧结果：`w-60-percent` (60%)
- 分隔线：`border-r border-slate-200 dark:border-slate-800`

**样式规范**:
- 左侧背景：`bg-white dark:bg-slate-900/50`
- 右侧背景：`bg-background-light dark:bg-background-dark`
- 内边距：`p-8`

---

## 主题系统

### 颜色变量

**浅色模式**:
```css
--background: #f5f5f8
--foreground: #0f172a
--primary: #0505d6
--sidebar-bg: #0d0d1c
--card-bg: #ffffff
--border-color: #e2e8f0
--text-muted: #64748b
```

**深色模式**:
```css
--background: #0f0f23
--foreground: #f1f5f9
--sidebar-bg: #0d0d1c
--card-bg: #1e293b
--border-color: #334155
--text-muted: #94a3b8
```

### 主题切换
- 使用 `next-themes` 库
- 默认主题：`system`（跟随系统）
- 支持手动切换深色/浅色模式

---

## 功能逻辑

### 撰写流程
1. 用户填写表单（业务场景、语气、收件人信息、核心要点）
2. 点击"立即生成内容"按钮
3. 调用 API 生成内容（暂未实现）
4. 在 `ResultViewer` 中展示结果
5. 用户可通过工具栏进行操作

### 工具栏操作
- **复制**：将内容复制到剪贴板（使用 Toast 提示）
- **建议**：提交改进建议（弹窗输入，连通 feedbacks 数据库）
- **内容举报**：举报不当内容（弹窗输入，连通 feedbacks 数据库）
- **用户反馈**：自定义反馈（弹窗输入，连通 feedbacks 数据库）
- ~~**点赞/点踩/重新生成**：已移除~~

---

## 涉及的 DB 变更
暂无（本次仅实现前端 UI，未涉及数据库操作）

---

## 异常处理
暂无（本次仅实现前端 UI，未涉及 API 调用）

---

## 后续扩展
1. ~~实现 API 集成（AI 生成接口）~~ ✅ 已完成
2. ~~实现反馈功能~~ ✅ 已完成（建议、举报、自定义反馈）
3. ~~实现复制到剪贴板的 Toast 提示~~ ✅ 已完成
4. 添加更多表单验证
5. 实现历史记录功能
6. 添加响应式优化（移动端适配）
7. 实现重新生成功能（使用相同参数重新调用 API）

---

## 验收标准
- [x] 所有组件创建完成
- [x] 深色/浅色模式切换正常
- [ ] 响应式布局在不同屏幕尺寸下正常
- [x] 视觉样式符合设计稿
- [x] 无收藏功能
- [x] 代码遵循项目规范
- [x] 规范文档已创建
- [ ] 无 linter 错误
- [x] 所有代码包含中文注释


# 企业落地页功能规范

## Spec 概述
本规范描述 FluentWJ 企业落地页的前端组件实现和功能逻辑，该页面为网站默认访问页面，展示产品核心价值和特性。

**文档版本**: v1.0
**创建日期**: 2025-01-14
**相关组件**:
- `components/landing/Navbar.tsx`
- `components/landing/HeroSection.tsx`
- `components/landing/FeatureSection.tsx`
- `components/landing/CTACard.tsx`
- `components/landing/Footer.tsx`
- `app/page.tsx`
- `utils/toast.ts`

---

## 功能描述
企业落地页用于展示 FluentWJ 产品定位和核心能力，主要包含：
1. 顶部导航栏：Logo展示、产品导航、登录入口
2. 首屏Hero区域：产品价值主张、产品演示Mockup、主要行动号召
3. 核心能力展示区域：3个企业级核心能力特性卡片
4. CTA区域：强化用户转化行动
5. 页脚：合规信息、版权声明、相关链接

## 页面结构

```
┌───────────────────────────────────────────────────────────────┐
│                   Navbar (Sticky导航栏)                        │
│  - Logo (mail图标 + FluentWJ)                                 │
│  - 导航链接：产品特性、行业解决方案、价格方案                   │
│  - 登录按钮                                                   │
├───────────────────────────────────────────────────────────────┤
│                    Hero Section (首屏区域)                     │
│  ┌────────────────────────────┬────────────────────────────┐  │
│  │     左侧内容区              │      右侧产品演示区         │  │
│  │  - 标签："企业级解决方案"   │  - 产品Mockup界面           │  │
│  │  - 主标题                 │  - AI状态悬浮卡片           │  │
│  │  - 副标题                 │  - (可替换为真实截图)        │  │
│  │  - CTA按钮组              │                             │  │
│  └────────────────────────────┴────────────────────────────┘  │
├───────────────────────────────────────────────────────────────┤
│              Feature Section (核心能力展示区域)                 │
│  ┌──────────────┬──────────────┬──────────────┐               │
│  │   结构化写作  │  语境化回复   │  审计与合规   │               │
│  └──────────────┴──────────────┴──────────────┘               │
├───────────────────────────────────────────────────────────────┤
│                  CTA Section (号召行动区域)                    │
│  - 标题："准备好变革您的商务写作了吗？"                       │
│  - 副标题："加入全球领先企业，与 FluentWJ 一起..."             │
│  - CTA按钮：立即开始、联系销售                                │
├───────────────────────────────────────────────────────────────┤
│                      Footer (页脚)                            │
│  - Logo区域                                                   │
│  - 链接：ICP备案、AI算法备案、隐私政策                        │
│  - 版权信息 + 图标                                             │
└───────────────────────────────────────────────────────────────┘
```

## 组件详细说明

### 1. Navbar 组件 (`components/landing/Navbar.tsx`)

**Props 接口**:
```typescript
// 无Props，纯展示组件
```

**功能说明**:
- Sticky定位，背景毛玻璃效果 (`backdrop-blur-md`)
- Logo区域：mail图标 + "FluentWJ" 标题
- 导航链接：产品特性、行业解决方案、价格方案（点击显示"功能开发中"Toast）
- 登录按钮：点击跳转到 `/login` 路由

**样式规范**:
- 定位：`sticky top-0 z-50`
- 背景：`bg-white/80 dark:bg-background-dark/80`
- 边框：`border-b border-[#e6ebf4] dark:border-gray-800`
- 最大宽度：`max-w-[1280px]`
- 内边距：`px-6 lg:px-10 py-4`

---

### 2. HeroSection 组件 (`components/landing/HeroSection.tsx`)

**Props 接口**:
```typescript
// 无Props，纯展示组件
```

**功能说明**:

**左侧内容**:
- 标签："企业级解决方案"（蓝色背景badge）
- 主标题："AI 驱动的跨境商务写作助手"
- 副标题："提升效率的同时确保企业级合规与品牌一致性。"
- CTA按钮组：
  - "开始使用"按钮（primary背景）→ 跳转到 `/login`
  - "预约演示"按钮（白色背景边框）→ 显示"功能开发中"Toast

**右侧内容**:
- 产品演示Mockup（HTML/CSS构建的静态界面）
  - 侧边栏区域（40%宽度）：输入表单占位
  - 主内容区域（60%宽度）：生成结果展示占位
  - AI状态悬浮卡片（绝对定位）："AI状态" + 进度条 + "语气：商务专业"
- 注：Mockup后期可替换为真实产品截图

**样式规范**:
- 背景图案：`grid-pattern` (径向渐变网格)
- 内边距：`py-16 lg:py-24`
- 间距：`lg:gap-16`
- Mockup样式：
  - 边框：`border border-[#e6ebf4] dark:border-gray-700`
  - 阴影：`shadow-2xl`
  - 圆角：`rounded-xl`

---

### 3. FeatureSection 组件 (`components/landing/FeatureSection.tsx`)

**Props 接口**:
```typescript
interface FeatureCard {
  icon: string;        // Material Symbol 图标名称
  title: string;       // 标题
  description: string; // 描述文字
}

// 无Props，内部定义特性卡片数据
```

**功能说明**:
- 区域标题："企业级核心能力"
- 副标题："专为追求卓越与安全的全球化商务团队打造。"
- 3个特性卡片：
  1. **结构化写作** (description图标)
     - 描述："专为复杂商务文档、报告和正式提案设计的模版与 AI 引导提示。"
  2. **语境化回复** (forum图标)
     - 描述："基于完整邮件往来记录和特定业务背景，生成智能且得体的响应。"
  3. **审计与合规** (verified_user图标)
     - 描述："内置安全防护机制，确保所有沟通均符合严格的企业治理与合规标准。"

**样式规范**:
- 背景：`bg-white dark:bg-background-dark/50`
- 内边距：`py-24`
- 卡片样式：
  - 边框：`border border-[#cdd8ea] dark:border-gray-700`
  - 背景：`bg-background-light dark:bg-gray-800/50`
  - 内边距：`p-8`
  - 圆角：`rounded-xl`
- Hover效果：
  - 边框：`hover:border-primary/50`
  - 阴影：`hover:shadow-xl`
  - 上浮：`hover:-translate-y-1`

---

### 4. CTACard 组件 (`components/landing/CTACard.tsx`)

**Props 接口**:
```typescript
// 无Props，纯展示组件
```

**功能说明**:
- 背景：primary色块 + 5%透明度 (`bg-primary/5`)
- 标题："准备好变革您的商务写作了吗？"
- 副标题："加入全球领先企业，与 FluentWJ 一起实现卓越的沟通力。"
- CTA按钮组：
  - "立即开始"按钮（白色背景，primary文字）→ 跳转到 `/login`
  - "联系销售"按钮（白色边框，透明背景）→ 显示"功能开发中"Toast

**样式规范**:
- 容器：
  - 背景：`bg-primary dark:bg-primary/90`
  - 阴影：`shadow-2xl`
  - 圆角：`rounded-3xl`
  - 内边距：`px-8 py-16`
  - 文字颜色：`text-white`
- 按钮：
  - "立即开始"：白色背景 + 阴影
  - "联系销售"：`border border-white/30 bg-white/10` + `backdrop-blur-sm`

---

### 5. Footer 组件 (`components/landing/Footer.tsx`)

**Props 接口**:
```typescript
// 无Props，纯展示组件
```

**功能说明**:
- Logo区域：mail图标 + "FluentWJ" 标题
- 链接区域：
  - ICP 备案信息
  - AI 算法备案登记
  - 隐私政策
- 版权信息："© 2023 FluentWJ Enterprise. 版权所有。"
- 图标：language、shield（右下角）

**样式规范**:
- 背景：`bg-white dark:bg-background-dark`
- 边框：`border-t border-[#e6ebf4] dark:border-gray-800`
- 内边距：`py-12`
- 最大宽度：`max-w-[1280px]`

---

### 6. Toast 工具 (`utils/toast.ts`)

**函数接口**:
```typescript
/**
 * 显示功能开发中的提示信息
 * @param message 提示信息（默认："功能开发中，敬请期待"）
 */
export function showComingSoonToast(message?: string): void;
```

**功能说明**:
- 使用浏览器原生 alert 显示提示信息
- 用于暂未实现的功能按钮点击反馈
- 可自定义提示文字

---

## 页面布局 (`app/page.tsx`)

**布局结构**:
```tsx
<main className="flex-grow">
  <HeroSection />
  <FeatureSection />
  <CTACard />
</main>
```

**完整页面结构**:
```tsx
<div className="relative flex min-h-screen flex-col overflow-x-hidden">
  <Navbar />
  <main className="flex-grow">
    <HeroSection />
    <FeatureSection />
    <CTACard />
  </main>
  <Footer />
</div>
```

**样式规范**:
- 最小高度：`min-h-screen`
- 垂直布局：`flex flex-col`
- 溢出处理：`overflow-x-hidden`

---

## 功能逻辑

### 路由跳转
- **登录按钮**：点击后使用 Next.js `useRouter` 跳转到 `/login`
- **"开始使用"、"立即开始"**：同样跳转到 `/login`

### 未实现功能提示
- **"预约演示"、"联系销售"**：点击显示 `showComingSoonToast()`
- **导航链接**（产品特性、行业解决方案、价格方案）：点击显示 `showComingSoonToast()`

### 产品Mockup
- 初始使用 HTML/CSS 构建静态 Mockup
- 预留图片占位符，方便后期替换为真实产品截图
- Mockup 不需要交互功能，纯视觉展示

---

## 技术约束

### 样式框架
- 使用 Tailwind CSS 实现响应式布局
- 支持 `dark:` 类名实现深色模式
- 遵循 Shadcn/UI 设计风格

### 字体与图标
- 字体：Inter + Noto Sans SC（已在 `app/layout.tsx` 中配置）
- 图标：Material Symbols Outlined（已在 `app/layout.tsx` 中引入）

### 颜色系统
- 主色：`#0052D9` (primary)
- 背景色（浅色）：`#f5f6f8`
- 背景色（深色）：`#0f1723`
- 文字颜色（浅色）：`#0c121d`
- 文字颜色（深色）：`white`
- 辅助色：`#4568a1` (secondary)

### 响应式断点
- 移动端（<768px）：单列布局
- 平板端（768px-1024px）：调整间距和字体大小
- 桌面端（>1024px）：完整双列布局

---

## 涉及的 DB 变更
无（本次仅实现前端 UI，未涉及数据库操作）

---

## 异常处理

### 图片加载失败
- 产品Mockup使用HTML/CSS构建，不涉及图片加载
- 若后续替换为真实截图，需要添加图片加载失败的占位符

### 按钮点击反馈
- 所有未实现功能的按钮点击时，显示友好的"功能开发中"提示
- 使用简单的 alert 实现提示，避免复杂的 Toast 组件依赖

---

## 后续扩展

1. **真实产品截图**：Hero区域Mockup替换为真实的产品截图
2. **动画效果**：添加进入动画、滚动视差等效果增强体验
3. **SEO优化**：添加meta标签、结构化数据提升搜索引擎收录
4. **性能优化**：图片懒加载、代码分割优化首屏加载速度
5. **国际化**：支持多语言切换（英文、日文等）
6. **A/B测试**：不同文案或布局的A/B测试

---

## 验收标准
- [ ] 技术规范文档已创建
- [ ] 所有Landing组件创建完成
- [ ] 深色/浅色模式切换正常
- [ ] 响应式布局在不同屏幕尺寸下正常
- [ ] 视觉样式符合UI原型
- [ ] 登录按钮正确跳转到 `/login` 路由
- [ ] 未实现功能点击显示友好提示
- [ ] 代码遵循SDD分层规范
- [ ] 无 linter 错误
- [ ] 所有代码包含中文注释

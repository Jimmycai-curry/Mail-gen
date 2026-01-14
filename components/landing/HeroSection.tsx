// Spec: /docs/specs/landing-page.md
'use client';

import { useRouter } from 'next/navigation';
import { showComingSoonToast } from '@/utils/toast';

/**
 * 首屏Hero区域组件
 * 功能：展示产品价值主张、产品演示Mockup和主要行动号召
 */
export default function HeroSection() {
  // 路由跳转钩子
  const router = useRouter();

  // 处理"开始使用"按钮点击
  const handleStartClick = () => {
    router.push('/login');
  };

  // 处理"预约演示"按钮点击
  const handleDemoClick = () => {
    showComingSoonToast();
  };

  return (
    <section className="relative grid-pattern">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* 左侧内容区 */}
          <div className="flex flex-col gap-8 flex-1 text-left">
            <div className="flex flex-col gap-4">
              {/* 标签 */}
              <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 w-fit px-3 py-1 rounded-full">
                企业级解决方案
              </span>
              {/* 主标题 */}
              <h1 className="text-[#0c121d] dark:text-white text-4xl font-black leading-tight tracking-[-0.03em] md:text-5xl lg:text-6xl">
                AI 驱动的跨境商务写作助手
              </h1>
              {/* 副标题 */}
              <p className="text-[#4568a1] dark:text-gray-400 text-lg leading-relaxed max-w-[540px]">
                提升效率的同时确保企业级合规与品牌一致性。
              </p>
            </div>
            {/* CTA按钮组 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartClick}
                className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                开始使用
              </button>
              {/* <button
                onClick={handleDemoClick}
                className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-white dark:bg-gray-800 border border-[#e6ebf4] dark:border-gray-700 text-[#0c121d] dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                预约演示
              </button> */}
            </div>
          </div>

          {/* 右侧产品演示Mockup */}
          <div className="flex-1 w-full max-w-[600px] lg:max-w-none">
            <div className="relative rounded-xl border border-[#e6ebf4] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl p-2">
              {/* Mockup主容器 */}
              <div className="mockup-container dark:bg-gray-900 border border-[#e6ebf4] dark:border-gray-700">
                {/* 侧边栏区域 */}
                <div className="mockup-sidebar dark:bg-gray-800/50">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-8 w-full bg-primary/5 rounded border border-primary/20 flex items-center px-2">
                      <div className="h-2 w-full bg-primary/20 rounded"></div>
                    </div>
                    <div className="h-8 w-full bg-gray-50 dark:bg-gray-700/50 rounded flex items-center px-2">
                      <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="h-8 w-full bg-gray-50 dark:bg-gray-700/50 rounded flex items-center px-2">
                      <div className="h-2 w-5/6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                    <div className="h-1.5 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-24 w-full bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 w-4/5 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
                {/* 主内容区域 */}
                <div className="mockup-main dark:bg-gray-900">
                  <div className="flex justify-between mb-6">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                      <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                    <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    <div className="h-32 w-full bg-primary/5 rounded-lg border border-dashed border-primary/30 flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                      <div className="h-2 w-24 bg-primary/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI状态悬浮卡片 */}
              <div className="absolute -bottom-6 -left-6 hidden md:block w-48 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">AI 状态</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-600 rounded-full">
                  <div className="h-2 w-3/4 bg-primary rounded-full"></div>
                </div>
                <p className="text-[11px] mt-2 text-gray-500 dark:text-gray-300">语气：商务专业</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

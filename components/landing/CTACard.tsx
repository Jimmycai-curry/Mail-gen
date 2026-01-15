// Spec: /docs/specs/landing-page.md
'use client';

import { useRouter } from 'next/navigation';
import { showComingSoonToast } from '@/utils/toast';

/**
 * CTA区域组件
 * 功能：强化用户转化行动
 */
export default function CTACard() {
  // 路由跳转钩子
  const router = useRouter();

  // 处理"立即开始"按钮点击
  const handleStartClick = () => {
    router.push('/login');
  };

  // 处理"联系销售"按钮点击
  const handleContactClick = () => {
    showComingSoonToast();
  };

  return (
    <section className="relative overflow-hidden py-24">
      {/* 背景色块 */}
      <div className="absolute inset-0 bg-primary opacity-5"></div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="relative flex flex-col items-center gap-8 rounded-3xl bg-primary dark:bg-primary/90 px-8 py-16 text-center text-white shadow-2xl">
          {/* 标题和副标题 */}
          <div className="flex flex-col gap-4 max-w-[720px]">
            <h2 className="text-3xl font-black md:text-5xl tracking-tight leading-tight">
              准备好变革您的商务写作了吗？
            </h2>
            <p className="text-white/80 text-lg md:text-xl">
              加入全球领先企业，与 FluentWJ 一起实现卓越的沟通力。
            </p>
          </div>

          {/* CTA按钮组 */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <button
              onClick={handleStartClick}
              className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-white text-primary text-base font-bold shadow-lg hover:bg-gray-50 transition-all"
            >
              立即开始
            </button>
            {/* <button
              onClick={handleContactClick}
              className="flex min-w-[200px] items-center justify-center rounded-lg h-14 px-8 border border-white/30 bg-white/10 text-white text-base font-bold backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              联系销售
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}

// Spec: /docs/specs/landing-page.md
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection';
import CTACard from '@/components/landing/CTACard';
import Footer from '@/components/landing/Footer';

/**
 * FluentWJ 企业落地页
 * 功能：展示产品核心价值和特性，引导用户登录
 */
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* 顶部导航栏 */}
      <Navbar />

      {/* 主内容区 */}
      <main className="flex-grow">
        {/* 首屏Hero区域 */}
        <HeroSection />
        
        {/* 核心能力展示区域 */}
        <FeatureSection />
        
        {/* CTA区域 */}
        <CTACard />
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}

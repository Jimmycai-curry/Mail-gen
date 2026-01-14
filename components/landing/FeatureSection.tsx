// Spec: /docs/specs/landing-page.md

/**
 * 特性卡片数据接口
 */
interface FeatureCard {
  icon: string;        // Material Symbol 图标名称
  title: string;       // 标题
  description: string; // 描述文字
}

/**
 * 核心能力展示区域组件
 * 功能：展示3个企业级核心能力特性卡片
 */
export default function FeatureSection() {
  // 特性卡片数据
  const features: FeatureCard[] = [
    {
      icon: 'description',
      title: '结构化写作',
      description: '专为复杂商务文档、报告和正式提案设计的模版与 AI 引导提示。',
    },
    {
      icon: 'forum',
      title: '语境化回复',
      description: '基于完整邮件往来记录和特定业务背景，生成智能且得体的响应。',
    },
    {
      icon: 'verified_user',
      title: '审计与合规',
      description: '内置安全防护机制，确保所有沟通均符合严格的企业治理与合规标准。',
    },
  ];

  return (
    <section className="bg-white dark:bg-background-dark/50 py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="flex flex-col gap-16">
          {/* 区域标题 */}
          <div className="flex flex-col gap-4 text-center items-center">
            <h2 className="text-[#0c121d] dark:text-white text-3xl font-bold tracking-tight md:text-4xl">
              企业级核心能力
            </h2>
            <p className="text-[#4568a1] dark:text-gray-400 text-lg max-w-[720px]">
              专为追求卓越与安全的全球化商务团队打造。
            </p>
          </div>

          {/* 特性卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex flex-col gap-6 rounded-xl border border-[#cdd8ea] dark:border-gray-700 bg-background-light dark:bg-gray-800/50 p-8 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* 图标 */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">{feature.icon}</span>
                </div>

                {/* 标题和描述 */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0c121d] dark:text-white text-xl font-bold leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[#4568a1] dark:text-gray-400 text-base font-normal leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

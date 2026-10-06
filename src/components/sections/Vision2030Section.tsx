import React, { useState } from 'react';
import { Language } from '../../types';
import { MEGA_PROJECTS } from '../../data/websiteContent';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Vision2030SectionProps {
  language: Language;
  onOpenPrivateOffice: () => void;
}

export const Vision2030Section: React.FC<Vision2030SectionProps> = ({
  language,
  onOpenPrivateOffice,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState(0);

  const selectedProject = MEGA_PROJECTS[activeTab] || MEGA_PROJECTS[0];

  return (
    <section id="vision2030" className="py-20 bg-white border-t border-neutral-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Column Methodology, Analysis, Assurance (Direct from Image 7) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 mb-16 border-b border-neutral-200">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono block">
              {isAr ? 'المنهجية' : 'METHODOLOGY'}
            </span>
            <h3 className="font-serif text-2xl text-[#0C3826] font-normal">
              {isAr ? 'خدمة استثنائية' : 'Elevated Service'}
            </h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              {isAr
                ? 'سواء كنت تستثمر في شقة مميزة تحت الإنشاء أو تبني محفظة إيجارية عالية العائد، تقدم لك نجم العقارية وصولاً سهلاً ومباشراً ورعاية مخصصة.'
                : 'Whether you are acquiring a prime off-plan residence or securing a landmark family home, Najm Estates delivers transparent access and the attentive care of a dedicated private advisor.'}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono block">
              {isAr ? 'التحليل والبيانات' : 'ANALYSIS'}
            </span>
            <h3 className="font-serif text-2xl text-[#0C3826] font-normal">
              {isAr ? 'رؤية سوقية دقيقة' : 'Real Intelligence'}
            </h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              {isAr
                ? 'دراسات عوائد إيجارية واقعية ومؤشرات أسعار موثقة حسب الأحياء لدعم قراراتك الاستثمارية في الرياض وجدة ومكة والمدينة ونيوم.'
                : 'Independent yield calculations, real district price trends, and infrastructure impact forecasts to empower smart decisions across Riyadh, Jeddah, Makkah, Madinah, and NEOM.'}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono block">
              {isAr ? 'الضمان والاعتماد' : 'ASSURANCE'}
            </span>
            <h3 className="font-serif text-2xl text-[#0C3826] font-normal">
              {isAr ? 'ثقة متبادلة' : 'Total Trust'}
            </h3>
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              {isAr
                ? 'أولوية الحجز في المراحل الجديدة وفرص خاصة وخدمات ما بعد الاستلام تقديراً لثقتكم. مرخص بالكامل تحت رخصة فال #1200034988.'
                : 'Advance access to new phase launches, select off-market opportunities, and lifelong post-handover support. Licensed under FAL #1200034988.'}
            </p>
          </div>
        </div>

        {/* Section Header: The Sovereign Giga Projects */}
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#0C3826]">
            {isAr ? 'المشاريع السيادية الكبرى' : 'The Sovereign Giga Projects'}
          </h2>
          <span className="font-mono text-xs text-neutral-400 tracking-wider uppercase">
            VISION 2030
          </span>
        </div>

        {/* Tabs: [Diriyah Gate] [NEOM] [New Murabba & The Mukaab] [Red Sea Global & Amaala] */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-neutral-200 text-xs uppercase tracking-wider font-medium">
          {MEGA_PROJECTS.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 border transition-all cursor-pointer ${
                activeTab === idx
                  ? 'border-neutral-900 bg-white text-neutral-900 font-semibold shadow-xs'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {isAr ? project.nameAr : project.name.split(' - ')[0]}
            </button>
          ))}
        </div>

        {/* Active Project Details Card (Direct Match to Image 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Kicker + Title + Description */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A98950] font-mono block">
              {isAr ? selectedProject.taglineAr : selectedProject.tagline}
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#0C3826] font-normal">
              {isAr ? selectedProject.nameAr : selectedProject.name}
            </h3>

            <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-xl">
              {isAr ? selectedProject.descriptionAr : selectedProject.description}
            </p>
          </div>

          {/* Right: Metrics + Request Prospectus Button */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-neutral-200">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block mb-1">
                  TARGET HORIZON
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                  {selectedProject.completion}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block mb-1">
                  SCALE
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
                  {selectedProject.investmentValue}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                onClick={onOpenPrivateOffice}
                className="px-6 py-3 border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2 cursor-pointer"
              >
                <span>{isAr ? 'طلب كتيب الاستثمار' : 'REQUEST PROSPECTUS'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] text-neutral-400 font-mono">
                Project horizons and scale as supplied. Subject to developer confirmation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

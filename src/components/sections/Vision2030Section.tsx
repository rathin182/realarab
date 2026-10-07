import React, { useState } from 'react';
import { Language } from '../../types';
import { MEGA_PROJECTS, SERVICES } from '../../data/websiteContent';
import { ArrowUpRight, ChartNoAxesCombined, Check, KeyRound, ShieldCheck, UserRound } from 'lucide-react';
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
  const serviceIcons = [KeyRound, UserRound, ChartNoAxesCombined, ShieldCheck];

  return (
    <section id="vision2030" className="py-20 bg-white border-t border-neutral-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-4xl">
          <span className="mb-4 block text-[10px] font-mono uppercase tracking-[0.24em] text-[#A98950]">
            {isAr ? 'تجربة نجم العقارية' : 'THE NAJM ESTATES EXPERIENCE'}
          </span>
          <h2 className="font-serif text-4xl font-normal leading-[1.05] text-[#0C3826] sm:text-6xl">
            {isAr ? 'خدمة استثنائية. رؤية سوقية دقيقة. ثقة متبادلة.' : 'Elevated Service. Real Intelligence. Total Trust.'}
          </h2>
          <p className="mt-5 max-w-3xl text-sm font-light leading-7 text-neutral-600 sm:text-base">
            {isAr
              ? 'سواء كنت تبحث عن منزل مميز، أو تبني محفظة استثمارية، أو تقتني عقاراً بارزاً، نوفر لك وصولاً واضحاً إلى الفرص وبيانات موثوقة ومتابعة من مستشار خاص.'
              : 'Whether you are acquiring a prime off-plan residence, building a high-yielding portfolio, or securing a landmark family home, we provide clear access to opportunities, verified market insight, and support from a dedicated advisor.'}
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-4 border-y border-neutral-200 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => {
            const ServiceIcon = serviceIcons[index] || ShieldCheck;
            const deliverables = isAr ? service.deliverablesAr : service.deliverables;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="flex h-full flex-col border border-[#E7E3DA] bg-[#FBFAF7] p-5 sm:p-6"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.18em] text-[#A98950]">{service.index} / 04</span>
                  <span className="flex h-10 w-10 items-center justify-center border border-[#DCD8CE] bg-white text-[#0C3826]">
                    <ServiceIcon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                </div>
                <span className="mb-2 text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                  {isAr ? service.tagAr : service.tag}
                </span>
                <h3 className="min-h-[3.4rem] font-serif text-2xl leading-tight text-[#0C3826]">
                  {isAr ? service.titleAr : service.title}
                </h3>
                <p className="mt-3 min-h-[5rem] text-xs leading-6 text-neutral-600">
                  {isAr ? service.summaryAr : service.summary}
                </p>
                <div className="mt-5 border-t border-[#E7E3DA] pt-4">
                  <span className="mb-3 block text-[9px] font-mono uppercase tracking-[0.16em] text-neutral-400">
                    {isAr ? 'ما الذي ستحصل عليه' : 'WHAT THIS INCLUDES'}
                  </span>
                  <ul className="space-y-2.5">
                    {deliverables.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[11px] leading-5 text-neutral-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A98950]" strokeWidth={1.8} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Section Header: The Sovereign Giga Projects */}
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#0C3826]">
            {isAr ? 'المشاريع السيادية الكبرى' : 'Vision 2030 Developments'}
          </h2>
          <span className="font-mono text-xs text-neutral-400 tracking-wider uppercase">
            VISION 2030
          </span>
        </div>

        {/* Tabs: [Diriyah Gate] [NEOM] [New Murabba & The Mukaab] [Red Sea Global & Amaala] */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4 text-xs font-medium uppercase tracking-wider">
          {MEGA_PROJECTS.map((project, idx) => (
            <button
              key={project.id}
              onClick={() => setActiveTab(idx)}
              className={`border px-4 py-2.5 transition-all cursor-pointer ${
                activeTab === idx
                  ? 'border-[#0C3826] bg-[#0C3826] text-white font-semibold'
                  : 'border-transparent text-neutral-500 hover:border-neutral-200 hover:text-[#0C3826]'
              }`}
            >
              {isAr ? project.nameAr : project.name.split(' - ')[0]}
            </button>
          ))}
        </div>

        <motion.div
          key={selectedProject.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12"
        >
          <div className="relative min-h-[280px] overflow-hidden bg-[#E8E3D9] sm:min-h-[420px] lg:col-span-7">
            <img
              src={selectedProject.image}
              alt={isAr ? selectedProject.nameAr : selectedProject.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071A13]/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-7">
              <div>
                <span className="mb-2 block text-[9px] font-mono uppercase tracking-[0.22em] text-[#E3C98C]">
                  {isAr ? 'نظرة على المشروع' : 'PROJECT OVERVIEW'}
                </span>
                <h3 className="max-w-xl font-serif text-2xl leading-tight sm:text-4xl">
                  {isAr ? selectedProject.nameAr : selectedProject.name.split(' - ')[0]}
                </h3>
              </div>
              <span className="hidden shrink-0 border border-white/35 bg-black/15 px-3 py-2 text-[9px] font-mono uppercase tracking-[0.16em] backdrop-blur sm:block">
                {selectedProject.badge}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-5" dir={isAr ? 'rtl' : 'ltr'}>
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#A98950]">
              {isAr ? selectedProject.taglineAr : selectedProject.tagline}
            </span>
            <h3 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#0C3826] sm:text-4xl">
              {isAr ? selectedProject.nameAr : selectedProject.name.split(' - ')[0]}
            </h3>
            <p className="mt-4 text-sm font-light leading-7 text-neutral-600">
              {isAr ? selectedProject.descriptionAr : selectedProject.description}
            </p>

            <div className="mt-7 grid grid-cols-2 border-y border-neutral-200 py-5">
              <div className="border-e border-neutral-200 pe-4">
                <span className="mb-1 block text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                  {isAr ? 'الإطار الزمني' : 'TARGET HORIZON'}
                </span>
                <span className="font-serif text-2xl text-[#0C3826]">{selectedProject.completion}</span>
              </div>
              <div className="ps-4">
                <span className="mb-1 block text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                  {isAr ? 'حجم المشروع' : 'PROJECT SCALE'}
                </span>
                <span className="font-serif text-2xl text-[#0C3826]">{selectedProject.investmentValue}</span>
              </div>
            </div>

            <div className="mt-5">
              <span className="mb-3 block text-[9px] font-mono uppercase tracking-[0.18em] text-neutral-400">
                {isAr ? 'أبرز الملامح' : 'AT A GLANCE'}
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProject.highlights.map((highlight) => (
                  <span key={highlight} className="border border-[#E7E3DA] bg-[#FBFAF7] px-3 py-2 text-[10px] leading-relaxed text-neutral-600">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenPrivateOffice}
              className="mt-7 inline-flex min-h-12 w-fit items-center gap-3 bg-[#0C3826] px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#164B35]"
            >
              <span>{isAr ? 'طلب معلومات المشروع' : 'Request project details'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import React from 'react';
import { Language } from '../../types';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  language: Language;
  onOpenBuyerGuide: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ language, onOpenBuyerGuide }) => {
  const isAr = language === 'ar';

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] overflow-hidden bg-[#111713] text-white font-sans">
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/hero_diriyah_panoramic.jpg"
          alt="Contemporary Saudi architecture framed by native landscape"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-black/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/5 to-black/55" />

      <div className="mx-auto flex w-full max-w-[1600px] flex-col px-5 pb-7 pt-7 sm:px-10 sm:pb-9 sm:pt-9 lg:px-16">
        <div className="flex items-center justify-between border-b border-white/45 pb-4 text-[9px] uppercase tracking-[0.24em] text-white/85 sm:text-[10px]">
          <span>{isAr ? 'نجم العقارية' : 'NAJM ESTATES'}</span>
          <span className="hidden sm:block">{isAr ? 'المملكة العربية السعودية' : 'KINGDOM OF SAUDI ARABIA'}</span>
          <button
            type="button"
            onClick={onOpenBuyerGuide}
            className="rounded-full border border-white/70 px-4 py-2 text-[8px] tracking-[0.14em] transition-colors hover:bg-white hover:text-neutral-900 sm:text-[9px]"
          >
            {isAr ? 'دليل التملك' : 'OWNERSHIP GUIDE'}
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 items-end gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="lg:col-span-8"
          >
            <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-white/80 sm:text-[10px]">
              {isAr ? 'عقارات خاصة · المملكة العربية السعودية' : 'PRIVATE REAL ESTATE · SAUDI ARABIA'}
            </p>
            <h1 className="font-serif text-[clamp(5rem,17vw,15rem)] font-normal uppercase leading-[0.72] tracking-[-0.075em] text-[#fffdf7]">
              NAJM
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-5 lg:col-span-4 lg:pb-3"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="max-w-sm border-s border-white/60 ps-5">
              <h2 className="font-serif text-2xl italic leading-tight text-white sm:text-3xl">
                {isAr ? 'حيث تلتقي الأرض بالرؤية.' : 'A rare point of view.'}
              </h2>
              <p className="mt-3 text-xs font-light leading-relaxed text-white/85 sm:text-sm">
                {isAr
                  ? 'رؤية سيادية لأرقى الأراضي والتحف المعمارية في المملكة العربية السعودية.'
                  : 'A sovereign approach to Saudi Arabia’s most prestigious land allocations and architectural masterpieces.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5 ps-5">
              <a
                href="#properties"
                className="inline-flex items-center gap-3 border-b border-white/80 pb-2 text-[9px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white/50 hover:text-white/70"
              >
                {isAr ? 'استكشف المجموعة' : 'Explore the collection'}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/65">RIYADH · KSA</span>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between border-t border-white/40 pt-4 text-[8px] uppercase tracking-[0.2em] text-white/75 sm:text-[9px]">
          <span>{isAr ? 'الأرض · العمارة · الإرث' : 'LAND · ARCHITECTURE · LEGACY'}</span>
          <a href="#properties" className="inline-flex items-center gap-2 transition-colors hover:text-white">
            <span>{isAr ? 'اكتشف العقارات' : 'DISCOVER PROPERTIES'}</span>
            <ArrowDown className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
};

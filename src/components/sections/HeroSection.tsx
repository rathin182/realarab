import React from 'react';
import { Language, TransactionType } from '../../types';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  language: Language;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedTransaction: TransactionType;
  setSelectedTransaction: (t: TransactionType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
  onOpenBuyerGuide: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onOpenBuyerGuide,
}) => {
  const isAr = language === 'ar';

  return (
    <section className="bg-white text-neutral-900 pt-16 sm:pt-20 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Headline Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 sm:mb-16">
          {/* Left: Calligraphic Kicker + Massive Bold Editorial Headline */}
          <div className="lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif italic text-[#A98950] text-xl sm:text-2xl mb-4 font-normal"
            >
              {isAr ? 'نجمك في سماء العقار السعودي' : 'Your Star in Saudi Real Estate'}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[#0C3826] leading-[0.95] uppercase"
            >
              {isAr ? (
                <span className="font-arabic font-normal block leading-tight">
                  اختر دارك.<br />
                  استثمر بحكمة.<br />
                  ابنِ ثروتك.
                </span>
              ) : (
                <>
                  FIND HOME.<br />
                  INVEST SMART.<br />
                  BUILD WEALTH.
                </>
              )}
            </motion.h1>
          </div>

          {/* Right: Narrative Statement & Action Link */}
          <div className="lg:col-span-4 lg:pl-6 border-l border-neutral-200 lg:py-2 space-y-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-mono block">
              {isAr ? 'نجم العقارية / استثمارات سيادية' : 'NAJM ESTATES KSA / PRIVATE REAL ESTATE'}
            </span>

            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              {isAr
                ? 'رؤية استثمارية رفيعة المستوى تتيح الوصول لأندر الأراضي والقصور الملكية والتحف المعمارية في المملكة.'
                : 'A sovereign approach to Saudi Arabia’s most prestigious land allocations and architectural masterpieces.'}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <a
                href="#properties"
                className="text-xs uppercase tracking-[0.18em] text-[#0C3826] hover:text-[#A98950] font-semibold transition-colors flex items-center gap-1.5 group"
              >
                <span>{isAr ? 'استكشف المجموعة' : 'Discover the collection'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <button
                onClick={onOpenBuyerGuide}
                className="text-xs uppercase tracking-[0.16em] text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                {isAr ? 'دليل التملك ←' : 'Ownership Rights →'}
              </button>
            </div>
          </div>
        </div>

        {/* Panoramic Architectural Canvas (Direct Reference from Image 5 & 14) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-full"
        >
          {/* Caption Ribbon */}
          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 tracking-wider mb-2.5 px-0.5">
            <span>THE DIRIYAH PERSPECTIVE / ARCHITECTURAL CONCEPT</span>
            <span>RIYADH · KINGDOM OF SAUDI ARABIA</span>
          </div>

          {/* Wide Panoramic Image */}
          <div className="relative aspect-[16/9] sm:aspect-[2.3/1] w-full overflow-hidden bg-neutral-100">
            <img
              src="/src/assets/images/hero_diriyah_panoramic_1791318077026.jpg"
              alt="Diriyah Architectural Perspective"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter contrast-[1.03]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

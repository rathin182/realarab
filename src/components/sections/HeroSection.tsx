import React from 'react';
import { Language, TransactionFilter } from '../../types';
import { ArrowUpRight, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  language: Language;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedTransaction: TransactionFilter;
  setSelectedTransaction: (t: TransactionFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
  onOpenBuyerGuide: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  selectedCity,
  setSelectedCity,
  selectedTransaction,
  setSelectedTransaction,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onOpenBuyerGuide,
}) => {
  const isAr = language === 'ar';
  const cities = [
    { id: 'all', en: 'All Saudi Arabia', ar: 'كل المملكة' },
    { id: 'Riyadh', en: 'Riyadh', ar: 'الرياض' },
    { id: 'Jeddah', en: 'Jeddah', ar: 'جدة' },
    { id: 'Makkah', en: 'Makkah', ar: 'مكة' },
    { id: 'Madinah', en: 'Madinah', ar: 'المدينة' },
    { id: 'NEOM', en: 'NEOM', ar: 'نيوم' },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#f7f5ef] text-neutral-900 font-sans">
      <div className="absolute inset-0 -z-20">
        <img
          src="/images/hero_diriyah_panoramic.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fbfaf7]/95 via-[#fbfaf7]/85 to-[#fbfaf7]/45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fbfaf7]/20 via-transparent to-[#0C3826]/10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-16 sm:pb-20">
        {/* Editorial Top Headline Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10 sm:mb-12">
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
          <div className="lg:col-span-4 lg:pl-6 border-l border-[#0C3826]/20 lg:py-2 space-y-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-mono block">
              {isAr ? 'نجم العقارية / استثمارات سيادية' : 'NAJM ESTATES KSA / PRIVATE REAL ESTATE'}
            </span>

            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              {isAr
                ? 'رؤية استثمارية رفيعة المستوى تتيح الوصول لأندر الأراضي والقصور الملكية والتحف المعمارية في المملكة.'
                : 'A sovereign approach to Saudi Arabia’s most prestigious land allocations and architectural masterpieces.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="#properties"
                className="inline-flex min-h-11 items-center gap-3 bg-[#0C3826] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#164B35] group"
              >
                <span>{isAr ? 'استكشف المجموعة' : 'Explore the collection'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <button
                onClick={onOpenBuyerGuide}
                className="cursor-pointer border-b border-[#A98950]/60 pb-1 text-[10px] uppercase tracking-[0.13em] text-neutral-600 transition-colors hover:border-[#0C3826] hover:text-[#0C3826]"
              >
                {isAr ? 'دليل التملك' : 'Ownership guide'}
              </button>
            </div>
          </div>
        </div>

        {/* Refined property search */}
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
          dir={isAr ? 'rtl' : 'ltr'}
          className="mb-2 sm:mb-4 border border-white/80 bg-[#FBFAF7]/90 shadow-[0_18px_60px_rgba(12,56,38,0.12)] backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#E7E3DA] px-5 sm:px-8 py-4">
            <div className="flex items-center gap-2 text-[#0C3826]">
              <MapPin className="h-4 w-4 text-[#A98950]" strokeWidth={1.5} />
              <span className="text-[10px] font-medium uppercase tracking-[0.22em]">
                {isAr ? 'استكشف العقارات' : 'Explore properties'}
              </span>
            </div>
            <span className="hidden sm:block font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
              {isAr ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}
            </span>
          </div>

          <div className="flex gap-6 overflow-x-auto border-b border-[#E7E3DA] px-5 sm:px-8 [scrollbar-width:none]">
            {cities.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCity(city.id)}
                className={`relative shrink-0 py-4 text-[10px] uppercase tracking-[0.15em] transition-colors ${
                  selectedCity === city.id
                    ? 'text-[#0C3826] font-semibold'
                    : 'text-neutral-400 hover:text-[#0C3826]'
                }`}
              >
                {isAr ? city.ar : city.en}
                {selectedCity === city.id && <span className="absolute inset-x-0 bottom-0 h-px bg-[#A98950]" />}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 p-4 sm:p-5 sm:px-8">
            <div className="flex min-h-14 flex-col sm:flex-row border border-[#E3DFD5] bg-white focus-within:border-[#A98950] transition-colors">
              <label className="relative flex shrink-0 items-center sm:border-r border-[#E3DFD5]">
                <SlidersHorizontal className="pointer-events-none absolute start-3 h-3.5 w-3.5 text-[#A98950]" strokeWidth={1.5} />
                <select
                  aria-label={isAr ? 'نوع المعاملة' : 'Transaction type'}
                  value={selectedTransaction}
                  onChange={(event) => setSelectedTransaction(event.target.value as TransactionFilter)}
                  className="h-full min-h-12 w-full appearance-none bg-transparent ps-9 pe-8 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#0C3826] outline-none sm:w-40"
                >
                  <option value="all">{isAr ? 'جميع الفرص' : 'All opportunities'}</option>
                  <option value="buy">{isAr ? 'شراء' : 'Buy'}</option>
                  <option value="rent">{isAr ? 'إيجار' : 'Rent'}</option>
                  <option value="off-plan">{isAr ? 'على الخارطة' : 'Off-plan'}</option>
                  <option value="commercial">{isAr ? 'تجاري' : 'Commercial'}</option>
                </select>
              </label>
              <input
                type="search"
                aria-label={isAr ? 'ابحث حسب المنطقة أو العقار' : 'Search by district or property'}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={isAr ? 'ابحث عن مدينة، حي، أو عقار...' : 'Search a city, district, or property...'}
                className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-[#20392F] outline-none placeholder:text-neutral-400"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#0C3826] px-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#164B35]"
            >
              <Search className="h-4 w-4" strokeWidth={1.6} />
              {isAr ? 'ابحث عن عقار' : 'Search properties'}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </motion.form>

        <div className="mt-7 flex items-center justify-between gap-4 text-[9px] font-mono uppercase tracking-[0.16em] text-[#0C3826]/65">
          <span>The Diriyah perspective / architectural concept</span>
          <span className="text-right">Riyadh · Kingdom of Saudi Arabia</span>
        </div>
      </div>
    </section>
  );
};

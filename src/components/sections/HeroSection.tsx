import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language } from '../../types';
import { PROPERTIES } from '../../data/websiteContent';
import { ArrowDown, BedDouble, Check, ChevronDown, MapPin, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  language: Language;
  onOpenBuyerGuide: () => void;
  onSearch: (filters: { city: string; propertyType: string; minPrice: string; maxPrice: string }) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ language, onSearch }) => {
  const isAr = language === 'ar';
  const cities = useMemo(() => [...new Set(PROPERTIES.map((property) => property.city))].sort(), []);
  const propertyTypes = useMemo(() => [...new Set(PROPERTIES.map((property) => property.type))].sort(), []);
  const priceOptions = useMemo(() => Array.from({ length: 102 }, (_, index) => String(index * 10_000)), []);
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rangeDraft, setRangeDraft] = useState({ min: '', max: '' });
  const [openPriceBound, setOpenPriceBound] = useState<'min' | 'max' | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'location' | 'property' | 'price' | null>(null);
  const dropdownRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setOpenDropdown(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch({ city, propertyType, minPrice, maxPrice });
  };

  return (
    <section className="relative isolate flex min-h-svh overflow-hidden bg-[#111713] text-white font-sans">
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
        {/* <div className="flex items-center justify-between border-b border-white/45 pb-4 text-[9px] uppercase tracking-[0.24em] text-white/85 sm:text-[10px]">
          <span>{isAr ? 'نجم العقارية' : 'NAJM ESTATES'}</span>
          <span className="hidden sm:block">{isAr ? 'المملكة العربية السعودية' : 'KINGDOM OF SAUDI ARABIA'}</span>
          <button
            type="button"
            onClick={onOpenBuyerGuide}
            className="rounded-full border border-white/70 px-4 py-2 text-[8px] tracking-[0.14em] transition-colors hover:bg-white hover:text-neutral-900 sm:text-[9px]"
          >
            {isAr ? 'دليل التملك' : 'OWNERSHIP GUIDE'}
          </button>
        </div> */}

        <div className="flex flex-1 flex-col justify-center gap-8 py-12 sm:py-16 lg:-translate-y-40 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="w-full max-w-9xl text-center"
          >
            {/* <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-white/80 sm:text-[10px]">
              {isAr ? 'عقارات خاصة · المملكة العربية السعودية' : 'PRIVATE REAL ESTATE · SAUDI ARABIA'}
            </p> */}
            <h1 className="mx-auto max-w-9xl font-serif text-[clamp(3.25rem,8.4vw,8rem)] font-normal leading-[0.91] tracking-[-0.05em] text-[#fffdf7] drop-shadow-[0_3px_24px_rgba(0,0,0,0.22)]">
              Find Home. Invest Smart. Build Wealth.
            </h1>
            {/* <p className="mx-auto mt-5 max-w-xl text-center font-sans text-xs font-light leading-6 tracking-[0.025em] text-white/85 sm:mt-6 sm:text-sm">
              Exceptional homes and considered investments across Saudi Arabia.
            </p> */}
          </motion.div>

          <form ref={dropdownRef} onSubmit={submitSearch} className="mt-12 grid w-full grid-cols-1 gap-2 rounded-3xl border border-white/55 bg-white/20 p-3 text-[#20231F] shadow-[0_18px_55px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md sm:grid-cols-2 lg:mt-20 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-center lg:gap-2 lg:rounded-full lg:p-2">
            <div className="relative">
            <button type="button" aria-haspopup="listbox" aria-expanded={openDropdown === 'location'} onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')} className="flex min-h-14 w-full items-center gap-3 rounded-full px-4 text-left transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3826]/30">
              <MapPin className="h-4 w-4 shrink-0 text-[#0C3826]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-medium text-[#26352D]">{isAr ? 'الموقع' : 'Location'}</span>
                <span className="block truncate text-sm font-medium text-[#20231F]">{city || (isAr ? 'جميع المدن' : 'All locations')}</span>
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-[#34443A] transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'location' && <div role="listbox" aria-label={isAr ? 'الموقع' : 'Location'} className="absolute inset-x-1 top-[calc(100%+0.65rem)] z-50 max-h-64 overflow-y-auto rounded-2xl border border-white/70 bg-[#F7F6F1]/95 p-1.5 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              {[{ id: '', label: isAr ? 'جميع المدن' : 'All locations' }, ...cities.map((item) => ({ id: item, label: item }))].map((option, index) => <button key={option.id || 'all'} type="button" role="option" aria-selected={city === option.id} onClick={() => { setCity(option.id); setOpenDropdown(null); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${city === option.id ? 'bg-[#0C3826]/10 text-[#0C3826]' : 'text-[#29352E] hover:bg-white/80'}`}><span className="w-6 font-mono text-[9px] text-[#A98950]">{String(index + 1).padStart(2, '0')}</span><span className="flex-1">{option.label}</span>{city === option.id && <Check className="h-4 w-4" />}</button>)}
            </div>}
            </div>

            <div className="relative">
            <button type="button" aria-haspopup="listbox" aria-expanded={openDropdown === 'property'} onClick={() => setOpenDropdown(openDropdown === 'property' ? null : 'property')} className="flex min-h-14 w-full items-center gap-3 rounded-full px-4 text-left transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3826]/30">
              <BedDouble className="h-4 w-4 shrink-0 text-[#0C3826]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-medium text-[#26352D]">{isAr ? 'نوع العقار' : 'Property Type'}</span>
                <span className="block truncate text-sm font-medium text-[#20231F]">{propertyType || (isAr ? 'جميع الأنواع' : 'All types')}</span>
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-[#34443A] transition-transform ${openDropdown === 'property' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'property' && <div role="listbox" aria-label={isAr ? 'نوع العقار' : 'Property Type'} className="absolute inset-x-1 top-[calc(100%+0.65rem)] z-50 max-h-64 overflow-y-auto rounded-2xl border border-white/70 bg-[#F7F6F1]/95 p-1.5 shadow-[0_20px_50px_-18px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              {[{ id: '', label: isAr ? 'جميع الأنواع' : 'All types' }, ...propertyTypes.map((item) => ({ id: item, label: item }))].map((option, index) => <button key={option.id || 'all'} type="button" role="option" aria-selected={propertyType === option.id} onClick={() => { setPropertyType(option.id); setOpenDropdown(null); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${propertyType === option.id ? 'bg-[#0C3826]/10 text-[#0C3826]' : 'text-[#29352E] hover:bg-white/80'}`}><span className="w-6 font-mono text-[9px] text-[#A98950]">{String(index + 1).padStart(2, '0')}</span><span className="flex-1">{option.label}</span>{propertyType === option.id && <Check className="h-4 w-4" />}</button>)}
            </div>}
            </div>

            <div className="relative min-w-0">
              <button type="button" aria-haspopup="dialog" aria-expanded={openDropdown === 'price'} onClick={() => { setRangeDraft({ min: minPrice, max: maxPrice }); setOpenPriceBound(null); setOpenDropdown(openDropdown === 'price' ? null : 'price'); }} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-full px-4 text-left transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0C3826]/30">
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-medium text-[#26352D]">{isAr ? 'نطاق السعر' : 'Price Range'}</span>
                  <span className="block truncate text-sm font-medium text-[#20231F]">{minPrice || maxPrice ? `${minPrice ? Number(minPrice).toLocaleString() : (isAr ? 'أي حد أدنى' : 'Any')} – ${maxPrice ? Number(maxPrice).toLocaleString() : (isAr ? 'أي حد أقصى' : 'Any')}` : (isAr ? 'أي سعر' : 'Any price')}</span>
                </span>
                <ChevronDown className={`h-4 w-4 text-[#34443A] transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'price' && <div role="dialog" aria-label={isAr ? 'نطاق السعر' : 'Price range'} className="absolute right-0 top-[calc(100%+0.7rem)] z-50 w-[min(22rem,calc(100vw-3rem))] rounded-xl border border-neutral-200 bg-white p-4 text-neutral-800 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]">
                  <div className="grid grid-cols-2 gap-3">
                    {(['min', 'max'] as const).map((bound) => {
                      const value = rangeDraft[bound];
                      const label = bound === 'min' ? (isAr ? 'الحد الأدنى' : 'Minimum') : (isAr ? 'الحد الأقصى' : 'Maximum');
                      return <div key={bound} className="relative min-w-0">
                        <span className="text-xs text-neutral-500">{label}</span>
                        <div className="mt-1.5 flex h-10 w-full items-center rounded-md border border-neutral-200 bg-white transition focus-within:border-[#0C6B63]">
                          <input aria-label={`${label} ${isAr ? 'مبلغ مخصص' : 'Custom amount'}`} type="number" min="0" max="1010000" step="1000" inputMode="numeric" placeholder={isAr ? 'أي' : 'Any'} value={value} onChange={(event) => setRangeDraft((current) => ({ ...current, [bound]: event.target.value }))} className="h-full min-w-0 flex-1 rounded-l-md bg-transparent px-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-500" />
                          <button type="button" aria-label={isAr ? `اختيار ${label}` : `Choose ${label}`} aria-haspopup="listbox" aria-expanded={openPriceBound === bound} onClick={() => setOpenPriceBound(openPriceBound === bound ? null : bound)} className="flex h-full items-center px-2 text-neutral-500 hover:text-[#0C6B63] focus-visible:outline-none"><ChevronDown className="h-4 w-4" /></button>
                        </div>
                        {openPriceBound === bound && <div data-lenis-prevent onWheel={(event) => event.stopPropagation()} role="listbox" aria-label={label} className="filter-dropdown-scroll absolute inset-x-0 top-[calc(100%+0.35rem)] z-[60] max-h-52 overflow-y-auto overscroll-contain touch-pan-y rounded-lg border border-neutral-200 bg-white p-1 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.35)]">
                          {[{ value: '', label: isAr ? 'أي' : 'Any' }, ...priceOptions.map((price) => ({ value: price, label: Number(price).toLocaleString() }))].map((option) => <button key={option.value || 'any'} type="button" role="option" aria-selected={value === option.value} onClick={() => { setRangeDraft((current) => ({ ...current, [bound]: option.value })); setOpenPriceBound(null); }} className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${value === option.value ? 'bg-emerald-50 font-medium text-emerald-600' : 'text-neutral-700 hover:bg-neutral-50'}`}>{option.label}</button>)}
                        </div>}
                      </div>;
                    })}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => { setRangeDraft({ min: '', max: '' }); setMinPrice(''); setMaxPrice(''); setOpenPriceBound(null); }} className="h-9 flex-1 rounded-md border border-[#0C6B63] text-xs font-medium text-[#0C6B63] transition-colors hover:bg-[#0C6B63]/5">{isAr ? 'إعادة ضبط' : 'Reset'}</button>
                    <button type="button" onClick={() => { setMinPrice(rangeDraft.min); setMaxPrice(rangeDraft.max); setOpenDropdown(null); setOpenPriceBound(null); }} className="h-9 flex-1 rounded-md bg-[#006B68] text-xs font-medium text-white transition-colors hover:bg-[#005653]">{isAr ? 'تم' : 'Done'}</button>
                  </div>
              </div>}
            </div>

            <button type="submit" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-medium text-white transition-colors hover:bg-[#0C3826]">
              <Search className="h-4 w-4" />
              <span>{isAr ? 'بحث' : 'Search'}</span>
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between border-t border-white/40 pt-4 text-[8px] uppercase tracking-[0.2em] text-[#687069] sm:text-[9px]">
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

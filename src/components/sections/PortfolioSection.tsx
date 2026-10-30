import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Currency, Language, PortfolioTier, Property, TransactionFilter } from '../../types';
import { ChevronDown, ArrowUpRight, Check } from 'lucide-react';
import { PropertyCard } from '../property/PropertyCard';

interface PortfolioSectionProps {
  currency: Currency;
  language: Language;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  selectedTransaction: TransactionFilter;
  setSelectedTransaction: (t: TransactionFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedPropertyType: string;
  priceRange: { min: string; max: string };
  onSelectProperty: (property: Property) => void;
  onInquireProperty: (property: Property) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  currency,
  language,
  selectedCity,
  setSelectedCity,
  selectedTransaction,
  setSelectedTransaction,
  searchQuery,
  setSearchQuery,
  selectedPropertyType: heroPropertyType,
  priceRange,
  onSelectProperty,
  onInquireProperty,
}) => {
  const isAr = language === 'ar';
  const [activeTier, setActiveTier] = useState<PortfolioTier | 'all'>('all');
  const [selectedType, setSelectedType] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState<'market' | 'acquisition' | 'propertyType' | 'collection' | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const tiers = [
    { id: 'all', en: 'All Properties', ar: 'كافة العقارات', count: 'ALL' },
    { id: 'featured', en: 'Featured Projects', ar: 'المشاريع الكبرى المميزة', count: '01 / 04' },
    { id: 'curated', en: 'Curated Collection', ar: 'المحفظة السكنية المختارة', count: '02 / 04' },
    { id: 'vault', en: 'Investment Vault', ar: 'صندوق الاستثمار الحصري', count: '03 / 04' },
    { id: 'syndicate', en: 'Project Syndicate', ar: 'نقابة التطوير المشترك', count: '04 / 04' },
  ];

  const currentTierObj = tiers.find((t) => t.id === activeTier) || tiers[0];
  const propertyTypes = [...new Set(properties.map((property) => property.type))].sort();

  useEffect(() => {
    fetch('/api/listings')
      .then((response) => response.ok ? response.json() as Promise<Property[]> : [])
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const cities = [
    { id: 'all', en: 'All cities', ar: 'كافة المدن' },
    { id: 'Riyadh', en: 'Riyadh', ar: 'الرياض' },
    { id: 'Makkah', en: 'Makkah', ar: 'مكة المكرمة' },
    { id: 'Madinah', en: 'Madinah', ar: 'المدينة المنورة' },
    { id: 'Jeddah', en: 'Jeddah', ar: 'جدة' },
    { id: 'NEOM', en: 'NEOM', ar: 'نيوم' },
  ];

  const transactionTypes = [
    { id: 'all', en: 'All opportunities', ar: 'كافة الفرص' },
    { id: 'buy', en: 'Buy / Freehold', ar: 'شراء وتملك حر' },
    { id: 'rent', en: 'Rent', ar: 'إيجار' },
    { id: 'off-plan', en: 'Off-Plan (Wafi)', ar: 'تحت الإنشاء (وافي)' },
    { id: 'commercial', en: 'Commercial HQ', ar: 'مقرات تجارية' },
  ];

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (activeTier !== 'all' && p.tier !== activeTier) return false;
      if (selectedCity !== 'all' && p.city !== selectedCity) return false;
      if ((selectedTransaction as string) !== 'all' && p.transaction !== selectedTransaction) return false;
      if ((heroPropertyType !== 'all' && p.type !== heroPropertyType) || (selectedType !== 'all' && p.type !== selectedType)) return false;
      const minimumPrice = Number(priceRange.min.replace(/[^\d]/g, ''));
      const maximumPrice = Number(priceRange.max.replace(/[^\d]/g, ''));
      if (priceRange.min && p.priceSAR < minimumPrice) return false;
      if (priceRange.max && p.priceSAR > maximumPrice) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query) || p.titleAr.includes(query);
        const matchLoc = p.location.toLowerCase().includes(query) || p.locationAr.includes(query);
        const matchCity = p.city.toLowerCase().includes(query);
        const matchType = p.type.toLowerCase().includes(query);
        const matchFeatures = p.keyFeatures.some((feature) => feature.toLowerCase().includes(query));
        if (!matchTitle && !matchLoc && !matchCity && !matchType && !matchFeatures) return false;
      }
      return true;
    });
  }, [properties, activeTier, selectedCity, selectedTransaction, selectedType, heroPropertyType, priceRange, searchQuery]);

  const visibleProperties = filteredProperties.slice(0, 6);

  return (
    <section id="properties" className="py-20 bg-white border-t border-neutral-200 font-sans">
      <div className="max-w-[110rem] mx-auto px-4 sm:px-8 lg:px-10">
        {/* Selected collection and count */}
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-4xl sm:text-5xl font-light italic text-[#0C3826]">
            {isAr ? currentTierObj.ar : currentTierObj.en}
          </h2>
          <span className="font-mono text-xs text-neutral-400 tracking-wider">
            {currentTierObj.count}
          </span>
        </div>

        {/* Clean Swiss Search & Filter Strip (Direct Reference from Image 6) */}
        <div ref={filterRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pb-8 mb-8 border-b border-neutral-200 text-xs">
          {/* Market / City Filter */}
            <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'المدينة' : 'MARKET'}
            </label>
            <div className="relative">
              <button type="button" aria-haspopup="listbox" aria-expanded={openFilter === 'market'} onClick={() => setOpenFilter(openFilter === 'market' ? null : 'market')} className={`flex h-11 w-full items-center justify-between border bg-white px-3 text-left text-xs text-neutral-800 transition-colors ${openFilter === 'market' ? 'border-[#0C3826]/50 ring-2 ring-[#0C3826]/[0.06]' : 'border-neutral-200 hover:border-neutral-300'} focus:outline-none`}>
                <span>{isAr ? cities.find((city) => city.id === selectedCity)?.ar : cities.find((city) => city.id === selectedCity)?.en}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${openFilter === 'market' ? 'rotate-180' : ''}`} />
              </button>
              {openFilter === 'market' && <div data-lenis-prevent onWheel={(event) => event.stopPropagation()} className="filter-dropdown-scroll absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto overscroll-contain touch-pan-y rounded-xl border border-[#E7E3DA] bg-white p-1.5 shadow-[0_18px_45px_-20px_rgba(12,56,38,0.3)] ring-1 ring-black/[0.03]" role="listbox" aria-label={isAr ? 'المدينة' : 'Market'}>
                {cities.map((city, index) => { const selected = city.id === selectedCity; return <button key={city.id} type="button" role="option" aria-selected={selected} onClick={() => { setSelectedCity(city.id); setOpenFilter(null); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${selected ? 'bg-[#F5F4EF] text-[#0C3826]' : 'text-neutral-600 hover:bg-[#FAF9F6] hover:text-[#0C3826]'}`}><span className="w-8 shrink-0 font-mono text-[9px] tracking-[0.12em] text-[#A98950]">0{index + 1}</span><span className="flex-1 text-xs">{isAr ? city.ar : city.en}</span>{selected && <Check className="h-3.5 w-3.5 text-[#0C3826]" />}</button>; })}
              </div>}
            </div>
          </div>

          {/* Acquisition / Transaction Filter */}
            <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'نوع الفرصة' : 'ACQUISITION'}
            </label>
            <div className="relative">
              <button type="button" aria-haspopup="listbox" aria-expanded={openFilter === 'acquisition'} onClick={() => setOpenFilter(openFilter === 'acquisition' ? null : 'acquisition')} className={`flex h-11 w-full items-center justify-between border bg-white px-3 text-left text-xs text-neutral-800 transition-colors ${openFilter === 'acquisition' ? 'border-[#0C3826]/50 ring-2 ring-[#0C3826]/[0.06]' : 'border-neutral-200 hover:border-neutral-300'} focus:outline-none`}>
                <span>{isAr ? transactionTypes.find((type) => type.id === selectedTransaction)?.ar : transactionTypes.find((type) => type.id === selectedTransaction)?.en}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${openFilter === 'acquisition' ? 'rotate-180' : ''}`} />
              </button>
              {openFilter === 'acquisition' && <div data-lenis-prevent onWheel={(event) => event.stopPropagation()} className="filter-dropdown-scroll absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto overscroll-contain touch-pan-y rounded-xl border border-[#E7E3DA] bg-white p-1.5 shadow-[0_18px_45px_-20px_rgba(12,56,38,0.3)] ring-1 ring-black/[0.03]" role="listbox" aria-label={isAr ? 'نوع الفرصة' : 'Acquisition'}>
                {transactionTypes.map((type, index) => { const selected = type.id === selectedTransaction; return <button key={type.id} type="button" role="option" aria-selected={selected} onClick={() => { setSelectedTransaction(type.id as TransactionFilter); setOpenFilter(null); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${selected ? 'bg-[#F5F4EF] text-[#0C3826]' : 'text-neutral-600 hover:bg-[#FAF9F6] hover:text-[#0C3826]'}`}><span className="w-8 shrink-0 font-mono text-[9px] tracking-[0.12em] text-[#A98950]">0{index + 1}</span><span className="flex-1 text-xs">{isAr ? type.ar : type.en}</span>{selected && <Check className="h-3.5 w-3.5 text-[#0C3826]" />}</button>; })}
              </div>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'نوع العقار' : 'PROPERTY TYPE'}
            </label>
            <div className="relative">
              <button type="button" aria-haspopup="listbox" aria-expanded={openFilter === 'propertyType'} onClick={() => setOpenFilter(openFilter === 'propertyType' ? null : 'propertyType')} className={`flex h-11 w-full items-center justify-between border bg-white px-3 text-left text-xs text-neutral-800 transition-colors ${openFilter === 'propertyType' ? 'border-[#0C3826]/50 ring-2 ring-[#0C3826]/[0.06]' : 'border-neutral-200 hover:border-neutral-300'} focus:outline-none`}>
                <span>{selectedType === 'all' ? (isAr ? 'جميع الأنواع' : 'All property types') : selectedType}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${openFilter === 'propertyType' ? 'rotate-180' : ''}`} />
              </button>
              {openFilter === 'propertyType' && <div data-lenis-prevent onWheel={(event) => event.stopPropagation()} className="filter-dropdown-scroll absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto overscroll-contain touch-pan-y rounded-xl border border-[#E7E3DA] bg-white p-1.5 shadow-[0_18px_45px_-20px_rgba(12,56,38,0.3)] ring-1 ring-black/[0.03]" role="listbox" aria-label={isAr ? 'نوع العقار' : 'Property type'}>
                {[{ id: 'all', label: isAr ? 'جميع الأنواع' : 'All property types' }, ...propertyTypes.map((type) => ({ id: type, label: type }))].map((type, index) => { const selected = type.id === selectedType; return <button key={type.id} type="button" role="option" aria-selected={selected} onClick={() => { setSelectedType(type.id); setOpenFilter(null); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${selected ? 'bg-[#F5F4EF] text-[#0C3826]' : 'text-neutral-600 hover:bg-[#FAF9F6] hover:text-[#0C3826]'}`}><span className="w-8 shrink-0 font-mono text-[9px] tracking-[0.12em] text-[#A98950]">{String(index + 1).padStart(2, '0')}</span><span className="flex-1 text-xs">{type.label}</span>{selected && <Check className="h-3.5 w-3.5 text-[#0C3826]" />}</button>; })}
              </div>}
            </div>
          </div>

          {/* Collection / Tier Filter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'المجموعة' : 'COLLECTION'}
            </label>
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={openFilter === 'collection'}
                onClick={() => setOpenFilter(openFilter === 'collection' ? null : 'collection')}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setOpenFilter('collection');
                  }
                }}
                className={`flex h-11 w-full items-center justify-between border bg-white px-3 text-left text-xs text-neutral-800 transition-colors ${openFilter === 'collection' ? 'border-[#0C3826]/50 ring-2 ring-[#0C3826]/[0.06]' : 'border-neutral-200 hover:border-neutral-300'} focus:outline-none`}
              >
                <span>{isAr ? currentTierObj.ar : currentTierObj.en}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform ${openFilter === 'collection' ? 'rotate-180' : ''}`} />
              </button>
              {openFilter === 'collection' && (
                <div data-lenis-prevent onWheel={(event) => event.stopPropagation()} className="filter-dropdown-scroll absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto overscroll-contain touch-pan-y rounded-xl border border-[#E7E3DA] bg-white p-1.5 shadow-[0_18px_45px_-20px_rgba(12,56,38,0.3)] ring-1 ring-black/[0.03]" role="listbox" aria-label={isAr ? 'المجموعة' : 'Collection'}>
                  {tiers.map((tier, index) => {
                    const selected = tier.id === activeTier;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setActiveTier(tier.id as PortfolioTier | 'all');
                          setOpenFilter(null);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${selected ? 'bg-[#F5F4EF] text-[#0C3826]' : 'text-neutral-600 hover:bg-[#FAF9F6] hover:text-[#0C3826]'}`}
                      >
                        <span className="w-8 shrink-0 font-mono text-[9px] tracking-[0.12em] text-[#A98950]">0{index + 1}</span>
                        <span className={`flex-1 text-xs ${selected ? 'font-medium' : 'font-normal'}`}>{isAr ? tier.ar : tier.en}</span>
                        {selected && <Check className="h-3.5 w-3.5 text-[#0C3826]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Search Input Field */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'البحث في الأصول' : 'PROPERTY SEARCH'}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن حي، معلم، أو أصل...' : 'District, sanctuary, or property...'}
              className="w-full h-11 bg-white border border-neutral-200 px-3 text-neutral-800 text-xs placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
            />
          </div>

        </div>

        <div className="mb-5 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400">
          <span>{isAr ? 'العقارات المتاحة' : 'Available properties'}</span>
          <span>{filteredProperties.length.toString().padStart(2, '0')} / {properties.length.toString().padStart(2, '0')}</span>
        </div>

        {/* Property Grid */}
        {isLoading ? <p className="py-12 text-center text-sm text-neutral-500">Loading properties...</p> : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10">
          {visibleProperties.map((property) => <PropertyCard key={property.id} property={property} currency={currency} language={language} animated />)}
        </div>}
        {filteredProperties.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link
              href="/properties"
              className="group inline-flex min-h-12 items-center gap-5 border border-[#0C3826]/20 bg-white px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C3826] transition-colors hover:border-[#0C3826] hover:bg-[#0C3826] hover:text-white rounded-full"
            >
              <span>{isAr ? 'عرض جميع العقارات' : 'View all properties'}</span>
              <span className="font-mono text-[9px] opacity-60">{filteredProperties.length.toString().padStart(2, '0')}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        )}
        {!isLoading && filteredProperties.length === 0 && (
          <div className="border-y border-neutral-200 py-16 text-center">
            <p className="font-serif text-2xl text-[#0C3826]">{isAr ? 'لا توجد عقارات مطابقة' : 'No properties match these filters'}</p>
            <button onClick={() => { setSelectedCity('all'); setSelectedTransaction('all'); setSelectedType('all'); setSearchQuery(''); }} className="mt-4 text-xs uppercase tracking-widest text-[#A98950] hover:text-[#0C3826]">
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset filters'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

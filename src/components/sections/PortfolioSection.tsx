import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Currency, Language, PortfolioTier, Property, TransactionFilter } from '../../types';
import { PROPERTIES } from '../../data/websiteContent';
import { formatPrice } from '../../lib/currency';
import { ChevronDown, ArrowUpRight, Maximize, Percent } from 'lucide-react';
import { motion } from 'motion/react';

interface PortfolioSectionProps {
  currency: Currency;
  language: Language;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  selectedTransaction: TransactionFilter;
  setSelectedTransaction: (t: TransactionFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
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
  onSelectProperty,
  onInquireProperty,
}) => {
  const isAr = language === 'ar';
  const [activeTier, setActiveTier] = useState<PortfolioTier | 'all'>('featured');
  const [selectedType, setSelectedType] = useState('all');

  const tiers = [
    { id: 'featured', en: 'Featured Projects', ar: 'المشاريع الكبرى المميزة', count: '01 / 04' },
    { id: 'curated', en: 'Curated Collection', ar: 'المحفظة السكنية المختارة', count: '02 / 04' },
    { id: 'vault', en: 'Investment Vault', ar: 'صندوق الاستثمار الحصري', count: '03 / 04' },
    { id: 'syndicate', en: 'Project Syndicate', ar: 'نقابة التطوير المشترك', count: '04 / 04' },
  ];

  const currentTierObj = tiers.find((t) => t.id === activeTier) || tiers[0];
  const propertyTypes = [...new Set(PROPERTIES.map((property) => property.type))].sort();

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
    return PROPERTIES.filter((p) => {
      if (activeTier !== 'all' && p.tier !== activeTier) return false;
      if (selectedCity !== 'all' && p.city !== selectedCity) return false;
      if ((selectedTransaction as string) !== 'all' && p.transaction !== selectedTransaction) return false;
      if (selectedType !== 'all' && p.type !== selectedType) return false;
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
  }, [activeTier, selectedCity, selectedTransaction, selectedType, searchQuery]);

  return (
    <section id="properties" className="py-20 bg-white border-t border-neutral-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tier Tabs Strip */}
        <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-neutral-200 text-xs uppercase tracking-[0.2em] font-medium text-neutral-500">
          {tiers.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTier(t.id as PortfolioTier)}
              className={`pb-2 transition-colors cursor-pointer relative ${
                activeTier === t.id
                  ? 'text-[#0C3826] font-semibold after:w-full after:h-[1.5px] after:bg-[#0C3826] after:absolute after:bottom-0 after:left-0'
                  : 'hover:text-neutral-900'
              }`}
            >
              {isAr ? t.ar : t.en}
            </button>
          ))}
        </div>

        {/* Section Header (Exact Match to Image 6) */}
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-4xl sm:text-5xl font-light italic text-[#0C3826]">
            {isAr ? currentTierObj.ar : currentTierObj.en}
          </h2>
          <span className="font-mono text-xs text-neutral-400 tracking-wider">
            {currentTierObj.count}
          </span>
        </div>

        {/* Clean Swiss Search & Filter Strip (Direct Reference from Image 6) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8 mb-8 border-b border-neutral-200 text-xs">
          {/* Market / City Filter */}
            <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'المدينة' : 'MARKET'}
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-11 bg-white border border-neutral-200 px-3 pr-8 text-neutral-800 text-xs appearance-none focus:outline-none focus:border-neutral-400 cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isAr ? c.ar : c.en}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Acquisition / Transaction Filter */}
            <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'نوع الفرصة' : 'ACQUISITION'}
            </label>
            <div className="relative">
              <select
                value={selectedTransaction}
                onChange={(e) => setSelectedTransaction(e.target.value as TransactionFilter)}
                className="w-full h-11 bg-white border border-neutral-200 px-3 pr-8 text-neutral-800 text-xs appearance-none focus:outline-none focus:border-neutral-400 cursor-pointer"
              >
                {transactionTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {isAr ? t.ar : t.en}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'نوع العقار' : 'PROPERTY TYPE'}
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-11 bg-white border border-neutral-200 px-3 pr-8 text-neutral-800 text-xs appearance-none focus:outline-none focus:border-neutral-400 cursor-pointer"
              >
                <option value="all">{isAr ? 'جميع الأنواع' : 'All property types'}</option>
                {propertyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
          <span>{filteredProperties.length.toString().padStart(2, '0')} / {PROPERTIES.length.toString().padStart(2, '0')}</span>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-neutral-200 hover:border-neutral-400 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              {/* Image */}
              <Link
                href={`/properties/${property.id}`}
                className="relative aspect-[16/10] overflow-hidden bg-neutral-100 block"
              >
                <img
                  src={property.image}
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 text-[10px] font-mono uppercase bg-white/95 px-2 py-0.5 border border-neutral-200 text-[#0C3826]">
                  {property.badge}
                </div>
              </Link>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 uppercase tracking-wider mb-2 font-mono">
                    <span>{property.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{property.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{property.transaction}</span>
                  </div>

                  <Link href={`/properties/${property.id}`}>
                    <h4 className="font-serif text-xl text-[#0C3826] font-normal leading-snug group-hover:text-[#A98950] transition-colors mb-3">
                      {isAr ? property.titleAr : property.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4 font-light">
                    {isAr ? property.descriptionAr : property.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 font-mono pb-4 mb-4 border-b border-neutral-100">
                    {property.bedrooms > 0 && <span>{property.bedrooms} Bed</span>}
                    {property.bathrooms > 0 && <span>· {property.bathrooms} Bath</span>}
                    {property.sizeSqm > 0 && <span><Maximize className="inline h-3 w-3" /> {property.sizeSqm} m²</span>}
                    <span className="text-[#0C3826] font-semibold"><Percent className="inline h-3 w-3" /> {property.projectedYield} Yield</span>
                  </div>
                  <ul className="mb-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] leading-relaxed text-neutral-500">
                    {property.keyFeatures.slice(0, 4).map((feature) => (
                      <li key={feature} className="line-clamp-1">· {feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2">
                  <span className="font-serif text-xl font-normal text-[#0C3826] tabular-nums">
                    {property.priceSAR > 0 ? formatPrice(property.priceSAR, currency) : (isAr ? 'حسب الطلب' : 'Price on request')}
                  </span>

                  <Link
                    href={`/properties/${property.id}`}
                    className="text-xs uppercase tracking-[0.16em] text-[#0C3826] hover:text-[#A98950] font-semibold flex items-center gap-1"
                  >
                    <span>{isAr ? 'الملف' : 'Dossier'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {filteredProperties.length === 0 && (
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

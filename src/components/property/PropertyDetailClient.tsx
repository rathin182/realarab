'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property, Currency, Language } from '../../types';
import { PROPERTIES, CURRENCY_RATES } from '../../data/websiteContent';
import { formatPrice } from '../../lib/currency';
import {
  ArrowLeft,
  Share2,
  ShieldCheck,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Percent,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck,
  Send,
  Phone,
  Mail,
  ChevronRight,
  Calculator,
  Download,
  ArrowUpRight,
} from 'lucide-react';

interface PropertyDetailClientProps {
  property: Property;
}

export const PropertyDetailClient: React.FC<PropertyDetailClientProps> = ({ property }) => {
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [language, setLanguage] = useState<Language>('en');
  const [inquirySent, setInquirySent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investorType: 'Individual HNW',
    message: `I am interested in acquiring or reviewing the full sovereign dossier for ${property.title}.`,
  });

  const isAr = language === 'ar';

  // Adjacent / Related properties in the same city or tier
  const relatedProperties = PROPERTIES.filter(
    (p) => p.id !== property.id && (p.city === property.city || p.tier === property.tier)
  ).slice(0, 3);

  // Mortgage / Murabaha Calculation for this specific property
  const downPaymentPercent = 30;
  const downPaymentAmount = property.priceSAR * (downPaymentPercent / 100);
  const financedAmount = property.priceSAR - downPaymentAmount;
  const annualProfitRate = 0.042; // 4.2% Murabaha profit rate
  const tenureYears = 15;
  const totalProfit = financedAmount * annualProfitRate * tenureYears;
  const monthlyInstallmentSAR = Math.round((financedAmount + totalProfit) / (tenureYears * 12));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert(isAr ? 'تم نسخ الرابط' : 'Link copied to clipboard');
    }
  };

  return (
    <div className={`min-h-screen bg-white text-[#141A17] font-sans ${isAr ? 'rtl' : 'ltr'}`}>
      {/* Top Header / Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Back Link & Wordmark */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-[#0C3826] transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              <span>{isAr ? 'العودة للمحفظة' : 'Back'}</span>
            </Link>

            <span className="hidden sm:inline-block text-neutral-300">|</span>

            <Link href="/" className="hidden sm:flex items-baseline gap-2 group">
              <span className="font-serif text-xl tracking-[0.1em] text-[#0C3826]">
                NAJM ESTATES
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#A98950] font-mono">
                KSA
              </span>
            </Link>
          </div>

          {/* Center Links (desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600">
            <Link href="/#properties" className="hover:text-[#0C3826] transition-colors">
              {isAr ? 'المشاريع' : 'FEATURED'}
            </Link>
            <Link href="/about" className="hover:text-[#0C3826] transition-colors">
              {isAr ? 'من نحن' : 'ABOUT'}
            </Link>
            <Link href="/contact" className="hover:text-[#0C3826] transition-colors">
              {isAr ? 'اتصل بنا' : 'CONTACT'}
            </Link>
            <Link href="/#private-advisory" className="hover:text-[#0C3826] transition-colors">
              {isAr ? 'الاستشارات الخاصة' : 'PRIVATE ADVISORY'}
            </Link>
          </nav>

          {/* Right: Currency, Language, FAL Box & Share */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center border border-neutral-200 divide-x divide-neutral-200 text-xs font-mono">
              {(Object.keys(CURRENCY_RATES) as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 transition-colors ${
                    currency === c
                      ? 'bg-[#0C3826] text-white font-semibold'
                      : 'hover:bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-2.5 py-1 text-xs text-neutral-700 hover:text-[#0C3826] transition-colors cursor-pointer font-serif"
            >
              {language === 'en' ? 'العربية' : 'EN'}
            </button>

            {/* FAL License Box Button */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono tracking-wider text-neutral-800 border border-neutral-300 hover:border-[#0C3826] hover:text-[#0C3826] transition-colors"
            >
              <span>FAL #1200034988</span>
            </Link>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-1.5 border border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-[#0C3826] transition-colors"
              title="Share Dossier"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-6">
          <Link href="/" className="hover:text-neutral-800 transition-colors">
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href="/#properties" className="hover:text-neutral-800 transition-colors">
            {isAr ? 'المحفظة' : 'Portfolio'}
          </Link>
          <span>/</span>
          <span className="text-[#0C3826] font-medium truncate max-w-xs sm:max-w-md">
            {isAr ? property.titleAr : property.title}
          </span>
        </nav>

        {/* Title Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-neutral-200 pb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 bg-[#0C3826] text-white">
                {property.badge}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 border border-neutral-300 text-neutral-600">
                {property.transaction === 'off-plan'
                  ? isAr
                    ? 'تحت الإنشاء (وافي)'
                    : 'Off-Plan (Wafi)'
                  : isAr
                  ? 'تملك حر'
                  : 'Freehold'}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 bg-[#A98950]/15 text-[#886933]">
                {property.city}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#0C3826] font-light leading-tight">
              {isAr ? property.titleAr : property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-neutral-500 font-light mt-2">
              <MapPin className="w-4 h-4 text-[#A98950]" />
              <span>{isAr ? property.locationAr : property.location}</span>
              <span className="font-mono text-xs text-neutral-400">· {property.registration}</span>
            </div>
          </div>

          {/* Pricing Highlight Card */}
          <div className="lg:text-right bg-neutral-50 p-6 border border-neutral-200 min-w-[280px]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
              {isAr ? 'القيمة الاستثمارية المقدرة' : 'Acquisition Value'}
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#0C3826] font-normal tabular-nums">
              {formatPrice(property.priceSAR, currency)}
            </div>
            <div className="text-xs font-mono text-[#A98950] mt-1 font-semibold">
              {property.projectedYield} {isAr ? 'العائد الصافي المتوقع' : 'Net Projected Yield'}
            </div>
          </div>
        </div>

        {/* Hero Architectural Gallery Canvas */}
        <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden bg-neutral-100 border border-neutral-200 mb-12 shadow-sm">
          <img
            src={property.image}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md px-4 py-2 border border-neutral-200 text-xs font-mono text-neutral-700">
            <span className="text-[#0C3826] font-bold">FAL BROKERAGE APPROVED</span> · CERTIFIED ASSET DOSSIER
          </div>
        </div>

        {/* 2-Column Core Architectural Spec & Inquiry Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (8 cols): Specifications, Narrative, Financial Model */}
          <div className="lg:col-span-8 space-y-12">
            {/* Spec Matrix */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">
                {isAr ? 'المواصفات الهندسية الأساسية' : '01. Spatial & Architectural Metrics'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-neutral-50 border border-neutral-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-mono uppercase">
                    <Maximize className="w-3.5 h-3.5" />
                    <span>{isAr ? 'المساحة' : 'Built Area'}</span>
                  </div>
                  <div className="font-serif text-2xl text-[#0C3826]">{property.sizeSqm} m²</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-mono uppercase">
                    <Bed className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الأجنحة' : 'Bedrooms'}</span>
                  </div>
                  <div className="font-serif text-2xl text-[#0C3826]">{property.bedrooms} Suites</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-mono uppercase">
                    <Bath className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الحمامات' : 'Bathrooms'}</span>
                  </div>
                  <div className="font-serif text-2xl text-[#0C3826]">{property.bathrooms} Baths</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 text-xs font-mono uppercase">
                    <Percent className="w-3.5 h-3.5" />
                    <span>{isAr ? 'العائد' : 'Yield'}</span>
                  </div>
                  <div className="font-serif text-2xl text-[#0C3826]">{property.projectedYield}</div>
                </div>
              </div>
            </div>

            {/* Narrative Description */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">
                {isAr ? 'الوصف الهندسي والاستثماري' : '02. Architectural & Sovereign Narrative'}
              </h2>
              <div className="prose max-w-none text-neutral-700 text-base leading-relaxed font-light space-y-4">
                <p>{isAr ? property.descriptionAr : property.description}</p>
                <p>
                  {isAr
                    ? 'تم تصميم هذا العقار بموجب أعلى المعايير الهندسية في المملكة العربية السعودية، بالتوافق التام مع متطلبات الهيئة العامة للعقار (REGA) ومنظومة وافي للتملك الحر والبيع على الخارطة. يوفر هذا الأصل عائداً استثمارياً مستداماً وقيمة إرثية تاريخية.'
                    : 'Engineered according to the sovereign standards of the Kingdom of Saudi Arabia, fully aligned with the Real Estate General Authority (REGA) and Wafi off-plan regulatory governance. This asset pairs generational wealth preservation with immediate capital compounding.'}
                </p>
              </div>
            </div>

            {/* Key Amenities & Privileges */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">
                {isAr ? 'المزايا الاستثنائية والامتيازات' : '03. Curated Amenities & Sovereign Privileges'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.keyFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 border border-neutral-200 bg-white hover:border-[#0C3826] transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#A98950] shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-800 font-light">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive SAMA Sharia Financing Breakdown */}
            <div className="border border-neutral-200 p-8 bg-neutral-50">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-5 h-5 text-[#0C3826]" />
                <div>
                  <h3 className="font-serif text-2xl text-[#0C3826] font-normal">
                    {isAr ? 'نموذج التمويل الإسلامي (المرابحة)' : 'SAMA Murabaha Financing Model'}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    {isAr ? 'معتمد وفقاً للوائح البنك المركزي السعودي (ساما)' : 'Compliant with Saudi Central Bank (SAMA) Guidelines'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-200">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                    {isAr ? 'الدفعة الأولى (30%)' : 'Down Payment (30%)'}
                  </span>
                  <span className="font-serif text-xl text-[#0C3826] tabular-nums mt-1 block">
                    {formatPrice(downPaymentAmount, currency)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                    {isAr ? 'القسط الشهري التقديري (15 سنة)' : 'Estimated Monthly (15 Yrs)'}
                  </span>
                  <span className="font-serif text-xl text-[#0C3826] tabular-nums mt-1 block">
                    {formatPrice(monthlyInstallmentSAR, currency)} / mo
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                    {isAr ? 'الأهلية للإقامة المميزة' : 'Golden Visa Eligibility'}
                  </span>
                  <span className="text-xs font-mono uppercase text-[#0C3826] font-bold mt-1 block">
                    {property.priceSAR >= 4000000 ? 'QUALIFIED (4M+ SAR)' : 'STANDARD ELIGIBILITY'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Private Acquisition Desk & Counselor */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 bg-white border border-neutral-300 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#A98950]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0C3826] font-semibold">
                  PRIVATE OFFICE ACQUISITION DESK
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#0C3826] font-normal mb-2">
                {isAr ? 'طلب ملف التملك السري' : 'Request Private Dossier'}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light mb-6">
                {isAr
                  ? 'يتم التعامل مع كافة الطلبات بموجب اتفاقية سرية معلومات ملزمة (NDA) وتوجيهها للمستشار التنفيذي المباشر.'
                  : 'Direct engagement with Najm Estates Senior Counsel under bilateral non-disclosure agreement.'}
              </p>

              {inquirySent ? (
                <div className="p-6 bg-[#0C3826]/5 border border-[#0C3826]/20 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-[#0C3826] mx-auto" />
                  <h4 className="font-serif text-lg text-[#0C3826]">
                    {isAr ? 'تم استلام طلبكم بنجاح' : 'Dossier Request Registered'}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {isAr
                      ? `تم تخصيص مستشار عقاري للتواصل معكم خلال ساعتين لمناقشة تفاصيل ${property.titleAr}.`
                      : `A private acquisition director has been assigned. You will receive the comprehensive NDA dossier shortly.`}
                  </p>
                  <button
                    onClick={() => setInquirySent(false)}
                    className="text-xs font-mono uppercase text-[#0C3826] underline hover:text-[#A98950]"
                  >
                    {isAr ? 'إرسال طلب آخر' : 'Submit Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      {isAr ? 'الاسم الكامل' : 'Full Legal Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? 'سعادة / الأستاذ...' : 'H.E. / Investor Name'}
                      className="w-full text-xs p-3 border border-neutral-200 focus:border-[#0C3826] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      {isAr ? 'البريد الإلكتروني المهني' : 'Institutional / Personal Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="investor@familyoffice.sa"
                      className="w-full text-xs p-3 border border-neutral-200 focus:border-[#0C3826] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      {isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp Direct'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 50 000 0000"
                      className="w-full text-xs p-3 border border-neutral-200 focus:border-[#0C3826] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      {isAr ? 'فئة المستثمر' : 'Investor Profile'}
                    </label>
                    <select
                      value={formData.investorType}
                      onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                      className="w-full text-xs p-3 border border-neutral-200 focus:border-[#0C3826] focus:outline-none bg-white transition-colors"
                    >
                      <option value="Individual HNW">Ultra High Net Worth Individual</option>
                      <option value="Family Office">Family Office / Sovereign Fund</option>
                      <option value="Corporate Entity">Corporate Entity / Real Estate Syndicate</option>
                      <option value="Expat Resident">Expat Resident / Premium Residency</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0C3826] hover:bg-[#08281B] text-white text-xs font-mono uppercase tracking-widest py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إرسال طلب التملك' : 'Request Private Dossier'}</span>
                  </button>
                </form>
              )}

              {/* Instant WhatsApp Direct Desk */}
              <div className="mt-6 pt-6 border-t border-neutral-200 space-y-3">
                <a
                  href={`https://wa.me/966500000000?text=${encodeURIComponent(
                    `Hello Najm Estates Private Office, I am inquiring about: ${property.title} (Registration: ${property.registration})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-mono uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0C3826]" />
                  <span>{isAr ? 'محادثة واتساب مباشرة' : 'Direct WhatsApp Desk'}</span>
                </a>

                <div className="text-[10px] font-mono text-neutral-400 text-center uppercase tracking-wider">
                  FAL Registration #1200034988 · Confidential
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adjacent / Related Portfolio Offerings */}
        {relatedProperties.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A98950] block">
                  {isAr ? 'عقارات مشابهة' : 'ADJACENT ASSETS'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#0C3826] font-normal">
                  {isAr ? 'عقارات أخرى في نفس المحفظة' : 'Explore Corresponding Holdings'}
                </h3>
              </div>
              <Link
                href="/#properties"
                className="text-xs uppercase tracking-widest text-[#0C3826] hover:text-[#A98950] flex items-center gap-1 font-mono font-medium"
              >
                <span>{isAr ? 'عرض الكل' : 'View All'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/properties/${rel.id}`}
                  className="group bg-white border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-neutral-400 mb-1">
                        {rel.city} · {rel.type}
                      </div>
                      <h4 className="font-serif text-lg text-[#0C3826] group-hover:text-[#A98950] transition-colors mb-2">
                        {isAr ? rel.titleAr : rel.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                      <span className="font-serif text-base text-[#0C3826] tabular-nums">
                        {formatPrice(rel.priceSAR, currency)}
                      </span>
                      <span className="text-xs font-mono uppercase text-[#0C3826] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>{isAr ? 'عرض' : 'View'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Global Minimalist Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-baseline justify-between gap-6">
          <div className="space-y-1">
            <span className="font-serif text-lg tracking-[0.1em] text-[#0C3826] block">
              NAJM ESTATES KSA
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase block">
              FAL BROKERAGE REGISTRATION #1200034988
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            © 2026 NAJM ESTATES & DEVELOPMENT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

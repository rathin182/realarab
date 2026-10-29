'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Property, Currency, Language } from '../../types';
import { PROPERTIES } from '../../data/websiteContent';
import { formatPrice } from '../../lib/currency';
import {
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
  Mail,
  ChevronRight,
  Calculator,
  Download,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface PropertyDetailClientProps {
  property: Property;
}

function getVideoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.endsWith("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.endsWith("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }
  } catch {
    return url;
  }
  return url;
}

export const PropertyDetailClient: React.FC<PropertyDetailClientProps> = ({ property }) => {
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [language, setLanguage] = useState<Language>('en');
  const [inquirySent, setInquirySent] = useState(false);
  const gallery = property.media?.length ? property.media : [{ kind: "IMAGE" as const, src: property.image }];
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const activeMedia = gallery[activeMediaIndex] ?? gallery[0];
  const [showContactSlide, setShowContactSlide] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
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
  const mapQuery = property.latitude != null && property.longitude != null
    ? `${property.latitude},${property.longitude}`
    : [property.location, property.city].filter(Boolean).join(", ");
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrevious();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, gallery.length]);

  function openLightbox(index: number) {
    setActiveMediaIndex(index);
    setLightboxZoom(1);
    setLightboxOpen(true);
  }

  function showNext() {
    if (activeMediaIndex >= gallery.length - 1) {
      setLightboxOpen(false);
      setShowContactSlide(true);
      return;
    }
    setActiveMediaIndex((index) => index + 1);
  }

  function showPrevious() {
    if (showContactSlide) {
      setShowContactSlide(false);
      return;
    }
    setActiveMediaIndex((index) => Math.max(index - 1, 0));
  }

  const [inquirySending, setInquirySending] = useState(false);
  const [inquiryError, setInquiryError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inquirySending) return;

    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email.includes('@') || !emailRegex.test(email)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
    setInquirySending(true);
    setInquiryError(false);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email,
          phone: formData.phone,
          investorType: formData.investorType,
          message: formData.message,
          propertySlug: property.id,
          propertyTitle: property.title,
          source: 'property-page',
        }),
      });
      if (!res.ok) throw new Error('request failed');
      setInquirySent(true);
    } catch {
      setInquiryError(true);
    } finally {
      setInquirySending(false);
    }
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

        {/* Property photo and video gallery */}
        <section aria-label={isAr ? "صور وفيديو العقار" : "Property photos and videos"} className={showContactSlide ? "fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-neutral-900 p-4 sm:p-8" : "mb-12"}>
          {showContactSlide && <>
            <img src={property.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30 blur-sm" />
            <div className="absolute inset-0 bg-white/35" />
            <button type="button" onClick={showPrevious} aria-label={isAr ? "العودة إلى آخر صورة" : "Back to last media"} className="absolute start-4 top-1/2 z-[95] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-800 shadow-lg hover:bg-white sm:start-6"><ChevronLeft className="h-6 w-6" /></button>
            <button type="button" onClick={() => { setShowContactSlide(false); setActiveMediaIndex(0); }} aria-label={isAr ? "العودة إلى أول صورة" : "Restart gallery"} className="absolute end-4 top-1/2 z-[95] grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-800 shadow-lg hover:bg-white sm:end-6"><ChevronRightIcon className="h-6 w-6" /></button>
            <button type="button" onClick={() => setShowContactSlide(false)} aria-label={isAr ? "إغلاق نموذج التواصل والعودة إلى المعرض" : "Close contact form and return to gallery"} className="absolute end-4 top-4 z-[100] grid h-11 w-11 place-items-center rounded-full bg-white/95 text-neutral-800 shadow-lg hover:bg-white sm:end-6 sm:top-6"><X className="h-5 w-5" /></button>
          </>}
          <div className={showContactSlide ? "relative hidden" : "relative aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm"}>
            {activeMedia.kind === "IMAGE" ? (
              <button type="button" onClick={() => openLightbox(activeMediaIndex)} aria-label={isAr ? "معاينة الصورة" : "Open image preview"} className="h-full w-full cursor-pointer overflow-hidden bg-neutral-100">
                <img src={activeMedia.src} alt={`${property.title} ${activeMediaIndex + 1}`} referrerPolicy="no-referrer" className="relative z-10 h-full w-full object-cover" />
              </button>
            ) : activeMedia.kind === "VIDEO_UPLOAD" ? (
              <video key={activeMedia.src} src={activeMedia.src} controls playsInline className="h-full w-full object-cover" aria-label={`${property.title} video`} />
            ) : (
              <iframe key={activeMedia.src} src={getVideoEmbedUrl(activeMedia.src)} title={`${property.title} video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="h-full w-full border-0" />
            )}
            {activeMediaIndex > 0 && <button type="button" onClick={showPrevious} aria-label={isAr ? "الوسيط السابق" : "Previous media"} className="absolute start-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow hover:bg-white"><ChevronLeft className="h-5 w-5" /></button>}
            <button type="button" onClick={showNext} aria-label={activeMediaIndex === gallery.length - 1 ? (isAr ? "الانتقال إلى نموذج التواصل" : "Continue to contact form") : (isAr ? "الوسيط التالي" : "Next media")} className="absolute end-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-neutral-900 shadow hover:bg-white"><ChevronRightIcon className="h-5 w-5" /></button>
            <div className="absolute bottom-4 start-4 bg-white/95 px-4 py-2 text-xs font-mono text-neutral-700">{activeMediaIndex + 1} / {gallery.length}{activeMedia.kind !== "IMAGE" ? ` · ${isAr ? "فيديو" : "Video"}` : ""}</div>
          </div>
          {!showContactSlide && gallery.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {gallery.map((media, index) => <button key={`${media.src}-${index}`} type="button" onClick={() => setActiveMediaIndex(index)} aria-label={`${isAr ? "عرض الوسيط" : "Show media"} ${index + 1}`} aria-pressed={activeMediaIndex === index} className={`relative h-16 w-24 shrink-0 overflow-hidden border-2 ${activeMediaIndex === index ? "border-[#0C3826]" : "border-neutral-200"}`}>
              {media.kind === "IMAGE" ? <img src={media.src} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center bg-neutral-900 text-xs font-medium text-white">{isAr ? "فيديو" : "VIDEO"}</span>}
            </button>)}
          </div>}
        </section>

        {lightboxOpen && activeMedia?.kind === "IMAGE" && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label={isAr ? "معاينة الصورة" : "Image preview"} onClick={() => setLightboxOpen(false)}>
          <button type="button" onClick={() => setLightboxOpen(false)} aria-label={isAr ? "إغلاق" : "Close preview"} className="absolute end-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><X className="h-6 w-6" /></button>
          <div className="absolute start-4 top-4 z-10 flex gap-2" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setLightboxZoom((zoom) => Math.min(zoom + 0.25, 3))} aria-label={isAr ? "تكبير" : "Zoom in"} className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ZoomIn className="h-5 w-5" /></button>
            <button type="button" onClick={() => setLightboxZoom((zoom) => Math.max(zoom - 0.25, 1))} aria-label={isAr ? "تصغير" : "Zoom out"} className="rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ZoomOut className="h-5 w-5" /></button>
          </div>
          {activeMediaIndex > 0 && <button type="button" onClick={(event) => { event.stopPropagation(); showPrevious(); }} aria-label={isAr ? "الصورة السابقة" : "Previous image"} className="absolute start-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronLeft className="h-7 w-7" /></button>}
          <img src={activeMedia.src} alt={`${property.title} ${activeMediaIndex + 1}`} onClick={(event) => event.stopPropagation()} className=" object-cover transition-transform duration-200" style={{ transform: `scale(${lightboxZoom})` }} />
          <button type="button" onClick={(event) => { event.stopPropagation(); showNext(); }} aria-label={activeMediaIndex === gallery.length - 1 ? (isAr ? "الانتقال إلى نموذج التواصل" : "Continue to contact form") : (isAr ? "الصورة التالية" : "Next image")} className="absolute end-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronRightIcon className="h-7 w-7" /></button>
          <span className="absolute bottom-4 rounded bg-black/50 px-3 py-2 text-sm text-white">{activeMediaIndex + 1} / {gallery.length}</span>
        </div>}

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

            {property.amenities?.length ? <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">
                {isAr ? 'المرافق' : '03. Amenities'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 border border-neutral-200 bg-white hover:border-[#0C3826] transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#A98950] shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-800 font-light">{feat}</span>
                  </div>
                ))}
              </div>
            </div> : null}

            {property.keyFeatures.length ? <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-4">
                {isAr ? 'الميزات الرئيسية' : '04. Key Features'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.keyFeatures.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 border border-neutral-200 bg-white hover:border-[#0C3826] transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-[#A98950] shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-800 font-light">{feat}</span>
                  </div>
                ))}
              </div>
            </div> : null}

            {/* Interactive SAMA Sharia Financing Breakdown */}
            {mapQuery && <section className="mb-12 border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[#0C3826]">{isAr ? "موقع العقار" : "Property Location"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isAr ? property.locationAr : property.location}</p>
            </div>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-sm text-[#0C3826] underline underline-offset-2">
              {isAr ? "افتح في خرائط Google" : "Open in Google Maps"}<ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <iframe title={isAr ? "خريطة موقع العقار" : "Property location map"} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="h-72 w-full border-0 sm:h-96" />
        </section>}
          </div>

          {/* Right Column (4 cols): Private Acquisition Desk & Counselor */}
          <div className="lg:col-span-4 space-y-6">
            <div id="dossier" className={showContactSlide ? "fixed left-1/2 top-1/2 z-[90] max-h-[92vh] w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white border border-neutral-300 p-6 sm:p-8 shadow-2xl" : "sticky top-28 bg-white border border-neutral-300 p-6 sm:p-8 shadow-sm"}>
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
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setEmailError(false);
                      }}
                      placeholder="investor@familyoffice.sa"
                      aria-invalid={emailError}
                      aria-describedby={emailError ? "property-email-error" : undefined}
                      className="w-full text-xs p-3 border border-neutral-200 focus:border-[#0C3826] focus:outline-none transition-colors"
                    />
                    {emailError && (
                      <p id="property-email-error" role="alert" className="mt-1 text-xs text-red-700">
                        {isAr
                          ? "يرجى إدخال عنوان بريد إلكتروني صحيح."
                          : "Please enter a valid email address."}
                      </p>
                    )}
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

                  {inquiryError && (
                    <p role="alert" className="text-xs text-red-700">
                      {isAr ? 'تعذر إرسال الطلب، يرجى المحاولة مرة أخرى.' : 'Could not send your request. Please try again.'}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={inquirySending}
                    className="w-full bg-[#0C3826] hover:bg-[#08281B] disabled:opacity-60 text-white text-xs font-mono uppercase tracking-widest py-3.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إرسال طلب التملك' : 'Request Private Dossier'}</span>
                  </button>
                </form>
              )}

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

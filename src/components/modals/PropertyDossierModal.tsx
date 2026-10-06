import React, { useState } from 'react';
import { Currency, Language, Property } from '../../types';
import { formatPrice } from '../../lib/currency';
import { X, Check, MapPin } from 'lucide-react';

interface PropertyDossierModalProps {
  property: Property | null;
  onClose: () => void;
  currency: Currency;
  language: Language;
}

export const PropertyDossierModal: React.FC<PropertyDossierModalProps> = ({
  property,
  onClose,
  currency,
  language,
}) => {
  const isAr = language === 'ar';
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!property) return null;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) return;
    setIsSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-4xl bg-white border border-neutral-300 shadow-2xl p-6 sm:p-10 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Strip */}
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-2">
            <span className="text-[#0C3826] tracking-wider uppercase border border-neutral-200 px-2 py-0.5">
              {property.badge}
            </span>
            <span className="text-neutral-400">{property.registration}</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-4xl text-[#0C3826] font-normal">
            {isAr ? property.titleAr : property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#A98950]" />
            <span>{isAr ? property.locationAr : property.location}</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image & Specs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={property.image}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 text-xs font-mono text-[#0C3826] bg-white/95 px-2.5 py-1 border border-neutral-200">
                <span>{property.projectedYield} Net Projected Yield</span>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-neutral-50 border border-neutral-200 text-xs font-mono text-center">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Bedrooms</span>
                <span className="text-sm font-semibold text-neutral-900">
                  {property.bedrooms > 0 ? property.bedrooms : 'N/A'}
                </span>
              </div>
              <div className="border-x border-neutral-200">
                <span className="text-neutral-400 block text-[10px] uppercase">Bathrooms</span>
                <span className="text-sm font-semibold text-neutral-900">
                  {property.bathrooms > 0 ? property.bathrooms : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Gross Area</span>
                <span className="text-sm font-semibold text-neutral-900">
                  {property.sizeSqm} m²
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              <strong className="text-[#0C3826] text-xs uppercase tracking-wider block font-serif">
                {isAr ? 'الوصف المعماري والاستثماري' : 'ARCHITECTURAL OVERVIEW'}
              </strong>
              <p>{isAr ? property.descriptionAr : property.description}</p>
            </div>

            {/* Key Features */}
            <div>
              <strong className="text-[#0C3826] text-xs uppercase tracking-wider block font-serif mb-3">
                {isAr ? 'المواصفات والضمانات الحصرية' : 'KEY FEATURES & AMENITIES'}
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                {property.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#0C3826] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Valuation & Private Tour Booking */}
          <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 p-6 space-y-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-neutral-200 pb-4 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block mb-1">
                  OFFICIAL VALUATION
                </span>
                <div className="font-serif text-3xl text-[#0C3826] font-normal tabular-nums">
                  {formatPrice(property.priceSAR, currency)}
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  REGA License Regulated · 5% RETT Applicable
                </span>
              </div>

              {!isSent ? (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <span className="text-xs uppercase tracking-wider text-neutral-900 font-semibold block">
                    {isAr ? 'طلب معاينة خاصة أو مخطط تفصيلي' : 'Request Private Tour & Floorplans'}
                  </span>

                  <div>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full h-10 bg-white border border-neutral-200 px-3 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="Phone / WhatsApp (+966...)"
                      className="w-full h-10 bg-white border border-neutral-200 px-3 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 bg-[#0C3826] hover:bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                  >
                    <span>{isAr ? 'إرسال طلب المعاينة' : 'Submit Private Request'}</span>
                  </button>
                </form>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <h4 className="font-serif text-xl text-[#0C3826]">
                    {isAr ? 'تم استلام طلبكم' : 'Dossier Request Dispatched'}
                  </h4>
                  <p className="text-xs text-neutral-600 font-light">
                    {isAr
                      ? 'سيتواصل معكم المستشار العقاري المخصص لترتيب موعد المعاينة.'
                      : 'An assigned executive advisor will connect shortly to coordinate private viewings.'}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-200 text-[11px] font-mono text-neutral-400">
              FAL License #1200034988 · Sovereign Escrow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

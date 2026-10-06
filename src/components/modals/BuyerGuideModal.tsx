import React, { useState } from 'react';
import { Language } from '../../types';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

interface BuyerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConsultCounsel: () => void;
}

export const BuyerGuideModal: React.FC<BuyerGuideModalProps> = ({
  isOpen,
  onClose,
  language,
  onConsultCounsel,
}) => {
  const [activeTab, setActiveTab] = useState<'international' | 'saudi' | 'expat'>('international');
  const isAr = language === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-3xl bg-white border border-neutral-300 shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 border-b border-neutral-200 pb-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
            REGULATORY FRAMEWORK · ROYAL DECREE M/15
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#0C3826] font-normal">
            {isAr ? 'دليل حقوق التملك والأنظمة العقارية بالمملكة' : 'Saudi Sovereign Ownership Guidelines'}
          </h3>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 mb-6 text-xs uppercase tracking-wider font-medium">
          <button
            onClick={() => setActiveTab('international')}
            className={`pb-3 px-4 transition-colors cursor-pointer ${
              activeTab === 'international'
                ? 'text-[#0C3826] border-b-2 border-[#0C3826] font-semibold'
                : 'text-neutral-400 hover:text-neutral-800'
            }`}
          >
            {isAr ? 'المستثمر الدولي' : 'International Buyer'}
          </button>
          <button
            onClick={() => setActiveTab('saudi')}
            className={`pb-3 px-4 transition-colors cursor-pointer ${
              activeTab === 'saudi'
                ? 'text-[#0C3826] border-b-2 border-[#0C3826] font-semibold'
                : 'text-neutral-400 hover:text-neutral-800'
            }`}
          >
            {isAr ? 'المواطن والمكاتب العائلية' : 'Saudi Citizen'}
          </button>
          <button
            onClick={() => setActiveTab('expat')}
            className={`pb-3 px-4 transition-colors cursor-pointer ${
              activeTab === 'expat'
                ? 'text-[#0C3826] border-b-2 border-[#0C3826] font-semibold'
                : 'text-neutral-400 hover:text-neutral-800'
            }`}
          >
            {isAr ? 'المقيم بالمملكة' : 'Expat Resident'}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs text-neutral-600 leading-relaxed font-light">
          {activeTab === 'international' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 border-l-2 border-[#0C3826]">
                <strong className="text-[#0C3826] text-sm block mb-1 font-serif">
                  {isAr ? 'حق التملك الحر للمستثمرين الدوليين' : 'Unrestricted Freehold in Designated Investment Corridors'}
                </strong>
                <p>
                  {isAr
                    ? 'بموجب المرسوم الملكي م/15، يحق للأفراد والشركات الأجنبية تملك العقارات السكنية والتجارية بصكوك ملكية إلكترونية فورية مسجلة عبر وزارة العدل (ناجز).'
                    : 'Foreign individual and corporate principals can acquire registered freehold residential and commercial property deeds issued electronically by the Ministry of Justice.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-neutral-200 space-y-1">
                  <span className="text-[#0C3826] font-semibold uppercase tracking-wider block">
                    {isAr ? 'الإقامة المميزة (الفيزا الذهبية)' : 'Golden Visa Eligibility'}
                  </span>
                  <p>
                    {isAr
                      ? 'شراء عقار مطور بقيمة لا تقل عن 4 ملايين ريال سعودي يؤهل للإقامة المميزة المتجددة مع كفالة الأسرة.'
                      : 'Acquiring unencumbered developed property valued at SAR 4,000,000+ qualifies for renewable Saudi Premium Residency.'}
                  </p>
                </div>

                <div className="p-4 border border-neutral-200 space-y-1">
                  <span className="text-[#0C3826] font-semibold uppercase tracking-wider block">
                    {isAr ? 'صكوك الحرمين (99 عاماً)' : '99-Yr Holy Sanctuary Deeds'}
                  </span>
                  <p>
                    {isAr
                      ? 'يحق للمسلمين تملك صكوك انتفاع لمدة 99 عاماً موثقة رسمياً في مكة المكرمة والمدينة المنورة قابلة للتوريث والبيع.'
                      : 'International Muslim investors acquire 99-year registered Usufruct deeds in Makkah and Madinah.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>RETT TRANSACTION TAX: 5%</span>
                <span>PERSONAL CAPITAL GAINS: 0%</span>
                <span>VAT ON RESIDENTIAL: 0%</span>
              </div>
            </div>
          )}

          {activeTab === 'saudi' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 border-l-2 border-[#0C3826]">
                <strong className="text-[#0C3826] text-sm block mb-1 font-serif">
                  {isAr ? 'حق التملك الكامل في كافة مناطق المملكة' : 'Universal Sovereign Freehold'}
                </strong>
                <p>
                  {isAr
                    ? 'حق تملك كامل وغير مقيد لكافة الأراضي والعقارات في جميع مدن ومناطق المملكة، بما في ذلك الأراضي والقصور داخل النطاق العمراني للحرمين الشريفين.'
                    : 'Unrestricted sovereign freehold title across all regions including inner Holy Sanctuary zones, with preferential LTV financing up to 90% via SAMA.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'expat' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 border-l-2 border-[#0C3826]">
                <strong className="text-[#0C3826] text-sm block mb-1 font-serif">
                  {isAr ? 'تملك المقيمين عبر منصة أبشر' : 'Resident Expat Freehold Rights'}
                </strong>
                <p>
                  {isAr
                    ? 'يحق للمقيم الذي يحمل إقامة نظامية سارية تملك عقار سكني واحد لكامل الأسرة في المدن المعتمدة مع موافقة فورية ميسرة عبر منصة أبشر.'
                    : 'Legal foreign residents residing in Saudi Arabia can acquire a registered residential property for private family occupancy via streamlined Absher & REGA approval.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-200 flex justify-between items-center">
          <span className="text-[11px] font-mono text-neutral-400">
            Royal Decree M/15 & REGA Directives
          </span>
          <button
            onClick={() => {
              onClose();
              onConsultCounsel();
            }}
            className="px-5 py-2.5 bg-[#0C3826] hover:bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isAr ? 'استشارة المستشار' : 'Consult Counsel'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

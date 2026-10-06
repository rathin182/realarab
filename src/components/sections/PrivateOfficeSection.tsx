import React, { useState } from 'react';
import { Language } from '../../types';
import { ArrowUpRight, Check, Send } from 'lucide-react';

interface PrivateOfficeProps {
  language: Language;
}

export const PrivateOfficeSection: React.FC<PrivateOfficeProps> = ({ language }) => {
  const isAr = language === 'ar';
  const [showFormModal, setShowFormModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitted(true);
  };

  return (
    <section id="private-advisory" className="py-20 bg-white border-t border-neutral-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Advisory Box (Direct Match to Image 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Direct Executive Contact */}
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-mono block">
              {isAr ? 'استفسار سري واستشارات خاصة' : 'CONFIDENTIAL INQUIRY & PRIVATE ADVISORY'}
            </span>

            <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#0C3826] leading-tight">
              {isAr ? 'ابدأ جلستك الاستشارية الخاصة.' : 'Begin your private advisory session.'}
            </h2>

            <div className="pt-2 space-y-1 font-serif text-2xl sm:text-3xl text-neutral-800">
              <a
                href="tel:+966533258822"
                className="block hover:text-[#0C3826] transition-colors"
              >
                +966 53 325 8822
              </a>
              <a
                href="mailto:sohel@najmdevelopment.com"
                className="block italic text-neutral-600 hover:text-[#0C3826] transition-colors text-xl sm:text-2xl"
              >
                sohel@najmdevelopment.com
              </a>
            </div>
          </div>

          {/* Right Column: Exclusive Desk Box (From Image 11) */}
          <div className="lg:col-span-4 p-8 border border-neutral-200 space-y-6 text-center bg-[#FAF9F6]">
            <div>
              <p className="font-serif italic text-2xl sm:text-3xl text-[#A98950] mb-2 font-normal">
                Exclusive Desk
              </p>
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono block">
                {isAr ? 'متاح بموعد مسبق' : 'AVAILABLE BY APPOINTMENT'}
              </span>
            </div>

            <button
              onClick={() => setShowFormModal(true)}
              className="w-full py-3.5 border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isAr ? 'ترتيب اجتماع خاص' : 'ARRANGE A MEETING'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Offices Strip (From Image 11) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-neutral-200 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'مكتب المملكة العربية السعودية / المقر الرئيسي' : 'SAUDI ARABIAN OFFICE / HQ'}
            </span>
            <p className="text-neutral-700 font-light">
              Riyadh 11455, Murabba Dabab St.
            </p>
            <p className="text-neutral-500 font-light">
              PO Box 20222, Saudi Arabia
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
              {isAr ? 'مكتب الهند / المركز الدولي' : 'INDIA OFFICE / INTERNATIONAL HUB'}
            </span>
            <p className="text-neutral-700 font-light">
              Pillar number 143, Attapur,
            </p>
            <p className="text-neutral-500 font-light">
              Hyderabad, India.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Modal if user clicks 'Arrange A Meeting' */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-neutral-300 p-8 max-w-lg w-full space-y-5 relative shadow-2xl">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 text-lg cursor-pointer"
            >
              ✕
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono block">
                  CONFIDENTIAL INQUIRY
                </span>
                <h3 className="font-serif text-2xl text-[#0C3826]">
                  {isAr ? 'طلب جلسة استشارية تنفيذية' : 'Arrange an Executive Consultation'}
                </h3>

                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 border border-neutral-200 px-3 text-xs focus:outline-none focus:border-neutral-900"
                />

                <input
                  type="email"
                  required
                  placeholder="Private Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 border border-neutral-200 px-3 text-xs focus:outline-none focus:border-neutral-900"
                />

                <input
                  type="tel"
                  placeholder="Telephone / WhatsApp (+966...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 border border-neutral-200 px-3 text-xs focus:outline-none focus:border-neutral-900"
                />

                <button
                  type="submit"
                  className="w-full h-11 bg-neutral-900 hover:bg-[#0C3826] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                >
                  {isAr ? 'تأكيد الطلب' : 'Submit Confidential Brief'}
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="font-serif text-2xl text-[#0C3826]">
                  {isAr ? 'تم استلام طلبكم' : 'Brief Received'}
                </p>
                <p className="text-xs text-neutral-600 font-light">
                  {isAr
                    ? `شكراً لكم، ${name}. سيتواصل معكم أحد الشركاء المؤسسين لمتابعة الترتيبات.`
                    : `Thank you, ${name}. An Executive Partner will establish confidential communication shortly.`}
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setShowFormModal(false);
                  }}
                  className="px-6 py-2 border border-neutral-900 text-xs uppercase tracking-wider cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

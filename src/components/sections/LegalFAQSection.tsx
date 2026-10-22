import React, { useState, useMemo } from 'react';
import { Language } from '../../types';
import { FAQS } from '../../data/websiteContent';
import { Plus, Minus, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalFAQSectionProps {
  language: Language;
  onOpenPrivateOffice: () => void;
}

export const LegalFAQSection: React.FC<LegalFAQSectionProps> = ({ language, onOpenPrivateOffice }) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investorType: 'Family Office',
    allocationTier: '30M - 100M SAR',
    region: 'Riyadh Core',
    message: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const q = searchQuery.toLowerCase();
    return FAQS.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        f.qAr.includes(q) ||
        f.a.toLowerCase().includes(q) ||
        f.aAr.includes(q)
    );
  }, [searchQuery]);

  return (
    <section id="faq" className="py-20 bg-white border-t border-neutral-200 font-sans">
      <div className="max-w-[110rem] mx-auto px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* FAQ column */}
          <div className="min-w-0 pt-0 lg:pt-[3.55rem]">
        <div className="mb-6 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'البحث في الأنظمة، الضرائب، التملك...' : 'Ownership, financing, taxes...'}
            className="w-full pb-2 text-xs text-neutral-800 placeholder-neutral-400 border-b border-neutral-300 focus:outline-none focus:border-neutral-800 font-mono"
          />
        </div>

        {/* Clean Accordion List (Direct Match to Image 10) */}
        <div className="border-t border-neutral-200 divide-y divide-neutral-200">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div key={faq.id} className="py-3.5">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full text-left flex items-start justify-between gap-4 cursor-pointer group"
                >
                  <span className="font-sans text-[13px] sm:text-sm text-neutral-700 font-normal leading-snug group-hover:text-[#0C3826] transition-colors">
                    {isAr ? faq.qAr : faq.q}
                  </span>
                  <span className="text-neutral-400 group-hover:text-neutral-900 transition-colors mt-1 shrink-0">
                    {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-3 text-xs text-neutral-600 font-light leading-relaxed max-w-3xl"
                    >
                      <p className="mb-3">{isAr ? faq.aAr : faq.a}</p>
                      <div className="text-[11px] font-mono text-[#A98950]">
                        {faq.reference}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer Regulatory Note (From Image 10) */}
        <div className="mt-6 pt-3 border-t border-neutral-200 text-[10px] text-neutral-400 font-light">
          Information supplied by Najm Estates; legal eligibility, tax treatment and project approvals require current professional verification under FAL Brokerage Registration #1200034988.
        </div>
          </div>

          {/* Acquisition mandate form column */}
          <div className="min-w-0">
            <div className="border border-neutral-200 bg-[#FBFAF7] p-6 sm:p-8 lg:p-7 xl:p-10">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#A98950]" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C3826]">Confidential Inquiry Dossier</span>
              </div>
              <h2 className="mb-3 font-serif text-2xl font-light text-[#315C49] sm:text-3xl">
                Register Your Acquisition Mandate
              </h2>
              <p className="mb-7 text-xs font-light leading-relaxed text-neutral-500">
                Please provide your transaction parameters. A senior partner will contact you directly within two business hours.
              </p>

              {submitted ? (
                <div className="space-y-4 border border-[#0C3826]/20 bg-[#0C3826]/5 px-5 py-10 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-[#0C3826]" />
                  <h3 className="font-serif text-2xl text-[#0C3826]">Mandate Received &amp; Encrypted</h3>
                  <p className="mx-auto max-w-md text-xs leading-relaxed text-neutral-600">
                    Thank you, {formData.name || 'Valued Partner'}. Your inquiry regarding <span className="font-semibold text-[#0C3826]">{formData.region}</span> has been routed to our Managing Partner.
                  </p>
                  <button type="button" onClick={() => setSubmitted(false)} className="pt-3 font-mono text-xs uppercase tracking-wider text-[#0C3826] underline hover:text-[#A98950]">Submit another inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">Full Legal Name *<input type="text" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="H.E. Sheikh / Investor Name" className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 placeholder:text-neutral-400 focus:border-[#0C3826] focus:outline-none" /></label>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">Institutional Email *<input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="principal@familyoffice.sa" className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 placeholder:text-neutral-400 focus:border-[#0C3826] focus:outline-none" /></label>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">Direct Phone / WhatsApp *<input type="tel" required value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="+966 50 000 0000" className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 placeholder:text-neutral-400 focus:border-[#0C3826] focus:outline-none" /></label>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">Investor Profile *<select value={formData.investorType} onChange={(event) => setFormData({ ...formData, investorType: event.target.value })} className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 focus:border-[#0C3826] focus:outline-none"><option value="Family Office">Single / Multi Family Office</option><option value="Sovereign Institutional">Sovereign / Institutional Fund</option><option value="Ultra HNW">Ultra High Net Worth Individual</option><option value="Expat Resident">Expat Resident / Premium Residency</option></select></label>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">Capital Allocation Tier<select value={formData.allocationTier} onChange={(event) => setFormData({ ...formData, allocationTier: event.target.value })} className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 focus:border-[#0C3826] focus:outline-none"><option value="Under 10M SAR">Under 10,000,000 SAR</option><option value="10M - 30M SAR">10,000,000 – 30,000,000 SAR</option><option value="30M - 100M SAR">30,000,000 – 100,000,000 SAR</option><option value="100M+ SAR">100,000,000+ SAR (Sovereign)</option></select></label>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">Target Acquisition Corridor<select value={formData.region} onChange={(event) => setFormData({ ...formData, region: event.target.value })} className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 focus:border-[#0C3826] focus:outline-none"><option value="Riyadh Core">Riyadh Core (New Murabba / KAFD)</option><option value="Diriyah Gate">Diriyah Gate &amp; Wadi Safar</option><option value="Holy Cities">Makkah &amp; Madinah (Usufruct)</option><option value="Red Sea & NEOM">Red Sea Global &amp; NEOM (Sindalah)</option></select></label>
                  </div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">Mandate Overview &amp; Specific Requirements<textarea rows={4} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Outline target square meters, architectural preferences, or syndicate requirements..." className="mt-1 block w-full resize-y border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 placeholder:text-neutral-400 focus:border-[#0C3826] focus:outline-none" /></label>
                  <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-2 bg-[#0C3826] py-4 font-mono text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#08281B]"><Send className="h-3.5 w-3.5" /><span>Submit Confidential Mandate</span></button>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[10px] text-neutral-400"><span>FAL Brokerage Registration #1200034988</span><span>Direct Encryption</span></div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

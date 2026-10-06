import React, { useState, useMemo } from 'react';
import { Language } from '../../types';
import { FAQS } from '../../data/websiteContent';
import { Plus, Minus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LegalFAQSectionProps {
  language: Language;
  onOpenPrivateOffice: () => void;
}

export const LegalFAQSection: React.FC<LegalFAQSectionProps> = ({ language, onOpenPrivateOffice }) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Input (Exact Match to Image 10) */}
        <div className="mb-10 max-w-md">
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
              <div key={faq.id} className="py-5">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full text-left flex items-start justify-between gap-4 cursor-pointer group"
                >
                  <span className="font-serif text-xl sm:text-2xl text-neutral-800 font-normal leading-snug group-hover:text-[#0C3826] transition-colors">
                    {isAr ? faq.qAr : faq.q}
                  </span>
                  <span className="text-neutral-400 group-hover:text-neutral-900 transition-colors mt-1 shrink-0">
                    {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-4 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-3xl"
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
        <div className="mt-12 pt-4 border-t border-neutral-200 text-[11px] text-neutral-400 font-light">
          Information supplied by Najm Estates; legal eligibility, tax treatment and project approvals require current professional verification under FAL Brokerage Registration #1200034988.
        </div>
      </div>
    </section>
  );
};

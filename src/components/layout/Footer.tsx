import React from 'react';
import { Language } from '../../types';

interface FooterProps {
  language: Language;
  onOpenPrivateOffice: () => void;
  onOpenBuyerGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenBuyerGuide }) => {
  const isAr = language === 'ar';

  return (
    <footer className="bg-white border-t border-neutral-200 py-12 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-6">
          {/* Brand & Registration (Direct Match to Image 11) */}
          <div className="space-y-1">
            <span className="font-serif text-lg tracking-[0.1em] font-normal text-[#0C3826] block">
              NAJM ESTATES KSA
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase block">
              FAL BROKERAGE REGISTRATION #1200034988
            </span>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider text-neutral-500">
            <button
              onClick={onOpenBuyerGuide}
              className="hover:text-neutral-900 transition-colors cursor-pointer"
            >
              {isAr ? 'حقوق التملك' : 'Ownership Rights'}
            </button>
            <a href="#properties" className="hover:text-neutral-900 transition-colors">
              {isAr ? 'المشاريع' : 'Featured'}
            </a>
            <a href="#vision2030" className="hover:text-neutral-900 transition-colors">
              {isAr ? 'رؤية 2030' : 'Vision 2030'}
            </a>
            <a href="#faq" className="hover:text-neutral-900 transition-colors">
              {isAr ? 'الأنظمة' : 'Legal & FAQ'}
            </a>
          </div>

          {/* Copyright (Direct Match to Image 11) */}
          <div className="text-[11px] font-mono text-neutral-400">
            © 2026 NAJM ESTATES & DEVELOPMENT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};

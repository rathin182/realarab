import React from 'react';
import { Link } from "react-router-dom";
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
            <Link to="/" className="font-serif text-lg tracking-[0.1em] font-normal text-[#0C3826] block hover:text-[#A98950] transition-colors">
              NAJM ESTATES KSA
            </Link>
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase block">
              FAL BROKERAGE REGISTRATION #1200034988
            </span>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-wider text-neutral-500">
            <Link to="/about" className="hover:text-neutral-900 transition-colors">
              {isAr ? 'من نحن' : 'About'}
            </Link>
            <Link to="/#properties" className="hover:text-neutral-900 transition-colors">
              {isAr ? 'المشاريع' : 'Portfolio'}
            </Link>
            <Link to="/contact" className="hover:text-neutral-900 transition-colors">
              {isAr ? 'اتصل بنا' : 'Contact'}
            </Link>
            <button
              onClick={onOpenBuyerGuide}
              className="hover:text-neutral-900 transition-colors cursor-pointer"
            >
              {isAr ? 'حقوق التملك' : 'Ownership Rights'}
            </button>
            <Link to="/#vision2030" className="hover:text-neutral-900 transition-colors">
              {isAr ? 'رؤية 2030' : 'Vision 2030'}
            </Link>
            <Link to="/#faq" className="hover:text-neutral-900 transition-colors">
              {isAr ? 'الأنظمة' : 'Legal & FAQ'}
            </Link>
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

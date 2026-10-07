import React, { useState } from 'react';
import Link from 'next/link';
import { Currency, Language } from '../../types';
import { Globe, ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import { CURRENCY_RATES } from '../../data/websiteContent';

interface NavbarProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  onOpenPrivateOffice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  setCurrency,
  language,
  setLanguage,
  onOpenPrivateOffice,
}) => {
  const [currencyDropdown, setCurrencyDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAr = language === 'ar';

  const navLinks = [
    { href: '/#properties', label: isAr ? 'المشاريع' : 'FEATURED' },
    { href: '/#properties', label: isAr ? 'الصندوق' : 'THE VAULT' },
    { href: '/#properties', label: isAr ? 'النقابة' : 'SYNDICATE' },
    { href: '/#private-advisory', label: isAr ? 'الاستشارات الخاصة' : 'PRIVATE ADVISORY' },
    { href: '/about', label: isAr ? 'من نحن' : 'ABOUT' },
    { href: '/contact', label: isAr ? 'اتصل بنا' : 'CONTACT' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Clean Editorial Brand Mark */}
        <Link
          href="/"
          className="flex flex-col group focus:outline-none"
          aria-label="Najm Estates KSA"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.12em] font-normal text-[#0C3826] leading-none">
              NAJM ESTATES
            </span>
            <span className="text-[10px] tracking-[0.2em] font-sans text-[#A98950] font-medium">
              KSA
            </span>
          </div>
          <span className="text-[9px] tracking-[0.3em] text-neutral-500 uppercase mt-1">
            {isAr ? 'المملكة العربية السعودية' : 'KINGDOM OF SAUDI ARABIA'}
          </span>
        </Link>

        {/* Zone 2: Minimalist Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="hover:text-[#0C3826] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-[1px] after:bg-[#0C3826] after:absolute after:bottom-0 after:left-0 after:transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Actions (Language, Currency, FAL License Box) */}
        <div className="flex items-center gap-3">
          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdown(!currencyDropdown)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-mono text-neutral-700 border border-neutral-200 hover:border-neutral-400 transition-colors cursor-pointer"
              aria-label="Select currency"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {currencyDropdown && (
              <div
                className="absolute right-0 mt-1 w-28 bg-white border border-neutral-200 shadow-xl py-1 z-50 text-xs font-mono"
                onClick={() => setCurrencyDropdown(false)}
              >
                {(Object.keys(CURRENCY_RATES) as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-neutral-50 hover:text-[#0C3826] transition-colors flex items-center justify-between ${
                      currency === c ? 'text-[#0C3826] bg-neutral-100 font-semibold' : 'text-neutral-600'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[10px] text-neutral-400">{CURRENCY_RATES[c].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-2.5 py-1 text-xs text-neutral-700 hover:text-[#0C3826] transition-colors cursor-pointer font-serif"
            aria-label="Toggle language"
          >
            {language === 'en' ? 'العربية' : 'EN'}
          </button>

          {/* FAL License Box Button */}
          <button
            onClick={onOpenPrivateOffice}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-mono tracking-wider text-neutral-800 border border-neutral-300 hover:border-[#0C3826] hover:text-[#0C3826] transition-colors cursor-pointer"
          >
            <span>FAL #1200034988</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-[#0C3826] focus:outline-none"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-6 space-y-4">
          <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.2em] font-medium text-neutral-700">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#0C3826] transition-colors py-1 border-b border-neutral-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrivateOffice();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-[0.2em] font-medium text-white bg-[#0C3826] hover:bg-[#092B1D] transition-colors"
            >
              <span>{isAr ? 'حجز جلسة خاصة' : 'Private Advisory'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

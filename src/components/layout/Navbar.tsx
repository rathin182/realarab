'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Currency, Language } from '../../types';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import { CURRENCY_RATES } from '../../data/websiteContent';
import AuthHomeButtons from '@/components/auth-home-buttons';

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
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const useTransparentStyle = pathname === '/' && !isScrolled;
  const isAr = language === 'ar';

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const navLinks = [
    { href: '/', label: isAr ? 'الصفحة الرئيسية' : 'Home Page' },
    { href: '/properties', label: isAr ? 'ملكيات' : 'Properties' },
    { href: '/about', label: isAr ? 'معلومات عنا' : 'About Us' },
    { href: '/Knowledge', label: isAr ? 'معرفة' : 'Knowledge' },
    { href: '/contact', label: isAr ? 'اتصل بنا' : 'Contact Us' },
  ];

  const actionText = useTransparentStyle
    ? '[&_button]:text-white [&_button]:border-white/50'
    : '';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b font-sans transition-all duration-300 ${
        useTransparentStyle
          ? 'border-transparent bg-transparent'
          : 'border-neutral-200 bg-white/95 shadow-sm backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex min-h-20 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 flex-col focus:outline-none"
          aria-label="Najm Estates KSA"
        >
          <span className="flex items-baseline gap-2">
            <span
              className={`font-serif text-lg font-normal leading-none tracking-[0.1em] sm:text-2xl ${
                useTransparentStyle ? 'text-white' : 'text-[#0C3826]'
              }`}
            >
              NAJM ESTATES
            </span>
            <span className="font-sans text-[9px] font-medium tracking-[0.18em] text-[#A98950] sm:text-[10px]">
              KSA
            </span>
          </span>

          <span
            className={`mt-1 text-[8px] uppercase tracking-[0.2em] sm:text-[9px] sm:tracking-[0.28em] ${
              useTransparentStyle ? 'text-white/80' : 'text-neutral-500'
            }`}
          >
            {isAr
              ? 'المملكة العربية السعودية'
              : 'KINGDOM OF SAUDI ARABIA'}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className={`hidden items-center gap-5 text-[10px] font-medium uppercase tracking-[0.14em] xl:flex 2xl:gap-7 ${
            useTransparentStyle ? 'text-white' : 'text-neutral-600'
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative whitespace-nowrap py-2 transition-colors hover:text-[#A98950] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#A98950] after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Currency, language, authentication and mobile menu */}
        <div className={`flex shrink-0 items-center gap-2 sm:gap-3 ${actionText}`}>
          {/* Currency */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setCurrencyDropdown((open) => !open)}
              aria-expanded={currencyDropdown}
              aria-label="Select currency"
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs transition-colors ${
                useTransparentStyle
                  ? 'border-white/40 text-white hover:bg-white/10'
                  : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
              }`}
            >
              {currency}
              <ChevronDown className="h-3 w-3" />
            </button>

            {currencyDropdown && (
              <div className="absolute right-0 top-full z-[60] mt-2 w-28 rounded-md border border-neutral-200 bg-white py-1 text-xs shadow-xl">
                {(Object.keys(CURRENCY_RATES) as Currency[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdown(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-neutral-50 ${
                      currency === c
                        ? 'bg-neutral-100 font-semibold text-[#0C3826]'
                        : 'text-neutral-600'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[10px] text-neutral-400">
                      {CURRENCY_RATES[c].symbol}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language */}
          <button
            type="button"
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            className={`whitespace-nowrap rounded-md px-2 py-2 text-xs transition-colors hover:text-[#A98950] ${
              useTransparentStyle ? 'text-white' : 'text-neutral-700'
            }`}
            aria-label="Toggle language"
          >
            {isAr ? 'EN' : 'العربية'}
          </button>

          {/* Login/Register or signed-in dashboard */}
          <div className="[&_a]:whitespace-nowrap [&_a]:rounded-md [&_a]:px-3 [&_a]:py-2 [&_a]:text-xs [&_a]:transition-colors sm:[&_a]:px-4 sm:[&_a]:py-2.5 sm:[&_a]:text-sm">
            <AuthHomeButtons />
          </div>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`rounded-md p-2 xl:hidden ${
              useTransparentStyle
                ? 'text-white hover:bg-white/10'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-neutral-200 bg-white px-5 py-5 shadow-lg xl:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-neutral-100 py-3 text-xs font-medium uppercase tracking-[0.15em] text-neutral-700 transition-colors hover:text-[#0C3826]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPrivateOffice();
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#0C3826] px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#092B1D]"
          >
            <span>{isAr ? 'حجز جلسة خاصة' : 'Private Advisory'}</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </header>
  );
};

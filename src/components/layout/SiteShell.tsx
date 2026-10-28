'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Currency, Language } from '../../types';
import { Navbar } from './Navbar';
import { LanguageContext } from '../providers/LanguageContext';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [language, setLanguage] = useState<Language>('en');
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  // /user/* renders its own dashboard shell (sidebar), so skip the marketing navbar.
  const isUserArea = pathname?.startsWith('/user') ?? false;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  if (isUserArea) {
    return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        onOpenPrivateOffice={() => {
          if (window.location.pathname !== '/') {
            window.location.href = '/#private-advisory';
            return;
          }
          document.getElementById('private-advisory')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      <div className={isHomePage ? '' : 'pt-20'}>{children}</div>
    </LanguageContext.Provider>
  );
}
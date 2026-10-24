'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Currency, Language } from '../../types';
import { Navbar } from './Navbar';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [language, setLanguage] = useState<Language>('en');
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  // /user/* renders its own dashboard shell (sidebar), so skip the marketing navbar.
  const isUserArea = pathname?.startsWith('/user') ?? false;

  if (isUserArea) return <>{children}</>;

  return (
    <>
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
    </>
  );
}
'use client';
import React, { useState, useEffect } from 'react';
import { Currency, Language, Property, TransactionFilter } from './types';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { Vision2030Section } from './components/sections/Vision2030Section';
import { FinancialAtelierSection } from './components/sections/FinancialAtelierSection';
import { LegalFAQSection } from './components/sections/LegalFAQSection';
import { PrivateOfficeSection } from './components/sections/PrivateOfficeSection';
import { BuyerGuideModal } from './components/modals/BuyerGuideModal';
import { PropertyDossierModal } from './components/modals/PropertyDossierModal';


export default function App() {
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [language, setLanguage] = useState<Language>('en');

  // Shared Filters
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPropertyType, setSelectedPropertyType] =
    useState<string>('all');
  const [priceRange, setPriceRange] = useState<{
    min: string;
    max: string;
  }>({ min: '', max: '' });

  // Modals
  const [isBuyerGuideOpen, setIsBuyerGuideOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<Property | null>(null);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const scrollToPrivateAdvisory = () => {
    const el = document.getElementById('private-advisory');

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-[#0C3826]/10 selection:text-[#0C3826]">
      <main className="flex-1">
        {/* Editorial Architectural Hero */}
        <HeroSection
          language={language}
          onOpenBuyerGuide={() => setIsBuyerGuideOpen(true)}
          onSearch={({ city, propertyType, minPrice, maxPrice }) => {
            setSelectedCity(city || 'all');
            setSelectedPropertyType(propertyType || 'all');
            setPriceRange({ min: minPrice, max: maxPrice });

            document
              .getElementById('properties')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Featured Projects & Portfolio */}
        <PortfolioSection
          currency={currency}
          language={language}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPropertyType={selectedPropertyType}
          priceRange={priceRange}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onInquireProperty={(prop) => setSelectedProperty(prop)}
        />

        {/* Methodology + Sovereign Giga Projects */}
        <Vision2030Section
          language={language}
          onOpenPrivateOffice={scrollToPrivateAdvisory}
        />

        {/* Regulatory FAQ */}
        <LegalFAQSection
          language={language}
          onOpenPrivateOffice={scrollToPrivateAdvisory}
        />

        {/* Financial Atelier & Sharia Modeling */}
        <FinancialAtelierSection
          currency={currency}
          language={language}
        />

        {/* Private Advisory Session */}
        <PrivateOfficeSection language={language} />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenPrivateOffice={scrollToPrivateAdvisory}
        onOpenBuyerGuide={() => setIsBuyerGuideOpen(true)}
      />

      {/* Modals */}
      <BuyerGuideModal
        isOpen={isBuyerGuideOpen}
        onClose={() => setIsBuyerGuideOpen(false)}
        language={language}
        onConsultCounsel={scrollToPrivateAdvisory}
      />

      <PropertyDossierModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        currency={currency}
        language={language}
      />
    </div>
  );
}

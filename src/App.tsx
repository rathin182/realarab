import React, { useState, useEffect } from 'react';
import { Currency, Language, Property, TeamMember, TransactionType } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { Vision2030Section } from './components/sections/Vision2030Section';
import { FinancialAtelierSection } from './components/sections/FinancialAtelierSection';
import { LegalFAQSection } from './components/sections/LegalFAQSection';
import { TeamSection } from './components/sections/TeamSection';
import { PrivateOfficeSection } from './components/sections/PrivateOfficeSection';
import { BuyerGuideModal } from './components/modals/BuyerGuideModal';
import { PropertyDossierModal } from './components/modals/PropertyDossierModal';
import { TeamDossierModal } from './components/modals/TeamDossierModal';

export default function App() {
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [language, setLanguage] = useState<Language>('en');

  // Shared Filters
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionType>('buy');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isBuyerGuideOpen, setIsBuyerGuideOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);

  // Sync RTL and lang attribute
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const scrollToPortfolio = () => {
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPrivateAdvisory = () => {
    const el = document.getElementById('private-advisory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-[#0C3826]/10 selection:text-[#0C3826]">
      {/* 3-Zone Minimalist Navigation */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        onOpenPrivateOffice={scrollToPrivateAdvisory}
      />

      <main className="flex-1">
        {/* Editorial Architectural Hero (Reference Image 5 & 14) */}
        <HeroSection
          language={language}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={scrollToPortfolio}
          onOpenBuyerGuide={() => setIsBuyerGuideOpen(true)}
        />

        {/* Featured Projects & Portfolio (Reference Image 6) */}
        <PortfolioSection
          currency={currency}
          language={language}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedTransaction={selectedTransaction}
          setSelectedTransaction={setSelectedTransaction}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onInquireProperty={(prop) => setSelectedProperty(prop)}
        />

        {/* Methodology + Sovereign Giga Projects (Reference Image 7) */}
        <Vision2030Section
          language={language}
          onOpenPrivateOffice={scrollToPrivateAdvisory}
        />

        {/* Financial Atelier & Sharia Modeling (Reference Image 8) */}
        <FinancialAtelierSection
          currency={currency}
          language={language}
        />

        {/* Leadership & Sovereign Management (Reference Image 9) */}
        <TeamSection
          language={language}
          onSelectMember={(member) => setSelectedTeamMember(member)}
        />

        {/* Regulatory FAQ (Reference Image 10) */}
        <LegalFAQSection
          language={language}
          onOpenPrivateOffice={scrollToPrivateAdvisory}
        />

        {/* Private Advisory Session (Reference Image 11) */}
        <PrivateOfficeSection language={language} />
      </main>

      {/* Sovereign Minimalist Footer (Reference Image 11) */}
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

      <TeamDossierModal
        member={selectedTeamMember}
        onClose={() => setSelectedTeamMember(null)}
        language={language}
      />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { TEAM, MEGA_PROJECTS } from '../../data/websiteContent';
import {
  ShieldCheck,
  Building2,
  Compass,
  ArrowRight,
  Award,
  Globe2,
  Scale,
  Users,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Najm Estates KSA | Sovereign Real Estate & Advisory',
  description:
    'Learn about Najm Estates KSA, our leadership, FAL Brokerage certification #1200034988, and our sovereign advisory across Riyadh, Makkah, Madinah, and Vision 2030 giga-projects.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#141A17] font-sans selection:bg-[#0C3826]/10 selection:text-[#0C3826]">
      {/* Editorial Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2 group">
            <span className="font-serif text-xl sm:text-2xl tracking-[0.12em] font-normal text-[#0C3826]">
              NAJM ESTATES
            </span>
            <span className="text-[10px] tracking-[0.2em] font-sans text-[#A98950] font-medium">
              KSA
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-neutral-600">
            <Link href="/#properties" className="hover:text-[#0C3826] transition-colors">
              FEATURED
            </Link>
            <Link href="/#properties" className="hover:text-[#0C3826] transition-colors">
              THE VAULT
            </Link>
            <Link href="/#properties" className="hover:text-[#0C3826] transition-colors">
              SYNDICATE
            </Link>
            <Link href="/#private-advisory" className="hover:text-[#0C3826] transition-colors">
              PRIVATE ADVISORY
            </Link>
            <Link href="/about" className="text-[#0C3826] font-semibold border-b border-[#0C3826] pb-0.5">
              ABOUT
            </Link>
            <Link href="/contact" className="hover:text-[#0C3826] transition-colors">
              CONTACT
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-mono tracking-wider text-neutral-800 border border-neutral-300 hover:border-[#0C3826] hover:text-[#0C3826] transition-colors"
            >
              <span>FAL #1200034988</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Kicker & Main Headline */}
        <div className="max-w-4xl mb-16">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#A98950] font-mono block mb-4">
            SOVEREIGN ADVISORY · FAL BROKERAGE #1200034988
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-[#0C3826] font-light leading-[0.95] uppercase mb-8">
            Your Star In Saudi Real Estate.
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 font-light leading-relaxed">
            Najm Estates KSA was established to provide institutional funds, sovereign entities, and distinguished family offices seamless access to the Kingdom of Saudi Arabia’s most consequential architectural and land acquisitions.
          </p>
        </div>

        {/* Narrative & Institutional Heritage (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 border-t border-b border-neutral-200 mb-20">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
              01. The Sovereign Mandate
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0C3826] font-light leading-snug">
              Bridging Vision 2030 Megaprojects With Enduring Capital.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-neutral-700 text-sm sm:text-base leading-relaxed font-light">
            <p>
              As the Kingdom of Saudi Arabia undergoes the most ambitious architectural and economic transformation in modern history, private capital requires elevated intelligence and impeccable legal execution. Headquartered in Riyadh with international advisory desks, Najm Estates bridges global investors with sovereign off-market allocations.
            </p>
            <p>
              Our portfolio spans UNESCO-adjacent heritage palaces in <strong>Diriyah Gate</strong>, iconic sky penthouses in <strong>New Murabba (The Mukaab)</strong>, private island retreats along the <strong>Red Sea</strong>, and sacred hospitality assets in <strong>Makkah & Madinah</strong>.
            </p>
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs text-neutral-600">
              <div className="p-4 bg-neutral-50 border border-neutral-200">
                <span className="text-[#0C3826] font-bold text-lg block">100%</span>
                <span>REGA & Wafi Compliant</span>
              </div>
              <div className="p-4 bg-neutral-50 border border-neutral-200">
                <span className="text-[#0C3826] font-bold text-lg block">4M+ SAR</span>
                <span>Golden Visa Eligibility</span>
              </div>
              <div className="p-4 bg-neutral-50 border border-neutral-200">
                <span className="text-[#0C3826] font-bold text-lg block">Strict NDA</span>
                <span>Bilateral Discretion</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="mb-24">
          <div className="mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A98950] block mb-2">
              PILLARS OF EXCELLENCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0C3826] font-light">
              Our Sovereign Advisory Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 border border-neutral-200 hover:border-[#0C3826] transition-colors space-y-4 bg-white">
              <Compass className="w-6 h-6 text-[#A98950]" />
              <h3 className="font-serif text-xl text-[#0C3826]">Sovereign Land Allocations</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Direct access to high-value off-market residential plots, commercial masterminds, and government-adjacent development corridors across Riyadh.
              </p>
            </div>

            <div className="p-8 border border-neutral-200 hover:border-[#0C3826] transition-colors space-y-4 bg-white">
              <Scale className="w-6 h-6 text-[#A98950]" />
              <h3 className="font-serif text-xl text-[#0C3826]">Sharia-Compliant Structures</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                End-to-end SAMA Murabaha modeling, Wafi escrow contract guarantees, and 99-year Usufruct deed structuring for Holy Cities.
              </p>
            </div>

            <div className="p-8 border border-neutral-200 hover:border-[#0C3826] transition-colors space-y-4 bg-white">
              <ShieldCheck className="w-6 h-6 text-[#A98950]" />
              <h3 className="font-serif text-xl text-[#0C3826]">Bilateral Confidentiality</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Every transaction, investor portfolio, and family office mandate is executed under bilateral non-disclosure agreements with direct principal representation.
              </p>
            </div>

            <div className="p-8 border border-neutral-200 hover:border-[#0C3826] transition-colors space-y-4 bg-white">
              <Globe2 className="w-6 h-6 text-[#A98950]" />
              <h3 className="font-serif text-xl text-[#0C3826]">Dual Sovereign Salons</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Dedicated private consulting desks located in Riyadh’s financial heart and Hyderabad’s high-tech corridor for global investor synergy.
              </p>
            </div>
          </div>
        </div>

        {/* Executive Leadership Team */}
        <div className="mb-24">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A98950] block mb-2">
                EXECUTIVE GOVERNANCE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0C3826] font-light">
                Leadership & Senior Counsel
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              LICENSED UNDER FAL BROKERAGE #1200034988
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-neutral-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 text-[9px] font-mono uppercase bg-white/95 px-2 py-0.5 border border-neutral-200 text-[#0C3826]">
                      {member.license}
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#A98950] block mb-1">
                      {member.role}
                    </span>
                    <h3 className="font-serif text-xl text-[#0C3826] font-normal mb-1">
                      {member.name}
                    </h3>
                    <div className="text-xs font-arabic text-neutral-500 mb-3">
                      {member.nameAr}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4">
                      {member.personalMessage}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-neutral-100 mt-2">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Direct Contact:
                  </span>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-xs font-mono text-[#0C3826] hover:text-[#A98950] block truncate"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="bg-[#0C3826] text-white p-8 sm:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A98950]">
              CONFIDENTIAL ENGAGEMENT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light">
              Schedule a Private Consultation With Our Counsel.
            </h2>
            <p className="text-sm text-neutral-300 font-light leading-relaxed">
              Whether you are structuring a single palace acquisition or orchestrating multi-asset syndicate development, our executive directors are available for confidential salon discussions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="bg-white hover:bg-neutral-100 text-[#0C3826] text-xs font-mono uppercase tracking-widest px-8 py-4 text-center transition-colors font-semibold"
            >
              Contact Private Office
            </Link>
            <Link
              href="/#properties"
              className="border border-white/40 hover:border-white text-white text-xs font-mono uppercase tracking-widest px-8 py-4 text-center transition-colors"
            >
              Explore Portfolio
            </Link>
          </div>
        </div>
      </main>

      {/* Global Minimalist Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-baseline justify-between gap-6">
          <div className="space-y-1">
            <span className="font-serif text-lg tracking-[0.1em] text-[#0C3826] block">
              NAJM ESTATES KSA
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase block">
              FAL BROKERAGE REGISTRATION #1200034988
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400">
            © 2026 NAJM ESTATES & DEVELOPMENT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}

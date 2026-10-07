'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Send,
  CheckCircle2,
  Lock,
  Clock,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    investorType: 'Family Office',
    allocationTier: '30M - 100M SAR',
    region: 'Riyadh Core',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            <Link href="/about" className="hover:text-[#0C3826] transition-colors">
              ABOUT
            </Link>
            <Link href="/contact" className="text-[#0C3826] font-semibold border-b border-[#0C3826] pb-0.5">
              CONTACT
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-mono tracking-wider text-neutral-800 border border-neutral-300">
              <span>FAL #1200034988</span>
            </div>
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest bg-[#0C3826] hover:bg-[#08281B] text-white px-4 py-2 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header Kicker & Headline */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#A98950] font-mono block mb-4">
            BILATERAL DISCRETION · STRICT CONFIDENTIALITY
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-[#0C3826] font-light leading-[0.95] uppercase mb-6">
            Private Office & Global Salons.
          </h1>
          <p className="text-lg text-neutral-600 font-light leading-relaxed">
            Direct access to our senior partners in Riyadh and international client salons. All consultations are governed by bilateral non-disclosure protocols.
          </p>
        </div>

        {/* 2-Column: Global Salons on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column (5 cols): Dual Salons & Concierge Protocol */}
          <div className="lg:col-span-5 space-y-8">
            {/* Riyadh Sovereign HQ Card */}
            <div className="p-8 border border-neutral-300 bg-neutral-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A98950]">
                  KINGDOM HEADQUARTERS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0C3826] text-white">
                  FAL #1200034988
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#0C3826] font-normal">
                Riyadh Sovereign HQ
              </h3>

              <div className="space-y-3 text-xs text-neutral-600 font-light pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#A98950] shrink-0 mt-0.5" />
                  <span>King Fahd Road, Al Olaya Financial District, Riyadh 12214, Kingdom of Saudi Arabia</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#A98950] shrink-0" />
                  <a href="tel:+966114567890" className="hover:text-[#0C3826] font-mono">
                    +966 11 456 7890 / +966 50 123 4567
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#A98950] shrink-0" />
                  <a href="mailto:riyadh@najmestates.sa" className="hover:text-[#0C3826] font-mono">
                    riyadh@najmestates.sa
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Visiting Hours:</span>
                <span>Sun – Thu, 09:00 – 18:00 AST</span>
              </div>
            </div>

            {/* Hyderabad International Hub Card */}
            <div className="p-8 border border-neutral-200 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A98950]">
                  INTERNATIONAL HUB
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 border border-neutral-300 text-neutral-600">
                  GLOBAL SALON
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#0C3826] font-normal">
                Hyderabad International Hub
              </h3>

              <div className="space-y-3 text-xs text-neutral-600 font-light pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#A98950] shrink-0 mt-0.5" />
                  <span>Jubilee Hills / HITEC Corridor, Hyderabad, Telangana 500033, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#A98950] shrink-0" />
                  <a href="tel:+914067890123" className="hover:text-[#0C3826] font-mono">
                    +91 40 6789 0123 / +91 98 7654 3210
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#A98950] shrink-0" />
                  <a href="mailto:hyderabad@najmestates.sa" className="hover:text-[#0C3826] font-mono">
                    hyderabad@najmestates.sa
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>Visiting Hours:</span>
                <span>Mon – Sat, 10:00 – 19:00 IST</span>
              </div>
            </div>

            {/* Confidentiality Notice */}
            <div className="p-6 border border-neutral-200 bg-neutral-50 flex items-start gap-4">
              <Lock className="w-5 h-5 text-[#A98950] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-mono uppercase font-bold text-[#0C3826] block">
                  Bilateral NDA Standard
                </span>
                <p className="text-neutral-600 leading-relaxed font-light">
                  Prior to sharing unlisted inventory or sovereign palace allocations, a mutual non-disclosure agreement is executed to safeguard identity, pricing mandates, and ownership structures.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Interactive Private Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="border border-neutral-300 p-8 sm:p-12 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#A98950]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0C3826] font-semibold">
                  CONFIDENTIAL INQUIRY DOSSIER
                </span>
              </div>

              <h2 className="font-serif text-3xl text-[#0C3826] font-light mb-3">
                Register Your Acquisition Mandate
              </h2>
              <p className="text-xs text-neutral-500 font-light leading-relaxed mb-8">
                Please provide your transaction parameters. A senior partner will contact you directly within two business hours.
              </p>

              {submitted ? (
                <div className="py-12 px-6 bg-[#0C3826]/5 border border-[#0C3826]/20 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#0C3826] mx-auto" />
                  <h3 className="font-serif text-2xl text-[#0C3826]">
                    Mandate Received & Encrypted
                  </h3>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name || 'Valued Partner'}. Your inquiry regarding{' '}
                    <span className="font-semibold text-[#0C3826]">{formData.region}</span> has been routed to our Managing Partner. You will receive an encrypted brief shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono uppercase tracking-wider text-[#0C3826] underline hover:text-[#A98950] pt-4"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="H.E. Sheikh / Investor Name"
                        className="w-full text-xs p-3.5 border border-neutral-200 focus:border-[#0C3826] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        Institutional Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="principal@familyoffice.sa"
                        className="w-full text-xs p-3.5 border border-neutral-200 focus:border-[#0C3826] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        Direct Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+966 50 000 0000"
                        className="w-full text-xs p-3.5 border border-neutral-200 focus:border-[#0C3826] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        Investor Profile *
                      </label>
                      <select
                        value={formData.investorType}
                        onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                        className="w-full text-xs p-3.5 border border-neutral-200 focus:border-[#0C3826] focus:outline-none bg-white transition-colors"
                      >
                        <option value="Family Office">Single / Multi Family Office</option>
                        <option value="Sovereign Institutional">Sovereign / Institutional Fund</option>
                        <option value="Ultra HNW">Ultra High Net Worth Individual</option>
                        <option value="Expat Resident">Expat Resident / Premium Residency</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        Capital Allocation Tier
                      </label>
                      <select
                        value={formData.allocationTier}
                        onChange={(e) => setFormData({ ...formData, allocationTier: e.target.value })}
                        className="w-full text-xs p-3.5 border border-neutral-200 focus:border-[#0C3826] focus:outline-none bg-white transition-colors"
                      >
                        <option value="Under 10M SAR">Under 10,000,000 SAR</option>
                        <option value="10M - 30M SAR">10,000,000 – 30,000,000 SAR</option>
                        <option value="30M - 100M SAR">30,000,000 – 100,000,000 SAR</option>
                        <option value="100M+ SAR">100,000,000+ SAR (Sovereign)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                        Target Acquisition Corridor
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full text-xs p-3.5 border border-neutral-200 focus:border-[#0C3826] focus:outline-none bg-white transition-colors"
                      >
                        <option value="Riyadh Core">Riyadh Core (New Murabba / KAFD)</option>
                        <option value="Diriyah Gate">Diriyah Gate & Wadi Safar</option>
                        <option value="Holy Cities">Makkah & Madinah (Usufruct)</option>
                        <option value="Red Sea & NEOM">Red Sea Global & NEOM (Sindalah)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      Mandate Overview & Specific Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Outline target square meters, architectural preferences, or syndicate requirements..."
                      className="w-full text-xs p-3.5 border border-neutral-200 focus:border-[#0C3826] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0C3826] hover:bg-[#08281B] text-white text-xs font-mono uppercase tracking-widest py-4 transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Confidential Mandate</span>
                  </button>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2">
                    <span>FAL Brokerage Registration #1200034988</span>
                    <span>Direct Encryption</span>
                  </div>
                </form>
              )}
            </div>
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

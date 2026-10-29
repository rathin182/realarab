
"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { DEFAULT_CONTACT_CARDS, type ContactCard } from "@/lib/contact-settings";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [contactCards, setContactCards] = useState<ContactCard[]>(DEFAULT_CONTACT_CARDS);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    investorType: "Family Office",
    allocationTier: "30M - 100M SAR",
    region: "Riyadh Core",
    message: "",
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/contact-settings")
      .then((response) => {

        if (!response.ok) throw new Error('Could not load contact settings');
        return response.json() as Promise<ContactCard[]>;
      })
      .then((cards) => {
        if (!cancelled) setContactCards(cards);
      })
      .catch(() => {
        // Keep the default contact settings if loading fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);
    const hasManyContactCards = contactCards.length > 2;
    
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();


    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/mandates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source: "contact-page",
        }),
      });

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit your request. Please try again.",
        );
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#141A17] selection:bg-[#0C3826]/10 selection:text-[#0C3826]">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#A98950]">
            BILATERAL DISCRETION · STRICT CONFIDENTIALITY
          </span>

          <h1 className="mb-6 font-serif text-5xl font-light uppercase leading-[0.95] text-[#0C3826] sm:text-7xl lg:text-8xl">
            Private Office &amp; Global Salons.
          </h1>

          <p className="text-lg font-light leading-relaxed text-neutral-600">
            Direct access to our senior partners in Riyadh and international
            client salons. All consultations are governed by bilateral
            non-disclosure protocols.
          </p>
        </div>


        {/* 2-Column: Global Salons on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column (5 cols): Contact Cards & Concierge Protocol */}
          <div className={`lg:col-span-5 ${hasManyContactCards ? 'grid grid-cols-1 content-start gap-4 sm:grid-cols-2' : 'space-y-8'}`}>
            {contactCards.map((card, index) => {
              const phone = card.phonePrimary || card.phoneSecondary;
              return <div key={card.id} className={`min-w-0 space-y-4 border ${hasManyContactCards ? 'p-5' : 'p-8'} ${index === 0 ? 'border-neutral-300 bg-neutral-50/50' : 'border-neutral-200 bg-white'}`}>
                {(card.label || card.badge) && <div className="flex flex-wrap items-center justify-between gap-2">
                  {card.label && <span className="text-[10px] font-mono uppercase tracking-widest text-[#A98950]">{card.label}</span>}
                  {card.badge && <span className="text-[10px] font-mono px-2 py-0.5 border border-neutral-300 text-neutral-600">{card.badge}</span>}
                </div>}
                {card.title && <h3 className="break-words font-serif text-2xl text-[#0C3826] font-normal">{card.title}</h3>}
                <div className="space-y-3 text-xs text-neutral-600 font-light pt-2">
                  {card.address && <div className="flex min-w-0 items-start gap-3"><MapPin className="w-4 h-4 text-[#A98950] shrink-0 mt-0.5" /><span className="min-w-0 break-words">{card.address}</span></div>}
                  {(card.phonePrimary || card.phoneSecondary) && <div className="flex min-w-0 items-start gap-3"><Phone className="w-4 h-4 text-[#A98950] shrink-0" /><a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="min-w-0 break-all font-mono hover:text-[#0C3826]">{[card.phonePrimary, card.phoneSecondary].filter(Boolean).join(' / ')}</a></div>}
                  {card.email && <div className="flex min-w-0 items-start gap-3"><Mail className="w-4 h-4 text-[#A98950] shrink-0" /><a href={`mailto:${card.email}`} className="min-w-0 break-all font-mono hover:text-[#0C3826]">{card.email}</a></div>}
                </div>
                {card.visitingHours && <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-[11px] font-mono text-neutral-500"><span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />Visiting Hours:</span><span className="break-words">{card.visitingHours}</span></div>}
              </div>;
            })}

            {/* Confidentiality Notice */}
            <div className={`p-6 border border-neutral-200 bg-neutral-50 flex items-start gap-4 ${hasManyContactCards ? 'sm:col-span-2' : ''}`}>
              <Lock className="w-5 h-5 text-[#A98950] shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="block font-mono font-bold uppercase text-[#0C3826]">
                  Bilateral NDA Standard
                </span>
                <p className="font-light leading-relaxed text-neutral-600">
                  Prior to sharing unlisted inventory or sovereign palace
                  allocations, a mutual non-disclosure agreement is executed
                  to safeguard identity, pricing mandates, and ownership
                  structures.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-neutral-300 bg-white p-8 shadow-sm sm:p-12">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#A98950]" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#0C3826]">
                  CONFIDENTIAL INQUIRY DOSSIER
                </span>
              </div>

              <h2 className="mb-3 font-serif text-3xl font-light text-[#0C3826]">
                Register Your Acquisition Mandate
              </h2>

              <p className="mb-8 text-xs font-light leading-relaxed text-neutral-500">
                Please provide your transaction parameters. A senior partner
                will contact you directly within two business hours.
              </p>

              {submitted ? (
                <div
                  className="space-y-4 border border-[#0C3826]/20 bg-[#0C3826]/5 px-6 py-12 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2 className="mx-auto h-12 w-12 text-[#0C3826]" />

                  <h3 className="font-serif text-2xl text-[#0C3826]">
                    Mandate Received
                  </h3>

                  <p className="mx-auto max-w-md text-xs leading-relaxed text-neutral-600">
                    Thank you, {formData.name || "Valued Partner"}. Your inquiry
                    regarding{" "}
                    <span className="font-semibold text-[#0C3826]">
                      {formData.region}
                    </span>{" "}
                    has been submitted successfully.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setError("");
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        investorType: "Family Office",
                        allocationTier: "30M - 100M SAR",
                        region: "Riyadh Core",
                        message: "",
                      });
                    }}
                    className="pt-4 font-mono text-xs uppercase tracking-wider text-[#0C3826] underline hover:text-[#A98950]"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="mandate-name"
                        className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500"
                      >
                        Full Legal Name *
                      </label>
                      <input
                        id="mandate-name"
                        type="text"
                        required
                        maxLength={150}
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="H.E. Sheikh / Investor Name"
                        className="w-full border border-neutral-200 p-3.5 text-xs transition-colors focus:border-[#0C3826] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mandate-email"
                        className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500"
                      >
                        Institutional Email *
                      </label>
                      <input
                        id="mandate-email"
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="principal@familyoffice.sa"
                        className="w-full border border-neutral-200 p-3.5 text-xs transition-colors focus:border-[#0C3826] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="mandate-phone"
                        className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500"
                      >
                        Direct Phone / WhatsApp *
                      </label>
                      <input
                        id="mandate-phone"
                        type="tel"
                        required
                        maxLength={40}
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+966 50 000 0000"
                        className="w-full border border-neutral-200 p-3.5 text-xs transition-colors focus:border-[#0C3826] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mandate-investor-type"
                        className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500"
                      >
                        Investor Profile *
                      </label>
                      <select
                        id="mandate-investor-type"
                        required
                        value={formData.investorType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            investorType: e.target.value,
                          })
                        }
                        className="w-full border border-neutral-200 bg-white p-3.5 text-xs transition-colors focus:border-[#0C3826] focus:outline-none"
                      >
                        <option value="Family Office">
                          Single / Multi Family Office
                        </option>
                        <option value="Sovereign Institutional">
                          Sovereign / Institutional Fund
                        </option>
                        <option value="Ultra HNW">
                          Ultra High Net Worth Individual
                        </option>
                        <option value="Expat Resident">
                          Expat Resident / Premium Residency
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="mandate-allocation"
                        className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500"
                      >
                        Capital Allocation Tier
                      </label>
                      <select
                        id="mandate-allocation"
                        value={formData.allocationTier}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            allocationTier: e.target.value,
                          })
                        }
                        className="w-full border border-neutral-200 bg-white p-3.5 text-xs transition-colors focus:border-[#0C3826] focus:outline-none"
                      >
                        <option value="Under 10M SAR">
                          Under 10,000,000 SAR
                        </option>
                        <option value="10M - 30M SAR">
                          10,000,000 – 30,000,000 SAR
                        </option>
                        <option value="30M - 100M SAR">
                          30,000,000 – 100,000,000 SAR
                        </option>
                        <option value="100M+ SAR">
                          100,000,000+ SAR (Sovereign)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="mandate-region"
                        className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500"
                      >
                        Target Acquisition Corridor
                      </label>
                      <select
                        id="mandate-region"
                        value={formData.region}
                        onChange={(e) =>
                          setFormData({ ...formData, region: e.target.value })
                        }
                        className="w-full border border-neutral-200 bg-white p-3.5 text-xs transition-colors focus:border-[#0C3826] focus:outline-none"
                      >
                        <option value="Riyadh Core">
                          Riyadh Core (New Murabba / KAFD)
                        </option>
                        <option value="Diriyah Gate">
                          Diriyah Gate &amp; Wadi Safar
                        </option>
                        <option value="Holy Cities">
                          Makkah &amp; Madinah (Usufruct)
                        </option>
                        <option value="Red Sea & NEOM">
                          Red Sea Global &amp; NEOM (Sindalah)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mandate-message"
                      className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-neutral-500"
                    >
                      Mandate Overview &amp; Specific Requirements
                    </label>
                    <textarea
                      id="mandate-message"
                      rows={4}
                      maxLength={5000}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Outline target square meters, architectural preferences, or syndicate requirements..."
                      className="w-full border border-neutral-200 p-3.5 text-xs transition-colors focus:border-[#0C3826] focus:outline-none"
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 bg-[#0C3826] py-4 font-mono text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#08281B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>
                      {submitting
                        ? "Submitting..."
                        : "Submit Confidential Mandate"}
                    </span>
                  </button>


                  <div className="flex items-center justify-end text-[10px] font-mono text-neutral-400 pt-2">
                    <span>Direct Encryption</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white py-12 text-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-baseline justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="space-y-1">
            <span className="block font-serif text-lg tracking-[0.1em] text-[#0C3826]">
              NAJM ESTATES KSA
            </span>

          </div>

          <div className="font-mono text-[11px] text-neutral-400">
            © 2026 NAJM ESTATES &amp; DEVELOPMENT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}

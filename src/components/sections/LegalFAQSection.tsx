
import React, { useState, useMemo } from "react";
import { Language } from "../../types";
import { FAQS } from "../../data/websiteContent";
import {
  Plus,
  Minus,
  ShieldCheck,
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LegalFAQSectionProps {
  language: Language;
  onOpenPrivateOffice: () => void;
}

export const LegalFAQSection: React.FC<LegalFAQSectionProps> = ({
  language,
  onOpenPrivateOffice,
}) => {
  const isAr = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    investorType: "Family Office",
    allocationTier: "30M - 100M SAR",
    region: "Riyadh Core",
    message: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
          source: "home-faq",
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

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;

    const query = searchQuery.toLowerCase();

    return FAQS.filter(
      (faq) =>
        faq.q.toLowerCase().includes(query) ||
        faq.qAr.includes(searchQuery.trim()) ||
        faq.a.toLowerCase().includes(query) ||
        faq.aAr.includes(searchQuery.trim()),
    );
  }, [searchQuery]);

  return (
    <section
      id="faq"
      className="border-t border-neutral-200 bg-white py-20 font-sans"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-[110rem] px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          {/* FAQ column */}
          <div className="min-w-0 pt-0 lg:pt-[3.55rem]">
            <div className="mb-6 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={
                  isAr
                    ? "البحث في الأنظمة، الضرائب، التملك..."
                    : "Ownership, financing, taxes..."
                }
                aria-label={isAr ? "البحث في الأسئلة" : "Search FAQs"}
                className="w-full border-b border-neutral-300 pb-2 font-mono text-xs text-neutral-800 placeholder-neutral-400 focus:border-neutral-800 focus:outline-none"
              />
            </div>

            <div className="divide-y divide-neutral-200 border-t border-neutral-200">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedId === faq.id;

                return (
                  <div key={faq.id} className="py-3.5">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : faq.id)
                      }
                      className="group flex w-full cursor-pointer items-start justify-between gap-4 text-start"
                    >
                      <span className="text-[13px] font-normal leading-snug text-neutral-700 transition-colors group-hover:text-[#0C3826] sm:text-sm">
                        {isAr ? faq.qAr : faq.q}
                      </span>

                      <span className="mt-1 shrink-0 text-neutral-400 transition-colors group-hover:text-neutral-900">
                        {isExpanded ? (
                          <Minus className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="max-w-3xl overflow-hidden pt-3 text-xs font-light leading-relaxed text-neutral-600"
                        >
                          <p className="mb-3">
                            {isAr ? faq.aAr : faq.a}
                          </p>

                          <div className="font-mono text-[11px] text-[#A98950]">
                            {faq.reference}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <p className="py-6 text-xs text-neutral-500">
                  {isAr ? "لا توجد نتائج." : "No matching FAQs found."}
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-3 text-[10px] font-light text-neutral-400">
              {isAr
                ? "المعلومات مقدمة من نجم العقارية؛ يجب التحقق من الأهلية القانونية والمعاملة الضريبية والموافقات الحالية بشكل مهني."
                : "Information supplied by Najm Estates; legal eligibility, tax treatment and project approvals require current professional verification under FAL Brokerage Registration #1200034988."}
            </div>
          </div>

          {/* Acquisition mandate form */}
          <div className="min-w-0">
            <div className="border border-neutral-200 bg-[#FBFAF7] p-6 sm:p-8 lg:p-7 xl:p-10">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#A98950]" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0C3826]">
                  {isAr ? "طلب استفسار سري" : "Confidential Inquiry Dossier"}
                </span>
              </div>

              <h2 className="mb-3 font-serif text-2xl font-light text-[#315C49] sm:text-3xl">
                {isAr
                  ? "تسجيل تفويض الاستحواذ"
                  : "Register Your Acquisition Mandate"}
              </h2>

              <p className="mb-7 text-xs font-light leading-relaxed text-neutral-500">
                {isAr
                  ? "يرجى تقديم تفاصيل متطلبات الصفقة. سيتواصل معك أحد الشركاء."
                  : "Please provide your transaction parameters. A senior partner will contact you directly within two business hours."}
              </p>

              {submitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="space-y-4 border border-[#0C3826]/20 bg-[#0C3826]/5 px-5 py-10 text-center"
                >
                  <CheckCircle2 className="mx-auto h-10 w-10 text-[#0C3826]" />

                  <h3 className="font-serif text-2xl text-[#0C3826]">
                    {isAr ? "تم استلام الطلب" : "Mandate Received"}
                  </h3>

                  <p className="mx-auto max-w-md text-xs leading-relaxed text-neutral-600">
                    {isAr ? "شكراً لك، " : "Thank you, "}
                    {formData.name || "Valued Partner"}.{" "}
                    {isAr
                      ? "تم إرسال طلب الاستحواذ الخاص بك بنجاح."
                      : "Your inquiry regarding"}{" "}
                    <span className="font-semibold text-[#0C3826]">
                      {formData.region}
                    </span>{" "}
                    {!isAr && "has been submitted successfully."}
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
                    className="pt-3 font-mono text-xs uppercase tracking-wider text-[#0C3826] underline hover:text-[#A98950]"
                  >
                    {isAr ? "إرسال طلب آخر" : "Submit another inquiry"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      {isAr ? "الاسم الكامل *" : "Full Legal Name *"}
                      <input
                        type="text"
                        required
                        maxLength={150}
                        autoComplete="name"
                        value={formData.name}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            name: event.target.value,
                          })
                        }
                        placeholder="H.E. Sheikh / Investor Name"
                        className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 placeholder:text-neutral-400 focus:border-[#0C3826] focus:outline-none"
                      />
                    </label>

                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      {isAr ? "البريد الإلكتروني *" : "Institutional Email *"}
                      <input
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        value={formData.email}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            email: event.target.value,
                          })
                        }
                        placeholder="principal@familyoffice.sa"
                        className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 placeholder:text-neutral-400 focus:border-[#0C3826] focus:outline-none"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      {isAr ? "رقم الهاتف *" : "Direct Phone / WhatsApp *"}
                      <input
                        type="tel"
                        required
                        maxLength={40}
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            phone: event.target.value,
                          })
                        }
                        placeholder="+966 50 000 0000"
                        className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 placeholder:text-neutral-400 focus:border-[#0C3826] focus:outline-none"
                      />
                    </label>

                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      {isAr ? "نوع المستثمر *" : "Investor Profile *"}
                      <select
                        required
                        value={formData.investorType}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            investorType: event.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 focus:border-[#0C3826] focus:outline-none"
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
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      {isAr ? "حجم الاستثمار" : "Capital Allocation Tier"}
                      <select
                        value={formData.allocationTier}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            allocationTier: event.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 focus:border-[#0C3826] focus:outline-none"
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
                    </label>

                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                      {isAr
                        ? "منطقة الاستحواذ المستهدفة"
                        : "Target Acquisition Corridor"}
                      <select
                        value={formData.region}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            region: event.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 focus:border-[#0C3826] focus:outline-none"
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
                    </label>
                  </div>

                  <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500">
                    {isAr
                      ? "تفاصيل ومتطلبات الاستحواذ"
                      : "Mandate Overview & Specific Requirements"}
                    <textarea
                      rows={4}
                      maxLength={5000}
                      value={formData.message}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          message: event.target.value,
                        })
                      }
                      placeholder="Outline target square meters, architectural preferences, or syndicate requirements..."
                      className="mt-1 block w-full resize-y border border-neutral-200 bg-white p-3.5 font-sans text-xs normal-case tracking-normal text-neutral-800 placeholder:text-neutral-400 focus:border-[#0C3826] focus:outline-none"
                    />
                  </label>

                  {error && (
                    <p
                      role="alert"
                      className="border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 bg-[#0C3826] py-4 font-mono text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#08281B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>
                      {submitting
                        ? isAr
                          ? "جارٍ الإرسال..."
                          : "Submitting..."
                        : isAr
                          ? "إرسال طلب الاستحواذ"
                          : "Submit Confidential Mandate"}
                    </span>
                  </button>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[10px] text-neutral-400">
                    <span>FAL Brokerage Registration #1200034988</span>
                    <span>
                      {isAr ? "استفسار سري" : "Confidential Inquiry"}
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

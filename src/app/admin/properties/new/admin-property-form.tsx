"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteLanguage } from "@/components/providers/LanguageContext";
import { BadgeDollarSign, FileText, House, MapPin, Plus, SlidersHorizontal, Sparkles, Tag, type LucideIcon } from "lucide-react";

const fieldClass = "mt-1.5 h-11 w-full rounded-md border border-[#d8d3c8] bg-white px-3 text-sm outline-none transition-colors focus:border-[#8f7654] focus:ring-2 focus:ring-[#8f7654]/10";
const sections: { id: string; icon: LucideIcon; labels: [string, string]; active: boolean }[] = [
  { id: "basic-information", icon: House, labels: ["Basic Details", "المعلومات الأساسية"], active: true },
  { id: "location", icon: MapPin, labels: ["Location", "الموقع"], active: false },
  { id: "property-details", icon: SlidersHorizontal, labels: ["Property Details", "تفاصيل العقار"], active: false },
  { id: "pricing", icon: BadgeDollarSign, labels: ["Pricing & Availability", "السعر والتوفر"], active: false },
  { id: "media", icon: Plus, labels: ["Media", "الصور والوسائط"], active: false },
  { id: "description", icon: FileText, labels: ["Description", "الوصف"], active: false },
  { id: "amenities", icon: Sparkles, labels: ["Amenities", "المرافق"], active: false },
  { id: "additional", icon: Tag, labels: ["Additional", "إضافي"], active: false },
];

export default function AdminPropertyForm() {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const [activeSection, setActiveSection] = useState("basic-information");

  useEffect(() => {
    const section = document.getElementById("basic-information");
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: "-20% 0px -65% 0px" });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#f3f1eb] px-4 pb-12 pt-8 text-[#24231f] sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
              <Link href="/admin/properties" className="hover:text-[#24231f]">{isArabic ? "العقارات" : "Properties"}</Link>
              <span aria-hidden="true">›</span>
              <span className="font-medium text-[#24231f]">{isArabic ? "إنشاء عقار" : "Create Property"}</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl">{isArabic ? "إنشاء عقار جديد" : "Create New Property"}</h1>
            <p className="mt-2 max-w-2xl text-sm text-neutral-600">{isArabic ? "أضف عقارًا جديدًا إلى منصتك." : "Add a new property to your platform."}</p>
          </div>
          <Link href="/admin/properties" className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d8d3c8] bg-[#faf9f5] px-4 text-sm hover:bg-white">
            <span aria-hidden="true">←</span>{isArabic ? "العودة إلى العقارات" : "Back to Properties"}
          </Link>
        </div>

        <nav aria-label={isArabic ? "أقسام نموذج العقار" : "Property form sections"} className="sticky top-20 z-30 mt-7 overflow-x-auto rounded-lg border border-[#e3dfd5] bg-[#faf9f5]/95 shadow-sm backdrop-blur-md">
          <div className="flex min-w-max items-stretch px-2 sm:min-w-0 sm:justify-between sm:px-3">
            {sections.map(({ id, icon: Icon, labels }) => {
              const isActive = activeSection === id;
              const sectionLabel = isArabic ? labels[1] : labels[0];
              return (
                <button
                  key={id}
                  type="button"
                  disabled={id !== "basic-information"}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className={`relative flex min-h-14 shrink-0 items-center gap-2 px-3 text-xs transition-colors sm:flex-1 sm:justify-center sm:px-2 ${isActive ? "font-medium text-[#234532]" : "text-neutral-400"} disabled:cursor-not-allowed`}
                  title={id === "basic-information" ? sectionLabel : isArabic ? "قريبًا" : "Coming soon"}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  <span>{sectionLabel}</span>
                  {isActive && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-[#234532]" />}
                </button>
              );
            })}
          </div>
        </nav>

        <section id="basic-information" className="scroll-mt-36 mt-5 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          <div className="flex items-start gap-4 border-b border-[#e8e4db] px-5 py-5 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f1eadf] font-mono text-sm text-[#8f7654]">01</span>
            <div>
              <h2 className="font-serif text-2xl">{isArabic ? "المعلومات الأساسية" : "Basic Information"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isArabic ? "أدخل المعلومات الأساسية لهذا العقار." : "Add the essential details about this property."}</p>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
            <label className="block text-sm font-medium">{isArabic ? "عنوان العقار" : "Property Title"}<span className="ms-1 text-red-700">*</span>
              <input name="title" maxLength={160} placeholder={isArabic ? "مثال: فيلا فاخرة في الدرعية" : "e.g. Luxury Villa in Diriyah"} className={fieldClass} />
            </label>
            <label className="block text-sm font-medium">{isArabic ? "نوع العقار" : "Property Type"}<span className="ms-1 text-red-700">*</span>
              <select name="propertyType" defaultValue="" className={fieldClass}>
                <option value="" disabled>{isArabic ? "اختر نوع العقار" : "Select property type"}</option>
                <option value="villa">{isArabic ? "فيلا" : "Villa"}</option>
                <option value="apartment">{isArabic ? "شقة" : "Apartment"}</option>
                <option value="townhouse">{isArabic ? "منزل متصل" : "Townhouse"}</option>
                <option value="land">{isArabic ? "أرض" : "Land"}</option>
                <option value="commercial">{isArabic ? "تجاري" : "Commercial"}</option>
              </select>
            </label>
            <label className="block text-sm font-medium">{isArabic ? "السوق" : "Market"}<span className="ms-1 text-red-700">*</span>
              <select name="listingType" defaultValue="" className={fieldClass}>
                <option value="" disabled>{isArabic ? "اختر السوق" : "Select market"}</option>
                <option value="SALE">{isArabic ? "للبيع" : "For sale"}</option>
                <option value="RENT">{isArabic ? "للإيجار" : "For rent"}</option>
              </select>
            </label>
            <label className="block text-sm font-medium">{isArabic ? "المجموعة" : "Collection"}
              <select name="tier" defaultValue="" className={fieldClass}>
                <option value="">{isArabic ? "اختر المجموعة (اختياري)" : "Select collection (optional)"}</option>
                <option value="featured">{isArabic ? "مميز" : "Featured"}</option>
                <option value="curated">{isArabic ? "منسق" : "Curated"}</option>
                <option value="vault">{isArabic ? "فرص استثمارية" : "Investment vault"}</option>
                <option value="syndicate">{isArabic ? "استثمار مشترك" : "Syndicate"}</option>
              </select>
            </label>
            <div className="flex min-h-16 items-center justify-between gap-4 sm:col-span-2 sm:max-w-[calc(50%-0.75rem)]">
              <div>
                <p className="text-sm font-medium">{isArabic ? "عقار مميز" : "Featured Property"}</p>
                <p className="mt-1 text-xs text-neutral-500">{isArabic ? "إبراز هذا العقار ضمن العقارات المميزة" : "Highlight this property in featured listings"}</p>
              </div>
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input type="checkbox" name="featured" className="peer sr-only" />
                <span className="h-6 w-11 rounded-full bg-[#d8d3c8] transition-colors peer-checked:bg-[#234532] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#234532]" />
                <span className="absolute start-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5" />
              </label>
            </div>
            <label className="block text-sm font-medium">{isArabic ? "الرقم المرجعي" : "Reference ID"}
              <input name="referenceId" placeholder="e.g. NAJM-2024-001" className={fieldClass} />
              <span className="mt-1 block text-xs font-normal text-neutral-400">{isArabic ? "اتركه فارغًا لإنشائه تلقائيًا" : "Leave empty to auto-generate"}</span>
            </label>
          </div>
        </section>
      </div>
    </main>
  );
}

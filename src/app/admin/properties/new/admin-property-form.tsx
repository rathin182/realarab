"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createAdminListing } from "@/actions/admin";
import { useSiteLanguage } from "@/components/providers/LanguageContext";
import { BadgeDollarSign, FileText, House, MapPin, Plus, SlidersHorizontal, Sparkles, X, type LucideIcon } from "lucide-react";
import ImageUploadField from "./image-upload-field";
import LocationMapPicker from "./location-map-picker";

const fieldClass = "mt-1.5 h-11 w-full rounded-md border border-[#d8d3c8] bg-white px-3 text-sm outline-none transition-colors focus:border-[#8f7654] focus:ring-2 focus:ring-[#8f7654]/10";
const sections: { id: string; icon: LucideIcon; labels: [string, string]; active: boolean }[] = [
  { id: "basic-information", icon: House, labels: ["Basic Details", "المعلومات الأساسية"], active: true },
  { id: "location", icon: MapPin, labels: ["Location", "الموقع"], active: true },
  { id: "property-details", icon: SlidersHorizontal, labels: ["Property Details", "تفاصيل العقار"], active: true },
  { id: "pricing", icon: BadgeDollarSign, labels: ["Pricing & Availability", "السعر والتوفر"], active: true },
  { id: "media", icon: Plus, labels: ["Media", "الصور والوسائط"], active: true },
  { id: "description", icon: FileText, labels: ["Description", "الوصف"], active: true },
  { id: "amenities", icon: Sparkles, labels: ["Amenities", "المرافق"], active: true },
  // { id: "additional", icon: Tag, labels: ["Additional", "إضافي"], active: true },
];

function ChipInput({ name, label, placeholder, note, isArabic }: { name: string; label: string; placeholder: string; note: string; isArabic: boolean }) {
  const [value, setValue] = useState("");
  const [items, setItems] = useState<string[]>([]);

  function addItems() {
    const additions = value.split(",").map((item) => item.trim()).filter(Boolean);
    if (!additions.length) return;
    setItems((current) => {
      const seen = new Set(current.map((item) => item.toLocaleLowerCase()));
      return [...current, ...additions.filter((item) => {
        const key = item.toLocaleLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })];
    });
    setValue("");
  }

  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-medium">{label}</label>
      {items.map((item) => <input key={item} type="hidden" name={name} value={item} />)}
      <div className="mt-1.5 flex items-center gap-2">
        <input value={value} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addItems(); } }} placeholder={placeholder} className={`${fieldClass} mt-0 min-w-0 flex-1`} />
        {value.trim() && <button type="button" onClick={addItems} className="h-11 shrink-0 rounded-md bg-[#234532] px-4 text-sm font-medium text-white hover:bg-[#183424]">{isArabic ? "إضافة" : name === "amenities" ? "Add Amenity" : "Add Feature"}</button>}
      </div>
      <p className="mt-1 text-xs text-neutral-500">{note}</p>
      {items.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => <li key={item} className="inline-flex items-center gap-2 rounded-md border border-[#d8d3c8] bg-white px-3 py-1.5 text-sm">
          <span>{item}</span>
          <button type="button" onClick={() => setItems((current) => current.filter((value) => value !== item))} aria-label={`${isArabic ? "إزالة" : "Remove"} ${item}`} className="text-neutral-500 hover:text-red-700"><X aria-hidden="true" className="h-3.5 w-3.5" /></button>
        </li>)}
      </ul>}
    </div>
  );
}

const defaultAmenities: [string, string][] = [
  ["Parking", "موقف سيارات"], ["Swimming pool", "مسبح"], ["Garden", "حديقة"],
  ["Gym", "صالة رياضية"], ["Security", "أمن"], ["Central AC", "تكييف مركزي"],
  ["Balcony", "شرفة"], ["Elevator", "مصعد"], ["Smart home", "منزل ذكي"],
];

function AmenitySelector({ isArabic }: { isArabic: boolean }) {
  const [value, setValue] = useState("");
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [selectedCustomAmenities, setSelectedCustomAmenities] = useState<string[]>([]);

  function addAmenities() {
    const additions = value.split(",").map((amenity) => amenity.trim()).filter(Boolean);
    if (!additions.length) return;
    const seen = new Set([...defaultAmenities.map(([name]) => name), ...customAmenities].map((name) => name.toLocaleLowerCase()));
    const fresh = additions.filter((amenity) => {
      const key = amenity.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setCustomAmenities((current) => [...current, ...fresh]);
    setSelectedCustomAmenities((current) => [...current, ...fresh]);
    setValue("");
  }

  function removeAmenity(amenity: string) {
    setCustomAmenities((current) => current.filter((item) => item !== amenity));
    setSelectedCustomAmenities((current) => current.filter((item) => item !== amenity));
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {defaultAmenities.map(([name, nameAr]) => (
          <label key={name} className="flex min-h-11 items-center gap-3 rounded-md border border-[#e3dfd5] bg-white px-3 text-sm">
            <input type="checkbox" name="amenities" value={name} className="h-4 w-4 accent-[#234532]" />
            <span>{isArabic ? nameAr : name}</span>
          </label>
        ))}
        {customAmenities.map((amenity) => (
          <div key={amenity} className="flex min-h-11 items-center gap-2 rounded-md border border-[#e3dfd5] bg-white px-3 text-sm">
            <label className="flex min-w-0 flex-1 items-center gap-3">
              <input type="checkbox" name="amenities" value={amenity} checked={selectedCustomAmenities.includes(amenity)} onChange={(event) => setSelectedCustomAmenities((current) => event.currentTarget.checked ? [...current, amenity] : current.filter((item) => item !== amenity))} className="h-4 w-4 shrink-0 accent-[#234532]" />
              <span className="truncate">{amenity}</span>
            </label>
            <button type="button" onClick={() => removeAmenity(amenity)} aria-label={`${isArabic ? "إزالة" : "Remove"} ${amenity}`} className="text-neutral-500 hover:text-red-700"><X aria-hidden="true" className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium">{isArabic ? "إضافة مرافق أخرى" : "Add custom amenities"}</label>
        <div className="mt-1.5 flex items-center gap-2">
          <input value={value} onChange={(event) => setValue(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addAmenities(); } }} placeholder={isArabic ? "أدخل مرفقًا أو أكثر" : "Enter one or more amenities"} className={`${fieldClass} mt-0 min-w-0 flex-1`} />
          {value.trim() && <button type="button" onClick={addAmenities} className="h-11 shrink-0 rounded-md bg-[#234532] px-4 text-sm font-medium text-white hover:bg-[#183424]">{isArabic ? "إضافة" : "Add Amenity"}</button>}
        </div>
        <p className="mt-1 text-xs text-neutral-500">{isArabic ? "افصل المرافق المتعددة بفواصل، ثم اضغط إضافة." : "Separate multiple amenities with commas, then click Add Amenity."}</p>
      </div>
    </div>
  );
}

export default function AdminPropertyForm() {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const [activeSection, setActiveSection] = useState("basic-information");
  const [propertyType, setPropertyType] = useState("");
  const [listingStatus, setListingStatus] = useState("DRAFT");
  const [propertyTypeError, setPropertyTypeError] = useState(false);

  useEffect(() => {
    const sectionNodes = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (!sectionNodes.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => Number(b.intersectionRatio) - Number(a.intersectionRatio))[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-20% 0px -65% 0px" });

    sectionNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#f3f1eb] px-4 pb-12 pt-8 text-[#24231f] sm:px-6">
      <form action={createAdminListing} onSubmit={(event) => {
        if (!propertyType) {
          event.preventDefault();
          setPropertyTypeError(true);
          document.getElementById("property-type-options")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }} className="mx-auto max-w-7xl space-y-5">
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
              const disabled = !sections.find((section) => section.id === id)?.active;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={disabled}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className={`relative flex min-h-14 shrink-0 items-center gap-2 px-3 text-xs transition-colors sm:flex-1 sm:justify-center sm:px-2 ${isActive ? "font-medium text-[#234532]" : "text-neutral-400"} disabled:cursor-not-allowed`}
                  title={disabled ? (isArabic ? "قريبًا" : "Coming soon") : sectionLabel}
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
              <input name="title" required maxLength={160} placeholder={isArabic ? "مثال: فيلا فاخرة في الدرعية" : "e.g. Luxury Villa in Diriyah"} className={fieldClass} />
            </label>
            <fieldset id="property-type-options" aria-invalid={propertyTypeError} className="sm:col-span-2">
              <legend className="text-sm font-medium">{isArabic ? "نوع العقار" : "Property Type"}<span className="ms-1 text-red-700">*</span></legend>
              <input type="hidden" name="propertyType" value={propertyType} />
              <input type="hidden" name="category" value={propertyType === "LAND" ? "LAND" : propertyType === "COMMERCIAL" ? "COMMERCIAL" : "RESIDENTIAL"} />
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[["VILLA", "Villa", "فيلا"], ["APARTMENT", "Apartment", "شقة"], ["TOWNHOUSE", "Townhouse", "منزل متصل"], ["LAND", "Land", "أرض"], ["COMMERCIAL", "Commercial", "تجاري"]].map(([value, label, labelAr]) => (
                  <button key={value} type="button" aria-pressed={propertyType === value} onClick={() => { setPropertyType(value); setPropertyTypeError(false); }} className={`min-h-11 rounded-md border px-3 text-sm transition-colors ${propertyType === value ? "border-[#234532] bg-[#234532] text-white" : "border-[#d8d3c8] bg-white hover:bg-[#f4f1ea]"}`}>
                    {isArabic ? labelAr : label}
                  </button>
                ))}
              </div>
              {propertyTypeError && <p role="alert" className="mt-2 text-xs text-red-700">{isArabic ? "يرجى اختيار نوع العقار." : "Choose a property type to continue."}</p>}
            </fieldset>
            <label className="block text-sm font-medium">{isArabic ? "السوق" : "Market"}<span className="ms-1 text-red-700">*</span>
              <select name="listingType" required defaultValue="" className={fieldClass}>
                <option value="" disabled>{isArabic ? "اختر السوق" : "Select market"}</option>
                <option value="SALE">{isArabic ? "للبيع" : "For sale"}</option>
                <option value="RENT">{isArabic ? "للإيجار" : "For rent"}</option>
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
          </div>
        </section>

        <section id="location" className="scroll-mt-36 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          <div className="flex items-start gap-4 border-b border-[#e8e4db] px-5 py-5 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f1eadf] font-mono text-sm text-[#8f7654]">02</span>
            <div>
              <h2 className="font-serif text-2xl">{isArabic ? "الموقع" : "Location"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isArabic ? "حدد المدينة والموقع التفصيلي للعقار." : "Define the city, state, and detailed location for the property."}</p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <LocationMapPicker fieldClass={fieldClass} isArabic={isArabic} />
          </div>
        </section>

        <section id="property-details" className="scroll-mt-36 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          <div className="flex items-start gap-4 border-b border-[#e8e4db] px-5 py-5 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f1eadf] font-mono text-sm text-[#8f7654]">03</span>
            <div>
              <h2 className="font-serif text-2xl">{isArabic ? "تفاصيل العقار" : "Property Details"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isArabic ? "أضف مساحة العقار، غرف النوم، المرافق، وكل التفاصيل المهمة." : "Add spaces, room counts, layout details, and other essential facts."}</p>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
            <label className="block text-sm font-medium">{isArabic ? "المساحة (م²)" : "Area (sqm)"}
              <input name="areaSqm" type="number" min="0" step="1" placeholder="350" className={fieldClass} />
            </label>
            {propertyType && propertyType !== "LAND" && <>
              <label className="block text-sm font-medium">{isArabic ? "غرف النوم" : "Bedrooms"}
                <input name="bedrooms" type="number" min="0" step="1" placeholder="4" className={fieldClass} />
              </label>
              <label className="block text-sm font-medium">{isArabic ? "الحمامات" : "Bathrooms"}
                <input name="bathrooms" type="number" min="0" step="1" placeholder="3" className={fieldClass} />
              </label>
            </>}
            {propertyType === "LAND" && <>
              <label className="block text-sm font-medium">{isArabic ? "التصنيف التنظيمي" : "Zoning"}
                <input name="zoning" placeholder={isArabic ? "سكني، تجاري، متعدد الاستخدامات" : "Residential, commercial, mixed-use"} className={fieldClass} />
              </label>
              <label className="block text-sm font-medium">{isArabic ? "واجهة الأرض (م)" : "Frontage (m)"}
                <input name="frontageMeters" type="number" min="0" step="0.1" placeholder="30" className={fieldClass} />
              </label>
              <label className="block text-sm font-medium">{isArabic ? "عمق الأرض (م)" : "Depth (m)"}
                <input name="depthMeters" type="number" min="0" step="0.1" placeholder="40" className={fieldClass} />
              </label>
            </>}
            {propertyType && propertyType !== "LAND" && <>
              <label className="block text-sm font-medium">{isArabic ? "عدد الطوابق" : "Floors"}
                <input name="floors" type="number" min="1" step="1" placeholder="2" className={fieldClass} />
              </label>
              <label className="block text-sm font-medium">{isArabic ? "سنة البناء" : "Year built"}
                <input name="yearBuilt" type="number" min="1800" max="2100" step="1" placeholder="2025" className={fieldClass} />
              </label>
            </>}
            {propertyType === "COMMERCIAL" && <label className="block text-sm font-medium sm:col-span-2">{isArabic ? "الاستخدام التجاري" : "Commercial use"}
              <input name="propertyUse" placeholder={isArabic ? "مكاتب، تجزئة، ضيافة، مستودعات" : "Office, retail, hospitality, warehouse"} className={fieldClass} />
            </label>}
            <ChipInput name="keyFeatures" label={isArabic ? "الميزات الرئيسية" : "Key features"} placeholder={isArabic ? "أدخل ميزة أو أكثر" : "Enter one or more features"} note={isArabic ? "افصل الميزات المتعددة بفواصل، ثم اضغط إضافة." : "Separate multiple features with commas, then click Add Feature."} isArabic={isArabic} />
          </div>
        </section>

        <section id="pricing" className="scroll-mt-36 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          <div className="flex items-start gap-4 border-b border-[#e8e4db] px-5 py-5 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f1eadf] font-mono text-sm text-[#8f7654]">04</span>
            <div>
              <h2 className="font-serif text-2xl">{isArabic ? "السعر والتوفر" : "Pricing & Availability"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isArabic ? "حدد السعر، شروط التفاوض، وتاريخ التوفر." : "Set the asking price, negotiation details, and availability timeline."}</p>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
            <label className="block text-sm font-medium">{isArabic ? "السعر (SAR)" : "Price (SAR)"}<span className="ms-1 text-red-700">*</span>
              <input name="price" required type="number" min="0" step="1000" placeholder="2500000" className={fieldClass} />
            </label>
            <fieldset className="block text-sm font-medium">
              <legend>{isArabic ? "الحالة" : "Availability status"}</legend>
              <input type="hidden" name="status" value={listingStatus} />
              <div className="mt-1.5 grid h-11 grid-cols-3 overflow-hidden rounded-md border border-[#d8d3c8] bg-white">
                {[["DRAFT", "Draft", "مسودة"], ["LIVE", "Live", "نشط"], ["SOLD_OR_RENTED", "Sold / rented", "مباع / مؤجر"]].map(([value, label, labelAr]) => (
                  <button key={value} type="button" aria-pressed={listingStatus === value} onClick={() => setListingStatus(value)} className={`px-2 text-xs transition-colors sm:text-sm ${listingStatus === value ? "bg-[#234532] font-medium text-white" : "text-neutral-600 hover:bg-[#f4f1ea]"}`}>
                    {isArabic ? labelAr : label}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-medium">{isArabic ? "تاريخ التوفر" : "Available from"}
              <input name="availableFrom" type="date" className={fieldClass} />
            </label>
            <label className="block text-sm font-medium sm:col-span-2">{isArabic ? "ملاحظات التوفر" : "Availability notes"}
              <textarea name="availabilityNotes" rows={3} placeholder={isArabic ? "مثال: جاهز للاستلام خلال 6 أشهر" : "e.g. Ready for handover in 6 months"} className={`${fieldClass} h-auto resize-y px-3 py-3`} />
            </label>
          </div>
        </section>

        <section id="media" className="scroll-mt-36 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          <div className="flex items-start gap-4 border-b border-[#e8e4db] px-5 py-5 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f1eadf] font-mono text-sm text-[#8f7654]">05</span>
            <div>
              <h2 className="font-serif text-2xl">{isArabic ? "الصور والوسائط" : "Media"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isArabic ? "ارفع صورة الغلاف وأضف صورًا أو رابط فيديو للعقار." : "Upload a cover image and add gallery images or a property video."}</p>
            </div>
          </div>
          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
            <div className="sm:col-span-2">
              <ImageUploadField fieldClass={fieldClass} />
            </div>
          </div>
        </section>

        <section id="description" className="scroll-mt-36 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          <div className="flex items-start gap-4 border-b border-[#e8e4db] px-5 py-5 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f1eadf] font-mono text-sm text-[#8f7654]">06</span>
            <div>
              <h2 className="font-serif text-2xl">{isArabic ? "الوصف" : "Description"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isArabic ? "اكتب وصفًا واضحًا باللغات التي تريد عرضها." : "Write a clear property description for your listing."}</p>
            </div>
          </div>
          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
            <label className="block text-sm font-medium sm:col-span-2">{isArabic ? "الوصف بالعربية" : "Arabic description"}<span className="ms-1 text-red-700">*</span>
              <textarea name="descriptionAr" required maxLength={5000} rows={6} dir="rtl" placeholder="اكتب وصف العقار باللغة العربية" className={`${fieldClass} h-auto resize-y px-3 py-3`} />
            </label>
            <label className="block text-sm font-medium sm:col-span-2">{isArabic ? "الوصف بالإنجليزية" : "English description"}
              <textarea name="description" maxLength={5000} rows={5} placeholder={isArabic ? "أضف وصفًا اختياريًا باللغة الإنجليزية" : "Add an optional English description"} className={`${fieldClass} h-auto resize-y px-3 py-3`} />
            </label>
          </div>
        </section>

        <section id="amenities" className="scroll-mt-36 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          <div className="flex items-start gap-4 border-b border-[#e8e4db] px-5 py-5 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f1eadf] font-mono text-sm text-[#8f7654]">07</span>
            <div>
              <h2 className="font-serif text-2xl">{isArabic ? "المرافق" : "Amenities"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isArabic ? "اختر المرافق المتوفرة في العقار." : "Select the amenities available at the property."}</p>
            </div>
          </div>
          <div className="p-5 sm:p-7">
            <AmenitySelector isArabic={isArabic} />
          </div>
        </section>

        {/* <section id="additional" className="scroll-mt-36 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          <div className="flex items-start gap-4 border-b border-[#e8e4db] px-5 py-5 sm:px-7">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#f1eadf] font-mono text-sm text-[#8f7654]">08</span>
            <div>
              <h2 className="font-serif text-2xl">{isArabic ? "معلومات إضافية" : "Additional Information"}</h2>
              <p className="mt-1 text-sm text-neutral-500">{isArabic ? "أضف معلومات الترخيص والوسوم الاستثمارية." : "Add regulatory details and investment labels."}</p>
            </div>
          </div>
          <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
            <label className="block text-sm font-medium">{isArabic ? "رقم ريرا" : "RERA number"}
              <input name="reraNumber" maxLength={100} placeholder="e.g. 1234567890" className={fieldClass} />
            </label>
            <label className="block text-sm font-medium">{isArabic ? "العائد المتوقع" : "Projected yield"}
              <input name="projectedYield" maxLength={80} placeholder="e.g. 7.5%" className={fieldClass} />
            </label>
            <label className="block text-sm font-medium">{isArabic ? "شارة العقار" : "Listing badge"}
              <input name="badge" maxLength={80} placeholder={isArabic ? "مثال: اختيار المحرر" : "e.g. Editor's pick"} className={fieldClass} />
            </label>
            <label className="block text-sm font-medium">{isArabic ? "الوسوم" : "Listing flags"}
              <input name="flags" placeholder={isArabic ? "مثال: مميز، جاهز للتسليم" : "e.g. Featured, ready to move"} className={fieldClass} />
              <span className="mt-1 block text-xs font-normal text-neutral-500">{isArabic ? "افصل الوسوم بفواصل." : "Separate flags with commas."}</span>
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm sm:col-span-2">
              <input type="checkbox" name="isOffPlan" value="true" className="h-4 w-4 accent-[#234532]" />
              <span>{isArabic ? "عقار على الخارطة" : "Off-plan property"}</span>
            </label>
          </div>
        </section> */}

        <div className="flex flex-wrap justify-end gap-3 rounded-lg border border-[#e3dfd5] bg-[#faf9f5] px-5 py-4 sm:px-7">
          <Link href="/admin/properties" className="inline-flex h-11 items-center rounded-md border border-[#d8d3c8] bg-white px-5 text-sm hover:bg-[#f8f6f3]">
            {isArabic ? "إلغاء" : "Cancel"}
          </Link>
          <button type="submit" className="inline-flex h-11 items-center rounded-md bg-[#234532] px-5 text-sm font-medium text-white hover:bg-[#183424]">
            {listingStatus === "DRAFT" ? (isArabic ? "حفظ كمسودة" : "Save Listing as Draft") : (isArabic ? "نشر العقار" : "Publish Listing")}
          </button>
        </div>
      </form>
    </main>
  );
}

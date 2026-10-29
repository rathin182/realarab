"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSiteLanguage } from "@/components/providers/LanguageContext";
import { bulkArchiveAdminListings } from "@/actions/admin";
import { RemovePropertyButton } from "./remove-property-button";

type Property = {
  id: string; slug: string; title: string; city: string; locality: string | null; state: string;
  price: number; listingType: string; category: string; propertyType: string | null; status: string;
  featured: boolean; bedrooms: number | null; bathrooms: number | null; areaSqm: number | null; areaSqft: number | null;
  isOffPlan: boolean; projectedYield: string | null; viewCount: number; createdAt: string; image: string | null;
};

const pageSize = 12;
const fieldClass = "h-10 rounded-lg border border-[#e3dfd5] bg-white px-3 text-sm text-[#24231f] outline-none focus:border-[#8f7654]";

function formatLabel(value: string) {
  return value.toLowerCase().split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export default function AdminPropertiesList({ properties }: { properties: Property[] }) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const locale = isArabic ? "ar-SA" : "en-US";
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const statuses = useMemo(() => [...new Set(properties.map((property) => property.status))].sort(), [properties]);
  const listingTypes = useMemo(() => [...new Set(properties.map((property) => property.listingType))].sort(), [properties]);
  const categories = useMemo(() => [...new Set(properties.map((property) => property.category))].sort(), [properties]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return properties.filter((property) => {
      const matchesText = !query || [property.title, property.city, property.locality ?? "", property.state, property.slug, property.propertyType ?? ""].join(" ").toLocaleLowerCase().includes(query);
      return matchesText && (status === "all" || property.status === status) && (listingType === "all" || property.listingType === listingType) && (category === "all" || property.category === category);
    }).sort((a, b) => sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : sort === "views" ? b.viewCount - a.viewCount : sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : b.createdAt.localeCompare(a.createdAt));
  }, [properties, search, status, listingType, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const visibleSelected = pageItems.length > 0 && pageItems.every((property) => selected.includes(property.id));
  const setFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); setSelected([]); };
  const togglePage = () => setSelected(visibleSelected ? selected.filter((id) => !pageItems.some((property) => property.id === id)) : [...new Set([...selected, ...pageItems.map((property) => property.id)])]);

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="mx-auto max-w-[1500px] space-y-5 text-[#24231f]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f7654]">{isArabic ? "إدارة المخزون" : "Inventory management"}</p><h1 className="mt-1 font-serif text-3xl">{isArabic ? "العقارات" : "Properties"}</h1><p className="mt-1 text-sm text-neutral-500">{isArabic ? `${filtered.length} من ${properties.length} عقار` : `${filtered.length} of ${properties.length} properties`}</p></div>
        <Link href="/admin/properties/new" className="rounded-lg bg-[#292820] px-4 py-2.5 text-sm text-white transition hover:bg-[#454337]">＋ {isArabic ? "إضافة عقار" : "Add property"}</Link>
      </header>

      <section className="overflow-hidden rounded-xl border border-[#e3dfd5] bg-[#faf9f5] shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#e8e4db] p-4">
          <input value={search} onChange={(event) => setFilter(setSearch)(event.target.value)} placeholder={isArabic ? "ابحث بالعنوان أو الموقع أو النوع" : "Search title, location or type"} aria-label="Search properties" className={`${fieldClass} min-w-52 flex-1`} />
          <select aria-label="Filter by status" value={status} onChange={(event) => setFilter(setStatus)(event.target.value)} className={fieldClass}><option value="all">{isArabic ? "كل الحالات" : "All statuses"}</option>{statuses.map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select>
          <select aria-label="Filter by listing type" value={listingType} onChange={(event) => setFilter(setListingType)(event.target.value)} className={fieldClass}><option value="all">{isArabic ? "كل الأسواق" : "All markets"}</option>{listingTypes.map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select>
          <select aria-label="Filter by category" value={category} onChange={(event) => setFilter(setCategory)(event.target.value)} className={fieldClass}><option value="all">{isArabic ? "كل الفئات" : "All categories"}</option>{categories.map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select>
          <select aria-label="Sort properties" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className={fieldClass}><option value="newest">{isArabic ? "الأحدث أولاً" : "Newest first"}</option><option value="oldest">{isArabic ? "الأقدم أولاً" : "Oldest first"}</option><option value="views">{isArabic ? "الأكثر مشاهدة" : "Most viewed"}</option><option value="price-low">{isArabic ? "السعر: الأقل" : "Price: low to high"}</option><option value="price-high">{isArabic ? "السعر: الأعلى" : "Price: high to low"}</option></select>
          {selected.length > 0 && <form action={bulkArchiveAdminListings} onSubmit={(event) => { if (!window.confirm(isArabic ? `إزالة ${selected.length} عقار من الموقع؟` : `Archive ${selected.length} selected properties?`)) event.preventDefault(); }} className="flex items-center gap-2"><input type="hidden" name="ids" value={selected.join(",")} /><BulkArchiveIds ids={selected} /><button className="h-10 rounded-lg border border-red-200 px-3 text-sm text-red-700 hover:bg-red-50">{isArabic ? `أرشفة (${selected.length})` : `Archive (${selected.length})`}</button></form>}
        </div>

        {properties.length === 0 ? <p className="px-5 py-16 text-center text-sm text-neutral-500">{isArabic ? "لا توجد عقارات بعد. أضف عقاراً للبدء." : "No properties yet. Add a property to get started."}</p> : filtered.length === 0 ? <p className="px-5 py-16 text-center text-sm text-neutral-500">{isArabic ? "لا توجد نتائج مطابقة." : "No properties match your search."}</p> : <>
          <div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-[#f4f1ea] text-xs text-neutral-500"><tr>
              <th className="w-12 px-4 py-3 text-center"><input type="checkbox" aria-label="Select properties on this page" checked={visibleSelected} onChange={togglePage} className="h-4 w-4 accent-[#292820]" /></th>
              <th className="px-3 py-3 text-start font-medium">{isArabic ? "عقار" : "Property"}</th><th className="px-3 py-3 text-start font-medium">{isArabic ? "النوع" : "Type"}</th><th className="px-3 py-3 text-start font-medium">{isArabic ? "الموقع" : "Location"}</th><th className="px-3 py-3 text-start font-medium">{isArabic ? "الحالة" : "Status"}</th><th className="px-3 py-3 text-start font-medium">{isArabic ? "السوق" : "Market"}</th><th className="px-3 py-3 text-end font-medium">{isArabic ? "السعر (ريال)" : "Price (SAR)"}</th><th className="px-3 py-3 text-end font-medium">{isArabic ? "التفاصيل" : "Details"}</th><th className="px-3 py-3 text-end font-medium">{isArabic ? "المشاهدات" : "Views"}</th><th className="px-4 py-3 text-end font-medium">{isArabic ? "إجراء" : "Action"}</th>
            </tr></thead>
            <tbody>{pageItems.map((property) => <tr key={property.id} className="border-t border-[#e8e4db] transition-colors hover:bg-white">
              <td className="px-4 py-3 text-center"><input type="checkbox" aria-label={`Select ${property.title}`} checked={selected.includes(property.id)} onChange={() => setSelected((current) => current.includes(property.id) ? current.filter((id) => id !== property.id) : [...current, property.id])} className="h-4 w-4 accent-[#292820]" /></td>
              <td className="px-3 py-3"><div className="flex min-w-56 items-center gap-3"><Link href={`/properties/${property.slug}`} aria-label={property.title} className="h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-[#e8e4db] bg-[#f1eadf]">{property.image && <img src={property.image} alt={property.title} className="h-full w-full object-cover" />}</Link><div className="min-w-0"><Link href={`/properties/${property.slug}`} className="line-clamp-1 font-medium hover:underline">{property.title}</Link><div className="mt-1 flex flex-wrap items-center gap-1.5">{property.featured && <span className="rounded-full bg-[#f1eadf] px-2 py-0.5 text-[10px] text-[#80683f]">★ {isArabic ? "مميز" : "Featured"}</span>}{property.isOffPlan && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700">{isArabic ? "على الخارطة" : "Off-plan"}</span>}</div></div></div></td>
              <td className="px-3 py-3 text-neutral-600">{property.propertyType ? formatLabel(property.propertyType) : formatLabel(property.category)}</td>
              <td className="px-3 py-3 text-neutral-600"><span className="block max-w-44 truncate">{[property.locality, property.city].filter(Boolean).join(", ")}</span><span className="text-xs text-neutral-400">{property.state}</span></td>
              <td className="px-3 py-3"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] ${property.status === "LIVE" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : property.status === "PENDING_REVIEW" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-neutral-200 bg-neutral-100 text-neutral-600"}`}>{formatLabel(property.status)}</span></td>
              <td className="px-3 py-3 text-neutral-600">{property.listingType === "RENT" ? (isArabic ? "إيجار" : "Rent") : (isArabic ? "بيع" : "Sale")}</td>
              <td className="px-3 py-3 text-end tabular-nums">{property.price.toLocaleString(locale)}</td>
              <td className="px-3 py-3 text-end text-xs text-neutral-600">{[property.bedrooms ? `${property.bedrooms} ${isArabic ? "غرف" : "bd"}` : null, property.bathrooms ? `${property.bathrooms} ${isArabic ? "حمام" : "ba"}` : null, property.areaSqm ? `${property.areaSqm.toLocaleString()} m²` : property.areaSqft ? `${property.areaSqft.toLocaleString()} ft²` : null].filter(Boolean).join(" · ") || "—"}{property.projectedYield && <span className="mt-1 block text-emerald-800">{property.projectedYield} yield</span>}</td>
              <td className="px-3 py-3 text-end tabular-nums">{property.viewCount.toLocaleString(locale)}</td>
              <td className="px-4 py-3 text-end"><div className="flex items-center justify-end gap-2"><Link href={`/properties/${property.slug}`} aria-label={`View ${property.title}`} className="rounded-md border border-[#e3dfd5] px-2.5 py-1.5 text-xs hover:bg-[#f4f1ea]">{isArabic ? "عرض" : "View"}</Link>{property.status !== "ARCHIVED" && <RemovePropertyButton propertyTitle={property.title} propertyId={property.id} />}</div></td>
            </tr>)}</tbody>
          </table></div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e4db] px-4 py-3 text-xs text-neutral-500"><span>{isArabic ? `عرض ${filtered.length ? (page - 1) * pageSize + 1 : 0}–${Math.min(page * pageSize, filtered.length)} من ${filtered.length}` : `Showing ${filtered.length ? (page - 1) * pageSize + 1 : 0}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`}</span><div className="flex items-center gap-1"><button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="h-8 rounded-md border border-[#e3dfd5] px-3 disabled:opacity-40">{isArabic ? "السابق" : "Previous"}</button><span className="px-2">{page} / {pageCount}</span><button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} className="h-8 rounded-md border border-[#e3dfd5] px-3 disabled:opacity-40">{isArabic ? "التالي" : "Next"}</button></div></footer>
        </>}
      </section>
    </main>
  );
}

function BulkArchiveIds({ ids }: { ids: string[] }) {
  return <>{ids.map((id) => <input key={id} type="hidden" name="ids" value={id} />)}</>;
}

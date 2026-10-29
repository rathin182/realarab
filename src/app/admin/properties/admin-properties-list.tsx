"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, Eye, MapPin, Pencil, X } from "lucide-react";
import { useSiteLanguage } from "@/components/providers/LanguageContext";
import { archiveAdminListing, bulkArchiveAdminListings, updateAdminListing } from "@/actions/admin";
import { Toast, useToast } from "@/components/feedback/Toast";
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
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [mapProperty, setMapProperty] = useState<Property | null>(null);
  const [bulkArchiveConfirmation, setBulkArchiveConfirmation] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast, showToast, dismissToast } = useToast();
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

  function saveProperty(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await updateAdminListing(formData);
        if (!result.ok) {
          showToast(isArabic ? "تعذر حفظ العقار. تحقق من التفاصيل." : result.message ?? "Check the property details and try again.", "error");
          return;
        }
        setEditingProperty(null);
        showToast(isArabic ? "تم تحديث العقار." : "Property updated.");
        router.refresh();
      } catch {
        showToast(isArabic ? "تعذر حفظ العقار. حاول مرة أخرى." : "Could not save the property. Please try again.", "error");
      }
    });
  }

  function archiveProperty() {
    if (!deletingProperty) return;
    const formData = new FormData();
    formData.set("id", deletingProperty.id);
    startTransition(async () => {
      try {
        const result = await archiveAdminListing(formData);
        if (!result.ok) {
          showToast(isArabic ? "تعذرت إزالة العقار." : "Could not archive the property.", "error");
          return;
        }
        setDeletingProperty(null);
        showToast(isArabic ? "تمت إزالة العقار من الموقع." : "Property removed from the website.");
        router.refresh();
      } catch {
        showToast(isArabic ? "تعذرت إزالة العقار. حاول مرة أخرى." : "Could not archive the property. Please try again.", "error");
      }
    });
  }

  function archiveSelectedProperties() {
    const formData = new FormData();
    selected.forEach((id) => formData.append("ids", id));
    startTransition(async () => {
      try {
        const result = await bulkArchiveAdminListings(formData);
        if (!result.ok) {
          showToast(isArabic ? "لم يتم تحديد أي عقار." : "No properties were selected.", "error");
          return;
        }
        setBulkArchiveConfirmation(false);
        setSelected([]);
        showToast(isArabic ? "تمت أرشفة العقارات المحددة." : "Selected properties archived.");
        router.refresh();
      } catch {
        showToast(isArabic ? "تعذرت أرشفة العقارات." : "Could not archive the selected properties.", "error");
      }
    });
  }

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="mx-auto max-w-[1500px] space-y-5 text-[#24231f]">
      <Toast toast={toast} onDismiss={dismissToast} />
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
          {selected.length > 0 && <button type="button" onClick={() => setBulkArchiveConfirmation(true)} className="h-10 rounded-lg border border-red-200 px-3 text-sm text-red-700 hover:bg-red-50">{isArabic ? `أرشفة (${selected.length})` : `Archive (${selected.length})`}</button>}
        </div>

        {properties.length === 0 ? <p className="px-5 py-16 text-center text-sm text-neutral-500">{isArabic ? "لا توجد عقارات بعد. أضف عقاراً للبدء." : "No properties yet. Add a property to get started."}</p> : filtered.length === 0 ? <p className="px-5 py-16 text-center text-sm text-neutral-500">{isArabic ? "لا توجد نتائج مطابقة." : "No properties match your search."}</p> : <>
          <div className="overflow-x-auto"><table className="w-full min-w-[980px] table-fixed text-sm">
            <colgroup><col className="w-[4%]" /><col className="w-[21%]" /><col className="w-[8%]" /><col className="w-[8%]" /><col className="w-[9%]" /><col className="w-[7%]" /><col className="w-[9%]" /><col className="w-[11%]" /><col className="w-[5%]" /><col className="w-[18%]" /></colgroup>
            <thead className="bg-[#f4f1ea] text-xs text-neutral-500"><tr>
              <th className="w-12 px-4 py-3 text-center"><input type="checkbox" aria-label="Select properties on this page" checked={visibleSelected} onChange={togglePage} className="h-4 w-4 accent-[#292820]" /></th>
              <th className="px-3 py-3 text-start font-medium">{isArabic ? "عقار" : "Property"}</th><th className="px-3 py-3 text-start font-medium">{isArabic ? "النوع" : "Type"}</th><th className="px-3 py-3 text-start font-medium">{isArabic ? "الموقع" : "Location"}</th><th className="px-3 py-3 text-start font-medium">{isArabic ? "الحالة" : "Status"}</th><th className="px-3 py-3 text-start font-medium">{isArabic ? "السوق" : "Market"}</th><th className="px-3 py-3 text-end font-medium">{isArabic ? "السعر (ريال)" : "Price (SAR)"}</th><th className="px-3 py-3 text-end font-medium">{isArabic ? "التفاصيل" : "Details"}</th><th className="px-3 py-3 text-end font-medium">{isArabic ? "المشاهدات" : "Views"}</th><th className="px-4 py-3 text-end font-medium">{isArabic ? "إجراء" : "Action"}</th>
            </tr></thead>
            <tbody>{pageItems.map((property) => <tr key={property.id} className="border-t border-[#e8e4db] transition-colors hover:bg-white">
              <td className="px-4 py-3 text-center"><input type="checkbox" aria-label={`Select ${property.title}`} checked={selected.includes(property.id)} onChange={() => setSelected((current) => current.includes(property.id) ? current.filter((id) => id !== property.id) : [...current, property.id])} className="h-4 w-4 accent-[#292820]" /></td>
              <td className="overflow-hidden px-3 py-3"><div className="flex items-center gap-2.5"><Link href={`/properties/${property.slug}`} aria-label={property.title} className="h-12 w-14 shrink-0 overflow-hidden rounded-md border border-[#e8e4db] bg-[#f1eadf]">{property.image && <img src={property.image} alt={property.title} className="h-full w-full object-cover" />}</Link><div className="min-w-0"><Link href={`/properties/${property.slug}`} className="block truncate font-medium hover:underline">{property.title}</Link><div className="mt-1 flex flex-wrap items-center gap-1">{property.featured && <span className="rounded bg-[#f1eadf] px-1.5 py-0.5 text-[10px] text-[#80683f]">★ {isArabic ? "مميز" : "Featured"}</span>}{property.isOffPlan && <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] text-violet-700">{isArabic ? "على الخارطة" : "Off-plan"}</span>}</div></div></div></td>
              <td className="truncate px-3 py-3 text-neutral-600">{property.propertyType ? formatLabel(property.propertyType) : formatLabel(property.category)}</td>
              <td className="overflow-hidden px-2 py-3 text-neutral-600"><button type="button" title={[property.locality, property.city, property.state].filter(Boolean).join(", ")} onClick={() => setMapProperty(property)} className="block w-full min-w-0 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8f7654]"><span className="block truncate">{[property.locality, property.city].filter(Boolean).join(", ")}</span><span className="block truncate text-xs text-neutral-400">{property.state}</span></button></td>
              <td className="px-3 py-3"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] ${property.status === "LIVE" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : property.status === "PENDING_REVIEW" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-neutral-200 bg-neutral-100 text-neutral-600"}`}>{formatLabel(property.status)}</span></td>
              <td className="px-3 py-3 text-neutral-600">{property.listingType === "RENT" ? (isArabic ? "إيجار" : "Rent") : (isArabic ? "بيع" : "Sale")}</td>
              <td className="px-3 py-3 text-end tabular-nums">{property.price.toLocaleString(locale)}</td>
              <td className="overflow-hidden px-3 py-3 text-end text-xs text-neutral-600"><span className="block truncate">{[property.bedrooms ? `${property.bedrooms} ${isArabic ? "غرف" : "bd"}` : null, property.bathrooms ? `${property.bathrooms} ${isArabic ? "حمام" : "ba"}` : null, property.areaSqm ? `${property.areaSqm.toLocaleString()} m²` : property.areaSqft ? `${property.areaSqft.toLocaleString()} ft²` : null].filter(Boolean).join(" · ") || "—"}</span>{property.projectedYield && <span className="mt-1 block truncate text-emerald-800">{property.projectedYield} yield</span>}</td>
              <td className="px-3 py-3 text-end tabular-nums">{property.viewCount.toLocaleString(locale)}</td>
              <td className="px-3 py-3 text-end"><div className="flex flex-wrap items-center justify-end gap-1.5"><Link href={`/properties/${property.slug}`} aria-label={`${isArabic ? "عرض" : "View"} ${property.title}`} title={isArabic ? "عرض العقار" : "View property"} className="rounded-md border border-[#e3dfd5] px-2 py-1.5 text-xs hover:bg-[#f4f1ea]">{isArabic ? "عرض" : "View"}</Link><button type="button" onClick={() => setEditingProperty(property)} aria-label={`${isArabic ? "تعديل" : "Edit"} ${property.title}`} title={isArabic ? "تعديل العقار" : "Edit property"} className="inline-flex items-center gap-1 rounded-md border border-[#d8d3c8] px-2 py-1.5 text-xs hover:bg-[#f4f1ea]"><Pencil className="h-3 w-3" />{isArabic ? "تعديل" : "Edit"}</button>{property.status !== "ARCHIVED" && <RemovePropertyButton onClick={() => setDeletingProperty(property)} label={isArabic ? "إزالة" : "Remove"} />}</div></td>
              <td className="px-3 py-3 text-end"><div className="flex flex-wrap items-center justify-end gap-1.5"><Link href={`/properties/${property.slug}`} aria-label={`${isArabic ? "عرض" : "View"} ${property.title}`} title={isArabic ? "عرض العقار" : "View property"} className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[#e3dfd5] text-neutral-600 hover:bg-[#f4f1ea] hover:text-[#24231f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8f7654]"><Eye aria-hidden="true" className="h-4 w-4" /></Link><button type="button" onClick={() => setEditingProperty(property)} aria-label={`${isArabic ? "تعديل" : "Edit"} ${property.title}`} title={isArabic ? "تعديل العقار" : "Edit property"} className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[#d8d3c8] text-neutral-600 hover:bg-[#f4f1ea] hover:text-[#24231f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8f7654]"><Pencil aria-hidden="true" className="h-4 w-4" /></button>{property.status !== "ARCHIVED" && <RemovePropertyButton onClick={() => setDeletingProperty(property)} label={isArabic ? "إزالة" : "Remove"} />}</div></td>
            </tr>)}</tbody>
          </table></div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8e4db] px-4 py-3 text-xs text-neutral-500"><span>{isArabic ? `عرض ${filtered.length ? (page - 1) * pageSize + 1 : 0}–${Math.min(page * pageSize, filtered.length)} من ${filtered.length}` : `Showing ${filtered.length ? (page - 1) * pageSize + 1 : 0}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}`}</span><div className="flex items-center gap-1"><button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="h-8 rounded-md border border-[#e3dfd5] px-3 disabled:opacity-40">{isArabic ? "السابق" : "Previous"}</button><span className="px-2">{page} / {pageCount}</span><button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} className="h-8 rounded-md border border-[#e3dfd5] px-3 disabled:opacity-40">{isArabic ? "التالي" : "Next"}</button></div></footer>
        </>}
      </section>

      {editingProperty && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !isPending) setEditingProperty(null); }}>
        <form action={saveProperty} dir={isArabic ? "rtl" : "ltr"} className="my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#e3dfd5] bg-[#faf9f5] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="edit-property-title">
          <div className="flex items-center justify-between border-b border-[#e8e4db] px-5 py-4"><div><h2 id="edit-property-title" className="font-serif text-xl">{isArabic ? "تعديل العقار" : "Edit property"}</h2><p className="mt-1 max-w-md truncate text-xs text-neutral-500">{editingProperty.title}</p></div><button type="button" onClick={() => setEditingProperty(null)} disabled={isPending} aria-label={isArabic ? "إغلاق" : "Close"} className="rounded-md p-2 text-neutral-500 hover:bg-[#f0ede6]"><X className="h-4 w-4" /></button></div>
          <div className="grid min-h-0 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
            <input type="hidden" name="id" value={editingProperty.id} />
            <label className="space-y-1.5 text-xs font-medium text-neutral-600 sm:col-span-2">{isArabic ? "العنوان" : "Title"}<input name="title" required maxLength={160} defaultValue={editingProperty.title} className={`${fieldClass} w-full`} /></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "المدينة" : "City"}<input name="city" required maxLength={100} defaultValue={editingProperty.city} className={`${fieldClass} w-full`} /></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "المنطقة" : "State / region"}<input name="state" required maxLength={100} defaultValue={editingProperty.state} className={`${fieldClass} w-full`} /></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "الحي" : "Locality"}<input name="locality" maxLength={100} defaultValue={editingProperty.locality ?? ""} className={`${fieldClass} w-full`} /></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "نوع العقار" : "Property type"}<input name="propertyType" maxLength={100} defaultValue={editingProperty.propertyType ?? ""} className={`${fieldClass} w-full`} /></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "السعر (ريال)" : "Price (SAR)"}<input name="price" type="number" min="0" step="1" required defaultValue={editingProperty.price} className={`${fieldClass} w-full`} /></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "نوع العرض" : "Listing type"}<select name="listingType" defaultValue={editingProperty.listingType} className={`${fieldClass} w-full`}><option value="SALE">{isArabic ? "بيع" : "Sale"}</option><option value="RENT">{isArabic ? "إيجار" : "Rent"}</option></select></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "الفئة" : "Category"}<select name="category" defaultValue={editingProperty.category} className={`${fieldClass} w-full`}><option value="RESIDENTIAL">{isArabic ? "سكني" : "Residential"}</option><option value="COMMERCIAL">{isArabic ? "تجاري" : "Commercial"}</option><option value="LAND">{isArabic ? "أرض" : "Land"}</option></select></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "الحالة" : "Status"}<select name="status" defaultValue={editingProperty.status} className={`${fieldClass} w-full`}>{["DRAFT", "PENDING_REVIEW", "LIVE", "REJECTED", "EXPIRED", "SOLD_OR_RENTED", "ARCHIVED"].map((value) => <option key={value} value={value}>{formatLabel(value)}</option>)}</select></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "غرف النوم" : "Bedrooms"}<input name="bedrooms" type="number" min="0" step="1" defaultValue={editingProperty.bedrooms ?? ""} className={`${fieldClass} w-full`} /></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "الحمامات" : "Bathrooms"}<input name="bathrooms" type="number" min="0" step="1" defaultValue={editingProperty.bathrooms ?? ""} className={`${fieldClass} w-full`} /></label>
            <label className="space-y-1.5 text-xs font-medium text-neutral-600">{isArabic ? "المساحة (م²)" : "Area (m²)"}<input name="areaSqm" type="number" min="0" step="1" defaultValue={editingProperty.areaSqm ?? ""} className={`${fieldClass} w-full`} /></label>
          </div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-[#e8e4db] px-5 py-4"><button type="button" disabled={isPending} onClick={() => setEditingProperty(null)} className="rounded-md border border-[#d8d3c8] bg-white px-4 py-2 text-sm">{isArabic ? "إلغاء" : "Cancel"}</button><button type="submit" disabled={isPending} className="rounded-md bg-[#292820] px-4 py-2 text-sm text-white disabled:opacity-60">{isPending ? (isArabic ? "جارٍ الحفظ..." : "Saving...") : (isArabic ? "حفظ التغييرات" : "Save changes")}</button></div>
        </form>
      </div>}

      {mapProperty && <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setMapProperty(null); }}>
        {(() => {
          const location = [mapProperty.locality, mapProperty.city, mapProperty.state].filter(Boolean).join(", ");
          const query = encodeURIComponent(location);
          return <section dir={isArabic ? "rtl" : "ltr"} className="w-full max-w-xl overflow-hidden rounded-xl border border-[#e3dfd5] bg-[#faf9f5] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="property-map-title">
            <div className="flex items-center justify-between gap-4 border-b border-[#e8e4db] px-5 py-4"><div className="min-w-0"><h2 id="property-map-title" className="font-serif text-xl">{isArabic ? "موقع العقار" : "Property location"}</h2><p className="mt-1 truncate text-sm text-neutral-600">{location}</p></div><button type="button" onClick={() => setMapProperty(null)} aria-label={isArabic ? "إغلاق" : "Close map"} className="rounded-md p-2 text-neutral-500 hover:bg-[#f0ede6]"><X className="h-4 w-4" /></button></div>
            <iframe title={`${isArabic ? "خريطة" : "Map"}: ${location}`} src={`https://maps.google.com/maps?q=${query}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="aspect-video w-full border-0" />
            <div className="flex items-center justify-between gap-3 px-5 py-4"><span className="flex min-w-0 items-center gap-2 text-xs text-neutral-500"><MapPin className="h-4 w-4 shrink-0" /><span className="truncate">{location}</span></span><a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer" className="shrink-0 rounded-md bg-[#292820] px-3 py-2 text-xs text-white hover:bg-[#454337]">{isArabic ? "فتح في خرائط Google" : "Open in Google Maps"}</a></div>
          </section>;
        })()}
      </div>}

      {(deletingProperty || bulkArchiveConfirmation) && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !isPending) { setDeletingProperty(null); setBulkArchiveConfirmation(false); } }}>
        <div dir={isArabic ? "rtl" : "ltr"} className="w-full max-w-md rounded-xl border border-[#e3dfd5] bg-[#faf9f5] p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="archive-property-title"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-700"><Archive className="h-5 w-5" /></span><div><h2 id="archive-property-title" className="font-serif text-xl">{deletingProperty ? (isArabic ? "إزالة العقار؟" : "Remove property?") : (isArabic ? "أرشفة العقارات؟" : "Archive properties?")}</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{deletingProperty ? (isArabic ? `هل تريد إزالة "${deletingProperty.title}" من الموقع؟ ستظل الاستفسارات والسجلات الحالية محفوظة.` : `Remove "${deletingProperty.title}" from the public website? Existing enquiries and records will be preserved.`) : (isArabic ? `أرشفة ${selected.length} عقار محدد؟ ستظل الاستفسارات والسجلات الحالية محفوظة.` : `Archive ${selected.length} selected properties? Existing enquiries and records will be preserved.`)}</p></div></div><div className="mt-6 grid grid-cols-2 gap-2"><button type="button" disabled={isPending} onClick={() => { setDeletingProperty(null); setBulkArchiveConfirmation(false); }} className="rounded-md border border-[#d8d3c8] bg-white px-4 py-2.5 text-sm">{isArabic ? "إلغاء" : "Cancel"}</button><button type="button" disabled={isPending} onClick={deletingProperty ? archiveProperty : archiveSelectedProperties} className="rounded-md bg-red-700 px-4 py-2.5 text-sm text-white disabled:opacity-60">{isPending ? (isArabic ? "جارٍ الإزالة..." : "Removing...") : deletingProperty ? (isArabic ? "تأكيد الإزالة" : "Confirm removal") : (isArabic ? "تأكيد الأرشفة" : "Confirm archive")}</button></div></div>
      </div>}
    </main>
  );
}



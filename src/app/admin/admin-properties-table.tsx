"use client";

import Link from "next/link";
import { useState } from "react";
import { useSiteLanguage } from "@/components/providers/LanguageContext";

type AdminProperty = {
  id: string;
  slug: string;
  title: string;
  city: string;
  state: string;
  price: number;
  viewCount: number;
  status: string;
  listingType: string;
  category: string;
  createdAt: string;
};

type SortKey = "title" | "city" | "status" | "listingType" | "category" | "price" | "viewCount" | "createdAt";

const selectClass = "h-10 rounded-md border border-[#d8d3c8] bg-white px-3 text-sm text-[#24231f]";
const statuses = ["DRAFT", "PENDING_REVIEW", "LIVE", "REJECTED", "EXPIRED", "SOLD_OR_RENTED", "ARCHIVED"];
const categories = ["RESIDENTIAL", "COMMERCIAL", "LAND"];

function label(value: string, isArabic: boolean) {
  if (isArabic) {
    const arabicLabels: Record<string, string> = {
      DRAFT: "مسودة",
      PENDING_REVIEW: "بانتظار المراجعة",
      LIVE: "منشور",
      REJECTED: "مرفوض",
      EXPIRED: "منتهي",
      SOLD_OR_RENTED: "مباع أو مؤجر",
      ARCHIVED: "مؤرشف",
      RESIDENTIAL: "سكني",
      COMMERCIAL: "تجاري",
      LAND: "أرض",
    };
    return arabicLabels[value] ?? value;
  }
  return value.toLowerCase().split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

export default function AdminPropertiesTable({ properties }: { properties: AdminProperty[] }) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [listingTypeFilter, setListingTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("viewCount");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const cities = Array.from(new Set(properties.map((property) => property.city))).sort((a, b) => a.localeCompare(b));
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = !normalizedSearch || `${property.title} ${property.city} ${property.state}`.toLocaleLowerCase().includes(normalizedSearch);
    return matchesSearch
      && (!statusFilter || property.status === statusFilter)
      && (!listingTypeFilter || property.listingType === listingTypeFilter)
      && (!categoryFilter || property.category === categoryFilter)
      && (!cityFilter || property.city === cityFilter);
  });

  const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
  filteredProperties.sort((first, second) => {
    const firstValue = first[sortKey];
    const secondValue = second[sortKey];
    const comparison = typeof firstValue === "number" && typeof secondValue === "number"
      ? firstValue - secondValue
      : collator.compare(String(firstValue), String(secondValue));
    return sortDirection === "asc" ? comparison : -comparison;
  });

  function changeSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "title" || key === "city" || key === "status" || key === "listingType" || key === "category" ? "asc" : "desc");
    }
  }

  function sortHeader(key: SortKey, title: string, align = "left") {
    const active = sortKey === key;
    return (
      <th aria-sort={active ? sortDirection === "asc" ? "ascending" : "descending" : "none"} className={`px-3 py-3 font-medium ${align === "right" ? "text-right" : "text-left"}`}>
        <button type="button" className="inline-flex items-center gap-1 hover:text-[#24231f]" onClick={() => changeSort(key)}>
          {title}<span aria-hidden="true">{active ? sortDirection === "asc" ? "↑" : "↓" : "↕"}</span>
        </button>
      </th>
    );
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setListingTypeFilter("");
    setCategoryFilter("");
    setCityFilter("");
  }

  const hasFilters = Boolean(search || statusFilter || listingTypeFilter || categoryFilter || cityFilter);

  return (
    <section id="properties" className="overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
      <div dir={isArabic ? "rtl" : "ltr"} className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e4db] px-5 py-4">
        <div>
          <h2 className="font-serif text-xl">{isArabic ? "العقارات" : "Properties"}</h2>
          <p className="mt-1 text-xs text-neutral-500">{isArabic ? `${filteredProperties.length} من أصل ${properties.length} عقار` : `${filteredProperties.length} of ${properties.length} listings`}</p>
        </div>
        <Link href="/admin/properties" className="text-sm text-neutral-600 hover:underline">{isArabic ? "إدارة العقارات" : "Manage properties"}</Link>
      </div>

      <div dir={isArabic ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-2 border-b border-[#e8e4db] px-5 py-4">
        <label className="sr-only" htmlFor="property-search">{isArabic ? "البحث في العقارات" : "Search properties"}</label>
        <input id="property-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isArabic ? "ابحث بالاسم أو الموقع" : "Search title or location"} className={`${selectClass} min-w-48 flex-1`} />
        <label className="sr-only" htmlFor="property-status">{isArabic ? "تصفية حسب الحالة" : "Filter by status"}</label>
        <select id="property-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={selectClass}>
          <option value="">{isArabic ? "كل الحالات" : "All statuses"}</option>
          {statuses.map((status) => <option key={status} value={status}>{label(status, isArabic)}</option>)}
        </select>
        <label className="sr-only" htmlFor="property-listing-type">{isArabic ? "تصفية حسب نوع العرض" : "Filter by listing type"}</label>
        <select id="property-listing-type" value={listingTypeFilter} onChange={(event) => setListingTypeFilter(event.target.value)} className={selectClass}>
          <option value="">{isArabic ? "كل أنواع العرض" : "All listing types"}</option>
          <option value="SALE">{isArabic ? "للبيع" : "For sale"}</option>
          <option value="RENT">{isArabic ? "للإيجار" : "For rent"}</option>
        </select>
        <label className="sr-only" htmlFor="property-category">{isArabic ? "تصفية حسب الفئة" : "Filter by category"}</label>
        <select id="property-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={selectClass}>
          <option value="">{isArabic ? "كل الفئات" : "All categories"}</option>
          {categories.map((category) => <option key={category} value={category}>{label(category, isArabic)}</option>)}
        </select>
        <label className="sr-only" htmlFor="property-city">{isArabic ? "تصفية حسب المدينة" : "Filter by city"}</label>
        <select id="property-city" value={cityFilter} onChange={(event) => setCityFilter(event.target.value)} className={selectClass}>
          <option value="">{isArabic ? "كل المدن" : "All cities"}</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
        {hasFilters && <button type="button" onClick={resetFilters} className="px-2 py-2 text-sm text-neutral-600 underline underline-offset-2">{isArabic ? "مسح عوامل التصفية" : "Clear filters"}</button>}
      </div>

      {filteredProperties.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-neutral-500">{properties.length === 0 ? (isArabic ? "لا توجد عقارات بعد. أضف عقارًا للبدء." : "No properties yet. Add a property to get started.") : (isArabic ? "لا توجد عقارات تطابق عوامل التصفية." : "No properties match these filters.")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table dir={isArabic ? "rtl" : "ltr"} className="w-full min-w-[980px] text-sm">
            <thead className="bg-[#f4f1ea] text-xs text-neutral-500">
              <tr>
                {sortHeader("title", isArabic ? "العقار" : "Property")}
                {sortHeader("city", isArabic ? "الموقع" : "Location")}
                {sortHeader("status", isArabic ? "الحالة" : "Status")}
                {sortHeader("listingType", isArabic ? "نوع العرض" : "Listing")}
                {sortHeader("category", isArabic ? "الفئة" : "Category")}
                {sortHeader("price", isArabic ? "السعر (ريال)" : "Price (SAR)", "right")}
                {sortHeader("viewCount", isArabic ? "المشاهدات" : "Views", "right")}
                {sortHeader("createdAt", isArabic ? "تاريخ الإضافة" : "Added", "right")}
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr key={property.id} className="border-t border-[#e8e4db]">
                  <td className="px-5 py-3"><Link href={`/properties/${property.slug}`} className="font-medium hover:underline">{property.title}</Link></td>
                  <td className="px-3 py-3 text-neutral-600">{property.city}, {property.state}</td>
                  <td className="px-3 py-3">{label(property.status, isArabic)}</td>
                  <td className="px-3 py-3">{property.listingType === "RENT" ? (isArabic ? "إيجار" : "Rent") : (isArabic ? "بيع" : "Sale")}</td>
                  <td className="px-3 py-3">{label(property.category, isArabic)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{property.price.toLocaleString(isArabic ? "ar-SA" : "en-US")}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{property.viewCount.toLocaleString("en-US")}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{new Date(property.createdAt).toLocaleDateString(isArabic ? "ar-SA" : "en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

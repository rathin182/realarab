"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

const selectClass = "h-10 rounded-md border border-[#d8d3c8] bg-white px-3 text-sm text-[#24231f]";

export default function AdminPropertiesTable({ properties }: { properties: AdminProperty[] }) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredProperties = useMemo(() => properties.filter((property) =>
    !normalizedSearch || `${property.title} ${property.city} ${property.state}`.toLocaleLowerCase().includes(normalizedSearch)
  ), [properties, normalizedSearch]);

  return (
    <section id="properties" className="overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
      <div dir={isArabic ? "rtl" : "ltr"} className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e4db] px-5 py-4">
        <div>
          <h2 className="font-serif text-xl">{isArabic ? "العقارات" : "Properties"}</h2>
          <p className="mt-1 text-xs text-neutral-500">{isArabic ? `أكثر ${properties.length} عقارات مشاهدة` : `Top ${properties.length} most viewed properties`}</p>
        </div>
        <Link href="/admin/properties" className="text-sm text-neutral-600 hover:underline">{isArabic ? "إدارة العقارات" : "Manage properties"}</Link>
      </div>

      <div dir={isArabic ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-2 border-b border-[#e8e4db] px-5 py-4">
        <label className="sr-only" htmlFor="property-search">{isArabic ? "البحث في العقارات" : "Search properties"}</label>
        <input id="property-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isArabic ? "ابحث بالاسم أو الموقع" : "Search title or location"} className={`${selectClass} min-w-48 flex-1`} />
      </div>

      {filteredProperties.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-neutral-500">{properties.length === 0 ? (isArabic ? "لا توجد عقارات بعد. أضف عقارًا للبدء." : "No properties yet. Add a property to get started.") : (isArabic ? "لا توجد عقارات تطابق عوامل التصفية." : "No properties match these filters.")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table dir={isArabic ? "rtl" : "ltr"} className="w-full min-w-[980px] text-sm">
            <thead className="bg-[#f4f1ea] text-xs text-neutral-500">
              <tr>
                <th className="px-3 py-3 text-left font-medium">{isArabic ? "العقار" : "Property"}</th>
                <th className="px-3 py-3 text-left font-medium">{isArabic ? "الموقع" : "Location"}</th>
                <th className="px-3 py-3 text-left font-medium">{isArabic ? "نوع العرض" : "Listing"}</th>
                <th className="px-3 py-3 text-left font-medium">{isArabic ? "الفئة" : "Category"}</th>
                <th className="px-3 py-3 text-right font-medium">{isArabic ? "السعر (ريال)" : "Price (SAR)"}</th>
                <th className="px-3 py-3 text-right font-medium">{isArabic ? "المشاهدات" : "Views"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr key={property.id} className="border-t border-[#e8e4db]">
                  <td className="px-5 py-3"><Link href={`/properties/${property.slug}`} className="font-medium hover:underline">{property.title}</Link></td>
                  <td className="px-3 py-3 text-neutral-600">{property.city}, {property.state}</td>
                  <td className="px-3 py-3">{property.listingType === "RENT" ? (isArabic ? "إيجار" : "Rent") : (isArabic ? "بيع" : "Sale")}</td>
                  <td className="px-3 py-3">{property.category.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{property.price.toLocaleString(isArabic ? "ar-SA" : "en-US")}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{property.viewCount.toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

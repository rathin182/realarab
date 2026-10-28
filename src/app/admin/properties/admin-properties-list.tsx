"use client";

import Link from "next/link";
import { useSiteLanguage } from "@/components/providers/LanguageContext";
import { RemovePropertyButton } from "./remove-property-button";

type Property = {
  id: string;
  slug: string;
  title: string;
  city: string;
  price: number;
  viewCount: number;
};

export default function AdminPropertiesList({ properties }: { properties: Property[] }) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#f3f1eb] px-4 py-8 text-[#24231f] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm text-neutral-600 hover:underline">{isArabic ? "← لوحة التحكم" : "← Back to dashboard"}</Link>
        <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl">{isArabic ? "العقارات" : "Properties"}</h1>
            <p className="mt-1 text-sm text-neutral-500">{isArabic ? `${properties.length} عقار منشور` : `${properties.length} live ${properties.length === 1 ? "property" : "properties"}`}</p>
          </div>
          <Link href="/admin/properties/new" className="rounded-md bg-[#292820] px-4 py-2.5 text-sm text-white hover:bg-[#454337]">{isArabic ? "إضافة عقار" : "Add property"}</Link>
        </header>

        <section className="mt-6 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          {properties.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-neutral-500">{isArabic ? "لا توجد عقارات منشورة. أضف عقارًا لنشره على الموقع." : "No live properties. Add a property to publish it on the website."}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-start text-sm">
                <thead className="bg-[#f4f1ea] text-xs text-neutral-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">{isArabic ? "العقار" : "Property"}</th>
                    <th className="px-3 py-3 font-medium">{isArabic ? "الموقع" : "Location"}</th>
                    <th className="px-3 py-3 text-end font-medium">{isArabic ? "السعر (ريال)" : "Price (SAR)"}</th>
                    <th className="px-3 py-3 text-end font-medium">{isArabic ? "المشاهدات" : "Views"}</th>
                    <th className="px-5 py-3 text-end font-medium">{isArabic ? "إجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-t border-[#e8e4db]">
                      <td className="px-5 py-3"><Link href={`/properties/${property.slug}`} className="font-medium hover:underline">{property.title}</Link></td>
                      <td className="px-3 py-3 text-neutral-600">{property.city}</td>
                      <td className="px-3 py-3 text-end tabular-nums">{property.price.toLocaleString(isArabic ? "ar-SA" : "en-US")}</td>
                      <td className="px-3 py-3 text-end tabular-nums">{property.viewCount.toLocaleString(isArabic ? "ar-SA" : "en-US")}</td>
                      <td className="px-5 py-3 text-end"><RemovePropertyButton propertyTitle={property.title} propertyId={property.id} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

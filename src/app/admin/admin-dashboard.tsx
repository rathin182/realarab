"use client";

import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { useSiteLanguage } from "@/components/providers/LanguageContext";
import { Building2, ChartNoAxesColumn, ClipboardList, LayoutDashboard, type LucideIcon } from "lucide-react";
import AdminPropertiesTable from "./admin-properties-table";

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

type AdminDashboardProps = {
  email: string;
  totalProperties: number;
  liveProperties: number;
  enquiries: number;
  properties: AdminProperty[];
};

function Stat({ label, value, icon: Icon, tone }: { label: string; value: number; icon: LucideIcon; tone: string }) {
  return (
    <div className="flex min-h-36 flex-col overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5] shadow-sm transition-shadow hover:shadow-md">
      <div className={`h-1 w-full ${tone}`} />
      <div className="flex flex-1 items-start justify-between gap-4 p-5">
        <div className="flex min-h-24 flex-col">
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-auto pt-3 font-serif text-4xl font-medium tabular-nums text-[#24231f]">{value.toLocaleString()}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[#e8e4db] bg-white text-[#6e654f]">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboard({ email, totalProperties, liveProperties, enquiries, properties }: AdminDashboardProps) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#f3f1eb] text-[#24231f] md:grid md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="flex flex-col border-r border-[#e3dfd5] bg-[#faf9f5] p-4 md:min-h-screen">
        <Link href="/admin" className="mb-8 flex items-center gap-3 px-2 py-3 font-serif text-xl">
          <Building2 className="h-6 w-6 text-[#8f7654]" /> NAJAM {isArabic ? "الإدارة" : "Admin"}
        </Link>
        <nav aria-label={isArabic ? "أقسام الإدارة" : "Admin sections"} className="space-y-1 text-sm">
          <a href="#dashboard" className="flex items-center gap-3 rounded-md bg-[#eee8dc] px-3 py-2.5"><LayoutDashboard className="h-4 w-4" />{isArabic ? "لوحة التحكم" : "Dashboard"}</a>
          <Link href="/admin/properties" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-neutral-600 hover:bg-[#f2efe8]"><Building2 className="h-4 w-4" />{isArabic ? "العقارات" : "Properties"}</Link>
          <Link href="/admin/review" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-neutral-600 hover:bg-[#f2efe8]"><ClipboardList className="h-4 w-4" />{isArabic ? "الطلبات" : "Requests"}</Link>
          <a href="#analytics" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-neutral-600 hover:bg-[#f2efe8]"><ChartNoAxesColumn className="h-4 w-4" />{isArabic ? "التحليلات" : "Analytics"}</a>
        </nav>
        <div className="mt-auto border-t border-[#e3dfd5] pt-4">
          <form action={logoutAction}>
            <button className="w-full rounded-md border border-[#e3dfd5] px-3 py-2 text-start text-sm text-neutral-600">{isArabic ? "تسجيل الخروج" : "Log out"}</button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 space-y-5 p-4 sm:p-6 lg:p-8">
        <header id="dashboard" className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl">{isArabic ? "لوحة التحكم" : "Dashboard"}</h1>
            <p className="mt-1 text-sm text-neutral-500">{isArabic ? "تم تسجيل الدخول باسم" : "Signed in as"} {email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/properties/new" className="rounded-md bg-[#292820] px-4 py-2.5 text-sm text-white hover:bg-[#454337]">{isArabic ? "إضافة عقار" : "Add property"}</Link>
            <Link href="/admin/review" className="rounded-md border border-[#d8d3c8] bg-white px-4 py-2.5 text-sm">{isArabic ? "مراجعة الطلبات" : "Review requests"}</Link>
          </div>
        </header>

        <section id="analytics" className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          <Stat label={isArabic ? "إجمالي العقارات" : "Total properties"} value={totalProperties} icon={Building2} tone="bg-[#71816b]" />
          <Stat label={isArabic ? "العقارات النشطة" : "Live properties"} value={liveProperties} icon={ChartNoAxesColumn} tone="bg-[#b89b72]" />
          <Stat label={isArabic ? "طلبات الاستفسار" : "Inquiry requests"} value={enquiries} icon={ClipboardList} tone="bg-[#a76f5a]" />
        </section>

        <AdminPropertiesTable properties={properties} />
      </div>
    </main>
  );
}

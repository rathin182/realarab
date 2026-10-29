"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { useSiteLanguage } from "@/components/providers/LanguageContext";
import { Building2, ChartNoAxesColumn, ClipboardList, Contact, LayoutDashboard } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { language } = useSiteLanguage();
  const pathname = usePathname();
  const isArabic = language === "ar";
  const linkClass = (active: boolean) => `flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${active ? "bg-[#eee8dc] text-[#24231f]" : "text-neutral-600 hover:bg-[#f2efe8]"}`;

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-[#f3f1eb] text-[#24231f] md:grid md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="flex flex-col border-r border-[#e3dfd5] bg-[#faf9f5] p-4 md:min-h-screen">
        <Link href="/admin" className="mb-8 flex items-center gap-3 px-2 py-3 font-serif text-xl"><Building2 className="h-6 w-6 text-[#8f7654]" /> NAJAM {isArabic ? "الإدارة" : "Admin"}</Link>
        <nav aria-label={isArabic ? "أقسام الإدارة" : "Admin sections"} className="space-y-1 text-sm">
          <Link href="/admin" aria-current={pathname === "/admin" ? "page" : undefined} className={linkClass(pathname === "/admin")}><LayoutDashboard className="h-4 w-4" />{isArabic ? "لوحة التحكم" : "Dashboard"}</Link>
          <Link href="/admin/properties" aria-current={pathname.startsWith("/admin/properties") ? "page" : undefined} className={linkClass(pathname.startsWith("/admin/properties"))}><Building2 className="h-4 w-4" />{isArabic ? "العقارات" : "Properties"}</Link>
          <Link href="/admin/review" aria-current={pathname.startsWith("/admin/review") ? "page" : undefined} className={linkClass(pathname.startsWith("/admin/review"))}><ClipboardList className="h-4 w-4" />{isArabic ? "الطلبات" : "Requests"}</Link>
          <Link href="/admin/contact" aria-current={pathname === "/admin/contact" ? "page" : undefined} className={linkClass(pathname === "/admin/contact")}><Contact className="h-4 w-4" />{isArabic ? "بيانات التواصل" : "Contact info"}</Link>
          {/* <Link href="/admin#analytics" className={linkClass(false)}><ChartNoAxesColumn className="h-4 w-4" />{isArabic ? "التحليلات" : "Analytics"}</Link> */}
        </nav>
        <div className="mt-auto border-t border-[#e3dfd5] pt-4"><form action={logoutAction}><button className="w-full rounded-md border border-[#e3dfd5] px-3 py-2 text-start text-sm text-neutral-600">{isArabic ? "تسجيل الخروج" : "Log out"}</button></form></div>
      </aside>
      <div className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}

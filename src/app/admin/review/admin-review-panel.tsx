"use client";

import Link from "next/link";
import { resolveReport, reviewAgentApplication, reviewListing } from "@/actions/admin";
import { useSiteLanguage } from "@/components/providers/LanguageContext";

type AgentApplication = {
  id: string;
  agencyName: string;
  reraState: string;
  reraNumber: string;
  phone: string;
  user: { name: string | null; email: string };
};

type Listing = {
  id: string;
  title: string;
  price: number;
  listingType: string;
  category: string;
  addressLine: string | null;
  locality: string | null;
  city: string;
  owner: { email: string; role: string };
};

type Report = {
  id: string;
  reason: string;
  createdAt: string;
  details: string | null;
  listing: { title: string; slug: string; status: string };
  reporter: { email: string };
};

type AdminReviewPanelProps = {
  applications: AgentApplication[];
  listings: Listing[];
  reports: Report[];
};

const inputClass = "rounded border p-1 text-sm";
const buttonClass = "rounded border px-3 py-1 text-sm";

export default function AdminReviewPanel({ applications, listings, reports }: AdminReviewPanelProps) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const labels = isArabic ? {
    back: "← لوحة التحكم",
    agentApplications: "طلبات الوكلاء",
    pendingListings: "العقارات بانتظار المراجعة",
    reportedListings: "العقارات المُبلّغ عنها",
    nonePending: "لا توجد طلبات معلقة.",
    noReports: "لا توجد بلاغات مفتوحة.",
    rejectReason: "سبب الرفض (اختياري)",
    approve: "موافقة",
    reject: "رفض",
    takeDown: "إزالة من الموقع",
    dismiss: "تجاهل",
    by: "بواسطة",
    reportReasons: { SPAM: "محتوى مزعج", FAKE: "احتيال", DUPLICATE: "مكرر", WRONG_INFO: "معلومات خاطئة", OTHER: "أخرى" } as Record<string, string>,
    categories: { RESIDENTIAL: "سكني", COMMERCIAL: "تجاري", LAND: "أرض" } as Record<string, string>,
    listingTypes: { SALE: "بيع", RENT: "إيجار" } as Record<string, string>,
  } : {
    back: "← Admin dashboard",
    agentApplications: "Agent applications",
    pendingListings: "Listings awaiting review",
    reportedListings: "Reported listings",
    nonePending: "None pending.",
    noReports: "No open reports.",
    rejectReason: "Reject reason (optional)",
    approve: "Approve",
    reject: "Reject",
    takeDown: "Take down",
    dismiss: "Dismiss",
    by: "by",
    reportReasons: { SPAM: "Spam", FAKE: "Fake", DUPLICATE: "Duplicate", WRONG_INFO: "Wrong info", OTHER: "Other" } as Record<string, string>,
    categories: { RESIDENTIAL: "Residential", COMMERCIAL: "Commercial", LAND: "Land" } as Record<string, string>,
    listingTypes: { SALE: "Sale", RENT: "Rent" } as Record<string, string>,
  };
  const reasonPlaceholder = labels.rejectReason;
  const approvalButtonClass = "rounded bg-black px-3 py-1 text-sm text-white";

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="mx-auto min-h-screen max-w-5xl space-y-10">
      {/* <Link href="/admin" className="text-sm underline">{labels.back}</Link> */}

      <section>
        <h2 className="mb-3 text-lg font-medium">{labels.agentApplications} ({applications.length})</h2>
        {applications.length === 0 && <p className="text-sm text-gray-500">{labels.nonePending}</p>}
        {applications.map((application) => (
          <form key={application.id} action={reviewAgentApplication} className="mb-3 flex flex-wrap items-center gap-3 rounded border p-3">
            <input type="hidden" name="id" value={application.id} />
            <div className="min-w-64 flex-1 text-sm">
              <b>{application.agencyName}</b> · {application.user.name} ({application.user.email})
              <br />
              <span className="text-gray-600">RERA {application.reraState} / {application.reraNumber} · {application.phone}</span>
            </div>
            <input name="reason" placeholder={reasonPlaceholder} className={inputClass} />
            <button name="decision" value="APPROVED" className={approvalButtonClass}>{labels.approve}</button>
            <button name="decision" value="REJECTED" className={buttonClass}>{labels.reject}</button>
          </form>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">{labels.pendingListings} ({listings.length})</h2>
        {listings.length === 0 && <p className="text-sm text-gray-500">{labels.nonePending}</p>}
        {listings.map((listing) => (
          <form key={listing.id} action={reviewListing} className="mb-3 flex flex-wrap items-center gap-3 rounded border p-3">
            <input type="hidden" name="id" value={listing.id} />
            <div className="min-w-64 flex-1 text-sm">
              <b>{listing.title}</b> · {isArabic ? "ر.س" : "SAR"} {listing.price.toLocaleString(isArabic ? "ar-SA" : "en-IN")} · {labels.listingTypes[listing.listingType]} · {labels.categories[listing.category]}
              <br />
              <span className="text-gray-600">
                {[listing.addressLine, listing.locality, listing.city].filter(Boolean).join(", ")} · {listing.owner.email} ({listing.owner.role})
              </span>
            </div>
            <input name="reason" placeholder={reasonPlaceholder} className={inputClass} />
            <button name="decision" value="LIVE" className={approvalButtonClass}>{labels.approve}</button>
            <button name="decision" value="REJECTED" className={buttonClass}>{labels.reject}</button>
          </form>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">{labels.reportedListings} ({reports.length})</h2>
        {reports.length === 0 && <p className="text-sm text-gray-500">{labels.noReports}</p>}
        {reports.map((report) => (
          <form key={report.id} action={resolveReport} className="mb-3 flex flex-wrap items-center gap-3 rounded border p-3">
            <input type="hidden" name="id" value={report.id} />
            <div className="min-w-64 flex-1 text-sm">
              <Link href={`/properties/${report.listing.slug}`} className="font-bold underline">{report.listing.title}</Link>{" "}
              <span className="text-gray-500">({report.listing.status})</span>
              <br />
              <span className="text-gray-600">
                {labels.reportReasons[report.reason] ?? report.reason.replaceAll("_", " ")} · {labels.by} {report.reporter.email} · {new Date(report.createdAt).toLocaleDateString(isArabic ? "ar-SA" : "en-IN")}
              </span>
              {report.details && <p className="mt-1 text-gray-700">{report.details}</p>}
            </div>
            <button name="decision" value="TAKEDOWN" className={approvalButtonClass}>{labels.takeDown}</button>
            <button name="decision" value="DISMISS" className={buttonClass}>{labels.dismiss}</button>
          </form>
        ))}
      </section>
    </main>
  );
}

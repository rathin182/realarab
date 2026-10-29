"use client";

import Link from "next/link";
import { resolveReport, reviewAgentApplication, reviewListing, updateEnquiryStatus } from "@/actions/admin";
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

type PropertyRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  investorType: string | null;
  status: string;
  source: string | null;
  createdAt: string;
  propertyTitle: string | null;
  propertySlug: string | null;
};

type AdminReviewPanelProps = {
  applications: AgentApplication[];
  enquiries: PropertyRequest[];
  listings: Listing[];
  reports: Report[];
};

const inputClass = "rounded border p-1 text-sm";
const buttonClass = "rounded border px-3 py-1 text-sm";

const statusBadge: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-800",
  CONTACTED: "bg-blue-100 text-blue-800",
  VISIT_SCHEDULED: "bg-purple-100 text-purple-800",
  CLOSED: "bg-emerald-100 text-emerald-800",
  NOT_INTERESTED: "bg-neutral-200 text-neutral-600",
};

const sourceLabel = (source: string | null, isArabic: boolean) => {
  if (source === "home-modal") return isArabic ? "الصفحة الرئيسية" : "Homepage";
  if (source === "property-page") return isArabic ? "صفحة العقار" : "Property page";
  return source;
};

export default function AdminReviewPanel({ applications, enquiries, listings, reports }: AdminReviewPanelProps) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const labels = isArabic ? {
    back: "← لوحة التحكم",
    agentApplications: "طلبات الوكلاء",
    propertyRequests: "طلبات العقارات من الموقع",
    noRequests: "لا توجد طلبات عقارات بعد.",
    save: "حفظ",
    enquiryStatuses: { NEW: "جديد", CONTACTED: "تم التواصل", VISIT_SCHEDULED: "تمت جدولة زيارة", CLOSED: "مغلق", NOT_INTERESTED: "غير مهتم" } as Record<string, string>,
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
    propertyRequests: "Property requests from the website",
    noRequests: "No property requests yet.",
    save: "Save",
    enquiryStatuses: { NEW: "New", CONTACTED: "Contacted", VISIT_SCHEDULED: "Visit scheduled", CLOSED: "Closed", NOT_INTERESTED: "Not interested" } as Record<string, string>,
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[#0C3826]">{labels.propertyRequests}</h2>
          <div className="flex gap-2 text-xs">
            <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800">
              {enquiries.filter((e) => e.status === "NEW").length} {isArabic ? "جديد" : "new"}
            </span>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
              {enquiries.length} {isArabic ? "الإجمالي" : "total"}
            </span>
          </div>
        </div>

        {enquiries.length === 0 && (
          <p className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-gray-500">{labels.noRequests}</p>
        )}

        <div className="space-y-3">
          {enquiries.map((enquiry) => (
            <form
              key={enquiry.id}
              action={updateEnquiryStatus}
              className={`flex flex-col gap-4 rounded-lg border border-neutral-200 border-s-4 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between ${enquiry.status === "NEW" ? "border-s-[#A98950]" : "border-s-neutral-300"}`}
            >
              <input type="hidden" name="id" value={enquiry.id} />

              <div className="min-w-0 flex-1 space-y-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  {enquiry.propertySlug
                    ? <Link href={`/properties/${enquiry.propertySlug}`} className="text-base font-semibold text-[#0C3826] hover:underline">{enquiry.propertyTitle ?? enquiry.propertySlug}</Link>
                    : <span className="text-base font-semibold text-[#0C3826]">{enquiry.propertyTitle ?? "—"}</span>}
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[enquiry.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                    {labels.enquiryStatuses[enquiry.status] ?? enquiry.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-700">
                  <span className="font-medium">{enquiry.name}</span>
                  {enquiry.phone && <a href={`tel:${enquiry.phone}`} className="hover:underline">📞 {enquiry.phone}</a>}
                  {!enquiry.email.endsWith("@guest.local") && <a href={`mailto:${enquiry.email}`} className="hover:underline">✉️ {enquiry.email}</a>}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  {enquiry.investorType && <span className="rounded bg-neutral-100 px-2 py-0.5">{enquiry.investorType}</span>}
                  {enquiry.source && <span className="rounded bg-neutral-100 px-2 py-0.5">{sourceLabel(enquiry.source, isArabic)}</span>}
                  <span>{new Date(enquiry.createdAt).toLocaleString(isArabic ? "ar-SA" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>

                {enquiry.message && (
                  <p className="rounded-md bg-neutral-50 px-3 py-2 text-neutral-700">{enquiry.message}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <select key={`${enquiry.id}-${enquiry.status}`} name="status" defaultValue={enquiry.status} className="h-10 rounded-md border border-neutral-300 bg-white px-3 text-sm">
                  {Object.entries(labels.enquiryStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <button className="h-10 rounded-md bg-[#0C3826] px-4 text-sm font-medium text-white hover:bg-[#08281B]">{labels.save}</button>
              </div>
            </form>
          ))}
        </div>
      </section>

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
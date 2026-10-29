"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { Phone, Mail, Clock, ChevronDown } from "lucide-react";
import { updateEnquiryStatus, updateMandateStatus } from "@/actions/admin";
import { useSiteLanguage } from "@/components/providers/LanguageContext";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

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

type AcquisitionMandate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  investorType: string;
  allocationTier: string | null;
  region: string | null;
  message: string | null;
  source: string | null;
  status: string;
  createdAt: string;
};

type AdminReviewPanelProps = {
  enquiries: PropertyRequest[];
  mandates: AcquisitionMandate[];
  // Still accepted so the parent page compiles. Remove these from the
  // parent, then delete these three lines.
  applications?: unknown;
  listings?: unknown;
  reports?: unknown;
};

// How many requests to render at a time; more load as the admin scrolls.
const PAGE_SIZE = 10;

// Soft off-white used instead of pure white. Change it in one place.
const CARD_BG = "bg-[#FBFAF7]";
// Slightly darker tone for chips and the message box inside a card.
const INNER_BG = "bg-[#F3F1EB]";

const statusBadge: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-800",
  CONTACTED: "bg-blue-100 text-blue-800",
  VISIT_SCHEDULED: "bg-purple-100 text-purple-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  CLOSED: "bg-emerald-100 text-emerald-800",
  NOT_INTERESTED: "bg-neutral-200 text-neutral-700",
};

// Left accent bar colour for each status (matches the badge colours)
const statusAccent: Record<string, string> = {
  NEW: "bg-[#A98950]",
  CONTACTED: "bg-blue-500",
  VISIT_SCHEDULED: "bg-purple-500",
  IN_PROGRESS: "bg-purple-500",
  CLOSED: "bg-emerald-500",
  NOT_INTERESTED: "bg-neutral-300",
};

const sourceLabel = (source: string | null, isArabic: boolean) => {
  if (source === "home-modal") return isArabic ? "الصفحة الرئيسية" : "Homepage";
  if (source === "property-page") return isArabic ? "صفحة العقار" : "Property page";
  if (source === "home-faq") return isArabic ? "الصفحة الرئيسية" : "Homepage";
  if (source === "contact-page") return isArabic ? "صفحة التواصل" : "Contact page";
  return source;
};

const formatDate = (date: string, isArabic: boolean) =>
  new Date(date).toLocaleString(isArabic ? "ar-SA" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

// Progressive loading: render PAGE_SIZE items, load more as the sentinel nears the viewport.
function useProgressive(total: number) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = visibleCount < total;

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, total));
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // visibleCount is a dependency so the observer re-arms after each batch
    // and keeps loading if the sentinel is still on screen.
  }, [hasMore, visibleCount, total]);

  return { visibleCount, hasMore, sentinelRef };
}

function StatusActions({
  id,
  status,
  statuses,
  ariaLabel,
  saveLabel,
}: {
  id: string;
  status: string;
  statuses: Record<string, string>;
  ariaLabel: string;
  saveLabel: string;
}) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:items-center">
      <input type="hidden" name="id" value={id} />
      <div className="relative min-w-0 flex-1 sm:min-w-[190px] lg:flex-none">
        <select
          key={`${id}-${status}`}
          name="status"
          defaultValue={status}
          aria-label={ariaLabel}
          className={`h-11 w-full appearance-none rounded-xl border border-neutral-200 ${CARD_BG} ps-3 pe-9 text-sm font-medium text-neutral-800 outline-none transition focus:border-[#0C3826] focus:ring-2 focus:ring-[#0C3826]/10`}
        >
          {Object.entries(statuses).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      </div>

      <button
        type="submit"
        className="h-11 rounded-xl bg-[#0C3826] px-6 text-sm font-semibold text-white transition hover:bg-[#08281B] focus:outline-none focus:ring-2 focus:ring-[#0C3826]/30 focus:ring-offset-2"
      >
        {saveLabel}
      </button>
    </div>
  );
}

function LoadMore({
  hasMore,
  sentinelRef,
  shown,
  total,
  isArabic,
}: {
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  shown: number;
  total: number;
  isArabic: boolean;
}) {
  if (hasMore) {
    return (
      <div
        ref={sentinelRef}
        className="flex items-center justify-center gap-3 py-4 text-sm text-neutral-500"
        role="status"
        aria-live="polite"
      >
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-[#0C3826]" />
        {isArabic ? `عرض ${shown} من ${total}` : `Showing ${shown} of ${total}`}
      </div>
    );
  }
  if (total > PAGE_SIZE) {
    return (
      <p className="py-4 text-center text-sm text-neutral-500">
        {isArabic ? `تم عرض جميع الطلبات (${total})` : `All ${total} requests loaded`}
      </p>
    );
  }
  return null;
}

export default function AdminReviewPanel({ enquiries, mandates }: AdminReviewPanelProps) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const [tab, setTab] = useState<"property" | "mandates">("property");

  const propertyScroll = useProgressive(enquiries.length);
  const mandateScroll = useProgressive(mandates.length);

  const propertyNew = enquiries.filter((e) => e.status === "NEW").length;
  const mandateNew = mandates.filter((m) => m.status === "NEW").length;

  const labels = isArabic
    ? {
        propertyRequests: "طلبات العقارات من الموقع",
        mandateRequests: "تفويضات الاستحواذ المسجلة",
        propertyTab: "طلبات العقارات",
        mandatesTab: "تفويضات الاستحواذ",
        noRequests: "لا توجد طلبات عقارات بعد.",
        noMandates: "لا توجد تفويضات استحواذ بعد.",
        save: "حفظ",
        enquiryStatuses: {
          NEW: "جديد",
          CONTACTED: "تم التواصل",
          VISIT_SCHEDULED: "تمت جدولة زيارة",
          CLOSED: "مغلق",
          NOT_INTERESTED: "غير مهتم",
        } as Record<string, string>,
        mandateStatuses: {
          NEW: "جديد",
          CONTACTED: "تم التواصل",
          IN_PROGRESS: "قيد المتابعة",
          CLOSED: "مغلق",
          NOT_INTERESTED: "غير مهتم",
        } as Record<string, string>,
        new: "جديد",
        total: "الإجمالي",
        tabs: "أنواع الطلبات",
      }
    : {
        propertyRequests: "Property requests from the website",
        mandateRequests: "Registered acquisition mandates",
        propertyTab: "Property requests",
        mandatesTab: "Acquisition mandates",
        noRequests: "No property requests yet.",
        noMandates: "No acquisition mandates yet.",
        save: "Save",
        enquiryStatuses: {
          NEW: "New",
          CONTACTED: "Contacted",
          VISIT_SCHEDULED: "Visit scheduled",
          CLOSED: "Closed",
          NOT_INTERESTED: "Not interested",
        } as Record<string, string>,
        mandateStatuses: {
          NEW: "New",
          CONTACTED: "Contacted",
          IN_PROGRESS: "In progress",
          CLOSED: "Closed",
          NOT_INTERESTED: "Not interested",
        } as Record<string, string>,
        new: "New",
        total: "Total",
        tabs: "Request types",
      };

  const isProperty = tab === "property";
  const newCount = isProperty ? propertyNew : mandateNew;
  const totalCount = isProperty ? enquiries.length : mandates.length;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto min-h-screen w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8"
    >
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <h2
            className={`${serif.className} text-4xl font-semibold tracking-tight text-[#0C3826] sm:text-5xl`}
          >
            {isProperty ? labels.propertyRequests : labels.mandateRequests}
          </h2>

          {/* Counters (for the active tab) */}
          <div className="flex items-stretch gap-3">
            <div className={`flex items-center gap-3 rounded-2xl ${CARD_BG} px-5 py-3`}>
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#A98950]" />
              <span className={`${serif.className} text-4xl font-bold leading-none text-[#0C3826]`}>
                {newCount}
              </span>
              <span className="text-sm font-medium text-neutral-500">{labels.new}</span>
            </div>

            <div className={`flex items-center gap-3 rounded-2xl ${CARD_BG} px-5 py-3`}>
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
              <span className={`${serif.className} text-4xl font-bold leading-none text-[#0C3826]`}>
                {totalCount}
              </span>
              <span className="text-sm font-medium text-neutral-500">{labels.total}</span>
            </div>
          </div>
        </div>

        {/* Sticky request tabs: sit directly below the navbar while scrolling. */}
        <div
          role="tablist"
          aria-label={labels.tabs}
          className="sticky top-[80px] z-40 -mx-4 flex gap-2 border-b border-neutral-200 bg-[#F3F1EB] px-4 shadow-sm sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10"
        >
          {(
            [
              { key: "property", label: labels.propertyTab, fresh: propertyNew, total: enquiries.length },
              { key: "mandates", label: labels.mandatesTab, fresh: mandateNew, total: mandates.length },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                tab === item.key
                  ? "border-[#0C3826] text-[#0C3826]"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  item.fresh > 0 ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {item.fresh > 0 ? `${item.fresh} ${labels.new.toLowerCase()}` : item.total}
              </span>
            </button>
          ))}
        </div>

        {/* PROPERTY REQUESTS */}
        {isProperty &&
          (enquiries.length === 0 ? (
            <p className={`rounded-2xl ${CARD_BG} p-8 text-center text-base text-neutral-500`}>
              {labels.noRequests}
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {enquiries.slice(0, propertyScroll.visibleCount).map((enquiry) => (
                  <form
                    key={enquiry.id}
                    action={updateEnquiryStatus}
                    className={`relative grid grid-cols-1 gap-5 overflow-hidden rounded-2xl ${CARD_BG} p-5 ps-7 sm:p-6 sm:ps-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 start-0 w-1.5 ${statusAccent[enquiry.status] ?? "bg-neutral-300"}`}
                    />

                    <div className="min-w-0 space-y-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {enquiry.propertySlug ? (
                          <Link
                            href={`/properties/${enquiry.propertySlug}`}
                            className="break-words text-lg font-semibold leading-snug text-[#0C3826] hover:underline"
                          >
                            {enquiry.propertyTitle ?? enquiry.propertySlug}
                          </Link>
                        ) : (
                          <span className="break-words text-lg font-semibold leading-snug text-[#0C3826]">
                            {enquiry.propertyTitle ?? "—"}
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            statusBadge[enquiry.status] ?? "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {labels.enquiryStatuses[enquiry.status] ?? enquiry.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-700">
                        <span className="text-base font-semibold text-neutral-900">{enquiry.name}</span>

                        {enquiry.phone && (
                          <a
                            href={`tel:${enquiry.phone}`}
                            dir="ltr"
                            className="inline-flex items-center gap-2 break-all hover:text-[#0C3826] hover:underline"
                          >
                            <Phone className="h-4 w-4 shrink-0 text-neutral-400" />
                            {enquiry.phone}
                          </a>
                        )}

                        {!enquiry.email.endsWith("@guest.local") && (
                          <a
                            href={`mailto:${enquiry.email}`}
                            className="inline-flex items-center gap-2 break-all hover:text-[#0C3826] hover:underline"
                          >
                            <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
                            {enquiry.email}
                          </a>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                        {enquiry.investorType && (
                          <span className={`rounded-full ${INNER_BG} px-3 py-1`}>{enquiry.investorType}</span>
                        )}
                        {enquiry.source && (
                          <span className={`rounded-full ${INNER_BG} px-3 py-1`}>
                            {sourceLabel(enquiry.source, isArabic)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-neutral-500">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(enquiry.createdAt, isArabic)}
                        </span>
                      </div>

                      {enquiry.message && (
                        <p className={`rounded-xl ${INNER_BG} px-4 py-3 text-sm leading-relaxed text-neutral-700`}>
                          {enquiry.message}
                        </p>
                      )}
                    </div>

                    <StatusActions
                      id={enquiry.id}
                      status={enquiry.status}
                      statuses={labels.enquiryStatuses}
                      ariaLabel={`Status for ${enquiry.propertyTitle ?? enquiry.name}`}
                      saveLabel={labels.save}
                    />
                  </form>
                ))}
              </div>

              <LoadMore
                hasMore={propertyScroll.hasMore}
                sentinelRef={propertyScroll.sentinelRef}
                shown={Math.min(propertyScroll.visibleCount, enquiries.length)}
                total={enquiries.length}
                isArabic={isArabic}
              />
            </>
          ))}

        {/* ACQUISITION MANDATES */}
        {!isProperty &&
          (mandates.length === 0 ? (
            <p className={`rounded-2xl ${CARD_BG} p-8 text-center text-base text-neutral-500`}>
              {labels.noMandates}
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {mandates.slice(0, mandateScroll.visibleCount).map((mandate) => (
                  <form
                    key={mandate.id}
                    action={updateMandateStatus}
                    className={`relative grid grid-cols-1 gap-5 overflow-hidden rounded-2xl ${CARD_BG} p-5 ps-7 sm:p-6 sm:ps-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 start-0 w-1.5 ${statusAccent[mandate.status] ?? "bg-neutral-300"}`}
                    />

                    <div className="min-w-0 space-y-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="break-words text-lg font-semibold leading-snug text-[#0C3826]">
                          {mandate.name}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            statusBadge[mandate.status] ?? "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {labels.mandateStatuses[mandate.status] ?? mandate.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-700">
                        <a
                          href={`tel:${mandate.phone}`}
                          dir="ltr"
                          className="inline-flex items-center gap-2 break-all hover:text-[#0C3826] hover:underline"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-neutral-400" />
                          {mandate.phone}
                        </a>
                        <a
                          href={`mailto:${mandate.email}`}
                          className="inline-flex items-center gap-2 break-all hover:text-[#0C3826] hover:underline"
                        >
                          <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
                          {mandate.email}
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                        <span className={`rounded-full ${INNER_BG} px-3 py-1`}>{mandate.investorType}</span>
                        {mandate.allocationTier && (
                          <span className={`rounded-full ${INNER_BG} px-3 py-1`}>{mandate.allocationTier}</span>
                        )}
                        {mandate.region && (
                          <span className={`rounded-full ${INNER_BG} px-3 py-1`}>{mandate.region}</span>
                        )}
                        {mandate.source && (
                          <span className={`rounded-full ${INNER_BG} px-3 py-1`}>
                            {sourceLabel(mandate.source, isArabic)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-neutral-500">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(mandate.createdAt, isArabic)}
                        </span>
                      </div>

                      {mandate.message && (
                        <p
                          className={`whitespace-pre-line rounded-xl ${INNER_BG} px-4 py-3 text-sm leading-relaxed text-neutral-700`}
                        >
                          {mandate.message}
                        </p>
                      )}
                    </div>

                    <StatusActions
                      id={mandate.id}
                      status={mandate.status}
                      statuses={labels.mandateStatuses}
                      ariaLabel={`Status for ${mandate.name}`}
                      saveLabel={labels.save}
                    />
                  </form>
                ))}
              </div>

              <LoadMore
                hasMore={mandateScroll.hasMore}
                sentinelRef={mandateScroll.sentinelRef}
                shown={Math.min(mandateScroll.visibleCount, mandates.length)}
                total={mandates.length}
                isArabic={isArabic}
              />
            </>
          ))}
      </section>
    </main>
  );
}
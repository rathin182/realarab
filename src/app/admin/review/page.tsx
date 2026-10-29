
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import AdminReviewPanel from "./admin-review-panel";
import AdminLayout from "../admin-layout";

export default async function ReviewPage() {
  await requireAdmin();

  const [
    applications,
    listings,
    reports,
    enquiries,
    mandates,
  ] = await Promise.all([
    prisma.agentApplication.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.listing.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { createdAt: "asc" },
      include: { owner: { select: { email: true, role: true } } },
    }),
    prisma.report.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "asc" },
      include: {
        listing: { select: { title: true, slug: true, status: true } },
        reporter: { select: { email: true } },
      },
    }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { listing: { select: { title: true, slug: true } } },
    }),
    prisma.acquisitionMandate.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <AdminLayout>
      <AdminReviewPanel
        applications={applications}
        mandates={mandates.map((mandate) => ({
          ...mandate,
          createdAt: mandate.createdAt.toISOString(),
          updatedAt: mandate.updatedAt.toISOString(),
        }))}
        enquiries={enquiries.map((enquiry) => ({
          id: enquiry.id,
          name: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          message: enquiry.message,
          investorType: enquiry.investorType,
          status: enquiry.status,
          source: enquiry.source,
          createdAt: enquiry.createdAt.toISOString(),
          propertyTitle: enquiry.listing?.title ?? enquiry.propertyTitle,
          propertySlug: enquiry.listing?.slug ?? enquiry.propertySlug,
        }))}
        listings={listings.map((listing) => ({
          ...listing,
          price: Number(listing.price),
        }))}
        reports={reports.map((report) => ({
          ...report,
          createdAt: report.createdAt.toISOString(),
          details:
            report.details == null
              ? null
              : typeof report.details === "string"
                ? report.details
                : JSON.stringify(report.details),
        }))}
      />
    </AdminLayout>
  );
}

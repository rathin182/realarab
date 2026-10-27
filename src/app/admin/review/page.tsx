import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import AdminReviewPanel from "./admin-review-panel";

export default async function ReviewPage() {
  await requireAdmin();

  const [applications, listings, reports] = await Promise.all([
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
  ]);

  return (
    <AdminReviewPanel
      applications={applications}
      listings={listings.map((listing) => ({ ...listing, price: Number(listing.price) }))}
      reports={reports.map((report) => ({
        ...report,
        createdAt: report.createdAt.toISOString(),
        details: report.details == null ? null : typeof report.details === "string" ? report.details : JSON.stringify(report.details),
      }))}
    />
  );
}
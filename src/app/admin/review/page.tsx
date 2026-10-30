
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import AdminReviewPanel from "./admin-review-panel";
import AdminLayout from "../admin-layout";

const PAGE_SIZE = 15;

export default async function ReviewPage() {
  await requireAdmin();

  const [
    enquiries,
    mandates,
    totalEnquiries,
    newEnquiries,
    totalMandates,
    newMandates,
  ] = await Promise.all([
    prisma.enquiry.findMany({
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        investorType: true,
        status: true,
        source: true,
        createdAt: true,
        propertyTitle: true,
        propertySlug: true,
        listing: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),

    prisma.acquisitionMandate.findMany({
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        investorType: true,
        allocationTier: true,
        region: true,
        message: true,
        source: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.enquiry.count(),

    prisma.enquiry.count({
      where: { status: "NEW" },
    }),

    prisma.acquisitionMandate.count(),

    prisma.acquisitionMandate.count({
      where: { status: "NEW" },
    }),
  ]);

  const serializedEnquiries = enquiries.map((enquiry) => ({
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
  }));

  const serializedMandates = mandates.map((mandate) => ({
    ...mandate,
    createdAt: mandate.createdAt.toISOString(),
  }));

  return (
    <AdminLayout>
      <AdminReviewPanel
        enquiries={serializedEnquiries}
        mandates={serializedMandates}
        totalEnquiries={totalEnquiries}
        newEnquiries={newEnquiries}
        totalMandates={totalMandates}
        newMandates={newMandates}
        enquiriesHasMore={totalEnquiries > enquiries.length}
        mandatesHasMore={totalMandates > mandates.length}
      />
    </AdminLayout>
  );
}

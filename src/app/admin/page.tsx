import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage() {
    const session = await requireAdmin();

    const [byStatus, enquiries, properties] =
    await Promise.all([
        prisma.listing.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.enquiry.count(),
        prisma.listing.findMany({
            orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
            select: {
                id: true,
                slug: true,
                title: true,
                city: true,
                state: true,
                price: true,
                viewCount: true,
                status: true,
                listingType: true,
                category: true,
                createdAt: true,
            },
        }),
    ]);

    const status = Object.fromEntries(byStatus.map((r) => [r.status, r._count._all]));
    const tableProperties = properties.map((property) => ({
        ...property,
        price: Number(property.price),
        createdAt: property.createdAt.toISOString(),
    }));

    return (
        <AdminDashboard
            email={session.user.email ?? ""}
            totalProperties={Object.values(status).reduce((sum, count) => sum + count, 0)}
            liveProperties={status.LIVE ?? 0}
            enquiries={enquiries}
            properties={tableProperties}
        />
    );
}
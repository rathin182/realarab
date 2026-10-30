import { prisma } from "@/lib/prisma";
import { listingCardSelect, listingToProperty } from "@/lib/listing-property";

export const dynamic = "force-dynamic";

export async function GET() {
  const listings = await prisma.listing.findMany({
    where: { status: "LIVE", featured: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }, { id: "asc" }],
    take: 12,
    select: listingCardSelect,
  });

  return Response.json(listings.map(listingToProperty));
}

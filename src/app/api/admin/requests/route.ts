
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
const PAGE_SIZE = 10;
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const params = request.nextUrl.searchParams;
    const type = params.get("type");
    const cursorId = params.get("cursorId");
    const cursorDate = params.get("cursorDate");
    if (type !== "property" && type !== "mandates") {
      return NextResponse.json(
        { error: "Invalid request type." },
        { status: 400 }
      );
    }
    if ((cursorId && !cursorDate) || (!cursorId && cursorDate)) {
      return NextResponse.json(
        { error: "Invalid pagination cursor." },
        { status: 400 }
      );
    }
    const cursorCreatedAt = cursorDate ? new Date(cursorDate) : null;
    if (cursorCreatedAt && Number.isNaN(cursorCreatedAt.getTime())) {
      return NextResponse.json(
        { error: "Invalid cursor date." },
        { status: 400 }
      );
    }
    if (type === "property") {
      const items = await prisma.enquiry.findMany({
        where: cursorId && cursorCreatedAt
          ? {
              OR: [
                { createdAt: { lt: cursorCreatedAt } },
                {
                  createdAt: cursorCreatedAt,
                  id: { lt: cursorId },
                },
              ],
            }
          : undefined,
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
        take: PAGE_SIZE + 1,
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
      });

      const hasMore = items.length > PAGE_SIZE;
      const pageItems = items.slice(0, PAGE_SIZE);
      const lastItem = pageItems[pageItems.length - 1];

      return NextResponse.json({
        items: pageItems.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          message: item.message,
          investorType: item.investorType,
          status: item.status,
          source: item.source,
          createdAt: item.createdAt.toISOString(),
          propertyTitle: item.listing?.title ?? item.propertyTitle,
          propertySlug: item.listing?.slug ?? item.propertySlug,
        })),
        hasMore,
        nextCursor: hasMore && lastItem
          ? {
              id: lastItem.id,
              createdAt: lastItem.createdAt.toISOString(),
            }
          : null,
      });
    }

    const items = await prisma.acquisitionMandate.findMany({
      where: cursorId && cursorCreatedAt
        ? {
            OR: [
              { createdAt: { lt: cursorCreatedAt } },
              {
                createdAt: cursorCreatedAt,
                id: { lt: cursorId },
              },
            ],
          }
        : undefined,
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      take: PAGE_SIZE + 1,
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
    });

    const hasMore = items.length > PAGE_SIZE;
    const pageItems = items.slice(0, PAGE_SIZE);
    const lastItem = pageItems[pageItems.length - 1];

    return NextResponse.json({
      items: pageItems.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
      hasMore,
      nextCursor: hasMore && lastItem
        ? {
            id: lastItem.id,
            createdAt: lastItem.createdAt.toISOString(),
          }
        : null,
    });
  } catch (error) {
    console.error("Admin requests pagination error:", error);

    return NextResponse.json(
      { error: "Unable to load requests." },
      { status: 500 }
    );
  }
}

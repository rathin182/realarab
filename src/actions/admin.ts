"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { redirect } from "next/navigation";

export async function reviewAgentApplication(formData: FormData) {
    const session = await requireAdmin();
    const id = String(formData.get("id"));
    const approve = formData.get("decision") === "APPROVED";
    const reason = String(formData.get("reason") ?? "").trim() || null;

    const app = await prisma.agentApplication.findUniqueOrThrow({ where: { id } });

    await prisma.$transaction([
        prisma.agentApplication.update({
            where: { id },
            data: {
            status: approve ? "APPROVED" : "REJECTED",
            rejectionReason: approve ? null : reason,
            reviewedAt: new Date(),
            },
        }),
        // Approval is what flips the user's role, so it shows up on their account everywhere.
        ...(approve ? [prisma.user.update({ where: { id: app.userId }, data: { role: "AGENT" } })] : []),
        prisma.auditLog.create({
            data: {
            actorId: session.user.id,
            action: approve ? "agent.approve" : "agent.reject",
            entityType: "AgentApplication",
            entityId: id,
            details: { userId: app.userId },
            },
        }),
    ]);

    revalidatePath("/admin");
    revalidatePath("/admin/review");
}

export async function reviewListing(formData: FormData) {
    const session = await requireAdmin();
    const id = String(formData.get("id"));
    const approve = formData.get("decision") === "LIVE";
    const reason = String(formData.get("reason") ?? "").trim() || null;

    await prisma.$transaction([
        prisma.listing.update({
            where: { id },
            data: approve
            ? { status: "LIVE", publishedAt: new Date(), rejectionReason: null }
            : { status: "REJECTED", rejectionReason: reason },
        }),
        prisma.auditLog.create({
            data: {
            actorId: session.user.id,
            action: approve ? "listing.approve" : "listing.reject",
            entityType: "Listing",
            entityId: id,
            },
        }),
    ]);

    revalidatePath("/admin");
    revalidatePath("/admin/review");
}

export async function resolveReport(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id"));
  const takeDown = formData.get("decision") === "TAKEDOWN";

  const report = await prisma.report.findUniqueOrThrow({ where: { id } });
  const now = new Date();

  await prisma.$transaction([
    prisma.report.update({
      where: { id },
      data: { status: takeDown ? "RESOLVED" : "DISMISSED", resolvedAt: now },
    }),
    ...(takeDown
      ? [
          prisma.listing.update({
            where: { id: report.listingId },
            data: {
              status: "REJECTED",
              rejectionReason: `Removed after a report (${report.reason.toLowerCase().replace("_", " ")}).`,
            },
          }),
          // Close the other open reports on the same listing.
          prisma.report.updateMany({
            where: { listingId: report.listingId, status: "OPEN", id: { not: id } },
            data: { status: "RESOLVED", resolvedAt: now },
          }),
        ]
      : []),
    prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: takeDown ? "report.takedown" : "report.dismiss",
        entityType: "Report",
        entityId: id,
        details: { listingId: report.listingId },
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/review");
}

export async function createAdminListing(formData: FormData) {
  const session = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const propertyType = String(formData.get("propertyType") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const isUploadedImage = /^\/uploads\/[0-9a-f-]+\.(?:jpg|png|webp)$/.test(imageUrl);
  const price = Number(formData.get("price"));
  const areaSqm = Number(formData.get("areaSqm"));
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  const listingType = formData.get("listingType") === "RENT" ? "RENT" : "SALE";
  const categoryValue = String(formData.get("category") ?? "RESIDENTIAL");
  const category = ["RESIDENTIAL", "COMMERCIAL", "LAND"].includes(categoryValue)
    ? categoryValue as "RESIDENTIAL" | "COMMERCIAL" | "LAND"
    : "RESIDENTIAL";
  const tierValue = String(formData.get("tier") ?? "curated");
  const tier = ["featured", "curated", "vault", "syndicate"].includes(tierValue) ? tierValue : "curated";
  let parsedImageUrl: URL | null = null;

  if (imageUrl && !isUploadedImage) {
    try {
      parsedImageUrl = new URL(imageUrl);
    } catch {
      redirect("/admin/properties/new?error=invalid");
    }
  }

  if (
    !title || title.length > 160 || !description || !city || !state || !propertyType || (!parsedImageUrl && !isUploadedImage) ||
    !Number.isSafeInteger(price) || price < 0 ||
    (formData.get("areaSqm") && (!Number.isSafeInteger(areaSqm) || areaSqm < 0)) ||
    (formData.get("bedrooms") && (!Number.isSafeInteger(bedrooms) || bedrooms < 0)) ||
    (formData.get("bathrooms") && (!Number.isSafeInteger(bathrooms) || bathrooms < 0)) ||
    (parsedImageUrl && !["http:", "https:"].includes(parsedImageUrl.protocol))
  ) {
    redirect("/admin/properties/new?error=invalid");
  }

  const slugBase = title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "property";
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

  const listing = await prisma.listing.create({
    data: {
      ownerId: session.user.id,
      slug,
      title,
      description,
      listingType,
      category,
      propertyType,
      price: BigInt(price),
      areaSqm: formData.get("areaSqm") ? areaSqm : null,
      bedrooms: formData.get("bedrooms") ? bedrooms : null,
      bathrooms: formData.get("bathrooms") ? bathrooms : null,
      city,
      state,
      locality: String(formData.get("locality") ?? "").trim() || null,
      tier,
      status: "LIVE",
      publishedAt: new Date(),
      ...(imageUrl ? {
        media: {
          create: {
            kind: "IMAGE",
            storageKey: imageUrl,
            isCover: true,
            status: "READY",
          },
        },
      } : {}),
    },
    select: { id: true, title: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "listing.create",
      entityType: "Listing",
      entityId: listing.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/admin");
  redirect("/admin?created=1");
}

export async function archiveAdminListing(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const listing = await prisma.listing.findUniqueOrThrow({ where: { id } });

  await prisma.$transaction([
    prisma.listing.update({
      where: { id },
      data: { status: "ARCHIVED" },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "listing.archive",
        entityType: "Listing",
        entityId: id,
        details: { slug: listing.slug, title: listing.title },
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath(`/properties/${listing.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
}
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { CONTACT_SETTINGS_ID, type ContactSettingsValues } from "@/lib/contact-settings";

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
  const galleryImageUrls = String(formData.get("galleryImageUrls") ?? "").split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
  const videoUploadUrl = String(formData.get("videoUploadUrl") ?? "").trim();
  const price = Number(formData.get("price"));
  const areaSqm = Number(formData.get("areaSqm"));
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  const floors = Number(formData.get("floors"));
  const yearBuilt = Number(formData.get("yearBuilt"));
  const frontageMeters = Number(formData.get("frontageMeters"));
  const depthMeters = Number(formData.get("depthMeters"));
  const coordinateText = String(formData.get("coordinates") ?? "").trim();
  const coordinateParts = coordinateText.split(/[\s,;]+/).filter(Boolean);
  if (coordinateText && coordinateParts.length !== 2) {
    redirect("/admin/properties/new?error=invalid");
  }
  const latitudeValue = coordinateText ? coordinateParts[0] : String(formData.get("latitude") ?? "").trim();
  const longitudeValue = coordinateText ? coordinateParts[1] : String(formData.get("longitude") ?? "").trim();
  const latitude = latitudeValue ? Number(latitudeValue) : null;
  const longitude = longitudeValue ? Number(longitudeValue) : null;
  const availableFromValue = String(formData.get("availableFrom") ?? "").trim();
  const availableFrom = availableFromValue ? new Date(`${availableFromValue}T00:00:00.000Z`) : null;
  const listingType = formData.get("listingType") === "RENT" ? "RENT" : "SALE";
  const statusValue = String(formData.get("status") ?? "DRAFT");
  const status = ["LIVE", "DRAFT", "SOLD_OR_RENTED"].includes(statusValue)
    ? statusValue as "LIVE" | "DRAFT" | "SOLD_OR_RENTED"
    : "DRAFT";
  const categoryValue = String(formData.get("category") ?? "");
  const category = ["RESIDENTIAL", "COMMERCIAL"].includes(categoryValue)
    ? categoryValue as "RESIDENTIAL" | "COMMERCIAL"
    : null;
  const residentialTypes = ["APARTMENT", "VILLA", "TOWNHOUSE", "PENTHOUSE", "VILLA_COMPOUND", "HOTEL_APARTMENT", "LAND", "FLOOR", "BUILDING"];
  const commercialTypes = ["OFFICE", "SHOP", "WAREHOUSE", "LABOUR_CAMP", "VILLA", "BULK_UNIT", "LAND", "FLOOR", "BUILDING", "FACTORY", "INDUSTRIAL_LAND", "MIXED_USE_LAND", "SHOWROOM", "OTHER_COMMERCIAL"];
  const isValidPropertyType = category === "RESIDENTIAL"
    ? residentialTypes.includes(propertyType)
    : category === "COMMERCIAL" && commercialTypes.includes(propertyType);
  const tierValue = String(formData.get("tier") ?? "curated");
  const tier = ["featured", "curated", "vault", "syndicate"].includes(tierValue) ? tierValue : "curated";
  const amenities = formData.getAll("amenities").map(String).map((item) => item.trim()).filter(Boolean);
  const keyFeatures = formData.getAll("keyFeatures")
    .map(String)
    .flatMap((feature) => feature.split(/[\n,]+/))
    .map((feature) => feature.trim())
    .filter(Boolean);
  const flags = String(formData.get("flags") ?? "").split(",").map((flag) => flag.trim()).filter(Boolean);
  let parsedImageUrl: URL | null = null;
  const isUploadedVideo = /^\/uploads\/[0-9a-f-]+\.(?:mp4|mov|webm|ogv)$/.test(videoUploadUrl);

  if (imageUrl && !isUploadedImage) {
    try {
      parsedImageUrl = new URL(imageUrl);
    } catch {
      redirect("/admin/properties/new?error=invalid");
    }
  }

  for (const galleryUrl of galleryImageUrls) {
    if (/^\/uploads\/[0-9a-f-]+\.(?:jpg|png|webp)$/.test(galleryUrl)) continue;
    try {
      const parsed = new URL(galleryUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Invalid image URL");
    } catch {
      redirect("/admin/properties/new?error=invalid");
    }
  }

  if (
    !title || title.length > 160 || !description || !city || !state || !isValidPropertyType ||
    !Number.isSafeInteger(price) || price < 0 ||
    (formData.get("areaSqm") && (!Number.isSafeInteger(areaSqm) || areaSqm < 0)) ||
    (propertyType !== "LAND" && formData.get("bedrooms") && (!Number.isSafeInteger(bedrooms) || bedrooms < 0)) ||
    (propertyType !== "LAND" && formData.get("bathrooms") && (!Number.isSafeInteger(bathrooms) || bathrooms < 0)) ||
    (formData.get("floors") && (!Number.isSafeInteger(floors) || floors < 1)) ||
    (formData.get("yearBuilt") && (!Number.isSafeInteger(yearBuilt) || yearBuilt < 1800 || yearBuilt > 2100)) ||
    (formData.get("frontageMeters") && (!Number.isFinite(frontageMeters) || frontageMeters < 0)) ||
    (formData.get("depthMeters") && (!Number.isFinite(depthMeters) || depthMeters < 0)) ||
    (parsedImageUrl && !["http:", "https:"].includes(parsedImageUrl.protocol)) ||
    (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
    (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) ||
    (availableFrom && Number.isNaN(availableFrom.getTime())) ||
    (videoUploadUrl && !isUploadedVideo)
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
      category: category!,
      propertyType,
      price: BigInt(price),
      priceNegotiable: formData.get("priceNegotiable") === "true",
      featured: formData.get("featured") === "on",
      areaSqm: formData.get("areaSqm") ? areaSqm : null,
      bedrooms: propertyType !== "LAND" && formData.get("bedrooms") ? bedrooms : null,
      bathrooms: propertyType !== "LAND" && formData.get("bathrooms") ? bathrooms : null,
      floors: formData.get("floors") ? floors : null,
      yearBuilt: formData.get("yearBuilt") ? yearBuilt : null,
      zoning: String(formData.get("zoning") ?? "").trim() || null,
      frontageMeters: formData.get("frontageMeters") ? frontageMeters : null,
      depthMeters: formData.get("depthMeters") ? depthMeters : null,
      propertyUse: String(formData.get("propertyUse") ?? "").trim() || null,
      availableFrom,
      availabilityNotes: String(formData.get("availabilityNotes") ?? "").trim() || null,
      city,
      state,
      locality: String(formData.get("locality") ?? "").trim() || null,
      latitude,
      longitude,
      tier,
      status,
      publishedAt: status === "LIVE" ? new Date() : null,
      reraNumber: String(formData.get("reraNumber") ?? "").trim() || null,
      projectedYield: String(formData.get("projectedYield") ?? "").trim() || null,
      badge: String(formData.get("badge") ?? "").trim() || null,
      flags,
      amenities,
      keyFeatures,
      isOffPlan: formData.get("isOffPlan") === "true",
      ...(imageUrl || galleryImageUrls.length || videoUploadUrl ? { media: {
        create: [
          ...(imageUrl ? [{
            kind: "IMAGE" as const,
            storageKey: imageUrl,
            isCover: true,
            position: 0,
            status: "READY" as const,
          }] : []),
          ...(!imageUrl && galleryImageUrls.length ? [{
            kind: "IMAGE" as const,
            storageKey: galleryImageUrls[0],
            isCover: true,
            position: 0,
            status: "READY" as const,
          }] : []),
          ...galleryImageUrls.filter((url) => url !== (!imageUrl ? galleryImageUrls[0] : "")).map((url, index) => ({
            kind: "IMAGE" as const,
            storageKey: url,
            isCover: false,
            position: index + 1,
            status: "READY" as const,
          })),
          ...(videoUploadUrl ? [{
            kind: "VIDEO_UPLOAD" as const,
            storageKey: videoUploadUrl,
            isCover: false,
            position: galleryImageUrls.length + 1,
            status: "READY" as const,
          }] : []),
        ],
      } } : {}),
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
  return { ok: true };
}

export async function updateAdminListing(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const locality = String(formData.get("locality") ?? "").trim() || null;
  const state = String(formData.get("state") ?? "").trim();
  const propertyType = String(formData.get("propertyType") ?? "").trim() || null;
  const price = Number(formData.get("price"));
  const listingType = String(formData.get("listingType") ?? "");
  const category = String(formData.get("category") ?? "");
  const status = String(formData.get("status") ?? "");
  const bedroomsValue = String(formData.get("bedrooms") ?? "").trim();
  const bathroomsValue = String(formData.get("bathrooms") ?? "").trim();
  const areaSqmValue = String(formData.get("areaSqm") ?? "").trim();
  const bedrooms = bedroomsValue ? Number(bedroomsValue) : null;
  const bathrooms = bathroomsValue ? Number(bathroomsValue) : null;
  const areaSqm = areaSqmValue ? Number(areaSqmValue) : null;
  const validStatuses = ["DRAFT", "PENDING_REVIEW", "LIVE", "REJECTED", "EXPIRED", "SOLD_OR_RENTED", "ARCHIVED"];

  if (
    !id || !title || title.length > 160 || !city || !state ||
    !Number.isSafeInteger(price) || price < 0 ||
    !["SALE", "RENT"].includes(listingType) ||
    !["RESIDENTIAL", "COMMERCIAL", "LAND"].includes(category) ||
    !validStatuses.includes(status) ||
    (propertyType !== null && propertyType.length > 100) ||
    (bedrooms !== null && (!Number.isSafeInteger(bedrooms) || bedrooms < 0)) ||
    (bathrooms !== null && (!Number.isSafeInteger(bathrooms) || bathrooms < 0)) ||
    (areaSqm !== null && (!Number.isSafeInteger(areaSqm) || areaSqm < 0))
  ) {
    return { ok: false, message: "Check the property details and try again." };
  }

  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true, slug: true, publishedAt: true } });
  if (!listing) return { ok: false, message: "Property not found." };

  await prisma.$transaction([
    prisma.listing.update({
      where: { id },
      data: {
        title,
        city,
        locality,
        state,
        propertyType,
        price: BigInt(price),
        listingType: listingType as "SALE" | "RENT",
        category: category as "RESIDENTIAL" | "COMMERCIAL" | "LAND",
        status: status as "DRAFT" | "PENDING_REVIEW" | "LIVE" | "REJECTED" | "EXPIRED" | "SOLD_OR_RENTED" | "ARCHIVED",
        bedrooms,
        bathrooms,
        areaSqm,
        ...(status === "LIVE" && !listing.publishedAt ? { publishedAt: new Date() } : {}),
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "listing.update",
        entityType: "Listing",
        entityId: id,
        details: { slug: listing.slug, title },
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath(`/properties/${listing.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  return { ok: true };
}

export async function bulkArchiveAdminListings(formData: FormData) {
  const session = await requireAdmin();
  const ids = [...new Set(formData.getAll("ids").map(String).filter(Boolean))];
  if (ids.length === 0) return { ok: false };

  const listings = await prisma.listing.findMany({ where: { id: { in: ids } }, select: { id: true, slug: true, title: true } });
  await prisma.$transaction([
    prisma.listing.updateMany({ where: { id: { in: listings.map((listing) => listing.id) } }, data: { status: "ARCHIVED" } }),
    ...listings.map((listing) => prisma.auditLog.create({
      data: { actorId: session.user.id, action: "listing.archive", entityType: "Listing", entityId: listing.id, details: { slug: listing.slug, title: listing.title, source: "bulk" } },
    })),
  ]);

  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  return { ok: true };
}

export async function saveContactSettings(formData: FormData) {
  const session = await requireAdmin();
  const fieldNames: (keyof ContactSettingsValues)[] = [
    "falRegistrationNumber",
    "riyadhLabel",
    "riyadhTitle",
    "riyadhAddress",
    "riyadhPhonePrimary",
    "riyadhPhoneSecondary",
    "riyadhEmail",
    "riyadhVisitingHours",
    "internationalLabel",
    "internationalBadge",
    "internationalTitle",
    "internationalAddress",
    "internationalPhonePrimary",
    "internationalPhoneSecondary",
    "internationalEmail",
    "internationalVisitingHours",
  ];
  const settings = Object.fromEntries(fieldNames.map((name) => [name, String(formData.get(name) ?? "").trim()])) as ContactSettingsValues;
  const requiredFields = fieldNames.filter((name) => name !== "riyadhPhoneSecondary" && name !== "internationalPhoneSecondary");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    requiredFields.some((name) => !settings[name]) ||
    fieldNames.some((name) => settings[name].length > 240) ||
    !emailPattern.test(settings.riyadhEmail) ||
    !emailPattern.test(settings.internationalEmail)
  ) {
    return { ok: false, message: "Enter valid contact details. Email addresses must be valid." };
  }

  await prisma.$transaction([
    prisma.contactSettings.upsert({
      where: { id: CONTACT_SETTINGS_ID },
      create: { id: CONTACT_SETTINGS_ID, ...settings },
      update: settings,
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "contact.settings_update",
        entityType: "ContactSettings",
        entityId: CONTACT_SETTINGS_ID,
      },
    }),
  ]);

  revalidatePath("/contact");
  revalidatePath("/admin/contact");
  revalidatePath("/api/contact-settings");
  return { ok: true };
}

import { Property } from "@/types";
import { Prisma } from "@/generated/prisma/client";

export const listingCardSelect = {  
  slug: true, title: true, titleAr: true, description: true, status: true, listingType: true, isOffPlan: true, 
  category: true, propertyType: true, price: true, bedrooms: true, bathrooms: true, furnished: true, 
  areaSqm: true, areaSqft: true, locality: true, latitude: true, longitude: true, city: true, locationAr: true, 
  tier: true, badge: true, projectedYield: true, reraNumber: true, flags: true, amenities: true, 
  keyFeatures: true,
  media: {
    where: { kind: "IMAGE", status: "READY" },
    select: { kind: true, storageKey: true, externalUrl: true, isCover: true, position: true },
    orderBy: [{ isCover: "desc" }, { position: "asc" }],
    take: 1,
  },
} satisfies Prisma.ListingSelect;

export interface ListingForProperty {
  slug: string; title: string; titleAr: string | null; description: string;
  listingType: "SALE" | "RENT"; isOffPlan?: boolean; category: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  propertyType: string | null; price: bigint | number; bedrooms: number | null;
  bathrooms: number | null; furnished: boolean; areaSqm: number | null;
  areaSqft: number | null; locality: string | null; latitude: number | null;
  longitude: number | null; city: string; locationAr: string | null;
  tier: string | null; badge: string | null; projectedYield: string | null;
  reraNumber: string | null; flags: string[]; amenities: string[]; keyFeatures: string[];
  media: { kind: "IMAGE" | "VIDEO_LINK" | "VIDEO_UPLOAD"; storageKey: string | null; externalUrl: string | null; isCover: boolean; position: number }[];
}

export function listingToProperty(listing: ListingForProperty): Property {
  const tier = ["featured", "curated", "vault", "syndicate"].includes(listing.tier ?? "")
    ? listing.tier as Property["tier"]
    : "curated";
  const images = listing.media.filter((media) => media.kind === "IMAGE");
  const cover = images.find((media) => media.isCover) ?? images[0];
  const propertyMedia = listing.media.flatMap((media) => {
    const src = media.storageKey ?? media.externalUrl;
    return src ? [{ kind: media.kind, src }] : [];
  });
  const transaction = listing.category === "COMMERCIAL" ? "commercial" : listing.listingType === "RENT" ? "rent" : "buy";

  return {
    id: listing.slug,
    tier,
    title: listing.title,
    titleAr: listing.titleAr ?? listing.title,
    location: [listing.locality, listing.city].filter(Boolean).join(", "),
    locationAr: listing.locationAr ?? [listing.locality, listing.city].filter(Boolean).join(", "),
    latitude: listing.latitude,
    longitude: listing.longitude,
    city: listing.city,
    priceSAR: Number(listing.price),
    type: listing.propertyType ?? listing.category.toLowerCase(),
    transaction,
    isOffPlan: listing.isOffPlan ?? false,
    sizeSqm: listing.areaSqm ?? (listing.areaSqft ? Math.round(listing.areaSqft * 0.092903) : 0),
    bedrooms: listing.bedrooms ?? 0,
    bathrooms: listing.bathrooms ?? 0,
    furnished: listing.furnished,
    badge: listing.badge ?? listing.category,
    description: listing.description,
    descriptionAr: listing.description,
    keyFeatures: listing.keyFeatures,
    projectedYield: listing.projectedYield ?? "",
    registration: listing.reraNumber ?? "",
    flags: listing.flags,
    amenities: listing.amenities,
    image: cover?.storageKey ?? "/images/property-placeholder.jpg",
    media: propertyMedia,
  };
}

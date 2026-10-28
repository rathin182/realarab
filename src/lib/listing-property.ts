import { Property } from "@/types";

export interface ListingForProperty {
  slug: string;
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  listingType: "SALE" | "RENT";
  category: "RESIDENTIAL" | "COMMERCIAL" | "LAND";
  propertyType: string | null;
  price: bigint | number;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  areaSqft: number | null;
  locality: string | null;
  city: string;
  locationAr: string | null;
  tier: string | null;
  badge: string | null;
  projectedYield: string | null;
  reraNumber: string | null;
  flags: string[];
  keyFeatures: string[];
  media: { kind: "IMAGE" | "VIDEO_LINK" | "VIDEO_UPLOAD"; storageKey: string | null; isCover: boolean; position: number }[];
}

export function listingToProperty(listing: ListingForProperty): Property {
  const tier = ["featured", "curated", "vault", "syndicate"].includes(listing.tier ?? "")
    ? listing.tier as Property["tier"]
    : "curated";
  const images = listing.media.filter((media) => media.kind === "IMAGE");
  const cover = images.find((media) => media.isCover) ?? images[0];
  const transaction = listing.category === "COMMERCIAL"
    ? "commercial"
    : listing.listingType === "RENT"
      ? "rent"
      : "buy";

  return {
    id: listing.slug,
    tier,
    title: listing.title,
    titleAr: listing.titleAr ?? listing.title,
    location: [listing.locality, listing.city].filter(Boolean).join(", "),
    locationAr: listing.locationAr ?? [listing.locality, listing.city].filter(Boolean).join(", "),
    city: listing.city,
    priceSAR: Number(listing.price),
    type: listing.propertyType ?? listing.category.toLowerCase(),
    transaction,
    sizeSqm: listing.areaSqm ?? (listing.areaSqft ? Math.round(listing.areaSqft * 0.092903) : 0),
    bedrooms: listing.bedrooms ?? 0,
    bathrooms: listing.bathrooms ?? 0,
    badge: listing.badge ?? listing.category,
    description: listing.description,
    descriptionAr: listing.descriptionAr ?? listing.description,
    keyFeatures: listing.keyFeatures,
    projectedYield: listing.projectedYield ?? "",
    registration: listing.reraNumber ?? "",
    flags: listing.flags,
    image: cover?.storageKey ?? "/images/property-placeholder.jpg",
  };
}
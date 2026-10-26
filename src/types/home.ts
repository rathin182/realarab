// Contract for the buyer home page.
// The admin/backend teammate builds GET /api/buyer/home to return exactly `BuyerHomeData`.

export interface BuyerHero {
  title: string;
  subtitle: string;
  imageUrl: string;
  featuredCard: {
    title: string;
    imageUrl: string;
    href: string;
  };
}

export interface PropertyTypeFilter {
  value: string; // e.g. "villa"  -> sent as ?type=villa
  label: string; // e.g. "Villa"
}

export interface BuyerFilters {
  cities: string[];
  propertyTypes: PropertyTypeFilter[];
}

export interface PropertyCard {
  id: string;
  href: string;
  title: string;
  locationText: string; // "Al Narjis, Riyadh"
  priceSAR: number;
  beds: number | null;
  baths: number | null;
  rooms: number | null; // commercial listings
  areaSqm: number | null;
  imageUrl: string;
  isFavorite: boolean;
  badge: string | null; // "Featured"
}

export interface PopularLocation {
  city: string;
  count: number;
  imageUrl: string;
}

export interface BuyerHomeData {
  hero: BuyerHero;
  filters: BuyerFilters;
  featured: PropertyCard[];
  popularLocations: PopularLocation[];
}

export type Currency = 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export type Language = 'en' | 'ar';

export type TransactionType = 'buy' | 'rent' | 'off-plan' | 'commercial';

export type PortfolioTier = 'featured' | 'curated' | 'vault' | 'syndicate';

export interface Property {
  id: string;
  tier: PortfolioTier;
  title: string;
  titleAr: string;
  location: string;
  locationAr: string;
  city: 'Riyadh' | 'Makkah' | 'Madinah' | 'Jeddah' | 'NEOM';
  priceSAR: number;
  type: string;
  transaction: TransactionType;
  sizeSqm: number;
  bedrooms: number;
  bathrooms: number;
  badge: string;
  badgeAr?: string;
  description: string;
  descriptionAr: string;
  keyFeatures: string[];
  keyFeaturesAr?: string[];
  projectedYield: string;
  registration: string;
  flags: string[];
  image: string;
}

export interface MegaProject {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  investmentValue: string;
  completion: string;
  description: string;
  descriptionAr: string;
  highlights: string[];
  badge: string;
  image?: string;
}

export interface ServiceCompetency {
  id: string;
  index: string;
  tag: string;
  tagAr: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  narrative: string;
  narrativeAr: string;
  deliverables: string[];
  deliverablesAr: string[];
  badge: string;
}

export interface FAQItem {
  id: string;
  category: 'foreign-ownership' | 'sharia-finance' | 'tax-fees' | 'acquisition-escrow' | 'holy-cities';
  q: string;
  qAr: string;
  a: string;
  aAr: string;
  takeaway: string;
  takeawayAr: string;
  reference: string;
}

export interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  experience: string;
  specialty: string;
  specialtyAr: string;
  license: string;
  personalMessage: string;
  personalMessageAr: string;
  image: string;
  whatsapp: string;
  email: string;
}

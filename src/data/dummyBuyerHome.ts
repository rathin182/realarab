import type { BuyerHomeData } from '@/types/home';

// DUMMY DATA for the buyer home page.
// Replace getBuyerHome() in src/lib/api/buyerHome.ts with a real fetch when the backend is ready.
// Keep the shape identical to `BuyerHomeData` in src/types/home.ts.

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const dummyBuyerHome: BuyerHomeData = {
  hero: {
    title: 'Find Your Next Home in Saudi',
    subtitle: 'Discover the best properties across Riyadh, Jeddah, Dammam and beyond.',
    imageUrl: img('photo-1512453979798-5ea266f8880c', 2000),
    featuredCard: {
      title: 'Premium Villas in North Riyadh',
      imageUrl: img('photo-1613490493576-7fde63acd811', 800),
      href: '/properties?city=Riyadh&type=villa',
    },
  },
  filters: {
    cities: ['Riyadh', 'Jeddah', 'Dammam'],
    propertyTypes: [
      { value: 'villa', label: 'Villa' },
      { value: 'apartment', label: 'Apartment' },
      { value: 'land', label: 'Land' },
      { value: 'commercial', label: 'Commercial' },
    ],
  },
  featured: [
    {
      id: 'dummy-1',
      href: '/properties/dummy-1',
      title: 'Luxury Villa',
      locationText: 'Al Narjis, Riyadh',
      priceSAR: 4200000,
      beds: 5,
      baths: 6,
      rooms: null,
      areaSqm: 520,
      imageUrl: img('photo-1613490493576-7fde63acd811', 800),
      isFavorite: false,
      badge: 'Featured',
    },
    {
      id: 'dummy-2',
      href: '/properties/dummy-2',
      title: 'Modern Apartment',
      locationText: 'Al Salamah, Jeddah',
      priceSAR: 1350000,
      beds: 5,
      baths: 3,
      rooms: null,
      areaSqm: 180,
      imageUrl: img('photo-1545324418-cc1a3fa10c00', 800),
      isFavorite: false,
      badge: null,
    },
    {
      id: 'dummy-3',
      href: '/properties/dummy-3',
      title: 'Commercial Office',
      locationText: 'Al Olaya, Riyadh',
      priceSAR: 6800000,
      beds: null,
      baths: null,
      rooms: 10,
      areaSqm: 850,
      imageUrl: img('photo-1486406146926-c627a92ad1ab', 800),
      isFavorite: true,
      badge: null,
    },
    {
      id: 'dummy-4',
      href: '/properties/dummy-4',
      title: 'Residential Land',
      locationText: 'Al Khobar, Dammam',
      priceSAR: 2100000,
      beds: null,
      baths: null,
      rooms: null,
      areaSqm: 800,
      imageUrl: img('photo-1500382017468-9049fed747ef', 800),
      isFavorite: false,
      badge: null,
    },
    {
      id: 'dummy-5',
      href: '/properties/dummy-5',
      title: 'Pool Villa',
      locationText: 'Al Rawdah, Jeddah',
      priceSAR: 3650000,
      beds: 4,
      baths: 5,
      rooms: null,
      areaSqm: 410,
      imageUrl: img('photo-1512917774080-9991f1c4c750', 800),
      isFavorite: false,
      badge: null,
    },
  ],
  popularLocations: [
    { city: 'Riyadh', count: 2500, imageUrl: img('photo-1512453979798-5ea266f8880c', 600) },
    { city: 'Jeddah', count: 1800, imageUrl: img('photo-1486406146926-c627a92ad1ab', 600) },
    { city: 'Dammam', count: 950, imageUrl: img('photo-1545324418-cc1a3fa10c00', 600) },
    { city: 'Makkah', count: 600, imageUrl: img('photo-1613490493576-7fde63acd811', 600) },
    { city: 'Madinah', count: 450, imageUrl: img('photo-1512917774080-9991f1c4c750', 600) },
  ],
};

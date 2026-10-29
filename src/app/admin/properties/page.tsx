import { requireAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import AdminPropertiesList from './admin-properties-list';
import AdminLayout from '../admin-layout';

export default async function AdminPropertiesPage() {
  await requireAdmin();
  const properties = await prisma.listing.findMany({
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    include: { media: { where: { kind: 'IMAGE', status: 'READY' }, orderBy: [{ isCover: 'desc' }, { position: 'asc' }], take: 1 } },
  });

  return <AdminLayout><AdminPropertiesList properties={properties.map((property) => ({
    id: property.id,
    slug: property.slug,
    title: property.title,
    city: property.city,
    locality: property.locality,
    state: property.state,
    price: Number(property.price),
    listingType: property.listingType,
    category: property.category,
    propertyType: property.propertyType,
    status: property.status,
    featured: property.featured,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: property.areaSqm,
    areaSqft: property.areaSqft,
    isOffPlan: property.isOffPlan,
    projectedYield: property.projectedYield,
    viewCount: property.viewCount,
    createdAt: property.createdAt.toISOString(),
    image: property.media[0]?.storageKey ?? property.media[0]?.externalUrl ?? null,
  }))} /></AdminLayout>;
}

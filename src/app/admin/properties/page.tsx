import { requireAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import AdminPropertiesList from './admin-properties-list';
import AdminLayout from '../admin-layout';

const pageSize = 12;
const statusOptions = ['DRAFT', 'PENDING_REVIEW', 'LIVE', 'REJECTED', 'EXPIRED', 'SOLD_OR_RENTED', 'ARCHIVED'] as const;
const listingTypeOptions = ['SALE', 'RENT'] as const;
const categoryOptions = ['RESIDENTIAL', 'COMMERCIAL', 'LAND'] as const;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

export default async function AdminPropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const search = getSingleParam(params.search).trim().slice(0, 120);
  const requestedStatus = getSingleParam(params.status);
  const status = statusOptions.find((value) => value === requestedStatus) ?? 'all';
  const requestedListingType = getSingleParam(params.listingType);
  const listingType = listingTypeOptions.find((value) => value === requestedListingType) ?? 'all';
  const requestedCategory = getSingleParam(params.category);
  const category = categoryOptions.find((value) => value === requestedCategory) ?? 'all';
  const requestedSort = getSingleParam(params.sort);
  const sort = ['newest', 'oldest', 'views', 'price-low', 'price-high'].includes(requestedSort) ? requestedSort : 'newest';
  const requestedPage = Number(getSingleParam(params.page));
  const requestedPageNumber = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const where: Prisma.ListingWhereInput = {};
  if (status !== 'all') where.status = status;
  if (listingType !== 'all') where.listingType = listingType;
  if (category !== 'all') where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { locality: { contains: search, mode: 'insensitive' } },
      { state: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
      { propertyType: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [allPropertyCount, filteredCount] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where }),
  ]);
  const pageCount = Math.max(1, Math.ceil(filteredCount / pageSize));
  const page = Math.min(requestedPageNumber, pageCount);
  const orderBy: Prisma.ListingOrderByWithRelationInput[] = sort === 'oldest'
    ? [{ createdAt: 'asc' }, { id: 'asc' }]
    : sort === 'views'
      ? [{ viewCount: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }]
      : sort === 'price-low'
        ? [{ price: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }]
        : sort === 'price-high'
          ? [{ price: 'desc' }, { createdAt: 'desc' }, { id: 'asc' }]
          : [{ createdAt: 'desc' }, { id: 'asc' }];

  const properties = await prisma.listing.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true, slug: true, title: true, city: true, locality: true, state: true,
      price: true, listingType: true, category: true, propertyType: true, status: true,
      featured: true, bedrooms: true, bathrooms: true, furnished: true, areaSqm: true,
      areaSqft: true, isOffPlan: true, projectedYield: true,
      viewCount: true, createdAt: true,
      media: {
        where: { kind: 'IMAGE', status: 'READY' },
        select: { storageKey: true, externalUrl: true },
        orderBy: [{ isCover: 'desc' }, { position: 'asc' }],
        take: 1,
      },
    },
  });

  return <AdminLayout><AdminPropertiesList totalCount={filteredCount} allPropertyCount={allPropertyCount} filters={{ search, status, listingType, category, sort, page }} properties={properties.map((property) => ({
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
    furnished: property.furnished,
    areaSqm: property.areaSqm,
    areaSqft: property.areaSqft,
    isOffPlan: property.isOffPlan,
    projectedYield: property.projectedYield,
    viewCount: property.viewCount,
    createdAt: property.createdAt.toISOString(),
    image: property.media[0]?.storageKey ?? property.media[0]?.externalUrl ?? null,
  }))} /></AdminLayout>;
}

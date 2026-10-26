import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROPERTIES } from '../../../data/websiteContent';
import { PropertyDetailClient } from '../../../components/property/PropertyDetailClient';
import { prisma } from '@/lib/prisma';
import { listingToProperty } from '@/lib/listing-property';

export const dynamicParams = true;

async function getDatabaseListing(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: { media: { orderBy: { position: 'asc' } } },
  });

  return listing?.status === 'LIVE' ? listing : null;
}

export function generateStaticParams() {
  return PROPERTIES.map((property) => ({
    id: property.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = PROPERTIES.find((p) => p.id === id) ?? listingToPropertyOrNull(await getDatabaseListing(id));

  if (!property) {
    return {
      title: 'Property Not Found | Najm Estates KSA',
    };
  }

  return {
    title: `${property.title} | Najm Estates KSA`,
    description: property.description,
    openGraph: {
      title: `${property.title} - ${property.city} | Najm Estates KSA`,
      description: property.description,
      images: [
        {
          url: property.image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staticProperty = PROPERTIES.find((p) => p.id === id);
  const listing = staticProperty ? null : await getDatabaseListing(id);
  const property = staticProperty ?? listingToPropertyOrNull(listing);

  if (!property) {
    notFound();
  }

  if (listing) {
    await prisma.listing.update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return <PropertyDetailClient property={property} />;
}

function listingToPropertyOrNull(listing: Awaited<ReturnType<typeof getDatabaseListing>>) {
  return listing ? listingToProperty(listing) : null;
}

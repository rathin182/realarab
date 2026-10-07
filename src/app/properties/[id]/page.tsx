import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROPERTIES } from '../../../data/websiteContent';
import { PropertyDetailClient } from '../../../components/property/PropertyDetailClient';

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
  const property = PROPERTIES.find((p) => p.id === id);

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
  const property = PROPERTIES.find((p) => p.id === id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}

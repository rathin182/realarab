import { requireAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import AdminPropertiesList from './admin-properties-list';

export default async function AdminPropertiesPage() {
  await requireAdmin();
  const properties = await prisma.listing.findMany({
    where: { status: 'LIVE' },
    orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
    select: { id: true, slug: true, title: true, city: true, price: true, viewCount: true },
  });

  return <AdminPropertiesList properties={properties.map((property) => ({ ...property, price: Number(property.price) }))} />;
}

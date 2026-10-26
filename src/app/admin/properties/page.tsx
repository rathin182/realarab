import Link from 'next/link';
import { requireAdmin } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { RemovePropertyButton } from './remove-property-button';

export default async function AdminPropertiesPage() {
  await requireAdmin();
  const properties = await prisma.listing.findMany({
    where: { status: 'LIVE' },
    orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
    select: { id: true, slug: true, title: true, city: true, price: true, viewCount: true },
  });

  return (
    <main className="min-h-screen bg-[#f3f1eb] px-4 py-8 text-[#24231f] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm text-neutral-600 hover:underline">← Back to dashboard</Link>
        <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl">Properties</h1>
            <p className="mt-1 text-sm text-neutral-500">{properties.length} live {properties.length === 1 ? 'property' : 'properties'}</p>
          </div>
          <Link href="/admin/properties/new" className="rounded-md bg-[#292820] px-4 py-2.5 text-sm text-white hover:bg-[#454337]">Add property</Link>
        </header>

        <section className="mt-6 overflow-hidden rounded-lg border border-[#e3dfd5] bg-[#faf9f5]">
          {properties.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-neutral-500">No live properties. Add a property to publish it on the website.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-[#f4f1ea] text-xs text-neutral-500">
                  <tr><th className="px-5 py-3 font-medium">Property</th><th className="px-3 py-3 font-medium">Location</th><th className="px-3 py-3 text-right font-medium">Price (SAR)</th><th className="px-3 py-3 text-right font-medium">Views</th><th className="px-5 py-3 text-right font-medium">Action</th></tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id} className="border-t border-[#e8e4db]">
                      <td className="px-5 py-3"><Link href={`/properties/${property.slug}`} className="font-medium hover:underline">{property.title}</Link></td>
                      <td className="px-3 py-3 text-neutral-600">{property.city}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{Number(property.price).toLocaleString('en-US')}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{property.viewCount.toLocaleString('en-US')}</td>
                      <td className="px-5 py-3 text-right"><RemovePropertyButton propertyTitle={property.title} propertyId={property.id} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

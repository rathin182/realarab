import Link from "next/link";
import { createAdminListing } from "@/actions/admin";
import { requireAdmin } from "@/lib/permissions";

const fieldClass = "mt-1.5 h-11 w-full rounded-md border border-[#d8d3c8] bg-white px-3 text-sm outline-none focus:border-[#8f7654]";

export default async function NewAdminPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f3f1eb] px-4 py-8 text-[#24231f] sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="text-sm text-neutral-600 hover:underline">← Back to dashboard</Link>
        <div className="mt-5 rounded-lg border border-[#e3dfd5] bg-[#faf9f5] p-5 sm:p-8">
          <h1 className="font-serif text-3xl">Add a property</h1>
          <p className="mt-2 text-sm text-neutral-500">The listing will be published on the website after submission.</p>
          {error && <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">Please check the required fields and image URL.</p>}
          <form action={createAdminListing} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">Property title<input name="title" required maxLength={160} className={fieldClass} /></label>
              <label className="text-sm">Property type<input name="propertyType" required placeholder="Villa, apartment, land..." className={fieldClass} /></label>
              <label className="text-sm">City<input name="city" required className={fieldClass} /></label>
              <label className="text-sm">Region / state<input name="state" required className={fieldClass} /></label>
              <label className="text-sm">District<input name="locality" className={fieldClass} /></label>
              <label className="text-sm">Price (SAR)<input name="price" type="number" min="0" step="1" required className={fieldClass} /></label>
              <label className="text-sm">Listing type<select name="listingType" className={fieldClass}><option value="SALE">For sale</option><option value="RENT">For rent</option></select></label>
              <label className="text-sm">Category<select name="category" className={fieldClass}><option value="RESIDENTIAL">Residential</option><option value="COMMERCIAL">Commercial</option><option value="LAND">Land</option></select></label>
              <label className="text-sm">Collection<select name="tier" className={fieldClass}><option value="featured">Featured</option><option value="curated" selected>Curated</option><option value="vault">Investment vault</option><option value="syndicate">Syndicate</option></select></label>
              <label className="text-sm">Area (m²)<input name="areaSqm" type="number" min="0" step="1" className={fieldClass} /></label>
              <label className="text-sm">Bedrooms<input name="bedrooms" type="number" min="0" step="1" className={fieldClass} /></label>
              <label className="text-sm">Bathrooms<input name="bathrooms" type="number" min="0" step="1" className={fieldClass} /></label>
            </div>
            <label className="block text-sm">Description<textarea name="description" required rows={5} className="mt-1.5 w-full rounded-md border border-[#d8d3c8] bg-white px-3 py-2 text-sm outline-none focus:border-[#8f7654]" /></label>
            <label className="block text-sm">Cover image URL<input name="imageUrl" type="url" required placeholder="https://..." className={fieldClass} /></label>
            <div className="flex justify-end gap-3 border-t border-[#e8e4db] pt-5">
              <Link href="/admin" className="rounded-md border border-[#d8d3c8] bg-white px-4 py-2.5 text-sm">Cancel</Link>
              <button className="rounded-md bg-[#292820] px-5 py-2.5 text-sm text-white hover:bg-[#454337]">Publish property</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
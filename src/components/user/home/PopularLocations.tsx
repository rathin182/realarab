import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PopularLocation } from '@/types/home';

export function PopularLocations({ items }: { items: PopularLocation[] }) {
  return (
    <section className="rounded-3xl bg-[#F8F5F0] p-5">
      <h2 className="font-serif text-[26px] text-[#2E221C]">Popular Locations</h2>
      <p className="mt-1 text-[13.5px] text-[#6F625A]">
        Explore properties in Saudi&apos;s most sought-after cities.
      </p>

      {items.length === 0 ? (
        <p className="py-10 text-center text-[14px] text-[#6F625A]">No locations available.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {items.map((l) => (
            <Link
              key={l.city}
              href={`/properties?city=${encodeURIComponent(l.city)}`}
              className="group relative block h-[120px] overflow-hidden rounded-2xl"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(20,12,8,0) 35%, rgba(20,12,8,0.75) 100%), url('${l.imageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-[15px] font-medium">{l.city}</p>
                <p className="text-[11.5px] text-white/85">
                  {new Intl.NumberFormat('en-US').format(l.count)}+ properties
                </p>
              </div>
              <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-[#2E221C] transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

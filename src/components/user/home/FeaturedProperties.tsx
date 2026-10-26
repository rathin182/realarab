'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bath, BedDouble, ChevronLeft, ChevronRight, Heart, Maximize, DoorOpen } from 'lucide-react';
import type { PropertyCard } from '@/types/home';
import { setFavorite } from '@/lib/api/favorites';

const sar = (n: number) => `SAR ${new Intl.NumberFormat('en-US').format(n)}`;

function Stat({ icon: Icon, text }: { icon: React.ComponentType<{ size?: number }>; text: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11.5px] text-[#6F625A]">
      <Icon size={13} />
      {text}
    </span>
  );
}

export function FeaturedProperties({ items }: { items: PropertyCard[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [favs, setFavs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((p) => [p.id, p.isFavorite])),
  );

  function scrollBy(dir: 1 | -1) {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  }

  async function toggle(id: string) {
    const next = !favs[id];
    setFavs((f) => ({ ...f, [id]: next })); 
    const ok = await setFavorite(id, next);
    if (!ok) setFavs((f) => ({ ...f, [id]: !next })); 
  }

  return (
    <section className="rounded-3xl bg-[#F8F5F0] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-[26px] text-[#2E221C]">Featured Properties</h2>
          <p className="mt-1 text-[13.5px] text-[#6F625A]">
            Handpicked properties in top locations across Saudi Arabia.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/properties" className="mr-1 text-[12.5px] text-[#2E221C] hover:underline">
            View All
          </Link>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#E4D9CA] bg-white hover:bg-[#EEE3D4]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollBy(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#E4D9CA] bg-white hover:bg-[#EEE3D4]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-[14px] text-[#6F625A]">No featured properties right now.</p>
      ) : (
        <div
          ref={scroller}
          className="mt-4 flex snap-x gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((p) => (
            <article
              key={p.id}
              className="w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="relative h-[150px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                {p.badge && (
                  <span className="absolute left-3 top-3 rounded-md bg-black/45 px-2 py-1 text-[11px] text-white backdrop-blur">
                    {p.badge}
                  </span>
                )}
                <button
                  type="button"
                  aria-label={favs[p.id] ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={favs[p.id]}
                  onClick={() => toggle(p.id)}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/85 backdrop-blur"
                >
                  <Heart size={16} className={favs[p.id] ? 'fill-[#D9534F] text-[#D9534F]' : 'text-[#6F625A]'} />
                </button>
              </div>

              <div className="p-3.5">
                <Link href={p.href} className="text-[14px] font-medium text-[#2E221C] hover:underline">
                  {p.title}
                </Link>
                <p className="mt-0.5 text-[12px] text-[#6F625A]">{p.locationText}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[15px] font-semibold text-[#2E221C]">{sar(p.priceSAR)}</span>
                  <Link
                    href={p.href}
                    aria-label={`View ${p.title}`}
                    className="grid h-8 w-8 place-items-center rounded-full bg-[#EEE3D4] text-[#2E221C] hover:bg-[#E4D5C0]"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
                  {p.beds != null && <Stat icon={BedDouble} text={`${p.beds} Beds`} />}
                  {p.baths != null && <Stat icon={Bath} text={`${p.baths} Baths`} />}
                  {p.rooms != null && <Stat icon={DoorOpen} text={`${p.rooms}+ Rooms`} />}
                  {p.areaSqm != null && <Stat icon={Maximize} text={`${p.areaSqm} m²`} />}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

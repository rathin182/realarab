'use client';

import React, { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Home, Landmark, MapPin, Search, Trees } from 'lucide-react';
import type { BuyerFilters, BuyerHero } from '@/types/home';

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  villa: Home,
  apartment: Building2,
  land: Trees,
  commercial: Landmark,
};

export function HeroSearch({ hero, filters }: { hero: BuyerHero; filters: BuyerFilters }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (city) params.set('city', city);
    if (type) params.set('type', type);
    router.push(`/properties${params.toString() ? `?${params}` : ''}`);
  }

  const chip = (active: boolean) =>
    `flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] backdrop-blur transition-colors ${
      active
        ? 'border-white bg-white text-[#2E221C]'
        : 'border-white/30 bg-black/25 text-white hover:bg-black/40'
    }`;

  return (
    <section
      className="relative overflow-hidden rounded-3xl text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(20,12,8,0.78) 0%, rgba(20,12,8,0.35) 60%, rgba(20,12,8,0.55) 100%), url('${hero.imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="px-5 pb-6 pt-10 md:px-10 md:pt-16 lg:pb-8">
        <h1 className="max-w-[560px] font-serif text-4xl leading-[1.1] md:text-6xl">{hero.title}</h1>
        <p className="mt-4 max-w-[560px] text-[15px] text-white/90">{hero.subtitle}</p>

        <form
          onSubmit={onSubmit}
          className="mt-6 flex max-w-[660px] items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-[#2E221C] shadow-lg"
        >
          <Search size={18} className="shrink-0 text-[#6F625A]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, area, or property type..."
            aria-label="Search properties"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#9A8E85]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#4A2F22] text-white transition-colors hover:bg-[#3A2418]"
          >
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-5 flex max-w-[760px] flex-wrap gap-2.5">
          {filters.cities.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(city === c ? null : c)}
              aria-pressed={city === c}
              className={chip(city === c)}
            >
              <MapPin size={14} />
              {c}
            </button>
          ))}
          {filters.propertyTypes.map((t) => {
            const Icon = TYPE_ICONS[t.value] ?? Building2;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(type === t.value ? null : t.value)}
                aria-pressed={type === t.value}
                className={chip(type === t.value)}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        <Link
          href={hero.featuredCard.href}
          className="relative mt-6 block h-28 overflow-hidden rounded-2xl border border-white/25 sm:w-[300px] lg:absolute lg:bottom-6 lg:right-6 lg:mt-0"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(20,12,8,0.7), rgba(20,12,8,0.15)), url('${hero.featuredCard.imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <span className="absolute left-4 top-1/2 max-w-[170px] -translate-y-1/2 font-serif text-[18px] leading-tight">
            {hero.featuredCard.title}
          </span>
          <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#2E221C]">
            <ArrowRight size={15} />
          </span>
        </Link>
      </div>
    </section>
  );
}

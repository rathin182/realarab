'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { Currency, Language, Property } from '../../types';
import { formatPrice } from '../../lib/currency';

interface FeaturedPropertiesSectionProps {
  currency: Currency;
  language: Language;
}

export function FeaturedPropertiesSection({ currency, language }: FeaturedPropertiesSectionProps) {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const isAr = language === 'ar';

  const moveFeaturedSlide = (direction: -1 | 1) => {
    const track = featuredScrollRef.current;
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    if (slides.length < 2) return;

    const currentIndex = slides.reduce((closestIndex, slide, index) => {
      const closestDistance = Math.abs(slides[closestIndex].offsetLeft - track.scrollLeft);
      const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
    const nextIndex = (currentIndex + direction + slides.length) % slides.length;

    track.scrollTo({ left: slides[nextIndex].offsetLeft, behavior: 'smooth' });
  };

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/listings/featured', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load featured properties.');
        return response.json() as Promise<Property[]>;
      })
      .then(setFeaturedProperties)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setFeaturedProperties([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingFeatured(false);
      });

    return () => controller.abort();
  }, []);

  if (!isLoadingFeatured && featuredProperties.length === 0) return null;

  return (
    <section aria-label={isAr ? 'العقارات المميزة' : 'Featured properties'} className="min-h-screen bg-white px-25 text-black sm:px-8 sm:py-20 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-[110rem] flex-col justify-center overflow-hidden rounded-2xl bg-white">
        <div className="flex items-end justify-between gap-4 px-1 pb-6 sm:px-2 sm:pb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D1B77F]">{isAr ? 'نظرة أقرب' : 'A closer look'}</p>
            <h2 className="mt-2 font-serif text-3xl font-light sm:text-5xl">{isAr ? 'العقارات المميزة' : 'Featured properties'}</h2>
            <p className="mt-2 text-sm font-light text-white/70">{isAr ? 'أماكن استثنائية مختارة بعناية.' : 'Exceptional places, selected for you.'}</p>
          </div>
          {featuredProperties.length > 1 && <div className="flex gap-2">
            <button type="button" aria-label="Scroll featured properties left" onClick={() => moveFeaturedSlide(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-white/10"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" aria-label="Scroll featured properties right" onClick={() => moveFeaturedSlide(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-white/10"><ArrowRight className="h-4 w-4" /></button>
          </div>}
        </div>

        <div ref={featuredScrollRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-2">
          {isLoadingFeatured && featuredProperties.length === 0
            ? <div className="h-[55vh] min-h-72 w-full animate-pulse rounded-xl bg-white/10" />
            : featuredProperties.map((property) => <article key={property.id} className="group relative h-[65vh] min-h-[28rem] max-h-[48rem] w-full shrink-0 snap-start overflow-hidden rounded-xl bg-white/10">
              <Link href={`/properties/${property.id}`} aria-label={`${isAr ? 'عرض' : 'View'} ${isAr ? property.titleAr : property.title}`} className="absolute inset-0">
                <img src={property.image} alt={isAr ? property.titleAr : property.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" referrerPolicy="no-referrer" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              </Link>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                <span className="inline-flex bg-[#D1B77F] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#0C3826]">{isAr ? `مميز · ${property.type}` : `Featured · ${property.type}`}</span>
                <p className="mt-3 font-serif text-2xl sm:text-4xl text-white/90">{isAr ? property.titleAr : property.title}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75"><MapPin className="h-3.5 w-3.5" />{isAr ? property.locationAr : property.location}</p>
                <p className="mt-3 text-sm text-white/90">{property.priceSAR > 0 ? formatPrice(property.priceSAR, currency) : (isAr ? 'حسب الطلب' : 'Price on request')}</p>
              </div>
              <Link href={`/properties/${property.id}`} className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0C3826] transition-transform group-hover:scale-105 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10" aria-label={`${isAr ? 'عرض' : 'View'} ${isAr ? property.titleAr : property.title}`}><ArrowUpRight className="h-4 w-4" /></Link>
            </article>)}
        </div>
      </div>
    </section>
  );
}

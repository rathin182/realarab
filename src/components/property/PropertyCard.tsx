import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Bath, BedDouble, MapPin, Maximize } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '../../lib/currency';
import { Currency, Language, Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  currency: Currency;
  language?: Language;
  animated?: boolean;
  showDescription?: boolean;
  showYield?: boolean;
}

export function PropertyCard({ property, currency, language = 'en', animated = false, showDescription = false, showYield = false }: PropertyCardProps) {
  const isAr = language === 'ar';
  const title = isAr ? property.titleAr : property.title;
  const location = isAr ? property.locationAr : property.location;
  const price = property.priceSAR > 0
    ? formatPrice(property.priceSAR, currency)
    : (isAr ? 'حسب الطلب' : 'Price on request');
  const Card = animated ? motion.article : 'article';

  return (
    <Card
      {...(animated ? { initial: { opacity: 0, y: 15 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } } : {})}
      className="group flex h-full flex-col"
    >
      <Link href={`/properties/${property.id}`} aria-label={`${isAr ? 'عرض' : 'View'} ${title}`} className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
        <img src={property.image} alt={title} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium capitalize text-neutral-900 shadow-sm backdrop-blur">{property.transaction.replace('-', ' ')}</span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium capitalize text-neutral-900 shadow-sm backdrop-blur">{property.type}</span>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white text-neutral-900 opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-lg tabular-nums tracking-tight text-neutral-900">{price}</p>
          {showYield && <span className="shrink-0 pt-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400">{property.tier}</span>}
        </div>
        <Link href={`/properties/${property.id}`} className="mt-1 line-clamp-1 text-base font-medium text-neutral-800 group-hover:underline group-hover:underline-offset-4">{title}</Link>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </p>
        {showDescription && (
          <p className="mt-3 line-clamp-1 pb-3 text-xs font-light leading-5 text-neutral-500">
            {(() => {
              const description = isAr
                ? property.descriptionAr
                : property.description;

              const words = description?.trim().split(/\s+/) ?? [];

              return words.length > 5
                ? `${words.slice(0, 5).join(" ")}...`
                : description;
            })()}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
          <p className="flex flex-wrap items-center gap-x-2">
            {property.bedrooms > 0 && <span className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />{property.bedrooms} {isAr ? 'غرف' : 'bd'}</span>}
            {property.bathrooms > 0 && <span className="inline-flex items-center gap-1 before:text-neutral-300 before:content-['•']">
              <Bath className="h-3.5 w-3.5" />{property.bathrooms} {isAr ? 'حمام' : 'ba'}</span>}
            {property.sizeSqm > 0 && <span className="inline-flex items-center gap-1 before:text-neutral-300 before:content-['•']">
              <Maximize className="h-3 w-3" />{property.sizeSqm.toLocaleString()} m²</span>}
          </p>
          {showYield && Number.parseFloat(property.projectedYield) > 0
            ? <span className="ml-auto text-[#0C3826]">{property.projectedYield} yield</span>
            : <span className="shrink-0 text-[10px] text-neutral-400">{property.city}</span>}
        </div>
      </div>
    </Card>
  );
}

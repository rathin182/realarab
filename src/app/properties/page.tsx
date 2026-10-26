'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDownUp, ArrowUpRight, Bath, BedDouble, Check, ChevronDown, MapPin, Maximize2, Search, SlidersHorizontal, X } from 'lucide-react';
import { CURRENCY_RATES } from '../../data/websiteContent';
import { Currency, Property, TransactionFilter } from '../../types';
import { formatPrice } from '../../lib/currency';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'size-large' | 'yield-high' | 'name';

const transactionTypes: { value: TransactionFilter; label: string }[] = [
  { value: 'all', label: 'All opportunities' },
  { value: 'buy', label: 'Buy / For sale' },
  { value: 'off-plan', label: 'Off-plan' },
  { value: 'commercial', label: 'Commercial' },
];

const presetPrices = Array.from({ length: 102 }, (_, index) => String(index * 10_000));

const sortLabels: Record<SortOption, string> = {
  featured: 'Featured first',
  'price-low': 'Price: low to high',
  'price-high': 'Price: high to low',
  'size-large': 'Largest first',
  'yield-high': 'Highest projected yield',
  name: 'Name: A to Z',
};

function getYield(property: Property) {
  return Number.parseFloat(property.projectedYield) || 0;
}

function matchesSearch(property: Property, query: string) {
  if (!query) return true;
  const searchable = [
    property.title, property.titleAr, property.location, property.locationAr,
    property.city, property.type, property.transaction, property.tier,
    property.badge, property.registration, property.description,
    ...property.flags, ...property.keyFeatures,
  ].join(' ').toLocaleLowerCase();
  return searchable.includes(query.toLocaleLowerCase());
}

function PriceBoundField({ label, value, currency, onChange }: { label: string; value: string; currency: Currency; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative text-[10px] font-mono uppercase tracking-wider text-neutral-500">
      <label>{label} ({currency})</label>
      <div className="mt-1.5 flex h-11 w-full items-center border border-neutral-200 bg-white transition focus-within:border-[#0C3826]">
        <input type="number" min="0" inputMode="numeric" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Any" aria-label={label} className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-sans normal-case tracking-normal text-neutral-800 outline-none placeholder:text-neutral-400" />
        <button type="button" aria-label={`Choose ${label}`} aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)} className="flex h-full items-center px-3 text-neutral-500 transition-colors hover:text-[#0C3826]"><ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
      </div>
      {isOpen && <div data-lenis-prevent onWheel={(event) => event.stopPropagation()} role="listbox" aria-label={`${label} presets`} className="filter-dropdown-scroll absolute inset-x-0 top-[calc(100%+0.35rem)] z-30 max-h-56 overflow-y-auto overscroll-contain rounded-md border border-neutral-200 bg-white p-1 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.28)]">
        {[{ value: '', label: 'Any' }, ...presetPrices.map((price) => ({ value: price, label: Number(price).toLocaleString() }))].map((option) => <button key={option.value || 'any'} type="button" role="option" aria-selected={value === option.value} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`block w-full rounded px-3 py-2.5 text-left font-sans text-sm normal-case tracking-normal transition-colors ${value === option.value ? 'bg-emerald-50 font-medium text-emerald-600' : 'text-neutral-700 hover:bg-neutral-50'}`}>{option.label}</button>)}
      </div>}
    </div>
  );
}

function PropertyCard({ property, currency }: { property: Property; currency: Currency }) {
  const price = property.priceSAR > 0 ? formatPrice(property.priceSAR, currency) : 'Price on request';
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/properties/${property.id}`} className="relative block aspect-[4/3] overflow-hidden bg-neutral-100">
        <img src={property.image} alt={property.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="bg-white/95 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wide text-[#0C3826]">{property.transaction.replace('-', ' ')}</span>
          <span className="bg-white/95 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wide text-neutral-700">{property.type}</span>
        </div>
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0C3826] opacity-0 shadow transition-all group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
      </Link>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-lg tabular-nums tracking-tight text-neutral-900">{price}</p>
          <span className="shrink-0 pt-1 font-mono text-[9px] uppercase tracking-wider text-neutral-400">{property.tier}</span>
        </div>
        <Link href={`/properties/${property.id}`} className="mt-1 text-sm text-neutral-800 group-hover:text-[#0C3826] group-hover:underline group-hover:underline-offset-4">{property.title}</Link>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="line-clamp-1">{property.location}</span></p>
        <p className="mt-3 line-clamp-2 min-h-10 text-xs font-light leading-5 text-neutral-500">{property.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500">
          {property.bedrooms > 0 && <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{property.bedrooms} beds</span>}
          {property.bathrooms > 0 && <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{property.bathrooms} baths</span>}
          {property.sizeSqm > 0 && <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{property.sizeSqm.toLocaleString()} m²</span>}
          {getYield(property) > 0 && <span className="ml-auto text-[#0C3826]">{property.projectedYield} yield</span>}
        </div>
      </div>
    </article>
  );
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('all');
  const [type, setType] = useState('all');
  const [transaction, setTransaction] = useState<TransactionFilter>('all');
  const [tier, setTier] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBeds, setMinBeds] = useState('all');
  const [minBaths, setMinBaths] = useState('all');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [minYield, setMinYield] = useState('');
  const [sort, setSort] = useState<SortOption>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetch('/api/listings')
      .then((response) => response.ok ? response.json() as Promise<Property[]> : [])
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setIsLoading(false));
  }, []);

  const cities = [...new Set(properties.map((property) => property.city))].sort();
  const propertyTypes = [...new Set(properties.map((property) => property.type))].sort();
  const tiers = [...new Set(properties.map((property) => property.tier))];

  const filteredProperties = useMemo(() => {
    const currencyRate = CURRENCY_RATES[currency].rate;
    const minPriceSAR = minPrice ? Number(minPrice) / currencyRate : 0;
    const maxPriceSAR = maxPrice ? Number(maxPrice) / currencyRate : Infinity;
    const results = properties.filter((property) => {
      if (!matchesSearch(property, query.trim())) return false;
      if (city !== 'all' && property.city !== city) return false;
      if (type !== 'all' && property.type !== type) return false;
      if (transaction !== 'all' && property.transaction !== transaction) return false;
      if (tier !== 'all' && property.tier !== tier) return false;
      if (minBeds !== 'all' && property.bedrooms < Number(minBeds)) return false;
      if (minBaths !== 'all' && property.bathrooms < Number(minBaths)) return false;
      if (minPrice && (!property.priceSAR || property.priceSAR < minPriceSAR)) return false;
      if (maxPrice && (!property.priceSAR || property.priceSAR > maxPriceSAR)) return false;
      if (minSize && property.sizeSqm < Number(minSize)) return false;
      if (maxSize && property.sizeSqm > Number(maxSize)) return false;
      if (minYield && getYield(property) < Number(minYield)) return false;
      return true;
    });

    switch (sort) {
      case 'price-low': return results.sort((a, b) => (a.priceSAR || Infinity) - (b.priceSAR || Infinity));
      case 'price-high': return results.sort((a, b) => (b.priceSAR || -Infinity) - (a.priceSAR || -Infinity));
      case 'size-large': return results.sort((a, b) => b.sizeSqm - a.sizeSqm);
      case 'yield-high': return results.sort((a, b) => getYield(b) - getYield(a));
      case 'name': return results.sort((a, b) => a.title.localeCompare(b.title));
      default: return results.sort((a, b) => tiers.indexOf(a.tier) - tiers.indexOf(b.tier));
    }
  }, [properties, query, city, type, transaction, tier, minPrice, maxPrice, minBeds, minBaths, minSize, maxSize, minYield, sort, currency]);

  const activeFilterCount = [city !== 'all', type !== 'all', transaction !== 'all', tier !== 'all', !!minPrice, !!maxPrice, minBeds !== 'all', minBaths !== 'all', !!minSize, !!maxSize, !!minYield].filter(Boolean).length;

  const resetFilters = () => {
    setQuery(''); setCity('all'); setType('all'); setTransaction('all'); setTier('all');
    setMinPrice(''); setMaxPrice(''); setMinBeds('all'); setMinBaths('all'); setMinSize(''); setMaxSize(''); setMinYield(''); setSort('featured');
  };

  const selectClass = 'mt-1.5 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition focus:border-[#0C3826]';
  const inputClass = 'mt-1.5 h-11 w-full border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0C3826]';

  return (
    <main className="min-h-screen bg-white pb-20 text-[#141A17]">
      <section className="border-b border-neutral-200 bg-[#F7F6F1] px-5 pb-12 pt-12 sm:px-8 sm:pb-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#A98950]">The Najm collection · Saudi Arabia</p>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-5xl font-light leading-none text-[#0C3826] sm:text-7xl">Find your place.</h1>
              <p className="mt-4 max-w-2xl text-sm font-light leading-6 text-neutral-600 sm:text-base">Explore every residence, estate, sanctuary and investment opportunity in our collection.</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-500"><span className="font-mono text-xl text-[#0C3826]">{filteredProperties.length.toString().padStart(2, '0')}</span><span>properties available</span></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[110rem] px-4 pt-8 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row">
          <label className="relative min-w-0 flex-1"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by property, location, feature or registration…" className="h-12 w-full border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#0C3826]" /></label>
          <div className="flex gap-3">
            <label className="flex min-w-36 flex-1 items-center gap-2 border border-neutral-200 bg-white px-3 text-neutral-500"><ArrowDownUp className="h-4 w-4 shrink-0" /><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-12 min-w-0 flex-1 bg-transparent text-xs text-neutral-700 outline-none">{Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen} className="inline-flex h-12 items-center gap-2 border border-neutral-200 bg-white px-4 text-xs text-neutral-700 transition-colors hover:border-[#0C3826]"><SlidersHorizontal className="h-4 w-4" />Filters{activeFilterCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0C3826] px-1 text-[10px] text-white">{activeFilterCount}</span>}<ChevronDown className={`h-3.5 w-3.5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} /></button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {transactionTypes.map((option) => <button key={option.value} type="button" onClick={() => setTransaction(option.value)} className={`border px-3.5 py-2 text-[10px] font-mono uppercase tracking-wider transition-colors ${transaction === option.value ? 'border-[#0C3826] bg-[#0C3826] text-white' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800'}`}>{option.label}</button>)}
        </div>

        {filtersOpen && <div className="mb-8 border border-neutral-200 bg-[#FAFAF8] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-4"><div><p className="font-serif text-xl text-[#0C3826]">Refine your search</p><p className="mt-1 text-xs text-neutral-500">Combine filters to narrow the collection.</p></div><button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#0C3826]"><X className="h-3.5 w-3.5" />Reset all</button></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Location<select value={city} onChange={(event) => setCity(event.target.value)} className={selectClass}><option value="all">All cities</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Property type<select value={type} onChange={(event) => setType(event.target.value)} className={selectClass}><option value="all">All types</option>{propertyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Collection<select value={tier} onChange={(event) => setTier(event.target.value)} className={selectClass}><option value="all">All collections</option>{tiers.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Currency<select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} className={selectClass}><option>SAR</option><option>USD</option><option>EUR</option><option>GBP</option><option>AED</option></select></label>
            <PriceBoundField label="Minimum price" value={minPrice} currency={currency} onChange={setMinPrice} />
            <PriceBoundField label="Maximum price" value={maxPrice} currency={currency} onChange={setMaxPrice} />
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Bedrooms<select value={minBeds} onChange={(event) => setMinBeds(event.target.value)} className={selectClass}><option value="all">Any</option>{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <option key={item} value={item}>{item}+ bedrooms</option>)}</select></label>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Bathrooms<select value={minBaths} onChange={(event) => setMinBaths(event.target.value)} className={selectClass}><option value="all">Any</option>{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <option key={item} value={item}>{item}+ bathrooms</option>)}</select></label>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Min size (m²)<input type="number" min="0" value={minSize} onChange={(event) => setMinSize(event.target.value)} placeholder="Any size" className={inputClass} /></label>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Max size (m²)<input type="number" min="0" value={maxSize} onChange={(event) => setMaxSize(event.target.value)} placeholder="Any size" className={inputClass} /></label>
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Min. projected yield (%)<input type="number" min="0" step="0.1" value={minYield} onChange={(event) => setMinYield(event.target.value)} placeholder="Any yield" className={inputClass} /></label>
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500"><Check className="h-3.5 w-3.5 text-[#0C3826]" />Filters apply instantly to all {properties.length} properties.</div>
        </div>}

        <div className="mb-5 flex items-center justify-between border-b border-neutral-200 pb-3 text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400"><span>Showing {filteredProperties.length} of {properties.length} properties</span><span>{sortLabels[sort]}</span></div>

        {isLoading ? <p className="border-y border-neutral-200 py-20 text-center text-sm text-neutral-500">Loading properties...</p> : filteredProperties.length > 0 ? <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">{filteredProperties.map((property) => <PropertyCard key={property.id} property={property} currency={currency} />)}</div> : <div className="border-y border-neutral-200 py-20 text-center"><p className="font-serif text-3xl text-[#0C3826]">No properties match those filters.</p><p className="mt-2 text-sm text-neutral-500">Try changing a filter or clearing your search.</p><button type="button" onClick={resetFilters} className="mt-5 border border-[#0C3826] px-5 py-3 text-xs uppercase tracking-wider text-[#0C3826] transition-colors hover:bg-[#0C3826] hover:text-white">Reset filters</button></div>}
      </section>
    </main>
  );
}

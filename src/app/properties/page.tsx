'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowDownUp, ArrowUpRight, Bath, BedDouble, Check, ChevronDown, MapPin, Maximize2, Search, SlidersHorizontal, X } from 'lucide-react';
import { CURRENCY_RATES } from '../../data/websiteContent';
import { Currency, Property, TransactionFilter } from '../../types';
import { formatPrice } from '../../lib/currency';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'size-large' | 'yield-high' | 'name';
type ReadinessFilter = 'all' | 'ready' | 'off-plan';
const PROPERTIES_PER_PAGE = 15;

interface ListingPageResponse {
  items: Property[];
  total: number;
  page: number;
  hasMore: boolean;
  cities: string[];
  types: string[];
}

const propertyTypeGroups = {
  Residential: ['Apartment', 'Villa', 'Townhouse', 'Penthouse'],
  Commercial: ['Office', 'Retail', 'Bulk Sale Unit', 'Warehouse'],
  Land: ['Land'],
};

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

function makeListingsUrl(page: number, filters: {
  query: string; city: string; type: string; transaction: TransactionFilter; tier: string;
  minPrice: string; maxPrice: string; minBeds: string; minBaths: string;
  minSize: string; maxSize: string; minYield: string; sort: SortOption;
  readiness: ReadinessFilter; currency: Currency;
}) {
  const params = new URLSearchParams({ paginated: '1', page: String(page), pageSize: String(PROPERTIES_PER_PAGE), sort: filters.sort });
  const entries: [string, string][] = [
    ['q', filters.query.trim()], ['city', filters.city], ['type', filters.type],
    ['transaction', filters.transaction], ['tier', filters.tier],
    ['minPrice', filters.minPrice ? String(Number(filters.minPrice) / CURRENCY_RATES[filters.currency].rate) : ''],
    ['maxPrice', filters.maxPrice ? String(Number(filters.maxPrice) / CURRENCY_RATES[filters.currency].rate) : ''],
    ['minBeds', filters.minBeds === 'all' ? '' : filters.minBeds], ['minBaths', filters.minBaths === 'all' ? '' : filters.minBaths],
    ['minSize', filters.minSize], ['maxSize', filters.maxSize], ['minYield', filters.minYield], ['readiness', filters.readiness],
  ];
  for (const [key, value] of entries) if (value && value !== 'all') params.set(key, value);
  return `/api/listings?${params.toString()}`;
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

function PropertiesContent() {
  const searchParams = useSearchParams();
  const filterBarRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const loadingMoreRef = useRef(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadedPage, setLoadedPage] = useState(0);
  const [cities, setCities] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [city, setCity] = useState(searchParams.get('city') ?? 'all');
  const [type, setType] = useState('all');
  const [transaction, setTransaction] = useState<TransactionFilter>((searchParams.get('transaction') as TransactionFilter) ?? 'buy');
  const [tier, setTier] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBeds, setMinBeds] = useState('all');
  const [minBaths, setMinBaths] = useState('all');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [minYield, setMinYield] = useState('');
  const [sort, setSort] = useState<SortOption>('featured');
  const [readiness, setReadiness] = useState<ReadinessFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [typeCategory, setTypeCategory] = useState<keyof typeof propertyTypeGroups>('Residential');

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !filterBarRef.current?.contains(event.target)) setActiveDropdown(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setActiveDropdown(null); };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.removeEventListener('pointerdown', closeOnOutsideClick); document.removeEventListener('keydown', closeOnEscape); };
  }, []);

  const requestFilters = useMemo(() => ({ query, city, type, transaction, tier, minPrice, maxPrice, minBeds, minBaths, minSize, maxSize, minYield, sort, readiness, currency }), [query, city, type, transaction, tier, minPrice, maxPrice, minBeds, minBaths, minSize, maxSize, minYield, sort, readiness, currency]);
  const requestUrl = useMemo(() => makeListingsUrl(1, requestFilters), [requestFilters]);

  useEffect(() => {
    const controller = new AbortController();
    requestControllerRef.current?.abort();
    requestControllerRef.current = controller;
    setIsLoading(true);
    setIsLoadingMore(false);
    loadingMoreRef.current = false;
    setProperties([]);
    setLoadedPage(0);
    setHasMore(false);
    fetch(requestUrl, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load properties.');
        return response.json() as Promise<ListingPageResponse>;
      })
      .then((data) => {
        setProperties(data.items);
        setTotalProperties(data.total);
        setHasMore(data.hasMore);
        setLoadedPage(data.items.length ? 1 : 0);
        setCities(data.cities);
        setPropertyTypes(data.types);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setProperties([]);
        setTotalProperties(0);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [requestUrl]);

  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || loadingMoreRef.current || !hasMore || loadedPage < 1) return;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const response = await fetch(makeListingsUrl(loadedPage + 1, requestFilters), { signal: requestControllerRef.current?.signal });
      if (!response.ok) throw new Error('Unable to load more properties.');
      const data = await response.json() as ListingPageResponse;
      setProperties((current) => [...current, ...data.items]);
      setLoadedPage(data.page ?? loadedPage + 1);
      setHasMore(data.hasMore);
    } catch {
      setHasMore(false);
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMore, loadedPage, requestFilters]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMore || isLoading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !loadingMoreRef.current) void loadMore();
    }, { rootMargin: '500px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore, properties.length]);

  const tiers = ['featured', 'curated', 'vault', 'syndicate'];
  const features = [...new Set(properties.flatMap((property) => [...property.keyFeatures, ...property.flags]).filter(Boolean))].sort();

  const activeFilterCount = [city !== 'all', type !== 'all', transaction !== 'all', tier !== 'all', !!minPrice, !!maxPrice, minBeds !== 'all', minBaths !== 'all', !!minSize, !!maxSize, !!minYield].filter(Boolean).length;
  const compactTypeLabel = type === 'all' ? 'Property type' : type;
  const compactBedsLabel = minBeds === 'all' && minBaths === 'all' ? 'Beds & Baths' : `${minBeds === 'all' ? 'Any' : `${minBeds}+ beds`} · ${minBaths === 'all' ? 'Any' : `${minBaths}+ baths`}`;
  const compactPriceLabel = minPrice || maxPrice ? `${minPrice || 'Any'} – ${maxPrice || 'Any'} ${currency}` : `Price (${currency})`;
  const dropdownButton = (id: string, label: string, selected: boolean, width: string, content: React.ReactNode) => (
    <div className={`relative shrink-0 ${width}`}>
      <button type="button" onClick={() => setActiveDropdown((current) => current === id ? null : id)} aria-expanded={activeDropdown === id} aria-haspopup="dialog" className={`flex h-12 w-full items-center justify-between gap-3 rounded-lg border px-3.5 text-left text-xs transition-colors sm:px-4 ${selected || activeDropdown === id ? 'border-[#087985] text-[#00666D]' : 'border-neutral-200 text-neutral-700 hover:border-[#087985]'}`}>
        <span className="truncate">{label}</span><ChevronDown className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform ${activeDropdown === id ? 'rotate-180' : ''}`} />
      </button>
      {activeDropdown === id && <div role="dialog" className="absolute left-0 top-[calc(100%+0.55rem)] z-40 w-[min(21rem,calc(100vw-2rem))] rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.3)]">{content}</div>}
    </div>
  );
  const doneButton = (onClick = () => setActiveDropdown(null)) => <button type="button" onClick={onClick} className="h-10 flex-1 rounded-lg bg-[#00666D] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#00555B]">Done</button>;
  const resetButton = (onClick: () => void) => <button type="button" onClick={onClick} className="h-10 flex-1 rounded-lg border border-[#087985] px-4 text-xs font-semibold text-[#00666D] transition-colors hover:bg-[#F0FAFA]">Reset</button>;

  const resetFilters = () => {
    setQuery(''); setCity('all'); setType('all'); setTransaction('all'); setTier('all');
    setMinPrice(''); setMaxPrice(''); setMinBeds('all'); setMinBaths('all'); setMinSize(''); setMaxSize(''); setMinYield('');
    setReadiness('all');
    setActiveDropdown(null);
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
            {/* <div className="flex items-center gap-3 text-xs text-neutral-500"><span className="font-mono text-xl text-[#0C3826]">{totalProperties.toString().padStart(2, '0')}</span><span>properties available</span></div> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[110rem] px-4 pt-8 sm:px-8 lg:px-10">
        <div ref={filterBarRef} className="relative z-20 mb-7 rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_8px_28px_-24px_rgba(0,0,0,0.35)]">
          <div className="flex flex-wrap items-center gap-2.5 xl:flex-nowrap">
            <div className="relative shrink-0">
              <button type="button" onClick={() => setActiveDropdown((current) => current === 'purpose' ? null : 'purpose')} aria-expanded={activeDropdown === 'purpose'} className={`flex h-12 min-w-[6.5rem] items-center justify-center gap-2 rounded-lg border px-4 text-xs ${transaction !== 'all' ? 'border-[#087985] text-[#00666D]' : 'border-neutral-200 text-neutral-700'}`}>{transaction === 'rent' ? 'Rent' : transaction === 'buy' ? 'Buy' : 'Purpose'}<ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'purpose' ? 'rotate-180' : ''}`} /></button>
              {activeDropdown === 'purpose' && <div role="dialog" className="absolute left-0 top-[calc(100%+0.55rem)] z-40 w-64 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.3)]"><p className="mb-3 text-xs font-semibold text-neutral-700">Purpose</p><div className="grid grid-cols-2 rounded-lg border border-neutral-200 p-1"><button type="button" onClick={() => setTransaction('buy')} className={`rounded-md py-2 text-xs ${transaction === 'buy' ? 'bg-emerald-50 font-semibold text-emerald-600' : 'text-neutral-600'}`}>Buy</button><button type="button" onClick={() => setTransaction('rent')} className={`rounded-md py-2 text-xs ${transaction === 'rent' ? 'bg-emerald-50 font-semibold text-emerald-600' : 'text-neutral-600'}`}>Rent</button></div><div className="mt-4 flex gap-2">{resetButton(() => setTransaction('all'))}{doneButton()}</div></div>}
            </div>
            <label className="relative flex h-12 min-w-[13rem] flex-1 items-center gap-2 rounded-lg border border-[#76B8BE] px-3.5 focus-within:border-[#087985] xl:max-w-[24rem]"><MapPin className="h-4 w-4 shrink-0 text-[#00666D]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="City, community or building" aria-label="Search city, community or building" className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400" />{query && <button type="button" onClick={() => { setQuery(''); setCity('all'); }} aria-label="Clear location" className="text-neutral-400 hover:text-neutral-700"><X className="h-4 w-4" /></button>}</label>
            {dropdownButton('type', compactTypeLabel, type !== 'all', 'w-[10rem]', <><div className="mb-3 grid grid-cols-3 border-b border-neutral-200 text-xs">{(Object.keys(propertyTypeGroups) as (keyof typeof propertyTypeGroups)[]).map((group) => <button key={group} type="button" onClick={() => setTypeCategory(group)} className={`border-b-2 py-2 ${typeCategory === group ? 'border-emerald-500 font-semibold text-emerald-600' : 'border-transparent text-neutral-500'}`}>{group}</button>)}</div><div className="grid grid-cols-2 gap-2">{propertyTypeGroups[typeCategory].map((item) => <button key={item} type="button" onClick={() => setType(type === item ? 'all' : item)} className={`rounded-full border px-2.5 py-2 text-xs ${type === item ? 'border-emerald-500 bg-emerald-50 font-medium text-emerald-600' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}>{type === item && <Check className="mr-1 inline h-3 w-3" />}{item}</button>)}</div><div className="mt-4 flex gap-2">{resetButton(() => setType('all'))}{doneButton()}</div></>)}
            {dropdownButton('beds', compactBedsLabel, minBeds !== 'all' || minBaths !== 'all', 'w-[11.5rem]', <><p className="mb-2 text-xs font-semibold text-neutral-700">Bedrooms</p><div className="mb-4 flex flex-wrap gap-1.5">{['Studio', '1', '2', '3', '4', '5', '6', '7', '8+'].map((value) => <button key={value} type="button" onClick={() => setMinBeds(value === 'Studio' ? '0' : value === '8+' ? '8' : value)} className={`min-w-10 rounded-full border px-3 py-1.5 text-xs ${minBeds === (value === 'Studio' ? '0' : value === '8+' ? '8' : value) ? 'border-[#087985] bg-[#EAF6F6] text-[#00666D]' : 'border-neutral-200 text-neutral-600'}`}>{value}</button>)}</div><p className="mb-2 text-xs font-semibold text-neutral-700">Bathrooms</p><div className="flex flex-wrap gap-1.5">{['1', '2', '3', '4', '5', '6+'].map((value) => <button key={value} type="button" onClick={() => setMinBaths(value === '6+' ? '6' : value)} className={`min-w-10 rounded-full border px-3 py-1.5 text-xs ${minBaths === (value === '6+' ? '6' : value) ? 'border-[#087985] bg-[#EAF6F6] text-[#00666D]' : 'border-neutral-200 text-neutral-600'}`}>{value}</button>)}</div><div className="mt-4 flex gap-2">{resetButton(() => { setMinBeds('all'); setMinBaths('all'); })}{doneButton()}</div></>)}
            {dropdownButton('price', compactPriceLabel, !!minPrice || !!maxPrice, 'w-[11.5rem]', <><div className="grid grid-cols-2 gap-2"><PriceBoundField label="Minimum" value={minPrice} currency={currency} onChange={setMinPrice} /><PriceBoundField label="Maximum" value={maxPrice} currency={currency} onChange={setMaxPrice} /></div><label className="mt-3 block text-xs text-neutral-500">Currency<select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-[#087985]"><option>SAR</option><option>AED</option><option>USD</option><option>EUR</option><option>GBP</option></select></label><div className="mt-4 flex gap-2">{resetButton(() => { setMinPrice(''); setMaxPrice(''); })}{doneButton()}</div></>)}
            {dropdownButton('more', `More filters${activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}`, filtersOpen, 'w-[9.5rem]', <><div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1"><label className="block text-xs font-semibold text-neutral-700">Collection<select value={tier} onChange={(event) => setTier(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm font-normal text-neutral-700"><option value="all">All collections</option>{tiers.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select></label><label className="block text-xs font-semibold text-neutral-700">Area (m²)<span className="mt-1.5 grid grid-cols-2 gap-2"><input type="number" min="0" value={minSize} onChange={(event) => setMinSize(event.target.value)} placeholder="Minimum" className="h-10 min-w-0 rounded-lg border border-neutral-200 px-3 text-sm font-normal outline-none focus:border-[#087985]" /><input type="number" min="0" value={maxSize} onChange={(event) => setMaxSize(event.target.value)} placeholder="Maximum" className="h-10 min-w-0 rounded-lg border border-neutral-200 px-3 text-sm font-normal outline-none focus:border-[#087985]" /></span></label><label className="block text-xs font-semibold text-neutral-700">Minimum projected yield (%)<input type="number" min="0" step="0.1" value={minYield} onChange={(event) => setMinYield(event.target.value)} placeholder="Any" className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 px-3 text-sm font-normal outline-none focus:border-[#087985]" /></label>
              <div><p className="mb-2 text-xs font-semibold text-neutral-700">Features</p><div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">{features.slice(0, 24).map((feature) => <span key={feature} className="rounded-full border border-neutral-200 px-2.5 py-1.5 text-[11px] text-neutral-500">{feature}</span>)}</div>{features.length === 0 && <p className="text-xs text-neutral-400">Features will appear when listings include them.</p>}</div><label className="block text-xs font-semibold text-neutral-700">Sort results<select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm font-normal text-neutral-700">{Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div><div className="mt-4 flex gap-2 border-t border-neutral-100 pt-3">{resetButton(resetFilters)}{doneButton(() => { setFiltersOpen(false); setActiveDropdown(null); })}</div></>)}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500"><span>{totalProperties} properties match your search</span><button type="button" onClick={resetFilters} className="font-medium text-[#00666D] hover:underline">Clear filters</button></div>
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
          <div className="mt-5 flex items-center gap-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500"><Check className="h-3.5 w-3.5 text-[#0C3826]" />Filters apply instantly to all {totalProperties} matching properties.</div>
        </div>}

        <div className="mb-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="mb-5 flex flex-col gap-4 border-b border-neutral-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <fieldset className="flex flex-wrap items-center gap-2" aria-label="Filter by property readiness">
              {([['all', 'All'], ['ready', 'Ready'], ['off-plan', 'Off-Plan']] as const).map(([value, label]) => (
                <label key={value} className={`inline-flex h-9 min-w-[6.25rem] cursor-pointer items-center justify-center rounded-lg border px-4 text-xs transition-colors ${readiness === value ? 'border-[#087985] bg-[#EAF6F6] font-semibold text-[#00666D]' : 'border-neutral-300 bg-white text-neutral-700 hover:border-[#087985]'}`}>
                  <input type="radio" name="property-readiness" value={value} checked={readiness === value} onChange={() => setReadiness(value)} className="sr-only" />
                  {label}
                </label>
              ))}
            </fieldset>
            {/* <div className="flex items-center text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 sm:ml-auto">
            Showing {properties.length} of {totalProperties} properties
          </div> */}
          </div>

          <div className="mb-4 flex justify-end">
            <label className="flex h-12 min-w-40 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-500">
              <ArrowDownUp className="h-4 w-4 shrink-0" />
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Sort properties" className="h-full min-w-0 flex-1 bg-transparent text-xs text-neutral-700 outline-none">
                {Object.entries(sortLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {isLoading ? <p className="border-y border-neutral-200 py-20 text-center text-sm text-neutral-500">Loading properties...</p> : properties.length > 0 ? <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">{properties.map((property) => <PropertyCard key={property.id} property={property} currency={currency} />)}</div>
          <div ref={loadMoreRef} aria-hidden="true" className="h-1" />
          {isLoadingMore && <p className="py-8 text-center text-sm text-neutral-500">Loading more properties...</p>}
          {hasMore && !isLoadingMore && <button type="button" onClick={() => void loadMore()} className="mx-auto mt-8 block rounded-lg border border-[#087985] px-5 py-3 text-xs font-semibold text-[#00666D] transition-colors hover:bg-[#EAF6F6]">Load more properties</button>}
        </> : <div className="border-y border-neutral-200 py-20 text-center"><p className="font-serif text-3xl text-[#0C3826]">No properties match those filters.</p><p className="mt-2 text-sm text-neutral-500">Try changing a filter or clearing your search.</p><button type="button" onClick={resetFilters} className="mt-5 border border-[#0C3826] px-5 py-3 text-xs uppercase tracking-wider text-[#0C3826] transition-colors hover:bg-[#0C3826] hover:text-white">Reset filters</button></div>}
      </section>
    </main>
  );
}

export default function PropertiesPage() {
  return <Suspense fallback={<main className="min-h-screen bg-white px-6 py-24 text-center text-sm text-neutral-500">Loading property search…</main>}><PropertiesContent /></Suspense>;
}

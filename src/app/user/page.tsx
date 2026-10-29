'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { BuyerHomeData } from '@/types/home';
import { getBuyerHome } from '@/lib/api/buyerHome';
import { HeroSearch } from '@/components/user/home/HeroSearch';
import { FeaturedProperties } from '@/components/user/home/FeaturedProperties';
import { PopularLocations } from '@/components/user/home/PopularLocations';
import { HomeSkeleton } from '@/components/user/home/HomeSkeleton';
import { Toast, useToast } from '@/components/feedback/Toast';

export default function BuyerHomePage() {
  const [data, setData] = useState<BuyerHomeData | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const { toast, showToast, dismissToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    getBuyerHome()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          if (attempt > 0) showToast('Dashboard refreshed.');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          showToast('Could not refresh the dashboard. Please try again.', 'error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setError(false);
    setData(null);
    showToast('Refreshing dashboard.', 'info');
    setAttempt((n) => n + 1);
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-[#F8F5F0] p-10 text-center">
        <Toast toast={toast} onDismiss={dismissToast} />
        <h2 className="font-serif text-2xl text-[#2E221C]">Couldn&apos;t load your home page</h2>
        <p className="mt-2 text-[14px] text-[#6F625A]">Something went wrong while fetching data.</p>
        <button
          onClick={retry}
          className="mt-5 rounded-lg bg-[#4A2F22] px-5 py-2 text-[14px] text-white hover:bg-[#3A2418]"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return <><Toast toast={toast} onDismiss={dismissToast} /><HomeSkeleton /></>;

  return (
    <div className="flex flex-col gap-5">
      <Toast toast={toast} onDismiss={dismissToast} />
      <HeroSearch hero={data.hero} filters={data.filters} />

      <Link
        href="/properties"
        className="flex items-center gap-4 rounded-3xl bg-[#F8F5F0] p-4 transition-colors hover:bg-[#F3EBDF]"
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#E4D5C0] text-[#4A2F22]">
          <Home size={24} />
        </span>
        <span className="flex-1">
          <span className="block text-[15px] font-medium text-[#2E221C]">Buy Property</span>
          <span className="block text-[12.5px] text-[#6F625A]">Find your dream home</span>
        </span>
        <ChevronRight size={18} className="text-[#6F625A]" />
      </Link>

      <FeaturedProperties items={data.featured} />
      <PopularLocations items={data.popularLocations} />
    </div>
  );
}

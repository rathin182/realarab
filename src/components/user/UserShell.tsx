'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MapPin,
  Heart,
  MessageCircle,
  Clock,
  Building2,
  Search,
  User,
  Menu,
  X,
  Bell,
  ChevronDown,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/user', label: 'Home', icon: Home },
  { href: '/properties', label: 'Explore', icon: MapPin },
  { href: '/user/favorites', label: 'Favorites', icon: Heart },
  { href: '/user/messages', label: 'Messages', icon: MessageCircle, badge: 3 },
  { href: '/user/inquiries', label: 'My Inquiries', icon: Clock },
  { href: '/user/properties', label: 'My Properties', icon: Building2 },
  { href: '/user/saved-searches', label: 'Saved Searches', icon: Search },
  { href: '/user/profile', label: 'Profile', icon: User },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Najm home">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
        <rect x="4" y="14" width="6" height="16" fill="#B89B72" />
        <rect x="12" y="6" width="6" height="24" fill="#8A6A4A" />
        <rect x="20" y="10" width="6" height="20" fill="#C9AE88" />
      </svg>
      <span className="font-serif text-[26px] tracking-wide text-[#3A2A22] leading-none">NAJM</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-2 pb-8">
        <Logo />
      </div>

      <nav className="flex flex-col gap-1" aria-label="Buyer navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const active =
  href === '/user'
    ? pathname === '/user'
    : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition-colors ${
                active
                  ? 'bg-[#EEE3D4] text-[#2E221C] font-medium'
                  : 'text-[#6F625A] hover:bg-[#F3EBDF] hover:text-[#2E221C]'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              <span className="flex-1">{label}</span>
              {badge ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#D9534F] px-1.5 text-[11px] font-semibold text-white">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Promo card */}
      <div
        className="relative mt-4 hidden max-h-[320px] min-h-[170px] flex-1 overflow-hidden rounded-2xl p-5 lg:block"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(120,88,66,0.92) 0%, rgba(120,88,66,0.35) 55%, rgba(30,20,14,0.55) 100%), url('/images/property_diriyah_gate_1791316737367.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h3 className="font-serif text-[26px] leading-tight text-white">
          Invest in
          <br />
          Saudi&apos;s Future
        </h3>
        <p className="mt-2 text-[12.5px] leading-snug text-white/80">
          Discover prime locations across the Kingdom.
        </p>
        <Link
          href="/properties"
          className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-[#2E221C] shadow-sm hover:bg-[#F6F0E8] transition-colors"
        >
          Explore Now
        </Link>
      </div>
    </div>
  );
}

export function UserShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EFEAE3] font-sans text-[#2E221C]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#F8F5F0]/95 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <button aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-[#EEE3D4]">
            <Bell size={20} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#D9534F]" />
          </button>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#EEE3D4]"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-[#F8F5F0] p-4 shadow-xl">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="mb-2 ml-auto grid h-9 w-9 place-items-center rounded-full hover:bg-[#EEE3D4]"
            >
              <X size={20} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="mx-auto flex max-w-[1600px] gap-5 p-3 lg:p-5">
        {/* Desktop sidebar */}
        <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-[260px] shrink-0 rounded-3xl bg-[#F8F5F0] p-4 lg:block">
          <SidebarContent />
        </aside>

        <div className="min-w-0 flex-1">
          {/* Desktop top bar */}
          <div className="mb-4 hidden items-center justify-between rounded-2xl bg-[#F8F5F0] px-5 py-3 lg:flex">
            <button className="flex items-center gap-2 text-sm text-[#2E221C]">
              <MapPin size={16} />
              Saudi Arabia
              <ChevronDown size={14} />
            </button>
            <div className="flex items-center gap-5">
              <span className="font-arabic text-lg text-[#6F625A]">العربية</span>
              <button aria-label="Notifications" className="relative">
                <Bell size={20} />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#D9534F]" />
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
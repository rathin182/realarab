'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Camera, Pencil, Check, X, ShieldCheck, Heart, Clock, Search, MessageCircle, Mail, Phone, MapPin, ChevronRight, BadgeCheck, Lock,} from 'lucide-react';
import { CURRENCY_RATES } from '@/src/data/websiteContent';
import type { Currency } from '@/src/types';


const INITIAL_PROFILE = {
  fullName: 'Abdullah Al-Rashid',
  email: 'abdullah.rashid@example.com',
  phone: '+966 50 123 4567',
  nationality: 'Saudi Arabia',
  city: 'Riyadh',
  language: 'English',
};

const INITIAL_PREFS = {
  intent: 'Buy' as 'Buy' | 'Rent' | 'Invest',
  types: ['Villa', 'Apartment'],
  cities: ['Riyadh', 'Jeddah'],
  budgetMin: '1000000',
  budgetMax: '5000000',
  bedrooms: '4',
};

const INITIAL_SETTINGS = {
  priceAlerts: true,
  newListings: true,
  whatsapp: false,
  twoFactor: false,
  currency: 'SAR' as Currency,
};

const STATS = [
  { label: 'Favorites', value: 12, sub: 'Saved properties', icon: Heart, href: '/user/favorites' },
  { label: 'Inquiries', value: 5, sub: 'Active requests', icon: Clock, href: '/user/inquiries' },
  { label: 'Saved Searches', value: 3, sub: 'With alerts on', icon: Search, href: '/user/saved-searches' },
  { label: 'Messages', value: 3, sub: 'Unread chats', icon: MessageCircle, href: '/user/messages' },
];

const PROPERTY_TYPES = ['Villa', 'Apartment', 'Land', 'Commercial', 'Penthouse', 'Townhouse'];
const CITIES = ['Riyadh', 'Jeddah', 'Dammam', 'Makkah', 'Madinah', 'NEOM'];
const COUNTRIES = ['Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Bahrain', 'Qatar', 'Oman', 'Egypt', 'Jordan', 'India', 'Pakistan', 'United Kingdom', 'United States', 'Other'];
const card = 'rounded-3xl bg-[#FBF9F6] p-5 sm:p-6 shadow-[0_1px_0_rgba(60,40,25,0.04)]';
const inputBase =
  'w-full rounded-xl border border-[#E4DAC9] bg-white px-3.5 py-2.5 text-[14px] text-[#2E221C] outline-none transition focus:border-[#8A6A4A] focus:ring-2 focus:ring-[#8A6A4A]/15 disabled:bg-[#F6F1E9] disabled:text-[#6F625A]';

function Field({ label, children, icon }: { label: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium tracking-wide text-[#8B7D72]">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
        active
          ? 'border-[#3A2A22] bg-[#3A2A22] text-white'
          : 'border-[#E4DAC9] bg-white text-[#6F625A] hover:border-[#B89B72]'
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[14px] text-[#2E221C]">{label}</p>
        {hint && <p className="text-[12px] text-[#8B7D72]">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#3A2A22]' : 'bg-[#D9CFC0]'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

function toggleIn(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}


export function ProfileView() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);

  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const saveProfile = () => {
    setProfile(draft);
    setEditing(false);
    flash('Profile updated');
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
  };

  const completion = useMemo(() => {
    const checks = [
      !!profile.fullName,
      !!profile.email,
      !!profile.phone,
      !!profile.nationality,
      !!profile.city,
      prefs.types.length > 0,
      prefs.cities.length > 0,
      !!prefs.budgetMax,
      settings.twoFactor,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile, prefs, settings.twoFactor]);

  const ringR = 34;
  const ringC = 2 * Math.PI * ringR;

  const sym = CURRENCY_RATES[settings.currency];
  const fmtBudget = (v: string) => {
    if (!v) return '—';
    const n = Number(v) * sym.rate;
    return `${sym.symbol} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: n >= 1_000_000 ? 1 : 0, notation: n >= 1_000_000 ? 'compact' : 'standard' }).format(n)}`;
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-5">
        {/* Banner */}
        <section
          className="relative overflow-hidden rounded-3xl text-white"
          style={{
            backgroundImage:
              "linear-gradient(100deg, rgba(40,26,18,0.88) 0%, rgba(40,26,18,0.55) 55%, rgba(40,26,18,0.25) 100%), url('/images/hero_saudi_luxury_skyline_1791316717908.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        >
          <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white/90 bg-[#B89B72] font-serif text-4xl text-white sm:h-28 sm:w-28">
                  {initials(profile.fullName)}
                </div>
                <button
                  type="button"
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-white text-[#3A2A22] shadow hover:bg-[#F6F0E8]"
                >
                  <Camera size={16} />
                </button>
              </div>
              <div>
                <p className="mb-1 text-[12px] uppercase tracking-[0.2em] text-white/70">Buyer Profile</p>
                <h1 className="font-serif text-3xl leading-tight sm:text-5xl">{profile.fullName}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/85">
                  <span className="flex items-center gap-1.5"><MapPin size={14} />{profile.city}, Saudi Arabia</span>
                  <span className="flex items-center gap-1.5"><BadgeCheck size={14} />Verified buyer</span>
                  <span>Member since 2026</span>
                </div>
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-[#2E221C] hover:bg-[#F6F0E8]"
              >
                <Pencil size={15} /> Edit Profile
              </button>
            )}
          </div>
        </section>

        {/* Stat shortcuts */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATS.map(({ label, value, sub, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-3 rounded-2xl bg-[#FBF9F6] p-4 transition-shadow hover:shadow-md"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#EADFD0] text-[#6B4F36]">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-2xl leading-none text-[#2E221C]">{value}</span>
                <span className="mt-1 block text-[12.5px] text-[#2E221C]">{label}</span>
                <span className="block text-[11.5px] leading-snug text-[#8B7D72]">{sub}</span>
              </span>
              <ChevronRight size={16} className="hidden text-[#8B7D72] transition-transform group-hover:translate-x-0.5 sm:block" />
            </Link>
          ))}
        </section>

        {/* Personal information */}
        <section className={card} aria-labelledby="personal-info">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 id="personal-info" className="font-serif text-2xl text-[#2E221C]">Personal Information</h2>
              <p className="text-[13px] text-[#8B7D72]">Used for inquiries and to contact you about properties.</p>
            </div>
            {editing && (
              <div className="flex gap-2">
                <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DAC9] bg-white px-4 py-2 text-[13px] text-[#6F625A] hover:border-[#B89B72]">
                  <X size={14} /> Cancel
                </button>
                <button type="button" onClick={saveProfile} className="inline-flex items-center gap-1.5 rounded-full bg-[#3A2A22] px-4 py-2 text-[13px] text-white hover:bg-[#2A1D17]">
                  <Check size={14} /> Save
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input className={inputBase} disabled={!editing} value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
            </Field>
            <Field label="Email" icon={<Mail size={12} />}>
              <input type="email" className={inputBase} disabled={!editing} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            </Field>
            <Field label="Phone" icon={<Phone size={12} />}>
              <input type="tel" className={inputBase} disabled={!editing} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </Field>
            <Field label="Nationality">
              <select className={inputBase} disabled={!editing} value={draft.nationality} onChange={(e) => setDraft({ ...draft, nationality: e.target.value })}>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="City of residence">
              <select className={inputBase} disabled={!editing} value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Preferred language">
              <select className={inputBase} disabled={!editing} value={draft.language} onChange={(e) => setDraft({ ...draft, language: e.target.value })}>
                <option>English</option>
                <option>العربية</option>
              </select>
            </Field>
          </div>
        </section>

        {/* Buying preferences */}
        <section className={card} aria-labelledby="prefs">
          <div className="mb-5">
            <h2 id="prefs" className="font-serif text-2xl text-[#2E221C]">Property Preferences</h2>
            <p className="text-[13px] text-[#8B7D72]">We use these to tailor featured properties and alerts.</p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-[12px] font-medium tracking-wide text-[#8B7D72]">I want to</p>
              <div className="inline-flex rounded-full bg-[#EFE7DA] p-1">
                {(['Buy', 'Rent', 'Invest'] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={prefs.intent === o}
                    onClick={() => setPrefs({ ...prefs, intent: o })}
                    className={`rounded-full px-5 py-1.5 text-[13.5px] transition-colors ${prefs.intent === o ? 'bg-[#3A2A22] text-white' : 'text-[#6F625A]'}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-medium tracking-wide text-[#8B7D72]">Property types</p>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <Chip key={t} active={prefs.types.includes(t)} onClick={() => setPrefs({ ...prefs, types: toggleIn(prefs.types, t) })}>{t}</Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-medium tracking-wide text-[#8B7D72]">Preferred cities</p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <Chip key={c} active={prefs.cities.includes(c)} onClick={() => setPrefs({ ...prefs, cities: toggleIn(prefs.cities, c) })}>{c}</Chip>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={`Min budget (SAR) · ${fmtBudget(prefs.budgetMin)}`}>
                <input inputMode="numeric" className={inputBase} value={prefs.budgetMin} onChange={(e) => setPrefs({ ...prefs, budgetMin: e.target.value.replace(/\D/g, '') })} />
              </Field>
              <Field label={`Max budget (SAR) · ${fmtBudget(prefs.budgetMax)}`}>
                <input inputMode="numeric" className={inputBase} value={prefs.budgetMax} onChange={(e) => setPrefs({ ...prefs, budgetMax: e.target.value.replace(/\D/g, '') })} />
              </Field>
              <Field label="Bedrooms">
                <select className={inputBase} value={prefs.bedrooms} onChange={(e) => setPrefs({ ...prefs, bedrooms: e.target.value })}>
                  {['Any', '1', '2', '3', '4', '5', '6+'].map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => flash('Preferences saved')} className="rounded-full bg-[#3A2A22] px-6 py-2.5 text-[14px] text-white hover:bg-[#2A1D17]">
                Save Preferences
              </button>
            </div>
          </div>
        </section>

        {/* Notifications & security */}
        <section className="grid gap-5 lg:grid-cols-2">
          <div className={card}>
            <h2 className="font-serif text-2xl text-[#2E221C]">Notifications</h2>
            <div className="mt-2 divide-y divide-[#EFE7DA]">
              <Toggle label="Price drop alerts" hint="On your favorites and saved searches" checked={settings.priceAlerts} onChange={(v) => setSettings({ ...settings, priceAlerts: v })} />
              <Toggle label="New listings" hint="Matching your preferences" checked={settings.newListings} onChange={(v) => setSettings({ ...settings, newListings: v })} />
              <Toggle label="WhatsApp updates" hint="Replies from agents and owners" checked={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
            </div>
            <div className="mt-4">
              <Field label="Display currency">
                <select className={inputBase} value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value as Currency })}>
                  {(Object.keys(CURRENCY_RATES) as Currency[]).map((c) => (
                    <option key={c} value={c}>{c} — {CURRENCY_RATES[c].label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className={card}>
            <h2 className="font-serif text-2xl text-[#2E221C]">Account Security</h2>
            <div className="mt-2 divide-y divide-[#EFE7DA]">
              <Toggle label="Two-factor authentication" hint="Extra protection at sign in" checked={settings.twoFactor} onChange={(v) => setSettings({ ...settings, twoFactor: v })} />
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#EADFD0] text-[#6B4F36]"><Lock size={16} /></span>
                  <div>
                    <p className="text-[14px] text-[#2E221C]">Password</p>
                    <p className="text-[12px] text-[#8B7D72]">Last changed 3 months ago</p>
                  </div>
                </div>
                <button type="button" className="rounded-full border border-[#E4DAC9] bg-white px-4 py-1.5 text-[13px] hover:border-[#B89B72]">Change</button>
              </div>
              <div className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#E3EEDF] text-[#3E7A3A]"><ShieldCheck size={16} /></span>
                <div>
                  <p className="text-[14px] text-[#2E221C]">Identity verified</p>
                  <p className="text-[12px] text-[#8B7D72]">Verified buyers get faster responses</p>
                </div>
              </div>
            </div>
            <button type="button" className="mt-4 text-[13px] text-[#B04A44] hover:underline">Delete account</button>
          </div>
        </section>
      </div>

      {/* ------------------------------ right rail ------------------------------ */}
      <aside className="space-y-5">
        <section className={card}>
          <h2 className="font-serif text-2xl text-[#2E221C]">Profile Strength</h2>
          <div className="mt-4 flex items-center gap-5">
            <div className="relative h-[88px] w-[88px] shrink-0">
              <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
                <circle cx="40" cy="40" r={ringR} fill="none" stroke="#EADFD0" strokeWidth="7" />
                <circle
                  cx="40" cy="40" r={ringR} fill="none" stroke="#8A6A4A" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={ringC} strokeDashoffset={ringC * (1 - completion / 100)}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-serif text-2xl text-[#2E221C]">{completion}%</span>
            </div>
            <p className="text-[13px] leading-relaxed text-[#6F625A]">
              {completion === 100
                ? 'Your profile is complete. Agents can respond with confidence.'
                : 'Complete your preferences and turn on two-factor to reach 100%.'}
            </p>
          </div>
        </section>
      </aside>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#3A2A22] px-5 py-2.5 text-[13px] text-white shadow-lg transition-all ${toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
      >
        {toast}
      </div>
    </div>
  );
}
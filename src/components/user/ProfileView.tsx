'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  Pencil,
  Check,
  X,
  ShieldCheck,
  Heart,
  Clock,
  Search,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  BadgeCheck,
  Lock,
} from 'lucide-react';
import { CURRENCY_RATES } from '@/data/websiteContent';
import type { Currency } from '@/types';
import UserLogoutButton from '@/components/user/UserLogoutButton';

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  city: string;
  language: string;
};

type ApiUser = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image?: string | null;
  createdAt: string;
};

const INITIAL_PROFILE: Profile = {
  fullName: '',
  email: '',
  phone: '',
  nationality: '',
  city: '',
  language: 'English',
};

const INITIAL_PREFS = {
  types: ['Villa', 'Apartment'],
  cities: ['Riyadh', 'Jeddah'],
  budgetMin: '1000000',
  budgetMax: '5000000',
  bedrooms: '4',
};

const INITIAL_SETTINGS = {
  newListings: true,
  currency: 'SAR' as Currency,
};

const STATS = [
  {
    label: 'Favorites',
    value: 12,
    sub: 'Saved properties',
    icon: Heart,
    href: '/user/favorites',
  },
  {
    label: 'Inquiries',
    value: 5,
    sub: 'Active requests',
    icon: Clock,
    href: '/user/inquiries',
  },
  {
    label: 'Saved Searches',
    value: 3,
    sub: 'With alerts on',
    icon: Search,
    href: '/user/saved-searches',
  },
  {
    label: 'Messages',
    value: 3,
    sub: 'Unread chats',
    icon: MessageCircle,
    href: '/user/messages',
  },
];

const PROPERTY_TYPES = [
  'Villa',
  'Apartment',
  'Land',
  'Commercial',
  'Penthouse',
  'Townhouse',
];

const CITIES = [
  'Riyadh',
  'Jeddah',
  'Dammam',
  'Makkah',
  'Madinah',
  'NEOM',
];

const COUNTRIES = [
  'Saudi Arabia',
  'United Arab Emirates',
  'Kuwait',
  'Bahrain',
  'Qatar',
  'Oman',
  'Egypt',
  'Jordan',
  'India',
  'Pakistan',
  'United Kingdom',
  'United States',
  'Other',
];

const card =
  'rounded-3xl bg-[#FBF9F6] p-5 sm:p-6 shadow-[0_1px_0_rgba(60,40,25,0.04)]';

const inputBase =
  'w-full rounded-xl border border-[#E4DAC9] bg-white px-3.5 py-2.5 text-[14px] text-[#2E221C] outline-none transition focus:border-[#8A6A4A] focus:ring-2 focus:ring-[#8A6A4A]/15 disabled:bg-[#F6F1E9] disabled:text-[#6F625A]';

function Field({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
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

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
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
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-[#3A2A22]' : 'bg-[#D9CFC0]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function initials(name: string) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U'
  );
}

function toggleIn(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function formatMemberSince(value: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function ProfileView() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [draft, setDraft] = useState<Profile>(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);

  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((message: string) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    setToast(message);

    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  // Load the currently authenticated user's profile.
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setPageError(null);

      try {
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          cache: 'no-store',
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              (response.status === 401
                ? 'Please sign in to view your profile.'
                : 'Unable to load your profile.')
          );
        }

        const user: ApiUser | undefined = data?.user ?? data;

        if (!user || typeof user.email !== 'string') {
          throw new Error('The server returned an invalid profile.');
        }

        if (cancelled) return;

        const loadedProfile: Profile = {
          ...INITIAL_PROFILE,
          fullName: user.name ?? '',
          email: user.email,
          phone: user.phone ?? '',
        };

        setProfile(loadedProfile);
        setDraft(loadedProfile);
        setMemberSince(user.createdAt ?? null);
        setProfileImage(user.image ?? null);
      } catch (error) {
        if (cancelled) return;

        setPageError(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while loading your profile.'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile() {
    const fullName = draft.fullName.trim();
    const phone = draft.phone.trim();

    if (!fullName) {
      flash('Please enter your full name.');
      return;
    }

    if (fullName.length > 100) {
      flash('Your name must be 100 characters or fewer.');
      return;
    }

    if (phone.length > 30) {
      flash('Your phone number must be 30 characters or fewer.');
      return;
    }

    setSaving(true);
    setPageError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          phone: phone || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to save your profile.');
      }

      const user: ApiUser | undefined = data?.user ?? data;

      const updatedProfile: Profile = {
        ...draft,
        fullName: user?.name ?? fullName,
        email: user?.email ?? profile.email,
        phone: user?.phone ?? phone,
      };

      setProfile(updatedProfile);
      setDraft(updatedProfile);

      if (user?.createdAt) {
        setMemberSince(user.createdAt);
      }

      if (user && 'image' in user) {
        setProfileImage(user.image ?? null);
      }

      setEditing(false);
      flash('Profile updated successfully.');
    } catch (error) {
      flash(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while saving.'
      );
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setDraft(profile);
    setEditing(false);
  }

  const sym = CURRENCY_RATES[settings.currency];

  const fmtBudget = (value: string) => {
    if (!value) return '—';

    const number = Number(value) * sym.rate;

    return `${sym.symbol} ${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: number >= 1_000_000 ? 1 : 0,
      notation: number >= 1_000_000 ? 'compact' : 'standard',
    }).format(number)}`;
  };

  if (loading) {
    return (
      <div className="grid min-h-[320px] place-items-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#E4DAC9] border-t-[#3A2A22]" />
          <p className="mt-4 text-sm text-[#8B7D72]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="min-w-0 space-y-5">
        {pageError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <p>{pageError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 font-medium underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Profile banner */}
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
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-white/90 object-cover sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white/90 bg-[#B89B72] font-serif text-4xl text-white sm:h-28 sm:w-28">
                    {initials(profile.fullName)}
                  </div>
                )}

                <div
                  className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-white text-[#3A2A22] shadow"
                  title="Profile photo updates are not configured"
                >
                  <Camera size={16} />
                </div>
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[12px] uppercase tracking-[0.2em] text-white/70">
                  Buyer Profile
                </p>

                <h1 className="break-words font-serif text-3xl leading-tight sm:text-5xl">
                  {profile.fullName || 'Your Profile'}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/85">
                  {profile.city && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {profile.city}
                      {profile.nationality ? `, ${profile.nationality}` : ''}
                    </span>
                  )}

                  <span className="flex items-center gap-1.5">
                    <BadgeCheck size={14} />
                    Buyer account
                  </span>

                  <span>Member since {formatMemberSince(memberSince)}</span>
                </div>
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setDraft(profile);
                  setEditing(true);
                }}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-[#2E221C] hover:bg-[#F6F0E8]"
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            )}
          </div>
        </section>

        {/* Quick links.
            These counts are still placeholders until the corresponding
            statistics API is implemented. */}
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
                <span className="block font-serif text-2xl leading-none text-[#2E221C]">
                  {value}
                </span>
                <span className="mt-1 block text-[12.5px] text-[#2E221C]">
                  {label}
                </span>
                <span className="block text-[11.5px] leading-snug text-[#8B7D72]">
                  {sub}
                </span>
              </span>

              <ChevronRight
                size={16}
                className="hidden text-[#8B7D72] transition-transform group-hover:translate-x-0.5 sm:block"
              />
            </Link>
          ))}
        </section>

        {/* Personal information */}
        <section className={card} aria-labelledby="personal-info">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2
                id="personal-info"
                className="font-serif text-2xl text-[#2E221C]"
              >
                Personal Information
              </h2>
              <p className="text-[13px] text-[#8B7D72]">
                Used for inquiries and to contact you about properties.
              </p>
            </div>

            {editing && (
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DAC9] bg-white px-3 py-2 text-[13px] text-[#6F625A] hover:border-[#B89B72] disabled:opacity-50 sm:px-4"
                >
                  <X size={14} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#3A2A22] px-3 py-2 text-[13px] text-white hover:bg-[#2A1D17] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                >
                  <Check size={14} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                className={inputBase}
                autoComplete="name"
                disabled={!editing || saving}
                maxLength={100}
                value={draft.fullName}
                onChange={(event) =>
                  setDraft({ ...draft, fullName: event.target.value })
                }
              />
            </Field>

            <Field label="Email" icon={<Mail size={12} />}>
              <input
                type="email"
                className={inputBase}
                autoComplete="email"
                disabled
                value={profile.email}
                readOnly
              />
              <p className="mt-1 text-[11px] text-[#8B7D72]">
                Email changes require a separate verification process.
              </p>
            </Field>

            <Field label="Phone" icon={<Phone size={12} />}>
              <input
                type="tel"
                className={inputBase}
                autoComplete="tel"
                disabled={!editing || saving}
                maxLength={30}
                value={draft.phone}
                onChange={(event) =>
                  setDraft({ ...draft, phone: event.target.value })
                }
              />
            </Field>

            <Field label="Nationality">
              <select
                className={inputBase}
                disabled={!editing || saving}
                value={draft.nationality}
                onChange={(event) =>
                  setDraft({ ...draft, nationality: event.target.value })
                }
              >
                <option value="">Select nationality</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="City of residence">
              <select
                className={inputBase}
                disabled={!editing || saving}
                value={draft.city}
                onChange={(event) =>
                  setDraft({ ...draft, city: event.target.value })
                }
              >
                <option value="">Select city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Preferred language">
              <select
                className={inputBase}
                disabled={!editing || saving}
                value={draft.language}
                onChange={(event) =>
                  setDraft({ ...draft, language: event.target.value })
                }
              >
                <option value="English">English</option>
                <option value="العربية">العربية</option>
              </select>
            </Field>
          </div>

          {editing && (
            <p className="mt-4 text-xs text-[#8B7D72]">
              Currently, only your name and phone number are saved to your
              account. Other profile fields need database support.
            </p>
          )}
        </section>

        {/* Property preferences */}
        <section className={card} aria-labelledby="prefs">
          <div className="mb-5">
            <h2 id="prefs" className="font-serif text-2xl text-[#2E221C]">
              Property Preferences
            </h2>
            <p className="text-[13px] text-[#8B7D72]">
              Choose the types of properties and locations you are interested
              in.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-[12px] font-medium tracking-wide text-[#8B7D72]">
                I want to
              </p>
              <div className="inline-flex rounded-full bg-[#3A2A22] px-5 py-1.5 text-[13.5px] text-white">
                Buy
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-medium tracking-wide text-[#8B7D72]">
                Property types
              </p>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((type) => (
                  <Chip
                    key={type}
                    active={prefs.types.includes(type)}
                    onClick={() =>
                      setPrefs({
                        ...prefs,
                        types: toggleIn(prefs.types, type),
                      })
                    }
                  >
                    {type}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[12px] font-medium tracking-wide text-[#8B7D72]">
                Preferred cities
              </p>
              <div className="flex flex-wrap gap-2">
                {CITIES.map((city) => (
                  <Chip
                    key={city}
                    active={prefs.cities.includes(city)}
                    onClick={() =>
                      setPrefs({
                        ...prefs,
                        cities: toggleIn(prefs.cities, city),
                      })
                    }
                  >
                    {city}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={`Min budget (SAR) · ${fmtBudget(prefs.budgetMin)}`}>
                <input
                  inputMode="numeric"
                  className={inputBase}
                  value={prefs.budgetMin}
                  onChange={(event) =>
                    setPrefs({
                      ...prefs,
                      budgetMin: event.target.value.replace(/\D/g, ''),
                    })
                  }
                />
              </Field>

              <Field label={`Max budget (SAR) · ${fmtBudget(prefs.budgetMax)}`}>
                <input
                  inputMode="numeric"
                  className={inputBase}
                  value={prefs.budgetMax}
                  onChange={(event) =>
                    setPrefs({
                      ...prefs,
                      budgetMax: event.target.value.replace(/\D/g, ''),
                    })
                  }
                />
              </Field>

              <Field label="Bedrooms">
                <select
                  className={inputBase}
                  value={prefs.bedrooms}
                  onChange={(event) =>
                    setPrefs({ ...prefs, bedrooms: event.target.value })
                  }
                >
                  {['Any', '1', '2', '3', '4', '5', '6+'].map((bedrooms) => (
                    <option key={bedrooms} value={bedrooms}>
                      {bedrooms}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#8B7D72]">
                Preferences are currently stored only in this page's state.
              </p>

              <button
                type="button"
                onClick={() =>
                  flash(
                    'Preferences are not connected to database storage yet.'
                  )
                }
                className="rounded-full bg-[#3A2A22] px-6 py-2.5 text-[14px] text-white hover:bg-[#2A1D17]"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </section>

        {/* Notifications and account security */}
        <section className="grid gap-5 lg:grid-cols-2">
          <div className={card}>
            <h2 className="font-serif text-2xl text-[#2E221C]">
              Notifications
            </h2>

            <div className="mt-2 divide-y divide-[#EFE7DA]">
              <Toggle
                label="New listings"
                hint="Matching your preferences"
                checked={settings.newListings}
                onChange={(value) =>
                  setSettings({ ...settings, newListings: value })
                }
              />
            </div>

            <div className="mt-4">
              <Field label="Display currency">
                <select
                  className={inputBase}
                  value={settings.currency}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      currency: event.target.value as Currency,
                    })
                  }
                >
                  {(Object.keys(CURRENCY_RATES) as Currency[]).map(
                    (currency) => (
                      <option key={currency} value={currency}>
                        {currency} — {CURRENCY_RATES[currency].label}
                      </option>
                    )
                  )}
                </select>
              </Field>
            </div>

            <p className="mt-3 text-xs text-[#8B7D72]">
              Notification preferences and display currency are not persisted
              yet.
            </p>
          </div>

          <div className={card}>
            <h2 className="font-serif text-2xl text-[#2E221C]">
              Account Security
            </h2>

            <div className="mt-2 divide-y divide-[#EFE7DA]">
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#EADFD0] text-[#6B4F36]">
                    <Lock size={16} />
                  </span>

                  <div>
                    <p className="text-[14px] text-[#2E221C]">Password</p>
                    <p className="text-[12px] text-[#8B7D72]">
                      Manage your account password
                    </p>
                  </div>
                </div>

                <Link
                  href="/forgot-password"
                  className="shrink-0 rounded-full border border-[#E4DAC9] bg-white px-4 py-1.5 text-[13px] hover:border-[#B89B72]"
                >
                  Change
                </Link>
              </div>

              <div className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#EADFD0] text-[#6B4F36]">
                  <ShieldCheck size={16} />
                </span>

                <div>
                  <p className="text-[14px] text-[#2E221C]">Account security</p>
                  <p className="text-[12px] text-[#8B7D72]">
                    Keep your sign-in details private and secure.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <UserLogoutButton />
            </div>
          </div>
        </section>
      </div>

      {/* Toast notifications */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#3A2A22] px-5 py-2.5 text-center text-[13px] text-white shadow-lg transition-all ${
          toast
            ? 'translate-y-0 opacity-100'
            : 'translate-y-3 opacity-0'
        }`}
      >
        {toast}
      </div>
    </div>
  );
}
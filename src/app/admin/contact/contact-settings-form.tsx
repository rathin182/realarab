"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { saveContactSettings } from "@/actions/admin";
import { Toast, useToast } from "@/components/feedback/Toast";
import type { ContactSettingsValues } from "@/lib/contact-settings";

type ContactField = keyof ContactSettingsValues;

const inputClass = "mt-1.5 h-10 w-full rounded-md border border-[#d8d3c8] bg-white px-3 text-sm text-[#24231f] outline-none focus:border-[#8f7654]";

function TextField({ name, label, value, type = "text", optional = false }: { name: ContactField; label: string; value: string; type?: "text" | "email" | "tel"; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}{optional && <span className="ms-1 text-xs font-normal text-neutral-400">(optional)</span>}
      <input name={name} type={type} defaultValue={value} required={!optional} maxLength={240} className={inputClass} />
    </label>
  );
}

export default function ContactSettingsForm({ settings }: { settings: ContactSettingsValues }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast, showToast, dismissToast } = useToast();

  function submit(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await saveContactSettings(formData);
        if (!result.ok) {
          showToast(result.message ?? "Please review the contact information.", "error");
          return;
        }
        showToast("Contact information saved.");
        router.refresh();
      } catch {
        showToast("Could not save contact information. Please try again.", "error");
      }
    });
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 text-[#24231f]">
      <Toast toast={toast} onDismiss={dismissToast} />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f7654]">Site content</p>
          <h1 className="mt-1 font-serif text-3xl">Contact information</h1>
          <p className="mt-1 text-sm text-neutral-500">These details appear on the Contact Us page.</p>
        </div>
        <a href="/contact" target="_blank" rel="noreferrer" className="rounded-md border border-[#d8d3c8] bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-[#f4f1ea]">Preview contact page</a>
      </header>

      <form action={submit} className="space-y-5">
        <section className="space-y-4 rounded-lg border border-[#e3dfd5] bg-[#faf9f5] p-5 sm:p-6">
          <div className="border-b border-[#e8e4db] pb-3">
            <h2 className="font-serif text-xl">Registration</h2>
            <p className="mt-1 text-xs text-neutral-500">Used in the office card and page footer.</p>
          </div>
          <div className="max-w-md"><TextField name="falRegistrationNumber" label="FAL registration number" value={settings.falRegistrationNumber} /></div>
        </section>

        <section className="space-y-4 rounded-lg border border-[#e3dfd5] bg-[#faf9f5] p-5 sm:p-6">
          <div className="border-b border-[#e8e4db] pb-3">
            <h2 className="font-serif text-xl">Riyadh Headquarters</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="riyadhLabel" label="Card label" value={settings.riyadhLabel} />
            <TextField name="riyadhTitle" label="Office name" value={settings.riyadhTitle} />
            <div className="sm:col-span-2"><TextField name="riyadhAddress" label="Address" value={settings.riyadhAddress} /></div>
            <TextField name="riyadhPhonePrimary" label="Primary phone" value={settings.riyadhPhonePrimary} type="tel" />
            <TextField name="riyadhPhoneSecondary" label="Secondary phone" value={settings.riyadhPhoneSecondary} type="tel" optional />
            <TextField name="riyadhEmail" label="Email" value={settings.riyadhEmail} type="email" />
            <TextField name="riyadhVisitingHours" label="Visiting hours" value={settings.riyadhVisitingHours} />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-[#e3dfd5] bg-[#faf9f5] p-5 sm:p-6">
          <div className="border-b border-[#e8e4db] pb-3">
            <h2 className="font-serif text-xl">International Hub</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="internationalLabel" label="Card label" value={settings.internationalLabel} />
            <TextField name="internationalBadge" label="Card badge" value={settings.internationalBadge} />
            <TextField name="internationalTitle" label="Office name" value={settings.internationalTitle} />
            <TextField name="internationalAddress" label="Address" value={settings.internationalAddress} />
            <TextField name="internationalPhonePrimary" label="Primary phone" value={settings.internationalPhonePrimary} type="tel" />
            <TextField name="internationalPhoneSecondary" label="Secondary phone" value={settings.internationalPhoneSecondary} type="tel" optional />
            <TextField name="internationalEmail" label="Email" value={settings.internationalEmail} type="email" />
            <TextField name="internationalVisitingHours" label="Visiting hours" value={settings.internationalVisitingHours} />
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-md bg-[#292820] px-4 py-2.5 text-sm text-white hover:bg-[#454337] disabled:opacity-60">
            <Save aria-hidden="true" className="h-4 w-4" />
            {isPending ? "Saving..." : "Save contact information"}
          </button>
        </div>
      </form>
    </main>
  );
}

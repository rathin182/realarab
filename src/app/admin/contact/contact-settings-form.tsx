"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { deleteContactCard, saveContactCard } from "@/actions/admin";
import { Toast, useToast } from "@/components/feedback/Toast";
import type { ContactCard } from "@/lib/contact-settings";

type ContactField = Exclude<keyof ContactCard, "id" | "sortOrder">;
type ContactCardDraft = ContactCard & { clientKey: string };

const inputClass = "mt-1.5 h-11 w-full rounded-md border border-[#d8d3c8] bg-white px-3 text-sm outline-none transition-colors focus:border-[#8f7654] focus:ring-2 focus:ring-[#8f7654]/10";

function TextField({ name, label, value, onChange, type = "text", optional = false }: { name: ContactField; label: string; value: string; onChange: (value: string) => void; type?: "text" | "email" | "tel"; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}{optional && <span className="ms-1 text-xs font-normal text-neutral-400">(optional)</span>}
      <input name={name} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={!optional} maxLength={name === "address" ? 500 : 240} className={inputClass} />
    </label>
  );
}

function createBlankCard(sortOrder: number): ContactCardDraft {
  return { id: "", clientKey: crypto.randomUUID(), sortOrder, label: "", badge: "", title: "", address: "", phonePrimary: "", phoneSecondary: "", email: "", visitingHours: "" };
}

export default function ContactSettingsForm({ initialCards }: { initialCards: ContactCard[] }) {
  const [cards, setCards] = useState<ContactCardDraft[]>(() => initialCards.map((card) => ({ ...card, clientKey: card.id })));
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast, showToast, dismissToast } = useToast();

  function updateCard(clientKey: string, field: ContactField, value: string) {
    setCards((current) => current.map((card) => card.clientKey === clientKey ? { ...card, [field]: value } : card));
  }

  function saveCard(card: ContactCardDraft, sortOrder: number, formData: FormData) {
    formData.set("id", card.id);
    formData.set("sortOrder", String(sortOrder));
    startTransition(async () => {
      try {
        const result = await saveContactCard(formData);
        if (!result.ok) {
          showToast(result.message ?? "Enter a card title and contact method.", "error");
          return;
        }
        setCards((current) => current.map((item) => item.clientKey === card.clientKey ? { ...item, id: result.id ?? card.id, sortOrder } : item));
        showToast("Contact card saved.");
        router.refresh();
      } catch {
        showToast("Could not save this card. Please try again.", "error");
      }
    });
  }

  function removeCard(card: ContactCardDraft) {
    if (!card.id) {
      setCards((current) => current.filter((item) => item.clientKey !== card.clientKey));
      return;
    }
    const formData = new FormData();
    formData.set("id", card.id);
    startTransition(async () => {
      try {
        const result = await deleteContactCard(formData);
        if (!result.ok) {
          showToast("Could not delete this card. Please refresh and try again.", "error");
          return;
        }
        setCards((current) => current.filter((item) => item.clientKey !== card.clientKey));
        showToast("Contact card deleted.");
        router.refresh();
      } catch {
        showToast("Could not delete this card. Please try again.", "error");
      }
    });
  }

  function addCard() {
    if (cards.length >= 4) return;
    setCards((current) => [...current, createBlankCard(Math.max(-1, ...current.map((card) => card.sortOrder)) + 1)]);
  }

  return (
    <main className="mx-auto max-w-7xl space-y-5 text-[#24231f]">
      <Toast toast={toast} onDismiss={dismissToast} />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f7654]">Site content</p>
          <h1 className="mt-1 font-serif text-4xl sm:text-5xl">Contact information</h1>
          <p className="mt-1 text-sm text-neutral-500">These details appear on the Contact Us page.</p>
        </div>
        <button type="button" onClick={addCard} disabled={cards.length >= 4} aria-label="Add another contact card, maximum four" title={cards.length >= 4 ? "Maximum of four cards" : undefined} className="inline-flex h-11 items-center gap-2 rounded-md bg-[#234532] px-4 text-sm font-medium text-white hover:bg-[#183424] disabled:cursor-not-allowed disabled:opacity-50">
          <Plus aria-hidden="true" className="h-4 w-4" />Add Another Card
        </button>
      </header>

      {cards.length === 0 && <p className="rounded-lg border border-dashed border-[#d8d3c8] bg-[#faf9f5] px-5 py-10 text-center text-sm text-neutral-500">No contact cards yet.</p>}

      <div className="space-y-5">
        {cards.map((card, index) => <form key={card.clientKey} action={(formData) => saveCard(card, index, formData)} className="rounded-lg border border-[#e3dfd5] bg-[#faf9f5] p-5 shadow-sm sm:p-6">
          <input type="hidden" name="id" value={card.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="label" label="Card label" value={card.label} onChange={(value) => updateCard(card.clientKey, "label", value)} optional />
            <TextField name="badge" label="Badge" value={card.badge} onChange={(value) => updateCard(card.clientKey, "badge", value)} optional />
            <TextField name="title" label="Card title" value={card.title} onChange={(value) => updateCard(card.clientKey, "title", value)} />
            <TextField name="address" label="Address" value={card.address} onChange={(value) => updateCard(card.clientKey, "address", value)} optional />
            <TextField name="phonePrimary" label="Primary phone" type="tel" value={card.phonePrimary} onChange={(value) => updateCard(card.clientKey, "phonePrimary", value)} optional />
            <TextField name="phoneSecondary" label="Secondary phone" type="tel" value={card.phoneSecondary} onChange={(value) => updateCard(card.clientKey, "phoneSecondary", value)} optional />
            <TextField name="email" label="Email" type="email" value={card.email} onChange={(value) => updateCard(card.clientKey, "email", value)} optional />
            <TextField name="visitingHours" label="Visiting hours" value={card.visitingHours} onChange={(value) => updateCard(card.clientKey, "visitingHours", value)} optional />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-[#e8e4db] pt-4">
            <button type="button" onClick={() => removeCard(card)} disabled={isPending} aria-label="Delete contact card" title="Delete card" className="grid h-10 w-10 place-items-center rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50">
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
            <button type="submit" disabled={isPending} className="inline-flex h-11 items-center gap-2 rounded-md bg-[#234532] px-5 text-sm font-medium text-white hover:bg-[#183424] disabled:cursor-wait disabled:opacity-60">
              <Save aria-hidden="true" className="h-4 w-4" />{isPending ? "Saving..." : "Save Card"}
            </button>
          </div>
        </form>)}
      </div>
    </main>
  );
}

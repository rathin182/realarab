"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type ToastState = { message: string; kind: ToastKind; id: number } | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(message: string, kind: ToastKind = "success") {
    setToast({ message, kind, id: Date.now() });
  }

  return { toast, showToast, dismissToast: () => setToast(null) };
}

export function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  if (!toast) return null;
  const Icon = toast.kind === "success" ? CheckCircle2 : toast.kind === "error" ? CircleAlert : Info;
  const tone = toast.kind === "success" ? "border-emerald-200 text-emerald-900" : toast.kind === "error" ? "border-red-200 text-red-900" : "border-sky-200 text-sky-900";
  const iconTone = toast.kind === "success" ? "text-emerald-700" : toast.kind === "error" ? "text-red-700" : "text-sky-700";

  return (
    <div key={toast.id} className={`fixed right-4 top-4 z-[100] flex max-w-sm items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg ${tone}`} role={toast.kind === "error" ? "alert" : "status"} aria-live={toast.kind === "error" ? "assertive" : "polite"}>
      <Icon aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${iconTone}`} />
      <p className="min-w-0 flex-1 text-sm">{toast.message}</p>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className="rounded p-0.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"><X className="h-4 w-4" /></button>
    </div>
  );
}

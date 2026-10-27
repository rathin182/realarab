"use client";

import { createContext, useContext } from "react";
import type { Language } from "@/types";

export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
} | null>(null);

export function useSiteLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useSiteLanguage must be used within SiteShell.");
  return context;
}
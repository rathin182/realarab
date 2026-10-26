
"use client";

import { useEffect, useState } from "react";
import AuthModal from "@/components/modals/AuthModal";

type UserRole = "BUYER" | "ADMIN" | "OWNER" | "AGENT";
type AuthTab = "login" | "register";

export default function AuthHomeButtons() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [checked, setChecked] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<AuthTab>("login");

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const session = await response.json();

        if (active) {
          setRole(session?.user?.role ?? null);
        }
      } catch {
        // Keep the user signed out if session lookup fails.
      } finally {
        if (active) setChecked(true);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  if (!checked) {
    return <div className="h-10" aria-hidden="true" />;
  }

  if (role === "ADMIN") {
    return (
      <a
        href="/admin"
        className="rounded-lg bg-[#0C3826] px-5 py-3 text-white"
      >
        Admin Dashboard
      </a>
    );
  }

  if (role === "BUYER") {
    return (
      <a
        href="/user/"
        className="rounded-lg bg-[#0C3826] px-5 py-3 text-white"
      >
        Buyer Dashboard
      </a>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setInitialTab("login");
            setIsAuthOpen(true);
          }}
          className="rounded-lg border border-neutral-300 px-5 py-3"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => {
            setInitialTab("register");
            setIsAuthOpen(true);
          }}
          className="rounded-lg bg-[#0C3826] px-5 py-3 text-white"
        >
          Register
        </button>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        initialTab={initialTab}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}

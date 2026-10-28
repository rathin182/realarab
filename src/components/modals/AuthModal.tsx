"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { LoginForm } from "@/app/(public)/login/login-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
}: AuthModalProps) {

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Left half: Transparent backdrop - shows your homepage behind it and closes modal on click */}
      <div 
        className="hidden lg:block lg:w-1/2 bg-black/10 backdrop-blur-[2px] transition-opacity" 
        onClick={closeModal}
        aria-label="Close authentication"
      />

      {/* Right half: Solid authentication panel */}
      <div className="relative w-full h-full overflow-y-auto bg-[#FAF7F1] shadow-2xl lg:w-1/2 flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-6 top-6 z-20 p-2 text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Optional top-right controls */}
        <div className="absolute right-20 top-7 z-10 hidden items-center gap-4 text-neutral-600 sm:flex">
          <select className="border-none bg-transparent px-2 py-1 text-sm font-medium outline-none cursor-pointer">
            <option>SAR</option>
            <option>USD</option>
          </select>
          <button className="text-sm font-medium">العربية</button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-12 lg:px-16">
          <div className="w-full max-w-md xl:max-w-lg">
            <h1 className="font-serif text-4xl text-neutral-950 sm:text-[42px]">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-neutral-500 sm:text-base">
              Sign in to your Najm Estates account
            </p>

            <div className="mt-10">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

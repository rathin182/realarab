
"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [error, formAction, pending] = useActionState(
    loginAction,
    undefined
  );

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-3">
        <input
          type="hidden"
          name="callbackUrl"
          value={callbackUrl ?? ""}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="login-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 outline-none focus:border-[#A98950]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="login-password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-neutral-300 bg-transparent p-3 outline-none focus:border-[#A98950]"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg !bg-[#0C3826] p-3 !text-white transition hover:!bg-[#092B1D] disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>

    </div>
  );
}

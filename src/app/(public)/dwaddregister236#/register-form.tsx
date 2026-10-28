"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";
const inputClass =
  "h-[58px] w-full rounded-xl border border-[#e5e0d7] bg-white/50 pl-12 pr-4 text-[15px] outline-none transition placeholder:text-[#a09d96] focus:border-[#b59a73] focus:ring-2 focus:ring-[#b59a73]/15";
const labelClass = "mb-2.5 block text-[15px] font-medium text-[#282722]";
function FieldIcon({ type }: { type: string }) {
  const paths: Record<string, React.ReactNode> = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 1 1 8 0v3" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-[#99958d]"
    >
      {paths[type] ?? paths.user}
    </svg>
  );
}

function InputIcon({ type }: { type: string }) {
  return (
    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
      <FieldIcon type={type} />
    </span>
  );
}

export default function RegisterForm() {
  const [error, formAction, isPending] = useActionState(
    registerAction,
    undefined,
  );

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const emailLooksValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  async function sendOtp() {
    setOtpSending(true);
    setOtpError("");
    setOtpMessage("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not send OTP.");
      }

      setOtpSent(true);
      setOtp("");
      setEmailVerified(false);
      setOtpMessage(data.message || "OTP sent. Check your inbox.");
    } catch (err) {
      setOtpError(
        err instanceof Error ? err.message : "Could not send OTP.",
      );
    } finally {
      setOtpSending(false);
    }
  }

  async function verifyOtp() {
    setOtpVerifying(true);
    setOtpError("");
    setOtpMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not verify OTP.");
      }

      setEmailVerified(true);
      setOtpMessage("Email verified successfully.");
    } catch (err) {
      setEmailVerified(false);
      setOtpError(
        err instanceof Error ? err.message : "Could not verify OTP.",
      );
    } finally {
      setOtpVerifying(false);
    }
  }

  function handleEmailChange(value: string) {
    if (value.trim().toLowerCase() !== normalizedEmail) {
      setOtpSent(false);
      setOtp("");
      setEmailVerified(false);
      setOtpMessage("");
      setOtpError("");
    }

    setEmail(value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setPasswordError("");

    if (password !== confirmPassword) {
      event.preventDefault();
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      event.preventDefault();
      setPasswordError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    if (!emailVerified) {
      event.preventDefault();
      setPasswordError("Please verify your email before continuing.");
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
    >
      <div>
        <label htmlFor="name" className={labelClass}>
          Full Name
        </label>
        <div className="relative">
          <InputIcon type="user" />
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClass}
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Work Email
        </label>
        <div className="relative">
          <InputIcon type="mail" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => handleEmailChange(event.target.value)}
            className={inputClass}
            placeholder="Enter your work email"
          />
        </div>

        {emailLooksValid && !emailVerified && (
          <button
            type="button"
            onClick={sendOtp}
            disabled={otpSending || otpVerifying || isPending}
            className="mt-3 rounded-lg border border-[#d8c6a8] px-4 py-2 text-sm font-medium text-[#80613b] transition hover:bg-[#f3ebdf] disabled:opacity-50"
          >
            {otpSending ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}
          </button>
        )}

        {otpSent && !emailVerified && (
          <div className="mt-3 space-y-2">
            <input
              aria-label="Email verification code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="h-12 w-full rounded-xl border border-[#e5e0d7] bg-white px-4 outline-none focus:border-[#b59a73]"
              placeholder="Enter 6-digit OTP"
            />
            <button
              type="button"
              onClick={verifyOtp}
              disabled={otp.length !== 6 || otpVerifying || otpSending}
              className="rounded-lg bg-[#eee5d7] px-4 py-2 text-sm font-medium text-[#604b31] disabled:opacity-50"
            >
              {otpVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {emailVerified && (
          <p className="mt-2 text-sm text-emerald-700">
            ✓ Email verified successfully
          </p>
        )}

        {otpMessage && !emailVerified && (
          <p aria-live="polite" className="mt-2 text-sm text-[#77746e]">
            {otpMessage}
          </p>
        )}

        {otpError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {otpError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone Number
        </label>
        <div className="flex h-[58px] overflow-hidden rounded-xl border border-[#e5e0d7] bg-white/50 focus-within:border-[#b59a73]">
          <label htmlFor="countryCode" className="sr-only">
            Country code
          </label>

          <select
            id="countryCode"
            name="countryCode"
            defaultValue="+966"
            required
            className="max-w-[112px] border-r border-[#e5e0d7] bg-transparent px-2 text-sm outline-none sm:px-3"
          >

            <option value="+966">🇸🇦 +966</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
          </select>
          <div className="relative min-w-0 flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <FieldIcon type="phone" />
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel-national"
              className="h-full w-full bg-transparent pl-10 pr-2 text-sm outline-none placeholder:text-[#a09d96]"
              placeholder="Phone number"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="role" className={labelClass}>
          Role
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#99958d]">
            ♙
          </span>
          <select
            id="role"
            value="BUYER"
            disabled
            className={`${inputClass} appearance-none pl-12 text-[#282722] disabled:opacity-100`}
          >
            <option value="BUYER">Buyer</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#77746e]">
            ⌄
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <div className="relative">
          <InputIcon type="lock" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="Create a password"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm Password
        </label>
        <div className="relative">
          <InputIcon type="lock" />
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={inputClass}
            placeholder="Confirm your password"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#49463f]">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[#064c38]"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              target="_blank"
              className="text-[#80613b] underline underline-offset-2"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-[#80613b] underline underline-offset-2"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      {(passwordError || error) && (
        <p role="alert" className="text-sm text-red-600 md:col-span-2">
          {passwordError || error}
        </p>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={
            !emailVerified ||
            !termsAccepted ||
            password !== confirmPassword ||
            !password ||
            isPending ||
            otpSending ||
            otpVerifying
          }
          className="flex h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-[#064633] px-6 text-base font-semibold text-white shadow-sm transition hover:bg-[#053a2b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Create Account"}
          {!isPending && <span aria-hidden="true" className="text-xl">→</span>}
        </button>
      </div>

      <div className="md:col-span-2">
        <p className="text-center text-[15px] text-[#77746e]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#80613b] hover:underline"
          >
            Sign in <span aria-hidden="true">→</span>
          </Link>
        </p>
      </div>
    </form>
  );
}

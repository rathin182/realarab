'use client';
import { useState } from 'react';
import { logoutAction } from '@/actions/auth';
export default function UserLogoutButton() {
  const [pending, setPending] = useState(false);
  return (
    <form
      action={async () => {
        setPending(true);
        await logoutAction();
      }}
      className="mt-4"
    >
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Logging out...' : 'Logout'}
      </button>
    </form>
  );
}
'use client';

import { Trash2 } from 'lucide-react';

export function RemovePropertyButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-red-200 text-red-700 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600">
      <Trash2 aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

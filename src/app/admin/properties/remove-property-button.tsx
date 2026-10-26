'use client';

import { archiveAdminListing } from '@/actions/admin';

export function RemovePropertyButton({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  return (
    <form
      action={archiveAdminListing}
      onSubmit={(event) => {
        if (!window.confirm(`Remove "${propertyTitle}" from the public website? Existing enquiries and records will be preserved.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={propertyId} />
      <button type="submit" className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">
        Remove
      </button>
    </form>
  );
}

'use client';

import { archiveAdminListing } from '@/actions/admin';
import { useSiteLanguage } from '@/components/providers/LanguageContext';

export function RemovePropertyButton({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const { language } = useSiteLanguage();
  const isArabic = language === 'ar';

  return (
    <form
      action={archiveAdminListing}
      onSubmit={(event) => {
        const prompt = isArabic
          ? `هل تريد إزالة "${propertyTitle}" من الموقع؟ ستظل الاستفسارات والسجلات الحالية محفوظة.`
          : `Remove "${propertyTitle}" from the public website? Existing enquiries and records will be preserved.`;
        if (!window.confirm(prompt)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={propertyId} />
      <button type="submit" className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">
        {isArabic ? 'إزالة' : 'Remove'}
      </button>
    </form>
  );
}

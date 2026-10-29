import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { CONTACT_SETTINGS_ID, DEFAULT_CONTACT_SETTINGS } from "@/lib/contact-settings";
import type { ContactSettingsValues } from "@/lib/contact-settings";
import AdminLayout from "../admin-layout";
import ContactSettingsForm from "./contact-settings-form";

export default async function AdminContactSettingsPage() {
  await requireAdmin();
  let settings: ContactSettingsValues | null = null;
  try {
    settings = await prisma.contactSettings.findUnique({
      where: { id: CONTACT_SETTINGS_ID },
      select: {
        falRegistrationNumber: true,
        riyadhLabel: true,
        riyadhTitle: true,
        riyadhAddress: true,
        riyadhPhonePrimary: true,
        riyadhPhoneSecondary: true,
        riyadhEmail: true,
        riyadhVisitingHours: true,
        internationalLabel: true,
        internationalBadge: true,
        internationalTitle: true,
        internationalAddress: true,
        internationalPhonePrimary: true,
        internationalPhoneSecondary: true,
        internationalEmail: true,
        internationalVisitingHours: true,
      },
    });
  } catch (error) {
    if ((error as { code?: string }).code !== "P2021") throw error;
  }

  return <AdminLayout><ContactSettingsForm settings={settings ?? DEFAULT_CONTACT_SETTINGS} /></AdminLayout>;
}

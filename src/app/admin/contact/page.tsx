import { requireAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CONTACT_CARDS } from "@/lib/contact-settings";
import AdminLayout from "../admin-layout";
import ContactSettingsForm from "./contact-settings-form";

export default async function AdminContactSettingsPage() {
  await requireAdmin();
  let cards = DEFAULT_CONTACT_CARDS;
  try {
    cards = await prisma.contactCard.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        sortOrder: true,
        label: true,
        badge: true,
        title: true,
        address: true,
        phonePrimary: true,
        phoneSecondary: true,
        email: true,
        visitingHours: true,
      },
    });
  } catch (error) {
    if ((error as { code?: string }).code !== "P2021") throw error;
  }

  return <AdminLayout><ContactSettingsForm initialCards={cards} /></AdminLayout>;
}

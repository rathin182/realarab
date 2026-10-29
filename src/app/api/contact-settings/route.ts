import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CONTACT_SETTINGS_ID, DEFAULT_CONTACT_SETTINGS } from "@/lib/contact-settings";

export async function GET() {
  const settings = await prisma.contactSettings.findUnique({
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

  return NextResponse.json(settings ?? DEFAULT_CONTACT_SETTINGS, {
    headers: { "Cache-Control": "no-store" },
  });
}

CREATE TABLE "ContactCard" (
  "id" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT NOT NULL DEFAULT '',
  "badge" TEXT NOT NULL DEFAULT '',
  "title" TEXT NOT NULL DEFAULT '',
  "address" TEXT NOT NULL DEFAULT '',
  "phonePrimary" TEXT NOT NULL DEFAULT '',
  "phoneSecondary" TEXT NOT NULL DEFAULT '',
  "email" TEXT NOT NULL DEFAULT '',
  "visitingHours" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContactCard_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ContactCard_sortOrder_createdAt_idx" ON "ContactCard"("sortOrder", "createdAt");

INSERT INTO "ContactCard" (
  "id", "sortOrder", "label", "badge", "title", "address", "phonePrimary", "phoneSecondary", "email", "visitingHours", "createdAt", "updatedAt"
)
SELECT
  'contact_riyadh', 0, "riyadhLabel", '', "riyadhTitle", "riyadhAddress", "riyadhPhonePrimary", "riyadhPhoneSecondary", "riyadhEmail", "riyadhVisitingHours", "createdAt", "updatedAt"
FROM "ContactSettings"
WHERE "id" = 'contact';

INSERT INTO "ContactCard" (
  "id", "sortOrder", "label", "badge", "title", "address", "phonePrimary", "phoneSecondary", "email", "visitingHours", "createdAt", "updatedAt"
)
SELECT
  'contact_international', 1, "internationalLabel", "internationalBadge", "internationalTitle", "internationalAddress", "internationalPhonePrimary", "internationalPhoneSecondary", "internationalEmail", "internationalVisitingHours", "createdAt", "updatedAt"
FROM "ContactSettings"
WHERE "id" = 'contact';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "ContactCard") THEN
    INSERT INTO "ContactCard" ("id", "sortOrder", "label", "title", "address", "phonePrimary", "phoneSecondary", "email", "visitingHours", "updatedAt")
    VALUES
      ('contact_riyadh', 0, 'KINGDOM HEADQUARTERS', 'Riyadh Sovereign HQ', 'King Fahd Road, Al Olaya Financial District, Riyadh 12214, Kingdom of Saudi Arabia', '+966 11 456 7890', '+966 50 123 4567', 'riyadh@najmestates.sa', 'Sun – Thu, 09:00 – 18:00 AST', CURRENT_TIMESTAMP),
      ('contact_international', 1, 'INTERNATIONAL HUB', 'Hyderabad International Hub', 'Jubilee Hills / HITEC Corridor, Hyderabad, Telangana 500033, India', '+91 40 6789 0123', '+91 98 7654 3210', 'hyderabad@najmestates.sa', 'Mon – Sat, 10:00 – 19:00 IST', CURRENT_TIMESTAMP);
  END IF;
END $$;

DROP TABLE "ContactSettings";

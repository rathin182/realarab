-- Let public (guest) visitors and sample properties create requests.
ALTER TABLE "Enquiry" DROP CONSTRAINT "Enquiry_listingId_fkey";
ALTER TABLE "Enquiry" DROP CONSTRAINT "Enquiry_senderId_fkey";

ALTER TABLE "Enquiry" ALTER COLUMN "listingId" DROP NOT NULL;
ALTER TABLE "Enquiry" ALTER COLUMN "senderId" DROP NOT NULL;

ALTER TABLE "Enquiry" ADD COLUMN "investorType" TEXT;
ALTER TABLE "Enquiry" ADD COLUMN "propertySlug" TEXT;
ALTER TABLE "Enquiry" ADD COLUMN "propertyTitle" TEXT;
ALTER TABLE "Enquiry" ADD COLUMN "source" TEXT;

ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");
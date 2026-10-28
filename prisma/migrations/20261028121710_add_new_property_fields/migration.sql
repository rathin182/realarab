-- AlterEnum
ALTER TYPE "MediaKind" ADD VALUE 'VIDEO_UPLOAD';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "availabilityNotes" TEXT,
ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "depthMeters" DOUBLE PRECISION,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "floors" INTEGER,
ADD COLUMN     "frontageMeters" DOUBLE PRECISION,
ADD COLUMN     "propertyUse" TEXT,
ADD COLUMN     "yearBuilt" INTEGER,
ADD COLUMN     "zoning" TEXT;


-- CreateEnum
CREATE TYPE "MandateStatus" AS ENUM ('NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED', 'NOT_INTERESTED');

-- CreateTable
CREATE TABLE "AcquisitionMandate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "investorType" TEXT NOT NULL,
    "allocationTier" TEXT,
    "region" TEXT,
    "message" TEXT,
    "source" TEXT,
    "status" "MandateStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcquisitionMandate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AcquisitionMandate_status_createdAt_idx" ON "AcquisitionMandate"("status", "createdAt");

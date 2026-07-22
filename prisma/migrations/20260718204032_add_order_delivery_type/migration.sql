-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('DELIVERY', 'PICKUP');

-- Add the column and backfill existing orders
ALTER TABLE "Order"
    ADD COLUMN "deliveryType" "DeliveryType" NOT NULL DEFAULT 'DELIVERY';

-- New orders must specify the delivery type explicitly
ALTER TABLE "Order"
    ALTER COLUMN "deliveryType" DROP DEFAULT;

-- Add indexes used by the admin order list and retention cleanup
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");
CREATE INDEX "Order_date_idx" ON "Order"("date");
CREATE INDEX "Order_productId_idx" ON "Order"("productId");

-- Persistent rate limiting shared by all application instances
CREATE TABLE "RateLimit" (
    "scope" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("scope", "key")
);
CREATE INDEX "RateLimit_resetAt_idx" ON "RateLimit"("resetAt");

-- Revocable server-side admin sessions; only token hashes are stored
CREATE TABLE "AdminSession" (
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("tokenHash")
);
CREATE INDEX "AdminSession_expiresAt_idx" ON "AdminSession"("expiresAt");

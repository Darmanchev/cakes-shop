-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR');

-- Add nullable snapshot columns
ALTER TABLE "Order"
    ADD COLUMN "currency" "Currency",
ADD COLUMN "productName" TEXT,
ADD COLUMN "totalMinor" INTEGER,
ADD COLUMN "unitPriceMinor" INTEGER;

-- Backfill existing orders from their related products
UPDATE "Order" AS o
SET
    "currency" = 'EUR'::"Currency",
  "productName" = p."name",
  "unitPriceMinor" = p."priceMinor",
  "totalMinor" = p."priceMinor" * o."quantity"
FROM "Product" AS p
WHERE o."productId" = p."id";

-- Make snapshot fields required
ALTER TABLE "Order"
    ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "productName" SET NOT NULL,
ALTER COLUMN "totalMinor" SET NOT NULL,
ALTER COLUMN "unitPriceMinor" SET NOT NULL;
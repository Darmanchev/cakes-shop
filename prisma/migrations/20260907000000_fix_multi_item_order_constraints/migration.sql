-- Preserve orders created before OrderItem existed.
INSERT INTO "OrderItem" (
    "id",
    "orderId",
    "productId",
    "productName",
    "unitPriceMinor",
    "quantity",
    "totalMinor",
    "comment",
    "createdAt"
)
SELECT
    'legacy-' || o."id",
    o."id",
    o."productId",
    o."productName",
    o."unitPriceMinor",
    o."quantity",
    o."unitPriceMinor" * o."quantity",
    NULL,
    o."createdAt"
FROM "Order" AS o
WHERE NOT EXISTS (
    SELECT 1
    FROM "OrderItem" AS i
    WHERE i."orderId" = o."id"
);

-- Order.totalMinor is the sum of its OrderItem rows. The old columns describe
-- only the first item and reject valid multi-product baskets.
ALTER TABLE "Order"
    DROP CONSTRAINT "Order_productId_fkey",
    DROP CONSTRAINT "Order_totalMinor_matches_quantity";

DROP INDEX "Order_productId_idx";

ALTER TABLE "Order"
    DROP COLUMN "quantity",
    DROP COLUMN "productId",
    DROP COLUMN "productName",
    DROP COLUMN "unitPriceMinor";

ALTER TABLE "OrderItem"
    ADD CONSTRAINT "OrderItem_quantity_range" CHECK ("quantity" BETWEEN 1 AND 20),
    ADD CONSTRAINT "OrderItem_unitPriceMinor_positive" CHECK ("unitPriceMinor" > 0),
    ADD CONSTRAINT "OrderItem_totalMinor_matches_quantity" CHECK (
        "totalMinor"::BIGINT = "unitPriceMinor"::BIGINT * "quantity"::BIGINT
    );

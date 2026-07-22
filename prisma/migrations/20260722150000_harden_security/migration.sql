-- Track active sessions, reject TOTP replay, and retain a privacy-preserving login audit.
ALTER TABLE "AdminSession"
    ADD COLUMN "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "AdminSession_createdAt_idx" ON "AdminSession"("createdAt");

CREATE TABLE "AdminTotpUse" (
    "counter" BIGINT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminTotpUse_pkey" PRIMARY KEY ("counter")
);
CREATE INDEX "AdminTotpUse_usedAt_idx" ON "AdminTotpUse"("usedAt");

CREATE TABLE "AdminLoginEvent" (
    "id" TEXT NOT NULL,
    "identifierHash" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLoginEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdminLoginEvent_createdAt_idx" ON "AdminLoginEvent"("createdAt");
CREATE INDEX "AdminLoginEvent_identifierHash_createdAt_idx"
    ON "AdminLoginEvent"("identifierHash", "createdAt");

-- Enforce the business invariants even if a future code path bypasses Zod.
ALTER TABLE "Product"
    ADD CONSTRAINT "Product_priceMinor_positive" CHECK ("priceMinor" > 0);

ALTER TABLE "Order"
    ADD CONSTRAINT "Order_quantity_range" CHECK ("quantity" BETWEEN 1 AND 20),
    ADD CONSTRAINT "Order_unitPriceMinor_positive" CHECK ("unitPriceMinor" > 0),
    ADD CONSTRAINT "Order_totalMinor_matches_quantity" CHECK (
        "totalMinor"::BIGINT = "unitPriceMinor"::BIGINT * "quantity"::BIGINT
    ),
    ADD CONSTRAINT "Order_totalMinor_integer_range" CHECK (
        "totalMinor" BETWEEN 1 AND 2147483647
    ),
    ADD CONSTRAINT "Order_date_reasonable" CHECK (
        "date" >= "createdAt" - INTERVAL '1 day'
        AND "date" <= "createdAt" + INTERVAL '366 days'
    );

ALTER TABLE "RateLimit"
    ADD CONSTRAINT "RateLimit_count_positive" CHECK ("count" > 0),
    ADD CONSTRAINT "RateLimit_scope_not_empty" CHECK (length("scope") BETWEEN 1 AND 100),
    ADD CONSTRAINT "RateLimit_key_sha256" CHECK ("key" ~ '^[0-9a-f]{64}$');

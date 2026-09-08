# Database

The schema is defined in `prisma/schema.prisma` and PostgreSQL is the
authoritative source for the catalog and orders.

Main models:

- `Product` stores catalog data for cakes, cinnabons and muffins.
- `Order` stores fulfilment, encrypted customer details, status and totals.
- `OrderItem` links an order to a product and snapshots its name, unit price,
  quantity, line total and encrypted optional comment.
- `AdminSession`, `AdminLoginEvent` and `RateLimit` support authentication,
  auditing and persistent request limits.

`features/products/product.data.ts` defines the built-in catalog used by the
idempotent seed, while `product.service.ts` reads published products from the
database at runtime. Apply committed migrations with
`npm run db:migrate:deploy`. Run `npm run db:seed` separately for a new database
or an intentional catalog synchronization; production startup does not seed
automatically.

Orders older than the configured retention period are deleted only after both
their creation date and requested fulfilment date are past the cutoff. Product
rows referenced by historical order items are retained.

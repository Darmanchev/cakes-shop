# Architecture

The application uses a feature-oriented Next.js structure:

- `app` contains routes, layouts, server-rendered pages and API handlers.
- `features` contains product, cart, order and admin business logic.
- `components` contains shared storefront UI, layout and language components.
- `lib` contains infrastructure such as Prisma, translations, security and utilities.
- `prisma` contains the database schema, migrations and idempotent catalog seed.

Pages in `app` stay thin and compose components and services from the other
layers. Product prices and availability come from PostgreSQL. The browser cart
stores only product IDs, quantities and comments; order creation reloads active
products in a transaction and snapshots names and prices into `OrderItem` rows.
This keeps historical orders stable when the catalog changes.

Customer-facing validation is shared by the API and localized from the exact
language selected in the storefront. Direct customer identifiers and item
comments are encrypted before persistence. Authentication, rate limiting and
session management remain server-side.

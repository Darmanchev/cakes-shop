# Comprehensive project repair design

## Goal

Repair reproducible correctness, security, accessibility, performance, deployment, and maintainability defects in the existing bakery storefront without redesigning its visual identity or changing its product prices and business model.

## Scope

The audit covers the storefront, product catalog, persisted cart, checkout API, order persistence, administrator workflows, Prisma migrations and seed data, container configuration, automated tests, and project documentation.

Only evidence-backed changes belong in this repair. Pure preference-based rewrites, new product features, production deployment, secret changes, and production data changes are out of scope.

## Approach

Keep the current Next.js, React, Prisma, and PostgreSQL architecture. Fix defects at the narrowest responsible boundary and add a regression test before changing behavior. Prefer shared domain helpers over duplicated validation, but avoid broad abstractions that do not serve a verified defect.

## Repair areas

### Database and deployment

- Repair the Prisma seed query that still references the removed `Product.orders` relation.
- Make the seed path independently testable and ensure clean database setup exercises migrations and seeding.
- Preserve products referenced by historical `OrderItem` records while safely removing retired, unreferenced products.
- Reconcile deployment documentation with the actual production seeding policy.

### Cart and checkout

- Normalize and validate persisted cart identifiers consistently with server-side order validation.
- Prevent unavailable or removed catalog products from remaining actionable in checkout.
- Preserve cart behavior when browser storage is unavailable or malformed.
- Keep server-side product lookup and price calculation authoritative.
- Return useful, localized checkout errors without exposing internal failures.
- Keep submission idempotence protections and prevent cart edits while a request is in flight.

### Administrator workflows

- Validate authentication and authorization on every mutating server action.
- Handle invalid or stale order updates as controlled failures.
- Preserve session revocation, rate limiting, TOTP replay prevention, and encrypted customer data.
- Avoid unrelated changes to administrator policy or credentials.

### Storefront quality

- Resolve runtime warnings from responsive images.
- Fix confirmed keyboard, focus, labeling, error-association, and responsive-layout defects.
- Preserve the existing visual design, copy, catalog structure, and navigation model.
- Remove unused source files or components only after verifying that they have no consumers.

### Tests and documentation

- Replace or supplement brittle source-text assertions with behavioral tests where the repaired behavior can be exercised directly.
- Add regression coverage for every behavior changed by this repair.
- Update architecture, database, setup, and implemented-feature documentation to match the code.

## Error handling

Expected client mistakes return field-level or controlled responses. Missing products, invalid payloads, rate-limit failures, stale administrator actions, and unavailable persistence must not leak stack traces or raw database errors to users. Unexpected failures remain logged on the server and return generic messages.

## Verification

Verification must use fresh results from:

- focused red-green regression tests for each defect;
- the complete unit and server test suite;
- integration tests against a uniquely named local test database;
- Prisma schema validation, client generation, migrations, and seed execution;
- TypeScript checking, linting, and a production build;
- dependency vulnerability audit;
- browser smoke checks for the storefront, catalog, checkout, localization, accessibility, and responsive layouts.

Database fixtures must never target the configured application or production database. Browser checks must not submit a real customer order.

## Completion criteria

The repair is complete when all confirmed defects in the audited scope are fixed, each behavior change has regression coverage, the full verification matrix passes, documentation matches the resulting system, and the final diff contains no unrelated redesign or production-state changes.

# Project audit and repair plan

**Goal:** Fix reproducible defects in the existing bakery storefront, checkout, and admin workflows.

**Architecture:** Keep the current Next.js/Prisma structure and existing uncommitted visual work. Enforce order rules on the server, share catalog eligibility, and test persistence against a separate local database.

**Constraints:** No production data changes, deployment, or invented business/contact information. Preserve existing product prices and design direction.

- [x] Authentication: reproduce unauthenticated global logout; verify the session inside the server action before revoking sessions. Test invalid and valid sessions with real authentication logic and isolated database records.
- [x] Validation: reject duplicate product IDs and nonnumeric quantity types while retaining numeric string compatibility. Share quantity limits with the cart. Add failing schema cases before fixes.
- [x] Persistence: exclude retired products from catalog and checkout; reject invalid price totals; retain future orders until their fulfillment date has aged past retention. Test pricing snapshots, encryption, unavailable products, and retention in an isolated database.
- [x] HTTP: return controlled JSON errors when rate-limit storage fails. Test the request handler's failure path.
- [x] UI: repair cart/catalog/category destinations, prevent edits during submission, keep language selection usable when storage is blocked, and verify modal keyboard behavior and mobile layout.
- [x] Quality: include shared component tests in the normal command, remove obsolete unused imports, run lint, tests, production build, dependency audit, and a browser smoke check.
- [x] Review: independently review the backend repairs, fix the test-isolation findings, and recheck the complete diff.

## Verification

Run `npm test`, `npm run lint`, and `npm run build`. Create a uniquely named local audit database, apply committed migrations, and run integration tests with `RUN_DB_TESTS=1` and an explicit local `DATABASE_URL`. Inspect the actual storefront and checkout in a browser. Never run destructive fixtures against the configured application database.

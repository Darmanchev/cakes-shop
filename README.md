# Stas Cakes Shop

Stas Cakes Shop is an MVP for a small home bakery. The goal is intentionally practical: show the catalog, accept an order for a specific date, store it in PostgreSQL and give the owner a simple place to review incoming orders.

## Implemented

- catalog for cakes, cinnabons and combo sets;
- Bulgarian, English and Russian interface;
- order form with Zod validation and phone-number checks;
- PostgreSQL models and Prisma migrations;
- database seed with initial products;
- optional Telegram notification for a new order;
- admin order list.

## Why this stack

I chose **Next.js** because one codebase can contain the storefront, server-rendered catalog, API route and admin page. **Prisma + PostgreSQL** provide typed relations between products and orders and make schema changes explicit. **Zod** keeps validation close to the business input instead of relying only on HTML fields.

The main difficulty was moving from a static catalog to database-backed pages. An order must reference a real product, so migrations and seed data have to be ready before the form can work. Internationalization also affected more than buttons: product names and notification text need a stable fallback when the database and translation dictionary are not identical.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- PostgreSQL 16, Prisma 7
- Zod, libphonenumber-js
- optional Telegram Bot API

## Local setup

Requirements: Node.js 20+, npm and Docker.

```bash
git clone https://github.com/Darmanchev/cakes-shop.git
cd cakes-shop
npm ci
make db-up
```

Create `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/stas_cakes_shop"
ADMIN_PASSWORD_HASH="scrypt$...$..."
ADMIN_TOTP_SECRET="BASE32_SECRET"
RATE_LIMIT_SECRET="long-random-secret"
PII_ENCRYPTION_KEY="base64url-encoded-32-byte-key"
TRUSTED_PROXY_IP_HEADER="cf-connecting-ip"
TURNSTILE_SITE_KEY="site-key"
TURNSTILE_SECRET_KEY="secret-key"
TURNSTILE_EXPECTED_HOSTNAME="cakes.example.com"
ORDER_RETENTION_DAYS="365"

# Optional notifications
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Prepare the database and start development:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Create the password hash with the interactive `npm run admin:hash-password` command.
Generate `ADMIN_TOTP_SECRET` with `npm run admin:generate-totp-secret` and add it to an authenticator app before using `/admin/login`.

Open [http://localhost:3000](http://localhost:3000). The current order list is at `/admin/orders`.

## Structure

```text
app/          pages and API routes
features/     products, orders, cart and admin modules
components/   shared UI, layout and language provider
lib/          Prisma client, translations and utilities
prisma/       schema, migrations and seed
docs/         short architecture and database notes
```

## Security and production

The admin area uses a scrypt password, TOTP with replay prevention, revocable server-side sessions, a session cap and a login audit. Order submission uses persistent per-IP rate limits and requires Cloudflare Turnstile in production. Direct customer identifiers are encrypted with AES-256-GCM before they are stored.

Run `npm run env:check` before deployment. Production PostgreSQL must use TLS, the origin must only accept traffic from a proxy that overwrites `TRUSTED_PROXY_IP_HEADER`, and database backups must be encrypted. After upgrading an existing database, run `npm run pii:encrypt-existing` once after configuring `PII_ENCRYPTION_KEY`.

## Deployment

Use Node.js 22 and install dependencies with `npm ci`. The default build and
start commands are:

```bash
npm run build
npm start
```

Run database migrations as a separate release step before starting a new
application version:

```bash
npm run env:check
npm run db:migrate:deploy
```

For a new database, seed the product catalog once after the migrations:

```bash
npm run db:seed
```

Configure all required variables from `.env.example` in the hosting provider's
secret manager. `DATABASE_URL` must point to PostgreSQL over TLS. On serverless
hosting, use the provider's pooled connection URL. Set
`TRUSTED_PROXY_IP_HEADER` only to a header that the hosting proxy overwrites
with exactly one client IP; requests with a missing or forwarded IP chain fail
closed in production.

The application validates production variables both before `npm start` and
when a server or serverless instance initializes.

### Docker

Build the release image and apply migrations before starting the application:

```bash
docker build --target release -t stas-cakes-shop-release .
docker run --rm --env-file .env stas-cakes-shop-release
```

Seed a new database using the same release image:

```bash
docker run --rm --env-file .env stas-cakes-shop-release npm run db:seed
```

Build and run the production application:

```bash
docker build -t stas-cakes-shop .
docker run --rm --env-file .env -p 3000:3000 stas-cakes-shop
```

The final image runs as a non-root user and exposes `/api/health` as a
PostgreSQL-backed readiness check.

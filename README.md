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

## Current status and next steps

This is an unfinished MVP. `features/admin/admin.auth.ts` contains an incomplete admin-session implementation and currently prevents a clean TypeScript production build. The admin route is not protected yet. Before deployment I still need to finish authentication, add order-status actions, improve API error handling, add tests, provide `.env.example`, use real product images and configure a production database. Payments and a full shopping cart are outside the current MVP.

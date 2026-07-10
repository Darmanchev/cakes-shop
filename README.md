# Stas Cakes Shop

MVP интернет-магазина для заказа домашних тортов, синнабонов и наборов.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
```

## Structure

```txt
app/          Next.js routes, layouts and API routes
features/     business modules: products, orders, cart
components/   shared UI and layout components
lib/          infrastructure, constants and utilities
prisma/       database schema
docs/         project documentation
public/       static assets
```

## Development

Create `.env` from `.env.example` and set `DATABASE_URL` when database access is needed.

The current catalog still uses static data from `features/products/product.data.ts`. Later it can be replaced with Prisma queries inside `features/products/product.service.ts`.

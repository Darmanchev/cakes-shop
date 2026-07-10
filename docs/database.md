# Database

База описана в `prisma/schema.prisma`.

Основные модели:

- `Product` — товар каталога.
- `Order` — заявка клиента на товар.

Текущий сайт пока использует статические товары из `features/products/product.data.ts`. Когда подключим БД, `product.service.ts` станет местом, где статические данные заменятся запросами Prisma.

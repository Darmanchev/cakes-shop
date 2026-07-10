import { ProductCategory } from '@prisma/client';
import { prisma} from '@/lib/prisma';
import type { Category, Product } from './product.types';

const categoryMap: Record<Category, ProductCategory> = {
  cakes: ProductCategory.CAKES,
  cinnabons: ProductCategory.CINNABONS,
  combos: ProductCategory.COMBOS,
};

const categoryFromDb: Record<ProductCategory, Category> = {
  [ProductCategory.CAKES]: 'cakes',
  [ProductCategory.CINNABONS]: 'cinnabons',
  [ProductCategory.COMBOS]: 'combos',
};

function mapProductFromDb(product: {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  weight: string | null;
  filling: string | null;
  prepTime: string;
}): Product {
  return {
    id: product.id,
    name: product.name,
    category: categoryFromDb[product.category],
    price: product.price,
    description: product.description,
    image: product.image,
    weight: product.weight ?? undefined,
    filling: product.filling ?? undefined,
    prepTime: product.prepTime,
  };
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return products.map(mapProductFromDb);
}

export async function getProductsByCategory(category: Category) {
  const products = await prisma.product.findMany({
    where: { category: categoryMap[category] },
    orderBy: { createdAt: 'asc' },
  });

  return products.map(mapProductFromDb);
}
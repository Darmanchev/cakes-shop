import { ProductCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Category, Product } from "./product.types";
import { availableProductWhere } from "./product.availability";
import { products as canonicalProducts } from "./product.data";

const canonicalImageByProductId = new Map(
  canonicalProducts.map((product) => [product.id, product.image]),
);

const categoryMap: Record<Category, ProductCategory> = {
  cakes: ProductCategory.CAKES,
  cinnabons: ProductCategory.CINNABONS,
  muffins: ProductCategory.MUFFINS,
};

const categoryFromDb = {
  [ProductCategory.CAKES]: "cakes",
  [ProductCategory.CINNABONS]: "cinnabons",
  [ProductCategory.MUFFINS]: "muffins",
} as const;

function mapProductFromDb(product: {
  id: string;
  name: string;
  category: ProductCategory;
  priceMinor: number;
  description: string;
  image: string;
  weight: string | null;
  filling: string | null;
  prepTime: string;
}): Product {
  const category = categoryFromDb[
    product.category as keyof typeof categoryFromDb
  ];

  if (!category) {
    throw new Error(`Unsupported product category: ${product.category}`);
  }

  return {
    id: product.id,
    name: product.name,
    category,
    priceMinor: product.priceMinor,
    description: product.description,
    image: canonicalImageByProductId.get(product.id) ?? product.image,
    weight: product.weight ?? undefined,
    filling: product.filling ?? undefined,
    prepTime: product.prepTime,
  };
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: availableProductWhere,
    orderBy: { createdAt: "asc" },
  });

  return products.map(mapProductFromDb);
}

export async function getProductsByCategory(category: Category) {
  const products = await prisma.product.findMany({
    where: { ...availableProductWhere, category: categoryMap[category] },
    orderBy: { createdAt: "asc" },
  });

  return products.map(mapProductFromDb);
}

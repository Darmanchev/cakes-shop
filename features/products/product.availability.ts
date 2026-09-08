import { ProductCategory, type Prisma } from "@prisma/client";

// Keep historical product references while preventing new sales.
export const retiredProductIds = ["cin-3", "combo-1", "combo-2", "combo-3"];

export const availableProductWhere = {
  category: { in: [ProductCategory.CAKES, ProductCategory.CINNABONS, ProductCategory.MUFFINS] },
  id: { notIn: retiredProductIds },
} satisfies Prisma.ProductWhereInput;

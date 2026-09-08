import { CatalogContent } from "./CatalogContent";
import { getProductsByCategory } from "../product.service";
import type { Category } from "../product.types";

export async function CatalogSection({ initialCategory = "cakes" }: { initialCategory?: Category }) {
  const [cakes, cinnabons, muffins] = await Promise.all([
    getProductsByCategory("cakes"),
    getProductsByCategory("cinnabons"),
    getProductsByCategory("muffins"),
  ]);

  return <CatalogContent key={initialCategory} initialCategory={initialCategory} productsByCategory={{ cakes, cinnabons, muffins }} />;
}

import { CatalogContent } from "./CatalogContent";
import { getProductsByCategory } from "../product.service";

export async function CatalogSection() {
  const [cakes, cinnabons, muffins] = await Promise.all([
    getProductsByCategory("cakes"),
    getProductsByCategory("cinnabons"),
    getProductsByCategory("muffins"),
  ]);

  return <CatalogContent productsByCategory={{ cakes, cinnabons, muffins }} />;
}

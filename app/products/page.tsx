import { Header } from "@/components/layout/Header";
import { StorefrontFooter } from "@/components/layout/StorefrontFooter";
import { CatalogSection } from "@/features/products/components/CatalogSection";
import { productCategories } from "@/features/products/product.schema";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { category } = await searchParams;
  const initialCategory = productCategories.find((value) => value === category) ?? "cakes";
  return (
    <main className="flex w-full min-h-dvh flex-col bg-[#f7e9de] text-[#4a3a35]">
      <Header />
      <CatalogSection initialCategory={initialCategory} />
      <StorefrontFooter />
    </main>
  );
}

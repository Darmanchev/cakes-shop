import { Header } from "@/components/layout/Header";
import { StorefrontFooter } from "@/components/layout/StorefrontFooter";
import { CatalogSection } from "@/features/products/components/CatalogSection";

export default function ProductsPage() {
  return (
    <main className="flex w-full min-h-dvh flex-col bg-[#f7e9de] text-[#4a3a35]">
      <Header />
      <CatalogSection />
      <StorefrontFooter />
    </main>
  );
}

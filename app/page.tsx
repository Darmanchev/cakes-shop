import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/features/cart/CartProvider";
import { OrderSection } from "@/features/orders/components/OrderSection";
import { OrderStepsSection } from "@/features/orders/components/OrderStepsSection";
import { CatalogSection } from "@/features/products/components/CatalogSection";
import { CareSection } from "@/features/products/components/CareSection";
import { ProductHero } from "@/features/products/components/ProductHero";

export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-[#f9f3eb] text-stone-950">
        <Header />
        <ProductHero />
        <CatalogSection />
        <CareSection />
        <OrderStepsSection />
        <OrderSection />
      </main>
    </CartProvider>
  );
}

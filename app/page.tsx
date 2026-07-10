import { Header } from '@/components/layout/Header';
import { OrderSection } from '@/features/orders/components/OrderSection';
import { OrderStepsSection } from '@/features/orders/components/OrderStepsSection';
import { CatalogSection } from '@/features/products/components/CatalogSection';
import { ProductHero } from '@/features/products/components/ProductHero';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff8f2] text-stone-950">
      <Header />
      <ProductHero />
      <CatalogSection />
      <OrderStepsSection />
      <OrderSection />
    </main>
  );
}

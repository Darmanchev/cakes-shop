import { BackToCatalogLink } from "@/components/layout/BackToCatalogLink";
import { Header } from "@/components/layout/Header";
import { OrderSection } from "@/features/orders/components/OrderSection";

export default function OrderPage() {
  return (
    <main className="min-h-dvh bg-[#efe3dd] p-2 text-[#443530] sm:p-4">
      <div className="mx-auto min-h-[calc(100dvh-1rem)] max-w-[1240px] overflow-hidden rounded-[24px] border border-white/50 bg-[#f8f0e7] shadow-[0_24px_80px_rgba(68,53,48,0.14)] sm:min-h-[calc(100dvh-2rem)] sm:rounded-[32px]">
        <Header />
        <div className="px-4 pt-5 sm:px-8 lg:px-10">
          <BackToCatalogLink />
        </div>
        <OrderSection />
      </div>
    </main>
  );
}

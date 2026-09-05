import { Header } from "@/components/layout/Header";
import { CatalogSection } from "@/features/products/components/CatalogSection";

export default function Home() {
  return (
    <main className="storefront-shell h-dvh overflow-hidden bg-[#efe3dd] p-2 text-[#443530] sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col overflow-hidden rounded-[24px] border border-white/50 bg-[#f8f0e7] shadow-[0_24px_80px_rgba(68,53,48,0.14)] sm:rounded-[32px]">
        <Header />
        <CatalogSection />
      </div>
    </main>
  );
}

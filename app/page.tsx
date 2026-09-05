import { Header } from "@/components/layout/Header";
import { StorefrontFooter } from "@/components/layout/StorefrontFooter";
import { CatalogSection } from "@/features/products/components/CatalogSection";

export default function Home() {
  return (
    <main className="storefront-shell flex min-h-dvh items-center justify-center overflow-hidden bg-[#efe3dd] p-[clamp(0.35rem,1vw,1rem)] text-[#443530]">
      <div className="mx-auto flex h-[calc(100dvh-clamp(0.7rem,2vw,2rem))] w-full max-w-[min(96vw,1800px)] flex-col overflow-hidden rounded-[clamp(1.25rem,2vw,2rem)] border border-white/50 bg-[#f8f0e7] shadow-[0_24px_80px_rgba(68,53,48,0.14)]">
        <Header />
        <CatalogSection />
        <StorefrontFooter />
      </div>
    </main>
  );
}

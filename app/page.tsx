import { Header } from "@/components/layout/Header";
import { StorefrontFooter } from "@/components/layout/StorefrontFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { CategoryCardsSection } from "@/components/sections/CategoryCardsSection";
import { CoffeeSection } from "@/components/sections/CoffeeSection";

export default function Home() {
  return (
    <main className="flex w-full min-h-dvh flex-col bg-[#f7e9de] text-[#4a3a35] max-w-[1440px] mx-auto relative shadow-2xl overflow-hidden">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CategoryCardsSection />
      <CoffeeSection />
      <StorefrontFooter />
    </main>
  );
}

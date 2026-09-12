import { Header } from "@/components/layout/Header";
import { StorefrontFooter } from "@/components/layout/StorefrontFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategoryCardsSection } from "@/components/sections/CategoryCardsSection";
import { StorySection } from "@/components/sections/StorySection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";

export default function Home() {
  return (
    <main className="flex w-full min-h-dvh flex-col bg-[#f7e9de] text-[#4a3a35]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CategoryCardsSection />
      <StorySection />
      <StorefrontFooter />
    </main>
  );
}

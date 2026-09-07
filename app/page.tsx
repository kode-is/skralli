import type { Metadata } from "next";
import { BrandStrip } from "@/components/BrandStrip";
import { Hero } from "@/components/home/Hero";
import { StepsSection } from "@/components/home/StepsSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { AdvisorySection } from "@/components/home/AdvisorySection";
import { StatsSection } from "@/components/home/StatsSection";
import { BrandsSection } from "@/components/home/BrandsSection";

export const metadata: Metadata = {
  title: "Skralli - Þinn samstarfsaðili",
  description:
    "Skralli aðstoðar þig við að finna réttu lausnina fyrir þig. Hvort sem það er að finna lausn fyrir smurtæki eða finna rétta sætisáklæðið, Við getum aðstoðað þig.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <BrandStrip />
      <StepsSection />
      <CategoriesSection />
      <AdvisorySection />
      <StatsSection />
      <BrandsSection />
    </main>
  );
}

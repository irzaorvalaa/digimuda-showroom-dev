import FeaturedStock from "@/components/sections/featured-stock";
import HeroSection from "@/components/sections/hero-section";
import { getFeaturedCars } from "@/lib/queries/cars";

// ISR: data katalog di-refresh maksimal 60 detik sekali.
export const revalidate = 60;

export default async function HomePage() {
  const featuredCars = await getFeaturedCars();

  return (
    <main className="min-h-[100dvh] bg-[#f6f3ed]">
      <HeroSection />
      <FeaturedStock cars={featuredCars} />
    </main>
  );
}

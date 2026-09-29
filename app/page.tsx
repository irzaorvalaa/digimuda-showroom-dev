import HeroSection from "@/components/sections/hero-section";
import FeaturedStock from "@/components/sections/featured-stock";
import { getFeaturedCars, getAvailableCount } from "@/lib/queries/cars";

// ISR: data publik di-cache 60 detik (aturan #1).
export const revalidate = 60;

export default async function HomePage() {
  const [featured, available] = await Promise.all([
    getFeaturedCars(),
    getAvailableCount(),
  ]);

  return (
    <main className="min-h-[100dvh]">
      <HeroSection availableCount={available.data} />
      <FeaturedStock cars={featured.data} error={featured.error} />
    </main>
  );
}

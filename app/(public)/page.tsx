import { HeroImage } from "@/components/sections/hero";
import FeaturedStock from "@/components/sections/featured-stock";
import ProcessSection from "@/components/sections/process-section";
import TrustSignals from "@/components/sections/trust-signals";
import WhyDigimuda from "@/components/sections/why-digimuda";
import CtaSection from "@/components/sections/cta-section";
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
      <HeroImage availableCount={available.data} />
      <TrustSignals />
      <FeaturedStock cars={featured.data} error={featured.error} />
      <ProcessSection />
      <WhyDigimuda />
      <CtaSection />
    </main>
  );
}

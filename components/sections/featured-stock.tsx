import Link from "next/link";
import {
  ArrowRight,
  Car as CarIcon,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import AnimatedCounter from "@/components/motion/animated-counter";
import KineticUnderline from "@/components/motion/kinetic-underline";
import CarCard from "@/components/ui/car-card";
import EmptyState from "@/components/ui/empty-state";
import StaggerGrid, { StaggerItem } from "@/components/ui/stagger-grid";
import type { Car } from "@/types/car";

interface FeaturedStockProps {
  cars: Car[];
  error?: string | null;
}

// Server Component. Blok atas mengisi grid 3x2 secara penuh dengan HANYA
// 2 kartu — hero 2x2 di kiri, satu kartu tinggi 1x2 di kanan — supaya
// keduanya benar-benar terasa seperti pameran, bukan "kartu besar + kartu
// kecil sisa". Mobil ke-3 dst. mengalir sebagai grid biasa di bawahnya.
// Tanpa eyebrow label kapital (SKILL.md anti-tell); makna "featured"
// dibawa oleh heading itu sendiri.
export default function FeaturedStock({ cars, error }: FeaturedStockProps) {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter text-zinc-900 md:text-5xl">
              Currently on the floor
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-amber-600" />
              <p className="font-mono text-sm tabular-nums text-zinc-600">
                <AnimatedCounter value={cars.length} />{" "}
                {cars.length === 1 ? "car" : "cars"} available
              </p>
            </div>
          </div>
          <Link
            href="/cars"
            className="group relative inline-flex items-center gap-2 pb-1 text-sm font-medium text-zinc-900 transition-colors hover:text-amber-800"
          >
            View all stock
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
            <KineticUnderline />
          </Link>
        </div>

        {error ? (
          <EmptyState
            icon={<WarningCircle size={22} />}
            title="Couldn't load featured cars"
            description={error}
            action={
              <ButtonLink href="/" variant="ghost">
                Reload
              </ButtonLink>
            }
            className="mt-12"
          />
        ) : cars.length === 0 ? (
          <EmptyState
            icon={<CarIcon size={22} />}
            title="No featured cars right now"
            description="The floor is being restocked. Browse the full catalog in the meantime."
            action={
              <ButtonLink href="/cars" variant="ghost">
                Browse full catalog
              </ButtonLink>
            }
            className="mt-12"
          />
        ) : (
          <StaggerGrid className="mt-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2">
            {cars.map((car, index) => {
              const isHero = index === 0;
              const isTall = index === 1;
              const span = isHero
                ? "sm:col-span-2 md:col-span-2 md:row-span-2"
                : isTall
                ? "md:row-span-2"
                : "";

              return (
                <StaggerItem key={car.id} className={span}>
                  <CarCard
                    car={car}
                    variant={isHero ? "hero" : "default"}
                    priority={index < 2}
                  />
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}

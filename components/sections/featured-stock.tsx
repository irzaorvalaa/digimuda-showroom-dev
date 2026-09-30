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

// Server Component. Bento Grid asimetris 3 kolom x 2 baris:
// kartu pertama menjadi "hero" 2x2 (gambar aspect-video, teks besar),
// sisanya 1x1 mengisi ruang. Bukan 3 kolom sejajar (SKILL.md anti-center).
// Stagger didelegasikan ke StaggerGrid (client leaf).
export default function FeaturedStock({ cars, error }: FeaturedStockProps) {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">Featured Stock</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tighter text-zinc-900 md:text-5xl">
              Currently on the floor
            </h2>
            <p className="mt-3 font-mono text-sm tabular-nums text-zinc-600">
              <AnimatedCounter value={cars.length} /> cars available
            </p>
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
              const className = isHero
                ? "sm:col-span-2 md:col-span-2 md:row-span-2"
                : index === 1
                ? "md:row-span-1"
                : "md:row-span-1";

              return (
                <StaggerItem key={car.id} className={className}>
                  <CarCard
                    car={car}
                    variant={isHero ? "hero" : "default"}
                    priority={index === 0}
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

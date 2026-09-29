import Link from "next/link";
import {
  ArrowRight,
  Car as CarIcon,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import CarCard from "@/components/ui/car-card";
import EmptyState from "@/components/ui/empty-state";
import StaggerGrid, { StaggerItem } from "@/components/ui/stagger-grid";
import type { Car } from "@/types/car";

interface FeaturedStockProps {
  cars: Car[];
  error?: string | null;
}

// Server Component. Grid asimetris 12 kolom (7/5, 5/7) — bukan 3 kolom sejajar.
// Stagger di-delegasikan ke StaggerGrid (client leaf) karena parent+child
// harus berada di client tree yang sama.
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
          </div>
          <Link
            href="/cars"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-900 transition-colors hover:text-amber-800"
          >
            View all stock
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
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
          <StaggerGrid className="mt-12 grid-cols-1 md:grid-cols-12">
            {cars.map((car, index) => (
              <StaggerItem
                key={car.id}
                className={
                  index === 0
                    ? "md:col-span-7"
                    : index === 1
                    ? "md:col-span-5"
                    : index === 2
                    ? "md:col-span-5"
                    : "md:col-span-7"
                }
              >
                <CarCard car={car} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </section>
  );
}

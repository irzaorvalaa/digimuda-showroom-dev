import type { Metadata } from "next";
import { MagnifyingGlass, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import CarCard from "@/components/ui/car-card";
import CarFilter from "@/components/ui/car-filter";
import EmptyState from "@/components/ui/empty-state";
import StaggerGrid, { StaggerItem } from "@/components/ui/stagger-grid";
import { getCarsByStatus } from "@/lib/queries/cars";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Browse every car in the Digimuda ShowRoom collection — available, reserved, and recently sold.",
};

const validStatuses = ["available", "reserved", "sold"];

interface CarsPageProps {
  // Next.js 15+: searchParams berupa Promise yang harus di-await.
  searchParams: Promise<{ status?: string }>;
}

// Server Component. Filter status lewat searchParams (server-side fetch).
// Grid 2 kolom (bukan 3 kolom sejajar) + stagger reveal.
export default async function CarsPage({ searchParams }: CarsPageProps) {
  const { status } = await searchParams;
  const activeStatus =
    status && validStatuses.includes(status) ? status : "all";

  const { data: cars, error } = await getCarsByStatus(
    activeStatus === "all" ? undefined : activeStatus
  );

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">Catalog</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tighter text-zinc-900 md:text-6xl">
              The Collection
            </h1>
          </div>
          <CarFilter activeStatus={activeStatus} />
        </div>

        {error ? (
          <EmptyState
            icon={<WarningCircle size={22} />}
            title="Couldn't load the collection"
            description={error}
            action={
              <ButtonLink href="/cars" variant="ghost">
                Reload
              </ButtonLink>
            }
            className="mt-12"
          />
        ) : cars.length === 0 ? (
          <EmptyState
            icon={<MagnifyingGlass size={22} />}
            title="No cars match this filter"
            description="Nothing here right now. Try another status, or view the full collection."
            action={
              <ButtonLink href="/cars" variant="ghost">
                View all cars
              </ButtonLink>
            }
            className="mt-12"
          />
        ) : (
          <StaggerGrid
            key={activeStatus}
            className="mt-12 grid-cols-1 md:grid-cols-2"
          >
            {cars.map((car) => (
              <StaggerItem key={car.id}>
                <CarCard car={car} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>
    </main>
  );
}

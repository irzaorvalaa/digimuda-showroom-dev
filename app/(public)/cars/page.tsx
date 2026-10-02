import type { Metadata } from "next";
import { MagnifyingGlass, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import CarFilter from "@/components/ui/car-filter";
import CarResults from "@/components/ui/car-results";
import EmptyState from "@/components/ui/empty-state";
import Pagination from "@/components/ui/pagination";
import { getCarsPage, getCarPageSize } from "@/lib/queries/cars";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Browse every car in the Digimuda ShowRoom collection — available, reserved, and recently sold.",
};

const validStatuses = ["available", "reserved", "sold"];

interface CarsPageProps {
  // Next.js 15+: searchParams berupa Promise yang harus di-await.
  searchParams: Promise<{ status?: string; page?: string }>;
}

// Server Component. Filter status + paginasi lewat searchParams
// (server-side fetch). Setiap halaman menampilkan maksimal 9 unit.
export default async function CarsPage({ searchParams }: CarsPageProps) {
  const { status, page: pageParam } = await searchParams;
  const activeStatus =
    status && validStatuses.includes(status) ? status : "all";

  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const { cars, total, error } = await getCarsPage(
    activeStatus === "all" ? undefined : activeStatus,
    page
  );

  const totalPages = Math.max(1, Math.ceil(total / getCarPageSize()));

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">Catalog</p>
            <h1 className="mt-2 text-h1 font-semibold text-zinc-900">
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
          <>
            <CarResults cars={cars} filterKey={activeStatus} total={total} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              status={activeStatus === "all" ? undefined : activeStatus}
            />
          </>
        )}
      </div>
    </main>
  );
}

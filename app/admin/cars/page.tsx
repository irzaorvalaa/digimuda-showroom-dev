import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Car, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";
import DeleteButton from "@/components/ui/delete-button";
import EmptyState from "@/components/ui/empty-state";
import { deleteCarAction } from "@/app/admin/cars/actions";
import { getAdminCars, requireAdmin, type AdminCar } from "@/lib/queries/admin";
import { formatPrice } from "@/lib/utils";
import type { CarStatus } from "@/types/car";

export const metadata: Metadata = {
  title: "Manage Cars",
  description: "Car inventory management.",
  robots: { index: false, follow: false },
};

// Dot status sama dengan badge publik (emerald/amber/zinc).
const statusDot: Record<CarStatus, string> = {
  available: "bg-emerald-500",
  reserved: "bg-amber-500",
  sold: "bg-zinc-400",
};

export default async function AdminCarsPage() {
  const user = await requireAdmin();
  const { data: cars, error } = await getAdminCars();

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header asimetris: info kiri, CTA kanan. */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-500">Inventory</p>
            <h1 className="mt-2 text-h1 font-semibold text-zinc-100">
              Manage cars
            </h1>
            <p className="mt-3 font-mono text-sm text-zinc-500">
              {cars.length} {cars.length === 1 ? "listing" : "listings"} ·{" "}
              {user.role === "super_admin"
                ? "full access"
                : "create & read only"}
            </p>
          </div>
          <ButtonLink href="/admin/cars/new" variant="gold">
            Add a car
            <ArrowRight size={16} />
          </ButtonLink>
        </div>

        {error ? (
          <EmptyState
            icon={<WarningCircle size={22} />}
            title="Couldn't load inventory"
            description={error}
            className="mt-8 border-white/10 bg-white/[0.03]"
          />
        ) : cars.length === 0 ? (
          <EmptyState
            icon={<Car size={22} />}
            title="No cars yet"
            description="Add your first listing to populate the showroom."
            action={
              <ButtonLink href="/admin/cars/new" variant="gold">
                Add a car
                <ArrowRight size={16} />
              </ButtonLink>
            }
            className="mt-8 border-white/10 bg-white/[0.03]"
          />
        ) : (
          // Daftar baris divide-y (SKILL.md Rule 4: garis, bukan kartu).
          <div className="mt-12 divide-y divide-white/8 border-t border-white/8">
            {cars.map((car: AdminCar) => (
              <div
                key={car.id}
                className="flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between md:gap-8"
              >
                <div className="flex min-w-0 flex-1 items-center gap-5">
                  {/* Thumbnail 4:3 — ukuran eksplisit untuk next/image. */}
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Image
                      src={car.cover_image_url}
                      alt={`${car.name} cover`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full ${
                          statusDot[car.status as CarStatus] ?? "bg-zinc-400"
                        }`}
                      />
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {car.name}
                      </p>
                    </div>
                    <p className="mt-1 font-mono text-xs text-zinc-600">
                      {car.year} · {car.brand_name ?? "Unassigned"} ·{" "}
                      {formatPrice(car.price_idr)}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs text-zinc-700">
                      /cars/{car.slug}
                    </p>
                  </div>
                </div>

                {/* Aksi: edit + hapus. Hanya super_admin yang melihat ini
                    berfungsi — RLS menolak admin biasa. */}
                <div className="flex shrink-0 items-center gap-3">
                  <ButtonLink
                    href={`/admin/cars/${car.id}/edit`}
                    variant="ghost"
                    className="border-white/15 px-4 py-2 text-zinc-300 hover:bg-white/5 hover:text-white"
                  >
                    Edit
                  </ButtonLink>
                  {user.role === "super_admin" ? (
                    <DeleteButton
                      action={deleteCarAction}
                      id={car.id}
                      label={car.name}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

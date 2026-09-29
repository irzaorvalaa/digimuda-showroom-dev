import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/badge";
import { cn, formatMileage, formatPrice } from "@/lib/utils";
import type { Car } from "@/types/car";

interface CarCardProps {
  car: Car;
  /** true hanya untuk gambar di atas the fold (next/image priority) */
  priority?: boolean;
  className?: string;
}

// Kartu mobil light mode untuk Bento Grid — hover hanya transform/opacity.
// p-8 lega sesuai SKILL.md §9 "generous padding". h-full agar seragam di grid.
export default function CarCard({ car, priority, className }: CarCardProps) {
  return (
    <Link
      href={`/cars/${car.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white shadow-diffusion transition-transform duration-300 will-change-transform hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={car.cover_image_url}
          alt={`${car.name} exterior`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.03]"
        />
        {/* Overlay badge di atas gambar — varian liquid glass */}
        <Badge
          status={car.status}
          variant="overlay"
          className="absolute left-4 top-4"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-8">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
            {car.name}
          </h3>
          <span className="font-mono text-sm text-zinc-600">{car.year}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-600">
          {car.power_hp !== null && (
            <span className="font-mono">{car.power_hp} hp</span>
          )}
          {car.mileage_km !== null && (
            <span className="font-mono">{formatMileage(car.mileage_km)}</span>
          )}
        </div>

        <p className="mt-auto pt-4 font-mono text-base font-medium text-zinc-900">
          {formatPrice(car.price_idr)}
        </p>
      </div>
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import { cn, formatMileage, formatPrice } from "@/lib/utils";
import type { Car, CarStatus } from "@/types/car";

interface CarCardProps {
  car: Car;
  /** true untuk gambar di atas the fold (next/image priority) */
  priority?: boolean;
  className?: string;
}

// Badge status inline (badge.tsx berdiri sendiri menyusul bila dibutuhkan
// di tempat lain). available = emerald + pulse sesuai palet.
const statusConfig: Record<
  CarStatus,
  { label: string; dot: string; text: string }
> = {
  available: {
    label: "Available",
    dot: "bg-emerald-500 animate-pulse",
    text: "text-emerald-700",
  },
  reserved: { label: "Reserved", dot: "bg-amber-500", text: "text-amber-800" },
  sold: { label: "Sold", dot: "bg-zinc-400", text: "text-zinc-600" },
};

// Kartu mobil light mode untuk Bento Grid — hover hanya transform/opacity.
export default function CarCard({ car, priority, className }: CarCardProps) {
  const status = statusConfig[car.status];

  return (
    <Link
      href={`/cars/${car.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white shadow-diffusion transition-transform duration-300 will-change-transform hover:-translate-y-1",
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
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
          <span className={cn("size-2 rounded-full", status.dot)} />
          <span className={cn("text-xs font-medium", status.text)}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-6">
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

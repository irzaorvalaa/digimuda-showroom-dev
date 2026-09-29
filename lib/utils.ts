import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format harga Rupiah (id-ID), contoh: 1250000000 -> "Rp1.250.000.000".
// null = "Ask Us" sesuai constraint cars.price_idr (lihat 0001_init.sql).
export function formatPrice(priceIdr: number | null): string {
  if (priceIdr === null) return "Ask Us";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(priceIdr);
}

// Format mileage, contoh: 12500 -> "12.500 km".
export function formatMileage(mileageKm: number | null): string {
  if (mileageKm === null) return "—";
  return `${new Intl.NumberFormat("id-ID").format(mileageKm)} km`;
}

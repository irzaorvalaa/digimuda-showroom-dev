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

// Format tanggal untuk dashboard admin, contoh: "30 Sep 2026, 14.20".
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateString));
}

// Ubah nama mobil jadi slug URL: lowercase, buang aksen, spasi/karakter
// non-alfanumerik → hyphen tunggal, rapikan hyphen di ujung.
// Dipakai di form admin (auto-generate dari name) DAN di server sebagai
// fallback bila field slug kosong/tampered.
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // buang diakritik (é → e)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

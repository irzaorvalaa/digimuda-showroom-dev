import { cn } from "@/lib/utils";
import type { CarStatus } from "@/types/car";

interface BadgeProps {
  status: CarStatus;
  className?: string;
}

// Badge status berdiri sendiri (untuk halaman katalog/detail).
// available = emerald + pulse sesuai palet; versi overlay di car-card
// sengaja terpisah karena butuh latar putih di atas gambar.
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

export default function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-white px-3 py-1.5 text-xs font-medium",
        className
      )}
    >
      <span className={cn("size-2 rounded-full", config.dot)} />
      <span className={config.text}>{config.label}</span>
    </span>
  );
}

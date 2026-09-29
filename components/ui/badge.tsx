import { cn } from "@/lib/utils";
import type { CarStatus } from "@/types/car";

interface BadgeProps {
  status: CarStatus;
  /** solid = di atas cream/putih; overlay = di atas gambar (liquid glass) */
  variant?: "solid" | "overlay";
  className?: string;
}

// Badge status berdiri sendiri (katalog/detail). available = emerald + pulse
// sesuai palet. Overlay memakai inner border + inner highlight (SKILL.md §4).
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

export default function Badge({
  status,
  variant = "solid",
  className,
}: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
        variant === "solid" && "border border-stone-200/60 bg-white",
        // Liquid glass refraction: inner border + highlight tepi atas
        variant === "overlay" &&
          "border border-white/10 bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md",
        className
      )}
    >
      <span className={cn("size-2 rounded-full", config.dot)} />
      <span className={config.text}>{config.label}</span>
    </span>
  );
}

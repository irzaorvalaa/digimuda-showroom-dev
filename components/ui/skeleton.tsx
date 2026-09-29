import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

// Placeholder loading dengan Skeleton Shimmer (SKILL.md §8): sapuan cahaya
// bergerak melintas, memakai transform (60fps, tanpa JS). Bentuk mengikuti
// layout asli lewat className — bukan spinner bundar. Murni CSS sehingga
// tetap Server Component tanpa re-render.
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-2xl bg-stone-200/60",
        className
      )}
    >
      <div className="shimmer absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}

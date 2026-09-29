import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

// Placeholder loading — bentuknya mengikuti layout asli (bukan spinner
// bundar). Pakai className untuk menyamai tinggi/sudut elemen sebenarnya.
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-2xl bg-stone-200/70", className)}
    />
  );
}

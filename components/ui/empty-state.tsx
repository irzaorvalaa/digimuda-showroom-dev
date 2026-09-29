import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Ikon Phosphor (BUKAN emoji) — komponen visual penanda */
  icon: ReactNode;
  title: string;
  description: string;
  /** Aksi opsional (mis. ButtonLink) untuk mengisi data / reset filter */
  action?: ReactNode;
  className?: string;
}

// Empty state reusable (katalog, featured, hasil filter). Left-aligned,
// border dashed tipis — kesan gallery, bukan kartu berat.
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-[2.5rem] border border-dashed border-stone-200/60 p-10 md:p-12",
        className
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full border border-stone-200/60 bg-white text-amber-800">
        {icon}
      </span>
      <div>
        <p className="text-base font-medium tracking-tight text-zinc-900">
          {title}
        </p>
        <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

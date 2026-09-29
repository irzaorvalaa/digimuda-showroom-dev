"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const options = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
] as const;

interface CarFilterProps {
  /** Status aktif, dikirim dari Server Component (tanpa useSearchParams) */
  activeStatus: string;
}

// Filter status katalog. Pakai router.push ke ?status=... supaya Server
// Component yang fetch ulang. Shared-element pill (layoutId) berpindah halus.
export default function CarFilter({ activeStatus }: CarFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const select = (value: string) => {
    if (value === activeStatus) return;
    const params = new URLSearchParams();
    if (value !== "all") params.set("status", value);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div
      role="group"
      aria-label="Filter cars by status"
      className="flex flex-wrap gap-2"
    >
      {options.map((opt) => {
        const active = activeStatus === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => select(opt.value)}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={cn(
              "relative rounded-full px-5 py-2.5 text-sm font-medium tracking-tight transition-colors",
              active
                ? "text-zinc-900"
                : "border border-stone-200/60 bg-white text-zinc-600 hover:text-zinc-900"
            )}
          >
            {active && (
              <motion.span
                layoutId="filter-active"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute inset-0 rounded-full bg-amber-500"
              />
            )}
            <span className="relative">{opt.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import CarCard from "@/components/ui/car-card";
import AnimatedCounter from "@/components/motion/animated-counter";
import type { Car } from "@/types/car";

interface CarResultsProps {
  cars: Car[];
  /** Status aktif, jadi hasil tampil lagi dari atas saat filter berganti */
  filterKey: string;
  /** Total unit untuk status aktif (termasuk halaman lain) */
  total: number;
}

// Grid hasil katalog + counter jumlah unit. Client Component supaya bisa
// pakai AnimatePresence (enter/exit saat filter berganti) dan layout
// animation (kartu bergeser halus saat urutan berubah). Spring stiffness
// 100, damping 20, hanya transform/opacity (60fps).
export default function CarResults({
  cars,
  filterKey,
  total,
}: CarResultsProps) {
  return (
    <div className="mt-12">
      <div className="mb-8 flex items-baseline gap-2 text-zinc-600">
        <AnimatedCounter
          value={total}
          className="font-mono text-4xl font-semibold tabular-nums text-zinc-900"
        />
        <span className="text-sm font-medium">
          {total === 1 ? "car in stock" : "cars in stock"}
        </span>
      </div>

      <motion.div
        key={filterKey}
        layout
        transition={{ layout: { type: "spring", stiffness: 100, damping: 20 } }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {cars.map((car) => (
            <motion.div
              key={car.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { type: "spring", stiffness: 100, damping: 20 },
                layout: { type: "spring", stiffness: 100, damping: 20 },
              }}
              className="h-full"
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

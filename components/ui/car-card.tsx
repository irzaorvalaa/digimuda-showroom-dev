"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import type { PointerEvent } from "react";
import Badge from "@/components/ui/badge";
import { cn, formatMileage } from "@/lib/utils";
import type { Car } from "@/types/car";

interface CarCardProps {
  car: Car;
  /** true hanya untuk gambar di atas the fold (next/image priority) */
  priority?: boolean;
  /** "hero" untuk kartu besar 2x2 di Bento Grid (gambar aspect-video, teks lebih besar) */
  variant?: "default" | "hero";
  className?: string;
}

const spring = { stiffness: 100, damping: 20 } as const;

// Kartu mobil light mode untuk Bento Grid (SKILL.md §9). Interaksi hover:
// spotlight border, holographic foil, parallax tilt, dan directional fill
// pada baris harga. Semua nilai kursor disimpan di MotionValue (bukan
// useState) supaya tidak memicu re-render — hanya transform/opacity.
export default function CarCard({
  car,
  priority,
  variant = "default",
  className,
}: CarCardProps) {
  const isHero = variant === "hero";

  // Posisi kursor relatif terhadap kartu (0..1), dipakai spotlight & tilt.
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, spring);
  const springY = useSpring(mouseY, spring);

  // Spotlight border: radial gradient mengikuti kursor di tepi kartu.
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${springX}% ${springY}%, rgba(217,169,70,0.16), transparent 70%)`;

  // Holographic foil: lapisan iridescent yang bergeser mengikuti kursor.
  const foil = useMotionTemplate`linear-gradient(${springX}deg, rgba(217,169,70,0.10), rgba(255,255,255,0) 40%, rgba(120,200,255,0.08) 70%, rgba(217,169,70,0.08))`;

  // Parallax tilt: rotasi halus mengikuti jarak kursor dari pusat.
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, spring);
  const rotateY = useSpring(rotateYValue, spring);

  const onMouseMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
    // Tilt maksimal ~4 derajat, halus (kartu adalah Link besar).
    rotateXValue.set(-((event.clientY - rect.top) / rect.height - 0.5) * 4);
    rotateYValue.set(((event.clientX - rect.left) / rect.width - 0.5) * 4);
  };

  const onMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    rotateXValue.set(0);
    rotateYValue.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      className={cn("group h-full", className)}
    >
      <Link
        href={`/cars/${car.slug}`}
        onPointerMove={onMouseMove}
        onPointerLeave={onMouseLeave}
        className="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-stone-200/60 bg-white shadow-diffusion transition-transform duration-300 will-change-transform hover:-translate-y-1"
      >
        {/* Spotlight border — tepi kartu menyala mengikuti kursor */}
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[2.5rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div
          className={cn(
            "relative w-full overflow-hidden",
            isHero ? "aspect-video" : "aspect-[4/3]"
          )}
        >
          <Image
            src={car.cover_image_url}
            alt={`${car.name} exterior`}
            fill
            priority={priority}
            sizes={
              isHero
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.03]"
          />

          {/* Holographic foil — kilau iridescent di atas gambar saat hover */}
          <motion.div
            aria-hidden
            style={{ background: foil }}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          <Badge
            status={car.status}
            variant="overlay"
            className="absolute left-4 top-4"
          />
        </div>

        <div className="relative flex flex-1 flex-col gap-1 p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3
              className={cn(
                "font-semibold tracking-tight text-zinc-900",
                isHero ? "text-2xl md:text-3xl" : "text-lg"
              )}
            >
              {car.name}
            </h3>
            <span className="font-mono text-sm tabular-nums text-zinc-600">
              {car.year}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-600">
            {car.power_hp !== null && (
              <span className="font-mono tabular-nums">{car.power_hp} hp</span>
            )}
            {car.power_hp !== null && car.mileage_km !== null && (
              <span aria-hidden="true" className="text-stone-300">
                ·
              </span>
            )}
            {car.mileage_km !== null && (
              <span className="font-mono tabular-nums">
                {formatMileage(car.mileage_km)}
              </span>
            )}
          </div>

          {/* Baris harga — label PRICE + "Ask Us" (tanpa angka, sesuai migrasi price_idr = null) */}
          <div className="relative mt-auto flex items-baseline justify-between gap-4 overflow-hidden border-t border-stone-200/60 pt-4">
            <motion.div
              aria-hidden
              style={{ background: spotlight }}
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <span className="relative font-mono text-xs uppercase tracking-widest text-zinc-600">
              Price
            </span>
            <span className="relative font-mono text-base font-medium text-amber-700">
              Ask Us
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";

interface HeroImageProps {
  /** Jumlah unit tersedia nyata dari database. */
  availableCount?: number;
}

// Subscribe ke perubahan dua media query. Signature useSyncExternalStore:
// (subscribe, getSnapshot, getServerSnapshot) — snapshot server = false
// supaya render pertama klien identik dengan server (anti hydration mismatch).
function subscribeToMotionPrefs(callback: () => void) {
  const pointer = window.matchMedia("(pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  pointer.addEventListener("change", callback);
  reduced.addEventListener("change", callback);
  return () => {
    pointer.removeEventListener("change", callback);
    reduced.removeEventListener("change", callback);
  };
}

// Parallax hanya untuk pointer presisi (mouse) DAN saat reduced-motion mati.
function getParallaxEnabled() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useParallaxEnabled() {
  return useSyncExternalStore(
    subscribeToMotionPrefs,
    getParallaxEnabled,
    () => false
  );
}

// Varian editorial: satu gambar besar + parallax halus, teks rata kiri-bawah.
export default function HeroImage({ availableCount = 0 }: HeroImageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxEnabled = useParallaxEnabled();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Gambar bergerak 15% dari total scroll — hanya transform, 60fps.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-[#f6f3ed]"
      aria-label="Hero"
    >
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-[1400px] grid-cols-1 md:grid-cols-12">
        {/* Gambar — mobile aspect 4/5, desktop mengisi kolom penuh */}
        <div className="relative order-1 overflow-hidden md:order-none md:col-span-7 md:min-h-[100dvh]">
          <motion.div
            style={parallaxEnabled ? { y: imageY } : undefined}
            className="relative aspect-[4/5] w-full md:absolute md:inset-0 md:aspect-auto md:h-[115%]"
          >
            <Image
              src="https://picsum.photos/seed/digimuda-hero/1600/1200"
              alt="Luxury coupe photographed in a bright, minimal gallery space"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </motion.div>
          {/* Fade ke cream di tepi kanan (desktop) supaya menyatu dengan teks */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-32 bg-gradient-to-l from-[#f6f3ed] to-transparent md:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f6f3ed] to-transparent md:hidden"
          />
        </div>

        {/* Konten — rata bawah-kiri (BUKAN centered) */}
        <div className="order-2 flex items-end p-8 md:order-none md:col-span-5 md:p-16">
          <div className="w-full">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-amber-800 uppercase"
            >
              Featured · 2026
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.08,
              }}
              className="mt-5 text-[clamp(2rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-tighter text-zinc-900"
            >
              Bentley
              <br />
              Continental GT.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.14,
              }}
              className="mt-6 max-w-[42ch] text-base leading-relaxed text-zinc-600"
            >
              A grand tourer built for distance and composure. Hand-finished
              cabin, W12 power, and a presence that never asks for attention.
            </motion.p>

            {/* Spec highlights — font-mono, 3 baris horizontal */}
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.2,
              }}
              className="mt-8 grid grid-cols-3 gap-4 border-y border-stone-200/60 py-5"
            >
              <div>
                <dt className="font-mono text-[0.65rem] tracking-widest text-zinc-500">
                  POWER
                </dt>
                <dd className="mt-1 font-mono text-lg text-zinc-900">650 hp</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] tracking-widest text-zinc-500">
                  0–100
                </dt>
                <dd className="mt-1 font-mono text-lg text-zinc-900">3.6 s</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.65rem] tracking-widest text-zinc-500">
                  V-MAX
                </dt>
                <dd className="mt-1 font-mono text-lg text-zinc-900">
                  335 km/h
                </dd>
              </div>
            </motion.dl>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.26,
              }}
              className="mt-8 flex flex-wrap items-center gap-6"
            >
              <ButtonLink href="/cars" variant="primary">
                Explore the collection
                <ArrowRight
                  weight="bold"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </ButtonLink>
              <p className="font-mono text-xs text-zinc-500">
                {availableCount + 142} units vetted
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

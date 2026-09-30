"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import GrainOverlay from "@/components/motion/grain-overlay";
import KineticMarquee from "@/components/motion/kinetic-marquee";
import TiltCard from "@/components/motion/tilt-card";

interface HeroSectionProps {
  /** Jumlah unit tersedia nyata dari database — angka organik, bukan statis */
  availableCount: number;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

// Text mask reveal (SKILL.md §8): tiap baris H1 naik dari balik masker,
// memberi efek "transparent window". Anti-center bias — teks rata kiri.
const lineMask: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const MARQUEE_ITEMS = [
  "Bentley",
  "Mercedes-AMG",
  "BMW M",
  "Porsche",
  "Ford Mustang",
  "Curated",
  "Documented",
  "Inspection 142-point",
];

// Hero asimetris split-screen (DESIGN_VARIANCE 8): teks rata kiri, gambar
// rata kanan dengan fade ke cream. Anti-center bias.
export default function HeroSection({ availableCount }: HeroSectionProps) {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden px-4 pb-16 pt-28 md:px-8">
      {/* Grain overlay — pointer-events-none, fixed ke viewport */}
      <GrainOverlay className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]" />

      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-2 md:gap-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-white px-4 py-2"
          >
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-zinc-600">
              Showroom open — Jakarta
            </span>
          </motion.div>

          {/* Text mask reveal untuk H1 */}
          <h1 className="mt-6 text-balance text-5xl font-bold leading-none tracking-tighter text-zinc-900 md:text-7xl">
            <span className="block overflow-hidden">
              <motion.span variants={lineMask} className="block">
                Machines worth
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={lineMask} className="block">
                keeping.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-[46ch] text-base leading-relaxed text-zinc-600 md:text-lg"
          >
            A private collection of Bentley, Mercedes, BMW, and Porsche — each
            one inspected, documented, and presented like a gallery piece. No
            listings noise.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/cars" variant="primary">
              Browse the collection
            </ButtonLink>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex items-center gap-6 border-t border-stone-200/60 pt-6"
          >
            <div>
              <p className="font-mono text-2xl font-medium text-zinc-900">
                {availableCount}
              </p>
              <p className="text-xs text-zinc-600">cars on the floor</p>
            </div>
            <div className="h-8 w-px bg-stone-200/60" />
            <div>
              <p className="font-mono text-2xl font-medium text-zinc-900">
                142
              </p>
              <p className="text-xs text-zinc-600">inspection points per car</p>
            </div>
            <div className="h-8 w-px bg-stone-200/60" />
            <div>
              <p className="font-mono text-2xl font-medium text-zinc-900">
                Est. 2017
              </p>
              <p className="text-xs text-zinc-600">curating since</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Parallax tilt pada kartu gambar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
          className="relative hidden h-[70vh] md:block"
        >
          <TiltCard className="h-full w-full">
            <Image
              src="/images/cars/bentley-continental-gt-speed.jpg"
              alt="Bentley Continental GT Speed parked in a bright gallery showroom"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-[2.5rem] object-cover shadow-diffusion"
            />
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-[#f6f3ed]/60 via-transparent to-transparent" />

            <div className="absolute -left-4 bottom-8 rounded-[2.5rem] border border-white/10 bg-zinc-900 p-6 text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)]">
              <p className="text-xs text-zinc-400">Now on display</p>
              <p className="mt-1 text-base font-medium tracking-tight">
                Bentley Continental GT
              </p>
              <p className="mt-2 font-mono text-sm text-amber-500">
                W12 · 650 hp
              </p>
            </div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Kinetic marquee — pita merek & kata kunci di dasar hero */}
      <KineticMarquee
        items={MARQUEE_ITEMS}
        speed={50}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-stone-200/60 py-6"
      />
    </section>
  );
}

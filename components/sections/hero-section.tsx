"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

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

// Hero asimetris split-screen (DESIGN_VARIANCE 8): teks rata kiri, gambar
// rata kanan dengan fade ke cream. Anti-center bias.
export default function HeroSection({ availableCount }: HeroSectionProps) {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden px-4 pb-16 pt-28 md:px-8">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 md:grid-cols-2 md:gap-8">
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

          <motion.h1
            variants={item}
            className="mt-6 text-5xl font-bold leading-none tracking-tighter text-zinc-900 md:text-7xl"
          >
            Machines worth
            <br />
            keeping.
          </motion.h1>

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
            <ButtonLink href="/contact" variant="ghost">
              Book a viewing
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
          </motion.div>
        </motion.div>

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
          <Image
            src="/images/cars/6.jpg"
            alt="Dark green Bentley Continental GT parked in a bright gallery showroom"
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
        </motion.div>
      </div>
    </section>
  );
}

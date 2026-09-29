"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Stagger parent — semua child ada di client component yang sama.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

// Hero asimetris (split screen 1.1fr / 1fr) — H1 left-aligned,
// tanpa animasi infinite di sini (hemat GPU; entrance spring saja).
export default function HeroSection() {
  return (
    <section className="flex min-h-[100dvh] items-center px-4 pb-16 pt-28 md:px-8">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="text-sm font-medium tracking-tight text-amber-800"
          >
            Jakarta · Private Showroom
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 text-4xl font-semibold leading-none tracking-tighter text-zinc-900 md:text-6xl"
          >
            Luxury cars,
            <br />
            curated like
            <br />
            gallery pieces.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-[65ch] text-base leading-relaxed text-zinc-600"
          >
            Every Bentley, Mercedes, BMW, and Porsche in this room passed a
            120-point inspection and arrived with full documentation. No
            listings noise — just the cars worth your time.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cars"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium tracking-tight text-white transition-colors hover:bg-zinc-800"
            >
              Browse the stock
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-stone-200 px-6 py-3 text-sm font-medium tracking-tight text-zinc-900 transition-colors hover:bg-stone-100"
            >
              Book a viewing
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
          className="relative"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-stone-200/60">
            <Image
              src="https://picsum.photos/seed/digimuda-hero-bentley-green/900/1125"
              alt="British Racing Green grand tourer in the Digimuda showroom"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          {/* Kartu status mengambang — snapshot data, bukan animasi infinite */}
          <div className="absolute -left-4 bottom-8 rounded-[1.5rem] border border-stone-200/60 bg-white p-4 shadow-diffusion md:-left-8">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-zinc-900">
                3 new arrivals this week
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-600">
              Inspected, documented, ready for viewing.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

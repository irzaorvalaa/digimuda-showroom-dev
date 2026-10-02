"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Angka konkret sebagai bukti kepercayaan — bukan dekorasi.
const TRUST_ITEMS = [
  { value: "142", label: "titik inspeksi di setiap unit" },
  { value: "320+", label: "unit terjual sejak 2020" },
  { value: "4.9/5", label: "dari 127 ulasan Google" },
  { value: "3", label: "tahun garansi mesin" },
  { value: "48", label: "jam proses pembelian" },
] as const;

// Sama dengan spring yang dipakai komponen lain (car-card.tsx) —
// bukan diimpor dari file yang belum ada.
const spring = { stiffness: 100, damping: 20 } as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: spring },
};

export function TrustSignals() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-[#f6f3ed] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Heading tersembunyi demi struktur dokumen yang aksesibel. */}
        <h2 className="sr-only">Trust signals</h2>

        <motion.dl
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid grid-cols-1 divide-y divide-stone-200/60 md:grid-cols-6 md:items-end md:divide-y-0"
        >
          {TRUST_ITEMS.map((item, index) => {
            const isLead = index === 0;
            const isLast = index === TRUST_ITEMS.length - 1;

            return (
              <motion.div
                key={item.value}
                variants={itemVariants}
                className={cn(
                  "flex flex-col gap-2 py-8 md:py-0",
                  !isLast && "md:border-r",
                  isLead
                    ? "md:col-span-2 md:border-amber-600/40 md:pr-10"
                    : "md:border-stone-200/60 md:px-8"
                )}
              >
                <dt className="sr-only">{item.label}</dt>
                <dd className="flex flex-col gap-2">
                  <span
                    className={cn(
                      "font-mono leading-none tracking-tight tabular-nums",
                      isLead
                        ? "text-[clamp(2.75rem,5vw,4rem)] text-zinc-900"
                        : "text-[clamp(2rem,3vw,2.5rem)] text-zinc-700"
                    )}
                  >
                    {item.value}
                  </span>
                  <span
                    className={cn(
                      "leading-snug text-zinc-600",
                      isLead ? "text-base" : "text-sm"
                    )}
                  >
                    {item.label}
                  </span>
                </dd>
              </motion.div>
            );
          })}
        </motion.dl>
      </div>
    </section>
  );
}

export default TrustSignals;

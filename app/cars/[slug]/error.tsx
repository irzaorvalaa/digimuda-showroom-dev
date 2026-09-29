"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";

interface CarDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Error boundary detail mobil (Client Component). Tombol retry memanggil
// reset() untuk me-render ulang route (aturan #8 loading & error states).
export default function CarDetailError({ error, reset }: CarDetailErrorProps) {
  useEffect(() => {
    console.error("Car detail error:", error);
  }, [error]);

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-32 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start gap-4 rounded-[2.5rem] border border-stone-200/60 bg-white p-10 shadow-diffusion md:p-12">
          <span className="flex size-12 items-center justify-center rounded-full border border-stone-200/60 bg-white text-amber-800">
            <WarningCircle size={22} />
          </span>
          <div>
            <p className="text-base font-medium tracking-tight text-zinc-900">
              We couldn&apos;t load this car
            </p>
            <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-zinc-600">
              Something went wrong while fetching the details. Please try again.
            </p>
          </div>
          <motion.button
            type="button"
            onClick={reset}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium tracking-tight text-white transition-colors hover:bg-zinc-800"
          >
            Try again
          </motion.button>
        </div>
      </div>
    </main>
  );
}

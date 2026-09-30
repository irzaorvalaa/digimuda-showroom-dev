"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import { memo } from "react";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/motion/magnetic";

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

// Tombol "Digimuda Concierge" — pill gradient emas dengan 3 layer polish:
//   1) Pulse glow (breathing halo amber)
//   2) Shimmer sweep (garis cahaya berjalan kiri→kanan)
//   3) Sparkle icon yang "hidup" (rotasi halus)
// Semua perpetual animation punya useReducedMotion guard.
function ConciergeButtonBase() {
  const shouldReduce = useReducedMotion() ?? false;

  return (
    <Magnetic strength={0.25}>
      <motion.a
        href="https://wa.me/6281192630840?text=Hello%20Digimuda%20Concierge%2C%20I%27d%20like%20to%20ask%20about%20a%20car."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Digimuda Concierge on WhatsApp"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        className={cn(
          "group relative flex items-center gap-2 overflow-hidden",
          "rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400",
          "px-6 py-3.5 text-sm font-medium tracking-tight text-zinc-900",
          "shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)]",
          "will-change-transform"
        )}
      >
        {/* 1. Pulse glow — breathing amber halo (opacity loop, bukan box-shadow) */}
        {!shouldReduce && (
          <motion.span
            aria-hidden="true"
            animate={{ opacity: [0.3, 0.65, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_28px_6px_rgba(245,158,11,0.4)]"
          />
        )}

        {/* 2. Shimmer sweep — garis cahaya miring bergerak kiri→kanan */}
        {!shouldReduce && (
          <motion.span
            aria-hidden="true"
            initial={{ x: "-130%" }}
            animate={{ x: "230%" }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2.8,
            }}
            style={{ transform: "skewX(-20deg)" }}
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
        )}

        {/* Liquid Glass: inner highlight tipis di atas gradient */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/35 via-transparent to-transparent"
        />

        {/* Online status indicator — titik emerald kecil di kanan atas */}
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 flex size-1.5"
        >
          {!shouldReduce && (
            <motion.span
              className="absolute inline-flex size-full rounded-full bg-emerald-400"
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>

        {/* Sparkle icon dengan rotasi halus (perpetual, terlindungi reduced-motion) */}
        <motion.span
          className="relative z-10"
          animate={shouldReduce ? undefined : { rotate: [0, 8, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkle size={18} weight="fill" />
        </motion.span>

        <span className="relative z-10">Digimuda Concierge</span>
      </motion.a>
    </Magnetic>
  );
}

export default memo(ConciergeButtonBase);

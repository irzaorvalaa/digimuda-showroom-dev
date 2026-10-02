"use client";

import { motion, useReducedMotion } from "framer-motion";
import { memo } from "react";

interface KineticMarqueeProps {
  items: string[];
  /** Kecepatan horizontal (px per detik), default 60 */
  speed?: number;
  className?: string;
}

// Kinetic marquee (SKILL.md §8): pita teks bergerak horizontal tanpa henti.
// Loop mulus dengan x dari "0%" ke "-50%" (konten diduplikasi 2x).
// Diisolasi + memo; menghormati reduce-motion.
function KineticMarquee({ items, speed = 60, className }: KineticMarqueeProps) {
  const shouldReduce = useReducedMotion();

  // Hitung durasi agar kecepatan konsisten, tidak tergantung lebar konten.
  const trackWidthPercent = 50; // konten diduplikasi, satu set = 50%
  const duration = (trackWidthPercent / speed) * 10;

  const track = (
    <div className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className="px-6 text-h2 font-semibold tracking-tight text-zinc-300">
            {item}
          </span>
          <span className="size-1.5 rounded-full bg-amber-500/50" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div className={className} aria-hidden>
      <div className="flex overflow-hidden">
        {shouldReduce ? (
          <div className="flex">{track}</div>
        ) : (
          <motion.div
            className="flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {track}
            {track}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default memo(KineticMarquee);

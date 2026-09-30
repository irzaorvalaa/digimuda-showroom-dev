"use client";

import { motion, useReducedMotion } from "framer-motion";
import { memo } from "react";
import type { ReactNode } from "react";

interface PulseGlowProps {
  children: ReactNode;
  className?: string;
}

// Pulse glow dekoratif (SKILL.md §9): opacity berdenyut halus 0.6 ↔ 1.
// Diisolasi sebagai leaf component + React.memo agar loop tidak memicu
// re-render parent. Dihormati juga preferensi reduce-motion.
function PulseGlow({ children, className }: PulseGlowProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={className}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
}

export default memo(PulseGlow);

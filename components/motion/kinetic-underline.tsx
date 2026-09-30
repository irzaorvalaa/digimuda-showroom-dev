"use client";

import { motion, useReducedMotion } from "framer-motion";
import { memo } from "react";

interface KineticUnderlineProps {
  className?: string;
}

// Garis bawah "kinetik" (SKILL.md §8): membentang dari kiri lalu menyusut
// dari sisi asal kursor saat hover. Dipakai pada link teks pendek.
// Diisolasi sebagai leaf + memo, hanya transform/opacity (60fps).
function KineticUnderline({ className }: KineticUnderlineProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return (
      <span
        aria-hidden
        className={
          "absolute inset-x-0 bottom-0 h-px bg-current opacity-0 transition-opacity duration-300 group-hover:opacity-100 " +
          (className ?? "")
        }
      />
    );
  }

  return (
    <motion.span
      aria-hidden
      className={
        "absolute inset-x-0 bottom-0 h-px origin-left bg-current " +
        (className ?? "")
      }
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    />
  );
}

export default memo(KineticUnderline);

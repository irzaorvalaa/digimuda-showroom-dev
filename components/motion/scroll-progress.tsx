"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { memo } from "react";

// Scroll progress bar (SKILL.md §8): garis emas tipis di bawah navbar yang
// memanjang mengikuti posisi scroll halaman. useScroll mengukur progres
// vertikal tanpa window.addEventListener('scroll'). Hanya transform (scaleX),
// 60fps. Diisolasi + memo supaya tidak memicu re-render parent.
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-amber-500"
      style={{ scaleX }}
    />
  );
}

export default memo(ScrollProgress);

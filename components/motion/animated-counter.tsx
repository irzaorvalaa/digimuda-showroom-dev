"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { memo } from "react";

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

// Counter count-up (SKILL.md §9): angka berjalan dari 0 ke target saat
// elemen masuk viewport. Diisolasi sebagai leaf component + memo, nilai
// ditulis langsung ke DOM (bukan useState) agar tidak memicu re-render.
function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    if (shouldReduce) {
      node.textContent = String(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [inView, value, shouldReduce]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : undefined}
      transition={{ duration: 0.4 }}
    >
      0
    </motion.span>
  );
}

export default memo(AnimatedCounter);

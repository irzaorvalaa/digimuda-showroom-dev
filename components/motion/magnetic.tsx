"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

const spring = { stiffness: 100, damping: 20 } as const;

interface MagneticProps {
  children: ReactNode;
  /** Kekuatan tarikan magnet, 0.3 default, maksimal offset 4px */
  strength?: number;
}

// Magnetic micro-physics (SKILL.md §4): elemen tertarik halus ke arah kursor.
// Posisi disimpan di MotionValue (bukan useState) supaya tidak memicu re-render.
// Hanya aktif untuk pointer halus (mouse) — sentuhan mobile diabaikan.
export default function Magnetic({ children, strength = 0.3 }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    // Aktif hanya untuk pointer halus (mouse); cek saat event, tanpa state.
    const finePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    // Batasi offset maksimal 4px.
    const clampedX = Math.max(-4, Math.min(4, dx * strength));
    const clampedY = Math.max(-4, Math.min(4, dy * strength));
    x.set(clampedX);
    y.set(clampedY);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className="inline-flex"
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.span>
  );
}

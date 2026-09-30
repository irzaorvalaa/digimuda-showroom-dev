"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

const spring = { stiffness: 100, damping: 20 } as const;

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Rotasi maksimal dalam derajat, default 8 */
  maxTilt?: number;
}

// Parallax tilt card (SKILL.md §8): kartu miring 3D mengikuti kursor.
// Nilai disimpan di MotionValue (bukan useState) supaya tidak re-render.
// Hanya aktif untuk mouse — sentuhan mobile diabaikan.
export default function TiltCard({
  children,
  className,
  maxTilt = 8,
}: TiltCardProps) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, spring);
  const springRotateY = useSpring(rotateY, spring);
  const transform = useTransform(
    [springRotateX, springRotateY],
    ([rx, ry]: number[]) =>
      `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`
  );

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * maxTilt);
    rotateY.set(px * maxTilt);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ transformStyle: "preserve-3d", transform }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}

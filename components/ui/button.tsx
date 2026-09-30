"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import Link from "next/link";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "gold" | "dark";

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors";

// Tombol emas: bg-amber-500 + teks zinc-900 (bukan putih) sesuai aturan kontras.
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  ghost: "border border-stone-200 text-zinc-900 hover:bg-stone-100",
  gold: "bg-amber-500 text-zinc-900 hover:bg-amber-400",
  // dark = tombol gelap untuk dipakai di atas surface putih terang.
  dark: "bg-zinc-900 text-white hover:bg-zinc-800",
};

// Magnetic micro-physics (SKILL.md §4): posisi disimpan di MotionValue,
// BUKAN useState, sehingga gerakan kursor tidak memicu re-render React.
// Hanya aktif untuk mouse — sentuhan di mobile diabaikan.
function useMagnetic(strength = 0.2) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { style: { x: springX, y: springY }, onPointerMove, onPointerLeave };
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const magnetic = useMagnetic();

  return (
    <motion.button
      {...props}
      style={magnetic.style}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      className={cn(baseClasses, variantClasses[variant], className)}
    />
  );
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

// Varian navigasi: Link Next.js dibungkus motion.span agar tetap
// prefetch/client-side routing, sambil mendapat efek magnetic + tactile.
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: ButtonLinkProps) {
  const magnetic = useMagnetic();

  return (
    <motion.span
      className="inline-flex"
      style={magnetic.style}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      whileTap={{ scale: 0.98 }}
      transition={spring}
    >
      <Link
        href={href}
        className={cn(baseClasses, variantClasses[variant], className)}
      >
        {children}
      </Link>
    </motion.span>
  );
}

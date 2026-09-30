"use client";

import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { memo, useCallback, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type RippleButtonStatus = "idle" | "loading" | "success" | "error";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleButtonProps extends HTMLMotionProps<"button"> {
  status?: RippleButtonStatus;
  variant?: "primary" | "gold" | "ghost" | "dark";
  successLabel?: string;
  errorLabel?: string;
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

const variantClasses: Record<
  NonNullable<RippleButtonProps["variant"]>,
  string
> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  gold: "bg-amber-500 text-zinc-900 hover:bg-amber-400",
  ghost: "border border-stone-200 text-zinc-900 hover:bg-stone-100",
  dark: "bg-zinc-900 text-white hover:bg-zinc-800",
};

// Ring ripple: efek gelombang dari titik klik. Diisolasi + memo agar
// animasi ekspansi tidak memicu re-render seluruh tombol (SKILL.md §4/§9).
const RippleRing = memo(function RippleRing({ ripple }: { ripple: Ripple }) {
  return (
    <motion.span
      key={ripple.id}
      initial={{ scale: 0, opacity: 0.35 }}
      animate={{ scale: 1, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      className="pointer-events-none absolute rounded-full bg-white/40"
      style={{
        left: ripple.x,
        top: ripple.y,
        width: ripple.size,
        height: ripple.size,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
});

export default function RippleButton({
  status = "idle",
  variant = "primary",
  successLabel = "Sent",
  errorLabel = "Failed",
  className,
  children,
  onPointerDown,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const spawnRipple = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const id = Date.now() + Math.random();
    setRipples((prev) => [
      ...prev,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top, size },
    ]);
  }, []);

  const label =
    status === "loading"
      ? "Sending"
      : status === "success"
      ? successLabel
      : status === "error"
      ? errorLabel
      : (children as string);

  return (
    <motion.button
      {...props}
      whileTap={{ scale: 0.98 }}
      transition={spring}
      onPointerDown={(e) => {
        spawnRipple(e);
        onPointerDown?.(e);
      }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors",
        variantClasses[variant],
        status === "success" &&
          "bg-emerald-500 text-zinc-900 hover:bg-emerald-500",
        status === "error" && "bg-red-500 text-white hover:bg-red-500",
        className
      )}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <RippleRing key={ripple.id} ripple={ripple} />
        ))}
      </AnimatePresence>

      {/* Isi tombol morph mengikuti status, tanpa lompatan layout. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={spring}
          className="inline-flex items-center gap-2"
        >
          {status === "loading" ? (
            <motion.span
              aria-hidden="true"
              className="size-4 rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : null}
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

"use client";

import { motion, type Variants } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Deteksi "sudah hydrate" tanpa useEffect setState (lolos react-hooks/set-state-in-effect).
// getSnapshot mengembalikan true di klien setelah hydration, false di server.
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Stagger WAJIB (AGENTS §ATURAN DESAIN). Parent (variants) dan children
// (StaggerItem) berada di Client Component tree yang sama (SKILL §4).
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
}

// Container grid. Children TIDAK dibungkus lagi di sini — StaggerItem-lah
// yang menjadi grid item, sehingga col-span dari parent benar-benar berlaku.
//
// CATATAN HYDRATION: initial="hidden" menulis inline opacity:0 ke HTML server.
// useSyncExternalStore memastikan render pertama klien identik dengan server
// (initial=false → tanpa inline opacity), lalu animasi "show" baru berjalan
// setelah hydration selesai. Ini menghilangkan hydration mismatch sepenuhnya.
export default function StaggerGrid({ children, className }: StaggerGridProps) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  return (
    <motion.div
      variants={container}
      initial={false}
      animate={hydrated ? "show" : undefined}
      className={cn("grid gap-6", className)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

// Grid item + unit stagger. className dipakai untuk col-span (mis. md:col-span-7).
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={item} className={cn("h-full", className)}>
      {children}
    </motion.div>
  );
}

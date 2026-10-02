import type { Transition, Variants } from "framer-motion";

// ============================================================
// Motion choreography (SKILL.md §15)
// Sumber tunggal nilai transisi agar konsisten di seluruh app.
// Semua pakai spring physics (bukan linear/ease bawaan) sesuai
// MOTION_INTENSITY 6. JANGAN animate top/left/width/height — hanya
// transform & opacity agar tetap 60fps.
// ============================================================

/** Spring standar untuk interaksi UI (hover, tap, enter). */
export const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

/** Spring lebih cepat untuk micro-interaction (badge, dot, toggle). */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
};

/** Fade + naik: transisi masuk elemen standar. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: spring },
};

/** Container dengan stagger anak — untuk grid/list (SKILL.md §15). */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Mask reveal per baris headline (SKILL.md §8 text mask). */
export const lineMask: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: spring },
};

/** Durasi bernama (SKILL.md §15) — dipakai untuk transisi non-spring
 *  seperti progress bar atau crossfade gambar. */
export const durations = {
  instant: 0.1,
  quick: 0.2,
  standard: 0.35,
  slow: 0.6,
  cinematic: 1.2,
} as const;

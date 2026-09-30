"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FacebookLogo,
  InstagramLogo,
  TiktokLogo,
} from "@phosphor-icons/react/dist/ssr";
import { memo, useState, type ComponentType } from "react";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/motion/magnetic";

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

interface SocialLink {
  label: string;
  href: string;
  hint: string;
  Icon: ComponentType<{ size?: number; weight?: "regular" | "fill" | "bold" }>;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/digimuda.showroom",
    hint: "@digimuda.showroom",
    Icon: InstagramLogo,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/digimudashowroom",
    hint: "Digimuda ShowRoom",
    Icon: FacebookLogo,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@digimuda.showroom",
    hint: "@digimuda.showroom",
    Icon: TiktokLogo,
  },
];

function SocialItem({
  link,
  index,
  shouldReduce,
}: {
  link: SocialLink;
  index: number;
  shouldReduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const { Icon, label, href, hint } = link;

  return (
    <motion.li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={shouldReduce ? undefined : { y: [0, -3, 0] }}
      transition={
        shouldReduce
          ? undefined
          : {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.35,
            }
      }
      className="relative"
    >
      {/* Tooltip: muncul dari kiri icon */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={spring}
            className={cn(
              "pointer-events-none absolute right-full top-1/2 mr-3",
              "-translate-y-1/2 whitespace-nowrap",
              "rounded-full border border-amber-500/25 bg-zinc-900/95",
              "px-3 py-1.5 text-[11px] font-medium tracking-tight text-amber-100",
              "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-sm"
            )}
          >
            {hint}
          </motion.span>
        )}
      </AnimatePresence>

      <Magnetic strength={0.4}>
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow Digimuda ShowRoom on ${label}`}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={spring}
          className={cn(
            "group relative flex size-12 items-center justify-center",
            "rounded-full border border-amber-500/40 bg-zinc-900",
            "text-amber-500 transition-colors duration-300",
            "hover:border-amber-500/80 hover:text-amber-400",
            "will-change-transform"
          )}
        >
          {/* Expanding ring saat hover — scale + opacity */}
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={
              hovered
                ? { scale: [1, 1.35], opacity: [0.5, 0] }
                : { scale: 1, opacity: 0 }
            }
            transition={
              hovered
                ? { duration: 1.6, repeat: Infinity, ease: "easeOut" }
                : { duration: 0.3 }
            }
            className="pointer-events-none absolute inset-0 rounded-full border border-amber-400/60"
          />

          {/* Conic shimmer border — hanya tampil saat hover */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full opacity-0",
              "transition-opacity duration-500 group-hover:opacity-100"
            )}
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(245,158,11,0.4) 90deg, transparent 200deg, rgba(245,158,11,0.25) 300deg, transparent 360deg)",
              mask: "radial-gradient(circle, transparent 52%, black 56%)",
              WebkitMask: "radial-gradient(circle, transparent 52%, black 56%)",
            }}
          />

          {/* Icon dibungkus span — karena versi SSR tidak terima className */}
          <span
            className={cn(
              "relative z-10 transition-transform duration-300",
              "group-hover:scale-105"
            )}
          >
            <Icon size={20} weight="regular" />
          </span>
        </motion.a>
      </Magnetic>
    </motion.li>
  );
}

function SocialDockBase() {
  const shouldReduce = useReducedMotion() ?? false;

  return (
    <ul className="flex flex-col items-center gap-3">
      {SOCIAL_LINKS.map((link, index) => (
        <SocialItem
          key={link.label}
          link={link}
          index={index}
          shouldReduce={shouldReduce}
        />
      ))}
    </ul>
  );
}

export default memo(SocialDockBase);

"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import Magnetic from "@/components/motion/magnetic";
import PulseGlow from "@/components/motion/pulse-glow";
import { cn } from "@/lib/utils";

const links = [
  { href: "/cars", label: "Stock" },
  { href: "/club", label: "Club" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

// Navbar floating pill gelap di atas background cream.
// Desktop (md+): logo + link + CTA. Mobile: logo + hamburger -> dropdown
// berisi link + CTA. Menu ditutup otomatis saat pindah rute.
// Enhancement Step 1: shrink saat scroll, magnetic link, pill aktif
// berpindah (layoutId), dan CTA pulse glow.
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Shrink on scroll: di atas 50px pill mengecil (scale) halus.
  const { scrollY } = useScroll();
  const rawScale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const scale = useSpring(rawScale, spring);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="w-full max-w-[1400px]">
        {/* Pill utama — scale halus mengikuti scroll */}
        <motion.div
          style={{ scale }}
          className="flex items-center justify-between rounded-full border border-white/10 bg-zinc-900 py-2 pl-6 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_-15px_rgba(0,0,0,0.25)]"
        >
          <Magnetic strength={0.2}>
            <Link
              href="/"
              className="text-sm font-semibold tracking-tighter text-white"
            >
              Digimuda <span className="text-amber-500">ShowRoom</span>
            </Link>
          </Magnetic>

          {/* Link desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Magnetic key={link.href} strength={0.2}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm tracking-tight transition-colors",
                      active
                        ? "text-zinc-900"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {/* Shared-element pill: berpindah halus antar link aktif */}
                    {active && (
                      <motion.span
                        layoutId="navbar-active-pill"
                        transition={spring}
                        className="absolute inset-0 rounded-full bg-amber-500"
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                </Magnetic>
              );
            })}
          </div>

          {/* CTA desktop — pulse glow */}
          <PulseGlow className="hidden md:inline-flex">
            <ButtonLink href="/contact" variant="gold" className="px-5 py-2.5">
              Book a Viewing
            </ButtonLink>
          </PulseGlow>

          {/* Tombol hamburger (mobile) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-[0.98] md:hidden"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </motion.div>

        {/* Dropdown mobile */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={spring}
              onClick={() => setOpen(false)}
              className="mt-2 flex flex-col gap-1 rounded-[2rem] border border-white/10 bg-zinc-900 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_-15px_rgba(0,0,0,0.25)] md:hidden"
            >
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-5 py-3 text-sm tracking-tight transition-colors",
                      active
                        ? "bg-amber-500 text-zinc-900"
                        : "text-zinc-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <ButtonLink
                href="/contact"
                variant="gold"
                className="mt-1 w-full justify-center py-3"
              >
                Book a Viewing
              </ButtonLink>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

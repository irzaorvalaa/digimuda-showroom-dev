"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/cars", label: "Stock" },
  { href: "/club", label: "Club" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

// Navbar floating pill gelap di atas background cream.
// Link tersembunyi di mobile (<md) — CTA tetap tampil.
export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="flex w-full max-w-[1400px] items-center justify-between rounded-full bg-zinc-900 py-2 pl-6 pr-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)]">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tighter text-white"
        >
          Digimuda <span className="text-amber-400">ShowRoom</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm tracking-tight transition-colors",
                pathname === link.href
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <motion.div
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <Link
            href="/contact"
            className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-medium tracking-tight text-zinc-900"
          >
            Book a Viewing
          </Link>
        </motion.div>
      </nav>
    </motion.header>
  );
}

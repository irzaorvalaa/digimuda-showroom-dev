"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS, type AdminRole } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

interface AdminNavProps {
  role: AdminRole;
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

// Navigasi internal area admin: pill gelap melayang, link aktif dengan
// shared-element pill (layoutId) — konsisten dengan navbar publik.
// Role ditampilkan sebagai badge; admin biasa tidak melihat menu yang
// butuh super_admin (link tetap ada, tapi halamannya redirect).
export default function AdminNav({ role }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="flex w-full max-w-[1400px] items-center justify-between gap-4 rounded-full border border-white/10 bg-zinc-900/90 py-2 pl-6 pr-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_-15px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <Link
          href="/admin"
          className="text-sm font-semibold tracking-tighter text-white"
        >
          Digimuda <span className="text-amber-500">Admin</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {ADMIN_NAV_ITEMS.map((item) => {
            // /admin/cars/new harus tetap menandai "Cars" sebagai aktif.
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm tracking-tight transition-colors",
                  active ? "text-zinc-900" : "text-zinc-400 hover:text-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="admin-active-pill"
                    transition={spring}
                    className="absolute inset-0 rounded-full bg-amber-500"
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <span
          className={cn(
            "hidden shrink-0 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] md:inline-block",
            role === "super_admin"
              ? "bg-amber-500/15 text-amber-400"
              : "bg-white/10 text-zinc-400"
          )}
        >
          {role === "super_admin" ? "Super admin" : "Admin"}
        </span>
      </nav>

      {/* Nav mobile: baris link di bawah pill (anti horizontal scroll). */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="absolute inset-x-4 top-16 flex flex-wrap gap-1 rounded-[2rem] border border-white/10 bg-zinc-900/95 p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] backdrop-blur-xl md:hidden"
        >
          {ADMIN_NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm tracking-tight transition-colors",
                  active
                    ? "bg-amber-500 text-zinc-900"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.header>
  );
}

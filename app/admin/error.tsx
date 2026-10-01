"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/button";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Error boundary dashboard (Client Component). Tombol retry memanggil
// reset(); bila session bermasalah, link ke halaman login.
export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <main className="min-h-[100dvh] px-4 pb-24 pt-24 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start gap-4 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:p-12">
          <span className="flex size-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <WarningCircle size={22} />
          </span>
          <div>
            <p className="text-base font-medium tracking-tight text-zinc-100">
              Dashboard unavailable
            </p>
            <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-zinc-400">
              We could not load the inventory data. Try again, or sign in again
              if your session has expired.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={reset}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="rounded-full bg-amber-500 px-6 py-3 text-sm font-medium tracking-tight text-zinc-900 transition-colors hover:bg-amber-400"
            >
              Try again
            </motion.button>
            <ButtonLink href="/auth/login" variant="ghost">
              Back to sign in
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}

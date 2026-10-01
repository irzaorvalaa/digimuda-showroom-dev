"use client";

import { motion } from "framer-motion";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { useTransition } from "react";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

interface SignOutButtonProps {
  className?: string;
}

// Tombol logout memanggil Server Action signOut(). Pakai useTransition
// agar tombol tetap responsif (pending) tanpa state tambahan.
export default function SignOutButton({ className }: SignOutButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <motion.button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={spring}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium tracking-tight text-zinc-600 transition-colors hover:border-stone-300 hover:bg-stone-100 hover:text-zinc-900",
        pending && "opacity-60",
        className
      )}
    >
      <SignOut size={16} />
      {pending ? "Signing out" : "Sign out"}
    </motion.button>
  );
}

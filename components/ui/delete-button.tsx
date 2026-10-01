"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { useActionState, useTransition } from "react";

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

interface DeleteButtonProps {
  // Server Action yang menerima id (deleteCarAction / deleteBrandAction / ...).
  action: (id: string) => Promise<void>;
  id: string;
  /** Nama entitas untuk teks konfirmasi, mis. "Bentley Continental GT". */
  label: string;
}

// Tombol hapus dengan konfirmasi inline (mencegah click jago-jago).
// AnimatePresence dipakai untuk morph antara ikon → konfirmasi → loading.
export default function DeleteButton({ action, id, label }: DeleteButtonProps) {
  const [pending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    async () => {
      await action(id);
      return { ok: true };
    },
    { ok: false }
  );

  return (
    <form action={formAction}>
      <AnimatePresence mode="wait" initial={false}>
        {pending ? (
          <motion.span
            key="pending"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs text-zinc-500"
          >
            <motion.span
              aria-hidden="true"
              className="size-3.5 rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            Removing
          </motion.span>
        ) : state.ok ? null : (
          <motion.span
            key="confirm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring}
            className="inline-flex items-center gap-2"
          >
            <span className="font-mono text-xs text-zinc-600">Remove?</span>
            <button
              type="submit"
              onClick={(event) => {
                event.preventDefault();
                startTransition(() => formAction());
              }}
              aria-label={`Remove ${label}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/20"
            >
              <Trash size={13} />
              Delete
            </button>
          </motion.span>
        )}
      </AnimatePresence>
    </form>
  );
}

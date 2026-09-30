"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, LinkSimple } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";

interface ShareButtonProps {
  /** Teks yang disalin ke clipboard (URL lengkap halaman detail). */
  url: string;
  label?: string;
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

// Tombol bagikan dengan morph state (SKILL.md §4 "Morphing Modal" &
// §5 tactile feedback): ikon link berubah jadi centang saat URL berhasil
// disalin, lalu kembali setelah 2 detik. Feedback teks "Copied" muncul
// dengan spring overshoot. Hanya transform/opacity (60fps).
export default function ShareButton({
  url,
  label = "Share",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Bersihkan timeout saat unmount (SKILL.md §10 cleanup).
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback untuk konteks non-secure: execCommand lama.
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-stone-300 hover:text-zinc-900 active:scale-[0.98]"
    >
      <span className="relative flex size-4 items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={spring}
            >
              <Check size={16} weight="bold" className="text-emerald-600" />
            </motion.span>
          ) : (
            <motion.span
              key="link"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={spring}
            >
              <LinkSimple size={16} weight="bold" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "share"}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -6, opacity: 0 }}
          transition={spring}
        >
          {copied ? "Copied" : label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

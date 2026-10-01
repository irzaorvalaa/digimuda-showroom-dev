"use client";

import { useActionState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "@phosphor-icons/react/dist/ssr";
import Input from "@/components/ui/input";
import RippleButton from "@/components/motion/ripple-button";
import { signIn, type SignInState } from "@/app/auth/actions";

// Pesan awal state (React 19: useActionState butuh initial state).
const initialState: SignInState = { ok: false };

// Spring physics standar proyek (stiffness 100, damping 20).
const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  // Status tombol: saat pending -> loading, berhasil -> success, gagal -> error.
  const buttonStatus = useMemo(() => {
    if (pending) return "loading" as const;
    if (state.ok) return "success" as const;
    if (state.error) return "error" as const;
    return "idle" as const;
  }, [pending, state.ok, state.error]);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={spring}
      // Glassmorphism premium: panel semi-transparan + inner border
      // (SKILL.md §4 "Liquid Glass") + shadow dalam.
      className="relative flex flex-col gap-6 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl md:p-10"
    >
      {/* Inner highlight diagonal — efek refraksi tepi kaca. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent"
      />

      <div className="relative flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <Lock size={18} weight="fill" />
        </span>
        <div>
          <p className="text-sm font-medium tracking-tight text-zinc-100">
            Curator sign in
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Digimuda ShowRoom
          </p>
        </div>
      </div>

      <div className="relative flex flex-col gap-5">
        <Input
          label="Email"
          name="email"
          type="email"
          tone="dark"
          placeholder="curator@digimuda-showroom.com"
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          tone="dark"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {/* Feedback error morph tanpa lompatan layout (AnimatePresence). */}
      <AnimatePresence mode="wait" initial={false}>
        {state.error ? (
          <motion.p
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={spring}
            className="relative rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {state.error}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <RippleButton
        type="submit"
        variant="gold"
        status={buttonStatus}
        successLabel="Welcome back"
        errorLabel="Try again"
        disabled={pending}
        className="relative w-full justify-center py-3.5"
      >
        Sign in
      </RippleButton>
    </motion.form>
  );
}

"use client";

import { useActionState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/components/ui/input";
import RippleButton from "@/components/motion/ripple-button";
import { submitInquiry, type SubmitInquiryState } from "@/app/contact/actions";

interface ContactFormProps {
  carId?: string;
}

// Pesan awal state (react 19: useActionState butuh initial state).
const initialState: SubmitInquiryState = { ok: false };

// Spring physics standar proyek (stiffness 100, damping 20).
const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

export default function ContactForm({ carId }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState
  );

  // Status tombol: saat pending -> loading, berhasil -> success, gagal -> error.
  const buttonStatus = useMemo(() => {
    if (pending) return "loading" as const;
    if (state.ok) return "success" as const;
    if (state.error) return "error" as const;
    return "idle" as const;
  }, [pending, state.ok, state.error]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-[2.5rem] bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] md:p-10"
    >
      {/* Honeypot: disembunyikan dari manusia, diisi bot otomatis */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {carId ? <input type="hidden" name="car_id" value={carId} /> : null}

      <Input
        label="Full name"
        name="full_name"
        type="text"
        placeholder="Alexandra Vierra"
        autoComplete="name"
        required
      />

      <Input
        label="WhatsApp number"
        name="whatsapp"
        type="tel"
        placeholder="+62 812 3456 7890"
        autoComplete="tel"
        required
        helperText="We reply via WhatsApp within one business day."
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-sm font-medium tracking-tight text-zinc-900"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us which model you're interested in."
          className="w-full rounded-2xl border border-stone-200/60 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        />
      </div>

      {/* Feedback error/success morph tanpa lompatan layout (AnimatePresence). */}
      <AnimatePresence mode="wait" initial={false}>
        {state.error ? (
          <motion.p
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={spring}
            className="text-sm text-red-600"
          >
            {state.error}
          </motion.p>
        ) : state.ok ? (
          <motion.p
            key="success"
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={spring}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700"
          >
            Thank you. Your inquiry has been sent — we will be in touch shortly.
          </motion.p>
        ) : null}
      </AnimatePresence>

      <RippleButton
        type="submit"
        variant="gold"
        status={buttonStatus}
        successLabel="Inquiry sent"
        errorLabel="Try again"
        disabled={pending || state.ok}
        className="w-full md:w-auto md:self-start"
      >
        Send inquiry
      </RippleButton>
    </form>
  );
}

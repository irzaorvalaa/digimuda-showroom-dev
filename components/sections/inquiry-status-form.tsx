"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import {
  updateInquiryStatusAction,
  type InquiryState,
} from "@/app/admin/inquiries/actions";
import { cn } from "@/lib/utils";

interface InquiryStatusFormProps {
  id: string;
  status: "new" | "contacted" | "closed";
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

const options: { value: "new" | "contacted" | "closed"; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

// Update status inquiry inline (tanpa pindah halaman). Submit revalidate
// path lewat Server Action, sehingga daftar inquiry langsung segar.
export default function InquiryStatusForm({
  id,
  status,
}: InquiryStatusFormProps) {
  // Elemen ketiga useActionState adalah flag pending (React 19).
  const [state, formAction, pending] = useActionState(
    updateInquiryStatusAction,
    { ok: false } as InquiryState
  );

  return (
    <form action={formAction} className="flex flex-col gap-2 md:items-end">
      <input type="hidden" name="id" value={id} />

      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            name="status"
            defaultValue={status}
            disabled={pending}
            aria-label="Inquiry status"
            className="appearance-none rounded-full border border-white/10 bg-white/[0.04] py-2 pl-4 pr-9 font-mono text-xs text-zinc-200 transition-colors hover:border-white/20 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-zinc-900"
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Chevron manual karena appearance-none (bukan emoji). */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 border-b border-r border-zinc-500 rotate-45"
          />
        </div>

        <motion.button
          type="submit"
          disabled={pending}
          whileTap={{ scale: 0.98 }}
          transition={spring}
          className={cn(
            "rounded-full px-4 py-2 font-mono text-xs font-medium transition-colors",
            pending
              ? "bg-white/5 text-zinc-600"
              : "bg-amber-500 text-zinc-900 hover:bg-amber-400"
          )}
        >
          {pending ? "Saving" : "Set"}
        </motion.button>
      </div>

      {state.error ? (
        <p role="alert" className="font-mono text-xs text-red-400">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

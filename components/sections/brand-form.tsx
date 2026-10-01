"use client";

import { useActionState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/components/ui/input";
import RippleButton from "@/components/motion/ripple-button";
import {
  createBrandAction,
  updateBrandAction,
  type BrandFormState,
} from "@/app/admin/brands/actions";
import type { Tables } from "@/types/database";

interface BrandFormProps {
  brand?: Tables<"brands">;
}

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

const initialState: BrandFormState = { ok: false };

// Form create/edit brand. Slug dipakai untuk filter & URL (unique di DB).
export default function BrandForm({ brand }: BrandFormProps) {
  const isEdit = Boolean(brand);

  const [state, formAction, pending] = useActionState(
    async (prevState: BrandFormState, formData: FormData) => {
      if (isEdit && brand)
        return updateBrandAction(brand.id, prevState, formData);
      return createBrandAction(prevState, formData);
    },
    initialState
  );

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
      className="flex flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl md:p-10"
    >
      <Input
        label="Brand name"
        name="name"
        tone="dark"
        defaultValue={brand?.name}
        placeholder="Bentley"
        error={state.fieldErrors?.name}
        required
      />

      <Input
        label="Slug"
        name="slug"
        tone="dark"
        defaultValue={brand?.slug}
        placeholder="bentley"
        helperText="Lowercase, numbers, hyphens."
        error={state.fieldErrors?.slug}
        required
      />

      <Input
        label="Logo URL"
        name="logo_url"
        tone="dark"
        defaultValue={brand?.logo_url ?? ""}
        placeholder="/images/brands/bentley.svg"
        helperText="Optional. Shown next to the brand name."
        error={state.fieldErrors?.logo_url}
      />

      <AnimatePresence mode="wait" initial={false}>
        {state.error ? (
          <motion.p
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={spring}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {state.error}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <RippleButton
        type="submit"
        variant="gold"
        status={buttonStatus}
        successLabel="Saved"
        errorLabel="Try again"
        disabled={pending}
        className="w-full md:w-auto md:self-start"
      >
        {isEdit ? "Save brand" : "Add brand"}
      </RippleButton>
    </motion.form>
  );
}
